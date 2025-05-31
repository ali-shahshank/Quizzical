import React, { useState } from "react";
import Nav from "./Nav";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const PasswordReset = () => {
  // Navigation
  const navigate = useNavigate();
  // Variables
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState("");

  // Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(`Password reset link sent to ${email}`);
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      setErrorMessage(
        error.code === "auth/user-not-found"
          ? "Email not registered"
          : "Failed to send reset email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 p-2 d-none d-md-block "></div>
          <div className="col-sm-12 col-md-12 p-2 p-md-4 ">
            {/* Alert Container */}
            <div className="container p-2 p-md-4 ">
              {successMessage && (
                <div
                  className="alert alert-success text-center d-flex justify-content-between align-items-center "
                  role="alert"
                >
                  {successMessage}
                  <button
                    className="btn btn-close"
                    data-bs-dismiss="alert"
                  ></button>
                </div>
              )}
              {errorMessage && (
                <div className="alert alert-danger " role="alert">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
          <div className="col-sm-12 col-md-4 p-4 d-none d-md-block  ">
            <div className="container p-2 "></div>
          </div>
          <div className="col-sm-12 col-md-4 p-4 p-md-2">
            <div className="container p-4 bg-light rounded-4 border">
              <form action="" className="p-2" onSubmit={handlePasswordReset}>
                <div className="container px-0 py-2">
                  <h5>Password Reset</h5>
                  <h6 className="text-muted">
                    Please enter your existing email address.
                  </h6>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>

                <div className="div pt-4">
                  <button
                    className="btn btn-primary btn-lg rounded-pill border-2 px-3 w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Reset Password"}
                  </button>
                </div>

                <div className="div pt-4 fw-medium text-center">
                  <small>
                    Don't have an account yet ?{" "}
                    <Link to="/signup">Sign Up</Link>
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
          <div className="col-sm-12 col-md-12 p-2 d-none d-md-block  "></div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PasswordReset;
