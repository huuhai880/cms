import React, { PureComponent } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
} from "reactstrap";
import { readImageAsBase64 } from "../../utils/html";
import { Editor } from "@tinymce/tinymce-react";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import Loading from "../Common/Loading";

// Model(s)
import AttributesGroupModel from "../../models/AttributesGroupModel";
import AuthorModel from "../../models/AuthorModel";
import Upload from "../Common/Antd/Upload";
import "./style.scss";
/**
 * @class AttrubtesGroupAdd
 */
export default class AttrubtesGroupAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._attributesGroupModel = new AttributesGroupModel();
    this._authorModel = new AuthorModel();

    // Init state
    // +++
    this.state = {
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
      clearImage: false,
    };
  }

  componentDidMount() {
    (async () => {
      let bundle = await this._getBundleData({});
      this.setState({ ...bundle, ready: true });
    })();
    //.end
  }

  /**
   *
   * @return {Object}
   */
  getInitialValues = () => {
    let { attributesGroupEnt } = this.props;
    let values = Object.assign(
      {},
      this._attributesGroupModel.fillable(),
      attributesGroupEnt
    );

    // Format
    Object.keys(values).forEach((key) => {
      if (null === values[key]) {
        values[key] = "";
      }
    });
    // Return;
    return values;
  };

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let bundle = {};
    let all = [];

    await Promise.all(all).catch((err) =>
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`)
        //,() => window.location.reload()
      )
    );
    //
    Object.keys(bundle).forEach((key) => {
      let data = bundle[key];
      let stateValue = this.state[key];
      if (data instanceof Array && stateValue instanceof Array) {
        data = [stateValue[0]].concat(data);
      }
      bundle[key] = data;
    });
    // console.log('bundle: ', bundle);
    //
    return bundle;
  }

  formikValidationSchema = Yup.object().shape({
    group_name: Yup.string().trim().required("Tên chỉ số là bắt buộc."),
  });
  handleUploadImage = async (blobInfo, success, failure) => {
    readImageAsBase64(blobInfo.blob(), async (imageUrl) => {
      try {
        const imageUpload = await this._authorModel.upload({
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
  handleFormikBeforeRender = ({ initialValues }) => {
    let { values } = this.formikProps;
    if (values === initialValues) {
      return;
    }
    // Reformat data
    // +++
    Object.assign(values, {
      // +++
    });
  };

  /** @var {String} */
  _btnType = null;

  handleSubmit = (btnType) => {
    let { submitForm } = this.formikProps;

    this._btnType = btnType;

    return submitForm();
  };

  handleFormikSubmit = (values, formProps) => {
    let { setSubmitting } = formProps;
    let willRedirect = false;
    let alerts = [];
    let { attributesGroupEnt } = this.props;
    // Build form data
    // +++

    let { is_active, group_name } = values;
    // +++
    let formData = Object.assign({}, values, {
      is_active: is_active ? 1 : 0,
      group_name: group_name ? group_name.trim() : "",
    });
    //
    const group_nameId =
      (attributesGroupEnt && attributesGroupEnt.attributes_group_id) ||
      formData[this._attributesGroupModel];
    let apiCall = group_nameId
      ? this._attributesGroupModel.update(group_nameId, formData)
      : this._attributesGroupModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/attributes-group");
        }
        // Chain
        return data;
      })
      .catch((apiData) => {
        // NG
        let { errors, statusText, message } = apiData;
        let msg = [`<b>${statusText || message}</b>`]
          .concat(errors || [])
          .join("<br/>");
        alerts.push({ color: "danger", msg });
      })
      .finally(() => {
        // Submit form is done!
        setSubmitting(false);
        //
        if (!attributesGroupEnt && !willRedirect && !alerts.length) {
          this.handleFormikReset();
        }

        this.setState(
          () => ({ alerts }),
          () => {
            window.scrollTo(0, 0);
          }
        );
      });
  };

  handleFormikReset = () => {
    this.setState((state) => ({
      ready: false,
      alerts: [],
      clearImage: true,
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true, clearImage: false });
    })();
    //.end
  };

  render() {
    let { ready } = this.state;

    // Ready?
    if (!ready) {
      return <Loading />;
    }

    let { alerts, countries, provinces, districts, wards } = this.state;

    /** @var {Object} */
    let initialValues = this.getInitialValues();
    const { noEdit, attributesGroupEnt } = this.props;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {attributesGroupEnt && attributesGroupEnt.attributes_group_id
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  chỉ số{" "}
                  {attributesGroupEnt ? attributesGroupEnt.group_name : ""}
                </b>
              </CardHeader>
              <CardBody>
                {/* general alerts */}
                {alerts.map(({ color, msg }, idx) => {
                  return (
                    <Alert
                      key={`alert-${idx}`}
                      color={color}
                      isOpen={true}
                      toggle={() => this.setState({ alerts: [] })}
                    >
                      <span dangerouslySetInnerHTML={{ __html: msg }} />
                    </Alert>
                  );
                })}
                <Formik
                  initialValues={initialValues}
                  validationSchema={this.formikValidationSchema}
                  onSubmit={this.handleFormikSubmit}
                >
                  {(formikProps) => {
                    let {
                      values,
                      // errors,
                      // status,
                      // touched, handleChange, handleBlur,
                      //submitForm,
                      //resetForm,
                      handleSubmit,
                      handleReset,
                      // isValidating,
                      isSubmitting,
                      /* and other goodies */
                    } = (this.formikProps = window._formikProps = formikProps);
                    // [Event]
                    this.handleFormikBeforeRender({ initialValues });
                    // Render
                    return (
                      <Form
                        id="form1st"
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                      >
                        <Row className="mb15">
                          <Col xs={12}>
                            <b className="underline">Thông tin chỉ số</b>
                          </Col>
                        </Row>
                        <Row className="pt-3">
                          <Col xs={12}>
                            <Row>
                              <Col xs={12}>
                                <FormGroup row>
                                  <Label
                                    for="group_name"
                                    className="text-left"
                                    sm={3}
                                  >
                                    Tên chỉ số
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={9}>
                                    <Field
                                      name="group_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          className="text-left"
                                          onBlur={null}
                                          type="text"
                                          id="group_name"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="group_name"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12}>
                                <FormGroup row>
                                  <Label
                                    for="group_name"
                                    className="text-left"
                                    sm={3}
                                  >
                                    Ký hiệu
                                  </Label>
                                  <Col sm={9}>
                                    <Field
                                      name="symbol"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          className="text-left"
                                          onBlur={null}
                                          type="text"
                                          id="symbol"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12}>
                                <FormGroup row>
                                  <Label
                                    for="icon_image"
                                    className="text-left"
                                    sm={3}
                                  >
                                    Icon
                                  </Label>
                                  <Col sm={9}>
                                    <Field
                                      name="icon_image"
                                      render={({ field }) => {
                                        return (
                                          <div className="icon-attributesgroup-upload">
                                            <Upload
                                              onChange={(img) =>
                                                field.onChange({
                                                  target: {
                                                    name: field.name,
                                                    value: img,
                                                  },
                                                })
                                              }
                                              imageUrl={values.icon_image}
                                              accept="image/*"
                                              disabled={noEdit}
                                              label="Kích thước 72x72"
                                            />
                                          </div>
                                        );
                                      }}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12}>
                                <FormGroup row>
                                  <Label
                                    for="description"
                                    className="text-left"
                                    sm={3}
                                  >
                                    Định nghĩa
                                  </Label>
                                  <Col sm={9}>
                                    <Field
                                      name="description"
                                      render={({ field /* _form */ }) => (
                                        <Editor
                                          apiKey={
                                            "3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"
                                          }
                                          value={values.description}
                                          disabled={noEdit}
                                          init={{
                                            height: "500px",
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
                                            menubar:
                                              "file edit view insert format tools table tc help",
                                            toolbar1:
                                              "undo redo | fullscreen | formatselect | bold italic underline strikethrough forecolor backcolor |fontselect |  fontsizeselect| \n" +
                                              "alignleft aligncenter alignright alignjustify",
                                            toolbar2:
                                              "bullist numlist outdent indent | removeformat | help | image | toc",
                                            file_picker_types: "image",
                                            images_dataimg_filter: function (
                                              img
                                            ) {
                                              return img.hasAttribute(
                                                "internal-blob"
                                              );
                                            },
                                            images_upload_handler:
                                              this.handleUploadImage,
                                          }}
                                          onEditorChange={(newValue) => {
                                            this.formikProps.setFieldValue(
                                              "description",
                                              newValue
                                            );
                                          }}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="description"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12}>
                                <FormGroup row>
                                  <Label
                                    for="instruction"
                                    className="text-left"
                                    sm={3}
                                  >
                                    Lời dẫn
                                  </Label>
                                  <Col sm={9}>
                                    <Field
                                      name="instruction"
                                      render={({ field /* _form */ }) => (
                                        <Editor
                                          apiKey={
                                            "3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"
                                          }
                                          value={values.instruction}
                                          disabled={noEdit}
                                          init={{
                                            height: "500px",
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
                                            menubar:
                                              "file edit view insert format tools table tc help",
                                            toolbar1:
                                              "undo redo | fullscreen | formatselect | bold italic underline strikethrough forecolor backcolor |fontselect |  fontsizeselect| \n" +
                                              "alignleft aligncenter alignright alignjustify",
                                            toolbar2:
                                              "bullist numlist outdent indent | removeformat | help | image | toc",
                                            file_picker_types: "image",
                                            images_dataimg_filter: function (
                                              img
                                            ) {
                                              return img.hasAttribute(
                                                "internal-blob"
                                              );
                                            },
                                            images_upload_handler:
                                              this.handleUploadImage,
                                          }}
                                          onEditorChange={(newValue) => {
                                            this.formikProps.setFieldValue(
                                              "instruction",
                                              newValue
                                            );
                                          }}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="instruction"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Label
                                for="description"
                                className="text-left"
                                sm={3}
                              >
                                {/* Định nghĩa */}
                              </Label>
                              <Col sm={9}>
                                <FormGroup row>
                                  <Col sm={3}>
                                    <Field
                                      name="is_powerditagram"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.is_powerditagram}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "is_powerditagram",
                                                value: target.checked,
                                              },
                                            });
                                            field.onChange({
                                              target: {
                                                name: "is_emptyditagram",
                                                value: 0,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_powerditagram"
                                          label="Sơ đồ sức mạnh"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_powerditagram"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                  <Col sm={3}>
                                    <Field
                                      name="is_emptyditagram"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.is_emptyditagram}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "is_emptyditagram",
                                                value: target.checked,
                                              },
                                            });
                                            field.onChange({
                                              target: {
                                                name: "is_powerditagram",
                                                value: 0,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_emptyditagram"
                                          label="Sơ đồ trục trống"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_emptyditagram"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                  <Col sm={3}>
                                    <Field
                                      name="is_active"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.is_active}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "is_active",
                                                value: target.checked,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_active"
                                          label="Kích hoạt"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_active"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col sm={6}></Col>
                            </Row>
                            <Row>
                              <Col sm={12} className="text-right mt-3">
                                {noEdit ? (
                                  <CheckAccess permission="FOR_ATTRIBUTESGROUP_EDIT">
                                    <Button
                                      color="primary"
                                      className="mr-2 btn-block-sm"
                                      onClick={() =>
                                        window._$g.rdr(
                                          `/attributes-group/edit/${attributesGroupEnt.attributes_group_id}`
                                        )
                                      }
                                    >
                                      <i className="fa fa-edit mr-1" />
                                      Chỉnh sửa
                                    </Button>
                                  </CheckAccess>
                                ) : (
                                  [
                                    <Button
                                      key="buttonSave"
                                      type="submit"
                                      color="primary"
                                      disabled={isSubmitting}
                                      onClick={() => this.handleSubmit("save")}
                                      className="mr-2 btn-block-sm"
                                    >
                                      <i className="fa fa-save mr-2" />
                                      Lưu
                                    </Button>,
                                    <Button
                                      key="buttonSaveClose"
                                      type="submit"
                                      color="success"
                                      disabled={isSubmitting}
                                      onClick={() =>
                                        this.handleSubmit("save_n_close")
                                      }
                                      className="mr-2 btn-block-sm mt-md-0 mt-sm-2"
                                    >
                                      <i className="fa fa-save mr-2" />
                                      Lưu &amp; Đóng
                                    </Button>,
                                  ]
                                )}
                                <Button
                                  disabled={isSubmitting}
                                  onClick={() =>
                                    window._$g.rdr("/attributes-group")
                                  }
                                  className="btn-block-sm mt-md-0 mt-sm-2"
                                >
                                  <i className="fa fa-times-circle mr-1" />
                                  Đóng
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Form>
                    );
                  }}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
