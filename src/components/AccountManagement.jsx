import React from "react";
import Nav from "./Nav";
import { Link } from "react-router-dom";

const ProfileManagement = () => {
  return (
    <>
      <Nav />

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-6 p-4 p-md-4 ">
            {/* Profile Overview */}
            <div className="container p-2 p-md-4 bg-white border rounded-4 d-flex flex-column justify-content-center align-items-center">
              <div className="card w-100 border-0">
                <div className="card-body">
                  {" "}
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between align-items-center">
                      <h4 className="card-title">Profile</h4>
                      <h6 className="fs-6 fw-bold">
                        <Link href="#" className="text-decoration-none">
                          Edit
                        </Link>
                      </h6>
                    </li>
                  </ul>
                  <ul className="list-unstyled d-flex gap-5 align-items-center">
                    <li className="nav-item">
                      <img
                        src="/circle.svg"
                        alt=""
                        className="img-fluid"
                        style={{ height: "155px", width: "155px" }}
                      />
                    </li>
                    <li className="nav-item">
                      <h3 className="fs-3">Odd</h3>
                      <h6 className="text-muted">User Account</h6>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-4 p-md-4">
            {/* Profile Details */}
            <div className="container p-2 p-md-4 bg-white rounded-4 border d-flex justify-content-between align-items-center">
              <div className="card text-start w-100  border-0 ">
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="d-flex justify-content-between align-items-center">
                      <h4 className="card-title">Profile Information</h4>
                      <h6 className="fs-6 fw-bold">
                        <Link href="#" className="text-decoration-none">
                          Edit
                        </Link>
                      </h6>
                    </li>
                  </ul>

                  <ul className="list-unstyled body-text mt-4">
                    <li className="d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start gap-4 py-2">
                      <h5>Name:</h5>
                      <h5>John Doe</h5>
                    </li>
                    <li className="d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start gap-4 py-2">
                      <h5>Email:</h5>
                      <h5>example@example.com</h5>
                    </li>
                    <li className="d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start gap-4 py-2">
                      <h5>Account Type:</h5>
                      <h5>User Account</h5>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-4 p-md-4">
            {/* Password Management */}
            <div className="container p-2 p-md-4 bg-white rounded-4 border d-flex justify-content-between align-items-center">
              <div className="card text-start w-100 border-0 ">
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
                      <button className="btn btn-primary px-4 rounded-pill">
                        Change Password
                      </button>
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
                      <h4 className="card-title">Account Management</h4>
                    </li>
                  </ul>

                  <ul className="list-unstyled body-text mt-4">
                    <li className="d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start gap-4 py-2">
                      <h5>Account Type:</h5>
                      <h5>User Account</h5>
                    </li>
                    <li className="nav-item mt-2">
                      <button className="btn btn-danger px-3 rounded-pill">
                        Delete Account
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileManagement;
