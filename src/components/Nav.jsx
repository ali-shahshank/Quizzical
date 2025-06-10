import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Nav = () => {
  // Navigation
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-md p-3">
      <div className="container p-2">
        <Link to="/" className="navbar-brand">
          <img src="/Logo-Dark.svg" alt="" height={"40px"} />
        </Link>
        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#MainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="MainNav">
          <ul className="navbar-nav gap-2 m-0 ms-md-auto mt-5 mt-md-0 d-flex justify-content-center">
            {!currentUser && (
              <>
                <li className="nav-item">
                  <Link
                    to="/signup"
                    className="btn btn-outline-light border-2 rounded-pill w-100 px-4"
                  >
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/signin"
                    className="btn btn-light border-2 rounded-pill w-100 px-4"
                  >
                    Sign In
                  </Link>
                </li>
              </>
            )}

            {currentUser && (
              <li className="d-flex">
                <div className="btn-group w-100">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4 w-100"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle"></i> Account
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end mt-2 w-100  position-absolute">
                    <li className="py-1">
                      <Link to="/account" className="dropdown-item">
                        Account Settings
                      </Link>
                    </li>

                    <li className="py-1">
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
