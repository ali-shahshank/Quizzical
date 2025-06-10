import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/firestore";
import { deleteObject } from "firebase/storage";
import { serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const userId = currentUser.uid;
const fileExtension = file.name.split(".").pop();
const storagePath = `avatars/${userId}/profile.${fileExtension}`;
const storageRef = ref(storage, storagePath);
const storage = getStorage();

export const UserService = {
  createUserProfile: async (userId, { email, userName }) => {
    try {
      await setDoc(doc(db, "users", userId), {
        email,
        userName,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      throw new Error(`Firestore error: ${error.message}`);
    }
  },

  updateUserProfile: async (userId, data) => {
    await updateDoc(doc(db, "users", userId), {
      ...data,
      lastUpdated: serverTimestamp(),
    });
  },

  uploadAvatar: async (userId, file) => {
    try {
      const storageRef = ref(storage, `avatars/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      throw new Error(`Avatar upload failed: ${error.message}`);
    }
  },

  deleteAvatar: async (avatarURL) => {
    if (!avatarURL.includes("firebasestorage.googleapis.com")) return;
    try {
      const storageRef = ref(storage, avatarURL);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Failed to delete old avatar:", error);
    }
  },
};
