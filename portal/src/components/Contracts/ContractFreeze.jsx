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
  Table
} from 'reactstrap';
import Select from 'react-select';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

// Assets
// ...

// Component(s)
// import { CheckAccess } from '../../navigation/VerifyAccess';
// import Loading from '../Common/Loading';
import NumberFormat from '../Common/NumberFormat';
import DatePicker from '../Common/DatePicker';

// Util(s)
import {
  readFileAsBase64,
  // mapDataOptions4Select,
  MOMENT_FORMAT_DATE,
  mapDataOptions4Select,
  fileToObj,
  cdnPath,
  printWindow
} from "../../utils/html";
// import {numberFormat} from "../../utils";

// Model(s)
import ContractModel from '../../models/ContractModel';
import DocumentModel from '../../models/DocumentModel';

/**
 * @class ContractFreeze
 */
export default class ContractFreeze extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._contractModel = new ContractModel();
    this._documentModel = new DocumentModel();

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
      /** @var {Array} */
      documentArr: [
        { label: "-- Chọn --", value: "" },
      ],
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
      {}, this._contractModel.fillableForFreeze(),
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
    let all = [
      this._documentModel.getOptions({ active: 1 })
        .then(data => (bundle['documentArr'] = mapDataOptions4Select(data)))
    ];
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
    let { contractEnt } = this.state;
    let { setSubmitting } = formProps;
    let willRedirect = false;
    let alerts = [];
    // Build form data
    let _ = '';
    let {documents: docs, ...formData} = values;
    // +++ Thong tin san pham
    let documents = [];
    docs.forEach(_i => {
      documents.push({
        [_ = "attachment_name"]: _i[_],
        [_ = "attachment_path"]: _i[_],
      });
    });
    // console.log('formData: ', formData);
    //
    let contractId = (contractEnt && contractEnt.id()) || formData[this._contractModel._entity.primaryKey];
    this._contractModel.freeze(contractId, formData)
      .then(data => { // OK
        window._$g.toastr.show('Lưu thành công!', 'success');
        // 
        if (this._btnType === 'save_n_close') {
          willRedirect = true;
          return window._$g.rdr('/contracts');
        }
        // 
        if (this._btnType === 'save_n_print') {
          willRedirect = true;
          return printWindow(`/contracts/freeze/${contractId}/print`);
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
    // let { contractEnt } = this.state;
    this.setState(state => ({
      _id: 1 + state._id,
      ready: false,
      alerts: [],
      contractEnt: null,
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
    // let {membership} = this.state;
    let {start_date_freeze, end_date_freeze} = values;

    // Thoi gian bao luu
    if (!start_date_freeze || !end_date_freeze) {
      errors.date_freeze = "Thời gian bảo lưu là bắt buộc!";
    }
    if (start_date_freeze && end_date_freeze) {
      let startDate = moment(start_date_freeze, MOMENT_FORMAT_DATE);
      let endDate = moment(end_date_freeze, MOMENT_FORMAT_DATE);
      let days = Math.abs(endDate - startDate) / 1000 / 86400;
      if (days < 30 || days > 90) {
        errors.date_freeze = "Thời gian bảo lưu tối thiểu 1 tháng, và tối đa 3 tháng!";
      }
    }
    //
    return errors;
  }

  handleChangeDoc = (event) => {
    let { target } = event;
    let documents = [];
    if (target.files[0]) {
      readFileAsBase64(target, {
        // option: validate input
        validate: (file) => {
          documents.push(fileToObj(file));
          // Check file's type
          // if ('type' in file) {
          //   if (file.type.indexOf('image/') !== 0) {
          //     return 'Chỉ được phép sử dụng tập tin ảnh.';
          //   }
          // }
          // Check file's size in bytes
          if ('size' in file) {
            let maxSize = 4; /*4mb*/
            if ((file.size / 1024 / 1024) > maxSize) {
              return `Dung lượng tập tin tối đa là: ${maxSize}mb.`;
            }
          }
        }
      })
        .then(data => {
          let { values, setValues } = this.formikProps;
          //
          documents.forEach((doc, idx) => Object.assign(doc, {
            attachment_name: doc.name,
            attachment_path: data[idx],
          }));

          //
          setValues(Object.assign(values, {documents}));
        })
        .catch(err => {
          window._$g.dialogs.alert(window._$g._(err.message));
        })
      ;
    }
  };

  handleDelDoc = (item, evt) => {
    let { values, setValues } = this.formikProps;
    let { documents } = values;
    let foundIdx = documents.findIndex(_item => _item === item);
    if (foundIdx < 0) { return; }
    window._$g.dialogs.prompt(`Bạn muốn xóa tài liệu?`, (isYes) => {
      if (isYes) {
        documents.splice(foundIdx, 1);
        setValues(Object.assign(values, {documents}));
      }
    });
  }

  render() {
    let {
      _id,
      alerts,
      documentArr,
      contractEnt
    } = this.state;
    let { noEdit: propNoEdit } = this.props;
    let noEdit = propNoEdit || (contractEnt && (1 === ( 1 * contractEnt.is_freeze)));

    // Validate
    if (!contractEnt) {
      return null;
    }

    /** @var {Object} */
    let initialValues = this.getInitialValues();
    // console.log('initialValues: ', initialValues);

    return (
      <div id="contract_freeze-div" key={`view-${_id}`} className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>{contractEnt ? (noEdit ? 'Chi tiết' : 'Chỉnh sửa') : 'Thêm mới'} thông tin bảo lưu {contractEnt ? `"${contractEnt.contract_number}"` : ''}</b>
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
                          <FormGroup>
                            <Row>
                              <Label sm={4}>Loại hợp đồng {values['contract_type_name'] || 'abc'}</Label>
                              <Col sm={8}>
                                  <Field
                                    name="contract_type_name"
                                    render={({ field /* _form */ }) => <Input
                                      {...field}
                                      onBlur={null}
                                      type="text"
                                      id={field.name}
                                      value={values[field.name]}
                                      disabled={noEdit}
                                      readOnly={true}
                                    />}
                                  />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup>
                            <Row>
                              <Label sm={4}>Số hợp đồng hội viên</Label>
                              <Col sm={8}>
                                  <Field
                                    name="contract_number"
                                    render={({ field /* _form */ }) => <Input
                                      {...field}
                                      onBlur={null}
                                      type="text"
                                      id={field.name}
                                      value={values[field.name]}
                                      disabled={noEdit}
                                      readOnly={true}
                                    />}
                                  />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup>
                            <Row>
                              <Label sm={4}>Mã hội viên</Label>
                              <Col sm={8}>
                                  <Field
                                    name="customer_code"
                                    render={({ field /* _form */ }) => <Input
                                      {...field}
                                      onBlur={null}
                                      type="text"
                                      id={field.name}
                                      value={values[field.name]}
                                      disabled={noEdit}
                                      readOnly={true}
                                    />}
                                  />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup>
                            <Row>
                              <Label sm={4}>Tên hội viên</Label>
                              <Col sm={8}>
                                  <Field
                                    name="full_name"
                                    render={({ field /* _form */ }) => <Input
                                      {...field}
                                      onBlur={null}
                                      type="text"
                                      id={field.name}
                                      value={values[field.name]}
                                      disabled={noEdit}
                                      readOnly={true}
                                    />}
                                  />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup>
                            <Row>
                              <Label sm={4}>Cơ sở phòng tập</Label>
                              <Col sm={8}>
                                  <Field
                                    name="business_name"
                                    render={({ field /* _form */ }) => <Input
                                      {...field}
                                      onBlur={null}
                                      type="text"
                                      id={field.name}
                                      value={values[field.name]}
                                      disabled={noEdit}
                                      readOnly={true}
                                    />}
                                  />
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="page_title">
                        <Col xs={12}>
                          <b className="title_page_h1 text-primary">Thông tin bảo lưu</b>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4}>Bảo lưu từ ngày <span className="font-weight-bold red-text">*</span></Label>
                            <Col sm={8}>
                              <Field
                                name="date_freeze"
                                render={({ /*field, */form: { setValues } }) => {
                                  return (
                                    <DatePicker
                                      startDate={values.start_date_freeze ? moment(values.start_date_freeze, MOMENT_FORMAT_DATE) : undefined}
                                      startDateId="start_date_freeze" // PropTypes.string.isRequired,
                                      endDate={values.end_date_freeze ? moment(values.end_date_freeze, MOMENT_FORMAT_DATE) : undefined}
                                      endDateId="end_date_freeze" // PropTypes.string.isRequired,
                                      onDatesChange={({ startDate, endDate }) => {
                                        let start_date_freeze = (startDate && startDate.format(MOMENT_FORMAT_DATE)) || "";
                                        let end_date_freeze = (endDate && endDate.format(MOMENT_FORMAT_DATE)) || "";
                                        setValues(Object.assign(values, {start_date_freeze, end_date_freeze}));
                                      }} // PropTypes.func.isRequired,
                                      disabled={noEdit}
                                      displayFormat={MOMENT_FORMAT_DATE}
                                      isMultiple
                                      minDate={moment(contractEnt.order_date, MOMENT_FORMAT_DATE)}
                                      maxDate={moment(contractEnt.active_date, MOMENT_FORMAT_DATE)}
                                    />
                                  );
                                }}
                              />
                              <ErrorMessage name="date_freeze" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4}>Ngày hết hạn sau bảo lưu</Label>
                            <Col sm={8}>
                                <Field
                                  name="_ngay_het_han_sau_bao_luu"
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
                                <ErrorMessage name="_ngay_het_han_sau_bao_luu" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4}>Phí bảo lưu</Label>
                            <Col sm={8}>
                              <InputGroup>
                                <Field
                                  name="_phi_bao_luu"
                                  render={({ field /* _form */ }) => <NumberFormat
                                    name={field.name}
                                    onValueChange={(({ value }) => field.onChange({ target: { name: field.name, value } }))}
                                    value={values[field.name]}
                                    disabled={noEdit}
                                    readOnly={true}
                                  />}
                                />
                                <InputGroupAddon addonType="append">
                                  <InputGroupText>VND</InputGroupText>
                                </InputGroupAddon>
                              </InputGroup>
                              <ErrorMessage name="_phi_bao_luu" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup row>
                            <Label sm={4} for="document_id">Loại giấy tờ</Label>
                            <Col sm={8}>
                              <Field
                                name="document_id"
                                render={({ field/*, form */}) => {
                                  let defaultValue = documentArr.find(({ value }) => ('' + value) === ('' + field.value));
                                  let placeholder = (documentArr[0] && documentArr[0].label) || '';
                                  return (
                                    <Select
                                      name={field.name}
                                      onChange={({ value }) => field.onChange({ target: { name: field.name, value } })}
                                      isSearchable={true}
                                      placeholder={placeholder}
                                      value={defaultValue}
                                      options={documentArr}
                                      isDisabled={noEdit}
                                    />
                                  );
                                }}
                              />
                              <ErrorMessage name="document_id" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12}>
                          <FormGroup row>
                            <Label sm={2}>Giấy tờ đính kèm</Label>
                            <Col sm={10}>
                              {noEdit ? null : <div className="hidden ps-relative pb-1 pull-left">
                                <span className="btn btn-primary">Tải lên giấy tờ</span>
                                <Input
                                  type="file"
                                  multiple
                                  className="input-overlay"
                                  onChange={evt => this.handleChangeDoc(evt)}
                                  disabled={noEdit}
                                />
                              </div>}
                              <Table size="sm" bordered striped hover responsive>
                                <thead>
                                  <tr>
                                    <th style={{ width: '1%' }}>#</th>
                                    <th>{window._$g._('Hình ảnh')}</th>
                                    <th>{window._$g._('Tên tập tin')}</th>
                                    <th style={{ width: '1%' }}>{window._$g._('Xóa')}</th>
                                  </tr>
                                </thead>
                                <tbody>{(() => {
                                  return values.documents.map((item, idx) => {
                                    let {attachment_name, attachment_path} = item;
                                    let isImg = /\.(gif|jpe?g|svg|png)$/.test(attachment_name);
                                    return item ? (
                                      <tr key={`documents-${idx}`}>
                                        <th scope="row" className="text-center">{idx + 1}</th>
                                        <td className="">
                                          {isImg ? (<img src={cdnPath(attachment_path)} alt="document" style={{maxWidth:'128px'}} />) : null}
                                        </td>
                                        <td className="">
                                          <a href={cdnPath(attachment_path)} target="_blank" rel="noopener noreferrer">
                                            <span>{attachment_name}</span>
                                          </a>
                                        </td>
                                        <td className="text-center">
                                          <Button color="danger" size={"sm"} onClick={(event) => this.handleDelDoc(item, event)}>
                                            <i className="fa fa-minus-circle" />
                                          </Button>
                                        </td>
                                      </tr>
                                    ) : null;
                                  });
                                })()}</tbody>
                              </Table>
                              <ErrorMessage name="documents" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col sm={12} className="text-right">
                          <Button
                            type="submit"
                            color="primary"
                            disabled={isSubmitting || noEdit}
                            onClick={() => this.handleSubmit('save_n_close')}
                            className="mr-2 btn-block-sm"
                          >
                            <i className="fa fa-save mr-2" />Lưu
                          </Button>
                          <Button
                            type="submit"
                            color="success"
                            disabled={isSubmitting || noEdit}
                            onClick={() => this.handleSubmit('save_n_print')}
                            className="mr-2 btn-block-sm mt-md-0 mt-sm-2"
                          >
                            <i className="fa fa-save mr-2" />Lưu &amp; In
                          </Button>
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
