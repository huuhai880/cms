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
import FormulaByNameModel from "../../models/FormulaByNameModel";

/**
 * @class FormulaByNameAdd
 */
export default class FormulaByNameAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._formulaByNameModel = new FormulaByNameModel();

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
    let { FormulaByNameEnt } = this.props;
    let values = Object.assign(
      {},
      this._formulaByNameModel.fillable(),
      FormulaByNameEnt
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
      this._formulaByNameModel
        .getOptionAttributes({ is_active: 1 })
        .then(
          (data) => (bundle["OptAttributes"] = mapDataOptions4Select(data))
        ),
      this._formulaByNameModel
        .getOptionParamName({ is_active: 1 })
        .then((data) => (bundle["OptParamName"] = mapDataOptions4Select(data))),
      this._formulaByNameModel
        .getOptionFormulaByName({ is_active: 1 })
        .then((data) => (bundle["OptFormula"] = mapDataOptions4Select(data))),
      this._formulaByNameModel
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
      attribute_id: Yup.object()
        .nullable()
        .required("Tên thuộc tính là bắt buộc."),
      param_name_id: Yup.object().required("Tên biến số là bắt buộc."),
      calculation_id: Yup.object().when("is_expression", {
        is: true,
        then: Yup.object().nullable().required("Phép tính là bắt buộc."),
        otherwise: Yup.object().nullable().notRequired(true),
      }),
      parent_formula_id: Yup.object().when("is_expression", {
        is: true,
        then: Yup.object().nullable().required("Công thức cha là bắt buộc."),
        otherwise: Yup.object().nullable().notRequired(true),
      }),
    })
    .test("", "", function (item) {
      let {
        is_not_shortened,
        is_2_digit,
        is_1_digit,
        is_first_letter,
        is_last_letter,
        is_only_first_vowel,
      } = item;
      if (
        is_not_shortened ||
        is_2_digit ||
        is_1_digit ||
        is_first_letter ||
        is_last_letter ||
        is_only_first_vowel
      ) {
        return true;
      }
      return new Yup.ValidationError(
        "Chọn một hình thức là bắt buộc.",
        null,
        "check_format"
      );
    })
    .test("", "", function (item) {
      let {
        is_total_vowels,
        is_total_values,
        is_count_of_num,
        is_total_consonant,
        is_total_letters,
        is_num_show_3_time,
        is_total_first_letters,
        is_num_of_letters,
        is_num_show_0_time,
      } = item;
      if (
        is_total_vowels ||
        is_total_values ||
        is_count_of_num ||
        is_total_consonant ||
        is_total_letters ||
        is_num_show_3_time ||
        is_total_first_letters ||
        is_num_of_letters ||
        is_num_show_0_time
      ) {
        return true;
      }
      return new Yup.ValidationError(
        "Chọn một cách tính là bắt buộc.",
        null,
        "check_calculation"
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
    let { FormulaByNameEnt } = this.props;
    // Build form data
    // +++

    let {
      is_active,
      is_not_shortened,
      is_2_digit,
      is_1_digit,
      is_first_letter,
      is_last_letter,
      is_only_first_vowel,
      is_total_vowels,
      is_total_values,
      is_count_of_num,
      is_total_consonant,
      is_total_letters,
      is_num_show_3_time,
      is_total_first_letters,
      is_num_of_letters,
      is_num_show_0_time,
      attribute_id,
      param_name_id,
      is_expression,
      calculation_id,
      parent_formula_id,
    } = values;

    // +++
    let formData = Object.assign({}, values, {
      is_not_shortened: is_not_shortened ? 1 : 0,
      is_2_digit: is_2_digit ? 1 : 0,
      is_1_digit: is_1_digit ? 1 : 0,
      is_first_letter: is_first_letter ? 1 : 0,
      is_last_letter: is_last_letter ? 1 : 0,
      is_only_first_vowel: is_only_first_vowel ? 1 : 0,
      is_total_vowels: is_total_vowels ? 1 : 0,
      is_total_values: is_total_values ? 1 : 0,
      is_count_of_num: is_count_of_num ? 1 : 0,
      is_total_consonant: is_total_consonant ? 1 : 0,
      is_total_letters: is_total_letters ? 1 : 0,
      is_num_show_3_time: is_num_show_3_time ? 1 : 0,
      is_total_first_letters: is_total_first_letters ? 1 : 0,
      is_num_of_letters: is_num_of_letters ? 1 : 0,
      is_num_show_0_time: is_num_show_0_time ? 1 : 0,
      is_active: is_active ? 1 : 0,
      attribute_id: attribute_id ? attribute_id.value : "",
      param_name_id: param_name_id ? param_name_id.value : "",
      is_expression: is_expression ? 1 : 0,
      calculation_id: calculation_id ? calculation_id.value : "",
      parent_formula_id: parent_formula_id ? parent_formula_id.value : "",
    });

    //
    const formulaByNameId =
      (FormulaByNameEnt && FormulaByNameEnt.formula_id) ||
      formData[this._formulaByNameModel];
    let apiCall = formulaByNameId
      ? this._formulaByNameModel.update(formulaByNameId, formData)
      : this._formulaByNameModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/formula-by-name");
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
        if (!FormulaByNameEnt && !willRedirect && !alerts.length) {
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

    let { alerts, OptAttributes, OptCalculation, OptFormula, OptParamName } =
      this.state;

    let check_format = [
      "is_not_shortened",
      "is_2_digit",
      "is_1_digit",
      "is_first_letter",
      "is_last_letter",
      "is_only_first_vowel",
    ];

    let check_calculation = [
      "is_total_vowels",
      "is_total_values",
      "is_count_of_num",
      "is_total_consonant",
      "is_total_letters",
      "is_num_show_3_time",
      "is_total_first_letters",
      "is_num_of_letters",
      "is_num_show_0_time",
    ];
    /** @var {Object} */
    let initialValues = this.getInitialValues();
    const { noEdit, FormulaByNameEnt } = this.props;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {FormulaByNameEnt && FormulaByNameEnt.formula_id
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  công thức{" "}
                  {FormulaByNameEnt ? FormulaByNameEnt.formula_name : ""}
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
                      errors,
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
                                          name="attribute_id"
                                          id="attribute_id"
                                          onChange={(item) => {
                                            field.onChange({
                                              target: {
                                                name: "attribute_id",
                                                value: item,
                                              },
                                            });
                                          }}
                                          value={values.attribute_id}
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
                                          id="description"
                                          disabled={noEdit}
                                          value={values.description}
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
                                    for="name_type"
                                    className="text-left"
                                    sm={2}
                                  >
                                    Hình thức
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="is_not_shortened"
                                      render={({ field }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_not_shortened"
                                          checked={values.is_not_shortened}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_format.forEach((item) => {
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
                                          id="is_not_shortened"
                                          label="Không rút gọn"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_not_shortened"
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
                                      name="is_2_digit"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_2_digit"
                                          checked={values.is_2_digit}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_format.forEach((item) => {
                                              if (
                                                values[item] &&
                                                item !== target.name
                                              ) {
                                                this.formikProps.setFieldValue(
                                                  item,
                                                  ""
                                                );
                                              }
                                            });
                                            this.formikProps.setFieldValue(
                                              target.name,
                                              true
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_2_digit"
                                          label="2 chữ số"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_2_digit"
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
                                      name="is_1_digit"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_1_digit"
                                          checked={values.is_1_digit}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_format.forEach((item) => {
                                              if (
                                                values[item] &&
                                                item !== target.name
                                              ) {
                                                this.formikProps.setFieldValue(
                                                  item,
                                                  ""
                                                );
                                              }
                                            });
                                            this.formikProps.setFieldValue(
                                              target.name,
                                              true
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_1_digit"
                                          label="1 chữ số"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_1_digit"
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
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="is_first_letter"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_first_letter"
                                          checked={values.is_first_letter}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_format.forEach((item) => {
                                              if (
                                                values[item] &&
                                                item !== target.name
                                              ) {
                                                this.formikProps.setFieldValue(
                                                  item,
                                                  ""
                                                );
                                              }
                                            });
                                            this.formikProps.setFieldValue(
                                              target.name,
                                              true
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_first_letter"
                                          label="Ký tự đầu tiên"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_first_letter"
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
                                      name="is_last_letter"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_last_letter"
                                          checked={values.is_last_letter}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_format.forEach((item) => {
                                              if (
                                                values[item] &&
                                                item !== target.name
                                              ) {
                                                this.formikProps.setFieldValue(
                                                  item,
                                                  ""
                                                );
                                              }
                                            });
                                            this.formikProps.setFieldValue(
                                              target.name,
                                              true
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_last_letter"
                                          label="Ký tự cuối cùng"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_last_letter"
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
                                    sm={3}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="is_only_first_vowel"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_only_first_vowel"
                                          checked={values.is_only_first_vowel}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_format.forEach((item) => {
                                              if (
                                                values[item] &&
                                                item !== target.name
                                              ) {
                                                this.formikProps.setFieldValue(
                                                  item,
                                                  ""
                                                );
                                              }
                                            });
                                            this.formikProps.setFieldValue(
                                              target.name,
                                              true
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_only_first_vowel"
                                          label="Chỉ lấy nguyên âm đầu tiên"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_only_first_vowel"
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
                                <Col xs={12}>
                                  <FormGroup row>
                                    <Label className="text-left" sm={2}></Label>
                                    <Col sm={8} className="pl-0">
                                      <ErrorMessage
                                        name="check_format"
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
                                    Cách tính
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="is_total_vowels"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_total_vowels"
                                          checked={values.is_total_vowels}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_calculation.forEach(
                                              (item) => {
                                                if (
                                                  values[item] &&
                                                  item !== target.name
                                                ) {
                                                  this.formikProps.setFieldValue(
                                                    item,
                                                    ""
                                                  );
                                                }
                                                this.formikProps.setFieldValue(
                                                  target.name,
                                                  true
                                                );
                                              }
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_total_vowels"
                                          label="Tổng nguyên âm"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_total_vowels"
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
                                      name="is_total_values"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_total_values"
                                          checked={values.is_total_values}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_calculation.forEach(
                                              (item) => {
                                                if (
                                                  values[item] &&
                                                  item !== target.name
                                                ) {
                                                  this.formikProps.setFieldValue(
                                                    item,
                                                    ""
                                                  );
                                                }
                                                this.formikProps.setFieldValue(
                                                  target.name,
                                                  true
                                                );
                                              }
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_total_values"
                                          label="Tổng các giá trị"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_total_values"
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
                                      name="is_count_of_num"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_count_of_num"
                                          checked={values.is_count_of_num}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_calculation.forEach(
                                              (item) => {
                                                if (
                                                  values[item] &&
                                                  item !== target.name
                                                ) {
                                                  this.formikProps.setFieldValue(
                                                    item,
                                                    ""
                                                  );
                                                }
                                                this.formikProps.setFieldValue(
                                                  target.name,
                                                  true
                                                );
                                              }
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_count_of_num"
                                          label="Số lượng con số"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_count_of_num"
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
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="is_total_consonant"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_total_consonant"
                                          checked={values.is_total_consonant}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_calculation.forEach(
                                              (item) => {
                                                if (
                                                  values[item] &&
                                                  item !== target.name
                                                ) {
                                                  this.formikProps.setFieldValue(
                                                    item,
                                                    ""
                                                  );
                                                }
                                                this.formikProps.setFieldValue(
                                                  target.name,
                                                  true
                                                );
                                              }
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_total_consonant"
                                          label="Tổng phụ âm"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_total_consonant"
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
                                      name="is_total_letters"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_total_letters"
                                          checked={values.is_total_letters}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_calculation.forEach(
                                              (item) => {
                                                if (
                                                  values[item] &&
                                                  item !== target.name
                                                ) {
                                                  this.formikProps.setFieldValue(
                                                    item,
                                                    ""
                                                  );
                                                }
                                                this.formikProps.setFieldValue(
                                                  target.name,
                                                  true
                                                );
                                              }
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_total_letters"
                                          label="Tổng các chữ cái"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_total_letters"
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
                                      name="is_num_show_3_time"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_num_show_3_time"
                                          checked={values.is_num_show_3_time}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_calculation.forEach(
                                              (item) => {
                                                if (
                                                  values[item] &&
                                                  item !== target.name
                                                ) {
                                                  this.formikProps.setFieldValue(
                                                    item,
                                                    ""
                                                  );
                                                }
                                                this.formikProps.setFieldValue(
                                                  target.name,
                                                  true
                                                );
                                              }
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_num_show_3_time"
                                          label="Số xuất hiện >= 3 lần"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_num_show_3_time"
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
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="is_total_first_letters"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_total_first_letters"
                                          checked={
                                            values.is_total_first_letters
                                          }
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_calculation.forEach(
                                              (item) => {
                                                if (
                                                  values[item] &&
                                                  item !== target.name
                                                ) {
                                                  this.formikProps.setFieldValue(
                                                    item,
                                                    ""
                                                  );
                                                }
                                                this.formikProps.setFieldValue(
                                                  target.name,
                                                  true
                                                );
                                              }
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_total_first_letters"
                                          label="Tổng chữ cái đầu tiên"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_total_first_letters"
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
                                      name="is_num_of_letters"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.is_num_of_letters}
                                          name="is_num_of_letters"
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_calculation.forEach(
                                              (item) => {
                                                if (
                                                  values[item] &&
                                                  item !== target.name
                                                ) {
                                                  this.formikProps.setFieldValue(
                                                    item,
                                                    false
                                                  );
                                                }
                                                this.formikProps.setFieldValue(
                                                  target.name,
                                                  true
                                                );
                                              }
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_num_of_letters"
                                          label="Số lượng các chữ cái"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_num_of_letters"
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
                                      name="is_num_show_0_time"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          name="is_num_show_0_time"
                                          checked={values.is_num_show_0_time}
                                          onChange={(event) => {
                                            const { target } = event;
                                            check_calculation.forEach(
                                              (item) => {
                                                if (
                                                  values[item] &&
                                                  item !== target.name
                                                ) {
                                                  this.formikProps.setFieldValue(
                                                    item,
                                                    ""
                                                  );
                                                }
                                                this.formikProps.setFieldValue(
                                                  target.name,
                                                  true
                                                );
                                              }
                                            );
                                          }}
                                          type="checkbox"
                                          id="is_num_show_0_time"
                                          label="Số xuất hiện 0 lần"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_num_show_0_time"
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
                                <Col xs={12}>
                                  <FormGroup row>
                                    <Label className="text-left" sm={2}></Label>
                                    <Col sm={8} className="pl-0">
                                      <ErrorMessage
                                        name="check_calculation"
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
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12}>
                                <FormGroup row>
                                  <Label for="param_name_id" sm={2}>
                                    Biến số
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={4}>
                                    <Field
                                      name="param_name_id"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          value={values.param_name_id}
                                          placeholder="-- Chọn --"
                                          onChange={(item) => {
                                            field.onChange({
                                              target: {
                                                name: "param_name_id",
                                                value: item,
                                              },
                                            });
                                          }}
                                          options={OptParamName}
                                          id="param_name_id"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="param_name_id"
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
                                  <Col
                                    sm={2}
                                    className="d-flex align-items-center"
                                  >
                                    <Field
                                      name="is_expression"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.is_expression}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "is_expression",
                                                value: target.checked,
                                              },
                                            });
                                            if (!target.checked) {
                                              field.onChange({
                                                target: {
                                                  name: "calculation_id",
                                                  value: null,
                                                },
                                              });
                                              field.onChange({
                                                target: {
                                                  name: "parent_formula_id",
                                                  value: null,
                                                },
                                              });
                                            }
                                          }}
                                          type="checkbox"
                                          id="is_expression"
                                          label="Biểu thức"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="is_expression"
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
                                      name="calculation_id"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          value={values.calculation_id || ""}
                                          onChange={(item) => {
                                            field.onChange({
                                              target: {
                                                name: "calculation_id",
                                                value: item,
                                              },
                                            });
                                          }}
                                          options={OptCalculation}
                                          placeholder=" -- Chọn phép tính --"
                                          id="calculation_id"
                                          isDisabled={
                                            noEdit || !values.is_expression
                                          }
                                        />
                                      )}
                                    />
                                    {values.is_expression ? (
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
                                    ) : (
                                      ""
                                    )}
                                  </Col>
                                  <Col sm={3}>
                                    <Field
                                      name="parent_formula_id"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          value={values.parent_formula_id || ""}
                                          onChange={(item) => {
                                            field.onChange({
                                              target: {
                                                name: "parent_formula_id",
                                                value: item,
                                              },
                                            });
                                          }}
                                          options={OptFormula}
                                          placeholder=" -- Chọn công thức cha --"
                                          id="parent_formula_id"
                                          isDisabled={
                                            noEdit || !values.is_expression
                                          }
                                        />
                                      )}
                                    />
                                    {values.is_expression ? (
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
                                    ) : (
                                      ""
                                    )}
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
                                  <CheckAccess permission="FOR_FORMULABYNAME_EDIT">
                                    <Button
                                      color="primary"
                                      className="mr-2 btn-block-sm"
                                      onClick={() =>
                                        window._$g.rdr(
                                          `/formula-by-name/edit/${FormulaByNameEnt.formula_id}`
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
                                    window._$g.rdr("/formula-by-name")
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
