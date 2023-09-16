import React from "react";

type Props = {
  state: string;
  title?: string;
  placeholder?: string;
  type?: string;
  isTextarea?: boolean;
  setState: (value: string) => void;
};

const FormField = ({
  title,
  state,
  placeholder,
  type,
  isTextarea,
  setState,
}: Props) => {
  return (
    <div className="flexStart flex-col w-full gap-4">
      <label className="w-full text-gray-100">{title}</label>
      {isTextarea ? (
        <textarea
          placeholder={placeholder}
          value={state}
          required
          className="form_field-input"
          onChange={(e) => setState(e.target.value)}
        />
      ) : (
        <input
          type={type || "text"}
          placeholder={placeholder}
          value={state}
          required
          className="form_field-input"
          onChange={(e) => setState(e.target.value)}
        />
      )}
    </div>
  );
};

export default FormField;
