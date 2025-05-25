// Import axios
import axios from "axios";

// Fetch categories
export const fetchCategories = () =>
  axios.get("https://opentdb.com/api_category.php");

// Fest questions
export const fetchQuestions = (difficulty, category) =>
  axios.get(
    `https://opentdb.com/api.php?amount=10&type=multiple&difficulty=${difficulty}&category=${category}`
  );
