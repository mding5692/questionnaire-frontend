import React from "react";
import * as axios from "axios";
import { act } from "react-dom/test-utils";
import { render, screen, fireEvent } from "@testing-library/react";

import App from "./App";

jest.mock("axios");

const WELCOME_MSG = "Welcome to our Questionnaire!";
const QUESTION_ONE = "What is your name?";
const QUESTION_TWO = "Hullo?";
const QUESTION_THREE = "RANDOM TEXT?";
const QUESTION_FOUR =
  "The following is a list of the 5 most common causes of death in the United States. Which of the following is NOT one of the 5 most common causes of death in the United States?";
const QUESTION_FIVE = "What is your favorite colour?";
const QUESTION_SIX = "What is your favorite food?";
const MANDATORY_QUESTION_REMINDER =
  "This is a mandatory question, you need to answer to move on.";
const ENDING_MSG = "Thank you for filling out this questionnaire, please confirm your answers before submitting";

// For testing, question 1-3 are mandatory questions, question 4-6 are optional questions
describe("Questionnaire App Frontend", () => {
  it("renders start page", () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });
    const welcomeMsg = screen.getByText(WELCOME_MSG);
    expect(startButton).toBeInTheDocument();
    expect(welcomeMsg).toBeInTheDocument();
  });

  it("starts questionnaire when press start button", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });
    expect(startButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(startButton);
    });
    const question = await screen.findByText(QUESTION_ONE);
    expect(question).toBeInTheDocument();
    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeInTheDocument();
  });

  // First question is mandatory question
  it("renders error message when press next button without filling in mandatory question 1", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });
    expect(startButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(startButton);
    });
    const nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const errorMessage = await screen.findByText(MANDATORY_QUESTION_REMINDER);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("error_text");
  });

  it("can select from dropdown on question 1", () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });
    expect(startButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    expect(dropdown).toHaveTextContent("Heart disease");
  });

  it("can move on when press next button with filling in mandatory dropdown question 1 and see question 2", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });
    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    expect(dropdown).toHaveTextContent("Heart disease");
    const nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const question = await screen.findByText(QUESTION_TWO);
    expect(question).toBeInTheDocument();
  });

  it("can move back when press previous button to see question 1", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });
    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    act(() => {
      fireEvent.mouseDown(options[0]);
      fireEvent.click(options[0]);
    });
    const nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const previousButton = screen.getByRole("button", { name: /back/i });
    act(() => {
      fireEvent.click(previousButton);
    });

    const question = await screen.findByText(QUESTION_ONE);
    expect(question).toBeInTheDocument();
  });

  it("can move back when press previous button and see previous stored answer for question 1", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });
    act(() => {
      fireEvent.click(startButton);
    });
    let dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    act(() => {
      fireEvent.mouseDown(options[0]);
      fireEvent.click(options[0]);
    });
    expect(dropdown).toHaveTextContent("Heart disease");
    const nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const previousButton = screen.getByRole("button", { name: /back/i });
    act(() => {
      fireEvent.click(previousButton);
    });

    const question = await screen.findByText(QUESTION_ONE);
    expect(question).toBeInTheDocument();
    dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    expect(dropdown).toHaveTextContent("Heart disease");
  });

  it("click on checkboxes multiple times in question 2 and display selected answers", () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });
    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    const nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    act(() => {
      checkboxes[0].click();
    });
    expect(checkboxes[0]).toBeChecked();
    act(() => {
      checkboxes[0].click();
    });
    expect(checkboxes[0]).not.toBeChecked();
    act(() => {
      checkboxes[0].click();
      checkboxes[1].click();
    });
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it("can move on when press next button with filling in mandatory checkbox question 2 and see question 3", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });

    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    let nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const checkboxes = screen.getAllByRole("checkbox");
    act(() => {
      checkboxes[0].click();
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const question = await screen.findByText(QUESTION_THREE);
    expect(question).toBeInTheDocument();
  });

  it("will see error message when press next button without filling in mandatory checkbox question 2", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });

    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    let nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const errorMessage = await screen.findByText(MANDATORY_QUESTION_REMINDER);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("error_text");
  });

  it("can move on when press next button with filling in mandatory textbox question 3 and see question 4", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });

    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    let nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const checkboxes = screen.getAllByRole("checkbox");
    act(() => {
      checkboxes[0].click();
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    expect(input).toHaveValue("test");
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const question = await screen.findByText(QUESTION_FOUR);
    expect(question).toBeInTheDocument();
  });

  it("displays error message if not fill in mandatory question 3 and press next button", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });

    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    let nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const checkboxes = screen.getAllByRole("checkbox");
    act(() => {
      checkboxes[0].click();
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const errorMessage = await screen.findByText(MANDATORY_QUESTION_REMINDER);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("error_text");
  });

  it("can skip question 4 when press next button without filling in optional dropdown question 4 and see question 5", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });

    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    let nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const checkboxes = screen.getAllByRole("checkbox");
    act(() => {
      checkboxes[0].click();
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const question = await screen.findByText(QUESTION_FIVE);
    expect(question).toBeInTheDocument();
  });

  it("can display question 5 when press next button after filling in optional dropdown question 4", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });

    act(() => {
      fireEvent.click(startButton);
    });
    let dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    let options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    let nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const checkboxes = screen.getAllByRole("checkbox");
    act(() => {
      checkboxes[0].click();
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    expect(dropdown).toHaveTextContent("Heart disease");
    act(() => {
      fireEvent.click(nextButton);
    });
    const question = await screen.findByText(QUESTION_FIVE);
    expect(question).toBeInTheDocument();
  });

  it("can skip question 5 when press next button without filling in optional dropdown question 4 and 5 and see question 6", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });

    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    let nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const checkboxes = screen.getAllByRole("checkbox");
    act(() => {
      checkboxes[0].click();
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const question = await screen.findByText(QUESTION_SIX);
    expect(question).toBeInTheDocument();
  });

  it("can display question 6 when press next button after filling in optional dropdown question 5", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });

    act(() => {
      fireEvent.click(startButton);
    });
    let dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    let options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    let nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    let checkboxes = screen.getAllByRole("checkbox");
    act(() => {
      checkboxes[0].click();
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    expect(dropdown).toHaveTextContent("Heart disease");
    act(() => {
      fireEvent.click(nextButton);
    });
    checkboxes = screen.getAllByRole("checkbox");
    act(() => {
      checkboxes[0].click();
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const question = await screen.findByText(QUESTION_SIX);
    expect(question).toBeInTheDocument();
  });

  it("can skip question 6 when press next button without filling in optional dropdown question 4 and 5 and see last page", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });

    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    let nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const checkboxes = screen.getAllByRole("checkbox");
    act(() => {
      checkboxes[0].click();
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const endingMsg = await screen.findByText(ENDING_MSG);
    expect(endingMsg).toBeInTheDocument();
  });

  it("should be able to submit and also see a submission result modal", async () => {
    render(<App />);
    const startButton = screen.getByRole("button", { name: /start/i });

    act(() => {
      fireEvent.click(startButton);
    });
    const dropdown = screen.getAllByRole("button")[0];
    expect(dropdown).toHaveClass("MuiSelect-select");
    fireEvent.mouseDown(dropdown);
    const options = screen.getAllByRole("option");
    fireEvent.mouseDown(options[0]);
    act(() => {
      fireEvent.click(options[0]);
    });
    let nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const checkboxes = screen.getAllByRole("checkbox");
    act(() => {
      checkboxes[0].click();
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    nextButton = screen.getByRole("button", { name: /next/i });
    act(() => {
      fireEvent.click(nextButton);
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });
    act(() => {
      fireEvent.click(submitButton);
    });
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });
});
