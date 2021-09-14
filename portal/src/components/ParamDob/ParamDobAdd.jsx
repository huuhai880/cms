import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row, Form, FormGroup, Label, Input } from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./const";
import LetterModel from "../../models/LetterModel";
import NumberFormat from "../Common/NumberFormat";
import { CheckAccess } from "../../navigation/VerifyAccess";
import ParamTypeModel from "../../models/ParamTypeModel";
import { Checkbox } from "antd";
layoutFullWidthHeight();

function ParamDobAdd({ noEdit }) {
  const _paramTypeModel = new ParamTypeModel();
  const [dataParamType, setDataParamType] = useState(initialValues);
  let { id } = useParams();
  const [btnType, setbtnType] = useState("");
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataParamType,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCreateOrUpdate(values);
    },
  });
  //// create letter
  const handleCreateOrUpdate = async (values) => {
    try {
      await _paramTypeModel.checkparam({ param_type: values.param_type }).then((data) => {
        if (data.PARAMDOBID && formik.values.param_type != dataParamType.param_type) {
          // setalert("Email đã tồn tại!");
          formik.setFieldError("param_type", "Biến số ngày sinh đã tồn tại!");
          // window.scrollTo(0, 0);
        } else {
          if (
            formik.values.is_day == 0 &&
            formik.values.is_month == 0 &&
            formik.values.is_year == 0
          ) {
            formik.setFieldError("time", "Loại biến số ngày sinh không được để trống");
          } else {
            _paramTypeModel.create(values).then((data) => {
              if (btnType == "save") {
                setDataParamType(initialValues);
                // _initData();
                formik.resetForm();
                window._$g.toastr.show("Lưu thành công!", "success");
              } else if (btnType == "save&quit") {
                window._$g.toastr.show("Lưu thành công!", "success");
                setDataParamType(initialValues);
                return window._$g.rdr("/param-dob");
              }
              // console.log(data);
            });
          }
          // console.log(data);
        }
      });
    } catch (error) {}
  };
  //////get data detail
  useEffect(() => {
    if (id) {
      _initDataDetail();
    }
  }, [id]);

  //// data detail
  const _initDataDetail = async () => {
    try {
      await _paramTypeModel.detail(id).then((data) => {
        // console.log(data)
        setDataParamType(data);
        // console.log()
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F3 thử lại"));
    }
  };
  // console.log(formik.values)
  return (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <b>{id ? "Chỉnh sửa" : "Thêm mới"} biến số ngày sinh </b>
            </CardHeader>
            <CardBody>
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                <Col xs={12} sm={12}>
                  <FormGroup row>
                    <Label for="letter" sm={3}>
                      Loại <span className="font-weight-bold red-text">*</span>
                    </Label>
                    <Col sm={9}>
                      <Input
                        name="param_type"
                        id="param_type"
                        type="text"
                        placeholder="Biến số ngày sinh"
                        disabled={noEdit}
                        value={formik.values.param_type}
                        onChange={(value) => {
                          formik.setFieldValue("param_type", value.target.value);
                          // console.log(value)
                        }}
                      />
                      {formik.errors.param_type && formik.touched.param_type ? (
                        <div
                          className="field-validation-error alert alert-danger fade show"
                          role="alert"
                        >
                          {formik.errors.param_type}
                        </div>
                      ) : null}
                    </Col>
                  </FormGroup>
                </Col>

                <Col xs={12} sm={12}>
                  <Row>
                    <Col xs={3}></Col>
                    <Col xs={9}>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col>
                              <Checkbox
                                className="mr-1"
                                disabled={noEdit}
                                onChange={(e) => {
                                  if (e.target.checked == 1) {
                                    formik.setFieldValue(`is_year`, 0);
                                    formik.setFieldValue(`is_month`, 0);
                                    formik.setFieldValue(`is_day`, e.target.checked ? 1 : 0);
                                  }
                                }}
                                checked={formik.values.is_day}
                              ></Checkbox>

                              <Label for="desc">Ngày</Label>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup row>
                            <Col>
                              <Checkbox
                                className="mr-1"
                                disabled={noEdit}
                                onChange={(e) => {
                                  if (e.target.checked == 1) {
                                    formik.setFieldValue(`is_year`, 0);
                                    formik.setFieldValue(`is_month`, e.target.checked ? 1 : 0);

                                    formik.setFieldValue(`is_day`, 0);
                                  }
                                }}
                                checked={formik.values.is_month}
                              ></Checkbox>

                              <Label for="desc">Tháng</Label>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup row>
                            <Col>
                              <Checkbox
                                className="mr-1"
                                disabled={noEdit}
                                onChange={(e) => {
                                  if (e.target.checked == 1) {
                                    formik.setFieldValue(`is_year`, e.target.checked ? 1 : 0);
                                    formik.setFieldValue(`is_month`, 0);
                                    formik.setFieldValue(`is_day`, 0);
                                  }
                                }}
                                checked={formik.values.is_year}
                              ></Checkbox>

                              <Label for="desc">Năm</Label>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      {formik.errors.time ? (
                        <div
                          className="field-validation-error alert alert-danger fade show"
                          role="alert"
                        >
                          {formik.errors.time}
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} sm={12}>
                  <Row>
                    <Col xs={3}></Col>
                    <Col xs={9}>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col>
                              <Checkbox
                                className="mr-1"
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(`is_active`, e.target.checked ? 1 : 0);
                                }}
                                checked={formik.values.is_active}
                              ></Checkbox>

                              <Label for="desc">Kích hoạt</Label>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <div className="text-right mb-2 mt-2">
                  <div>
                    <CheckAccess permission={id ? `MD_PARAMTYPE_EDIT` : `MD_PARAMTYPE_ADD`}>
                      <button
                        className="mr-2 btn-block-sm btn btn-primary"
                        onClick={() => {
                          setbtnType("save");
                        }}
                        type="submit"
                      >
                        <i className="fa fa-save mr-1" />
                        Lưu
                      </button>
                    </CheckAccess>
                    <CheckAccess permission={id ? `MD_PARAMTYPE_EDIT` : `MD_PARAMTYPE_ADD`}>
                      <button
                        className="mr-2 btn-block-sm btn btn-success"
                        onClick={() => {
                          setbtnType("save&quit");
                        }}
                        type="submit"
                      >
                        <i className="fa fa-save mr-1" />
                        Lưu và đóng
                      </button>
                    </CheckAccess>

                    <button
                      className=" btn-block-sm btn btn-secondary"
                      type="button"
                      onClick={() => window._$g.rdr(`/param-dob`)}
                    >
                      <i className="fa fa-times-circle mr-1" />
                      Đóng
                    </button>
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ParamDobAdd;
