import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";

import { PossibleAnswers } from "../../data/types";
import { QUESTION_TYPES } from "../../data/constants";

export interface Props {
  questionType: string;
  answers?: string[];
  userAnswers?: PossibleAnswers;
  onUpdateAnswers: (answers: PossibleAnswers) => void;
}

const { TEXTBOX, DROPDOWN, CHECKBOX } = QUESTION_TYPES;

const Answers = ({
  questionType,
  answers = [],
  userAnswers = [],
  onUpdateAnswers,
}: Props) => {
  const onCheckboxChange = (isPreviouslyChecked: boolean, answer: string) => {
    const newAnswers = isPreviouslyChecked
      ? userAnswers.filter((a) => a !== answer)
      : [...userAnswers, answer];
    onUpdateAnswers(newAnswers);
  };

  const onSelectChange = (e: SelectChangeEvent) => {
    const selectedAnswer = e?.target?.value ?? "";
    onUpdateAnswers(selectedAnswer ? [selectedAnswer] : []);
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let textAnswer = e?.target?.value ?? "";
    textAnswer = textAnswer.trim();
    onUpdateAnswers(textAnswer ? [textAnswer] : []);
  };

  return (
    <div>
      {questionType === TEXTBOX && (
        <TextField
          id="outlined-multiline-static"
          label="Your answer here"
          multiline
          rows={4}
          value={userAnswers.length ? userAnswers[0] : ""}
          onChange={onTextChange}
        />
      )}
      {questionType === DROPDOWN && (
        <>
          <InputLabel>Choose the best answer that applies</InputLabel>
          <Select
            value={userAnswers.length ? userAnswers[0] : ""}
            onChange={onSelectChange}
          >
            {answers.map((answer) => (
              <MenuItem key={answer} value={answer}>
                {answer}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
      {questionType === CHECKBOX && (
        <>
          <p>Select all that apply</p>
          {answers.map((answer) => {
            let isChecked = false;
            if (Array.isArray(userAnswers)) {
              isChecked = userAnswers.includes(answer);
            }
            const FormCheckbox = () => (
              <Checkbox
                checked={isChecked}
                onChange={() => onCheckboxChange(isChecked, answer)}
              />
            );
            return (
              <FormControlLabel
                key={answer}
                control={<FormCheckbox />}
                label={answer}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default Answers;
