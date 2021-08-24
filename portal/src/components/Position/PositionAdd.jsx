// import React from "react";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  Media,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  Table,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import PositionModel from "../../models/PositionModel";
import { validationSchema, initialValues } from "./const";
import { useFormik } from "formik";

layoutFullWidthHeight();
function PositionAdd() {
  let { id } = useParams();
  const [dataPosition, setDataPosition] = useState(initialValues);
  const [btnType, setbtnType] = useState("");
  const _positionModel = new PositionModel();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataPosition,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCreateOrUpdateAcount(values);
    },
  });
  //// create account
  const handleCreateOrUpdateAcount = async (values) => {
    try {
      await _positionModel.check({ name: values.position_name }).then((data) => {
        console.log(data)
        if (data.POSITIONID) {
          // setalert("Email đã tồn tại!");
          formik.setFieldError("position_name", "Tên thuộc tính đã tồn tại!");
          window.scrollTo(0, 0);
        } else {
          _positionModel.create(values).then((data) => {
            if (btnType == "save") {
              // _initData();
              window._$g.toastr.show("Lưu thành công!", "success");
            } else if (btnType == "save&quit") {
              window._$g.toastr.show("Lưu thành công!", "success");
              setDataPosition(initialValues);
              return window._$g.rdr("/position");
            }
            // console.log(data);
          });
        }
      });
    } catch (error) {}
  };
  //// data detail
  const _initDataDetail = async () => {
    try {
      await _positionModel.readVer1(id).then((data) => {
        // console.log(data)
        setDataPosition(data);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };
  useEffect(() => {
    if (id) {
      _initDataDetail();
    }
  }, [id]);
  //// scroll to error
  useEffect(() => {
    if (!formik.isSubmitting) return;
    if (Object.keys(formik.errors).length > 0) {
      document.getElementsByName(Object.keys(formik.errors)[0])[0].focus();
    }
  }, [formik]);
  return (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <b>{id ? "Chỉnh sửa" : "Thêm mới"} chức vụ </b>
            </CardHeader>
            <CardBody>
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                <Row>
                  <Col xs={12} sm={12}>
                    <FormGroup row>
                      <Label for="user_name" sm={4}>
                        Tên chức vụ <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          name="position_name"
                          id="position_name"
                          type="text"
                          placeholder="Tên chức vụ"
                          //   disabled={noEdit}
                          value={formik.values.position_name}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.position_name && (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.position_name}
                          </div>
                        )}
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={12}>
                    <FormGroup row>
                      <Label for="user_name" sm={4}>
                        {/* Tên chức vụ <span className="font-weight-bold red-text">*</span> */}
                      </Label>
                      <Col sm={8}>
                        <CustomInput
                          className="pull-left"
                          onBlur={null}
                          checked={formik.values.is_active}
                          type="switch"
                          id="is_active"
                          label="Kích hoạt"
                          name="is_active"
                          // disabled={noEdit}
                          onChange={(e) => {
                            formik.setFieldValue("is_active", e.target.checked ? 1 : 0);
                          }}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <div className="text-right mb-2">
                  <div>
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
                    <button
                      className=" btn-block-sm btn btn-secondary"
                      type="button"
                      onClick={() => window._$g.rdr(`/position`)}
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

export default PositionAdd;
