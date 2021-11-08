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
  Alert,
} from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./constChild";
import InterpretModel from "../../models/InterpretModel";
import NumberFormat from "../Common/NumberFormat";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Checkbox } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import { readImageAsBase64 } from "../../utils/html";
import { CircularProgress } from "@material-ui/core";
import { convertValueSelect } from "utils/index";
layoutFullWidthHeight();

const _interpretModel = new InterpretModel();

function InterPretChildAdd({ noEdit, interpretDetailEnt = null }) {
  let { id } = useParams();
  const [interpretDetail, setInterpretDetail] = useState(initialValues);
  const [interpretParent, setInterpretParent] = useState([]);
  const [btnType, setbtnType] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: interpretDetail,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCreateOrUpdate(values);
    },
  });

  useEffect(() => {
    if (!interpretDetailEnt) {
      formik.setFieldValue("interpret_id", id);
    } else {
      setInterpretDetail(interpretDetailEnt);
    }
    _initInterpretParent(
      interpretDetailEnt ? interpretDetailEnt.interpret_id : id,
      interpretDetailEnt ? interpretDetailEnt.interpret_detail_id : 0
    );
    if (document.body.classList.contains("tox-fullscreen")) {
      document.body.classList.remove("tox-fullscreen");
    }
  }, []);
  //// scroll to error
  useEffect(() => {
    if (!formik.isSubmitting) return;
    if (Object.keys(formik.errors).length > 0) {
      document
        .getElementById(Object.keys(formik.errors)[0])
        .scrollIntoView({ behavior: "smooth", block: "end", inline: "start" });
      // console.log(Object.keys(formik.errors)[0])
    }
  }, [formik]);
  const _initInterpretParent = async (interpretId, interpretDetailId) => {
    try {
      let data = await _interpretModel.getListInterpretParent(interpretId, interpretDetailId);
      setInterpretParent(data.items);
    } catch (error) {
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
    }
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      let { interpret_detail_name } = values;
      let data = await _interpretModel.checkInterpretname({
        interpret_detail_name,
      });
      let { INTERPRETDETAILID = null } = data || {};
      if (INTERPRETDETAILID && interpret_detail_name != interpretDetail.interpret_detail_name) {
        formik.setFieldError("interpret_detail_name", "Tên luận giải đã tồn tại!");
        return;
      } else {
        await _interpretModel.createInterpretDetail(values);
        //  console.log(values)

        window._$g.toastr.show("Lưu thành công!", "success");
        if (btnType == "save_n_close") {
          return window._$g.rdr(`/interpret/show-list-child/${values.interpret_id}`);
        }
        if (btnType == "save" && !values.interpret_detail_id) {
          formik.resetForm();
          setisLoading(true);
          setTimeout(() => setisLoading(false), 500);
        }
      }
    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");

      setAlerts([{ color: "danger", msg }]);
      window.scrollTo(0, 0);
    } finally {
      formik.setSubmitting(false);
      window.scrollTo(0, 0);

    }
  };

  const getOptionInterpretParent = () => {
    if (interpretParent && interpretParent.length) {
      return interpretParent.map((item) => {
        return {
          value: item.interpret_detail_parent_id,
          label: item.interpret_detail_parent_name,
        };
      });
    }
    return [];
  };

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
              <b>
                {interpretDetailEnt ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} luận giải
                chi tiết
              </b>
            </CardHeader>
            <CardBody>
              {alerts.map(({ color, msg }, idx) => {
                return (
                  <Alert
                    key={`alert-${idx}`}
                    color={color}
                    isOpen={true}
                    toggle={() => setAlerts([])}
                  >
                    <span dangerouslySetInnerHTML={{ __html: msg }} />
                  </Alert>
                );
              })}
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                <Col xs={12} sm={12}>
                  <Row>
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="interpret_detail_name" sm={4}>
                          Tên luận giải <span className="font-weight-bold red-text">*</span>
                        </Label>
                        <Col sm={8}>
                          <Input
                            name="interpret_detail_name"
                            id="interpret_detail_name"
                            type="text"
                            placeholder="Tên luận giải"
                            disabled={noEdit}
                            value={formik.values.interpret_detail_name}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.interpret_detail_name &&
                          formik.touched.interpret_detail_name ? (
                            <div
                              className="field-validation-error alert alert-danger fade show"
                              role="alert"
                            >
                              {formik.errors.interpret_detail_name}
                            </div>
                          ) : null}
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="interpret_detail_parent_id" sm={4}>
                          Luận giải phụ thuộc
                        </Label>
                        <Col sm={8}>
                          {isLoading ? (
                            <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                              <CircularProgress />
                            </div>
                          ) : (
                            <Select
                              styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              }}
                              menuPortalTarget={document.querySelector("body")}
                              isDisabled={noEdit}
                              placeholder={"-- Chọn --"}
                              value={convertValueSelect(
                                formik.values.interpret_detail_parent_id,
                                getOptionInterpretParent()
                              )}
                              options={getOptionInterpretParent()}
                              onChange={(value) => {
                                console.log(value);
                                formik.setFieldValue("interpret_detail_parent_id", value.value);
                              }}
                            />
                          )}
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
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
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="is_active" sm={4}></Label>
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
                </Col>
                <Col>
                  <FormGroup row>
                    <Label for="interpret_detail_short_content" sm={2}>
                      Mô tả ngắn <span className="font-weight-bold red-text">*</span>
                    </Label>
                    <Col sm={10}>
                      <Editor
                        apiKey={"3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"}
                        scriptLoading={{
                          delay: 0,
                        }}
                        id="interpret_detail_short_content"
                        value={formik.values.interpret_detail_short_content}
                        disabled={noEdit}
                        init={{
                          height: "600px",
                          width: "100%",
                          menubar: false,
                          entity_encoding: "raw",
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
                            "undo redo | fullscreen | formatselect | bold italic underline strikethrough forecolor backcolor |fontselect |  fontsizeselect| \n" +
                            "alignleft aligncenter alignright alignjustify",
                          toolbar2:
                            "bullist numlist outdent indent | removeformat | help | image | toc",
                          file_picker_types: "image",
                          relative_urls: false,
                          remove_script_host: false,
                          convert_urls: true,
                          images_dataimg_filter: function (img) {
                            return img.hasAttribute("internal-blob");
                          },
                          images_upload_handler: handleUploadImage,
                        }}
                        onEditorChange={(newValue) => {
                          formik.setFieldValue("interpret_detail_short_content", newValue);
                        }}
                      />

                      {formik.errors.interpret_detail_short_content &&
                      formik.touched.interpret_detail_short_content ? (
                        <div
                          className="field-validation-error alert alert-danger fade show"
                          role="alert"
                        >
                          {formik.errors.interpret_detail_short_content}
                        </div>
                      ) : null}
                    </Col>
                  </FormGroup>
                </Col>
                <Col xs={12} sm={12}>
                  <FormGroup row>
                    <Label for="interpret_detail_full_content" sm={2}>
                      Mô tả<span className="font-weight-bold red-text">*</span>
                    </Label>
                    <Col sm={10}>
                      <Editor
                        id="interpret_detail_full_content"
                        apiKey={"3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"}
                        scriptLoading={{
                          delay: 0,
                        }}
                        value={formik.values.interpret_detail_full_content}
                        disabled={noEdit}
                        init={{
                          height: "600px",
                          width: "100%",
                          menubar: false,
                          branding: false,
                          entity_encoding: "raw",
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
                            "undo redo | fullscreen | formatselect | bold italic underline strikethrough forecolor backcolor |fontselect |  fontsizeselect| \n" +
                            "alignleft aligncenter alignright alignjustify",
                          toolbar2:
                            "bullist numlist outdent indent | removeformat | help | image | toc",
                          file_picker_types: "image",
                          relative_urls: false,
                          remove_script_host: false,
                          convert_urls: true,
                          images_dataimg_filter: function (img) {
                            return img.hasAttribute("internal-blob");
                          },
                          images_upload_handler: handleUploadImage,
                        }}
                        onEditorChange={(newValue) => {
                          formik.setFieldValue("interpret_detail_full_content", newValue);
                        }}
                      />
                      {formik.errors.interpret_detail_full_content &&
                      formik.touched.interpret_detail_full_content ? (
                        <div
                          className="field-validation-error alert alert-danger fade show"
                          role="alert"
                        >
                          {formik.errors.interpret_detail_full_content}
                        </div>
                      ) : null}
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
                          onClick={() => window._$g.rdr(`/interpret/d-edit/${id}`)}
                          disabled={formik.isSubmitting}
                        >
                          <i className="fa fa-edit mr-1" />
                          Chỉnh sửa
                        </Button>
                      </CheckAccess>
                    ) : (
                      <>
                        <CheckAccess
                          permission={
                            interpretDetailEnt ? `FOR_INTERPRET_EDIT` : `FOR_INTERPRET_ADD`
                          }
                        >
                          <button
                            className="mr-2 btn-block-sm btn btn-primary"
                            onClick={() => {
                              setbtnType("save");
                            }}
                            type="submit"
                            disabled={formik.isSubmitting}
                          >
                            <i className="fa fa-save mr-1" />
                            Lưu
                          </button>
                        </CheckAccess>
                        <CheckAccess
                          permission={
                            interpretDetailEnt ? `FOR_INTERPRET_EDIT` : `FOR_INTERPRET_ADD`
                          }
                        >
                          <button
                            className="mr-2 btn-block-sm btn btn-success"
                            onClick={() => {
                              setbtnType("save_n_close");
                            }}
                            type="submit"
                            disabled={formik.isSubmitting}
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
                      onClick={() => {
                        if (interpretDetailEnt) {
                          window._$g.rdr(`/interpret`);
                        } else {
                          window._$g.rdr(`/interpret`);
                        }
                      }}
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

export default InterPretChildAdd;
