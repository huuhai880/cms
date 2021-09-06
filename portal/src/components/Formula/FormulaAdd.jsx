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
import Select from "react-select";
import { mapDataOptions4Select } from "../../utils/html";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import Loading from "../Common/Loading";

// Model(s)
import ParamNameModel from "../../models/ParamNameModel";
import FormulaModel from "../../models/FormulaModel";

/**
 * @class FormulaAdd
 */
export default class FormulaAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._paramNameModel = new ParamNameModel();
    this._formulaModel = new FormulaModel();

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
    let { FormulaEnt } = this.props;
    let values = Object.assign({}, this._formulaModel.fillable(), FormulaEnt);

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
      this._formulaModel
        .getOptionAttributes({ is_active: 1 })
        .then(
          (data) => (bundle["OptAttributes"] = mapDataOptions4Select(data))
        ),
      this._formulaModel
        .getOptionFormula({ is_active: 1 })
        .then((data) => (bundle["OptFormula"] = mapDataOptions4Select(data))),
      this._formulaModel
        .getOptionMainCalculaion({ is_active: 1 })
        .then(
          (data) => (bundle["OptCalculation"] = mapDataOptions4Select(data))
        ),
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
    formula_name: Yup.string().trim().required("Tên công thức là bắt buộc."),
    attribute_id: Yup.object().required("Tên thuộc tính là bắt buộc."),
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
    let { FormulaEnt } = this.props;
    // Build form data
    // +++

    let {
      is_active,
      is_full_name,
      is_last_name,
      is_first_middle_name,
      is_first_name,
    } = values;

    // +++
    let formData = Object.assign({}, values, {
      is_full_name: is_full_name ? 1 : 0,
      is_last_name: is_last_name ? 1 : 0,
      is_first_name: is_first_name ? 1 : 0,
      is_first_middle_name: is_first_middle_name ? 1 : 0,
      is_active: is_active ? 1 : 0,
    });
    //
    const calculationId =
      (FormulaEnt && FormulaEnt.param_name_id) ||
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
        if (!FormulaEnt && !willRedirect && !alerts.length) {
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

    let { alerts, OptAttributes, OptCalculation, OptFormula } = this.state;

    /** @var {Object} */
    let initialValues = this.getInitialValues();
    const { noEdit, FormulaEnt } = this.props;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {FormulaEnt && FormulaEnt.param_name_id
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  công thức theo ngày sinh{" "}
                  {FormulaEnt ? FormulaEnt.calculation : ""}
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
                        <Row className="pt-3">
                          <Col xs={12}>
                            <Row>
                              <Col xs={12}>
                                <FormGroup row>
                                  <Label
                                    for="formula_name"
                                    className="text-left"
                                    sm={2}
                                  >
                                    Tên Công thức
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={4}>
                                    <Field
                                      name="formula_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          className="text-left"
                                          onBlur={null}
                                          type="text"
                                          id="formula_name"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="formula_name"
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
                                  <Label
                                    for="name_type"
                                    className="text-left"
                                    style={{ maxWidth: "150px" }}
                                    sm={2}
                                  >
                                    Tên thuộc tính
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={4}>
                                    <Field
                                      name="attribute_id"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          className="text-left"
                                          onBlur={null}
                                          id="attribute_id"
                                          disabled={noEdit}
                                          placeholder="-- Chọn --"
                                          options={OptAttributes}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="attribute_id"
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
                                    for="description"
                                    className="text-left"
                                    sm={2}
                                  >
                                    Mô tả
                                  </Label>
                                  <Col sm={10}>
                                    <Field
                                      name="description"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          style={{ height: "100px" }}
                                          className="text-left"
                                          onBlur={null}
                                          type="textarea"
                                          value={values.description}
                                          id="description"
                                          disabled={noEdit}
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
                              <Col sm={12}>
                                <FormGroup row>
                                  <Label
                                    for="is_day"
                                    className="text-left"
                                    sm={2}
                                  >
                                    Theo
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="is_day"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.is_day}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "is_first_name",
                                                value: target.checked,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_day"
                                          label="Ngày sinh"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_day"
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
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="is_month"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.is_month}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "is_month",
                                                value: target.checked,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_month"
                                          label="Tháng sinh"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_month"
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
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="is_year"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.is_year}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "is_year",
                                                value: target.checked,
                                              },
                                            });
                                            if (!target.checked) {
                                              field.onChange({
                                                target: {
                                                  name: "last_2_digits",
                                                  value: "",
                                                },
                                              });
                                            }
                                          }}
                                          type="checkbox"
                                          id="is_year"
                                          label="Năm sinh"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_year"
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
                                    for="is_total_shortened"
                                    className="text-left d-flex align-items-center"
                                    sm={2}
                                  >
                                    Dạng
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="is_total_shortened"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          onBlur={null}
                                          checked={values.is_total_shortened}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "is_total_shortened",
                                                value: target.checked,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_total_shortened"
                                          label="Tổng rút gọn"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_total_shortened"
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
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="last_2_digits"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          onBlur={null}
                                          checked={values.last_2_digits}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "last_2_digits",
                                                value: target.checked,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="last_2_digits"
                                          label="Lấy 2 số cuối cùng"
                                          disabled={noEdit || !values.is_year}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="last_2_digits"
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
                                  <Label for="parent_formula_id" sm={2}>
                                    Công thức
                                  </Label>
                                  <Col sm={3}>
                                    <Field
                                      name="parent_formula_id"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          value={values.parent_formula_id}
                                          placeholder="-- Chọn công thức cha --"
                                          options={OptFormula}
                                          id="parent_formula_id"
                                          label="Kích hoạt"
                                          isDisabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="parent_formula_id"
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
                                      name="parent_calculation_id"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          value={values.parent_calculation_id}
                                          placeholder="-- Chọn phép tính --"
                                          options={OptCalculation}
                                          id="parent_calculation_id"
                                          isDisabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="parent_calculation_id"
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
                                    for="name_type"
                                    className="text-left"
                                    sm={2}
                                  ></Label>
                                  <Label
                                    for="name_type"
                                    className="text-left pr-0"
                                    sm={1}
                                  >
                                    Vị trí số
                                  </Label>
                                  <Col sm={1} className="pl-0">
                                    <Field
                                      name="index_1"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          checked={values.index_1}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "index_1",
                                                value: target.checked,
                                              },
                                            });
                                          }}
                                          id="index_1"
                                          disabled={noEdit || !values.parent_calculation_id.value}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="index_1"
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
                                  <Col sm={2}>
                                    <Field
                                      name="calculation_id"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          checked={values.calculation_id}
                                          value={values.calculation_id}
                                          options={OptCalculation}
                                          placeholder=" -- Chọn --"
                                          id="calculation_id"
                                          isDisabled={noEdit || !values.parent_calculation_id.value}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="calculation_id"
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
                                  <Label
                                    for="name_type"
                                    className="text-left"
                                    sm={1}
                                  >
                                    Vị trí số
                                  </Label>
                                  <Col sm={1}>
                                    <Field
                                      name="is_first_middle_name"
                                      className="pl-0"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "index_2",
                                                value: target.checked,
                                              },
                                            });
                                          }}
                                          id="index_2"
                                          disabled={noEdit || !values.parent_calculation_id.value}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="index_2"
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
                                    for="name_type"
                                    className="text-left"
                                    sm={2}
                                  >
                                    Mốc phát triển
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="key_milestones"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.key_milestones}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "key_milestones",
                                                value: target.checked,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="key_milestones"
                                          label="Mốc phát triển chính"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="key_milestones"
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
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="second_milestones"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.second_milestones}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "second_milestones",
                                                value: target.checked,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="second_milestones"
                                          label="Mốc phát triển phụ"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="second_milestones"
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
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="challenging_milestones"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={
                                            values.challenging_milestones
                                          }
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "challenging_milestones",
                                                value: target.checked,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="challenging_milestones"
                                          label="Mốc thử thách"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="challenging_milestones"
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
                                  <Label className="text-left" sm={2}></Label>
                                  <Label className="text-left pr-0" sm={1}>
                                    Tuổi
                                  </Label>
                                  <Col sm={2}>
                                    <Field
                                      name="age_milestones"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          value={values.age_milestones}
                                          options={OptCalculation}
                                          placeholder=" -- Chọn --"
                                          id="age_milestones"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="age_milestones"
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
                                  <Label
                                    for="name_type"
                                    className="text-left"
                                    sm={1}
                                  >
                                    Năm
                                  </Label>
                                  <Col sm={2}>
                                    <Field
                                      name="year_milestones"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          value={values.year_milestones}
                                          options={OptCalculation}
                                          placeholder=" -- Chọn --"
                                          id="year_milestones"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="year_milestones"
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
                                    for="name_type"
                                    className="text-left"
                                    sm={2}
                                  ></Label>
                                  <Label
                                    for="name_type"
                                    className="text-left pr-0"
                                    sm={1}
                                  >
                                    Giá trị
                                  </Label>
                                  <Col sm={2}>
                                    <Field
                                      name="values"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          value={values.values}
                                          options={OptCalculation}
                                          placeholder=" -- Chọn --"
                                          id="values"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="values"
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
                                    sm={2}
                                  ></Label>
                                  <Col sm={2}>
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
                                  <CheckAccess permission="FOR_FORMULA_EDIT">
                                    <Button
                                      color="primary"
                                      className="mr-2 btn-block-sm"
                                      onClick={() =>
                                        window._$g.rdr(
                                          `/param-name/edit/${FormulaEnt.param_name_id}`
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
                                  onClick={() => window._$g.rdr("/formula")}
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
