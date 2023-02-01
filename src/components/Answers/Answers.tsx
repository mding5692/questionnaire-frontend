import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

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
}

const { TEXTBOX, BOOLEAN, DROPDOWN, CHECKBOX } = QUESTION_TYPES;

const BooleanBtn = ({ label, onClick }: BooleanBtnProps) => (
  <Button className="boolean_btn" variant="contained">
    {label}
  </Button>
);

const Answers = ({
  questionType,
  answers = [],
  userAnswers = [],
  onUpdateAnswers,
}: Props) => {
  return (
    <div>
      {questionType === TEXTBOX && (
        <TextField
          id="outlined-multiline-static"
          label="Your answer here"
          multiline
          rows={4}
        />
      )}
      {questionType === BOOLEAN && (
        <>
          <BooleanBtn label="True" onClick={() => onUpdateAnswers(true)} />
          <BooleanBtn label="False" onClick={() => onUpdateAnswers(false)} />
        </>
      )}
      {questionType === DROPDOWN && (
        <Select>
          {answers.map((answer) => (
            <MenuItem key={answer} value={answer}>
              {answer}
            </MenuItem>
          ))}
        </Select>
      )}
      {questionType === CHECKBOX && (
        <>
          <p>Select all that apply</p>
          {answers.map((answer) => (
            <FormControlLabel control={<Checkbox />} label={answer} />
          ))}
        </>
      )}
    </div>
  );
};

export default Answers;
