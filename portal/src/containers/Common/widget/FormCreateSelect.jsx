import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Field, ErrorMessage } from "formik";

const FormCreateSelect = ({
  onChange,
  onInputChange,
  list,
  isEdit = true,
  defaultValue = "",
  placeholder = "",
  onCreateOption,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [options, setOptions] = useState(list);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  return (
    <CreatableSelect
      isSearchable={true}
      placeholder={placeholder}
      value={value}
      options={options}
      isDisabled={!isEdit}
      menuPortalTarget={document.querySelector("body")}
      onInputChange={(item) => {
        if (onInputChange) onInputChange(item);
      }}
      onChange={(item) => {
        if (item.value != value.value) {
          setValue(item);
          if (onChange) onChange(item);
        }
      }}
      onCreateOption={(item) => {
        if (onCreateOption) onCreateOption(item);
      }}
    />
  );
};

export default FormCreateSelect;
