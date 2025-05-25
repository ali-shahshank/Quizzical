import React from "react";

const Header = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 p-4">
            <div className="container px-2">
              <h2 className="fs-4 fw-medium">
                {/* <i className="bi bi-clipboard-check-fill me-2"></i>*/}
                Quizzical
              </h2>
              <h5 className="text-muted">Test Your General Knowledge!</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
