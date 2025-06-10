import React from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import ConfigScreen from "./components/ConfigScreen";
import SignUp from "./components/SignUp";
import TermsConditions from "./components/TermsConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import SignIn from "./components/SignIn";
import PasswordReset from "./components/PasswordReset";
import QuizScreen from "./components/QuizScreen";
import ResultsScreen from "./components/ResultsScreen";
import ReviewScreen from "./components/ReviewScreen";
import { AuthProvider } from "./context/AuthContext";
import AccountManagement from "./components/AccountManagement";
const App = () => {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ConfigScreen />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/terms&conditions" element={<TermsConditions />}></Route>
          <Route path="/privacy" element={<PrivacyPolicy />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/pass" element={<PasswordReset />} />
          <Route path="/quiz" element={<QuizScreen />}></Route>
          <Route path="/result" element={<ResultsScreen />}></Route>
          <Route path="/review" element={<ReviewScreen />} />
          <Route path="/account" element={<AccountManagement />} />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;
