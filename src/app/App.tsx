import React, { useState, FormEvent } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Answers from "../components/Answers/Answers";
import data from "../data/questions.json";
import { API_ENDPOINT } from "../constants";
import { PossibleAnswers } from "../data/types";
import "./App.css";

const QUESTIONNAIRE_STATE = {
  NOT_STARTED: -1,
  STARTED: 0,
};
const { NOT_STARTED, STARTED } = QUESTIONNAIRE_STATE;

export interface Question {
  id: number;
  questionType: string;
  required: boolean;
  question: string;
  answers?: string[];
  selectedAnswers?: PossibleAnswers;
}

const App = () => {
  const [stage, setStage] = useState(NOT_STARTED);
  const [questions, setQuestions] = useState<Question[]>(data);
  const [showErrorForRequired, setShowErrorForRequired] = useState(false);

  const startedQuestionnaire = stage >= STARTED;
  const reachedEndOfQuestionnaire = stage === questions.length;
  const currQuestion = startedQuestionnaire && questions[stage];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const answers = questions.map(
        ({ id, question, selectedAnswers }) => {
          return {
            id,
            question,
            selectedAnswers: selectedAnswers ?? [],
          };
        }
      );
      await axios.post(`${API_ENDPOINT}/answers`, { answers });
      alert("Submit Success! Thank you for your answers!");
    } catch (err) {
      alert("There was an error submitting your answers. Please try again.");
    }
  };

  const onStartButtonClick = () => setStage(STARTED);

  const onNextButtonClick = () => {
    const notFilledOutRequiredQuestion =
      currQuestion &&
      currQuestion.required &&
      (currQuestion?.selectedAnswers === undefined ||
        (Array.isArray(currQuestion.selectedAnswers) &&
          !currQuestion.selectedAnswers.length));
    if (notFilledOutRequiredQuestion) {
      setShowErrorForRequired(true);
    } else if (stage < questions.length) {
      setShowErrorForRequired(false);
      setStage(stage + 1);
    }
  };

  const onBackButtonClick = () => startedQuestionnaire && setStage(stage - 1);

  const onUpdateAnswers = (selectedAnswers: PossibleAnswers) => {
    setShowErrorForRequired(false);
    const newQuestions = questions.map((question, index) => {
      if (index === stage) {
        return {
          ...question,
          selectedAnswers,
        };
      }
      return question;
    });
    setQuestions(newQuestions);
  };

  return (
    <div className="app">
      {stage === NOT_STARTED && (
        <div>
          <h1>
            {questions.length ? "Welcome to our Questionnaire!" : "Loading..."}
          </h1>
          <Button onClick={onStartButtonClick}>Start</Button>
        </div>
      )}
      {startedQuestionnaire && (
        <form onSubmit={onSubmit}>
          {currQuestion && (
            <>
              <div className="container">
                <h3>{currQuestion.question}</h3>
                {currQuestion.required && (
                  <p className={showErrorForRequired ? "error_text" : ""}>
                    This is a mandatory question, you need to answer to move on.
                  </p>
                )}
              </div>
              <Answers
                questionType={currQuestion.questionType}
                answers={currQuestion.answers}
                onUpdateAnswers={onUpdateAnswers}
                userAnswers={currQuestion.selectedAnswers}
              />
            </>
          )}
          {reachedEndOfQuestionnaire && (
            <div className="container">
              <h3>
                Thank you for filling out this questionnaire, please confirm
                your answers before submitting
              </h3>
              <Button type="submit">Submit</Button>
            </div>
          )}
          <div className="action_btns">
            <Button onClick={onBackButtonClick}>Back</Button>
            {!reachedEndOfQuestionnaire && (
              <Button onClick={onNextButtonClick}>Next</Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default App;
