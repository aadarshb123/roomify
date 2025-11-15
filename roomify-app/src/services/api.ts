import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  query, 
  where, 
  limit as firestoreLimit,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

// ==================== USER API ====================

export interface User {
  id: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  bio?: string;
  stylePreferences?: string[];
  preferences?: Record<string, any>;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface CreateUserData {
  displayName?: string;
  email?: string;
  photoURL?: string;
  preferences?: Record<string, any>;
}

/**
 * Get user's search history
 */
export async function getSearchHistory(): Promise<string[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    return userData.searchHistory || [];
  } catch (error) {
    console.error('Error fetching search history:', error);
    return [];
  }
}

/**
 * Save search history for user
 */
export async function saveSearchHistory(history: string[]): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    await setDoc(
      doc(db, 'users', user.uid),
      {
        searchHistory: history.slice(0, 10), // Limit to 10 items
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving search history:', error);
    throw error;
  }
}

/**
 * Update user bio
 */
export async function updateUserBio(bio: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    await setDoc(
      doc(db, 'users', user.uid),
      {
        bio,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user bio:', error);
    throw error;
  }
}

/**
 * Update user style preferences
 */
export async function updateUserStylePreferences(stylePreferences: string[]): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    await setDoc(
      doc(db, 'users', user.uid),
      {
        stylePreferences,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating style preferences:', error);
    throw error;
  }
}

/**
 * Get following count for current user
 */
export async function getFollowingCount(): Promise<number> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return 0;
    }

    const followsQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', user.uid)
    );

    const followsSnapshot = await getDocs(followsQuery);
    return followsSnapshot.docs.length;
  } catch (error) {
    console.error('Error getting following count:', error);
    return 0;
  }
}

/**
 * Get follower count for current user
 */
export async function getFollowerCount(): Promise<number> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return 0;
    }

    const followsQuery = query(
      collection(db, 'follows'),
      where('followingId', '==', user.uid)
    );

    const followsSnapshot = await getDocs(followsQuery);
    return followsSnapshot.docs.length;
  } catch (error) {
    console.error('Error getting follower count:', error);
    return 0;
  }
}

/**
 * Follow a user
 */
export async function followUser(userId: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (user.uid === userId) {
      throw new Error('Cannot follow yourself');
    }

    // Check if already following
    const existingFollowQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', user.uid),
      where('followingId', '==', userId)
    );

    const existingFollowSnapshot = await getDocs(existingFollowQuery);
    if (existingFollowSnapshot.docs.length > 0) {
      return; // Already following
    }

    // Create follow relationship
    const followData = {
      followerId: user.uid,
      followingId: userId,
      createdAt: serverTimestamp(),
    };

    const newFollowRef = doc(collection(db, 'follows'));
    await setDoc(newFollowRef, followData);
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
}

/**
 * Unfollow a user
 */
export async function unfollowUser(userId: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Find and delete follow relationship
    const followQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', user.uid),
      where('followingId', '==', userId)
    );

    const followSnapshot = await getDocs(followQuery);
    if (followSnapshot.docs.length === 0) {
      return; // Not following
    }

    // Delete all follow documents (should only be one)
    const deletePromises = followSnapshot.docs.map(docSnap => deleteDoc(doc(db, 'follows', docSnap.id)));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
}

/**
 * Check if current user is following another user
 */
export async function isFollowing(userId: string): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return false;
    }

    const followQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', user.uid),
      where('followingId', '==', userId)
    );

    const followSnapshot = await getDocs(followQuery);
    return followSnapshot.docs.length > 0;
  } catch (error) {
    console.error('Error checking if following:', error);
    return false;
  }
}

/**
 * Get list of users that current user is following
 */
export async function getFollowingList(): Promise<User[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    const followsQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', user.uid)
    );

    const followsSnapshot = await getDocs(followsQuery);
    const followingIds = followsSnapshot.docs.map(doc => doc.data().followingId);

    if (followingIds.length === 0) {
      return [];
    }

    // Fetch user data for each following ID
    const userPromises = followingIds.map(userId => getUser(userId));
    const users = await Promise.all(userPromises);
    
    return users.filter((user): user is User => user !== null);
  } catch (error) {
    console.error('Error getting following list:', error);
    return [];
  }
}

/**
 * Get list of users following the current user
 */
export async function getFollowerList(): Promise<User[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    const followsQuery = query(
      collection(db, 'follows'),
      where('followingId', '==', user.uid)
    );

    const followsSnapshot = await getDocs(followsQuery);
    const followerIds = followsSnapshot.docs.map(doc => doc.data().followerId);

    if (followerIds.length === 0) {
      return [];
    }

    // Fetch user data for each follower ID
    const userPromises = followerIds.map(userId => getUser(userId));
    const users = await Promise.all(userPromises);
    
    return users.filter((user): user is User => user !== null);
  } catch (error) {
    console.error('Error getting follower list:', error);
    return [];
  }
}

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return null;
    }

    return {
      id: userDoc.id,
      ...userDoc.data(),
    } as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * Create or update user
 */
export async function createOrUpdateUser(data: CreateUserData): Promise<User> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userExists = userDoc.exists();

    const userData: any = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    // If user doesn't exist, set createdAt
    if (!userExists) {
      userData.createdAt = serverTimestamp();
    }

    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

    return {
      id: user.uid,
      ...userData,
    } as User;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

// ==================== ROOM API ====================

export interface Room {
  id: string;
  title: string;
  uri: string;
  roomType?: string;
  color?: string;
  style?: string;
  description?: string;
  userId?: string;
  editorPick?: boolean;
  editorPickMonth?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface RoomsResponse {
  rooms: Room[];
  count: number;
}

export interface GetRoomsParams {
  roomType?: string;
  color?: string;
  style?: string;
  limit?: number;
}

export interface CreateRoomData {
  title: string;
  uri: string;
  roomType?: string;
  color?: string;
  style?: string;
  description?: string;
  userId?: string;
}

/**
 * Get all rooms with optional filters
 */
export async function getRooms(params?: GetRoomsParams): Promise<RoomsResponse> {
  try {
    let snapshot;
    
    // Try with orderBy first, fallback if index is missing
    try {
      let q = query(collection(db, 'rooms'), orderBy('createdAt', 'desc'));

      // Apply filters
      if (params?.roomType) {
        q = query(q, where('roomType', '==', params.roomType));
      }
      if (params?.color) {
        q = query(q, where('color', '==', params.color));
      }
      if (params?.style) {
        q = query(q, where('style', '==', params.style));
      }
      if (params?.limit) {
        q = query(q, firestoreLimit(params.limit));
      }

      snapshot = await getDocs(q);
    } catch (error: any) {
      // If orderBy fails (missing index), try without it
      if (error.message?.includes('index') || error.code === 'failed-precondition') {
        console.warn('⚠️ Index missing, querying without orderBy:', error.message);
        
        let q = query(collection(db, 'rooms'));

        // Apply filters
        if (params?.roomType) {
          q = query(q, where('roomType', '==', params.roomType));
        }
        if (params?.color) {
          q = query(q, where('color', '==', params.color));
        }
        if (params?.style) {
          q = query(q, where('style', '==', params.style));
        }
        if (params?.limit) {
          q = query(q, firestoreLimit(params.limit));
        }

        snapshot = await getDocs(q);
      } else {
        throw error;
      }
    }

    const rooms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Room[];

    // Sort by createdAt client-side if we didn't use orderBy
    if (rooms.length > 0 && !params?.roomType && !params?.color && !params?.style) {
      rooms.sort((a, b) => {
        const aDate = a.createdAt instanceof Date ? a.createdAt : (a.createdAt as any)?.toDate?.() || new Date(0);
        const bDate = b.createdAt instanceof Date ? b.createdAt : (b.createdAt as any)?.toDate?.() || new Date(0);
        return bDate.getTime() - aDate.getTime();
      });
    }

    return {
      rooms,
      count: rooms.length,
    };
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
}

/**
 * Delete a room (only if user is the owner)
 */
export async function deleteRoom(roomId: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the room first to check ownership
    const roomDoc = await getDoc(doc(db, 'rooms', roomId));
    if (!roomDoc.exists()) {
      throw new Error('Room not found');
    }

    const roomData = roomDoc.data();
    if (roomData.userId !== user.uid) {
      throw new Error('Unauthorized: You can only delete your own rooms');
    }

    // Delete the room
    await deleteDoc(doc(db, 'rooms', roomId));

    // Optionally: Clean up associated data (likes, comments, saves)
    // Note: This is optional - Firestore security rules can handle orphaned data
    // or you can use Cloud Functions to clean up
    
    // Delete all likes for this room
    try {
      const likesQuery = query(
        collection(db, 'likes'),
        where('roomId', '==', roomId)
      );
      const likesSnapshot = await getDocs(likesQuery);
      const deleteLikesPromises = likesSnapshot.docs.map(docSnap => deleteDoc(doc(db, 'likes', docSnap.id)));
      await Promise.all(deleteLikesPromises);
    } catch (error) {
      console.warn('Error deleting likes:', error);
      // Continue even if this fails
    }

    // Delete all comments for this room
    try {
      const commentsQuery = query(
        collection(db, 'comments'),
        where('roomId', '==', roomId)
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const deleteCommentsPromises = commentsSnapshot.docs.map(docSnap => deleteDoc(doc(db, 'comments', docSnap.id)));
      await Promise.all(deleteCommentsPromises);
    } catch (error) {
      console.warn('Error deleting comments:', error);
      // Continue even if this fails
    }

    // Delete all saves for this room
    try {
      const savesQuery = query(
        collection(db, 'saves'),
        where('roomId', '==', roomId)
      );
      const savesSnapshot = await getDocs(savesQuery);
      const deleteSavesPromises = savesSnapshot.docs.map(docSnap => deleteDoc(doc(db, 'saves', docSnap.id)));
      await Promise.all(deleteSavesPromises);
    } catch (error) {
      console.warn('Error deleting saves:', error);
      // Continue even if this fails
    }
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
}

/**
 * Get room by ID
 */
export async function getRoom(roomId: string): Promise<Room | null> {
  try {
    const roomDoc = await getDoc(doc(db, 'rooms', roomId));

    if (!roomDoc.exists()) {
      return null;
    }

    return {
      id: roomDoc.id,
      ...roomDoc.data(),
    } as Room;
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
}

/**
 * Create a new room
 */
export async function createRoom(data: CreateRoomData): Promise<Room> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const roomData = {
      ...data,
      userId: data.userId || user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const roomsRef = collection(db, 'rooms');
    const newRoomRef = doc(roomsRef);
    await setDoc(newRoomRef, roomData);

    return {
      id: newRoomRef.id,
      ...roomData,
    } as Room;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
}

// ==================== COMMENTS API ====================

export interface Comment {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Timestamp | Date;
}

export interface CreateCommentData {
  roomId: string;
  text: string;
}

/**
 * Get like count for a room
 */
export async function getLikeCount(roomId: string): Promise<number> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const likesQuery = query(
      collection(db, 'likes'),
      where('roomId', '==', roomId)
    );

    const querySnapshot = await getDocs(likesQuery);
    return querySnapshot.docs.length;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
}

/**
 * Check if current user has liked a room
 */
export async function hasUserLiked(roomId: string): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return false;
    }

    const likeQuery = query(
      collection(db, 'likes'),
      where('roomId', '==', roomId),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(likeQuery);
    return querySnapshot.docs.length > 0;
  } catch (error) {
    console.error('Error checking if user liked:', error);
    return false;
  }
}

/**
 * Toggle like for a room
 */
export async function toggleLike(roomId: string): Promise<{ liked: boolean; count: number }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if already liked
    const likeQuery = query(
      collection(db, 'likes'),
      where('roomId', '==', roomId),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(likeQuery);
    
    if (querySnapshot.docs.length > 0) {
      // Unlike: delete the like document
      const likeDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, 'likes', likeDoc.id));
      
      // Get updated count
      const count = await getLikeCount(roomId);
      return { liked: false, count };
    } else {
      // Like: create a new like document
      const likeData = {
        roomId,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      const newLikeRef = doc(collection(db, 'likes'));
      await setDoc(newLikeRef, likeData);
      
      // Get updated count
      const count = await getLikeCount(roomId);
      return { liked: true, count };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

/**
 * Check if current user has saved a room
 */
export async function hasUserSaved(roomId: string): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return false;
    }

    const saveQuery = query(
      collection(db, 'saves'),
      where('roomId', '==', roomId),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(saveQuery);
    return querySnapshot.docs.length > 0;
  } catch (error) {
    console.error('Error checking if user saved:', error);
    return false;
  }
}

/**
 * Toggle save for a room
 */
export async function toggleSave(roomId: string): Promise<{ saved: boolean }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if already saved
    const saveQuery = query(
      collection(db, 'saves'),
      where('roomId', '==', roomId),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(saveQuery);
    
    if (querySnapshot.docs.length > 0) {
      // Unsave: delete the save document
      const saveDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, 'saves', saveDoc.id));
      return { saved: false };
    } else {
      // Save: create a new save document
      const saveData = {
        roomId,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      const newSaveRef = doc(collection(db, 'saves'));
      await setDoc(newSaveRef, saveData);
      return { saved: true };
    }
  } catch (error) {
    console.error('Error toggling save:', error);
    throw error;
  }
}

/**
 * Collection interface
 */
export interface Collection {
  id: string;
  name: string;
  userId: string;
  roomIds: string[];
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

/**
 * Get all collections for the current user
 */
export async function getCollections(): Promise<Collection[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    const collectionsQuery = query(
      collection(db, 'collections'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(collectionsQuery);
    const collections: Collection[] = [];

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      collections.push({
        id: docSnap.id,
        name: data.name || 'Untitled Collection',
        userId: data.userId,
        roomIds: data.roomIds || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    }

    // Sort by createdAt (most recent first)
    collections.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 
                    (a.createdAt as any)?.seconds ? (a.createdAt as any).seconds * 1000 : 0;
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 
                    (b.createdAt as any)?.seconds ? (b.createdAt as any).seconds * 1000 : 0;
      return bTime - aTime;
    });

    return collections;
  } catch (error) {
    console.error('Error getting collections:', error);
    return [];
  }
}

/**
 * Get rooms in a collection
 */
export async function getCollectionRooms(collectionId: string): Promise<Room[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    const collectionDoc = await getDoc(doc(db, 'collections', collectionId));
    if (!collectionDoc.exists()) {
      return [];
    }

    const collectionData = collectionDoc.data();
    if (collectionData.userId !== user.uid) {
      throw new Error('Unauthorized');
    }

    const roomIds = collectionData.roomIds || [];
    if (roomIds.length === 0) {
      return [];
    }

    // Fetch all rooms in the collection
    const rooms: Room[] = [];
    for (const roomId of roomIds) {
      const room = await getRoom(roomId);
      if (room) {
        rooms.push(room);
      }
    }

    return rooms;
  } catch (error) {
    console.error('Error getting collection rooms:', error);
    return [];
  }
}

/**
 * Create a new collection
 */
export async function createCollection(name: string): Promise<Collection> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const collectionData = {
      name,
      userId: user.uid,
      roomIds: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const newCollectionRef = doc(collection(db, 'collections'));
    await setDoc(newCollectionRef, collectionData);

    return {
      id: newCollectionRef.id,
      name,
      userId: user.uid,
      roomIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
}

/**
 * Add a room to a collection
 */
export async function addRoomToCollection(collectionId: string, roomId: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const collectionDoc = await getDoc(doc(db, 'collections', collectionId));
    if (!collectionDoc.exists()) {
      throw new Error('Collection not found');
    }

    const collectionData = collectionDoc.data();
    if (collectionData.userId !== user.uid) {
      throw new Error('Unauthorized');
    }

    const roomIds = collectionData.roomIds || [];
    if (roomIds.includes(roomId)) {
      return; // Already in collection
    }

    await setDoc(
      doc(db, 'collections', collectionId),
      {
        roomIds: [...roomIds, roomId],
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error adding room to collection:', error);
    throw error;
  }
}

/**
 * Remove a room from a collection
 */
export async function removeRoomFromCollection(collectionId: string, roomId: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const collectionDoc = await getDoc(doc(db, 'collections', collectionId));
    if (!collectionDoc.exists()) {
      throw new Error('Collection not found');
    }

    const collectionData = collectionDoc.data();
    if (collectionData.userId !== user.uid) {
      throw new Error('Unauthorized');
    }

    const roomIds = collectionData.roomIds || [];
    const updatedRoomIds = roomIds.filter((id: string) => id !== roomId);

    await setDoc(
      doc(db, 'collections', collectionId),
      {
        roomIds: updatedRoomIds,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error removing room from collection:', error);
    throw error;
  }
}

/**
 * Delete a collection
 */
export async function deleteCollection(collectionId: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const collectionDoc = await getDoc(doc(db, 'collections', collectionId));
    if (!collectionDoc.exists()) {
      throw new Error('Collection not found');
    }

    const collectionData = collectionDoc.data();
    if (collectionData.userId !== user.uid) {
      throw new Error('Unauthorized');
    }

    await deleteDoc(doc(db, 'collections', collectionId));
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw error;
  }
}

/**
 * Get all rooms created by the current user
 */
export async function getUserCreatedRooms(): Promise<Room[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    // Query rooms where userId matches current user
    let snapshot;
    try {
      let q = query(
        collection(db, 'rooms'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      snapshot = await getDocs(q);
    } catch (error: any) {
      // If orderBy fails (missing index), try without it
      if (error.message?.includes('index') || error.code === 'failed-precondition') {
        console.warn('⚠️ Index missing, querying without orderBy');
        let q = query(
          collection(db, 'rooms'),
          where('userId', '==', user.uid)
        );
        snapshot = await getDocs(q);
      } else {
        throw error;
      }
    }

    const rooms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Room[];

    // Sort by createdAt client-side if we didn't use orderBy
    if (rooms.length > 0) {
      rooms.sort((a, b) => {
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 
                      (a.createdAt as any)?.seconds ? (a.createdAt as any).seconds * 1000 : 0;
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 
                      (b.createdAt as any)?.seconds ? (b.createdAt as any).seconds * 1000 : 0;
        return bTime - aTime;
      });
    }

    return rooms;
  } catch (error) {
    console.error('Error getting user created rooms:', error);
    return [];
  }
}

/**
 * Get all rooms liked by the current user
 */
export async function getUserLikedRooms(): Promise<Room[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    // Get all likes for current user
    const likesQuery = query(
      collection(db, 'likes'),
      where('userId', '==', user.uid)
    );

    const likesSnapshot = await getDocs(likesQuery);
    const roomIds = likesSnapshot.docs.map(doc => doc.data().roomId);

    if (roomIds.length === 0) {
      return [];
    }

    // Fetch all liked rooms
    const rooms: Room[] = [];
    for (const roomId of roomIds) {
      const room = await getRoom(roomId);
      if (room) {
        rooms.push(room);
      }
    }

    // Sort by createdAt (most recent first)
    rooms.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 
                    (a.createdAt as any)?.seconds ? (a.createdAt as any).seconds * 1000 : 0;
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 
                    (b.createdAt as any)?.seconds ? (b.createdAt as any).seconds * 1000 : 0;
      return bTime - aTime;
    });

    return rooms;
  } catch (error) {
    console.error('Error getting user liked rooms:', error);
    return [];
  }
}

/**
 * Get all saved rooms for the current user
 */
export async function getSavedRooms(): Promise<Room[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    const savesQuery = query(
      collection(db, 'saves'),
      where('userId', '==', user.uid)
    );

    const savesSnapshot = await getDocs(savesQuery);
    const roomIds = savesSnapshot.docs.map(doc => doc.data().roomId);

    if (roomIds.length === 0) {
      return [];
    }

    // Fetch all saved rooms
    const rooms: Room[] = [];
    for (const roomId of roomIds) {
      const room = await getRoom(roomId);
      if (room) {
        rooms.push(room);
      }
    }

    // Sort by createdAt (most recent first)
    rooms.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 
                    (a.createdAt as any)?.seconds ? (a.createdAt as any).seconds * 1000 : 0;
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 
                    (b.createdAt as any)?.seconds ? (b.createdAt as any).seconds * 1000 : 0;
      return bTime - aTime;
    });

    return rooms;
  } catch (error) {
    console.error('Error getting saved rooms:', error);
    return [];
  }
}

/**
 * Get comment count for a room (faster than fetching all comments)
 */
export async function getCommentCount(roomId: string): Promise<number> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const commentsQuery = query(
      collection(db, 'comments'),
      where('roomId', '==', roomId)
    );

    const querySnapshot = await getDocs(commentsQuery);
    return querySnapshot.docs.length;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0;
  }
}

/**
 * Get comments for a room
 */
export async function getComments(roomId: string): Promise<Comment[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('🔍 Fetching comments for roomId:', roomId);

    // Try with orderBy first, fallback to just where if index is missing
    let querySnapshot;
    try {
      // Try query with orderBy
      const commentsQuery = query(
        collection(db, 'comments'),
        where('roomId', '==', roomId),
        orderBy('createdAt', 'desc')
      );
      querySnapshot = await getDocs(commentsQuery);
      console.log('📊 Found comments (with orderBy):', querySnapshot.docs.length);
    } catch (error: any) {
      console.warn('⚠️ Query with orderBy failed, trying without orderBy:', error.message);
      // Fallback: query without orderBy (will sort client-side)
      const commentsQuery = query(
        collection(db, 'comments'),
        where('roomId', '==', roomId)
      );
      querySnapshot = await getDocs(commentsQuery);
      console.log('📊 Found comments (without orderBy):', querySnapshot.docs.length);
    }
    
    const comments: Comment[] = [];

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      // Fetch user info for each comment
      let userName = 'User';
      let userAvatar: string | undefined;

      if (data.userId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userName = userData.displayName || 'User';
            userAvatar = userData.photoURL || undefined;
          }
        } catch (error) {
          console.error('Error fetching user for comment:', error);
        }
      }

      comments.push({
        id: docSnap.id,
        roomId: data.roomId,
        userId: data.userId,
        userName,
        userAvatar,
        text: data.text,
        createdAt: data.createdAt || new Date(),
      } as Comment);
      
      console.log('✅ Comment added:', {
        id: docSnap.id,
        roomId: data.roomId,
        text: data.text?.substring(0, 30) + '...',
        createdAt: data.createdAt,
      });
    }

    // Sort by createdAt (always sort to ensure correct order)
    if (comments.length > 0) {
      comments.sort((a, b) => {
        const aDate = a.createdAt instanceof Date ? a.createdAt : (a.createdAt as any)?.toDate?.() || new Date();
        const bDate = b.createdAt instanceof Date ? b.createdAt : (b.createdAt as any)?.toDate?.() || new Date();
        return bDate.getTime() - aDate.getTime();
      });
    }

    console.log('📝 Returning', comments.length, 'comments');
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

/**
 * Create a new comment
 */
export async function createComment(data: CreateCommentData): Promise<Comment> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('💬 Creating comment for roomId:', data.roomId);

    // Get user info
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;

    const commentData = {
      roomId: data.roomId,
      userId: user.uid,
      text: data.text,
      createdAt: serverTimestamp(),
    };

    const newCommentRef = doc(collection(db, 'comments'));
    await setDoc(newCommentRef, commentData);

    console.log('✅ Comment created in Firestore:', {
      id: newCommentRef.id,
      roomId: data.roomId,
      text: data.text.substring(0, 30) + '...',
    });

    // Return comment with current timestamp for immediate display
    // The actual serverTimestamp will be used when fetching from Firestore
    return {
      id: newCommentRef.id,
      roomId: data.roomId,
      userId: user.uid,
      userName: userData?.displayName || 'User',
      userAvatar: userData?.photoURL || undefined,
      text: data.text,
      createdAt: new Date(), // Use current date for immediate display
    } as Comment;
  } catch (error) {
    console.error('❌ Error creating comment:', error);
    throw error;
  }
}

// ==================== FEATURED SECTIONS API ====================

/**
 * Get trending rooms (most liked in last 7 days, or all-time if no recent data)
 */
export async function getTrendingRooms(limit: number = 4): Promise<Room[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get all rooms first
    const allRooms = await getRooms({ limit: 100 });
    
    // Get like counts for each room
    const roomsWithLikes = await Promise.all(
      allRooms.rooms.map(async (room) => {
        const likeCount = await getLikeCount(room.id);
        return { ...room, _likeCount: likeCount };
      })
    );

    // Sort by like count and return top N
    return roomsWithLikes
      .sort((a, b) => (b._likeCount || 0) - (a._likeCount || 0))
      .slice(0, limit)
      .map(({ _likeCount, ...room }) => room);
  } catch (error) {
    console.error('Error getting trending rooms:', error);
    return [];
  }
}

/**
 * Get top creators (users with most rooms)
 */
export async function getTopCreators(limit: number = 4): Promise<Array<{ user: User; roomCount: number; sampleRoom?: Room }>> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get all rooms
    const allRooms = await getRooms({ limit: 200 });
    
    // Group by userId
    const userRoomCounts: Record<string, { count: number; rooms: Room[] }> = {};
    
    allRooms.rooms.forEach((room) => {
      if (room.userId) {
        if (!userRoomCounts[room.userId]) {
          userRoomCounts[room.userId] = { count: 0, rooms: [] };
        }
        userRoomCounts[room.userId].count++;
        userRoomCounts[room.userId].rooms.push(room);
      }
    });

    // Get user details and sort
    const creators = await Promise.all(
      Object.entries(userRoomCounts)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, limit)
        .map(async ([userId, data]) => {
          const userData = await getUser(userId);
          return {
            user: userData,
            roomCount: data.count,
            sampleRoom: data.rooms[0],
          };
        })
    );

    return creators.filter(c => c.user !== null) as Array<{ user: User; roomCount: number; sampleRoom?: Room }>;
  } catch (error) {
    console.error('Error getting top creators:', error);
    return [];
  }
}

/**
 * Get personalized recommendations based on user's liked rooms
 */
export async function getPersonalizedRecommendations(limit: number = 5): Promise<Room[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    // Get user's liked rooms
    const likesQuery = query(
      collection(db, 'likes'),
      where('userId', '==', user.uid)
    );
    const likesSnapshot = await getDocs(likesQuery);
    const likedRoomIds = likesSnapshot.docs.map(doc => doc.data().roomId);

    if (likedRoomIds.length === 0) {
      // If no likes, return random rooms
      const allRooms = await getRooms({ limit: limit });
      return allRooms.rooms.slice(0, limit);
    }

    // Get liked rooms to analyze preferences
    const likedRooms: Room[] = [];
    for (const roomId of likedRoomIds.slice(0, 10)) {
      const room = await getRoom(roomId);
      if (room) likedRooms.push(room);
    }

    // Extract common preferences
    const roomTypes = likedRooms.map(r => r.roomType).filter(Boolean);
    const colors = likedRooms.map(r => r.color).filter(Boolean);
    const styles = likedRooms.map(r => r.style).filter(Boolean);

    // Find most common preferences
    const preferredRoomType = roomTypes.length > 0 
      ? roomTypes.sort((a, b) => 
          roomTypes.filter(v => v === a).length - roomTypes.filter(v => v === b).length
        ).pop()
      : undefined;

    // Get recommendations
    const recommendations = await getRooms({
      roomType: preferredRoomType,
      limit: limit * 2,
    });

    // Filter out already liked rooms and return
    return recommendations.rooms
      .filter(room => !likedRoomIds.includes(room.id))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
}

/**
 * Get trending themes (most common room types)
 */
export async function getTrendingThemes(limit: number = 3): Promise<Array<{ theme: string; roomCount: number; sampleRoom?: Room }>> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const allRooms = await getRooms({ limit: 200 });
    
    // Count by roomType
    const themeCounts: Record<string, { count: number; rooms: Room[] }> = {};
    
    allRooms.rooms.forEach((room) => {
      if (room.roomType) {
        if (!themeCounts[room.roomType]) {
          themeCounts[room.roomType] = { count: 0, rooms: [] };
        }
        themeCounts[room.roomType].count++;
        themeCounts[room.roomType].rooms.push(room);
      }
    });

    // Sort and return top themes
    return Object.entries(themeCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, limit)
      .map(([theme, data]) => ({
        theme,
        roomCount: data.count,
        sampleRoom: data.rooms[0],
      }));
  } catch (error) {
    console.error('Error getting trending themes:', error);
    return [];
  }
}

/**
 * Get editor's picks for current month
 */
export async function getEditorsPicks(limit: number = 3): Promise<Room[]> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get current month in format "YYYY-MM"
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Query rooms with editorPick flag
    const roomsQuery = query(
      collection(db, 'rooms'),
      where('editorPick', '==', true),
      where('editorPickMonth', '==', currentMonth)
    );

    try {
      const snapshot = await getDocs(roomsQuery);
      const rooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Room[];

      return rooms.slice(0, limit);
    } catch (error: any) {
      // If index missing, fallback to query without month filter
      if (error.message?.includes('index') || error.code === 'failed-precondition') {
        const roomsQuery = query(
          collection(db, 'rooms'),
          where('editorPick', '==', true)
        );
        const snapshot = await getDocs(roomsQuery);
        const rooms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Room[];

        // Filter by month client-side
        return rooms
          .filter(room => room.editorPickMonth === currentMonth)
          .slice(0, limit);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error getting editor picks:', error);
    return [];
  }
}

// ==================== AUTH HELPERS ====================

/**
 * Login helper - syncs user with Firestore
 * (No backend needed, just ensures user exists in Firestore)
 */
export async function login(): Promise<{ user: User }> {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('User not authenticated');
    }

    // Get or create user in Firestore
    let user = await getUser(firebaseUser.uid);
    
    if (!user) {
      // Create user if doesn't exist
      user = await createOrUpdateUser({
        displayName: firebaseUser.displayName || undefined,
        email: firebaseUser.email || undefined,
        photoURL: firebaseUser.photoURL || undefined,
      });
    }

    return { user };
  } catch (error) {
    console.error('Error in login:', error);
    throw error;
  }
}
