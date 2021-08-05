import React from "react";
import { Col, Label, Alert, FormGroup } from "reactstrap";
import { DatePicker } from "antd";
import { Field, ErrorMessage } from "formik";
import moment from "moment";

const DateTimePicker = (props) => {
  const {
    label,
    name,
    sm = 12,
    xs = 12,
    labelsm = 4,
    inputsm = 8,
    isRequired = true,
    isEdit = true,
  } = props;

  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  return (
    <Col xs={xs} sm={sm}>
      <FormGroup row>
        {label && (
          <Label for={name} sm={labelsm}>
            {label}
            {isRequired && <span className="font-weight-bold red-text">*</span>}
          </Label>
        )}
        <Col sm={inputsm}>
          <Field
            name={name}
            render={({ form: { setFieldValue, values }, field, ...props }) => {
              return (
                <DatePicker
                  style={{ width: "100% " }}
                  defaultValue={values[name] ? moment(values[name]) : ""}
                  showTime={{
                    format: "HH:mm",
                  }}
                  disabledTime={(date) => {
                    let disabledHours = 0;
                    let disabledMinutes = 0;
                    if (date && date.day() === moment().day()) {
                      disabledHours = moment().hour();
                      if (date.hour() === moment().hour()) {
                        disabledMinutes = moment().minute();
                      }
                    }
                    return {
                      disabledHours: () =>
                        range(0, 24).splice(0, disabledHours),
                      disabledMinutes: () => range(0, disabledMinutes),
                    };
                  }}
                  format="DD/MM/YYYY HH:mm"
                  disabledDate={(current) => {
                    if (current.year() < moment().year()) {
                      return true;
                    } else if (current.year() > moment().year()) {
                      return false;
                    } else if (current.month() < moment().month()) {
                      return true;
                    } else if (current.month() > moment().month()) {
                      return false;
                    } else if (current.date() < moment().date()) {
                      return true;
                    } else {
                      return false;
                    }
                  }}
                  onChange={(date, dstring) => {
                    setFieldValue(name, dstring);
                  }}
                  showNow
                  disabled={!isEdit}
                  s
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

export default DateTimePicker;
