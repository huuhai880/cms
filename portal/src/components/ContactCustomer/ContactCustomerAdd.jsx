import React, { PureComponent } from "react";
import { Formik, Field, ErrorMessage } from 'formik';
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
  // FormText,
  Media,
  InputGroup,
  CustomInput,
  // InputGroupText,
  Table
} from "reactstrap";

// Component(s)
import Loading from '../Common/Loading';

// Util(s)
// Model(s)
import ContactCustomerModel from "../../models/ContactCustomerModel";

// Assets
import './styles.scss'

export default class ContactCustomerAdd extends PureComponent {
  formikProps = null;

  constructor(props) {
    super(props);

    this._contactCustomerModel = new ContactCustomerModel();

    this.handleFormikBeforeRender = this.handleFormikBeforeRender.bind(this);
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);

    let { contactCustomerEnt } = props;

    this.state = {
      _id: 0,
      alerts: [],
      ready: false,
      contactCustomerData: null,
      ContactCustomerCategoryOptions: null,
      clearContactCustomerImage: true,
      imageUrlEdit: null
    };

    this.formikValidationSchema = Yup.object().shape({

    });
  }

  componentDidMount() {
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true, clearContactCustomerImage: false });
    })();
    document.querySelector('body').classList.remove('tox-fullscreen');
  }

  getInitialValues() {
    let { contactCustomerEnt } = this.props;
    let values = Object.assign(
      {}, this._contactCustomerModel.fillable()
    );
    if (contactCustomerEnt) {
      Object.assign(values, contactCustomerEnt);
    }

    const keyContactMapList = {
      contact: 'Trang liên hệ',
      author: 'Trang góc tác giả',
      publisingcompany: 'Trang góc nhà xuất bản',
      service: 'Trang dịch vụ',
      plan: 'Trang dự án'
    }

    Object.keys(keyContactMapList).forEach((key)=>{
      if(values.key_contact === key){
        values.key_contact = keyContactMapList[key]
      }
    })

    Object.keys(values).forEach(key => {
      if (null === values[key]) {
        values[key] = "";
      }
    });
    return values;
  }

  async _getBundleData() {
    let { contactCustomerEnt } = this.props;
    let bundle = {};
    let all = [];
    await Promise.all(all)
      .catch(err => window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => window.location.reload()
      ))
      ;

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


  handleFormikBeforeRender({ initialValues }) {
    let { values } = this.formikProps;
    if (values === initialValues) {
      return;
    };
    Object.assign(values, {

    });
  }

  _btnType = null;

  handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;
    window.scrollTo(0, 0);
    return submitForm();
  }

  handleFormikSubmit(values, formProps) {
    let { contactCustomerEnt } = this.props;
    let { setSubmitting } = formProps;
    let willRedirect = false;
    let alerts = [];

    let formData = Object.assign({}, values, {
      //
    });

    let contact_customer_id = contactCustomerEnt ? contactCustomerEnt.contact_customer_id : undefined;
    let apiCall = contactCustomerEnt
      ? this._contactCustomerModel.update(contact_customer_id, formData)
      : this._contactCustomerModel.create(formData)
      ;
    apiCall
      .then(data => {
        window._$g.toastr.show('Lưu thành công!', 'success');
        if (this._btnType === 'save_n_close') {
          willRedirect = true;
          return window._$g.rdr('/ContactCustomer');
        }
        return data;
      })
      .catch(apiData => {
        let { errors, statusText, message } = apiData;
        let msg = [`<b>${errors}</b>`].concat([]).join('<br/>');
        alerts.push({ color: "danger", msg });
      })
      .finally(() => {
        setSubmitting(false);
        if (!contactCustomerEnt && !willRedirect && !alerts.length) {
          return this.handleFormikReset();
        }
        this.setState(() => ({ alerts }), () => { window.scrollTo(0, 0); });
      })
      ;
  }

  handleFormikReset() {
    this.setState(state => ({
      _id: 1 + state._id,
      ready: false,
      alerts: [],
      ContactCustomerCategoryOptions: [],
      clearContactCustomerImage: true
    }));
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true});
    })();
  }

  render() {
    let {
      _id,
      ready,
      alerts,
    } = this.state;
    let { contactCustomerEnt, noEdit } = this.props;
    let initialValues = this.getInitialValues();
    if (!ready) {
      return <Loading />;
    }

    return (
      <div key={`view-${_id}`} className="animated fadeIn author">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>{contactCustomerEnt ? (noEdit ? 'Chi tiết' : 'Chỉnh sửa') : 'Thêm mới'} liên hệ {contactCustomerEnt ? contactCustomerEnt.full_name : ''}</b>
              </CardHeader>
              <CardBody>
                {alerts.map(({ color, msg }, idx) => {
                  return (
                    <Alert key={`alert-${idx}`} color={color} isOpen={true} toggle={() => this.setState({ alerts: [] })}>
                      <span dangerouslySetInnerHTML={{ __html: msg }} />
                    </Alert>
                  );
                })}
                <Formik
                  initialValues={initialValues}
                  validationSchema={this.formikValidationSchema}
                  onSubmit={this.handleFormikSubmit}
                >{(formikProps) => {
                  let {
                    values,
                    // errors,
                    // status,
                    // touched, handleChange, handleBlur,
                    // submitForm,
                    // resetForm,
                    errors,
                    handleSubmit,
                    handleReset,
                    // isValidating,
                    isSubmitting,
                    /* and other goodies */
                  } = (this.formikProps = formikProps);
                  // [Event]
                  this.handleFormikBeforeRender({ initialValues });
                  // Render
                  return (
                    <Form id="form1st" onSubmit={handleSubmit} onReset={handleReset}>
                      <Row>
                        <Col xs={12}>
                          <Row>
                            <Col md={6}>
                              <Row>
                                <Col xs={12}>
                                  <FormGroup row >
                                    <Label for="full_name" sm={4}>
                                      Tên người liên hệ
                                    </Label>
                                    <Col sm={8}>
                                      <InputGroup>
                                        <Field
                                          name="full_name"
                                          render={({ field /* _form */ }) => <Input
                                            {...field}
                                            onBlur={null}
                                            type={`text`}
                                            name="full_name"
                                            id="full_name"
                                            disabled={noEdit}
                                          />}
                                        />
                                      </InputGroup>
                                      <ErrorMessage name="full_name" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>
                              
                              <Row>
                                <Col xs={12}>
                                  <FormGroup row >
                                    <Label for="email" sm={4}>
                                      Email
                                    </Label>
                                    <Col sm={8}>
                                      <InputGroup>
                                        <Field
                                          name="email"
                                          render={({ field /* _form */ }) => <Input
                                            {...field}
                                            onBlur={null}
                                            type={`text`}
                                            name="email"
                                            id="email"
                                            disabled={noEdit}
                                          />}
                                        />
                                      </InputGroup>
                                      <ErrorMessage name="email" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Col>
                            <Col md={6}>
                              <Row>
                                <Col xs={12}>
                                  <FormGroup row >
                                    <Label for="phone_number" sm={4}>
                                      Số điện thoại
                                    </Label>
                                    <Col sm={8}>
                                      <InputGroup>
                                        <Field
                                          name="phone_number"
                                          render={({ field /* _form */ }) => <Input
                                            {...field}
                                            onBlur={null}
                                            type={`text`}
                                            name="phone_number"
                                            id="phone_number"
                                            disabled={noEdit}
                                          />}
                                        />
                                      </InputGroup>
                                      <ErrorMessage name="phone_number" component={({ children }) => <Alert color="danger" className="field-validation-errorr">{children}</Alert>} />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12}>
                              <FormGroup row>
                                <Label for="content" sm={12}>
                                  Nội dung liên hệ
                                </Label>
                                <Col sm={12}>
                                  <Field
                                    name="content"
                                    render={({ field /* _form */ }) => <Input
                                      {...field}
                                      onBlur={null}
                                      type="textarea"
                                      name="content"
                                      id="content"
                                      disabled={noEdit}
                                      rows={4}
                                    />}
                                  />
                                  <ErrorMessage name="content" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={12} className="text-right">
                              {/* {
                                noEdit ? (
                                  <CheckAccess permission="CRM_ContactCustomer_EDIT">
                                    <Button color="primary" className="mr-2 btn-block-sm" onClick={() => window._$g.rdr(`/contact/edit/${contactCustomerEnt.contact_customerid}`)}>
                                      <i className="fa fa-edit mr-1" />Chỉnh sửa
                                    </Button>
                                  </CheckAccess>
                                ) :
                                  [
                                    <Button key="buttonSave" type="submit" color="primary" disabled={isSubmitting} onClick={() => this.handleSubmit('save')} className="mr-2 btn-block-sm">
                                      <i className="fa fa-save mr-2" />Lưu
                                    </Button>,
                                    <Button key="buttonSaveClose" type="submit" color="success" disabled={isSubmitting} onClick={() => this.handleSubmit('save_n_close')} className="mr-2 btn-block-sm mt-md-0 mt-sm-2">
                                      <i className="fa fa-save mr-2" />Lưu &amp; Đóng
                                    </Button>
                                  ]
                              } */}
                              <Button disabled={isSubmitting} onClick={() => window._$g.rdr('/contact')} className="btn-block-sm mt-md-0 mt-sm-2">
                                <i className="fa fa-times-circle mr-1" />Đóng
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  );
                }}</Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
