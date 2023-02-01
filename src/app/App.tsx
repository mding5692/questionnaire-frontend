import React, { useEffect, useState, FormEvent } from "react";
import Button from "@mui/material/Button";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Answers from "../components/Answers/Answers";
import data from "../data/questions.json";
import "./App.css";

export interface Question {
  questionType: string;
  required: boolean;
  question: string;
  answers?: string[];
}

type Questions = Question[];

type Answer = string | string[];

const App = () => {
  const [stage, setStage] = useState(0);
  const [answers, setAnswers] = useState<Answer>([]);
  const [questions, setQuestions] = useState<Questions>(data);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  const onNextButtonClick = () => {
    if (stage < questions.length) {
      setStage(stage + 1);
    }
  };

  const onBackButtonClick = () => {
    if (stage > 0) {
      setStage(stage - 1);
    }
  };

  const currQuestion = questions[stage];

  return (
    <div className="app">
      <form onSubmit={onSubmit}>
        <div className="question">
          {!questions.length && <h1>Loading...</h1>}
          {questions.length && stage < questions.length && (
            <h2>
              {stage === 0
                ? "Welcome to our Questionnaire!"
                : currQuestion.question}
            </h2>
          )}
        </div>
        <Answers questionType={currQuestion.questionType} answers={currQuestion.answers} />
        {stage === 0 && <Button onClick={onNextButtonClick}>Start</Button>}
        {stage === questions.length && <Button type="submit">Submit</Button>}
        {stage > 0 && (
          <div className="action_btns">
            <Button onClick={onBackButtonClick}>Back</Button>
            {stage < questions.length && (
              <Button onClick={onNextButtonClick}>Next</Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default App;
