import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row, Form, FormGroup, Label, Input } from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./const";
import RelationshipsModel from "../../models/RelationshipsModel";
import NumberFormat from "../Common/NumberFormat";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Checkbox } from "antd";
function RelationShipsAdd({ noEdit }) {
  const _relationshipsModel = new RelationshipsModel();
  const [dataRelationShips, setDataRelationShips] = useState(initialValues);
  let { id } = useParams();
  const [btnType, setbtnType] = useState("");
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataRelationShips,
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
      await _relationshipsModel
        .checkRelationship({ relationship: values.relationship })
        .then((data) => {
          if (
            data.RELATIONSHIPID &&
            formik.values.relationship != dataRelationShips.relationship
          ) {
            // setalert("Email đã tồn tại!");
            formik.setFieldError("relationship", "Mối quan hệ đã tồn tại!");
            // window.scrollTo(0, 0);
          } else {
            _relationshipsModel.create(values).then((data) => {
              if (btnType == "save") {
                setDataRelationShips(initialValues);
                // _initData();
                // _initDataDetail();
                window._$g.toastr.show("Lưu thành công!", "success");
              } else if (btnType == "save&quit") {
                window._$g.toastr.show("Lưu thành công!", "success");
                setDataRelationShips(initialValues);
                return window._$g.rdr("/RelationShips");
              }
              // console.log(data);
            });
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
      await _relationshipsModel.detail(id).then((data) => {
        // console.log(data);
        setDataRelationShips(data);
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
              <b>{id ? "Chỉnh sửa" : "Thêm mới"} mối quan hệ </b>
            </CardHeader>
            <CardBody>
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                <Col xs={12} sm={12}>
                  <FormGroup row>
                    <Label for="relationship" sm={4}>
                      Mối quan hệ <span className="font-weight-bold red-text">*</span>
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="relationship"
                        id="relationship"
                        type="text"
                        placeholder="Mối quan hệ"
                        disabled={noEdit}
                        value={formik.values.relationship}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.relationship && formik.touched.relationship ? (
                        <div
                          className="field-validation-error alert alert-danger fade show"
                          role="alert"
                        >
                          {formik.errors.relationship}
                        </div>
                      ) : null}
                    </Col>
                  </FormGroup>
                </Col>

                <Col xs={12} sm={12}>
                  <FormGroup row>
                    <Label for="note" sm={4}>
                      Ghi chú
                    </Label>
                    <Col sm={8}>
                      <Input
                        name="note"
                        id="note"
                        type="textarea"
                        placeholder="Ghi chú"
                        disabled={noEdit}
                        value={formik.values.note}
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
                    <CheckAccess permission={id ? `MD_RELATIONSHIPS_EDIT` : `MD_RELATIONSHIPS_ADD`}>
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
                    <CheckAccess permission={id ? `MD_RELATIONSHIPS_EDIT` : `MD_RELATIONSHIPS_ADD`}>
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
                      onClick={() => window._$g.rdr(`/RelationShips`)}
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

export default RelationShipsAdd;
