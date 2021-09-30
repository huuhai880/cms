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

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import Loading from "../Common/Loading";

// Model(s)
import ParamNameModel from "../../models/ParamNameModel";

/**
 * @class ParamNameAdd
 */
export default class ParamNameAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._paramNameModel = new ParamNameModel();

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
    let { paramNameEnt } = this.props;
    let values = Object.assign(
      {},
      this._paramNameModel.fillable(),
      paramNameEnt
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


  async _getBundleData() {
    let bundle = {};
    let all = [];

    await Promise.all(all).catch((err) =>
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`)
      )
    );
    
    Object.keys(bundle).forEach((key) => {
      let data = bundle[key];
      let stateValue = this.state[key];
      if (data instanceof Array && stateValue instanceof Array) {
        data = [stateValue[0]].concat(data);
      }
      bundle[key] = data;
    });

    return bundle;
  }

  formikValidationSchema = Yup.object().shape({
    name_type: Yup.string().trim().required("Tên loại biến số là bắt buộc."),
  });

  handleFormikBeforeRender = ({ initialValues }) => {
    let { values } = this.formikProps;
    if (values === initialValues) {
      return;
    }

    Object.assign(values, {});
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
    let { paramNameEnt } = this.props;
    // Build form data
    // +++

    let {
      is_active,
      is_full_name,
      is_last_name,
      is_first_middle_name,
      is_first_name,
      name_type,
      is_middle_name
    } = values;

    // +++
    let formData = Object.assign({}, values, {
      is_full_name: is_full_name ? 1 : 0,
      is_last_name: is_last_name ? 1 : 0,
      is_first_name: is_first_name ? 1 : 0,
      is_first_middle_name: is_first_middle_name ? 1 : 0,
      is_active: is_active ? 1 : 0,
      name_type: name_type? name_type.trim(): "",
      is_middle_name:  is_middle_name ? 1 : 0
    });
    //
    const calculationId =
      (paramNameEnt && paramNameEnt.param_name_id) ||
      formData[this._paramNameModel];
    let apiCall = calculationId
      ? this._paramNameModel.update(calculationId, formData)
      : this._paramNameModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/param-name");
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
        if (!paramNameEnt && !willRedirect && !alerts.length) {
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

    let { alerts } = this.state;
    let checkName = [
      "is_last_name",
      "is_first_name",
      "is_full_name",
      "is_first_middle_name",
      "is_middle_name"
    ];
    /** @var {Object} */
    let initialValues = this.getInitialValues();
    const { noEdit, paramNameEnt } = this.props;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {paramNameEnt && paramNameEnt.param_name_id
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  biến số tên {paramNameEnt ? paramNameEnt.calculation : ""}
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
                            <b className="underline">Thông tin biến số tên</b>
                          </Col>
                        </Row>
                        <Row className="pt-3">
                          <Col xs={12}>
                            <Row>
                              <Col xs={12}>
                                <FormGroup row>
                                  <Label
                                    for="name_type"
                                    className="text-left"
                                    sm={3}
                                  >
                                    Tên loại
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={9}>
                                    <Field
                                      name="name_type"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          className="text-left"
                                          onBlur={null}
                                          type="text"
                                          id="name_type"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="name_type"
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
                              <Col sm={12}>
                                <FormGroup row>
                                  <Label for="is_first_name" sm={3}></Label>
                                  <Col sm={3}>
                                    <Field
                                      name="is_first_name"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          name="is_first_name"
                                          onBlur={null}
                                          checked={values.is_first_name}
                                          onChange={(event) => {
                                            const { target } = event;
                                            checkName.forEach((item) => {
                                              if (
                                                values[item] &&
                                                item !== target.name
                                              ) {
                                                field.onChange({
                                                  target: {
                                                    name: item,
                                                    value: false,
                                                  },
                                                });
                                              }
                                            });
                                            field.onChange({
                                              target: {
                                                name: target.name,
                                                value: true,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_first_name"
                                          label="Tên"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_first_name"
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
                                      name="is_middle_name"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          name="is_middle_name"
                                          onBlur={null}
                                          checked={values.is_middle_name}
                                          onChange={(event) => {
                                            const { target } = event;
                                            checkName.forEach((item) => {
                                              if (
                                                values[item] &&
                                                item !== target.name
                                              ) {
                                                field.onChange({
                                                  target: {
                                                    name: item,
                                                    value: false,
                                                  },
                                                });
                                              }
                                            });
                                            field.onChange({
                                              target: {
                                                name: target.name,
                                                value: true,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_middle_name"
                                          label="Tên đệm"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_first_name"
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
                                      name="is_full_name"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          name="is_full_name"
                                          onBlur={null}
                                          checked={values.is_full_name}
                                          onChange={(event) => {
                                            const { target } = event;
                                            checkName.forEach((item) => {
                                              if (
                                                values[item] &&
                                                item !== target.name
                                              ) {
                                                field.onChange({
                                                  target: {
                                                    name: item,
                                                    value: false,
                                                  },
                                                });
                                              }
                                            });
                                            field.onChange({
                                              target: {
                                                name: target.name,
                                                value: true,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_full_name"
                                          label="Họ tên đầy đủ"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_full_name"
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
                              <Col sm={12}>
                                <FormGroup row>
                                  <Label for="is_last_name" sm={3}></Label>
                                  <Col sm={3}>
                                    <Field
                                      name="is_last_name"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          name="is_last_name"
                                          onBlur={null}
                                          checked={values.is_last_name}
                                          onChange={(event) => {
                                            const { target } = event;
                                            checkName.forEach((item) => {
                                              if (
                                                values[item] &&
                                                item !== target.name
                                              ) {
                                                field.onChange({
                                                  target: {
                                                    name: item,
                                                    value: false,
                                                  },
                                                });
                                              }
                                            });
                                            field.onChange({
                                              target: {
                                                name: target.name,
                                                value: true,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_last_name"
                                          label="Họ"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_last_name"
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
                                      name="is_first_middle_name"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          name="is_first_middle_name"
                                          onBlur={null}
                                          checked={values.is_first_middle_name}
                                          onChange={(event) => {
                                            const { target } = event;
                                            checkName.forEach((item) => {
                                              if (
                                                values[item] &&
                                                item !== target.name
                                              ) {
                                                field.onChange({
                                                  target: {
                                                    name: item,
                                                    value: false,
                                                  },
                                                });
                                              }
                                            });
                                            field.onChange({
                                              target: {
                                                name: target.name,
                                                value: true,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_first_middle_name"
                                          label="Họ và tên đệm"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_first_middle_name"
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
                              <Col sm={12}>
                                <FormGroup row>
                                  <Label
                                    for="is_first_middle_name"
                                    sm={3}
                                  ></Label>
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
                            </Row>
                            <Row>
                              <Col sm={12} className="text-right mt-3">
                                {noEdit ? (
                                  <CheckAccess permission="MD_PARAMNAME_EDIT">
                                    <Button
                                      color="primary"
                                      className="mr-2 btn-block-sm"
                                      onClick={() =>
                                        window._$g.rdr(
                                          `/param-name/edit/${paramNameEnt.param_name_id}`
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
                                  onClick={() => window._$g.rdr("/param-name")}
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
