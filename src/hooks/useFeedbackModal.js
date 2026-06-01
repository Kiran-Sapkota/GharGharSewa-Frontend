import { useState, useCallback } from "react";

const initialState = {
  open: false,
  variant: "success",
  title: "",
  message: "",
  onConfirm: null,
};

export const useFeedbackModal = () => {
  const [feedback, setFeedback] = useState(initialState);

  const close = useCallback(() => {
    setFeedback((prev) => ({ ...prev, open: false }));
  }, []);

  const show = useCallback((variant, title, message, onConfirm) => {
    setFeedback({
      open: true,
      variant,
      title,
      message: message || "",
      onConfirm: onConfirm || null,
    });
  }, []);

  const showSuccess = useCallback(
    (title, message, onConfirm) => show("success", title, message, onConfirm),
    [show]
  );

  const showError = useCallback(
    (title, message, onConfirm) => show("error", title, message, onConfirm),
    [show]
  );

  const showWarning = useCallback(
    (title, message, onConfirm) => show("warning", title, message, onConfirm),
    [show]
  );

  return {
    feedback,
    close,
    show,
    showSuccess,
    showError,
    showWarning,
  };
};
