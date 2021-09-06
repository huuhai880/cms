import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./const";
import LetterModel from "../../models/LetterModel";
import NumberFormat from "../Common/NumberFormat";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Checkbox } from "antd";

layoutFullWidthHeight();

function LetterAdd({ noEdit }) {
  const _letterModel = new LetterModel();
  const [dataLetter, setDataLetter] = useState(initialValues);
  let { id } = useParams();
  const [btnType, setbtnType] = useState("");
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataLetter,
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
      await _letterModel.checkLetter({ letter: values.letter }).then((data) => {
        // console.log(data)
        if (data.LETTERID && formik.values.letter != dataLetter.letter) {
          // setalert("Email đã tồn tại!");
          formik.setFieldError("letter", "Chữ cái đã tồn tại!");
          // window.scrollTo(0, 0);
        } else {
          _letterModel.create(values).then((data) => {
            if (btnType == "save") {
              setDataLetter(initialValues);
              // _initData();
              // _initDataDetail();
              window._$g.toastr.show("Lưu thành công!", "success");
            } else if (btnType == "save&quit") {
              window._$g.toastr.show("Lưu thành công!", "success");
              setDataLetter(initialValues);
              return window._$g.rdr("/letter");
            }
            // console.log(data);
          });
          // console.log(data);
        }
      });
    } catch (error) {}
    // try {
    //   _letterModel.create(values).then((data) => {
    //     if (btnType == "save") {
    //       // _initData();
    //       window._$g.toastr.show("Lưu thành công!", "success");
    //     } else if (btnType == "save&quit") {
    //       window._$g.toastr.show("Lưu thành công!", "success");
    //       //   setDataPosition(initialValues);
    //       return window._$g.rdr("/letter");
    //     }
    //     // console.log(data);
    //   });
    // } catch (error) {}
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
      await _letterModel.detail(id).then((data) => {
        console.log(data)
        setDataLetter(data);
        // console.log()
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };
  
  return (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <b>{id ? "Chỉnh sửa" : "Thêm mới"} chữ cái </b>
            </CardHeader>
            <CardBody>
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                <Col xs={12} sm={12}>
                  <FormGroup row>
                    <Label for="letter" sm={4}>
                      Chữ cái <span className="font-weight-bold red-text">*</span>
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="letter"
                        id="letter"
                        type="text"
                        placeholder="Chữ cái"
                        disabled={noEdit}
                        value={formik.values.letter}
                        onChange={(value) => {
                          formik.setFieldValue("letter", value.target.value.toUpperCase());
                          // console.log(value)
                        }}
                      />
                      {formik.errors.letter && formik.touched.letter ? (
                        <div
                          className="field-validation-error alert alert-danger fade show"
                          role="alert"
                        >
                          {formik.errors.letter}
                        </div>
                      ) : null}
                    </Col>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={12}>
                  <FormGroup row>
                    <Label for="number" sm={4}>
                      Số <span className="font-weight-bold red-text">*</span>
                    </Label>
                    <Col sm={8}>
                      <NumberFormat
                        name="number"
                        id="number"
                        disabled={noEdit}
                        onChange={(value) => {
                          formik.setFieldValue("number", value.target.value);
                          // console.log(value)
                        }}
                        value={formik.values.number}
                      />

                      {formik.errors.number && formik.touched.number ? (
                        <div
                          className="field-validation-error alert alert-danger fade show"
                          role="alert"
                        >
                          {formik.errors.number}
                        </div>
                      ) : null}
                    </Col>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={12}>
                  <FormGroup row>
                    <Label for="desc" sm={4}>
                      Mô tả
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="desc"
                        id="desc"
                        type="textarea"
                        placeholder=" Mô tả"
                        disabled={noEdit}
                        value={formik.values.desc}
                        onChange={formik.handleChange}
                      />
                    </Col>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={12}>
                  <Row>
                    <Col xs={4}></Col>
                    <Col xs={8}>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col>
                              <Checkbox
                                className="mr-1"
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(`is_vowel`, e.target.checked ? 1 : 0);
                                }}
                                checked={formik.values.is_vowel}
                              ></Checkbox>

                              <Label for="desc">Nguyên âm</Label>
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
                    <CheckAccess permission={id ? `MD_LETTER_EDIT` : `MD_LETTER_ADD`}>
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
                    <CheckAccess permission={id ? `MD_LETTER_EDIT` : `MD_LETTER_ADD`}>
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
                      onClick={() => window._$g.rdr(`/letter`)}
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

export default LetterAdd;
