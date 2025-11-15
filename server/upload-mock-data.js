require('dotenv').config();
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Helper function to parse service account key from .env
function parseServiceAccountKey() {
  // Try parsing from env var first (single-line JSON)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (e) {
      // If that fails, try reading from .env file directly (multi-line JSON)
      try {
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        
        // Find the FIREBASE_SERVICE_ACCOUNT_KEY line
        const lines = envContent.split('\n');
        let jsonStartIndex = -1;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('FIREBASE_SERVICE_ACCOUNT_KEY=')) {
            jsonStartIndex = i;
            break;
          }
        }
        
        if (jsonStartIndex !== -1) {
          // Extract JSON from the line (remove the key= part)
          let jsonString = lines[jsonStartIndex].replace(/^FIREBASE_SERVICE_ACCOUNT_KEY=\s*/, '');
          
          // If JSON continues on next lines, collect them
          let braceCount = (jsonString.match(/{/g) || []).length - (jsonString.match(/}/g) || []).length;
          let currentLine = jsonStartIndex + 1;
          
          while (braceCount > 0 && currentLine < lines.length) {
            jsonString += '\n' + lines[currentLine];
            braceCount += (lines[currentLine].match(/{/g) || []).length - (lines[currentLine].match(/}/g) || []).length;
            currentLine++;
          }
          
          return JSON.parse(jsonString.trim());
        }
      } catch (fileError) {
        // Fall through to return null
      }
    }
  }
  return null;
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    // Option 1: Use service account key file (recommended for production)
    const serviceAccount = parseServiceAccountKey();
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin initialized with service account key\n');
    } 
    // Option 2: Use individual environment variables
    else if (process.env.FIREBASE_PROJECT_ID) {
      if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        console.error('❌ Missing Firebase credentials!');
        console.error('   Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
        console.error('\n💡 See server/SETUP.md for setup instructions\n');
        process.exit(1);
      }
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log('✅ Firebase Admin initialized with environment variables\n');
    } 
    // Option 3: Use default credentials (for Firebase hosting/Cloud Run)
    else {
      admin.initializeApp();
      console.log('✅ Firebase Admin initialized with default credentials\n');
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
    console.error('\n📋 Setup Instructions:');
    console.error('   1. Create a .env file in the server/ directory');
    console.error('   2. Add Firebase Admin credentials (see server/SETUP.md)');
    console.error('   3. Options:');
    console.error('      - FIREBASE_SERVICE_ACCOUNT_KEY (recommended)');
    console.error('      - OR FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY');
    console.error('\n💡 Get credentials from:');
    console.error('   Firebase Console > Project Settings > Service Accounts\n');
    process.exit(1);
  }
}

const db = admin.firestore();

// Mock data
const mockRooms = [
  {
    title: "Modern Living Room",
    uri: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200",
    roomType: "Living Room",
    color: "Neutral",
    style: "Modern",
    description: "A beautiful modern living room with clean lines and minimalist design",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Cozy Bedroom",
    uri: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
    roomType: "Bedroom",
    color: "Neutral",
    style: "Cozy",
    description: "Warm and inviting bedroom design perfect for relaxation",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Modern Kitchen",
    uri: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200",
    roomType: "Kitchen",
    color: "Neutral",
    style: "Modern",
    description: "Sleek and functional kitchen design with modern appliances",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Dark Living Room",
    uri: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
    roomType: "Living Room",
    color: "Dark",
    style: "Modern",
    description: "Bold dark theme living space with dramatic lighting",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Colorful Bedroom",
    uri: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200",
    roomType: "Bedroom",
    color: "Colorful",
    style: "Cozy",
    description: "Vibrant and energetic bedroom with colorful accents",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Minimalist Kitchen",
    uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
    roomType: "Kitchen",
    color: "Neutral",
    style: "Minimalist",
    description: "Clean and simple kitchen design with minimal clutter",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Scandinavian Living Room",
    uri: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200",
    roomType: "Living Room",
    color: "Neutral",
    style: "Scandinavian",
    description: "Light and airy Scandinavian design with natural materials",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Modern Home Office",
    uri: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200",
    roomType: "Home Office",
    color: "Neutral",
    style: "Modern",
    description: "Productive workspace with modern furniture and natural light",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Cozy Living Room",
    uri: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200",
    roomType: "Living Room",
    color: "Neutral",
    style: "Cozy",
    description: "Warm and inviting living space perfect for family time",
    editorPick: true,
    editorPickMonth: new Date().toISOString().slice(0, 7), // "YYYY-MM" format
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Modern Bedroom",
    uri: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    roomType: "Bedroom",
    color: "Neutral",
    style: "Modern",
    description: "Sleek modern bedroom with contemporary design elements",
    editorPick: true,
    editorPickMonth: new Date().toISOString().slice(0, 7), // "YYYY-MM" format
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Colorful Kitchen",
    uri: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200",
    roomType: "Kitchen",
    color: "Colorful",
    style: "Modern",
    description: "Bright and cheerful kitchen with vibrant colors",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: "Minimalist Bedroom",
    uri: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200",
    roomType: "Bedroom",
    color: "Neutral",
    style: "Minimalist",
    description: "Simple and serene bedroom with minimal design",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

// Mock comments (will be created after rooms)
const mockComments = [
  { text: "Love this design! Where did you get the furniture?" },
  { text: "The color scheme is perfect. Great inspiration!" },
  { text: "This is exactly what I was looking for. Thank you for sharing!" },
  { text: "The lighting in this room is amazing!" },
  { text: "Would love to see more angles of this space!" },
];

// Main function
async function uploadMockData() {
  try {
    // Get user ID from command line argument or prompt
    const userId = process.argv[2];
    
    if (!userId) {
      console.log('📝 Usage: node upload-mock-data.js <YOUR_USER_ID>');
      console.log('💡 To get your User ID:');
      console.log('   1. Sign up/login in your app');
      console.log('   2. Go to Firebase Console → Authentication → Users');
      console.log('   3. Copy the UID');
      console.log('   4. Or check Firestore → users collection → document ID');
      console.log('\n   Example: node upload-mock-data.js abc123xyz456');
      process.exit(1);
    }

    console.log('🚀 Starting mock data upload...\n');
    console.log(`👤 Using User ID: ${userId}\n`);

    // Verify user exists and update with bio and style preferences
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      console.log('⚠️  Warning: User not found in Firestore. Creating user document...');
      await db.collection('users').doc(userId).set({
        displayName: 'Test User',
        email: 'test@example.com',
        bio: 'Crafting beautiful spaces with modern minimalism',
        stylePreferences: ['Modern', 'Minimalist', 'Scandinavian'],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log('✅ User document created\n');
    } else {
      // Update existing user with bio and style preferences if not present
      const userData = userDoc.data();
      if (!userData.bio || !userData.stylePreferences) {
        await db.collection('users').doc(userId).set({
          bio: 'Crafting beautiful spaces with modern minimalism',
          stylePreferences: ['Modern', 'Minimalist', 'Scandinavian'],
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        console.log('✅ User document updated with bio and style preferences\n');
      }
    }

    // Step 1: Upload rooms
    console.log('📦 Uploading rooms...');
    const roomIds = [];
    for (let i = 0; i < mockRooms.length; i++) {
      const room = { ...mockRooms[i], userId };
      const docRef = await db.collection('rooms').add(room);
      roomIds.push(docRef.id);
      console.log(`   ✅ Room ${i + 1}/${mockRooms.length}: "${room.title}" (ID: ${docRef.id})`);
    }
    console.log(`\n✅ Uploaded ${roomIds.length} rooms\n`);

    // Step 2: Upload comments
    console.log('💬 Uploading comments...');
    let commentCount = 0;
    for (let i = 0; i < mockComments.length; i++) {
      const roomId = roomIds[i % roomIds.length]; // Distribute comments across rooms
      const comment = {
        roomId,
        userId,
        text: mockComments[i].text,
        createdAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() - (i + 1) * 3600000) // 1 hour apart
        ),
      };
      await db.collection('comments').add(comment);
      commentCount++;
      console.log(`   ✅ Comment ${i + 1}/${mockComments.length} on room "${roomIds.indexOf(roomId) + 1}"`);
    }
    console.log(`\n✅ Uploaded ${commentCount} comments\n`);

    // Step 3: Upload likes (like first 5 rooms)
    console.log('❤️  Uploading likes...');
    let likeCount = 0;
    for (let i = 0; i < Math.min(5, roomIds.length); i++) {
      const like = {
        roomId: roomIds[i],
        userId,
        createdAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() - (i + 1) * 86400000) // 1 day apart
        ),
      };
      await db.collection('likes').add(like);
      likeCount++;
      console.log(`   ✅ Liked room ${i + 1}/5: "${mockRooms[i].title}"`);
    }
    console.log(`\n✅ Uploaded ${likeCount} likes\n`);

    // Step 4: Upload saves (save first 4 rooms for favorites screen)
    console.log('💾 Uploading saves (favorites)...');
    let saveCount = 0;
    // Save rooms at different indices to have variety
    const saveIndices = [0, 2, 4, 6]; // Save rooms 1, 3, 5, 7
    for (let i = 0; i < saveIndices.length && saveIndices[i] < roomIds.length; i++) {
      const roomIndex = saveIndices[i];
      const save = {
        roomId: roomIds[roomIndex],
        userId,
        createdAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() - (i + 1) * 172800000) // 2 days apart
        ),
      };
      await db.collection('saves').add(save);
      saveCount++;
      console.log(`   ✅ Saved room ${i + 1}/${saveIndices.length}: "${mockRooms[roomIndex].title}"`);
    }
    console.log(`\n✅ Uploaded ${saveCount} saves\n`);

    // Step 5: Upload collections (groups of saved rooms)
    console.log('📁 Uploading collections...');
    let collectionCount = 0;
    
    // Create 3 collections with different room combinations
    const collections = [
      {
        name: 'Modern Cozy Bedroom',
        roomIds: [roomIds[1], roomIds[4], roomIds[9]], // Bedroom-themed rooms
      },
      {
        name: 'Living Room Ideas',
        roomIds: [roomIds[0], roomIds[3], roomIds[6], roomIds[8]], // Living room themed
      },
      {
        name: 'Kitchen Inspiration',
        roomIds: [roomIds[2], roomIds[5], roomIds[10]], // Kitchen themed
      },
    ];

    for (let i = 0; i < collections.length; i++) {
      const collection = collections[i];
      const collectionData = {
        name: collection.name,
        userId,
        roomIds: collection.roomIds,
        createdAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() - (i + 1) * 259200000) // 3 days apart
        ),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection('collections').add(collectionData);
      collectionCount++;
      console.log(`   ✅ Collection ${i + 1}/${collections.length}: "${collection.name}" (${collection.roomIds.length} rooms)`);
    }
    console.log(`\n✅ Uploaded ${collectionCount} collections\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Upload Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📦 Rooms: ${roomIds.length}`);
    console.log(`💬 Comments: ${commentCount}`);
    console.log(`❤️  Likes: ${likeCount}`);
    console.log(`💾 Saves: ${saveCount}`);
    console.log(`📁 Collections: ${collectionCount}`);

    // Step 6: Create test users for follow relationships
    console.log('\n👤 Creating test users for follow relationships...');
    const testUserIds = [];
    const testUsers = [
      { displayName: 'Alex Designer', email: 'alex@test.com' },
      { displayName: 'Sarah Home', email: 'sarah@test.com' },
      { displayName: 'Mike Interiors', email: 'mike@test.com' },
      { displayName: 'Emma Style', email: 'emma@test.com' },
      { displayName: 'Chris Decor', email: 'chris@test.com' },
    ];

    for (const testUser of testUsers) {
      // Check if user already exists by email
      const existingUsersQuery = await db.collection('users')
        .where('email', '==', testUser.email)
        .limit(1)
        .get();
      
      if (existingUsersQuery.empty) {
        // Create new test user with a generated ID
        const newUserRef = db.collection('users').doc();
        await newUserRef.set({
          displayName: testUser.displayName,
          email: testUser.email,
          photoURL: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
          bio: 'Interior design enthusiast',
          stylePreferences: ['Modern', 'Minimalist'],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        testUserIds.push(newUserRef.id);
        console.log(`   ✅ Created test user: ${testUser.displayName} (${newUserRef.id})`);
      } else {
        // Use existing user
        testUserIds.push(existingUsersQuery.docs[0].id);
        console.log(`   ℹ️  Using existing user: ${testUser.displayName}`);
      }
    }
    console.log(`\n✅ Prepared ${testUserIds.length} test users\n`);

    // Step 7: Create follow relationships (bidirectional for realistic data)
    console.log('👥 Creating follow relationships...');
    let followCount = 0;
    let followerCount = 0;
    
    // Current user follows some test users (following)
    const usersToFollow = testUserIds.slice(0, 4); // Follow 4 test users
    for (const otherUserId of usersToFollow) {
      // Check if already following
      const existingFollowQuery = await db.collection('follows')
        .where('followerId', '==', userId)
        .where('followingId', '==', otherUserId)
        .limit(1)
        .get();
      
      if (existingFollowQuery.empty) {
        const followData = {
          followerId: userId,
          followingId: otherUserId,
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(Date.now() - Math.random() * 259200000) // Random time in last 3 days
          ),
        };
        await db.collection('follows').add(followData);
        followCount++;
        console.log(`   ✅ You follow: ${otherUserId.substring(0, 8)}...`);
      }
    }

    // Some test users follow current user (followers)
    const usersWhoFollowYou = testUserIds.slice(0, 3); // 3 test users follow you
    for (const followerUserId of usersWhoFollowYou) {
      // Check if already following
      const existingFollowQuery = await db.collection('follows')
        .where('followerId', '==', followerUserId)
        .where('followingId', '==', userId)
        .limit(1)
        .get();
      
      if (existingFollowQuery.empty) {
        const followData = {
          followerId: followerUserId,
          followingId: userId,
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(Date.now() - Math.random() * 259200000) // Random time in last 3 days
          ),
        };
        await db.collection('follows').add(followData);
        followerCount++;
        console.log(`   ✅ ${followerUserId.substring(0, 8)}... follows you`);
      }
    }

    // Create some mutual follows (bidirectional)
    const mutualFollows = testUserIds.slice(0, 2); // 2 mutual follows
    for (const mutualUserId of mutualFollows) {
      // Current user follows them (if not already)
      const existingFollow1 = await db.collection('follows')
        .where('followerId', '==', userId)
        .where('followingId', '==', mutualUserId)
        .limit(1)
        .get();
      
      if (existingFollow1.empty) {
        await db.collection('follows').add({
          followerId: userId,
          followingId: mutualUserId,
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(Date.now() - Math.random() * 259200000)
          ),
        });
        followCount++;
      }

      // They follow current user (if not already)
      const existingFollow2 = await db.collection('follows')
        .where('followerId', '==', mutualUserId)
        .where('followingId', '==', userId)
        .limit(1)
        .get();
      
      if (existingFollow2.empty) {
        await db.collection('follows').add({
          followerId: mutualUserId,
          followingId: userId,
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(Date.now() - Math.random() * 259200000)
          ),
        });
        followerCount++;
        console.log(`   ✅ Mutual follow with: ${mutualUserId.substring(0, 8)}...`);
      }
    }

    const totalFollows = followCount + followerCount;
    console.log(`\n✅ Created ${totalFollows} follow relationships:`);
    console.log(`   📤 Following: ${followCount}`);
    console.log(`   📥 Followers: ${followerCount}\n`);

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Upload Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📦 Rooms: ${roomIds.length}`);
    console.log(`💬 Comments: ${commentCount}`);
    console.log(`❤️  Likes: ${likeCount}`);
    console.log(`💾 Saves: ${saveCount}`);
    console.log(`📁 Collections: ${collectionCount}`);
    console.log(`👤 Test Users: ${testUserIds.length}`);
    if (totalFollows > 0) {
      console.log(`👥 Follow Relationships: ${totalFollows}`);
      console.log(`   📤 You're following: ${followCount}`);
      console.log(`   📥 Your followers: ${followerCount}`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 Your app should now show all the mock data!');
    console.log('💡 Refresh your app to see the changes.\n');

  } catch (error) {
    console.error('❌ Error uploading mock data:', error);
    process.exit(1);
  }
}

// Run the script
uploadMockData();

