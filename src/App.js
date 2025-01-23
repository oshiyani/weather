import React, { useEffect, useState } from 'react';
import './App.css';
import data from './question.json';
import correctSound from './asset/correct.mp3';
import wrongSound from './asset/wrong.mp3';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectOption, setSelectOption] = useState(null);
  const [timer, setTimer] = useState(10);
  const [showScore, setShowScore] = useState(false);

  const correctAudio = new Audio(correctSound);
  const wrongAudio = new Audio(wrongSound);

  useEffect(() => {
    let interval;

    if (!showScore && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleNextQuestion();
    }

    return () => clearInterval(interval);
  }, [timer, showScore]);

  const handleOption = (option) => {
    setSelectOption(option);

    if (option === data[currentQuestion].correctOption) {
      setScore((prev) => prev + 1);
      correctAudio.play();
    } else {
      wrongAudio.play();
    }

    setTimeout(() => handleNextQuestion(), 1000); 
  };

  const handleNextQuestion = () => {
    setSelectOption(null);
    if (currentQuestion < data.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimer(10);
    } else {
      setShowScore(true); 
    }
  };


  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectOption(null);
    setTimer(10);
    setShowScore(false);
  };

  return (
    <div className="app">
      {showScore ? (
        <div className="score-section">
          <h2>Your Final Score: {score}/{data.length}</h2>
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      ) : (
        <>
          <div className="question-section">
            <h2>Question {currentQuestion + 1}</h2>
            <p>{data[currentQuestion].question}</p>

            <div className="options">
              {data[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOption(option)}
                  style={{
                    backgroundColor:
                      selectOption === option
                        ? option === data[currentQuestion].correctOption
                          ? 'green'
                          : 'red'
                        : '',
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="timer">
              Time left: <span>{timer}s</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;