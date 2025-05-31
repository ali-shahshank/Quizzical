import React, { useState, useEffect } from "react";
import { Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "../index.css";

const QuizScreen = () => {
  // Navigation and Configuration
  const navigate = useNavigate();
  const { state: routeState } = useLocation();

  // Core State
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showTimeAlert, setShowTimeAlert] = useState(false);

  // Configuration with defaults
  const category = routeState?.category || "9";
  const difficulty = routeState?.difficulty || "medium";
  const [timeLeft, setTimeLeft] = useState(360);

  // Time Format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time Retire Auto Submission
  useEffect(() => {
    if (timeLeft === 0) {
      navigate("/result", {
        state: {
          score,
          totalQuestions: questions.length,
          answeredQuestions,
          questions,
          config: {
            category: routeState?.category,
            difficulty: routeState?.difficulty,
          },
        },
      });
    }
  }, [timeLeft]);

  // Alert
  useEffect(() => {
    if (timeLeft <= 60 && timeLeft > 0) {
      setShowTimeAlert(true);
    } else {
      setShowTimeAlert(false);
    }
  }, [timeLeft]);

  // API Fetch with Caching
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null); // Reset error state on new fetch attempt
      const cacheKey = `trivia-${category}-${difficulty}`;
      const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}`;
      const maxRetries = 5;

      try {
        // 1. Check cache first
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setQuestions(JSON.parse(cached));
          setAnsweredQuestions(Array(10).fill(null));
          setIsLoading(false);
          return;
        }

        // 2. API fetch with retries
        let attempt = 0;
        let lastError = null;

        while (attempt < maxRetries) {
          try {
            // Exponential backoff delay
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * Math.pow(2, attempt))
            );

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            if (!data.results || data.response_code !== 0) {
              throw new Error(
                data.response_code === 1
                  ? "No questions available"
                  : "Invalid API response"
              );
            }

            // Success case
            sessionStorage.setItem(cacheKey, JSON.stringify(data.results));
            setQuestions(data.results);
            setAnsweredQuestions(Array(data.results.length).fill(null));
            setIsLoading(false);
            return;
          } catch (err) {
            lastError = err;
            if (attempt === maxRetries - 1) throw err;
            attempt++;
          }
        }
      } catch (err) {
        setError(err.message);
        // Provide fallback mock data if needed
        if (questions.length === 0) {
          setQuestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    // Error handling
    // error && (
    //   <Alert variant="danger">
    //     {error.message}
    //     {error.isRetryable && (
    //       <Button
    //         variant="link"
    //         onClick={() => window.location.reload()}
    //         className="ms-2"
    //       >
    //         Retry Now
    //       </Button>
    //     )}
    //     <Button
    //       variant="primary"
    //       onClick={() => navigate("/")}
    //       className="ms-2"
    //     >
    //       Change Settings
    //     </Button>
    //   </Alert>
    // );

    fetchQuestions();
  }, [category, difficulty]);

  // Shuffle answers when question changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const { correct_answer, incorrect_answers } =
        questions[currentQuestionIndex];
      setShuffledAnswers(
        [...incorrect_answers, correct_answer].sort(() => Math.random() - 0.5)
      );
      setSelectedAnswer(answeredQuestions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questions]);

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Handle Selected Answer
  const handleAnswerSelect = (answer) => {
    const currentCorrectAnswer = questions[currentQuestionIndex].correct_answer;
    const previousAnswer = answeredQuestions[currentQuestionIndex];

    const newAnswers = [...answeredQuestions];
    newAnswers[currentQuestionIndex] = answer;
    setAnsweredQuestions(newAnswers);
    setSelectedAnswer(answer);

    setScore((prev) => {
      // Case 1: Changed from correct to incorrect
      if (
        previousAnswer === currentCorrectAnswer &&
        answer !== currentCorrectAnswer
      ) {
        return prev - 1;
      }
      // Case 2: Changed from incorrect to correct
      else if (
        previousAnswer !== currentCorrectAnswer &&
        answer === currentCorrectAnswer
      ) {
        return prev + 1;
      }
      // Case 3: New answer (no previous selection)
      else if (previousAnswer === null && answer === currentCorrectAnswer) {
        return prev + 1;
      }
      // Case 4: All other scenarios (no score change)
      return prev;
    });
  };

  // Handle Question Advance
  const handleQuestionAdvance = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Normal question navigation
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Last question submission
      navigate("/result", {
        state: {
          score,
          totalQuestions: questions.length,
          answeredQuestions,
          questions,
          config: {
            // Quiz Configuration Routes
            category: routeState?.category,
            difficulty: routeState?.difficulty,
          },
        },
      });
    }
  };

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">
          Error: {error}
          <div className="mt-2">
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              className="me-2"
            >
              Change Settings
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle">
        <div className="spinner-border text-primary text-center" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light p-2 p-md-0" id="quiz-screen">
      <div className="row">
        <div className="col-sm-12 col-md-12 p-2 p-md-4 position-relative "></div>
        {/* Header Section */}
        <div className="col-sm-12 col-md-12 p-3 d-flex justify-content-center align-items-center  ">
          <div className="container p-2 d-flex justify-content-between align-items-center ">
            <Button
              variant="primary rounded-pill px-4 border-2 d-none d-md-block"
              onClick={() => navigate("/")}
              size="sm"
            >
              <span className="fs-6">Home</span>
            </Button>

            <div className="bg-light p-2 rounded fw-medium">
              <span className="">Time Remaining:</span>
              <span className={`"  "${timeLeft <= 60 ? "text-danger" : ""}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <Button
              variant="outline-danger rounded-pill px-3 px-md-4 border-2  "
              onClick={() =>
                navigate("/result", { state: { score, cancelled: true } })
              }
              size="sm"
            >
              <span className="fs-6">Cancel Quiz</span>
            </Button>
          </div>
        </div>
        {/* Question Area */}
        <div className="col-12 p-2 p-md-4 d-flex flex-column justify-content-start align-items-center ">
          <div className="container p-2 position-relative d-flex justify-content-center align-items-center">
            {" "}
            {/* Alert */}
            {timeLeft <= 60 && (
              <div
                className="alert alert-warning alert-dismissible fade show p-5 w-50 mt-4 d-flex justify-content-center align-items-center position-absolute "
                role="alert"
              >
                <strong>Less Than One Minute Remaining!</strong>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            )}
          </div>
          <div className="container p-3 p-md-4 bg-white rounded-2">
            <h5 className="text-muted">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h5>
            <p className="card-text fs-4">
              {decodeHtml(questions[currentQuestionIndex]?.question)}
            </p>
          </div>
        </div>
        <div className="col-12 p-2 p-md-4  d-flex justify-content-start align-items-center">
          <div className="container p-3 p-md-4 bg-white rounded-2">
            <Form>
              {shuffledAnswers.map((answer, index) => (
                <Form.Check
                  key={index}
                  type="radio"
                  name="quiz-options"
                  id={`quiz-option-${index}`}
                  label={decodeHtml(answer)}
                  checked={selectedAnswer === answer}
                  onChange={() => handleAnswerSelect(answer)}
                  className="py-3 fs-5"
                />
              ))}
            </Form>
          </div>
        </div>

        <div className="col-12 p-2  ">
          <div className="container p-2 rounded-2 d-flex justify-content-between align-items-center  ">
            <Button
              variant="warning rounded-pill px-3 px-md-4 border-2"
              onClick={() => {
                setCurrentQuestionIndex((prev) => prev - 1);
                setSelectedAnswer(answeredQuestions[currentQuestionIndex - 1]);
              }}
              disabled={currentQuestionIndex === 0}
            >
              {" "}
              <span className="fs-6">← Previous</span>
            </Button>
            <Button
              variant="primary px-3 px-md-4 rounded-pill border-2"
              onClick={handleQuestionAdvance}
              disabled={!answeredQuestions[currentQuestionIndex]}
            >
              {currentQuestionIndex === questions.length - 1
                ? "Submit Quiz"
                : "Next →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
