import React, { PureComponent } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Alert, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import "react-image-lightbox/style.css";
import { FormInput, ActionButton, UploadImage, FormSwitch } from "@widget";

import './styles.scss';
// Component(s)
import Loading from "../Common/Loading";

// Model(s)
import ProductModel from "../../models/ProductModel";
import { fnGet, fnUpdate, fnPost, fnDelete } from "@utils/api";

/**
 * @class ProductAdd
 */
export default class ProductAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._productModel = new ProductModel();

    // Bind method(s)
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);

    // +++
    this.state = {
      isCheckService: false,
      _id: 0,
      alerts: [],
      ready: false,
      logoUrl: "",
      clearImage: false,
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
    publishing_company_name: Yup.string().required(
      "Tên nhà sản xuất là bắt buộc"
    ),
    publishing_company_qoute: Yup.string().required(
      "Nhà xuất bản nói gì về SCC là bắt buộc"
    ),
    logo_image: Yup.string().required("Logo nhà sản xuất là bắt buộc"),
  });

  /** @var {String} */
  _btnType = null;

  getInitialValues() {
    let { objectEnt } = this.props;
    let values = {
      publishing_company_name: "",
      logo_image: "",
      is_active: 1,
    };

    if (objectEnt) {
      values = {
        ...values,
        ...objectEnt,
      };
    }
    this.setState({ logoUrl: values.logo_image });
    return values;
  }

  /**
   * Goi API, lay toan bo data lien quan,...
   */
  async _getBundleData() {
    let { objectEnt } = this.props;
    return {};
  }

  async handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;
    return submitForm();
  }

  async handleFormikSubmit(values, formProps) {
    let { objectEnt } = this.props;
    let { setSubmitting, resetForm } = formProps;

    let willRedirect = false;
    let alerts = [];

    let formData = {
      ...values,
    };

    setSubmitting(true);
    try {
      const id = objectEnt ? objectEnt.publishing_company_id : "";
      if (id) {
        const data = await fnUpdate({
          url: `publishing-company/${id}`,
          body: formData,
        });
      } else {
        const data = await fnPost({
          url: "publishing-company",
          body: formData,
        });
      }

      setSubmitting(false);
      window._$g.toastr.show("Lưu thành công!", "success");
      if (this._btnType === "save_n_close") {
        willRedirect = true;
        return window._$g.rdr("/publishing-company");
      }

      // if (this._btnType === "save") resetForm();
    } catch (e) {
      let { errors, statusText, message } = e;
      let msg = [`<b>${statusText || message}</b>`]
        .concat(errors || [])
        .join("<br/>");
      alerts.push({ color: "danger", msg });
    }

    setSubmitting(false);
    //
    if (!objectEnt && !willRedirect && !alerts.length) {
      return this.handleFormikReset();
    }
    this.setState(
      () => ({ alerts }),
      () => {
        window.scrollTo(0, 0);
      }
    );
  }

  handleFormikReset() {
    // let { campaignEnt } = this.props;
    this.setState((state) => ({
      ready: false,
      alerts: [],
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    //.end
  }

  render() {
    let { _id, ready, alerts } = this.state;
    let { objectEnt, noEdit } = this.props;
    let initialValues = this.getInitialValues();
    // Ready?
    if (!ready) {
      return <Loading />;
    }
    return (
      <div key={`view-${_id}`} className="animated fadeIn">
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <b>
                  {objectEnt ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"}{" "}
                  nhà xuất bản{" "}
                  {objectEnt ? objectEnt.publishing_company_name : ""}
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
                              <FormInput
                                label="Tên nhà xuất bản"
                                name="publishing_company_name"
                                isEdit={!noEdit}
                              />
                            </Row>
                            <Row>
                              <FormInput
                                inputClassName="publishing-company_textarea"
                                name="publishing_company_quote"
                                label="Nhà xuất bản nói gì về SCC"
                                isEdit={!noEdit}
                                type="textarea"
                              />
                            </Row>
                          </Col>
                          <Col xs={12} sm={4}>
                            <UploadImage
                              urlImageEdit={this.state.logoUrl}
                              clearImage={this.state.clearImage}
                              isEdit={!noEdit}
                              name="logo_image"
                              title="Logo nhà xuất bản"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <FormSwitch
                            name="is_active"
                            label="Kích hoạt"
                            isEdit={!noEdit}
                            checked={values.is_active}
                            sm={8}
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
                              permission: "MD_PUBLISHINGCOMPANY_EDIT",
                              onClick: () =>
                                window._$g.rdr(
                                  `/products/edit/${objectEnt.id()}`
                                ),
                            },
                            {
                              title: "Lưu",
                              color: "primary",
                              isShow: !noEdit,
                              icon: "save",
                              onClick: () => this.handleSubmit("save"),
                            },
                            {
                              title: "Lưu và đóng",
                              color: "success",
                              isShow: !noEdit,
                              icon: "save",
                              onClick: () => this.handleSubmit("save_n_close"),
                            },
                            {
                              title: "đóng",
                              icon: "times-circle",
                              isShow: true,
                              notSubmit: true,
                              onClick: () =>
                                window._$g.rdr("/publishing-company"),
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
