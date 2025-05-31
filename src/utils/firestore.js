import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const UserService = {
  // Create user document after auth registration
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

  // Update profile (used in ProfileManagement.jsx)
  updateUserProfile: async (userId, data) => {
    await updateDoc(doc(db, "users", userId), {
      ...data,
      lastUpdated: serverTimestamp(),
    });
  },
};
