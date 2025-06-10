// src/utils/accountService.js
import { db, storage } from "./firebase";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const AccountService = {
  /**
   * Initializes account management record
   * @param {string} uid - User ID from Firebase Auth
   * @param {string} email - User's email
   */
  initAccount: async (uid, email) => {
    await setDoc(doc(db, "account_management", uid), {
      full_name: "",
      email,
      avatar_url: "default",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
  },

  /**
   * Updates user's full name
   * @param {string} uid - User ID
   * @param {string} fullName - New full name
   */
  updateFullName: async (uid, fullName) => {
    if (!/^[a-zA-Z\s]{2,50}$/.test(fullName)) {
      throw new Error("Name can only contain letters and spaces (2-50 chars)");
    }

    await updateDoc(doc(db, "account_management", uid), {
      full_name: fullName,
      updated_at: serverTimestamp(),
    });
  },

  /**
   * Handles avatar upload
   * @param {string} uid - User ID
   * @param {File} file - Image file (JPG/PNG)
   * @returns {Promise<string>} Download URL
   */
  uploadAvatar: async (uid, file) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Only JPG/PNG files allowed");
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("File too large (max 2MB)");
    }

    const ext = file.name.split(".").pop();
    const storageRef = ref(storage, `avatars/${uid}/profile.${ext}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await updateDoc(doc(db, "account_management", uid), {
      avatar_url: url,
      updated_at: serverTimestamp(),
    });

    return url;
  },

  /**
   * Resets avatar to default
   * @param {string} uid - User ID
   */
  resetAvatar: async (uid) => {
    await updateDoc(doc(db, "account_management", uid), {
      avatar_url: "default",
      updated_at: serverTimestamp(),
    });
  },

  /**
   * Deletes all account management data
   * @param {string} uid - User ID
   */
  purgeAccountData: async (uid) => {
    // Delete Firestore record
    await deleteDoc(doc(db, "account_management", uid));

    // Delete avatar from storage if exists
    try {
      const avatarRef = ref(storage, `avatars/${uid}`);
      await deleteObject(avatarRef);
    } catch (error) {
      console.log("No avatar to delete");
    }
  },
};

export default AccountService;
