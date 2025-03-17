import React from "react";

const Button = ({ children, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
