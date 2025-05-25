import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <>
      <Nav />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 p-2 p-md-4  ">
            <div className="container p-2 p-md-4 "></div>
          </div>
          <div className="col-sm-12 col-md-4 p-4 d-none d-md-block ">
            <div className="container p-2 "></div>
          </div>
          <div className="col-sm-12 col-md-4 p-4 p-md-2">
            <div className="container p-4 bg-light rounded-4 border">
              <form action="" className="p-2">
                <div className="container px-0 py-2">
                  <h5>Account Login</h5>
                  <h6 className="text-muted">
                    Please login to your existing account.
                  </h6>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    required
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
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="div pt-4">
                  <small>
                    Don't have an account ? <Link to="/signup">Sign Up</Link>
                  </small>
                </div>
                <div className="div pt-4">
                  <button className="btn btn-primary rounded-pill border-2 px-3 w-100">
                    Login
                  </button>
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
