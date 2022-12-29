import React from "react";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import Button from "@mui/material/Button/Button";

type QuestionChoiceProps = {
  id: string;
  text: string;
  shouldShowAsSelected: boolean;
  shouldShowAsIncorrect: boolean;
  shouldShowAsCorrect: boolean;
  onClick: (id: string) => void;
};

const QuestionChoice: React.FC<QuestionChoiceProps> = ({
  id,
  text,
  shouldShowAsSelected,
  shouldShowAsCorrect,
  shouldShowAsIncorrect,
  onClick,
}) => {
  const sx: SxProps<Theme> = {
    mr: 1,
    mt: 1,
  };

  let color: "primary" | "error" | "success" = "primary";

  let variant: "outlined" | "contained" = "outlined";

  if (shouldShowAsSelected) {
    variant = "contained";
  }

  if (shouldShowAsCorrect) {
    color = "success";
    variant = "contained";
  }

  if (shouldShowAsIncorrect) {
    color = "error";
    variant = "contained";
  }

  const handleClick = () => {
    onClick(id);
  };

  return (
    <Button
      sx={sx}
      color={color}
      variant={variant}
      onClick={handleClick}
      fullWidth
    >
      {text}
    </Button>
  );
};

export default QuestionChoice;
