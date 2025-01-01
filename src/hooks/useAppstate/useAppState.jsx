import { useState } from "react";

// Custom hook for managing app state
export function useAppState() {
  const [isTodoAppDisabled, setIsTodoAppDisabled] = useState(false);
  const [isCalcAppDisabled, setIsCalcAppDisabled] = useState(false);

  const handleError = (app) => {
    if (app === "todo") {
      setIsTodoAppDisabled(true);
    }
    if (app === "calc") {
      setIsCalcAppDisabled(true);
    }
  };

  const resetAppState = (app) => {
    if (app === "todo") {
      setIsTodoAppDisabled(false);
    }
    if (app === "calc") {
      setIsCalcAppDisabled(false);
    }
  };

  return {
    isTodoAppDisabled,
    isCalcAppDisabled,
    handleError,
    resetAppState,
  };
}
