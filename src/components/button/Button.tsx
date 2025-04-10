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
        <span className='flex items-center'>
          <span className='animate-spin mr-2'>
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
            </svg>
          </span>
          Wait...
        </span>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;