import React from 'react'
import { Col, Label, CustomInput, FormGroup } from "reactstrap";
import { Field } from "formik";

const FormSwitch = ({name, checked, label, isEdit=true, xs=12, sm=12, type="checkbox" , labelSm, inputSm})=>{
  return (<Col xs={xs} sm={sm}>
    <FormGroup row>
      {label && <Label for={name} sm={labelSm ? labelSm : 4} />}
      <Col sm={inputSm ? inputSm :8}>
        <Field
          name={name}
          render={({ field /* _form */ }) => (
            <CustomInput
              {...field}
              className="pull-left"
              onBlur={null}
              checked={checked}
              type={type}
              id={field.name}
              label={label}
              disabled={!isEdit}
            />
          )}
        />
      </Col>
    </FormGroup>
  </Col>)
}

export default FormSwitch