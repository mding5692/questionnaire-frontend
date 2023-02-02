import React from "react";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";

import { PossibleAnswers } from "../../data/types";
import { QUESTION_TYPES } from "../../data/constants";

interface Props {
  questionType: string;
  answers?: string[];
  userAnswers?: PossibleAnswers;
  onUpdateAnswers: (answers: PossibleAnswers) => void;
}

interface BooleanBtnProps {
  label: string;
  onClick: () => void;
  selected: boolean;
}

const { TEXTBOX, BOOLEAN, DROPDOWN, CHECKBOX } = QUESTION_TYPES;

const BooleanBtn = ({ label, onClick, selected }: BooleanBtnProps) => (
  <Button
    onClick={onClick}
    color={selected ? "success" : "primary"}
    variant="contained"
  >
    {label}
  </Button>
);

const Answers = ({
  questionType,
  answers = [],
  userAnswers = [],
  onUpdateAnswers,
}: Props) => {
  const onCheckboxChange = (isPreviouslyChecked: boolean, answer: string) => {
    if (typeof userAnswers === "boolean") {
      return;
    }
    console.log(userAnswers);
    const newAnswers = isPreviouslyChecked
      ? userAnswers.filter((a) => a !== answer)
      : [...userAnswers, answer];
    onUpdateAnswers(newAnswers);
  };

  const onSelectChange = (e: SelectChangeEvent) => {
    const selectedAnswer = e?.target?.value ?? "";
    onUpdateAnswers(selectedAnswer ? [selectedAnswer] : []);
  };

  return (
    <div>
      {questionType === TEXTBOX && (
        <TextField
          id="outlined-multiline-static"
          label="Your answer here"
          multiline
          rows={4}
          value={Array.isArray(userAnswers) ? userAnswers[0] : ""}
          onChange={(e) => onUpdateAnswers(e.target.value? [e.target.value]: [])}
        />
      )}
      {questionType === BOOLEAN && (
        <>
          <BooleanBtn
            selected={userAnswers === true}
            label="True"
            onClick={() => onUpdateAnswers(true)}
          />
          <BooleanBtn
            selected={userAnswers === false}
            label="False"
            onClick={() => onUpdateAnswers(false)}
          />
        </>
      )}
      {questionType === DROPDOWN && (
        <>
          <InputLabel id="demo-simple-select-label">
            Choose the best answer that applies
          </InputLabel>
          <Select
            value={
              Array.isArray(userAnswers) && userAnswers.length
                ? userAnswers[0]
                : ""
            }
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
