import React, { useState, FormEvent } from "react";
import Button from "@mui/material/Button";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Answers from "../components/Answers/Answers";
import data from "../data/questions.json";
import { PossibleAnswers } from "../data/types";
import "./App.css";

const QUESTIONNAIRE_NOT_STARTED = -1;

export interface Question {
  questionType: string;
  required: boolean;
  question: string;
  answers?: string[];
  selectedAnswers?: PossibleAnswers;
}

type Questions = Question[];

const App = () => {
  const [stage, setStage] = useState(QUESTIONNAIRE_NOT_STARTED);
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
    if (stage >= 0) {
      setStage(stage - 1);
    }
  };

  const onUpdateAnswers = (answers: PossibleAnswers) => {
    const newQuestions = questions.map((question, index) => {
      if (index === stage) {
        return {
          ...question,
          selectedAnswers: answers,
        };
      }
      return question;
    });
    setQuestions(newQuestions);    
  };

  console.log(stage);
  const currQuestion = QUESTIONNAIRE_NOT_STARTED && questions[stage];

  return (
    <div className="app">
      <form onSubmit={onSubmit}>
        <div className="question">
          {!questions.length && <h1>Loading...</h1>}
          {questions.length && stage < questions.length && (
            <h3>
              {stage === QUESTIONNAIRE_NOT_STARTED
                ? "Welcome to our Questionnaire!"
                : currQuestion.question}
            </h3>
          )}
          {stage === QUESTIONNAIRE_NOT_STARTED && (
            <Button onClick={onNextButtonClick}>Start</Button>
          )}
          {currQuestion?.required && (
            <p>This is a mandatory question, you need to answer to move on.</p>
          )}
        </div>
        {stage >= 0 && stage < questions.length && (
          <Answers
            questionType={currQuestion.questionType}
            answers={currQuestion.answers}
            onUpdateAnswers={onUpdateAnswers}
            userAnswers={currQuestion.selectedAnswers}
          />
        )}
        {stage === questions.length && <Button type="submit">Submit</Button>}
        {stage >= 0 && (
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
