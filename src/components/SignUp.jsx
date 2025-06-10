import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { googleProvider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import Nav from "./Nav";
import Footer from "./Footer";

const SignUp = () => {
  // State Variables
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  // Password Input & Validation
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  // input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "password") validatePassword(value);
  };
  // Validate Password
  const validatePassword = (password) => {
    setPasswordValidations({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
    });
  };
  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isTermsAccepted) {
      setErrorMessage("You must accept the terms & conditions");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        userName: formData.userName,
        email: formData.email,
        createdAt: serverTimestamp(),
      });

      // Reset form on success
      setFormData({
        userName: "",
        email: "",
        password: "",
      });

      setIsTermsAccepted(false);
      setSuccessMessage("Account created successfully!");
      setTimeout(() => navigate("/"), 1500);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(`Google sign-up failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Signup
  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Google Sign-in
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check Firestore for existing user document
      const userRef = doc(db, "users", user.uid);
      const docSnapshot = await getDoc(userRef);

      // Only create doc if it doesn't exist
      if (!docSnapshot.exists()) {
        await setDoc(userRef, {
          userName: user.displayName || "Google User",
          email: user.email,
          createdAt: serverTimestamp(),
          authProvider: "google",
          lastLogin: serverTimestamp(),
        });
      } else {
        // Update last login if user exists
        await setDoc(
          userRef,
          {
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );
      }

      // Success Message
      setSuccessMessage(`Welcome, ${user.displayName || "User"}!`);
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      // handling popup
      if (error.code === "auth/popup-closed-by-user") {
      }
      // error handling
      else {
        setErrorMessage(`Sign-up failed: ${error.message}`);
        console.error("Google Auth Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 p-4 "></div>
          <div className="col-sm-12 col-md-4 p-4 d-none d-md-block  ">
            <div className="container p-2 "></div>
          </div>
          <div className="col-sm-12 col-md-4 p-4 p-md-2">
            <div className="container p-4 bg-light rounded-4 border">
              {errorMessage && (
                <div
                  className="alert alert-danger d-flex justify-content-between align-items-center"
                  role="alert"
                  data-bs-target="alert"
                  data-bs-dismiss="alert"
                >
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div
                  className="alert alert-success d-flex justify-content-between align-items-center"
                  role="alert"
                >
                  {successMessage}
                  <button
                    className="btn btn-close btn-sm"
                    data-bs-target="alert"
                    data-bs-dismiss="alert"
                  ></button>
                </div>
              )}
              <form onSubmit={handleSubmit} className="p-2 ">
                <div className="container px-0 py-2">
                  <h5>Account Registration</h5>
                  <h6 className="text-muted">
                    Please create a new Quizzical account.
                  </h6>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Name"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="floatingInput">Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating position-relative d-flex justify-content-between align-items-center">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                  {/* Password Validation tooltip */}
                  {isPasswordFocused && (
                    <div
                      className="position-absolute bg-white p-4 rounded shadow-sm border mt-3 "
                      style={{
                        width: "calc(100% - 1.5rem)",
                        zIndex: 1000,
                        top: "100%",
                        left: "0.75rem",
                      }}
                    >
                      <small className="fw-bold">Password must contain:</small>
                      <ul className="list-unstyled mb-0">
                        <li
                          className={` ${
                            passwordValidations.minLength
                              ? "text-success"
                              : "text-muted"
                          }`}
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
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="form-check pt-4 ">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="termsCheckbox"
                    checked={isTermsAccepted}
                    onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                    required
                  />
                  <label className="form-check-label" htmlFor="checkDefault">
                    <small>
                      By creating an account I agree to the
                      <a
                        href="/terms&conditions"
                        target="_blank"
                        className="mx-1"
                      >
                        terms & conditions
                      </a>
                      and
                      <a href="/privacy" target="_blank" className="mx-1">
                        privacy policy.
                      </a>
                    </small>
                  </label>
                </div>
                <div className="container px-0 pt-4 ">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill border-2 btn-lg w-100 py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </button>
                </div>
                <div className="container mt-3 px-0  ">
                  <button
                    type="button"
                    className="btn btn-lg btn-light border rounded-pill border-2 d-flex align-items-center justify-content-center w-100 "
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
                  >
                    <img
                      src="/google.svg"
                      height={"24px"}
                      width={"24px"}
                      alt=""
                      className="me-2"
                    />
                    {isLoading ? "Processing..." : "Sign Up with Google"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-sm-12 col-md-4 p-4  d-none d-md-block">
            <div className="container p-2"></div>
          </div>
          <div className="col-sm-12 col-md-12 p-4 "></div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
