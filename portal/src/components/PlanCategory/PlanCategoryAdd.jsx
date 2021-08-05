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
  CustomInput,
} from "reactstrap";

import { CheckAccess } from '../../navigation/VerifyAccess'
import Loading from '../Common/Loading';
import { mapDataOptions4Select, changeToSlug } from '../../utils/html';
import { FormSelectGroup } from "@widget"

import PlanCategoryModel from "../../models/PlanCategoryModel";
import { DropzoneArea } from 'material-ui-dropzone'

class PlanCategoryAdd extends PureComponent {

  constructor(props) {
    super(props);
    this._planCategoryModel = new PlanCategoryModel()
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);
    this.state = {
      alerts: [],
      ready: true,
      parentList: [],
      parent_id: '',
    }
  }
  formikProps = null;
  _btnType = null;

  formikValidationSchema = Yup.object().shape({
    category_name: Yup.string().trim()
      .required("Tên danh mục dự án là bắt buộc"),
    seo_name: Yup.string()
      .max(200, 'Tiêu đề SEO không được nhiều hơn 200 ký tự'),
    description: Yup.string()
      .max(2000, 'Mô tả không được nhiều hơn 2000 ký tự'),
    meta_keywords: Yup.string()
      .max(200, 'Meta keyword không được nhiều hơn 200 ký tự'),
    meta_descriptions: Yup.string()
      .max(200, 'Meta description không được nhiều hơn 200 ký tự'),

  });

  // componentDidMount() {
  //   (async () => {

  //     let bundle = await this._getBundleData();

  //     this.setState({ ...bundle, ready: true });
  //   })();
  // }

  getInitialValues() {
    let { planCategoryEnt } = this.props;
    let values = Object.assign(
      {}, this._planCategoryModel.fillable(),
    );

    if (planCategoryEnt) {
      Object.assign(values, planCategoryEnt);
    }
    Object.keys(values).forEach(key => {
      if (null === values[key]) {
        values[key] = "";
      }
    });
    return values
  }

  // async _getBundleData() {

  //   let bundle = {};
  //   let all = [
  //     this._planCategoryModel.getOptionParentList({ is_active: 1 })
  //       .then(data => (bundle['parentList'] = mapDataOptions4Select(data)))
  //   ]

  //   await Promise.all(all)
  //     .catch(err => window._$g.dialogs.alert(
  //       window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
  //       () => window.location.reload()
  //     ));

  //   let { planCategoryEnt } = this.props;
  //   Object.keys(bundle).forEach((key) => {
  //     let data = bundle[key];
  //     let stateValue = this.state[key];
  //     if (data instanceof Array && stateValue instanceof Array) {
  //       data = [stateValue[0]].concat(data);
  //     }
  //     bundle[key] = data;
  //   });
  //   bundle.parentList = bundle.parentList.filter(Boolean)
  //   return bundle;
  // }

  handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;
    window.scrollTo(0, 0);
    return submitForm();
  }
  handleFormikSubmit(values, formProps) {
    let { planCategoryEnt } = this.props;
    let { setSubmitting } = formProps;
    let willRedirect = false;
    let alerts = [];

    // +++
    let formData = Object.assign({}, values, {
      is_active: values.is_active ? 1 : 0,
    });

    let planCategoryId = (planCategoryEnt ? planCategoryEnt.plan_category_id : undefined);
    let apiCall = planCategoryEnt
      ? this._planCategoryModel.update(planCategoryId, formData)
      : this._planCategoryModel.create(formData);

    apiCall
      .then(data => { // OK
        window._$g.toastr.show('Lưu thành công!', 'success');
        if (this._btnType === 'save_n_close') {
          willRedirect = true;
          return window._$g.rdr('/plan-category');
        }
        // Chain
        return data;
      })
      .catch(apiData => { // NG
        let { errors, statusText, message } = apiData;
        let msg = [`<b>${errors}</b>`].concat([]).join('<br/>');
        alerts.push({ color: "danger", msg });
      })
      .finally(() => {
        setSubmitting(false);
        if (!planCategoryEnt && !willRedirect && !alerts.length) {
          return this.handleFormikReset();
        }
        this.setState(() => ({ alerts }), () => { window.scrollTo(0, 0); });
      })
      ;
  }

  handleFormikReset() {
    this.setState(state => ({
      alerts: [],
      ready: false,
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true, clearImage: false });
    })();
    //.end
  }

  handleSeoNameBlur = (e) => {
    let { setFieldValue } = this.formikProps;
    let formatedValue = changeToSlug(e.target.value)
    setFieldValue('seo_name', formatedValue)
  }

  render() {
    let { ready, alerts } = this.state;
    let { planCategoryEnt, noEdit } = this.props;
    let initialValues = this.getInitialValues();
    if (!ready) {
      return <Loading />;
    }
    return (
      <div className="animated fadeIn author">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>{planCategoryEnt ? (noEdit ? 'Chi tiết' : 'Chỉnh sửa') : 'Thêm mới'} danh mục dự án</b>
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
                >
                  {
                    (formikProps) => {
                      let {
                        values,
                        handleSubmit,
                        handleReset,
                        isSubmitting,
                        setFieldValue
                      } = (this.formikProps = window._formikProps = formikProps);
                      return (
                        <Form id="form1st" onSubmit={handleSubmit} onReset={handleReset}>
                          <Row>
                            <Col md={6}>
                              <Row>
                                <Col sx={12}>
                                  <p className="mb-3"><b className="title_page_h1 text-primary">Thông tin danh mục dự án</b></p>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={12}>
                                  <FormGroup row>
                                    <Label for="category_name" sm={3}>
                                      Tên danh mục dự án<span className="font-weight-bold red-text">*</span>
                                    </Label>
                                    <Col sm={9}>
                                      <Field
                                        name="category_name"
                                        render={({ field }) => <Input
                                          {...field}
                                          type="text"
                                          placeholder=""
                                          disabled={noEdit}
                                        />}
                                      />
                                      <ErrorMessage name="category_name" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={12}>
                                  <FormGroup row>
                                    <Label for="description" sm={3}>Mô tả</Label>
                                    <Col sm={9}>
                                      <Field
                                        name="description"
                                        render={({ field }) => <Input
                                          {...field}
                                          onBlur={null}
                                          type="textarea"
                                          id="description"
                                          disabled={noEdit}
                                          rows={4}
                                        />}
                                      />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row className="mb-3 mt-3">
                                <Label for="is_active" sm={3}></Label>
                                <Col sm={9}>
                                  <Field
                                    name="is_active"
                                    render={({ field }) => <CustomInput
                                      {...field}
                                      className="pull-left"
                                      onBlur={null}
                                      defaultChecked={values.is_active}
                                      onChange={(e) => {
                                        setFieldValue(field.name, e.target.checked)
                                      }}
                                      type="checkbox"
                                      id="is_active"
                                      label="Kích hoạt"
                                      disabled={noEdit}
                                    />}
                                  />
                                </Col>
                              </Row>
                            </Col>
                            <Col md={6}>
                              <Row>
                                <Col xs={12}>
                                  <p className="mb-3"><b className="title_page_h1 text-primary">Thông tin SEO</b></p>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={12}>
                                  <FormGroup row>
                                    <Label for="seo_name" sm={3}>
                                      Tên SEO
                                </Label>
                                    <Col sm={9}>
                                      <Field
                                        name="seo_name"
                                        render={({ field }) => <Input
                                          {...field}
                                          type="text"
                                          placeholder=""
                                          disabled={noEdit}
                                          onBlur={this.handleSeoNameBlur}
                                        />}
                                      />
                                      <ErrorMessage name="seo_name" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={12}>
                                  <FormGroup row>
                                    <Label for="meta_keywords" sm={3}>
                                      Meta Keyword
                                </Label>
                                    <Col sm={9}>
                                      <Field
                                        name="meta_keywords"
                                        render={({ field }) => <Input
                                          {...field}
                                          type="text"
                                          placeholder=""
                                          disabled={noEdit}
                                        />}
                                      />
                                      <ErrorMessage name="meta_keywords" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>

                            </Col>
                          </Row>

                          <Row>
                            <Col sm={12} className="text-right">
                              {
                                noEdit ? (
                                  <CheckAccess permission="MD_PLANCATEGORY_EDIT">
                                    <Button color="primary" className="mr-2 btn-block-sm" onClick={() => window._$g.rdr(`/plan-category/edit/${planCategoryEnt.plan_category_id}`)}>
                                      <i className="fa fa-edit mr-1" />Chỉnh sửa
                                    </Button>
                                  </CheckAccess>
                                ) :
                                  [
                                    <CheckAccess permission={[
                                      "MD_PLANCATEGORY_EDIT",
                                      "MD_PLANCATEGORY_ADD",
                                    ]} any key={1}
                                    >
                                      <Button key="buttonSave" type="submit" color="primary" disabled={isSubmitting} onClick={() => this.handleSubmit('save')} className="mr-2 btn-block-sm"><i className="fa fa-save mr-2" /> Lưu </Button>
                                    </CheckAccess>,
                                    <CheckAccess permission={[
                                      "MD_PLANCATEGORY_EDIT",
                                      "MD_PLANCATEGORY_ADD",
                                    ]} any key={2}
                                    >
                                      <Button key="buttonSaveClose" type="submit" color="success" disabled={isSubmitting} onClick={() => this.handleSubmit('save_n_close')} className="mr-2 btn-block-sm mt-md-0 mt-sm-2"><i className="fa fa-save mr-2" />Lưu &amp; Đóng</Button>
                                    </CheckAccess>
                                  ]
                              }
                              <Button disabled={isSubmitting} onClick={() => window._$g.rdr('/plan-category')} className="btn-block-sm mt-md-0 mt-sm-2"> <i className="fa fa-times-circle mr-1" />Đóng </Button>
                            </Col>
                          </Row>
                        </Form>
                      )
                    }
                  }
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PlanCategoryAdd;