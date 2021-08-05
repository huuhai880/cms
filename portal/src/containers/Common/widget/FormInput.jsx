import React, { useEffect } from "react";
import { Row, Col, Input, Label, Alert, FormGroup } from "reactstrap";
import { Field, ErrorMessage } from "formik";

const FormInput = ({
  label,
  isEdit = true,
  isRequired = true,
  name,
  type = "text",
  xs = 12,
  sm = 12,
  inputOnly = false,
  placeholder,
  defaultVal = "",
  labelSm = 4,
  inputSm = 8,
  onEnter = null,
  rowsTextArea,
  labelClassName = "",
  inputClassName = ""
}) => {
  const onBlurName = (event, field) => {
    field.onChange({
      target: { type: "text", name, value: event.target.value },
    });
  };

  const handleKeyPress = (target, field) => {
    if (target.charCode == 13 && onEnter) {
      onEnter();
      field.onChange({
        target: { type: "text", name, value: target.currentTarget.value },
      });
    }
  };

  return (
    <>
      {inputOnly ? (
        <Field
          name={name}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value || defaultVal || ""}
              onBlur={(event) => onBlurName(event, field)}
              type={type}
              placeholder={placeholder}
              disabled={!isEdit}
            />
          )}
        />
      ) : (
        <Col xs={xs} sm={sm}>
          <FormGroup row>
            {label && (
              <Label for={name} sm={labelSm} className={labelClassName}>
                {label}
                {isRequired && (
                  <span className="font-weight-bold red-text">*</span>
                )}
              </Label>
            )}
            <Col sm={label ? inputSm : sm}>
              <Field
                name={name}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    onBlur={(event) => onBlurName(event, field)}
                    type={type}
                    placeholder={placeholder}
                    disabled={!isEdit}
                    onKeyPress={(target) => handleKeyPress(target, field)}
                    rows={rowsTextArea ? rowsTextArea : ""}
                    className={inputClassName}
                  />
                )}
              />
              <ErrorMessage
                name={name}
                component={({ children }) => (
                  <Alert color="danger" className="field-validation-error">
                    {children}
                  </Alert>
                )}
              />
            </Col>
          </FormGroup>
        </Col>
      )}
    </>
  );
};

export default FormInput;
