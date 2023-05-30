import React from "react";
import Button from "@mui/material/Button";

interface Props {
  children: string;
  variant?: "text" | "contained" | "outlined";
  onClick: () => void;
}

const MyButton = ({ children, variant = "text", onClick }: Props) => {
  return (
    <div>
      <Button variant={variant} onClick={onClick}>
        {children}
      </Button>
    </div>
  );
};

export default MyButton;
