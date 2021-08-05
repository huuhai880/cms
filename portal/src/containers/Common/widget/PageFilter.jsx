import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import PropTypes from "prop-types";
import {
  Button,
  FormGroup,
  Row,
  Card,
  CardHeader,
  CardBody,
  Col,
} from "reactstrap";

import { FormInput, FormSelect, FormSelectGroup } from "@widget";

const PageFilter = (props) => {
  const { filters = [], handleSubmit, smInputs = 12, smButtons = 12 } = props;
  const [toggleSearch, setToogleSearch] = useState(true);

  let getFormik = null;

  const handleFormikSubmit = (values, formik) => {
    if (values) {
      handleSubmit(values);
    } else {
      handleSubmit(getFormik.values);
    }
  };

  let init = {};
  filters.forEach((e) => {
    init[e.name] = e.defaultValue || "";
  });

  const resetFilter = () => {
    const { values, setFieldValue } = getFormik;
    filters.forEach((e) => {
      setFieldValue(e.name, e.defaultValue || "");
    });
  };

  return (
    <Card className="animated fadeIn z-index-222 mb-3">
      <CardHeader className="d-flex">
        <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
        <div
          className="minimize-icon cur-pointer"
          onClick={() => setToogleSearch(!toggleSearch)}
        >
          <i className={`fa ${toggleSearch ? "fa-minus" : "fa-plus"}`} />
        </div>
      </CardHeader>
      {toggleSearch && (
        <CardBody className="px-0 py-0">
          <div className="MuiPaper-filter__custom z-index-2">
            <div className="ml-3 mr-3 mb-3 mt-3">
              <Formik initialValues={init} onSubmit={handleFormikSubmit}>
                {(formikProps) => {
                  let { values, handleSubmit, handleReset, isSubmitting } =
                    (getFormik = formikProps);
                  return (
                    <>
                      <Row>
                        <Col xs={12} sm={smInputs}>
                          <Form
                            autoComplete="nope"
                            className="zoom-scale-9"
                            onSubmit={handleSubmit}
                            onReset={handleReset}
                          >
                            <Row>
                              {filters.map((e) =>
                                e.type === "input" ? (
                                  <FormInput
                                    key={`filter-input-${e.name}`}
                                    label={e.label}
                                    name={e.name}
                                    labelSm={12}
                                    inputSm={12}
                                    sm={e.sm || 12}
                                    onEnter={handleFormikSubmit}
                                    isRequired={false}
                                    placeholder={e.placeholder || ""}
                                  />
                                ) : e.type === "select" ? (
                                  <FormSelect
                                    key={`filter-select-${e.name}`}
                                    label={e.label}
                                    name={e.name}
                                    labelSm={12}
                                    selectSm={12}
                                    sm={e.sm || 12}
                                    list={e.list}
                                    isTarget={false}
                                    isRequired={false}
                                    placeholder={e.placeholder || ""}
                                  />
                                ) : null
                              )}
                            </Row>
                          </Form>
                        </Col>
                        <Col
                          xs={12}
                          sm={smButtons}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <div className="d-flex align-items-center mt-3">
                            <div className="d-flex flex-fill justify-content-end">
                              <FormGroup className="mb-2 ml-2 mb-sm-0">
                                <Button
                                  className="col-12 MuiPaper-filter__custom--button"
                                  color="primary"
                                  size="sm"
                                  onClick={handleSubmit}
                                >
                                  <i className="fa fa-search" />
                                  <span className="ml-1">Tìm kiếm</span>
                                </Button>
                              </FormGroup>
                              <FormGroup className="mb-2 ml-2 mb-sm-0">
                                <Button
                                  className="mr-1 col-12 MuiPaper-filter__custom--button"
                                  size="sm"
                                  onClick={resetFilter}
                                >
                                  <i className="fa fa-refresh" />
                                  <span className="ml-1">Làm mới</span>
                                </Button>
                              </FormGroup>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </>
                  );
                }}
              </Formik>
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  );
};

PageFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default PageFilter;
