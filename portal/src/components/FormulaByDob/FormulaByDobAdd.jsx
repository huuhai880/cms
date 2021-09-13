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
import FormulaByDobModel from "../../models/FormulaByDobModel";

/**
 * @class FormulaByDobAdd
 */
export default class FormulaByDobAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._formulaByDobModel = new FormulaByDobModel();

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
    let { FormulaByDobEnt } = this.props;
    let values = Object.assign(
      {},
      this._formulaByDobModel.fillable(),
      FormulaByDobEnt
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
      this._formulaByDobModel
        .getOptionParamdob({ is_active: 1 })
        .then((data) => (bundle["OptParamdob"] = mapDataOptions4Select(data))),
      this._formulaByDobModel
        .getOptionAttributes({ is_active: 1 })
        .then(
          (data) => (bundle["OptAttributes"] = mapDataOptions4Select(data))
        ),
      this._formulaByDobModel
        .getOptionFormulaDob({ is_active: 1 })
        .then(
          (data) => (bundle["OptFormuladob"] = mapDataOptions4Select(data))
        ),
      this._formulaByDobModel
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
    //
    return bundle;
  }

  formikValidationSchema = Yup.object()
    .shape({
      formula_name: Yup.string().trim().required("Tên công thức là bắt buộc."),
      attribute_id: Yup.object().required("Tên thuộc tính là bắt buộc."),
      param_id: Yup.object().required("Biến số theo ngày sinh là bắt buộc."),
      index_1: Yup.string().required("Vị trí số là bắt buộc."),
      index_2: Yup.string().required("Vị trí số là bắt buộc."),
      age_milestones: Yup.string().required("Tuổi là bắt buộc."),
      year_milestones: Yup.string().required("Năm là bắt buộc."),
      values: Yup.string().required("Giá trị là bắt buộc."),
      calculation_id: Yup.object().required("Phép tính là bắt buộc."),
    })
    .test("", "", function (item) {
      let { is_total_shortened, last_2_digits } = item;
      if (is_total_shortened || last_2_digits) {
        return true;
      }
      return new Yup.ValidationError(
        "Chọn một dạng là bắt buộc.",
        null,
        "check_short"
      );
    })
    .test("", "", function (item) {
      let { parent_formula_id, parent_calculation_id } = item;
      if (parent_formula_id && !parent_calculation_id) {
        return new Yup.ValidationError(
          "Chọn phép tính cha là bắt buộc.",
          null,
          "parent_calculation_id"
        );
      }
      if (parent_calculation_id && !parent_formula_id) {
        return new Yup.ValidationError(
          "Chọn công thức cha là bắt buộc.",
          null,
          "parent_formula_id"
        );
      }
    })
    .test("", "", function (item) {
      let { key_milestones, second_milestones, challenging_milestones } = item;
      if (key_milestones || second_milestones || challenging_milestones) {
        return true;
      }
      return new Yup.ValidationError(
        "Chọn một mốc phát triển là bắt buộc.",
        null,
        "check_milestones"
      );
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
    let { FormulaByDobEnt } = this.props;
    // Build form data
    // +++

    let {
      is_active,
      is_total_shortened,
      last_2_digits,
      key_milestones,
      second_milestones,
      challenging_milestones,
      attribute_id,
      param_id,
      parent_formula_id,
      parent_calculation_id,
      calculation_id,
      formula_name,
    } = values;

    // +++
    let formData = Object.assign({}, values, {
      is_total_shortened: is_total_shortened ? 1 : 0,
      last_2_digits: last_2_digits ? 1 : 0,
      key_milestones: key_milestones ? 1 : 0,
      second_milestones: second_milestones ? 1 : 0,
      challenging_milestones: challenging_milestones ? 1 : 0,
      is_active: is_active ? 1 : 0,
      attribute_id: attribute_id ? attribute_id.value : "",
      param_id: param_id ? param_id.value : "",
      parent_formula_id: parent_formula_id ? parent_formula_id.value : "",
      parent_calculation_id: parent_calculation_id
        ? parent_calculation_id.value
        : "",
      calculation_id: calculation_id ? calculation_id.value : "",
      formula_name: formula_name? formula_name.trim(): "",
    });
    //
    const formuladobId =
      (FormulaByDobEnt && FormulaByDobEnt.formula_id) ||
      formData[this._formulaByDobModel];
    let apiCall = formuladobId
      ? this._formulaByDobModel.update(formuladobId, formData)
      : this._formulaByDobModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/formula-by-dob");
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
        if (!FormulaByDobEnt && !willRedirect && !alerts.length) {
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

    let { alerts, OptAttributes, OptCalculation, OptFormuladob, OptParamdob } =
      this.state;

    /** @var {Object} */
    let initialValues = this.getInitialValues();
    const { noEdit, FormulaByDobEnt } = this.props;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {FormulaByDobEnt && FormulaByDobEnt.formula_id
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  công thức{" "}
                  {FormulaByDobEnt ? FormulaByDobEnt.formula_name : ""}
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
                                          onChange={(value) => {
                                            field.onChange({
                                              target: {
                                                name: "attribute_id",
                                                value,
                                              },
                                            });
                                          }}
                                          id="attribute_id"
                                          isDisabled={noEdit}
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
                                  <Label className="text-left" sm={2}>
                                    Theo
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={6}>
                                    <Field
                                      name="param_id"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          value={values.param_id}
                                          onChange={(item) => {
                                            field.onChange({
                                              target: {
                                                name: "param_id",
                                                value: item,
                                              },
                                            });
                                          }}
                                          placeholder="-- Chọn biến số theo ngày sinh --"
                                          options={OptParamdob}
                                          id="param_id"
                                          isDisabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="param_id"
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
                                            if (target.checked) {
                                              field.onChange({
                                                target: {
                                                  name: "last_2_digits",
                                                  value: false,
                                                },
                                              });
                                            }
                                            field.onChange({
                                              target: {
                                                name: "is_total_shortened",
                                                value: true,
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
                                            if (target.checked) {
                                              field.onChange({
                                                target: {
                                                  name: "is_total_shortened",
                                                  value: false,
                                                },
                                              });
                                            }
                                            field.onChange({
                                              target: {
                                                name: "last_2_digits",
                                                value: true,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="last_2_digits"
                                          label="Lấy 2 số cuối cùng"
                                          disabled={noEdit}
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
                                <FormGroup row>
                                  <Label sm={2}></Label>
                                  <Col sm={6}>
                                    <ErrorMessage
                                      name="check_short"
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
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={3}>
                                    <Field
                                      name="parent_formula_id"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          isClearable
                                          onBlur={null}
                                          value={values.parent_formula_id}
                                          onChange={(item) => {
                                            field.onChange({
                                              target: {
                                                name: "parent_formula_id",
                                                value: item,
                                              },
                                            });
                                          }}
                                          placeholder="-- Chọn công thức cha --"
                                          options={OptFormuladob}
                                          id="parent_formula_id"
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
                                          isClearable
                                          onBlur={null}
                                          onChange={(item) => {
                                            field.onChange({
                                              target: {
                                                name: "parent_calculation_id",
                                                value: item,
                                              },
                                            });
                                          }}
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
                                  <Label className="text-left" sm={2}></Label>
                                  <Label
                                    for="index_1"
                                    className="text-left pr-0"
                                    sm={1}
                                  >
                                    Vị trí số
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={1} className="pl-0">
                                    <Field
                                      name="index_1"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          onChange={(event) => {
                                            const { target } = event;
                                            let rg = new RegExp(/[^0-9]/);
                                            let value = target.value.replace(rg, "");
                                            value =  value && value.length > 1 ? value.split("")[1]: value
                                            field.onChange({
                                              target: {
                                                name: "index_1",
                                                value,
                                              },
                                            });
                                          }}
                                          maxLength={2}
                                          value={values.index_1}
                                          type="text"
                                          id="index_1"
                                          disabled={noEdit}
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
                                          value={values.calculation_id}
                                          onChange={(item) => {
                                            field.onChange({
                                              target: {
                                                name: "calculation_id",
                                                value: item,
                                              },
                                            });
                                          }}
                                          options={OptCalculation}
                                          placeholder=" -- Chọn --"
                                          id="calculation_id"
                                          isDisabled={noEdit}
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
                                  <Label className="text-left" sm={1}>
                                    Vị trí số
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={1} className="pl-0">
                                    <Field
                                      name="index_2"
                                      className="pl-0"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          onChange={(event) => {
                                            const { target } = event;
                                            let rg = new RegExp(/[^0-9]/);
                                            let value = target.value.replace(rg, "");
                                            value =  value && value.length > 1 ? value.split("")[1]: value
                                            field.onChange({
                                              target: {
                                                name: "index_2",
                                                value,
                                              },
                                            });
                                          }}
                                          value={values.index_2}
                                          type="text"
                                          id="index_2"
                                          disabled={noEdit}
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
                                            if (target.checked) {
                                              field.onChange({
                                                target: {
                                                  name: "second_milestones",
                                                  value: false,
                                                },
                                              });
                                              field.onChange({
                                                target: {
                                                  name: "second_milestones",
                                                  value: false,
                                                },
                                              });
                                            }
                                            field.onChange({
                                              target: {
                                                name: "key_milestones",
                                                value: true,
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
                                            if (target.checked) {
                                              field.onChange({
                                                target: {
                                                  name: "key_milestones",
                                                  value: false,
                                                },
                                              });
                                              field.onChange({
                                                target: {
                                                  name: "challenging_milestones",
                                                  value: false,
                                                },
                                              });
                                            }
                                            field.onChange({
                                              target: {
                                                name: "second_milestones",
                                                value: true,
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
                                            if (target.checked) {
                                              field.onChange({
                                                target: {
                                                  name: "key_milestones",
                                                  value: false,
                                                },
                                              });
                                              field.onChange({
                                                target: {
                                                  name: "second_milestones",
                                                  value: false,
                                                },
                                              });
                                            }
                                            field.onChange({
                                              target: {
                                                name: "challenging_milestones",
                                                value: true,
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
                                <FormGroup row>
                                  <Label sm={2}></Label>
                                  <Col sm={6}>
                                    <ErrorMessage
                                      name="check_milestones"
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
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={2}>
                                    <Field
                                      name="age_milestones"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          value={values.age_milestones}
                                          options={OptCalculation}
                                          type="text"
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
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={2}>
                                    <Field
                                      name="year_milestones"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          value={values.year_milestones}
                                          options={OptCalculation}
                                          type="text"
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
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={2}>
                                    <Field
                                      name="values"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          value={values.values}
                                          options={OptCalculation}
                                          type="text"
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
                                  <CheckAccess permission="FOR_FORMULABYDOB_EDIT">
                                    <Button
                                      color="primary"
                                      className="mr-2 btn-block-sm"
                                      onClick={() =>
                                        window._$g.rdr(
                                          `/param-name/edit/${FormulaByDobEnt.param_name_id}`
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
                                    window._$g.rdr("/formula-by-dob")
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
