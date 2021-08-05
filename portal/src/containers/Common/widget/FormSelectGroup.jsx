import React, { useState, useEffect } from "react";
import { Row, Col, Label, Alert, FormGroup } from "reactstrap";
import Select from "react-select";
import { Field, ErrorMessage } from "formik";
import "./style.css";

const FormSelectGroup = ({
  name,
  label,
  isRequired = true,
  isEdit = true,
  list = [{ label: "-- Chọn --", value: "" }],
  onChange,
  sm = 12,
  xs = 12,
  smColLabel,
  smColSelect,
  selectOnly = false,
  defaultVal,
  placeHolder = "-- Chọn --",
  isMulti = false,
  isObject = false,
  isUseForm = true,
  value,
  portalTarget = "body",
  classNameLabel = "",
  isTarget = true,
  isClearable = true,
}) => {
  const SelectComponent = () => {
    const formatTreeList = (data) => {
      const getCategoryTree = (parent_id = null, prefix = "#", arr = []) => {
        let child = data.filter((x) => x.parent_id == parent_id);
        child.forEach((element) => {
          if (element.id) {
            arr.push({
              label: prefix + " " + element.name,
              value: element.id,
            });
          } else {
            arr.push({
              label: element.name,
              value: element.id,
            });
          }
          getCategoryTree(element.id, `${prefix}──`, arr);
        });
        return arr;
      };
      return getCategoryTree();
    };

    const Option = (props) => {
      const { children, innerRef, innerProps, value } = props;
      if (!children) return null;
      let start = children.indexOf("──");
      let end = children.lastIndexOf("──");
      let length = children.slice(start, end + 1).length;
      let child = `${value ? "|--" : ""}` + children.replace(/#|──/g, "");
      let paddingleft = length * 12;
      let style = {
        paddingLeft: `${paddingleft}px`,
      };
      return (
        <div style={{ padding: "7px 12px" }} className="custom-option-item">
          <div ref={innerRef} {...innerProps} style={style}>
            {child}
          </div>
        </div>
      );
    };

    const renderSelectElement = (field) => {
      const fieldValue = isMulti
        ? !!field.value.length
          ? field.value
          : [field.value]
        : field.value
        ? [field.value]
        : defaultVal
        ? [defaultVal]
        : [];
      let defaultValue = (list || []).filter(
        (v) =>
          (fieldValue || []).findIndex(
            (x) => 1 * (isObject ? x.value : x) === v.value * 1
          ) >= 0
      );

      return (
        <Select
          name={field.name}
          isSearchable={true}
          placeholder={placeHolder}
          value={
            isMulti ? defaultValue : defaultValue.length && defaultValue[0]
          }
          options={formatTreeList((list || []).filter((x) => x))}
          isDisabled={!isEdit}
          isMulti={isMulti}
          menuPortalTarget={
            isTarget ? document.querySelector(portalTarget) : null
          }
          isClearable={isClearable}
          onChange={(item) => {
            if (isUseForm)
              field.onChange({
                target: {
                  // type: "select",
                  name: name,
                  value: isObject
                    ? item || { label: "-- Chọn --", value: "" }
                    : item?.value || "",
                },
              });
            if (onChange) onChange(item, field);
          }}
          components={{ Option }}
        />
      );
    };
    return isUseForm ? (
      <Field
        name={name}
        render={({ field }) => {
          return renderSelectElement(field);
        }}
      />
    ) : (
      renderSelectElement({ name, value })
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
                <Label
                  sm={smColLabel ? smColLabel : 4}
                  className={classNameLabel}
                >
                  {label}
                  {isRequired && (
                    <span className="font-weight-bold red-text">*</span>
                  )}
                </Label>
              )}
              <Col sm={smColSelect ? smColSelect : 8}>
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

export default FormSelectGroup;
