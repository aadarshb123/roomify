import { db } from "../../config/firebase";
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";

export async function likeImage(userId: string, image: any) {
  const ref = doc(db, "users", userId, "likes", image.id);
  await setDoc(ref, {
    imageId: image.id,
    imageUrl: image.imageUrl,
    roomType: image.roomType,
    style: image.style,
    createdAt: serverTimestamp(),
  });
}

export async function unlikeImage(userId: string, imageId: string) {
  const ref = doc(db, "users", userId, "likes", imageId);
  await deleteDoc(ref);
}

export async function isLiked(userId: string, imageId: string) {
  const ref = doc(db, "users", userId, "likes", imageId);
  const snap = await getDoc(ref);
  return snap.exists();
}
