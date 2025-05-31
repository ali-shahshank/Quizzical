import React from "react";

const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 p-4 bg-dark d-flex justify-content-center align-items-center">
            <div className="container p-2 d-flex justify-content-center align-items-center">
              <p className="text-light">
                Quizzical All Rights Reserved &copy; {date}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
