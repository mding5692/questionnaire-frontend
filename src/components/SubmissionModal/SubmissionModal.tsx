import Dialog from "@mui/material/Dialog";

import "./SubmissionModal.css";

export interface SubmissionModalState {
  open: boolean;
  isError: boolean;
}

export interface Props extends SubmissionModalState {
    setShowModalState: (state: SubmissionModalState) => void;
}

export const SubmissionModal = ({ open, isError, setShowModalState }: Props) => (
  <Dialog
    open={open}
    onClose={() => setShowModalState({ open: false, isError: false })}
  >
    <div className="submission_modal">
      {isError ? (
        <>
          <h2 className="error_text">ERROR</h2>
          <p>There was an error submitting, please try again!</p>
        </>
      ) : (
        <>
          <h2 className="success_text">SUCCESS</h2>
          <p>Your form was submitted successfully!</p>
        </>
      )}
    </div>
  </Dialog>
);
