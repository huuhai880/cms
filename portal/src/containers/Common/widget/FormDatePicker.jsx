import React from "react";
import { Col, Label, Alert, FormGroup } from "reactstrap";
import { Field, ErrorMessage } from "formik";
import DatePicker from "@common/DatePicker";
import moment from "moment";

const FormDatePicker = ({
  label,
  name,
  sm = 12,
  xs = 12,
  isRequired = true,
  isEdit = true,
}) => {
  return (
    <Col xs={xs} sm={sm}>
      <FormGroup row>
        {label && (
          <Label for={name} sm={4}>
            {label}
            {isRequired && <span className="font-weight-bold red-text">*</span>}
          </Label>
        )}
        <Col sm={8}>
          <Field
            name={name}
            render={({ form: { setFieldValue, values }, field, ...props }) => {
              return (
                <DatePicker
                  id={name}
                  date={
                    values[name] ? moment(values[name], "DD/MM/YYYY") : null
                  }
                  onDateChange={(date) => {
                    setFieldValue(name, date);
                  }}
                  renderMonthElement
                  disabled={!isEdit}
                />
              );
            }}
          />
          <ErrorMessage
            name={name}
            component={({ children }) => {
              return (
                <Alert color="danger" className="field-validation-error">
                  {" "}
                  {children}
                </Alert>
              );
            }}
          />
        </Col>
      </FormGroup>
    </Col>
  );
};

export default FormDatePicker;
