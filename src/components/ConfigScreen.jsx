import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Header from "./Header";
import Footer from "./Footer";

const ConfigScreen = () => {
  const [categories, setCategories] = useState([
    { id: 9, name: "General Knowledge" },
    { id: 10, name: "Books" },
    { id: 11, name: "Films" },
    { id: 12, name: "Music" },
    { id: 14, name: "Television" },
    { id: 15, name: "Video Games" },
    { id: 17, name: "Science & Nature" },
    { id: 18, name: "Computers" },
    { id: 19, name: "Mathematics" },
    { id: 20, name: "Mythology" },
    { id: 21, name: "Sports" },
    { id: 22, name: "Geography" },
    { id: 23, name: "History" },
    { id: 24, name: "Politics" },
    { id: 25, name: "Art" },
    { id: 26, name: "Celebrities" },
    { id: 27, name: "Animals" },
    { id: 28, name: "Vehicles" },
    { id: 29, name: "Comics" },
    { id: 30, name: "Gadgets" },
    { id: 31, name: "Japanese Anime & Manga" },
    { id: 32, name: "Cartoon & Animations" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("9");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://opentdb.com/api_category.php");
        const data = await response.json();
        setCategories(data.trivia_categories || categories); // Fallback to default if API fails
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleStartQuiz = () => {
    navigate("/quiz", {
      state: {
        category: selectedCategory,
        difficulty: selectedDifficulty,
      },
    });
  };

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
    <>
      <Nav />
      <div className="container-fluid">
        <div className="row">
          <Header />
          <div className="col-sm-12 col-md-12 p-2 p-md-3">
            <div className="container p-2 p-md-4 "></div>
          </div>
          <div className="col-sm-12 col-md-6 offset-md-3 p-4 d-flex flex-column justify-content-center align-items-center">
            <div className="container p-2 py-3">
              <h5>Please Select Quiz Category</h5>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={isLoading}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="container p-2 py-3">
              <h5>Please Select Difficulty Level</h5>
              <select
                className="form-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="container p-2 py-3">
              <button
                className="btn btn-primary px-4 rounded-pill border-2"
                onClick={handleStartQuiz}
                disabled={!selectedCategory || !selectedDifficulty}
              >
                Start Quiz
              </button>
            </div>
          </div>
          <div className="col-sm-12 col-md-12 p-2 p-md-3 ">
            <div className="container p-2 p-md-4 "></div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ConfigScreen;
