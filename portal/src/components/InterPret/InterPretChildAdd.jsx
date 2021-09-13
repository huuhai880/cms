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
import { initialValues, validationSchema } from "./constChild";
import InterpretModel from "../../models/InterpretModel";
import NumberFormat from "../Common/NumberFormat";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Checkbox } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import Select from "react-select";
import { readImageAsBase64 } from "../../utils/html";
layoutFullWidthHeight();

function InterPretChildAdd({ noEdit }) {
  const _interpretModel = new InterpretModel();
  const [dataInterpretDetail, setDataInterpretDetail] = useState(initialValues);
  const [dataInterpretDetailParent, setDataInterpretDetailParent] = useState([]);
  let { id } = useParams();
  const [btnType, setbtnType] = useState("");
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataInterpretDetail,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCreateOrUpdate(values);
    },
  });
  ///// get data partnert
  useEffect(() => {
    // console.log(id)
    const _callAPI = async () => {
      try {
        if (dataInterpretDetail.interpret_id) {
          console.log(dataInterpretDetail.interpret_id.trim())
          await _interpretModel
            .getListInterpretParent(dataInterpretDetail.interpret_id)
            .then((data) => {
              setDataInterpretDetailParent(data.items);
              //   console.log(setDataPartner);
            });
        } else {
          await _interpretModel.getListInterpretParent(id).then((data) => {
            setDataInterpretDetailParent(data.items);
            //   console.log(setDataPartner);
          });
        }
      } catch (error) {
        console.log(error);
        window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
      }
    };
    _callAPI();
  }, []);
  //// create letter
  const handleCreateOrUpdate = async (values) => {
    // console.log(values)
    try {
      await _interpretModel
        .checkInterpretname({ interpret_detail_name: values.interpret_detail_name })
        .then((data) => {
          // console.log(data)
          if (
            data.INTERPRETDETAILID &&
            formik.values.interpret_detail_name != dataInterpretDetail.interpret_detail_name
          ) {
            // setalert("Email đã tồn tại!");
            formik.setFieldError("interpret_detail_name", "Tên luận giải đã tồn tại!");
            // window.scrollTo(0, 0);
          } else {
            // console.log("zzzzzzzz")
            _interpretModel.createInterpretDetail(values).then((data) => {
              if (btnType == "save") {
                setDataInterpretDetail(initialValues);
                window._$g.toastr.show("Lưu thành công!", "success");
              } else if (btnType == "save&quit") {
                window._$g.toastr.show("Lưu thành công!", "success");
                setDataInterpretDetail(initialValues);
                return window._$g.rdr(`/interpret/interpret-detail/${values.interpret_id}`);
              }
            });
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
      await _interpretModel.detailInterPretDetail(id).then((data) => {
        // console.log(data);
        setDataInterpretDetail(data);
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
  ///////// option Mainnumber
  const getOptionMainNumBer = () => {
    // console.log(dataInterpretDetailParent)
    if (dataInterpretDetailParent && dataInterpretDetailParent.length) {
      return dataInterpretDetailParent.map((item) => {
        // console.log(dataInterpretDetailParent);
        return formik.values.interpret_detail_parent_id == item.interpret_detail_parent_id
          ? {
              value: item.interpret_detail_parent_id,
              label: item.interpret_detail_parent_name,
              // isDisabled: true,
            }
          : {
              value: item.interpret_detail_parent_id,
              label: item.interpret_detail_parent_name,
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
              <b>{id ? "Chỉnh sửa" : "Thêm mới"} luận giải </b>
            </CardHeader>
            <CardBody>
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
                  <Row>
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="interpret_detail_parent_id" sm={4}>
                          Luận giải chi tiết
                        </Label>
                        <Col sm={8}>
                          <Select
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            menuPortalTarget={document.querySelector("body")}
                            isDisabled={noEdit}
                            placeholder={"-- Chọn --"}
                            value={convertValue(
                              formik.values.interpret_detail_parent_id,
                              getOptionMainNumBer()
                            )}
                            options={getOptionMainNumBer(
                              formik.values.interpret_detail_parent_id,
                              true
                            )}
                            onChange={(value) => {
                              formik.setFieldValue("interpret_detail_parent_id", value.value);
                            }}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col xs={6}>
                      <FormGroup row>
                        <Label for="interpret_detail_short_content" sm={4}>
                          Mô tả ngắn <span className="font-weight-bold red-text">*</span>
                        </Label>
                        <Col sm={8}>
                          <Input
                            name="interpret_detail_short_content"
                            id="interpret_detail_short_content"
                            type="textarea"
                            placeholder="Ghi chú"
                            disabled={noEdit}
                            value={formik.values.interpret_detail_short_content}
                            onChange={formik.handleChange}
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
                  </Row>
                </Col>
                <Col xs={12} sm={12}>
                  <FormGroup row>
                    <Label for="interpret_detail_full_content" sm={2}>
                      Mô tả<span className="font-weight-bold red-text">*</span>
                    </Label>
                    <Col sm={10}>
                      <Editor
                        apiKey={"3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"}
                        scriptLoading={{
                          delay: 500,
                        }}
                        value={formik.values.interpret_detail_full_content}
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
                          formik.setFieldValue("interpret_detail_full_content", newValue);
                        }}
                        // onEditorChange={formik.handleChange}
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
                          onClick={() => window._$g.rdr(`/interpret/interpret-detail/edit/${id}`)}
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
                      onClick={() =>
                        window._$g.rdr(
                          `/interpret/interpret-detail/${dataInterpretDetail.interpret_id}`
                        )
                      }
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
