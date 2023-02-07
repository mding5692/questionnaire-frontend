import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { SubmissionModal, Props } from "./SubmissionModal";

const defaultProps: Props = {
    open: false,
    isError: false,
    setShowModalState: (state: { open: boolean; isError: boolean }) => {},
}

describe("submission modal component", () => {
    it("renders submission modal component but hides it", () => {
        render(<SubmissionModal {...defaultProps} />);
    })
    it("renders submission modal component but shows it with success", () => {
        render(<SubmissionModal {...defaultProps} open={true} />);
        const modal = screen.getByRole("dialog");
        expect(modal).toBeVisible();
        const successText = screen.getByText("SUCCESS");
        expect(successText).toBeVisible();
    })
    it("renders submission modal component but shows it with error", () => {
        render(<SubmissionModal {...defaultProps} open={true} isError={true} />);
        const modal = screen.getByRole("dialog");
        expect(modal).toBeVisible();
        const errorText = screen.getByText("ERROR");
        expect(errorText).toBeVisible();
    })
})