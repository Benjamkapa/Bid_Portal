import React from "react";

interface ButtonProps {
  text?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  width?: string;
  color?: string;
  textColor?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text = "Submit",
  onClick,
  isLoading = false,
  width = "w-full",
  color = "bg-[#e62126]",
  textColor = "text-white",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${width} ${color} ${textColor} py-2 px-4 rounded-lg font-semibold flex items-center justify-center transition duration-300 ease-in-out cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Loading...</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;