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
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import Select from "react-select";
import moment from "moment";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import Loading from "../Common/Loading";

// Model(s)
import PartnerModel from "../../models/PartnerModel";
import CountryModel from "../../models/CountryModel";
import ProvinceModel from "../../models/ProvinceModel";
import DistrictModel from "../../models/DistrictModel";
import WardModel from "../../models/WardModel";

/**
 * @class BusinessAdd
 */
export default class PartnerAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._partnerModel = new PartnerModel();
    this._countryModel = new CountryModel();
    this._provinceModel = new ProvinceModel();
    this._districtModel = new DistrictModel();
    this._wardModel = new WardModel();

    // Init state
    // +++
    this.state = {
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
      /** @var {Object|null} */
      // compayData: {},
      // /** @var {Array} */
      // companyTypes: [{ name: "-- Chọn --", id: "" }],
      // /** @var {Array} */
      // companies: [{ name: "-- Chọn --", id: "" }],
      /** @var {Array} */
      countries: [{ name: "-- Quốc gia --", id: "" }],
      /** @var {Array} */
      provinces: [{ name: "-- Tỉnh/Thành phố --", id: "" }],
      /** @var {Array} */
      districts: [{ name: "-- Quận/Huyện --", id: "" }],
      /** @var {Array} */
      wards: [{ name: "-- Phường/Xã --", id: "" }],
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
    let { partnerEnt } = this.props;
    let values = Object.assign({}, this._partnerModel.fillable(), partnerEnt);
    if (!values["country_id"]) {
      values["country_id"] = CountryModel.ID_VN;
    }
    // Format
    Object.keys(values).forEach((key) => {
      if (null === values[key]) {
        values[key] = "";
      }
      // opening_date
      // if (key === "open_date") {
      //   let bdArr = values[key].match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
      //   bdArr && (values[key] = `${bdArr[3]}-${bdArr[2]}-${bdArr[1]}`);
      // }
    });
    // Return;
    return values;
  };

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let bundle = {};
    let { partnerEnt } = this.props;
    let all = [
      this._countryModel.getOptions().then((data) => (bundle["countries"] = data)),
      this._provinceModel
        .getOptions(CountryModel.ID_VN)
        .then((data) => (bundle["provinces"] = data)),
    ];

    if (partnerEnt && partnerEnt.province_id) {
      all = all.concat([
        this._districtModel
          .getOptions(partnerEnt.province_id)
          .then((data) => (bundle["districts"] = data)),
      ]);
    }
    if (partnerEnt && partnerEnt.district_id) {
      all = all.concat([
        this._wardModel.getOptions(partnerEnt.district_id).then((data) => (bundle["wards"] = data)),
      ]);
    }

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

  /**
   * Xu ly, khi thay doi gia tri controls dia chi,...
   * @param {String} type
   * @param {Object} event
   */
  handleChangeAddress = (type, event) => {
    let { target } = event;
    let value = target.value || -1;
    if ("country" === type) {
      this._provinceModel.getOptions(value).then((data) => {
        let { provinces } = this.state;
        provinces = [provinces[0]].concat(data);
        this.setState({ provinces });
      });
    }
    if ("province" === type) {
      this._districtModel.getOptions(value).then((data) => {
        let { districts } = this.state;
        districts = [districts[0]].concat(data);
        this.setState({ districts });
      });
    }
    if ("district" === type) {
      this._wardModel.getOptions(value).then((data) => {
        let { wards } = this.state;
        wards = [wards[0]].concat(data);
        this.setState({ wards });
      });
    }
  };

  formikValidationSchema = Yup.object().shape({
    partner_name: Yup.string().required("Tên đối tác là bắt buộc."),
    // company_type_id: Yup.string().required("Loại hình tổ chức là bắt buộc."),
    phone_number: Yup.string()
      .matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ!")
      .required("Số điện thoại là bắt buộc."),
    country_id: Yup.string().required("Quốc gia phố là bắt buộc."),
    province_id: Yup.string().required("Tỉnh/Thành phố là bắt buộc."),
    district_id: Yup.string().required("Quận/Huyện là bắt buộc."),
    ward_id: Yup.string().required("Phường/Xã là bắt buộc."),
    address: Yup.string().required("Địa chỉ là bắt buộc."),
    ower_name: Yup.string().required("Tên người đại diện là bắt buộc."),
    ower_email: Yup.string().required("Email người đại diện là bắt buộc."),
    user_name: Yup.string().required("Tên tài khoản là bắt buộc."),
    password: this.props.partnerEnt
      ? undefined
      : Yup.string()
          .trim()
          .required("Mật khẩu là bắt buộc.")
          .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*\d)[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>]{8,}$/,
            "Mật khẩu yêu cầu 8 kí tự bao gồm chữ hoa , chữ thường, số, và kí tự đặc biệt."
          ),
    ower_phone_1: Yup.string()
      .matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ!")
      .required("Số điện thoại là bắt buộc."),
    ower_phone_2: Yup.string().matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ!"),
    // email: Yup.string().matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Nhập cho đúng định dạng mail vào"),
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
      country_id: values.country_id ? values.country_id : "",
      province_id: values.province_id ? values.province_id : "",
      district_id: values.district_id ? values.district_id : "",
      ward_id: values.ward_id ? values.ward_id : "",
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
    let { partnerEnt } = this.props;
    // Build form data
    // +++
    let { open_date, address_full, is_active } = values;
    // let bdArr = (open_date && moment(open_date).format("DD/MM/YYYY")) || [];
    // +++
    let formData = Object.assign({}, values, {
      is_active: is_active ? 1 : 0,
      // open_date: bdArr.length ? bdArr : "",
    });
    //

    const partnerId = (partnerEnt && partnerEnt.partner_id) || formData[this._partnerModel];
    let apiCall = partnerId
      ? this._partnerModel.update(partnerId, formData)
      : this._partnerModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/partner");
        }
        // Chain
        return data;
      })
      .catch((apiData) => {
        // NG
        let { errors, statusText, message } = apiData;

        let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");
        // console.log(message)
        if (message == "Số điện thoại đối tác đã tồn tại.") {
          document.getElementById("phone_number").focus();
        }
        alerts.push({ color: "danger", msg });
      })
      .finally(() => {
        // Submit form is done!
        setSubmitting(false);
        //
        if (!partnerEnt && !willRedirect && !alerts.length) {
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
    // console.log(alerts[0])
    // console.log(alerts[0].msg=="Số điện thoại đối tác đã tồn tại.")

    /** @var {Object} */
    let initialValues = this.getInitialValues();
    const { noEdit, partnerEnt } = this.props;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {partnerEnt && partnerEnt.partner_name
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  đối tác {partnerEnt ? partnerEnt.partner_name : ""}
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
                  // validate={this.handleFormikValidate}
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
                      <Form id="form1st" onSubmit={handleSubmit} onReset={handleReset}>
                        <Row className="mb15">
                          <Col xs={12}>
                            <b className="underline">Thông tin đối tác</b>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12}>
                            <FormGroup row>
                              <Label for="partner_name" sm={2}>
                                Tên đối tác
                                <span className="font-weight-bold red-text">*</span>
                              </Label>
                              <Col sm={10}>
                                <Field
                                  name="partner_name"
                                  render={({ field /* _form */ }) => (
                                    <Input
                                      {...field}
                                      onBlur={null}
                                      type="text"
                                      id="partner_name"
                                      placeholder=""
                                      disabled={noEdit}
                                    />
                                  )}
                                />
                                <ErrorMessage
                                  name="partner_name"
                                  component={({ children }) => (
                                    <Alert color="danger" className="field-validation-error">
                                      {children}
                                    </Alert>
                                  )}
                                />
                              </Col>
                            </FormGroup>
                          </Col>
                          <Col xs={12}>
                            {/* <Row>
                            <Col xs={6}>
                              <FormGroup row>
                                <Label for="company_type_id" sm={4}>
                                  Loại hình tổ chức<span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={8}>
                                  <Field
                                    name="company_type_id"
                                    render={({ field }) => {
                                      let options = companyTypes.map(({ name: label, id: value }) => ({ value, label }));
                                      let defaultValue = options.find(({ value }) => (1 * value) === (1 * field.value));
                                      let placeholder = (companyTypes[0] && companyTypes[0].name) || '';
                                      return (
                                        <Select
                                          id="company_type_id"
                                          name="company_type_id"
                                          onChange={({ value }) => field.onChange({
                                            target: { type: "select", name: "company_type_id", value }
                                          })}
                                          isSearchable={true}
                                          placeholder={placeholder}
                                          defaultValue={defaultValue}
                                          options={options}
                                          isDisabled={noEdit}
                                        />
                                      );
                                    }}
                                  />
                                  <ErrorMessage name="company_type_id" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                </Col>
                              </FormGroup>
                            </Col>
                            <Col xs={6}>
                              <FormGroup row>
                                <Label for="open_date" sm={4}>
                                  Ngày thành lập
                                </Label>
                                <Col sm={8}>
                                  <Field
                                    name="open_date"
                                    render={({
                                      date,
                                      form: { setFieldValue, setFieldTouched, values },
                                      field,
                                      ...props
                                    }) => {
                                      return (
                                        <DatePicker
                                          id="open_date"
                                          date={values.open_date ? moment(values.open_date) : null}
                                          onDateChange={date => {
                                            setFieldValue('open_date', date)
                                          }}
                                          disabled={noEdit}
                                          maxToday
                                        />
                                      )
                                    }}
                                  />
                                  <ErrorMessage name="open_date" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row> */}
                            <Row>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label for="phone_number" sm={4}>
                                    Số điện thoại
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="phone_number"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          id="phone_number"
                                          placeholder="Nhập số điện thoại"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="phone_number"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label for="email" sm={4}>
                                    Email
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="email"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="email"
                                          id="email"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="email"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
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
                                  <Label for="fax" sm={4}>
                                    Fax
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="fax"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          id="fax"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="fax"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label for="tax_id" sm={4}>
                                    Mã số thuế
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="tax_id"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          id="tax_id"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="tax_id"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              {/* <Col xs={6}>
                                <FormGroup row>
                                  <Label for="zip_code" sm={4}>
                                    Mã bưu chính
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="zip_code"
                                      render={({ field}) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="zip_code"
                                          id="zip_code"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="zip_code"
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
                              </Col> */}
                            </Row>
                            <Row>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label for="bank_name" sm={4}>
                                    Tên ngân hàng
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="bank_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="bank_name"
                                          id="bank_name"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="bank_name"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label for="bank_routing" sm={4}>
                                    Số Routing
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="bank_routing"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          id="bank_routing"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="bank_routing"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label for="bank_account_name" sm={4}>
                                    Chủ tài khoản
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="bank_account_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          id="bank_account_name"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="bank_account_name"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label for="bank_account_id" sm={4}>
                                    Số TK ngân hàng
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="bank_account_id"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          id="bank_account_id"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="bank_account_id"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="mb15">
                              <Col xs={12}>
                                <b className="underline">Địa chỉ đối tác</b>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label for="country_id" sm={4}>
                                    Quốc gia
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="country_id"
                                      render={({ field /*, form */ }) => {
                                        let options = countries.map(
                                          ({ name: label, id: value }) => ({
                                            value,
                                            label,
                                          })
                                        );
                                        let defaultValue = options.find(
                                          ({ value }) => 1 * value === 1 * field.value
                                        );
                                        return (
                                          <Select
                                            id="country_id"
                                            name="country_id"
                                            onChange={(item) => {
                                              let event = {
                                                target: {
                                                  type: "select",
                                                  name: "country_id",
                                                  value: item.value,
                                                },
                                              };
                                              this.handleChangeAddress("country_id", event);
                                              field.onChange(event);
                                            }}
                                            isSearchable={true}
                                            placeholder={(options[0] && options[0].label) || ""}
                                            defaultValue={defaultValue}
                                            options={options}
                                            isDisabled={noEdit}
                                          />
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="country_id"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col sm={6}>
                                <FormGroup row>
                                  <Label for="province_id" sm={4}>
                                    Tỉnh/Thành phố
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="province_id"
                                      render={({ field /*, form */ }) => {
                                        let options = provinces.map(
                                          ({ name: label, id: value }) => ({
                                            value,
                                            label,
                                          })
                                        );
                                        let defaultValue = options.find(
                                          ({ value }) => 1 * value === 1 * field.value
                                        );
                                        let placeholder = (provinces[0] && provinces[0].name) || "";
                                        return (
                                          <Select
                                            id="province_id"
                                            name="province_id"
                                            onChange={(item) => {
                                              let event = {
                                                target: {
                                                  type: "select",
                                                  name: "province_id",
                                                  value: item.value,
                                                },
                                              };
                                              this.handleChangeAddress("province", event);
                                              field.onChange(event);
                                            }}
                                            isSearchable={true}
                                            placeholder={placeholder}
                                            defaultValue={defaultValue}
                                            options={options}
                                            isDisabled={noEdit}
                                          />
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="province_id"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={6}>
                                <FormGroup row>
                                  <Label for="district_id" sm={4}>
                                    Quận/Huyện
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="district_id"
                                      render={({ field /*, form*/ }) => {
                                        let options = districts.map(
                                          ({ name: label, id: value }) => ({
                                            value,
                                            label,
                                          })
                                        );
                                        let defaultValue = options.find(
                                          ({ value }) => 1 * value === 1 * field.value
                                        );
                                        let placeholder = (districts[0] && districts[0].name) || "";
                                        return (
                                          <Select
                                            id="district_id"
                                            name="district_id"
                                            onChange={(item) => {
                                              let event = {
                                                target: {
                                                  type: "select",
                                                  name: "district_id",
                                                  value: item.value,
                                                },
                                              };
                                              this.handleChangeAddress("district", event);
                                              field.onChange(event);
                                            }}
                                            isSearchable={true}
                                            placeholder={placeholder}
                                            defaultValue={defaultValue}
                                            options={options}
                                            isDisabled={noEdit}
                                          />
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="district_id"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col sm={6}>
                                <FormGroup row>
                                  <Label for="ward_id" sm={4}>
                                    Phường/Xã
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="ward_id"
                                      render={({ field /*, form*/ }) => {
                                        let options = wards.map(({ name: label, id: value }) => ({
                                          value,
                                          label,
                                        }));
                                        let defaultValue = options.find(
                                          ({ value }) => 1 * value === 1 * field.value
                                        );
                                        let placeholder = (wards[0] && wards[0].name) || "";
                                        return (
                                          <Select
                                            id="ward_id"
                                            name="ward_id"
                                            onChange={(item) => {
                                              let event = {
                                                target: {
                                                  type: "select",
                                                  name: "ward_id",
                                                  value: item.value,
                                                },
                                              };
                                              this.handleChangeAddress("ward", event);
                                              field.onChange(event);
                                            }}
                                            isSearchable={true}
                                            placeholder={placeholder}
                                            defaultValue={defaultValue}
                                            options={options}
                                            isDisabled={noEdit}
                                          />
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="ward_id"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
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
                                  <Label for="address" sm={2}>
                                    Địa Chỉ
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={10}>
                                    <Field
                                      name="address"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          id="address"
                                          placeholder="Số nhà, đường – khu phố/thôn/xóm"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="address"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="mb15">
                              <Col xs={12}>
                                <b className="underline">Người đại diện</b>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label for="ower_name" sm={4}>
                                    Tên người đại diện
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="ower_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          id="ower_name"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="ower_name"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label for="ower_email" sm={4}>
                                    Email
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="ower_email"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="email"
                                          id="ower_email"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="ower_email"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="user_name" sm={4}>
                                    Tài khoản
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="user_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="user_name"
                                          id="user_name"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="user_name"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={12} sm={6}>
                                <FormGroup
                                  row
                                  // hidden={!!userEnt}
                                  // className={`${userEnt ? "hidden" : ""}`}
                                >
                                  <Label for="Password" sm={4}>
                                    Mật khẩu
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={8}>
                                    <InputGroup>
                                      <Field
                                        name="password"
                                        render={({ field /* _form */ }) => (
                                          <Input
                                            {...field}
                                            onBlur={null}
                                            type={`${
                                              this.state.passwordVisible ? "text" : "password"
                                            }`}
                                            name="password"
                                            id="password"
                                            placeholder="******"
                                            disabled={noEdit || partnerEnt}
                                          />
                                        )}
                                      />
                                      <InputGroupAddon addonType="append">
                                        <Button
                                          block
                                          disabled={noEdit || partnerEnt}
                                          onClick={() => {
                                            let { passwordVisible } = this.state;
                                            this.setState({
                                              passwordVisible: !passwordVisible,
                                            });
                                          }}
                                        >
                                          <i
                                            className={`fa ${
                                              this.state.passwordVisible ? "fa-eye-slash" : "fa-eye"
                                            }`}
                                          />
                                        </Button>
                                      </InputGroupAddon>
                                    </InputGroup>
                                    <ErrorMessage
                                      name="password"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
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
                                  <Label for="ower_phone_1" sm={4}>
                                    Số điện thoại 1
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="ower_phone_1"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          id="ower_phone_1"
                                          placeholder="Nhập số điện thoại"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="ower_phone_1"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label for="ower_phone_2" sm={4}>
                                    Số điện thoại 2
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="ower_phone_2"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          id="ower_phone_2"
                                          placeholder="Nhập số điện thoại"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="ower_phone_2"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={6}>
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
                                        <Alert color="danger" className="field-validation-error">
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
                              <Col sm={12} className="text-right">
                                {noEdit ? (
                                  <CheckAccess permission="MD_PARTNER_EDIT">
                                    <Button
                                      color="primary"
                                      className="mr-2 btn-block-sm"
                                      onClick={() =>
                                        window._$g.rdr(`/partner/edit/${partnerEnt.partner_id}`)
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
                                      onClick={() => this.handleSubmit("save_n_close")}
                                      className="mr-2 btn-block-sm mt-md-0 mt-sm-2"
                                    >
                                      <i className="fa fa-save mr-2" />
                                      Lưu &amp; Đóng
                                    </Button>,
                                  ]
                                )}
                                <Button
                                  disabled={isSubmitting}
                                  onClick={() => window._$g.rdr("/partner")}
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
