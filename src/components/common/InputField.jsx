import { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

const InputField = ({
  name,
  label,
  onChange,
  onBlur,
  type,
  disabled = false,
  placeholder,
  value,
  required,
  max,
  min,
  error,
  className,
  accept,
  onKeyDown,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="inputLabel" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          type={passwordVisible ? "text" : type || "text"}
          disabled={disabled}
          name={name}
          max={max}
          min={min}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`inputField mt-1 ${error ? "border-red-500" : ""}`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          accept={accept}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 py-2"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        )}
        {type === "username" && (
          <button className="absolute inset-y-0 right-0 px-3 py-2">
            <UserIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default InputField;
