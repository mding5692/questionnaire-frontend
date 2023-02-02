import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import Answers, { Props } from "./Answers";
import { PossibleAnswers } from "../../data/types";
import { QUESTION_TYPES } from "../../data/constants";

const multipleStringAnswers = ["answer1", "answer2", "answer3"];

const defaultProps: Props = {
  questionType: QUESTION_TYPES.TEXTBOX,
  onUpdateAnswers: (answers: PossibleAnswers) => {},
};

describe("answers component", () => {
  it("renders TEXTBOX answers component", () => {
    render(<Answers {...defaultProps} questionType={QUESTION_TYPES.TEXTBOX} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
  });

  it("can fill in TEXTBOX answers component", () => {
    render(<Answers {...defaultProps} questionType={QUESTION_TYPES.TEXTBOX} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    expect(input).toHaveValue("test");
  });

  it("can fill in and empty TEXTBOX answers component", () => {
    render(<Answers {...defaultProps} questionType={QUESTION_TYPES.TEXTBOX} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue("");
  });

  it("renders DROPDOWN answers component with multiple string answers", () => {
    render(
      <Answers
        {...defaultProps}
        questionType={QUESTION_TYPES.DROPDOWN}
        answers={multipleStringAnswers}
      />
    );
    const dropdown = screen.getByRole("button");
    expect(dropdown).toHaveClass("MuiSelect-select");
  });

  it("able to open up DROPDOWN answers component with multiple string answers and see answers", () => {
    render(
      <Answers
        {...defaultProps}
        questionType={QUESTION_TYPES.DROPDOWN}
        answers={multipleStringAnswers}
      />
    );
    const dropdown = screen.getByRole("button");
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    const optionValues = options.map((li) => li.getAttribute("data-value"));
    expect(optionValues).toEqual(multipleStringAnswers);
  });

  it("display previously selected answer in DROPDOWN answers component with multiple string answers", () => {
    render(
      <Answers
        {...defaultProps}
        questionType={QUESTION_TYPES.DROPDOWN}
        answers={multipleStringAnswers}
        userAnswers={["answer1"]}
      />
    );
    const dropdown = screen.getByRole("button");
    expect(dropdown).toHaveClass("MuiSelect-select");
    expect(dropdown).toHaveTextContent("answer1");
  });

  it("renders unchecked CHECKBOX answers component with multiple choice answers", () => {
    render(
      <Answers
        {...defaultProps}
        questionType={QUESTION_TYPES.CHECKBOX}
        answers={multipleStringAnswers}
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it("displays previously selected answers in CHECKBOX answers component with multiple choice answers", () => {
    render(
      <Answers
        {...defaultProps}
        questionType={QUESTION_TYPES.CHECKBOX}
        answers={multipleStringAnswers}
        userAnswers={["answer1", "answer2"]}
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });
});
