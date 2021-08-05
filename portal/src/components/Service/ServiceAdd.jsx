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
  Table,
} from "reactstrap";

// Component(s)
import Loading from "../Common/Loading";
import { FormInput, FormSwitch, ActionButton, UploadImage } from "@widget";

// Model(s)
import { fnGet, fnUpdate, fnPost, fnDelete } from "@utils/api";

// Util(s)

/**
 * @class ServiceAdd
 */
export default class ServiceAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Bind method(s)
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);

    // +++
    this.state = {
      /** @var {Number} */
      _id: 0,
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
      /** @var {Array} */
      clearImage: false,
      /** @var {String} */
      imageUrl: "",
    };
  }

  componentDidMount() {
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    //.end
  }

  formikValidationSchema = Yup.object().shape({
    service_name: Yup.string()
      .required("Tên dịch vụ là bắt buộc.")
      .max(255, "Tên dịch vụ không được nhiều hơn 255 ký tự."),
    content: Yup.string().required("Nội dung dịch vụ là bắt buộc."),
    image: Yup.string().required("Hình ảnh là bắt buộc."),
  });

  handleFormikBeforeRender({ initialValues }) {
    let { values } = this.formikProps;
    if (values === initialValues) {
      return;
    }
    // Reformat data
  }

  /** @var {String} */
  _btnType = null;

  getInitialValues() {
    let { serviceEnt } = this.props;
    let values = {
      service_name: "",
      content: "",
      image: "",
      is_active: 1,
    };
    if (serviceEnt) values = { ...values, ...serviceEnt };
    return values;
  }

  /**
   * Goi API, lay toan bo data lien quan,...
   */
  async _getBundleData() {
    let bundle = {};
    // let all = [];
    // await Promise.all(all).catch((err) =>
    //   window._$g.dialogs.alert(
    //     window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
    //     () => window.location.reload()
    //   )
    // );

    // Object.keys(bundle).forEach((key) => {
    //   let data = bundle[key];
    //   let stateValue = this.state[key];
    //   if (data instanceof Array && stateValue instanceof Array) {
    //     data = [stateValue[0]].concat(data);
    //   }
    //   bundle[key] = data;
    // });

    let { serviceEnt } = this.props;
    if (serviceEnt && serviceEnt.image) {
      bundle["imageUrl"] = serviceEnt.image;
    }

    return bundle;
  }

  handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;

    return submitForm();
  }

  async handleFormikSubmit(values, formProps) {
    let { serviceEnt } = this.props;
    let serviceID = (serviceEnt && serviceEnt.service_id) || "";
    let { setSubmitting, resetForm } = formProps;

    let willRedirect = false;
    let alerts = [];

    // Build form data
    let formData = {
      ...values,
      is_active: 1 * values.is_active,
    };

    try {
      serviceEnt
        ? await fnUpdate({
            url: `service/${serviceID}`,
            body: formData,
          })
        : await fnPost({ url: "service", body: formData });

      window._$g.toastr.show("Lưu thành công!", "success");
      if (this._btnType === "save_n_close") {
        willRedirect = true;
        return window._$g.rdr("/service");
      }

      if (this._btnType === "save") {
        if (!serviceEnt && !willRedirect && !alerts.length) {
          this.handleFormikReset();
        }
      }
    } catch (e) {
      alerts.push({ color: "danger", msg: "Lưu không thành công" });
    }
    setSubmitting(false);
    this.setState(
      () => ({ alerts }),
      () => {
        window.scrollTo(0, 0);
      }
    );
  }

  handleFormikReset() {
    this.setState((state) => ({
      ready: false,
      alerts: [],
      clearImage: true,
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({
        ...bundle,
        ready: true,
        clearImage: false,
      });
    })();
    //.end
  }

  render() {
    let { _id, ready, alerts } = this.state;

    let { serviceEnt, noEdit } = this.props;
    let initialValues = this.getInitialValues();

    // Ready?
    if (!ready) {
      return <Loading />;
    }

    return (
      <div key={`view-${_id}`} className="animated fadeIn">
        <Row className="d-flex justify-content-center">
          <Col xs={12} hidden={this.state.toggleAttribute}>
            <Card>
              <CardHeader>
                <b>
                  {serviceEnt
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  dịch vụ {serviceEnt ? serviceEnt.service_name : ""}
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
                    let { values, handleSubmit, handleReset, isSubmitting } =
                      (this.formikProps =
                      window._formikProps =
                        formikProps);
                    // Render
                    return (
                      <Form
                        id="form1st"
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                      >
                        <Row>
                          <Col xs={12} sm={8}>
                            <Row className="mb-4">
                              <Col xs={12}>
                                <b className="title_page_h1 text-primary">
                                  Thông tin danh mục
                                </b>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={12}>
                                <Row>
                                  <FormInput
                                    label={"Tên dịch vụ"}
                                    name="service_name"
                                    isEdit={!noEdit}
                                  />
                                  <FormInput
                                    name="content"
                                    label="Nội dung dịch vụ"
                                    isEdit={!noEdit}
                                    type="textarea"
                                    rowsTextArea={5}
                                  />
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                          {/* Upload image */}
                          <Col xs={12} sm={4}>
                            <Row>
                              <Col xs={12}>
                                <UploadImage
                                  urlImageEdit={this.state.imageUrl}
                                  clearImage={this.state.clearImage}
                                  isEdit={!noEdit}
                                  name="image"
                                  title="Hình ảnh"
                                  // isTitleCenter={true}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>

                        <Row>
                          <FormSwitch
                            name="is_active"
                            label="Kích hoạt"
                            isEdit={!noEdit}
                            checked={values.is_active}
                            sm={8}
                            type="checkbox"
                          />
                        </Row>

                        {/* action button */}
                        <ActionButton
                          isSubmitting={isSubmitting}
                          buttonList={[
                            {
                              title: "Chỉnh sửa",
                              color: "primary",
                              isShow: noEdit,
                              icon: "edit",
                              permission: "MD_SERVICE_EDIT",
                              onClick: () =>
                                window._$g.rdr(
                                  serviceEnt
                                    ? `/service/edit/${serviceEnt.service_id}`
                                    : ""
                                ),
                            },
                            {
                              title: "Lưu",
                              color: "primary",
                              isShow: !noEdit,
                              icon: "save",
                              permission: ["MD_SERVICE_EDIT", "MD_SERVICE_ADD"],
                              onClick: () => this.handleSubmit("save"),
                            },
                            {
                              title: "Lưu và đóng",
                              color: "success",
                              isShow: !noEdit,
                              icon: "save",
                              permission: ["MD_SERVICE_EDIT", "MD_SERVICE_ADD"],
                              onClick: () => this.handleSubmit("save_n_close"),
                            },
                            {
                              title: "Đóng",
                              icon: "times-circle",
                              isShow: true,
                              notSubmit: true,
                              onClick: () => window._$g.rdr("/service"),
                            },
                          ]}
                        />
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
