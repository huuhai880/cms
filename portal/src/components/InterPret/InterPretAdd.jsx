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
  Button,
} from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./const";
import InterpretModel from "../../models/InterpretModel";
import NumberFormat from "../Common/NumberFormat";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Checkbox } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import { readImageAsBase64 } from "../../utils/html";
layoutFullWidthHeight();

function InterPretAdd({ noEdit }) {
  const _interpretModel = new InterpretModel();
  const [dataInterpret, setDataInterpret] = useState(initialValues);
  const [dataAttribute, setDataAttribute] = useState([]);
  const [dataMainnumber, setDataMainnumber] = useState([]);
  const [dataRelationship, setDataRelationship] = useState([]);
  let { id } = useParams();
  const [btnType, setbtnType] = useState("");
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataInterpret,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCreateOrUpdate(values);
    },
  });
  ///// get data partnert
  useEffect(() => {
    const _callAPI = async () => {
      try {
        await _interpretModel.getListAttribute().then((data) => {
          setDataAttribute(data.items);
          //   console.log(setDataPartner);
        });
        await _interpretModel.getListMainnumber().then((data) => {
          setDataMainnumber(data.items);
          //   console.log(setDataPartner);
        });
        await _interpretModel.getListRelationship().then((data) => {
          setDataRelationship(data.items);
          //   console.log(setDataPartner);
        });
      } catch (error) {
        console.log(error);
        window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
      }
    };
    _callAPI();
  }, []);
  //// create letter
  const handleCreateOrUpdate = async (values) => {
    try {
      _interpretModel.create(values).then((data) => {
        if (btnType == "save") {
          setDataInterpret(initialValues);
          window._$g.toastr.show("Lưu thành công!", "success");
        } else if (btnType == "save&quit") {
          window._$g.toastr.show("Lưu thành công!", "success");
          setDataInterpret(initialValues);
          return window._$g.rdr("/interpret");
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
      await _interpretModel.detail(id).then((data) => {
        console.log(data);
        setDataInterpret(data);
        // console.log()
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };
  ////config select
  const convertValue = (value, options) => {
    // console.log(value)
    if (!(typeof value === "object") && options && options.length) {
      value = ((_val) => {
        return options.find((item) => "" + item.value === "" + _val);
      })(value);
    } else if (Array.isArray(value) && options && options.length) {
      return options.filter((item) => {
        return value.find((e) => e == item.value);
      });
    }
    // console.log(value)
    return value;
  };
  ///////// option Relationship
  const getOptionRelationship = () => {
    if (dataRelationship && dataRelationship.length) {
      return dataRelationship.map((item) => {
        // console.log(dataPartner);
        return formik.values.relationship_id == item.relationship_id
          ? {
              value: item.relationship_id,
              label: item.relationship,
              // isDisabled: true,
            }
          : {
              value: item.relationship_id,
              label: item.relationship,
            };
      });
    }
    return [];
  };
  ///////// option Relationship
  const getOptionAttribute = () => {
    if (dataAttribute && dataAttribute.length) {
      return dataAttribute.map((item) => {
        // console.log(dataPartner);
        return formik.values.attribute_id == item.attribute_id
          ? {
              value: item.attribute_id,
              label: item.attribute_name,
              // isDisabled: true,
            }
          : {
              value: item.attribute_id,
              label: item.attribute_name,
            };
      });
    }
    return [];
  };
  ///////// option Mainnumber
  const getOptionMainNumBer = () => {
    if (dataMainnumber && dataMainnumber.length) {
      return dataMainnumber.map((item) => {
        // console.log(dataPartner);
        return formik.values.mainnumber_id == item.mainnumber_id
          ? {
              value: item.mainnumber_id,
              label: item.mainnumber,
              // isDisabled: true,
            }
          : {
              value: item.mainnumber_id,
              label: item.mainnumber,
            };
      });
    }
    return [];
  };
  //// upload images
  const handleUploadImage = async (blobInfo, success, failure) => {
    readImageAsBase64(blobInfo.blob(), async (imageUrl) => {
      try {
        const imageUpload = await _interpretModel.upload({
          base64: imageUrl,
          folder: "files",
          includeCdn: true,
        });
        success(imageUpload);
      } catch (error) {
        failure(error);
      }
    });
  };
  return (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
            <b>{id ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} luận giải </b>
              {/* <b>{id ? "Chỉnh sửa" : "Thêm mới"}  </b> */}
            </CardHeader>
            <CardBody>
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                <Col xs={12} sm={12}>
                  <Row>
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="attribute_id" sm={4}>
                          Tên thuộc tính <span className="font-weight-bold red-text">*</span>
                        </Label>
                        <Col sm={8}>
                          <Select
                            className="MuiPaper-filter__custom--select"
                            id={`attribute_id`}
                            name={`attribute_id`}
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            menuPortalTarget={document.querySelector("body")}
                            isDisabled={noEdit}
                            placeholder={"-- Chọn --"}
                            value={convertValue(formik.values.attribute_id, getOptionAttribute())}
                            options={getOptionAttribute(formik.values.attribute_id, true)}
                            onChange={(value) => {
                              formik.setFieldValue("attribute_id", value.value);
                            }}
                          />
                          {formik.errors.attribute_id && formik.touched.attribute_id ? (
                            <div
                              className="field-validation-error alert alert-danger fade show"
                              role="alert"
                            >
                              {formik.errors.attribute_id}
                            </div>
                          ) : null}
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="relationship_id" sm={4}>
                          Mối quan hệ <span className="font-weight-bold red-text">*</span>
                        </Label>
                        <Col sm={8}>
                          <Select
                            className="MuiPaper-filter__custom--select"
                            id={`relationship_id`}
                            name={`relationship_id`}
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            menuPortalTarget={document.querySelector("body")}
                            isDisabled={noEdit}
                            placeholder={"-- Chọn --"}
                            value={convertValue(
                              formik.values.relationship_id,
                              getOptionRelationship()
                            )}
                            options={getOptionRelationship(formik.values.relationship_id, true)}
                            onChange={(value) => {
                              formik.setFieldValue("relationship_id", value.value);

                            }}
                          />{" "}
                          {formik.errors.relationship_id && formik.touched.relationship_id ? (
                            <div
                              className="field-validation-error alert alert-danger fade show"
                              role="alert"
                            >
                              {formik.errors.relationship_id}
                            </div>
                          ) : null}
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="mainnumber_id" sm={4}>
                          Chỉ số <span className="font-weight-bold red-text">*</span>
                        </Label>
                        <Col sm={8}>
                          <Select
                           className="MuiPaper-filter__custom--select"
                           id={`mainnumber_id`}
                           name={`mainnumber_id`}
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            menuPortalTarget={document.querySelector("body")}
                            isDisabled={noEdit}
                            placeholder={"-- Chọn --"}
                            value={convertValue(formik.values.mainnumber_id, getOptionMainNumBer())}
                            options={getOptionMainNumBer(formik.values.mainnumber_id, true)}
                            onChange={(value) => {
                              formik.setFieldValue("mainnumber_id", value.value);
                              // console.log(formik.values.mainnumber_id)

                            }}
                          />
                          {formik.errors.mainnumber_id && formik.touched.mainnumber_id ? (
                            <div
                              className="field-validation-error alert alert-danger fade show"
                              role="alert"
                            >
                              {formik.errors.mainnumber_id}
                            </div>
                          ) : null}
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="relationship_id" sm={4}></Label>
                        <Col sm={8}>
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_active`, e.target.checked ? 1 : 0);
                            }}
                            checked={formik.values.is_active}
                          >
                            Kích hoạt
                          </Checkbox>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="attribute_id" sm={4}>
                          Chỉ số so sánh <span className="font-weight-bold red-text">*</span>
                        </Label>
                        <Col sm={8}>
                          <Select
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            menuPortalTarget={document.querySelector("body")}
                            isDisabled={noEdit}
                            placeholder={"-- Chọn --"}
                            value={convertValue(
                              formik.values.compare_mainnumber_id,
                              getOptionMainNumBer()
                            )}
                            options={getOptionMainNumBer(formik.values.compare_mainnumber_id, true)}
                            onChange={(value) => {
                              formik.setFieldValue("compare_mainnumber_id", value.value);
                            }}
                          />
                          {formik.errors.attribute_id && formik.touched.attribute_id ? (
                            <div
                              className="field-validation-error alert alert-danger fade show"
                              role="alert"
                            >
                              {formik.errors.attribute_id}
                            </div>
                          ) : null}
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="relationship_id" sm={4}></Label>
                        <Col sm={8}>
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_master`, e.target.checked ? 1 : 0);
                            }}
                            checked={formik.values.is_master}
                          >
                            Is master
                          </Checkbox>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="order_index" sm={4}>
                          Vị trí hiển thị <span className="font-weight-bold red-text">*</span>
                        </Label>
                        <Col sm={8}>
                          <NumberFormat
                            name="order_index"
                            id="order_index"
                            disabled={noEdit}
                            onChange={(value) => {
                              formik.setFieldValue("order_index", value.target.value);
                              // console.log(value)
                            }}
                            value={formik.values.order_index}
                          />
                          {formik.errors.order_index && formik.touched.order_index ? (
                            <div
                              className="field-validation-error alert alert-danger fade show"
                              role="alert"
                            >
                              {formik.errors.order_index}
                            </div>
                          ) : null}
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} sm={12}>
                  <FormGroup row>
                    <Label for="brief_decs" sm={2}>
                      Tóm tắt<span className="font-weight-bold red-text">*</span>
                    </Label>
                    <Col sm={10}>
                      <Input
                        name="brief_decs"
                        id="brief_decs"
                        type="textarea"
                        placeholder="Tóm tắt"
                        disabled={noEdit}
                        value={formik.values.brief_decs}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.brief_decs && formik.touched.brief_decs ? (
                        <div
                          className="field-validation-error alert alert-danger fade show"
                          role="alert"
                        >
                          {formik.errors.brief_decs}
                        </div>
                      ) : null}
                    </Col>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={12}>
                  <FormGroup row>
                    <Label for="decs" sm={2}>
                      Mô tả<span className="font-weight-bold red-text">*</span>
                    </Label>
                    <Col sm={10}>
                      <Editor
                        apiKey={"3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"}
                        scriptLoading={{
                          delay: 500,
                        }}
                        value={formik.values.decs}
                        disabled={noEdit}
                        init={{
                          height: "300px",
                          width: "100%",
                          menubar: false,
                          branding: false,
                          statusbar: false,
                          plugins: [
                            "advlist autolink fullscreen lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen ",
                            "insertdatetime media table paste code help",
                            "image imagetools ",
                            "toc",
                          ],
                          menubar: "file edit view insert format tools table tc help",
                          toolbar1:
                            "undo redo | fullscreen | formatselect | bold italic backcolor | \n" +
                            "alignleft aligncenter alignright alignjustify",
                          toolbar2:
                            "bullist numlist outdent indent | removeformat | help | image | toc",
                          file_picker_types: "image",
                          images_dataimg_filter: function (img) {
                            return img.hasAttribute("internal-blob");
                          },
                          images_upload_handler: handleUploadImage,
                        }}
                        onEditorChange={(newValue) => {
                          formik.setFieldValue("decs", newValue);
                        }}
                        // onEditorChange={formik.handleChange}
                      />
                      {formik.errors.decs && formik.touched.decs ? (
                        <div
                          className="field-validation-error alert alert-danger fade show"
                          role="alert"
                        >
                          {formik.errors.decs}
                        </div>
                      ) : null}
                    </Col>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={12}>
                  <FormGroup row>
                    <Label for="note" sm={2}>
                      Ghi chú
                    </Label>
                    <Col sm={10}>
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
                <div className="text-right mb-2">
                  <div>
                    {noEdit ? (
                      <CheckAccess permission="FOR_INTERPRET_VIEW">
                        <Button
                          color="primary"
                          className="mr-2 btn-block-sm"
                          onClick={() =>
                            window._$g.rdr(`/interpret/edit/${dataInterpret.interpret_id}`)
                          }
                        >
                          <i className="fa fa-edit mr-1" />
                          Chỉnh sửa
                        </Button>
                      </CheckAccess>
                    ) : (
                      <>
                        <CheckAccess permission={id ? `FOR_INTERPRET_EDIT` : `FOR_INTERPRET_ADD`}>
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
                        <CheckAccess permission={id ? `FOR_INTERPRET_EDIT` : `FOR_INTERPRET_ADD`}>
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
                      </>
                    )}
                    <button
                      className=" btn-block-sm btn btn-secondary"
                      type="button"
                      onClick={() => window._$g.rdr(`/interpret`)}
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

export default InterPretAdd;