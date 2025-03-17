import React from "react";

const Input = ({ label, type = "text", value, onChange, placeholder, className = "" }) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    </div>
  );
};

export default Input;
