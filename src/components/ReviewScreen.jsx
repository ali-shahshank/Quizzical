import React from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const ReviewScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Error handling if accessed directly without state
  if (!state?.questions || !state?.answeredQuestions) {
    return (
      <div className="container-fluid p-5 text-center">
        <h3>No quiz data available</h3>
        <Button
          variant="primary"
          onClick={() => navigate("/")}
          className="mt-3"
        >
          Start New Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light">
      <div className="row">
        <div className="col-12 p-3 p-md-5">
          <div className="container py-4  d-flex justify-content-between">
            <h2 className="mb-0">Quiz Review</h2>
            <Button
              variant="primary px-4 rounded-pill border-2"
              onClick={() => navigate("/result", { state })}
            >
              Back to Results
            </Button>
          </div>

          {/* Questions List */}
          {state.questions.map((question, index) => {
            const userAnswer = state.answeredQuestions[index];
            const isCorrect = userAnswer === question.correct_answer;
            const allAnswers = [
              ...question.incorrect_answers,
              question.correct_answer,
            ].sort(() => Math.random() - 0.5);

            return (
              <div key={index} className="mb-5">
                {/* Question Text */}
                <div className="col-12 p-2 p-md-4 d-flex justify-content-start align-items-center">
                  <div className="container p-3 p-md-4 bg-white rounded-2">
                    <h5 className="text-muted">
                      Question {index + 1} of {state.questions.length}
                    </h5>
                    <p className="card-text fs-4">
                      {decodeHtml(question.question)}
                    </p>
                  </div>
                </div>

                {/* Answers List */}
                <div className="col-12 p-2 p-md-4 d-flex justify-content-start align-items-center">
                  <div className="container p-3 p-md-4 bg-white rounded-2">
                    <Form>
                      {allAnswers.map((answer, ansIndex) => {
                        const isUserChoice = answer === userAnswer;
                        const isRightAnswer =
                          answer === question.correct_answer;

                        return (
                          <Form.Check
                            key={ansIndex}
                            type="radio"
                            name={`review-options-${index}`}
                            id={`review-option-${index}-${ansIndex}`}
                            label={decodeHtml(answer)}
                            checked={isUserChoice}
                            readOnly
                            className={`py-3 fs-5 ${
                              isUserChoice && isRightAnswer
                                ? "text-success "
                                : isUserChoice
                                ? "text-danger "
                                : isRightAnswer
                                ? "text-success"
                                : ""
                            }`}
                          />
                        );
                      })}
                    </Form>

                    {/* Answer Status */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;
