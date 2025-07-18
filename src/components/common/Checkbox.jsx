import React from "react";

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex gap-2 cursor-pointer">
      <input
        type="checkbox"
        className="form-checkbox text-secondary h-4 w-4 cursor-pointer"
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
