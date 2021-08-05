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
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

// Component(s)
import Loading from "../Common/Loading";
import { FormInput, FormSwitch, ActionButton } from "@widget";
import Select from "react-select";
// Model(s)
import { fnGet, fnUpdate, fnPost } from "@utils/api";

// Util(s)

/**
 * @class FaqAdd
 */
export default class FaqAdd extends PureComponent {
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
      /** @var {Object} */
      selectedType: null,
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
    question: Yup.string()
      .required("Câu hỏi là bắt buộc.")
      .max(1000, "Tên dịch vụ không được nhiều hơn 1000 ký tự."),
    answer: Yup.string()
      .required("Câu trả lời là bắt buộc.")
      .max(3000, "Câu trả lời không được nhiều hơn 1000 ký tự."),
    faq_type: Yup.string().required("Phân loại là bắt buộc."),
    order_index: Yup.number().min(0, "Thứ tự  bắt buộc lớn hơn hoặc bằng 0"),
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
    let { faqEnt } = this.props;
    let values = {
      question: "",
      answer: "",
      order_index: 0,
      is_active: 1,
      faq_type: "",
    };
    if (faqEnt) values = { ...values, ...faqEnt };
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

    return bundle;
  }

  handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;

    return submitForm();
  }

  async handleFormikSubmit(values, formProps) {
    let { faqEnt } = this.props;
    let faqID = (faqEnt && faqEnt.faq_id) || "";
    let { setSubmitting, resetForm } = formProps;

    let willRedirect = false;
    let alerts = [];
    // Build form data
    let formData = {
      ...values,
      is_active: 1 * values.is_active,
    };

    try {
      faqEnt
        ? await fnUpdate({
            url: `faq/${faqID}`,
            body: formData,
          })
        : await fnPost({ url: "faq", body: formData });

      window._$g.toastr.show("Lưu thành công!", "success");
      if (this._btnType === "save_n_close") {
        willRedirect = true;
        return window._$g.rdr("/faq");
      }

      if (this._btnType === "save") {
        if (!faqEnt && !willRedirect && !alerts.length) {
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
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({
        ...bundle,
        ready: true,
      });
    })();
    //.end
  }

  handleFaqTypeChange(value) {
    fnGet({ url: `faq/get-newest-index/${value.value}` }).then((data) => {
      this.formikProps.setFieldValue("order_index", data.order_index);
    });
    this.setState({ selectedType: value });
  }

  render() {
    let { _id, ready, alerts, selectedType } = this.state;

    let { faqEnt, noEdit } = this.props;
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
                  {faqEnt ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"}{" "}
                  Câu hỏi {faqEnt ? faqEnt.question : ""}
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
                        <Row className="mb-4">
                          <Col xs={12}>
                            <b className="title_page_h1 text-primary">
                              Thông tin câu hỏi
                            </b>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12}>
                            <FormGroup row>
                              <Label for="faq_type" sm={3}>
                                Phân loại
                                <span className="font-weight-bold red-text">
                                  *
                                </span>
                              </Label>
                              <Col sm={9}>
                                <Field
                                  name="faq_type"
                                  render={({ field }) => {
                                    const faqTypeOptions = [
                                      { label: "Góc tác giả", value: 1 },
                                      { label: "Góc nhà xuất bản", value: 2 },
                                    ];

                                    let defaultValue = faqTypeOptions.find(
                                      ({ value }) => {
                                        return 1 * value === 1 * field.value;
                                      }
                                    );
                                    return (
                                      <Select
                                        {...field}
                                        className="MuiPaper-filter__custom--select"
                                        id="faq_type"
                                        name="faq_type"
                                        isSearchable={true}
                                        value={defaultValue}
                                        placeholder={"-- Chọn --"}
                                        options={faqTypeOptions}
                                        onChange={(value) => {
                                          field.onChange({
                                            target: {
                                              name: field.name,
                                              value: value.value,
                                            },
                                          });
                                          this.handleFaqTypeChange(value);
                                        }}
                                        menuPortalTarget={document.querySelector(
                                          "body"
                                        )}
                                        isDisabled={noEdit}
                                      />
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name="faq_type"
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
                          <Col xs={12}>
                            <Row>
                              <FormInput
                                label={"Câu hỏi"}
                                name="question"
                                isEdit={!noEdit}
                                labelSm={3}
                                inputSm={9}
                              />
                              <FormInput
                                name="answer"
                                label="Trả lời"
                                isEdit={!noEdit}
                                type="textarea"
                                rowsTextArea={4}
                                labelSm={3}
                                inputSm={9}
                              />
                            </Row>
                          </Col>
                          <Col xs={12}>
                            <FormGroup row>
                              <Label for="order_index" sm={3}>
                                Thứ tự
                              </Label>
                              <Col sm={9}>
                                <Field
                                  name="order_index"
                                  render={({ field /* _form */ }) => (
                                    <Input
                                      {...field}
                                      onBlur={null}
                                      type="number"
                                      name="order_index"
                                      id="order_index"
                                      className="text-right"
                                      value={field.value}
                                      disabled={noEdit || selectedType === null}
                                      min={0}
                                    />
                                  )}
                                />
                                <ErrorMessage
                                  name="order_index"
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
                          <FormSwitch
                            name="is_active"
                            label="Kích hoạt"
                            isEdit={!noEdit}
                            checked={values.is_active}
                            sm={12}
                            type="checkbox"
                            labelSm={3}
                            inputSm={9}
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
                              permission: "MD_FAQ_EDIT",
                              onClick: () =>
                                window._$g.rdr(
                                  faqEnt ? `/faq/edit/${faqEnt.faq_id}` : ""
                                ),
                            },
                            {
                              title: "Lưu",
                              color: "primary",
                              isShow: !noEdit,
                              icon: "save",
                              permission: ["MD_FAQ_EDIT", "MD_FAQ_ADD"],
                              onClick: () => this.handleSubmit("save"),
                            },
                            {
                              title: "Lưu và đóng",
                              color: "success",
                              isShow: !noEdit,
                              icon: "save",
                              permission: ["MD_FAQ_EDIT", "MD_FAQ_ADD"],
                              onClick: () => this.handleSubmit("save_n_close"),
                            },
                            {
                              title: "đóng",
                              icon: "times-circle",
                              isShow: true,
                              notSubmit: true,
                              onClick: () => window._$g.rdr("/faq"),
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
