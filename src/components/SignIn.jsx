import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

const SignIn = () => {
  // State Variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAuthMethod, setActiveAuthMethod] = useState(null);
  const navigate = useNavigate();

  // Unified error formatter
  const formatAuthError = (error) => {
    switch (error.code) {
      case "auth/user-not-found":
        return "Email not registered";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/invalid-email":
        return "Invalid email format";
      case "auth/too-many-requests":
        return "Account temporarily locked - try again later";
      case "auth/network-request-failed":
        return "Network error - check your connection";
      case "auth/popup-closed-by-user":
        return ""; // Silent handling for user-closed popup
      default:
        return "Login failed. Please try again";
    }
  };

  // On Change Handlers for input fields
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Handle Signin
  const handleSignIn = async (e) => {
    e.preventDefault();
    setActiveAuthMethod("email");
    setIsLoading(true);
    setErrorMessage("");

    // Input Validation
    if (!email || !password) {
      setErrorMessage("Please fill all fields");
      setIsLoading(false); // Add this to prevent stuck loading state
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setSuccessMessage(
        `Welcome Back, ${userCredential.user.displayName || "User"}!`
      );
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setErrorMessage(formatAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setActiveAuthMethod("google");
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const docSnapshot = await getDoc(userRef);

      if (!docSnapshot.exists()) {
        await setDoc(userRef, {
          userName: user.displayName || "Google User",
          email: user.email,
          createdAt: serverTimestamp(),
          authProvider: "google",
          lastLogin: serverTimestamp(),
        });
      } else {
        await setDoc(
          userRef,
          { lastLogin: serverTimestamp() },
          { merge: true }
        );
      }

      setSuccessMessage(`Welcome, ${user.displayName || "User"}!`);
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        setErrorMessage(`Google sign-in failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">
          {activeAuthMethod === "google"
            ? "Signing in with Google..."
            : "Signing in..."}
        </span>
      </div>
    );
  }

  return (
    /* Your exact existing JSX return */
    <>
      <Nav />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 p-2 p-md-4  ">
            <div className="container p-2 p-md-4 "></div>
          </div>
          <div className="col-sm-12 col-md-4 p-4 d-none d-md-block ">
            <div className="container p-2"></div>
          </div>
          <div className="col-sm-12 col-md-4 p-4 p-md-2">
            <div className="container p-4 bg-light rounded-4 border">
              <form action="" className="p-2">
                <div className="container px-0 py-2">
                  <h5>Account Login</h5>
                  <h6 className={errorMessage ? "text-danger" : "text-muted"}>
                    {errorMessage ||
                      successMessage ||
                      "Please login to your existing account"}
                  </h6>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    required
                    onChange={handleEmailChange}
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    required
                    onChange={handlePasswordChange}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="div py-2 d-flex justify-content-end fw-medium">
                  <small>
                    <Link to="/pass">Forgot your password?</Link>
                  </small>
                </div>

                <div className="div pt-4">
                  <button
                    className="btn btn-primary btn-lg rounded-pill border-2 px-3 w-100"
                    onClick={handleSignIn}
                  >
                    Login
                  </button>
                </div>
                <div className="container mt-3 px-0  ">
                  <button
                    type="button"
                    className="btn btn-lg btn-light border rounded-pill border-2 d-flex align-items-center justify-content-center w-100 "
                    disabled={isLoading}
                    onClick={handleGoogleSignIn}
                  >
                    <img
                      src="/google.svg"
                      height={"24px"}
                      width={"24px"}
                      alt=""
                      className="me-2"
                    />{" "}
                    {isLoading ? "Processing..." : "Sign In with Google"}
                  </button>
                </div>
                <div className="div pt-4 fw-medium">
                  <small>
                    Don't have an account ? <Link to="/signup">Sign Up</Link>
                  </small>
                </div>
              </form>
            </div>
          </div>
          <div className="col-sm-12 col-md-4 p-4 d-none d-md-block">
            <div className="container p-2"></div>
          </div>
          <div className="col-sm-12 col-md-12 p-2 p-md-4  ">
            <div className="container p-2 p-md-4 "></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignIn;
