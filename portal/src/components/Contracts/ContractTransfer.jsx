import React, { PureComponent } from 'react';
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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

// Assets
import "./styles.scss";

// Component(s)
import { CheckAccess } from '../../navigation/VerifyAccess';
// import Loading from '../Common/Loading';
import NumberFormat from '../Common/NumberFormat';

// Util(s)
import {
  // mapDataOptions4Select,
  // MOMENT_FORMAT_DATE
  printWindow
} from "../../utils/html";
// import {numberFormat} from "../../utils";
// import * as utils from '../../utils';

// Model(s)
import ContractModel from '../../models/ContractModel';
import MembershipModel from '../../models/MembershipModel';

/**
 * @class ContractTransfer
 */
export default class ContractTransfer extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._contractModel = new ContractModel();
    this._membershipModel = new MembershipModel();

    // Bind method(s)
    this.handleFormikBeforeRender = this.handleFormikBeforeRender.bind(this);
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);

    // Init state
    this.state = {
      /** @var {number} */
      _id: 0,
      /** @var {Boolean} */
      ready: false,
      /** @var {Array} */
      alerts: [],
      /** @var {Object} */
      contractEnt: null,
      /** @var {Object} */
      membership: null,
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

  /**
   * 
   * @return {Object}
   */
  getInitialValues() {
    let { contractEnt } = this.state;
    let values = Object.assign(
      {}, this._contractModel.fillableForTransfer(),
      contractEnt
    );
    // Format
    Object.keys(values).forEach(key => {
      if (null === values[key]) {
        values[key] = "";
      }
      // if (key === '') {}
    });

    // Return;
    return values;
  }

  /**
   * Goi API, lay toan bo data lien quan,...
   */
  async _getBundleData() {
    let {match: { params }} = this.props;
    let bundle = {};
    let contractEnt = await this._contractModel.read(params.id)
      .catch(() => {
        setTimeout(() => window._$g.rdr('/404'));
      })
    ;
    Object.assign(bundle, { contractEnt });
    let all = [];
    if (contractEnt.member_receive) {
      all.push(
        this._membershipModel.read(contractEnt.member_receive)
          .then(data => (bundle['membership'] = data))
      );
    }
    await Promise.all(all)
      .catch(err => window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => window.location.reload()
      ))
    ;
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

  formikValidationSchema = Yup.object().shape({});

  handleFormikBeforeRender({ initialValues }) {
    let { values } = this.formikProps;
    if (values === initialValues) {
      return;
    }
    // Reformat data
    // +++
    Object.assign(values, {});
  }

  /** @var {String} */
  _btnType = null;

  handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;
    window.scrollTo(0, 0);
    return submitForm();
  }

  handleFormikSubmit(values, formProps) {
    let { contractEnt, membership } = this.state;
    let { setSubmitting } = formProps;
    let willRedirect = false;
    let alerts = [];
    // Build form data
    let _ = '';
    let formData = {
      [_ = "member_transfer"]: contractEnt.member_id,
      [_ = "member_receive"]: membership.membership.membership_id,
      [_ = "transfer_note"]: values[_],
    };
    // console.log('formData: ', formData);
    //
    let contractId = (contractEnt && contractEnt.id()) || formData[this._contractModel._entity.primaryKey];
    this._contractModel.transfer(contractId, formData)
      .then(data => { // OK
        window._$g.toastr.show('Lưu thành công!', 'success');
        // 
        if (this._btnType === 'save_n_close') {
          willRedirect = true;
          return window._$g.rdr('/contracts');
        }
        // 
        if (this._btnType === 'save_n_print') {
          // willRedirect = true;
          printWindow(`/contracts/transfer/${contractId}/print`);
        }
        // Chain
        return data;
      })
      .catch(apiData => { // NG
        let { errors, statusText, message } = apiData;
        let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join('<br/>');
        alerts.push({ color: "danger", msg });
      })
      .finally(() => {
        // Submit form is done!
        setSubmitting(false);
        //
        if (!willRedirect && !alerts.length) {
          return this.handleFormikReset();
        }
        this.setState(() => ({ alerts }), () => { window.scrollTo(0, 0); });
      })
    ;
  }

  handleFormikReset() {
    // let { contractEnt } = this.props;
    this.setState(state => ({
      _id: 1 + state._id,
      ready: false,
      alerts: [],
      contractEnt: null,
      membership: null
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    //.end
  }

  handleFormikValidate = (values) => {
    let errors = {};
    let {membership} = this.state;
    // let {} = values;

    // Thong tin hoi vien
    if (!membership) {
      errors.member_receive = "Thông tin hội viên nhận chuyển nhượng là bắt buộc!";
    }

    //
    return errors;
  }

  /**
   * @return {Boolean}
   */
  checkBusinessData() {
    return true;
  }

  _getMembershipByCode = (member_code) => {
    return this._membershipModel.read(member_code)
      .catch(() => window._$g.toastr
        .show(`Chọn hội viên theo mã '${member_code}' không thành công!`, 'error')
      );
  };

  handleChangeMembership = (evt) => {
    let {target} = evt;
    let member_receive_code = ('' + target.value).trim();
    //
    if ('focus' === evt.type) {
      return (this._dataMembershipReceiveCode = member_receive_code);
    }
    // Detect data changed?
    if (('blur' !== evt.type) || (this._dataMembershipReceiveCode === member_receive_code)) {
      return;
    }
    let membership = null;
    (async () => {
      if (member_receive_code) {
        membership = (await this._getMembershipByCode(member_receive_code)) || null;
      }
      this.setState({ membership });
    })();
  };

  render() {
    let {
      _id,
      alerts,
      contractEnt,
      membership
    } = this.state;
    let { noEdit: propNoEdit } = this.props;
    let noEdit = propNoEdit || (contractEnt && (1 === ( 1 * contractEnt.is_transfer)));

    // Validate
    if (!contractEnt) {
      return null;
    }

    /** @var {Object} */
    let initialValues = this.getInitialValues();
    // console.log('initialValues: ', initialValues);

    return (
      <div id="contract_transfer-div" key={`view-${_id}`} className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>Chuyển nhượng hợp đồng {contractEnt ? `"${contractEnt.contract_number}"` : ''}</b>
              </CardHeader>
              <CardBody>
                {/* general alerts */}
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
                  validate={this.handleFormikValidate}
                  validateOnBlur={false}
                  // validateOnChange={false}
                  onSubmit={this.handleFormikSubmit}
                >{(formikProps) => {
                  let {
                    values,
                    // errors,
                    // status,
                    // touched, handleChange, handleBlur,
                    // submitForm,
                    // resetForm,
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
                      <Row className="page_title">
                        <Col xs={12}>
                          <b className="title_page_h1 text-primary">Thông tin hợp đồng</b>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4}>Loại hợp đồng</Label>
                            <Col sm={8}>
                              <Field
                                name="contract_type_name"
                                render={({ field /* _form */ }) => <Input
                                  {...field}
                                  onBlur={null}
                                  type="text"
                                  id={field.name}
                                  placeholder=""
                                  disabled={noEdit}
                                  readOnly={true}
                                />}
                              />
                              <ErrorMessage name="contract_type_name" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6} />
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4}>Số hợp đồng hội viên</Label>
                            <Col sm={8}>
                              <Field
                                name="contract_number"
                                render={({ field /* _form */ }) => <Input
                                  {...field}
                                  onBlur={null}
                                  type="text"
                                  id={field.name}
                                  placeholder=""
                                  disabled={noEdit}
                                  readOnly={true}
                                />}
                              />
                              <ErrorMessage name="contract_number" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4}>Cơ sở phòng tập</Label>
                            <Col sm={8}>
                              <Field
                                name="business_name"
                                render={({ field /* _form */ }) => <Input
                                  {...field}
                                  onBlur={null}
                                  type="text"
                                  id={field.name}
                                  placeholder=""
                                  disabled={noEdit}
                                  readOnly={true}
                                />}
                              />
                              <ErrorMessage name="business_name" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4}>Mã hội viên chuyển nhượng</Label>
                            <Col sm={8}>
                              <Field
                                name="membership_code"
                                render={({ field /* _form */ }) => <Input
                                  {...field}
                                  onBlur={null}
                                  type="text"
                                  id={field.name}
                                  placeholder=""
                                  disabled={noEdit}
                                  readOnly={true}
                                />}
                              />
                              <ErrorMessage name="membership_code" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4}>Tên hội viên chuyển nhượng</Label>
                            <Col sm={8}>
                              <Field
                                name="full_name"
                                render={({ field /* _form */ }) => <Input
                                  {...field}
                                  onBlur={null}
                                  type="text"
                                  id={field.name}
                                  placeholder=""
                                  disabled={noEdit}
                                  readOnly={true}
                                />}
                              />
                              <ErrorMessage name="full_name" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="page_title">
                        <Col xs={12}>
                          <b className="title_page_h1 text-primary">Thông tin chuyển nhượng</b>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4} for="member_receive">Mã hội viên được nhận<span className="font-weight-bold red-text">*</span></Label>
                            <Col sm={8}>
                            <Field
                                name="member_receive"
                                render={({ field /* _form */ }) => <Input
                                  {...field}
                                  onFocus={this.handleChangeMembership}
                                  onBlur={this.handleChangeMembership}
                                  type="text"
                                  id={field.name}
                                  value={undefined}
                                  defaultValue={((membership && membership.account) || {})['customer_code'] || ""}
                                  disabled={noEdit}
                                />}
                              />
                              <ErrorMessage name="member_receive" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4}>Tên hội viên nhận</Label>
                            <Col sm={8}>
                              <Field
                                name="_ten_hoi_vien_nhan"
                                render={({ field /* _form */ }) => <Input
                                  {...field}
                                  onBlur={null}
                                  type="text"
                                  id={field.name}
                                  value={((membership && membership.account) || {})['full_name'] || ""}
                                  disabled={noEdit}
                                  readOnly={true}
                                />}
                              />
                              <ErrorMessage name="_ten_hoi_vien_nhan" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4} for="_ngay_sinh">Ngày sinh</Label>
                            <Col sm={8}>
                              <Input
                                name="_ngay_sinh"
                                type="text"
                                value={((membership && membership.account) || {})['birth_day'] || ""}
                                placeholder=""
                                disabled={noEdit}
                                readOnly={true}
                              />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4} for="_gioi_tinh">Giới tính</Label>
                            <Col sm={8}>
                              {(() => {
                                let gender = ('' + ((membership && membership.account) || {})['gender'] || "");
                                return <Input
                                  name="_gioi_tinh"
                                  type="text"
                                  value={(gender === '1' ? 'Nam' : (gender === '0' ? 'Nữ' : ''))}
                                  placeholder=""
                                  disabled={noEdit}
                                  readOnly={true}
                                />
                              })()}
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup>
                            <Row>
                              <Label sm={4}>Phí chuyển nhượng</Label>
                              <Col sm={8}>
                                <InputGroup>
                                  <Field
                                    name="_phi_chuyen_nhuong"
                                    render={({ field /* _form */ }) => <NumberFormat
                                      name={field.name}
                                      value={values[field.name] || '0'}
                                      disabled={noEdit}
                                      readOnly={true}
                                    />}
                                  />
                                  <InputGroupAddon addonType="append">
                                    <InputGroupText>VND</InputGroupText>
                                  </InputGroupAddon>
                                </InputGroup>
                                <ErrorMessage name="_phi_chuyen_nhuong" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                        <Col xs={12}>
                          <FormGroup>
                            <Row>
                              <Label sm={2}>Ghi chú</Label>
                              <Col sm={10}>
                                <Field
                                  name="transfer_note"
                                  render={({ field /* _form */ }) => <Input
                                    {...field}
                                    type="textarea"
                                    // onChange={(({ value }) => field.onChange({ target: { name: field.name, value } }))}
                                    // value={values[field.name]}
                                    disabled={noEdit}
                                  />}
                                />
                                <ErrorMessage name="transfer_note" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col sm={12} className="text-right">
                          {propNoEdit ? (
                            <CheckAccess permission="CT_CONTRACT_EDIT">
                              <Button color="primary" className="mr-2 btn-block-sm" onClick={() => window._$g.rdr(`/contracts/edit/${contractEnt.id()}`)}>
                                <i className="fa fa-edit mr-1" />Chỉnh sửa
                              </Button>
                            </CheckAccess>
                          ) : ([
                              <Button
                                key="buttonSave"
                                type="submit"
                                color="primary"
                                disabled={isSubmitting || noEdit}
                                onClick={() => this.handleSubmit('save')}
                                className="mr-2 btn-block-sm"
                              >
                                <i className="fa fa-save mr-2" />Lưu
                              </Button>,
                              <Button
                                key="buttonSaveClose"
                                type="submit"
                                color="success"
                                disabled={isSubmitting || noEdit}
                                onClick={() => this.handleSubmit('save_n_print')}
                                className="mr-2 btn-block-sm mt-md-0 mt-sm-2"
                              >
                                <i className="fa fa-save mr-2" />Lưu &amp; In
                              </Button>
                            ])
                          }
                            <Button disabled={isSubmitting} onClick={() => window._$g.rdr('/contracts')} className="btn-block-sm mt-md-0 mt-sm-2">
                              <i className="fa fa-close" />
                              <span className="ml-1">Đóng</span>
                            </Button>
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
    )
  }
}
