import React, { useState, useRef, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { Button } from "react-bootstrap";
import Nav from "./Nav";
import Footer from "./Footer";

const AccountManagement = () => {
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        if (!auth.currentUser?.uid) return;

        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists() && userDoc.data()?.avatarURL) {
          setAvatar(userDoc.data().avatarURL);
          return;
        }

        if (auth.currentUser?.photoURL) {
          setAvatar(auth.currentUser.photoURL.replace(/=s\d+/, "=s200"));
          return;
        }
      } catch (error) {
        console.error("Avatar fetch error:", error);
      }
    };

    fetchAvatar();
  }, []);

  const handleAvatarChange = async (e) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      const downloadURL = await UserService.uploadAvatar(
        auth.currentUser.uid,
        file
      );

      await UserService.updateUserProfile(auth.currentUser.uid, {
        avatarURL: downloadURL,
      });

      setAvatar(downloadURL);
    } catch (error) {
      console.error("Avatar update failed:", error);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const [profile, setProfile] = useState({
    username: "User",
    type: "User Account",
  });

  const [editing, setEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: "John Doe",
    email: "example@example.com",
    accountStatus: "Active",
  });
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  const handleProfileInfoChange = (field, value) => {
    setProfileInfo((prev) => ({ ...prev, [field]: value }));
  };

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({
    current: false,
    match: false,
  });

  const validatePassword = (password) => {
    setPasswordValidations({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
    });
  };

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handlePasswordChange = (field, value) => {
    const updated = { ...passwords, [field]: value };
    setPasswords(updated);

    if (field === "new") validatePassword(value);
    if (field === "confirm") {
      setErrors({ ...errors, match: updated.new !== updated.confirm });
    }
  };

  const handlePasswordSubmit = () => {
    setShowPasswordModal(false);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No authenticated user found");
      }

      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);
      await deleteUser(user);

      navigate("/");
    } catch (err) {
      console.error("Account deletion error:", err);
      setError(err.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
      document.getElementById("closeDeletionModal").click();
    }
  };

  return (
    <>
      <div className="container-fluid"></div>
    </>
  );
};

// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/firestore";
// import { serverTimestamp, updateDoc } from "firebase/firestore";
// import { db } from "./firebase";

// const userId = currentUser.uid;
// const fileExtension = file.name.split(".").pop();
// const storagePath = `avatars/${userId}/profile.${fileExtension}`;
// const storageRef = ref(storage, storagePath);
// const storage = getStorage();

// export const UserService = {
//   createUserProfile: async (userId, { email, userName }) => {
//     try {
//       await setDoc(doc(db, "users", userId), {
//         email,
//         userName,
//         createdAt: serverTimestamp(),
//         lastUpdated: serverTimestamp(),
//       });
//     } catch (error) {
//       throw new Error(`Firestore error: ${error.message}`);
//     }
//   },

//   updateUserProfile: async (userId, data) => {
//     await updateDoc(doc(db, "users", userId), {
//       ...data,
//       lastUpdated: serverTimestamp(),
//     });
//   },

//   uploadAvatar: async (userId, file) => {
//     try {
//       const storageRef = ref(storage, `avatars/${userId}/${file.name}`);
//       await uploadBytes(storageRef, file);
//       return await getDownloadURL(storageRef);
//     } catch (error) {
//       throw new Error(`Avatar upload failed: ${error.message}`);
//     }
//   },

//   deleteAvatar: async (avatarURL) => {
//     if (!avatarURL.includes("firebasestorage.googleapis.com")) return;
//     try {
//       const storageRef = ref(storage, avatarURL);
//       await deleteObject(storageRef);
//     } catch (error) {
//       console.error("Failed to delete old avatar:", error);
//     }
//   },
// };
import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { UserService } from "../utils/firestore";
import { AuthContext } from "../context/AuthContext";
import { Button } from "react-bootstrap";
import Nav from "./Nav";
import Footer from "./Footer";

const AccountManagement = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Profile state
  const [profile, setProfile] = useState({
    userName: "",
    email: "",
    avatarUrl: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Fetch user data on load
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        const userData = await UserService.getUserProfile(currentUser.uid);

        if (userData) {
          setProfile({
            userName: userData.userName || currentUser.displayName || "User",
            email: userData.email || currentUser.email || "",
            avatarUrl: userData.avatarUrl || "",
          });
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Handle avatar upload
  const handleAvatarChange = async (e) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      setLoading(true);
      const downloadURL = await UserService.uploadAvatar(currentUser.uid, file);
      setProfile((prev) => ({ ...prev, avatarUrl: downloadURL }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle profile updates
  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await UserService.updateUserProfile(currentUser.uid, {
        userName: profile.userName,
      });
      setEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      setLoading(true);
      // Delete avatar first if exists
      if (profile.avatarUrl) {
        await UserService.deleteAvatar(currentUser.uid);
      }

      // Delete user document
      await deleteDoc(doc(db, "users", currentUser.uid));

      // Delete auth account
      await deleteUser(currentUser);

      // Redirect after deletion
      navigate("/");
    } catch (err) {
      setError("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-6 p-4 p-md-4">
            <div className="container p-2 p-md-4 bg-white border rounded-4 d-flex flex-column justify-content-center align-items-center">
              <div className="card w-100 border-0">
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between align-items-center">
                      <h4 className="card-title">Profile</h4>
                      <h6 className="fs-6 fw-bold">
                        <Button
                          variant="link text-decoration-none fw-bold"
                          onClick={() => setEditing(!editing)}
                        >
                          {editing ? "Save" : "Edit"}
                        </Button>
                      </h6>
                    </li>
                  </ul>

                  <ul className="list-unstyled d-flex gap-5 align-items-center">
                    <li className="nav-item d-flex justify-content-start align-items-start position-relative">
                      <img
                        src="/Avatars/6.webp"
                        alt="profile image"
                        className="img-fluid"
                        style={{
                          height: "152px",
                          width: "152px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        onClick={() => fileInputRef.current.click()}
                      />
                      <button
                        className="btn btn-sm btn-primary rounded-circle position-absolute"
                        style={{
                          width: "32px",
                          height: "32px",
                          bottom: "10px",
                          right: "10px",
                        }}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="bg-info d-none"
                      />
                    </li>
                    <li className="nav-item">
                      {editing ? (
                        <input
                          className="form-control"
                          value={profile.username}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              username: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <h1>{profile.username}</h1>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-6 p-4 p-md-4">
            <div className="container p-2 p-md-4 bg-white rounded-4 border d-flex justify-content-between align-items-center">
              <div className="card text-start w-100  border-0 ">
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between align-items-center">
                      <h4 className="card-title">Profile Information</h4>
                      <h6 className="fs-6 fw-bold">
                        <Button
                          className="fw-bold text-decoration-none"
                          variant="link"
                          onClick={() => setIsEditingInfo(!isEditingInfo)}
                        >
                          {isEditingInfo ? "Save" : "Edit"}
                        </Button>
                      </h6>
                    </li>
                  </ul>
                  <ul className="list-unstyled body-text mt-4">
                    <li className="d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start gap-4 py-2">
                      <h5>Name:</h5>
                      {isEditingInfo ? (
                        <input
                          className="form-control w-50"
                          type="name"
                          value={profileInfo.name}
                          onChange={(e) =>
                            handleProfileInfoChange("name", e.target.value)
                          }
                        />
                      ) : (
                        <h5>{profileInfo.name}</h5>
                      )}
                    </li>{" "}
                    <li className="d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start gap-4 py-2">
                      <h5>Email:</h5>
                      {isEditingInfo ? (
                        <input
                          className="form-control w-50"
                          type="email"
                          value={profileInfo.email}
                          onChange={(e) =>
                            handleProfileInfoChange("email", e.target.value)
                          }
                        />
                      ) : (
                        <h5>{profileInfo.email}</h5>
                      )}
                    </li>
                    <li className="d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start gap-4 py-2">
                      <h5>Account Status:</h5>
                      <h5 className="text-secondary">
                        {profileInfo.accountStatus}
                      </h5>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-4 p-md-4">
            <div className="container p-2 p-md-4 bg-white rounded-4 border d-flex justify-content-between align-items-center">
              <div className="card text-start w-100 border-0">
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between align-items-center">
                      <h4 className="card-title">Password Management</h4>
                    </li>
                  </ul>
                  <ul className="list-unstyled body-text mt-4">
                    <li className="d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start gap-4 py-2">
                      <h5>Current Password:</h5>
                      <h5>********</h5>
                    </li>
                    <li className="nav-item mt-2">
                      <button
                        className="btn btn-primary px-4 rounded-pill"
                        onClick={() => setShowPasswordModal(true)}
                      >
                        Change Password
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {showPasswordModal && (
            <div
              className="modal show d-block fade"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header border-0">
                    <h5 className="modal-title">Password Change</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowPasswordModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="container-fluid px-0">
                      <h6 className="fs-6">Please enter a new password.</h6>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        placeholder="New Password"
                        value={passwords.new}
                        onChange={(e) =>
                          handlePasswordChange("new", e.target.value)
                        }
                        required
                      />
                      <label htmlFor="newPassword">New Password</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        value={passwords.confirm}
                        onChange={(e) =>
                          handlePasswordChange("confirm", e.target.value)
                        }
                        required
                      />
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      {errors.match && (
                        <div className="text-danger small mt-1">
                          Passwords do not match
                        </div>
                      )}
                    </div>

                    <div className="container-fluid p-3 border rounded mt-3">
                      <small className="fw-bold">Password must contain:</small>
                      <ul className="list-unstyled mb-0">
                        <li
                          className={
                            passwordValidations.minLength
                              ? "text-success"
                              : "text-muted"
                          }
                        >
                          {passwordValidations.minLength ? "✓" : "•"} 8+
                          characters
                        </li>
                        <li
                          className={
                            passwordValidations.hasUpper
                              ? "text-success"
                              : "text-muted"
                          }
                        >
                          {passwordValidations.hasUpper ? "✓" : "•"} 1 uppercase
                          letter
                        </li>
                        <li
                          className={
                            passwordValidations.hasLower
                              ? "text-success"
                              : "text-muted"
                          }
                        >
                          {passwordValidations.hasLower ? "✓" : "•"} 1 lowercase
                          letter
                        </li>
                        <li
                          className={
                            passwordValidations.hasNumber
                              ? "text-success"
                              : "text-muted"
                          }
                        >
                          {passwordValidations.hasNumber ? "✓" : "•"} 1 number
                        </li>
                        <li
                          className={
                            passwordValidations.hasSpecialChar
                              ? "text-success"
                              : "text-muted"
                          }
                        >
                          {passwordValidations.hasSpecialChar ? "✓" : "•"} 1
                          special character (!@#$%^&*)
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button
                      type="button"
                      className="btn btn-secondary px-4 rounded-pill"
                      onClick={() => setShowPasswordModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary px-4 rounded-pill"
                      disabled={
                        !passwords.new ||
                        !passwords.confirm ||
                        Object.values(passwordValidations).includes(false) ||
                        passwords.new !== passwords.confirm
                      }
                      onClick={handlePasswordSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="col-sm-12 col-md-6 p-4 p-md-4">
            <div className="container p-2 p-md-4 bg-white rounded-4 border d-flex justify-content-between align-items-center">
              <div className="card text-start w-100  border-0 ">
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between align-items-center">
                      <h4 className="card-title">Account Management</h4>
                    </li>
                  </ul>
                  <ul className="list-unstyled body-text mt-4">
                    <li className="d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start gap-4 py-2">
                      <h5>Account Type:</h5>
                      <h5>User Account</h5>
                    </li>
                    <li className="nav-item mt-2">
                      <button
                        className="btn btn-danger px-4 rounded-pill"
                        data-bs-toggle="modal"
                        data-bs-target="#deletionModal"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Processing..." : "Delete Account"}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="deletionModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="modalTitleId"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title" id="modalTitleId">
                    Delete Account
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid p-0">
                    <h5>
                      <i className="bi bi-exclamation-triangle-fill me-2 text-danger"></i>
                      Account deletion cannot be undone.
                    </h5>
                    {error && (
                      <div className="alert alert-danger mt-3">{error}</div>
                    )}
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary px-4 rounded-pill"
                    data-bs-dismiss="modal"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4 rounded-pill"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountManagement;
