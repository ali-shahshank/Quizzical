import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Nav = () => {
  const { currentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
          <ul className="navbar-nav gap-2 m-0 ms-md-auto mt-5 mt-md-0 d-flex justify-content-center align-items-center">
            {/* Show sign-up/sign-in if not logged in */}
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

            {/* Show account dropdown if logged in */}
            {currentUser && (
              <li className="d-flex">
                <div className="btn-group">
                  <i
                    className="bi bi-person-circle text-light fs-1"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></i>
                  <ul className="dropdown-menu dropdown-menu-end mt-2">
                    <li>
                      <Link to="/account" className="dropdown-item">
                        Account Settings
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
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
