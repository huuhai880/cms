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
import { mapDataOptions4Select } from "../../utils/html";
import Select from "react-select";
import moment from "moment";
import "./styles.scss";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import Loading from "../Common/Loading";
import { DateTimePicker } from "@widget";
import { Editor } from "@tinymce/tinymce-react";

// Model(s)
import CrmReviewModel from "../../models/CrmReviewModel";

/**
 * @class CrmReviewAdd
 */
export default class CrmReviewAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._crmReviewModel = new CrmReviewModel();

    // Init state
    // +++
    this.state = {
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
      // OptsAccount: [{value: 0, label: "-- Chọn --"}],
      // OptsAuthor: [{value: 0, label: "-- Chọn --"}],
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
    let { crmReviewEnt } = this.props;
    let values = Object.assign(
      {},
      this._crmReviewModel.fillable(),
      crmReviewEnt
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
    let all = [
      this._crmReviewModel
        .getOptionsAcount({ is_active: 1 })
        .then((data) => (bundle["OptsAccount"] = mapDataOptions4Select(data))),
      this._crmReviewModel
        .getOptionsAuthor({ is_active: 1 })
        .then((data) => (bundle["OptsAuthor"] = mapDataOptions4Select(data))),
    ];

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
    member_id: Yup.string()
      .nullable()
      .when("check_member", {
        is: true,
        then: Yup.string().required("Khách hàng đánh giá là bắt buộc."),
      }),
    author_id: Yup.string()
      .nullable()
      .when("check_author", {
        is: true,
        then: Yup.string().required("Chuyên gia đánh giá là bắt buộc."),
      }),
    review_content: Yup.string().nullable().required("Nội dung là bắt buộc."),
    review_date: Yup.string().required("Ngày đánh giá là bắt buộc.").test(
      "DOB",
      "Thời gian chọn phải nhỏ hơn hoặc bằng thời gian hiện tại.",
      (value) => {
        return moment().diff(moment(value, "DD/MM/YYYY hh:mm"), "minutes") > 0;
      }
    ),
  });

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
    let { crmReviewEnt } = this.props;
    // Build form data
    // +++

    let { review_date, is_active } = values;
    let bdArr =
      review_date &&
      moment(review_date, "DD/MM/YYYY HH:mm:ss").format("YYYY/MM/DD HH:mm:ss");
    // +++
    let formData = Object.assign({}, values, {
      is_active: is_active ? 1 : 0,
      review_date: bdArr ? bdArr : "",
    });
    //
    const reviewId =
      (crmReviewEnt && crmReviewEnt.review_id) ||
      formData[this._crmReviewModel];
    let apiCall = reviewId
      ? this._crmReviewModel.update(reviewId, formData)
      : this._crmReviewModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/review");
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
        if (!crmReviewEnt && !willRedirect && !alerts.length) {
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
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
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
    const { noEdit, crmReviewEnt } = this.props;
    const { OptsAccount, OptsAuthor } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {crmReviewEnt && crmReviewEnt.review_id
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  đánh giá{" "}
                  {crmReviewEnt
                    ? crmReviewEnt.account_name || crmReviewEnt.author_name
                    : ""}
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
                            <b className="underline">Thông tin đánh giá</b>
                          </Col>
                        </Row>
                        <Row className="pt-3">
                          <Col xs={12}>
                            <Row>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Col sm={4}>
                                    <Field
                                      name="check_member"
                                      render={({ field }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.check_member}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "check_member",
                                                value: target.checked,
                                              },
                                            });
                                            field.onChange({
                                              target: {
                                                name: "check_author",
                                                value: !target.checked,
                                              },
                                            });
                                            if (!target.checked) {
                                              field.onChange({
                                                target: {
                                                  type: "select",
                                                  name: "member_id",
                                                  value: null,
                                                },
                                              });
                                            } else {
                                              field.onChange({
                                                target: {
                                                  type: "select",
                                                  name: "author_id",
                                                  value: null,
                                                },
                                              });
                                            }
                                          }}
                                          type="checkbox"
                                          id="check_member"
                                          label="Khách hàng"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                  </Col>
                                  <Col sm={8} style={{ zIndex: "10" }}>
                                    <Field
                                      name="member_id"
                                      render={({ field /* _form */ }) => {
                                        let defaultValue = OptsAccount.find(
                                          ({ value }) =>
                                            1 * value === 1 * field.value
                                        );
                                        defaultValue = defaultValue
                                          ? defaultValue
                                          : {
                                              value: null,
                                              label: "-- Chọn --",
                                            };
                                        return (
                                          <Select
                                            id="member_id"
                                            name="member_id"
                                            placeholder="-- Chọn --"
                                            value={defaultValue}
                                            isDisabled={
                                              noEdit || !values.check_member
                                            }
                                            isSearchable={true}
                                            options={OptsAccount}
                                            onChange={(item) => {
                                              let event = {
                                                target: {
                                                  type: "select",
                                                  name: "member_id",
                                                  value: item.value,
                                                },
                                              };
                                              field.onChange(event);
                                            }}
                                          />
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="member_id"
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
                              <Col xs={6}>
                                <FormGroup row>
                                  <Col sm={4}>
                                    <Field
                                      name="check_author"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.check_author}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "check_member",
                                                value: !target.checked,
                                              },
                                            });
                                            field.onChange({
                                              target: {
                                                name: "check_author",
                                                value: target.checked,
                                              },
                                            });
                                            if (!target.checked) {
                                              field.onChange({
                                                target: {
                                                  type: "select",
                                                  name: "author_id",
                                                  value: null,
                                                },
                                              });
                                            } else {
                                              field.onChange({
                                                target: {
                                                  type: "select",
                                                  name: "member_id",
                                                  value: null,
                                                },
                                              });
                                            }
                                          }}
                                          type="checkbox"
                                          id="check_author"
                                          label="Chuyên gia"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                  </Col>
                                  <Col sm={8} style={{ zIndex: "10" }}>
                                    <Field
                                      name="author_id"
                                      render={({ field /* _form */ }) => {
                                        let defaultValue = OptsAuthor.find(
                                          ({ value }) =>
                                            1 * value === 1 * field.value
                                        );
                                        defaultValue = defaultValue
                                          ? defaultValue
                                          : {
                                              value: null,
                                              label: "-- Chọn --",
                                            };
                                        return (
                                          <Select
                                            id="author_id"
                                            placeholder="-- Chọn --"
                                            isDisabled={
                                              noEdit || !values.check_author
                                            }
                                            value={defaultValue}
                                            isClearable={!values.check_author}
                                            options={OptsAuthor}
                                            isSearchable={true}
                                            onChange={(item) => {
                                              let event = {
                                                target: {
                                                  type: "select",
                                                  name: "author_id",
                                                  value: item.value,
                                                },
                                              };
                                              field.onChange(event);
                                            }}
                                          />
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="author_id"
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
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label
                                    for="order_index"
                                    className="text-left"
                                    sm={4}
                                  >
                                    Thứ tự hiển thị
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="order_index"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          className="text-left"
                                          onBlur={null}
                                          type="number"
                                          id="order_index"
                                          disabled={noEdit}
                                          min="1"
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="ower_phone_1"
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
                              <Col xs={6} >
                                <FormGroup row>
                                  <Label
                                    for="ower_phone_2"
                                    className="text-left"
                                    sm={4}
                                  >
                                    Ngày đánh giá
                                  </Label>
                                  <Col sm={8} style={{ padding: 0 }}>
                                    <DateTimePicker
                                      style={{ padding: 0 }}
                                      name="review_date"
                                      // labelsm={3}
                                      inputsm={12}
                                      isRequired={false}
                                      isEdit={!noEdit}
                                      isDisabledTime={false}
                                      isDisabledDate={false}
                                      dayFirst={true}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={6} >
                                <FormGroup row>
                                  <Label for="is_active" sm={4}></Label>
                                  <Col sm={8}>
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
                                          label="Kích hoạt?"
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
                              <Col sm={12}>
                                <Label
                                  for="review_content"
                                  sm={12}
                                  className="pl-0 pr-0"
                                >
                                  Nội dung{" "}
                                  <span className="font-weight-bold red-text">
                                    {" "}
                                    *{" "}
                                  </span>
                                </Label>
                                <Col sm={4} className="pl-0">
                                  <ErrorMessage
                                    name="review_content"
                                    component={({ children }) => (
                                      <Alert
                                        color="danger"
                                        className="field-validation-error"
                                      >
                                        {" "}
                                        {children}{" "}
                                      </Alert>
                                    )}
                                  />
                                </Col>
                                <Col sm={12} xs={12} className="pl-0 pr-0">
                                  <Editor
                                    apiKey={
                                      "3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"
                                    }
                                    scriptLoading={{
                                      delay: 500,
                                    }}
                                    value={values.review_content}
                                    disabled={noEdit}
                                    init={{
                                      height: "300px",
                                      width: "100%",
                                      menubar: false,
                                      branding: false,
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
                                        "undo redo | fullscreen | formatselect | bold italic backcolor | \n" +
                                        "alignleft aligncenter alignright alignjustify",
                                      toolbar2:
                                        "bullist numlist outdent indent | removeformat | help | image | toc",
                                      file_picker_types: "image",
                                      images_dataimg_filter: function (img) {
                                        return img.hasAttribute(
                                          "internal-blob"
                                        );
                                      },
                                      images_upload_handler:
                                        this.handleUploadImage,
                                    }}
                                    onEditorChange={(newValue) => {
                                      formikProps.setFieldValue(
                                        "review_content",
                                        newValue
                                      );
                                    }}
                                  />
                                </Col>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12} className="text-right mt-3">
                                {noEdit ? (
                                  <CheckAccess permission="CRM_REVIEW_EDIT">
                                    <Button
                                      color="primary"
                                      className="mr-2 btn-block-sm"
                                      onClick={() =>
                                        window._$g.rdr(
                                          `/review/edit/${crmReviewEnt.review_id}`
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
                                  onClick={() => window._$g.rdr("/review")}
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
