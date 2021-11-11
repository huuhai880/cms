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
  Media,
  Input,
  Button,
} from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./const";
import FarmousModel from "../../models/FarmousModel";
import NumberFormat from "../Common/NumberFormat";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Checkbox } from "antd";
import { readFileAsBase64 } from "../../utils/html";
import DatePicker from "../Common/DatePicker";
import moment from "moment";
import { Radio } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { readImageAsBase64 } from "../../utils/html";
import "./styles.scss";
layoutFullWidthHeight();

function FarmousAdd({ noEdit }) {
  const _farmousModel = new FarmousModel();
  const [dataFarmous, setDataFarmous] = useState(initialValues);
  let { id } = useParams();
  const [btnType, setbtnType] = useState("");
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataFarmous,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCreateOrUpdate(values);
    },
  });
  useEffect(() => {
    if (document.body.classList.contains("tox-fullscreen")) {
      document.body.classList.remove("tox-fullscreen");
    }
  }, []);
  //// create farmous
  const handleCreateOrUpdate = async (values) => {
    try {
      await _farmousModel.checkFarmous({ farmous_name: values.farmous_name }).then((data) => {
        // console.log(data)
        if (data.FAMOUSID && formik.values.farmous_name != dataFarmous.farmous_name) {
          // setalert("Email đã tồn tại!");
          formik.setFieldError("farmous_name", "Họ và tên đã tồn tại!");
          // window.scrollTo(0, 0);
        } else {
          values.birthday=moment(values.birthday)
          _farmousModel.create(values).then((data) => {
            window._$g.toastr.show("Lưu thành công!", "success");
            if (btnType == "save_n_close") {
              return window._$g.rdr("/famous");
            }
            if (btnType == "save" && !id) {
              formik.resetForm();
            }
          });
          // console.log(data);
        }
      });
    } catch (error) {}finally {
      formik.setSubmitting(false);
      window.scrollTo(0, 0);

    }
  };
  //////get data detail
  useEffect(() => {
    if (id) {
      _initDataDetail();
    }
  }, [id]);
  /////// config img
  const handleUserImageChange = (event) => {
    let { target } = event;
    if (target.files[0]) {
      readFileAsBase64(target, {
        // option: validate input
        validate: (file) => {
          // Check file's type
          if ("type" in file) {
            if (file.type.indexOf("image/") !== 0) {
              return "Chỉ được phép sử dụng tập tin ảnh.";
            }
          }
          // Check file's size in bytes
          if ("size" in file) {
            let maxSize = 4; /*4mb*/
            if (file.size / 1024 / 1024 > maxSize) {
              return `Dung lượng tập tin tối đa là: ${maxSize}mb.`;
            }
          }
        },
      })
        .then((usrImgBase64) => {
          formik.setFieldValue("image_avatar", usrImgBase64[0]);
        })
        .catch((err) => {
          window._$g.dialogs.alert(window._$g._(err.message));
        });
    }
  };
  //////config editor images
  const handleUploadImageDesc = async (blobInfo, success, failure) => {
    readImageAsBase64(blobInfo.blob(), async (imageUrl) => {
      try {
        const imageUpload = await _farmousModel.upload({
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
  const handleUploadImageShortDesc = async (blobInfo, success, failure) => {
    readImageAsBase64(blobInfo.blob(), async (imageUrl) => {
      try {
        const imageUpload = await _farmousModel.upload({
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
  //// data detail
  const _initDataDetail = async () => {
    try {
      await _farmousModel.detail(id).then((data) => {
        // data.birthday = "19/05/1980"

        setDataFarmous(data);
        // console.log()
      });
    } catch (error) {
      // console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };

  return (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
              {/* <b>{id ? "Chỉnh sửa" : "Thêm mới"}  </b> */}
              <b>{id ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} người nổi tiếng </b>
            </CardHeader>
            <CardBody>
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                <Row>
                  <Col xs={12} sm={3}>
                    <Row className="mb15">
                      <Col xs={12}>
                        <b className="underline">Hình đại diện</b>
                        <span className="font-weight-bold red-text">*</span>
                      </Col>
                    </Row>
                    <FormGroup row>
                      <Col sm={12}>
                        <div className="ps-relative">
                          {formik.values.image_avatar ? (
                            <Media
                              object
                              src={formik.values.image_avatar}
                              alt="User image"
                              // className="user-imgage"
                              className="user-imgage radius-50-percent"
                            />
                          ) : (
                            <i
                              style={{
                                fontSize: 50,
                                paddingTop: 65,
                                paddingLeft: 70,
                              }}
                              className="user-imgage radius-50-percent fa fa-plus"
                            />
                          )}
                          <Input
                            type="file"
                            id="icon"
                            className="input-overlay"
                            onChange={handleUserImageChange}
                            disabled={noEdit}
                          />
                        </div>
                        {formik.errors.image_avatar && (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.image_avatar}
                          </div>
                        )}
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={9}>
                    <Row className="mb15">
                      <Col xs={12}>
                        <b className="underline">Thông tin cá nhân</b>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={6}>
                        <FormGroup row>
                          <Label for="user_name" sm={4}>
                            Họ và tên <span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <Input
                              name="farmous_name"
                              id="farmous_name"
                              type="text"
                              placeholder="Họ và tên"
                              disabled={noEdit}
                              value={formik.values.farmous_name}
                              onChange={(e) => {
                                formik.setFieldValue("farmous_name", e.target.value);
                              }}
                            />
                            {formik.errors.farmous_name && (
                              <div
                                className="field-validation-error alert alert-danger fade show"
                                role="alert"
                              >
                                {formik.errors.farmous_name}
                              </div>
                            )}
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs={12} sm={6}>
                        <FormGroup row>
                          <Label for="user_name" sm={4}>
                            Chức danh<span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <Input
                              name="position"
                              id="position"
                              type="text"
                              placeholder="Chức danh"
                              disabled={noEdit}
                              value={formik.values.position}
                              onChange={(e) => {
                                formik.setFieldValue("position", e.target.value);
                              }}
                            />
                            {formik.errors.position && (
                              <div
                                className="field-validation-error alert alert-danger fade show"
                                role="alert"
                              >
                                {formik.errors.position}
                              </div>
                            )}
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12} sm={6}>
                        <FormGroup row>
                          <Label for="nick_name" sm={4}>
                            Ngày sinh <span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <DatePicker
                              id="birthday"
                              date={formik.values.birthday ? moment(formik.values.birthday) : null}
                              onDateChange={(dates) => {
                                // setFieldValue("birth_day", dates);
                                // console.log(dates)
                                formik.setFieldValue("birthday", dates);
                              }}
                              disabled={noEdit}
                              maxToday
                            />

                            {formik.errors.birthday && (
                              <div
                                className="field-validation-error alert alert-danger fade show"
                                role="alert"
                              >
                                {formik.errors.birthday}
                              </div>
                            )}
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs={12} sm={6}>
                        <FormGroup row>
                          <Label for="user_name" sm={4}>
                            Giới tính<span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <Radio.Group
                              disabled={noEdit}
                              onChange={(e) => {
                                // setValue(e.target.value);
                                formik.setFieldValue("gender", e.target.value);
                              }}
                              value={formik.values.gender}
                            >
                              <Radio value={1}>Nam</Radio>
                              <Radio value={0}>Nữ</Radio>
                              {/* <Radio value={-1}>Khác</Radio> */}
                            </Radio.Group>
                            {formik.errors.gender && (
                              <div
                                className="field-validation-error alert alert-danger fade show"
                                role="alert"
                              >
                                {formik.errors.gender}
                              </div>
                            )}
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12}>
                        <FormGroup row>
                          <Label for="short_desc" sm={2}>
                            Tóm tắt
                          </Label>
                          <Col sm={10}>
                            <Editor
                              apiKey={"3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"}
                              scriptLoading={{
                                delay: 0,
                              }}
                              value={formik.values.short_desc}
                              disabled={noEdit}
                              init={{
                                height: "500px",
                                width: "100%",
                                menubar: false,
                                branding: false,
                                statusbar: false,
                                entity_encoding: "raw",
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
                                images_upload_handler: handleUploadImageShortDesc,
                              }}
                              onEditorChange={(newValue) => {
                                formik.setFieldValue("short_desc", newValue);
                              }}
                            />

                            {formik.errors.short_desc && formik.touched.short_desc ? (
                              <div
                                className="field-validation-error alert alert-danger fade show"
                                role="alert"
                              >
                                {formik.errors.short_desc}
                              </div>
                            ) : null}
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12}>
                        <FormGroup row>
                          <Label for="desc" sm={2}>
                            Mô tả
                          </Label>
                          <Col sm={10}>
                            <Editor
                              apiKey={"3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"}
                              scriptLoading={{
                                delay: 0,
                              }}
                              value={formik.values.desc}
                              disabled={noEdit}
                              init={{
                                height: "500px",
                                width: "100%",
                                menubar: false,
                                branding: false,
                                statusbar: false,
                                entity_encoding: "raw",
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
                                images_upload_handler: handleUploadImageDesc,
                              }}
                              onEditorChange={(newValue) => {
                                formik.setFieldValue("desc", newValue);
                              }}
                            />

                            {formik.errors.desc && formik.touched.desc ? (
                              <div
                                className="field-validation-error alert alert-danger fade show"
                                role="alert"
                              >
                                {formik.errors.desc}
                              </div>
                            ) : null}
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={6}>
                        <FormGroup row>
                          <Label sm={4}>
                            {/* Chức danh<span className="font-weight-bold red-text">*</span> */}
                          </Label>
                          <Col sm={8}>
                            <Checkbox
                              disabled={noEdit}
                              onChange={(e) => {
                                formik.setFieldValue(`is_active`, e.target.checked);
                              }}
                              checked={formik.values.is_active}
                            >
                              Kích hoạt
                            </Checkbox>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs={12} sm={6}></Col>
                    </Row>
                  </Col>
                </Row>
                <div className="text-right mb-2">
                  <div>
                    {noEdit ? (
                      <CheckAccess permission="MD_FAMOUS_VIEW">
                        <Button
                          color="primary"
                          className="mr-2 btn-block-sm"
                          onClick={() => window._$g.rdr(`/famous/edit/${dataFarmous.farmous_id}`)}
                        >
                          <i className="fa fa-edit mr-1" />
                          Chỉnh sửa
                        </Button>
                      </CheckAccess>
                    ) : (
                      <>
                        <CheckAccess permission={id ? `MD_FAMOUS_EDIT` : `MD_FAMOUS_ADD`}>
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
                        <CheckAccess permission={id ? `MD_FAMOUS_EDIT` : `MD_FAMOUS_ADD`}>
                          <button
                            className="mr-2 btn-block-sm btn btn-success"
                            onClick={() => {
                              setbtnType("save_n_close");
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
                      onClick={() => window._$g.rdr(`/famous`)}
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

export default FarmousAdd;
