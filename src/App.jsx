import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import ConfigScreen from "./components/ConfigScreen";
import QuizScreen from "./components/QuizScreen";
import ResultsScreen from "./components/ResultsScreen";
import ReviewScreen from "./components/ReviewScreen";

const App = () => {
  return (
    <>
      {/* <Nav /> */}
      <Routes>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/" element={<ConfigScreen />}></Route>
        <Route path="/quiz" element={<QuizScreen />}></Route>
        <Route path="/result" element={<ResultsScreen />}></Route>
        <Route path="/review" element={<ReviewScreen />} />
      </Routes>
    </>
  );
};

export default App;
