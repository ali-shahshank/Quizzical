import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <>
      <nav className="navbar navbar-dark bg-dark navbar-expand-md p-2">
        <div className="container p-2">
          <Link to="/" className="navbar-brand">
            <i className="bi bi-clipboard-check-fill me-2"></i> Quizzical
          </Link>

          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#MainNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="MainNav">
            <ul className="navbar-nav ms-auto mt-5 mt-md-0">
              {/* Sign Up */}
              <li className="nav-item mx-0">
                <Link to="/signup" className="nav-link">
                  <button className="btn btn-outline-light border-2 rounded-pill px-3 w-100">
                    Sign Up
                  </button>
                </Link>
              </li>
              {/* Sign In */}
              <li className="nav-item ">
                <Link to="/signin" className="nav-link">
                  <button className="btn btn-light rounded-pill border-2 px-3 w-100">
                    Sign-In
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
