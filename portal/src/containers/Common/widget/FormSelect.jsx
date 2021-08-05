import React, { useState } from "react";
import { Row, Col, Label, Alert, FormGroup } from "reactstrap";
import Select from "react-select";
import { Field, ErrorMessage } from "formik";

const FormSelect = ({
  name,
  label,
  isRequired = true,
  isEdit = true,
  list = [{ label: "-- Chọn --", value: "" }],
  onChange,
  xs = 12,
  sm = 12,
  selectOnly = false,
  selectSm = 8,
  labelSm = 4,
  defaultVal,
  isTarget = true,
}) => {
  const SelectComponent = () => {
    const [currentValue, setCurrentValue] = useState(defaultVal);
    return (
      <Field
        name={name}
        render={({ field }) => {
          let defaultValue =
            list.find(({ value }) => value == field.value) ||
            list.find(({ value }) => value == defaultVal) ||
            list[0];
          let placeholder = (list[0] && list[0].label) || "";
          return (
            <Select
              name={field.name}
              isSearchable={true}
              placeholder={placeholder}
              defaultValue={defaultValue}
              options={list}
              isDisabled={!isEdit}
              menuPortalTarget={
                isTarget ? document.querySelector("body") : null
              }
              onChange={(item) => {
                if (currentValue != item.value) {
                  if (onChange) onChange({ ...item, field });
                  setCurrentValue(item.value);
                }
                field.onChange({
                  target: {
                    type: "select",
                    name: name,
                    value: item.value,
                  },
                });
              }}
            />
          );
        }}
      />
    );
  };

  return (
    <>
      {selectOnly ? (
        <SelectComponent />
      ) : (
        <Col xs={xs} sm={sm}>
          <FormGroup>
            <Row>
              {label && (
                <Label sm={labelSm}>
                  {label}
                  {isRequired && (
                    <span className="font-weight-bold red-text">*</span>
                  )}
                </Label>
              )}
              <Col sm={label ? selectSm : sm}>
                <SelectComponent />
                <ErrorMessage
                  name={name}
                  component={({ children }) => (
                    <Alert color="danger" className="field-validation-error">
                      {children}
                    </Alert>
                  )}
                />
              </Col>
            </Row>
          </FormGroup>
        </Col>
      )}
    </>
  );
};

export default FormSelect;
