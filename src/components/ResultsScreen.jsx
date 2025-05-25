import React from "react";
import { ProgressBar } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Header from "./Header";
import Footer from "./Footer";

const ResultsScreen = () => {
  // Navigation
  const navigate = useNavigate();
  const { state } = useLocation();
  // Variables
  const { questions = [], answeredQuestions = [], config = {} } = state || {};
  const totalQuestions = state?.questions?.length || 10;
  const score = state?.score || 0;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <>
      <Nav />
      <div className="container-fluid bg-light">
        <div className="row">
          <Header />
          <div className="col-sm-12 col-md-6 p-2 p-md-4  ">
            <div className="container p-2 p-md-4  ">
              <div className="card text-start border">
                <div className="card-body">
                  <h4 className="card-title p-2">Your Score</h4>
                  <ul className="list-unstyled p-2">
                    <li className="py-1">
                      {/* <h5 className="card-text">{quizStatus}</h5> */}
                    </li>
                    <li className="py-1">
                      <h5 className="card-text">
                        Total <span>{`${score} / ${totalQuestions}`}</span>
                      </h5>
                    </li>
                    <li className="py-1">
                      <p className="display-1">{percentage}%</p>
                    </li>
                    <li className="py-1">
                      <ProgressBar
                        now={percentage}
                        // label={`${score}/${totalQuestions}`}
                        variant={
                          percentage >= 70
                            ? "success"
                            : percentage >= 50
                            ? "warning"
                            : "danger"
                        }
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 p-2 p-md-4  ">
            <div className="container p-2 p-md-4  ">
              <div className="card text-start border ">
                <div className="card-body">
                  <h4 className="card-title p-2">Details</h4>
                  <ul className="list-unstyled p-2 ">
                    <li className="d-flex justify-content-between py-1 ">
                      <span className="fw-bold">Total Questions:</span>
                      <span className="mx-5 fw-bold">{totalQuestions}</span>
                    </li>

                    <li className="d-flex justify-content-between py-1 ">
                      <span className="fw-bold">Correct:</span>
                      <span className="mx-5 fw-bold">{score}</span>
                    </li>
                    <li className="d-flex justify-content-between py-1 ">
                      <span className="fw-bold">Incorrect:</span>
                      <span className="mx-5 fw-bold">
                        {totalQuestions - score}
                      </span>
                    </li>
                  </ul>
                  <ul className="list-unstyled d-flex flex-column flex-md-row gap-3 p-2 py-3">
                    <li className="nav-item ">
                      <button
                        className="btn btn-primary px-4 rounded-pill border-2 w-100"
                        onClick={() =>
                          navigate("/review", {
                            state: {
                              questions,
                              answeredQuestions,
                              score,
                              config,
                            },
                          })
                        }
                      >
                        Review Quiz
                      </button>
                    </li>
                    <li className="nav-item ">
                      <button
                        className="btn btn-success px-4 rounded-pill border-2 w-100"
                        onClick={() => navigate("/quiz", { state })}
                      >
                        Retake Quiz
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-12 p-2 p-md-3">
            <div className="container-fluid p-2 p-md-4 d-flex justify-content-start align-items-center"></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResultsScreen;
