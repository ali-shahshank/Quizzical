import React from "react";
import { ProgressBar } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Header from "./Header";
import Footer from "./Footer";

// TEST CASE 1: Perfect Score (uncomment to test)
const testState = {
  questions: Array(10).fill({
    question: "Test question",
    correct_answer: "correct",
  }),
  answeredQuestions: Array(10).fill("correct"),
  score: 10,
  config: {},
};

const ResultsScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Use test data instead of actual state for testing
  const data = testState; // Replace with 'state' for production
  // const data = state || {}; // Production version

  // Safeguard calculations
  const totalQuestions = data.questions?.length || 0;
  const score = Math.min(data.score || 0, totalQuestions);
  const percentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const incorrectCount = Math.max(0, totalQuestions - score);

  return (
    <>
      <Nav />
      <div className="container-fluid bg-light">
        {/* Modified displays to show test verification */}
        <div className="card">
          <ul>
            <li className="py-1">
              <h5 className="card-text">
                Total <span>{`${score} / ${totalQuestions}`}</span>
                {score === 10 && totalQuestions === 10 && (
                  <span className="text-success ms-2">✓ Test Passed</span>
                )}
              </h5>
            </li>
          </ul>
        </div>
        {/* ... rest of your existing JSX ... */}
      </div>
      <Footer />
    </>
  );
};

export default ResultsScreen;
