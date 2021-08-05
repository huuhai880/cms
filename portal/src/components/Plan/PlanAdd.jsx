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
import Select from "react-select";
import { Editor } from '@tinymce/tinymce-react';

// Component(s)
import { CheckAccess } from '../../navigation/VerifyAccess'
import Loading from '../Common/Loading';
import { mapDataOptions4Select, changeToSlug } from '../../utils/html';

// Util(s)
import { readFileAsBase64, readImageAsBase64 } from '../../utils/html';
// Model(s)
import PlanModel from "../../models/PlanModel";
import PlanCategoryModel from '../../models/PlanCategoryModel';
import { DropzoneArea } from 'material-ui-dropzone'

// Assets
import './styles.scss'

export default class PlanAdd extends PureComponent {
  formikProps = null;

  constructor(props) {
    super(props);

    this._planModel = new PlanModel();
    this._planCategoryModel = new PlanCategoryModel();

    this.handleFormikBeforeRender = this.handleFormikBeforeRender.bind(this);
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);

    let { planEnt } = props;

    this.state = {

      _id: 0,
      alerts: [],
      ready: false,
      planData: null,
      planCategoryOptions: null,
      clearPlanImage: true,
      imageUrlEdit: null
    };

    this.formikValidationSchema = Yup.object().shape({
      plan_title: Yup.string().trim()
        .required("Tên dự án là bắt buộc.")
        .max(200, 'Tên dự án không được nhiều hơn 200 ký tự'),
      plan_category_id: Yup.number()
        .required('Thuộc dự án là bắt buộc.'),
      description: Yup.string()
        .max(2000, 'Mô tả ngắn không được nhiều hơn 2000 ký tự'),
      seo_name: Yup.string()
        .max(200, 'Tiêu đề SEO không được nhiều hơn 200 ký tự'),
      meta_keywords: Yup.string()
        .max(200, 'Meta keyword không được nhiều hơn 200 ký tự')
    });
  }

  componentDidMount() {
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true, clearPlanImage: false });
    })();
    document.querySelector('body').classList.remove('tox-fullscreen');
  }

  getInitialValues() {
    let { planEnt } = this.props;
    let { planData = {} } = this.state;
    let values = Object.assign(
      {}, this._planModel.fillable(),
      planData
    );
    if (planEnt) {
      Object.assign(values, planEnt);
    }
    Object.keys(values).forEach(key => {
      if (null === values[key]) {
        values[key] = "";
      }
    });
    return values;
  }

  async _getBundleData() {
    let { planEnt } = this.props;
    let bundle = {};
    let all = [
      this._planCategoryModel.getOptionParentList({ is_active: 1 })
        .then(data => (bundle['planCategoryOptions'] = mapDataOptions4Select(data))),
    ];
    await Promise.all(all)
      .catch(err => window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => window.location.reload()
      ))
      ;

    if (planEnt && planEnt.image_url) {
      bundle["imageUrlEdit"] = planEnt.image_url;
    }

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


  handleRemovePlanImage = (idx = 0) => {
    let { values, setValues } = this.formikProps;
    let image_url = null;
    setValues(Object.assign(values, { "image_url": image_url }));
    this.setState({ imageUrlEdit: image_url })
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
    let { planEnt } = this.props;
    let { setSubmitting } = formProps;
    let willRedirect = false;
    let alerts = [];

    let formData = Object.assign({}, values, {
      //
    });

    let planId = planEnt ? planEnt.plan_id : undefined;
    let apiCall = planEnt
      ? this._planModel.update(planId, formData)
      : this._planModel.create(formData)
      ;
    apiCall
      .then(data => {
        window._$g.toastr.show('Lưu thành công!', 'success');
        if (this._btnType === 'save_n_close') {
          willRedirect = true;
          return window._$g.rdr('/plan');
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
        if (!planEnt && !willRedirect && !alerts.length) {
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
      // planCategoryOptions: [],
      clearPlanImage: true
    }));
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true, clearPlanImage: false });
    })();
  }

  onDropImage(files, field) {
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = (event) => {
      field.onChange({
        target: { type: "text", name: field.name, value: event.target.result }
      })
    };
  }

  handleUploadImage = async (blobInfo, success, failure) => {
    readImageAsBase64(blobInfo.blob(), async (imageUrl) => {
      try {
        const imageUpload = await this._planModel.upload({
          base64: imageUrl,
          folder: 'files',
          includeCdn: true
        });
        success(imageUpload);
      } catch (error) {
        failure(error);
      }
    });
  };

  handleSeoNameBlur = (e) => {
    let { setFieldValue } = this.formikProps;
    let formatedValue = changeToSlug(e.target.value)
    setFieldValue('seo_name', formatedValue)
  }

  render() {
    let {
      _id,
      ready,
      alerts,
      planCategoryOptions = [],
    } = this.state;
    let { planEnt, noEdit } = this.props;
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
                <b>{planEnt ? (noEdit ? 'Chi tiết' : 'Chỉnh sửa') : 'Thêm mới'} dự án {planEnt ? planEnt.full_name : ''}</b>
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
                            <Col lg={8}>
                              <Row>
                                <Col sx={12}>
                                  <p className="mb-3"><b className="title_page_h1 text-primary">Thông tin dự án</b></p>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={12}>
                                  <FormGroup row >
                                    <Label for="plan_title" sm={3}>
                                      Tên dự án<span className="font-weight-bold red-text">*</span>
                                    </Label>
                                    <Col sm={9}>
                                      <InputGroup>
                                        <Field
                                          name="plan_title"
                                          render={({ field /* _form */ }) => <Input
                                            {...field}
                                            onBlur={null}
                                            type={`text`}
                                            name="plan_title"
                                            id="plan_titile"
                                            disabled={noEdit}
                                          />}
                                        />
                                      </InputGroup>
                                      <ErrorMessage name="plan_title" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={12}>
                                  <FormGroup row>
                                    <Label for="plan_category_id" sm={3}>
                                      Thuộc dự án<span className="font-weight-bold red-text">*</span>
                                    </Label>
                                    <Col sm={9}>
                                      <Field
                                        name="plan_category_id"
                                        render={({ field }) => {

                                          let defaultValue = planCategoryOptions.find(({ value }) => {
                                            return 1 * value === 1 * field.value
                                          })
                                          return (
                                            <Select
                                              {...field}
                                              className="MuiPaper-filter__custom--select"
                                              id="plan_category_id"
                                              name="plan_category_id"
                                              // isMulti
                                              isSearchable={true}
                                              // isClearable
                                              value={defaultValue}
                                              placeholder={"-- Chọn --"}
                                              options={planCategoryOptions}
                                              onChange={value => field.onChange({ target: { name: field.name, value: value.value } })}
                                              menuPortalTarget={document.querySelector('body')}
                                              isDisabled={noEdit}
                                            />
                                          )
                                        }
                                        }
                                      />
                                      <ErrorMessage name="plan_category_id" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Row>
                                <Col xs={12}>
                                  <FormGroup row>
                                    <Label for="description" sm={3}>
                                      Mô tả ngắn
                                </Label>
                                    <Col sm={9}>
                                      <Field
                                        name="description"
                                        render={({ field /* _form */ }) => <Input
                                          {...field}
                                          onBlur={null}
                                          type="textarea"
                                          name="description"
                                          id="description"
                                          disabled={noEdit}
                                          rows={4}
                                        />}
                                      />
                                      <ErrorMessage name="description" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Col>
                            <Col lg={4}>
                              <Row>
                                <Col xs={12}>
                                  <FormGroup row>
                                    <Label for="image_url" xs={12} className="text-center">
                                      <span>Ảnh dự án</span>
                                    </Label>
                                    <Col xs={12}>
                                      {
                                        !this.state.clearPlanImage &&
                                        <Field
                                          name="image_url"
                                          render={({ field }) => {
                                            if (this.state.imageUrlEdit) {
                                              return <div className="tl-render-image">
                                                <img src={this.state.imageUrlEdit} alt="images" />
                                                {
                                                  !noEdit ?
                                                    <button
                                                      onClick={() => this.handleRemovePlanImage()}
                                                    >
                                                      <i className="fa fa-trash" aria-hidden="true"></i>
                                                    </button>
                                                    : null
                                                }
                                              </div>
                                            }

                                            return <div className="tl-drop-image">
                                              <DropzoneArea
                                                {...field}
                                                id="image_url"
                                                acceptedFiles={['image/*']}
                                                filesLimit={1}
                                                dropzoneText=""
                                                disabled={noEdit}
                                                onDrop={(files) => this.onDropImage(files, field)}
                                                onDelete={() => field.onChange({
                                                  target: { type: "text", name: field.name, value: "" }
                                                })}
                                              >
                                              </DropzoneArea>
                                            </div>
                                          }}
                                        />
                                      }
                                    </Col>
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={12}>
                              <FormGroup row>
                                <Label for="attribute_content" xs={2}>
                                  Thuộc tính dự án
                                </Label>
                                <Col xs={10}>
                                  <Editor
                                    apiKey={
                                      "3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"
                                    }
                                    scriptLoading={{ delay: 500 }}
                                    value={values.attribute_content}
                                    disabled={noEdit}
                                    init={{
                                      height: '300px',
                                      width: "100%",
                                      menubar: false,
                                      // plugins: [
                                      //   'lists link image paste help wordcount fullscreen',
                                      //   "image imagetools ",
                                      //  ],
                                      //  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | link | fullscreen',
                                      plugins: [
                                        "advlist autolink fullscreen lists link image charmap print preview anchor",
                                        "searchreplace visualblocks code fullscreen ",
                                        "insertdatetime media table paste code help wordcount",
                                        "image imagetools ",
                                      ],
                                      menubar:
                                        "file edit view insert format tools table tc help",
                                      toolbar1:
                                        "undo redo | fullscreen | fontselect fontsizeselect formatselect | bold italic forecolor backcolor | \n" +
                                        "alignleft aligncenter alignright alignjustify",
                                      toolbar2:
                                        "bullist numlist outdent indent | removeformat | help | image",
                                      file_picker_types: "image",
                                      images_dataimg_filter: function (img) {
                                        return img.hasAttribute("internal-blob");
                                      },
                                      images_upload_handler: this.handleUploadImage,
                                    }}
                                    onEditorChange={(newValue) => {
                                      formikProps.setFieldValue(
                                        "attribute_content",
                                        newValue
                                      );
                                    }}
                                  />
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row className='mt-3'>
                            <Col sm={12}>
                              <FormGroup row>
                                <Label for="content" xs={2}>
                                  Nội dung dự án
                                </Label>
                                <Col xs={10}>
                                  <Editor
                                    apiKey={
                                      "3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"
                                    }
                                    scriptLoading={{ delay: 500 }}
                                    value={values.content}
                                    disabled={noEdit}
                                    init={{
                                      height: '300px',
                                      width: "100%",
                                      menubar: false,
                                      // plugins: [
                                      //   'lists link image paste help wordcount fullscreen',
                                      //   "image imagetools ",
                                      //  ],
                                      //  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | link | fullscreen',
                                      plugins: [
                                        "advlist autolink fullscreen lists link image charmap print preview anchor",
                                        "searchreplace visualblocks code fullscreen ",
                                        "insertdatetime media table paste code help wordcount",
                                        "image imagetools ",
                                      ],
                                      menubar:
                                        "file edit view insert format tools table tc help",
                                      toolbar1:
                                        "undo redo | fullscreen | fontselect fontsizeselect formatselect | bold italic forecolor backcolor | \n" +
                                        "alignleft aligncenter alignright alignjustify",
                                      toolbar2:
                                        "bullist numlist outdent indent | removeformat | help | image",
                                      file_picker_types: "image",
                                      images_dataimg_filter: function (img) {
                                        return img.hasAttribute("internal-blob");
                                      },
                                      images_upload_handler: this.handleUploadImage,
                                    }}
                                    onEditorChange={(newValue) => {
                                      formikProps.setFieldValue(
                                        "content",
                                        newValue
                                      );
                                    }}
                                  />
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row className="mt-3">
                            <Col sx={12}>
                              <p className="mb-3"><b className="title_page_h1 text-primary">Thông tin SEO</b></p>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12}>
                              <FormGroup row >
                                <Label for="seo_name" sm={2}>
                                  Tên SEO
                                </Label>
                                <Col sm={10}>
                                  <InputGroup>
                                    <Field
                                      name="seo_name"
                                      render={({ field /* _form */ }) => <Input
                                        {...field}
                                        onBlur={null}
                                        type={`text`}
                                        name="seo_name"
                                        id="plan_titile"
                                        disabled={noEdit}
                                        onBlur={this.handleSeoNameBlur}
                                      />}
                                    />
                                  </InputGroup>
                                  <ErrorMessage name="seo_name" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12}>
                              <FormGroup row >
                                <Label for="meta_keywords" sm={2}>
                                  Meta Keyword
                                </Label>
                                <Col sm={10}>
                                  <InputGroup>
                                    <Field
                                      name="meta_keywords"
                                      render={({ field /* _form */ }) => <Input
                                        {...field}
                                        onBlur={null}
                                        type={`text`}
                                        name="meta_keywords"
                                        id="plan_titile"
                                        disabled={noEdit}
                                      />}
                                    />
                                  </InputGroup>
                                  <ErrorMessage name="meta_keywords" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12}>
                              <FormGroup row>
                                <Label for="is_active" sm={2}></Label>
                                <Col sm={10}>
                                  <Field
                                    name="is_active"
                                    render={({ field }) => <CustomInput
                                      {...field}
                                      className="pull-left mx-auto"
                                      onBlur={null}
                                      defaultChecked={values.is_active}
                                      onChange={(e) => {
                                        formikProps.setFieldValue(field.name, e.target.checked)
                                      }}
                                      type="checkbox"
                                      id="is_active"
                                      label="Kích hoạt"
                                      disabled={noEdit}
                                    />}
                                  />
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm={12} className="text-right">
                              {
                                noEdit ? (
                                  <CheckAccess permission="MD_PLAN_EDIT">
                                    <Button color="primary" className="mr-2 btn-block-sm" onClick={() => window._$g.rdr(`/plan/edit/${planEnt.plan_id}`)}>
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
                              }
                              <Button disabled={isSubmitting} onClick={() => window._$g.rdr('/plan')} className="btn-block-sm mt-md-0 mt-sm-2">
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
