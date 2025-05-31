import React from "react";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-12 p-4 bg-light"></div>
          <div className="col-sm-12 col-md-12 p-4 bg-light">
            <div className="container p-2 p-md-4 bg-white ">
              <h3 className="fs-3">Privacy Policy</h3>
              <h6 className="text-muted">Effective May, 26th, 2025</h6>
            </div>
            <div className="container p-2 p-md-4 bg-white ">
              <p className="fw-medium">
                At Quizzical, we are committed to protecting your privacy. This
                Privacy Policy outlines how we collect, use, and safeguard your
                information in accordance with the General Data Protection
                Regulation (GDPR).
              </p>
            </div>
            <div className="container p-2 p-md-4 bg-white ">
              <ol>
                <li className="fs-6">
                  <strong>Information We Collect</strong> <br />{" "}
                  <p>
                    By creating an account or using our services, you agree to
                    be bound by these Terms.
                  </p>
                </li>
                <li className="fs-6">
                  <strong>User Eligibility</strong> <br />{" "}
                  <p>
                    You must be at least 13 years old to register. If under 18,
                    you must have permission from a parent or guardian.
                  </p>
                  <ul className="mb-3 list-unstyled">
                    <li>• Email address (for account registration)</li>
                    <li>• IP address (for security and logs)</li>
                    <li>• Quiz activity data (scores, session history)</li>
                  </ul>
                </li>
                <li className="fs-6">
                  <strong>Purpose of Data Collection</strong> <br />{" "}
                  <p>We process your data to:</p>
                  <ul className="mb-3 list-unstyled">
                    <li>• Create and manage user accounts</li>
                    <li>• Provide and improve quiz functionality</li>
                    <li>• Maintain application security and performance</li>
                  </ul>
                </li>
                <li className="fs-6">
                  <strong>Third-Party Services</strong> <br />{" "}
                  <p>
                    We use the Open Trivia Database API to deliver quiz content.
                    No personal data is shared with or received from this third
                    party.
                  </p>
                </li>
                <li className="fs-6">
                  <strong>Cookies</strong> <br />{" "}
                  <p>
                    We use essential cookies for authentication and analytics.
                    Users may manage cookie preferences through their browser
                    settings.
                  </p>
                </li>
                <li className="fs-6">
                  <strong>Data Security</strong> <br />{" "}
                  <p>
                    Your data is stored securely using standard encryption and
                    access control measures to prevent unauthorized access or
                    disclosure.
                  </p>
                </li>
                <li className="fs-6">
                  <strong>Your Rights under GDPR</strong> <br />{" "}
                  <p>You have the right to:</p>
                  <ul className="mb-3 list-unstyled">
                    <li>• Access the personal data we hold about you</li>
                    <li>• Request correction or deletion of your data</li>
                    <li>• Withdraw consent at any time</li>
                    <li>• Lodge a complaint with a supervisory authority</li>
                  </ul>
                  <p>
                    To exercise your rights, please contact us at
                    sploitify@gmail.com
                  </p>
                </li>
                <li className="fs-6">
                  <strong>Policy Updates</strong> <br />{" "}
                  <p>
                    We may update this policy periodically. Changes will be
                    posted with a revised effective date.
                  </p>
                </li>
              </ol>
            </div>
          </div>
          <div className="col-sm-12 col-md-12 p-4 bg-light"></div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
