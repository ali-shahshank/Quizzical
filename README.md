# Quizzical

**Quizzical** A professional quiz application built with React and Open Trivia DB API, featuring timed questions, detailed results, quiz review. Provides User Authentication with firebase Authentication along with Google Authentication. Highly optimized and functional with Mobile first strategy. More features and updates will be added in the future.

---

## Features

- **Quiz Customization**

  - Select by category from 23 options and 3 difficulty (Easy/Medium/Hard)
  - 10-question format with professional time limits
  - Auto quiz submission on time retire.

- **Interactive Game-play**

  - Shuffled multiple-choice answers
  - Progress tracking (Question X/10)

- **Results Analysis**

  - Score breakdown (Correct/Incorrect)
  - Percentage and visual progress bar
  - European grading standard (A-F)

- **Review System**
  - Quiz Review Screen
  - Persistent question history
  - Retry incorrect questions

---

## Technologies Used

- React 19 + Vite
- React Bootstrap
- Bootstrap 5 + Bootstrap Icons
- Open Trivia DB API
- Axios (API integration)
- Firebase Authentication
- Firestore Database

---

## Project Structure

```

.
├── App.jsx
├── components
│   ├── AccountManagement.jsx
│   ├── ConfigScreen.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Nav.jsx
│   ├── PasswordReset.jsx
│   ├── PrivacyPolicy.jsx
│   ├── QuizScreen.jsx
│   ├── ResultsScreen.jsx
│   ├── ReviewScreen.jsx
│   ├── SignIn.jsx
│   ├── SignUp.jsx
│   ├── TermsConditions.jsx
│   └── TestCases.jsx
├── context
│   └── AuthContext.jsx
├── index.css
├── main.jsx
└── utils
    ├── api.js
    ├── firebase.js
    └── firestore.js

```

---

## License

This project is licensed under the [MIT License](LICENSE).
