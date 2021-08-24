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
import { FormSelectGroup } from "@widget";
import "./styles.scss";

// Model(s)
import NewsCategoryModel from "../../models/NewsCategoryModel";

// Util(s)
import { mapDataOptions4Select } from "../../utils/html";

/**
 * @class NewsCategoryAdd
 */
export default class NewsCategoryAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._newsCategoryModel = new NewsCategoryModel();
    // Bind method(s)
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);
    this.handleFormikValidate = this.handleFormikValidate.bind(this);
    // +++
    this.state = {
      /** @var {Number} */
      _id: 0,
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
      /** @var {Boolean} */
      clearImage: false,
      /** @var {String} */
      urlImageEdit: "",
      /** @var {Number} */
      /** @var {Array} */
      parent_list: null,
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

  formikValidationSchema = Yup.object().shape({
    news_category_name: Yup.string().required("Tên chuyên mục là bắt buộc."),
    // order_index: Yup.number().integer().min(1).required("Thứ tự hiển thị là bắt buộc."),
  });
  /** @var {String} */
  _btnType = null;

  getInitialValues() {
    let { NewsCategoryEnt } = this.props;
    let values = Object.assign({}, this._newsCategoryModel.fillable());
    if (NewsCategoryEnt) {
      Object.assign(values, NewsCategoryEnt);
    }
    // Format
    Object.keys(values).forEach((key) => {
      if (null === values[key]) {
        values[key] = "";
      }
    });
    // Return;
    return values;
  }

  /**
   * Goi API, lay toan bo data lien quan,...
   */
  async _getBundleData() {
    const { NewsCategoryEnt } = this.props;
    let bundle = {};
    let all = [
      this._newsCategoryModel
        .getOptions({
          exclude_id: NewsCategoryEnt ? NewsCategoryEnt.news_category_id : null,
        })
        .then((data) => {
          return (bundle["parent_list"] = mapDataOptions4Select(data));
        }),
    ];

    await Promise.all(all).catch((err) =>
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => window.location.reload()
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

  handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;
    window.scrollTo(0, 0);
    return submitForm();
  }

  handleFormikValidate(values) {
    // Trim string values,...
    Object.keys(values).forEach((prop) => {
      typeof values[prop] === "string" && (values[prop] = values[prop].trim());
    });
    //.end
  }

  handleFormikSubmit(values, formProps) {
    let { NewsCategoryEnt } = this.props;
    let { setSubmitting, resetForm } = formProps;

    let willRedirect = false;
    console.log("values", values);
    let alerts = [];
    // Build form data
    let formData = Object.assign({}, values, {
      is_active: 1 * values.is_active || 0,
      // is_author_post: 1 * values.is_author_post || 0,
      is_system: 1 * values.is_system || 0,
      // is_cate_video: 1 * values.is_cate_video || 0,
    });
    console.log(
      "🚀 ~ file: NewsCategoryAdd.jsx ~ line 159 ~ NewsCategoryAdd ~ handleFormikSubmit ~ formData",
      formData
    );

    //return false;
    let newsCategoryID =
      (NewsCategoryEnt && NewsCategoryEnt.news_category_id) ||
      formData[this._newsCategoryModel];
    let apiCall = newsCategoryID
      ? this._newsCategoryModel.update(newsCategoryID, formData)
      : this._newsCategoryModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/news-category");
        }

        if (this._btnType === "save" && !newsCategoryID) {
          resetForm();
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
        if (!NewsCategoryEnt && !willRedirect && !alerts.length) {
          this.handleFormikReset();
        }

        this.setState(
          () => ({ alerts }),
          () => {
            window.scrollTo(0, 0);
          }
        );
      });
  }

  handleFormikReset() {
    this.setState((state) => ({
      _id: 1 + state._id,
      ready: true,
      alerts: [],
      clearImage: false,
      parent_list: [],
    }));

    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true, clearImage: false });
    })();
    // .end
  }

  render() {
    let { _id, ready, alerts, parent_list } = this.state;
    let { NewsCategoryEnt, noEdit } = this.props;
    let initialValues = this.getInitialValues();
    // Ready?
    if (!ready) {
      return <Loading />;
    }

    return (
      <div key={`view-${_id}`} className="animated fadeIn">
        <Row className="d-flex justify-content-center">
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {NewsCategoryEnt
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  chuyên mục tin tức{" "}
                  {NewsCategoryEnt ? NewsCategoryEnt.news_category_name : ""}
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
                  validate={this.handleFormikValidate}
                  onSubmit={this.handleFormikSubmit}
                >
                  {(formikProps) => {
                    let { values, handleSubmit, handleReset, isSubmitting } =
                      (this.formikProps =
                      window._formikProps =
                        formikProps);
                    // Render
                    return (
                      <Form
                        id="form1st"
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                      >
                        <Row className="d-flex justify-content-center">
                          <Col xs={12}>
                            <Row className="mb-4">
                              <Col xs={12}>
                                <b className="title_page_h1 text-primary underline">
                                  Thông tin chuyên mục
                                </b>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={12}>
                                <Row>
                                  <Col xs={12} sm={6}>
                                    <FormGroup row>
                                      <Label for="news_category_name" sm={4}>
                                        Tên chuyên mục
                                        <span className="font-weight-bold red-text">
                                          *
                                        </span>
                                      </Label>
                                      <Col sm={8}>
                                        <Field
                                          name="news_category_name"
                                          render={({ field }) => (
                                            <Input
                                              {...field}
                                              type="text"
                                              placeholder=""
                                              disabled={noEdit}
                                            />
                                          )}
                                        />
                                        <ErrorMessage
                                          name="news_category_name"
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
                                  <FormSelectGroup
                                    name="parent_id"
                                    label="Chuyên mục cha"
                                    isRequired={false}
                                    sm={6}
                                    list={parent_list}
                                    isEdit={!noEdit}
                                    colSmLabel={2}
                                    conSmSelect={10}
                                    isClearable={true}
                                    placeHolder={"-- Chọn --"}
                                  />
                                  <Col xs={12} sm={12}>
                                    <Row>
                                      <Col xs={12}>
                                        <FormGroup row>
                                          <Label for="order_index" sm={2}>
                                            Thứ tự hiển thị
                                          </Label>
                                          <Col sm={4}>
                                            <Field
                                              name="order_index"
                                              render={({
                                                field /* _form */,
                                              }) => (
                                                <Input
                                                  {...field}
                                                  className="text-right"
                                                  onBlur={null}
                                                  type="number"
                                                  id="order_index"
                                                  disabled={noEdit}
                                                  min="1"
                                                />
                                              )}
                                            />
                                            {/* <ErrorMessage
                                              name="order_index"
                                              component={({ children }) => (
                                                <Alert
                                                  color="danger"
                                                  className="field-validation-error"
                                                >
                                                  {children}
                                                </Alert>
                                              )}
                                            /> */}
                                          </Col>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col xs={12} sm={12}>
                                    <Row>
                                      <Col xs={12}>
                                        <FormGroup row>
                                          <Label for="description" sm={2}>
                                            Mô tả
                                          </Label>
                                          <Col sm={10}>
                                            <Field
                                              name="description"
                                              render={({
                                                field /* _form */,
                                              }) => (
                                                <Input
                                                  {...field}
                                                  onBlur={null}
                                                  type="textarea"
                                                  id="description"
                                                  disabled={noEdit}
                                                />
                                              )}
                                            />
                                          </Col>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                                <Row className="mb-4">
                                  <Col xs={12}>
                                    <b className="title_page_h1 text-primary underline">
                                      Thông tin SEO
                                    </b>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs={12} sm={6}>
                                    <FormGroup row>
                                      <Label for="meta_key_words" sm={4}>
                                        Từ khóa mô tả
                                      </Label>
                                      <Col sm={8}>
                                        <Field
                                          name="meta_key_words"
                                          render={({ field }) => (
                                            <Input
                                              {...field}
                                              onBlur={null}
                                              type="text"
                                              placeholder=""
                                              disabled={noEdit}
                                            />
                                          )}
                                        />
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                  <Col xs={12} sm={6}>
                                    <FormGroup row>
                                      <Label for="seo_name" sm={4}>
                                        Tên trang tối ưu cho SEO
                                      </Label>
                                      <Col sm={8}>
                                        <Field
                                          name="seo_name"
                                          render={({ field }) => (
                                            <Input
                                              {...field}
                                              onBlur={null}
                                              type="text"
                                              placeholder=""
                                              disabled={noEdit}
                                            />
                                          )}
                                        />
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                  <Col sm={12}>
                                    <FormGroup row>
                                      <Label sm={2}></Label>
                                      <Col sm={4}>
                                        <Field
                                          name="is_show_with_parent"
                                          render={({ field }) => (
                                            <CustomInput
                                              {...field}
                                              className="pull-left"
                                              onBlur={null}
                                              checked={
                                                values.is_show_with_parent
                                              }
                                              onChange={(event) => {
                                                const { target } = event;
                                                field.onChange({
                                                  target: {
                                                    name: field.name,
                                                    value: target.checked,
                                                  },
                                                });
                                              }}
                                              type="checkbox"
                                              id="is_show_with_parent"
                                              label="Hiển thị cùng với chuyên mục cha"
                                              disabled={noEdit}
                                            />
                                          )}
                                        />
                                      </Col>
                                      <Col sm={4}>
                                        <Field
                                          name="is_show_home"
                                          render={({ field }) => (
                                            <CustomInput
                                              {...field}
                                              className="pull-left"
                                              onBlur={null}
                                              checked={values.is_show_home}
                                              type="checkbox"
                                              id="is_show_home"
                                              onChange={(event) => {
                                                const { target } = event;
                                                field.onChange({
                                                  target: {
                                                    name: field.name,
                                                    value: target.checked,
                                                  },
                                                });
                                              }}
                                              label="Hiển thị trang chủ"
                                              disabled={noEdit}
                                            />
                                          )}
                                        />
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                  <Col sm={12}>
                                    <FormGroup row>
                                      <Label for="is_active" sm={2}></Label>
                                      <Col sm={4}>
                                        <Field
                                          name="is_active"
                                          render={({ field }) => (
                                            <CustomInput
                                              {...field}
                                              className="pull-left"
                                              onBlur={null}
                                              checked={values.is_active}
                                              type="checkbox"
                                              id="is_active"
                                              onChange={(event) => {
                                                const { target } = event;
                                                field.onChange({
                                                  target: {
                                                    name: field.name,
                                                    value: target.checked,
                                                  },
                                                });
                                              }}
                                              label="Kích hoạt"
                                              disabled={noEdit}
                                            />
                                          )}
                                        />
                                      </Col>
                                      {/* <Col sm={4}>
                                        <Field
                                          name="is_author_post"
                                          render={({ field }) => (
                                            <CustomInput
                                              {...field}
                                              className="pull-left"
                                              onBlur={null}
                                              checked={values.is_author_post}
                                              type="checkbox"
                                              id="is_author_post"
                                              label="Dành cho tác giả"
                                              disabled={noEdit}
                                            />
                                          )}
                                        />
                                      </Col> */}
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12} className="text-right">
                                {noEdit ? (
                                  <CheckAccess permission="NEWS_NEWSCATEGORY_EDIT">
                                    <Button
                                      color="primary"
                                      className="mr-2 btn-block-sm"
                                      onClick={() =>
                                        window._$g.rdr(
                                          `/news-category/edit/${NewsCategoryEnt.news_category_id}`
                                        )
                                      }
                                    >
                                      {" "}
                                      <i className="fa fa-edit mr-1" /> Chỉnh
                                      sửa{" "}
                                    </Button>
                                  </CheckAccess>
                                ) : (
                                  [
                                    <CheckAccess
                                      permission={[
                                        "NEWS_NEWSCATEGORY_EDIT",
                                        "NEWS_NEWSCATEGORY_ADD",
                                      ]}
                                      any
                                      key={1}
                                    >
                                      <Button
                                        key="buttonSave"
                                        type="submit"
                                        color="primary"
                                        disabled={isSubmitting}
                                        onClick={() =>
                                          this.handleSubmit("save")
                                        }
                                        className="mr-2 btn-block-sm"
                                      >
                                        <i className="fa fa-save mr-2" /> Lưu{" "}
                                      </Button>
                                    </CheckAccess>,
                                    <CheckAccess
                                      permission={[
                                        "NEWS_NEWSCATEGORY_EDIT",
                                        "NEWS_NEWSCATEGORY_ADD",
                                      ]}
                                      any
                                      key={2}
                                    >
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
                                      </Button>
                                    </CheckAccess>,
                                  ]
                                )}
                                <Button
                                  disabled={isSubmitting}
                                  onClick={() =>
                                    window._$g.rdr("/news-category")
                                  }
                                  className="btn-block-sm mt-md-0 mt-sm-2"
                                >
                                  {" "}
                                  <i className="fa fa-times-circle mr-1" />
                                  Đóng{" "}
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
