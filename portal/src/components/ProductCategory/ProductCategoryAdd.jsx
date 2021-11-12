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
  Table,
  CustomInput,
} from "reactstrap";
import { DropzoneArea } from "material-ui-dropzone";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import Loading from "../Common/Loading";
import AttributeList from "./AttributeList";
import {
  FormInput,
  FormSwitch,
  FormSelect,
  ListImage,
  ActionButton,
  UploadImage,
  FormSelectGroup,
} from "@widget";

// Model(s)
import { fnGet, fnUpdate, fnPost, fnDelete } from "@utils/api";

// Util(s)
import { mapDataOptions4Select } from "@utils/html";
import Upload from "../Common/Antd/Upload";
import "./style.scss";

/**
 * @class ProductCategoryAdd
 */
export default class ProductCategoryAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Bind method(s)
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);

    // +++
    this.state = {
      /** @var {Number} */
      _id: 0,
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
      /** @var {Array} */
      parents: [{ label: "-- Chọn --", id: "" }],
      /** @var {Array} */
      companies: [{ label: "-- Công ty --", id: "" }],
      /** @var {Array} */
      // attributes: {},
      /** @var {Array} */
      // attributesRender: [],
      /** @var {Boolean} */
      // toggleAttribute: false,
      /** @var {Boolean} */
      clearImage: false,
      /** @var {String} */
      bannerUrl: "",
    };
  }

  componentDidMount() {
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    // this.props.AttributeEnts && this.handleAdd(this.props.AttributeEnts);
    //.end
  }

  formikValidationSchema = Yup.object().shape({
    category_name: Yup.string().required("Tên danh mục là bắt buộc."),
    name_show_web: Yup.string().required("Tên hiển thị web là bắt buộc."),
    seo_name: Yup.string().required("Tên SEO là bắt buộc."),
    company_id: Yup.string().required("Công ty áp dụng là bắt buộc."),
    //  banner_url: Yup.string().required("Banner là bắt buộc."),
    // list_attribute: Yup.string().required("Thuộc tính là bắt buộc."),
    //  images_url: Yup.array().required("Hình ảnh là bắt buộc."),
  });

  handleFormikBeforeRender({ initialValues }) {
    let { values } = this.formikProps;
    if (values === initialValues) {
      return;
    }
    // Reformat data
  }

  /** @var {String} */
  _btnType = null;

  getInitialValues() {
    let { ProductCategoryEnt } = this.props;
    let values = {
      product_category_id: "",
      category_name: "",
      name_show_web: "",
      is_show_web: 1,
      seo_name: "",
      meta_descriptions: "",
      meta_keywords: "",
      banner_url: "",
      is_active: 1,
      list_attribute: "",
      parent_id: "",
      company_id: "",
      images_url: [],
    };
    if (ProductCategoryEnt) values = { ...values, ...ProductCategoryEnt };
    return values;
  }

  /**
   * Goi API, lay toan bo data lien quan,...
   */
  async _getBundleData() {
    let bundle = {};
    let all = [
      // @TODO
      fnGet({
        url: "product-category/get-options",
        query: { is_active: 1 },
      }).then((data) => {
        return (bundle["parents"] = mapDataOptions4Select(data));
      }),
      fnGet({ url: "company/get-options", query: { is_active: 1 } }).then(
        (data) => (bundle["companies"] = mapDataOptions4Select(data))
      ),
    ];
    await Promise.all(all).catch((err) =>
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => window.location.reload()
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

    let { ProductCategoryEnt } = this.props;
    if (ProductCategoryEnt && ProductCategoryEnt.banner_url) {
      bundle["bannerUrl"] = ProductCategoryEnt.banner_url;
    }

    return bundle;
  }

  handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;

    return submitForm();
  }

  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async handleFormikSubmit(values, formProps) {
    let { ProductCategoryEnt } = this.props;
    let { setSubmitting, resetForm } = formProps;

    let willRedirect = false;
    let alerts = [];

    // Build form data
    let formData = {
      ...values,
      is_active: 1 * values.is_active,
      is_show_web: 1 * values.is_show_web,
      list_attribute: [],
      category_name: this.capitalizeFirstLetter(values.category_name),
    };

    let productCategoryID =
      (ProductCategoryEnt && ProductCategoryEnt.product_category_id) || "";

    if (productCategoryID == formData.parent_id && !!formData.parent_id) {
      alerts.push({ color: "danger", msg: "Bạn không thể thiết lập danh mục" });
      setSubmitting(false);
      this.setState(
        () => ({ alerts }),
        () => {
          window.scrollTo(0, 0);
        }
      );
      return;
    }

    let { images_url } = formData;
    images_url = images_url.map((e, i) =>
      i === 0 ? { ...e, is_default: 1 } : { ...e, is_default: 0 }
    );
    formData.images_url = images_url;

    try {
      if (!!productCategoryID) {
        await fnUpdate({
          url: `product-category/${productCategoryID}`,
          body: formData,
        });
      } else {
        await fnPost({ url: "product-category", body: formData });
      }

      window._$g.toastr.show("Lưu thành công!", "success");
      if (this._btnType === "save_n_close") {
        willRedirect = true;
        return window._$g.rdr("/product-category");
      }

      // if (this._btnType === "save") {
      //   resetForm();
      // }
    } catch (e) {
      alerts.push({ color: "danger", msg: "Lưu không thành công" });
    } finally {
      setSubmitting(false);

      if (!ProductCategoryEnt && !willRedirect && !alerts.length) {
        resetForm();
        this.handleFormikReset();
      }

      this.setState(
        () => ({ alerts }),
        () => {
          window.scrollTo(0, 0);
        }
      );
    }
  }

  handleFormikReset() {
    this.setState((state) => ({
      ready: true,
      alerts: [],
      clearImage: false,
      bannerUrl: "",
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({
        ...bundle,
        ready: true,
        // attributes: {},
        // attributesRender: [],
        clearImage: false,
      });
    })();
    //.end
  }

  render() {
    let { _id, ready, alerts, parents, companies } = this.state;

    let { ProductCategoryEnt, noEdit } = this.props;
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
                  {ProductCategoryEnt
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  danh mục{" "}
                  {ProductCategoryEnt
                    ? ProductCategoryEnt.product_category_name
                    : ""}
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
                    let {
                      values,
                      handleSubmit,
                      handleReset,
                      isSubmitting,
                      errors,
                    } = (this.formikProps = window._formikProps = formikProps);
                    // Render
                    // console.log(values);
                    return (
                      <Form
                        id="form1st"
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                      >
                        <Row>
                          <Col xs={12} sm={8}>
                            <Row className="mb-4">
                              <Col xs={12}>
                                <b className="underline title_page_h1 text-primary">
                                  {" "}
                                  Thông tin danh mục
                                </b>
                              </Col>
                            </Row>
                            <Row>
                              <FormInput
                                label={"Tên danh mục"}
                                name="category_name"
                                isEdit={!noEdit}
                              />
                              <FormInput
                                label="Tên hiển thị web"
                                name="name_show_web"
                                isEdit={!noEdit}
                              />
                              <FormSelect
                                name="company_id"
                                label="Tên công ty"
                                list={companies}
                                isEdit={!noEdit}
                              />
                              <FormSelectGroup
                                name="parent_id"
                                label="Thuộc danh mục"
                                isRequired={false}
                                list={parents}
                                isEdit={!noEdit}
                              />
                              <FormInput
                                name="description"
                                label="Mô tả"
                                isRequired={false}
                                isEdit={!noEdit}
                                type="textarea"
                              />
                            </Row>
                            <Row>
                              <FormInput
                                label="Tên SEO"
                                name="seo_name"
                                isEdit={!noEdit}
                              />
                              <FormInput
                                name="meta_keywords"
                                label="Meta keyword"
                                isRequired={false}
                                isEdit={!noEdit}
                                type="textarea"
                              />
                              {/* <Col sm={12} xs={12} className="mb-4">
                                <FormGroup row>
                                  <Label sm={4}>
                                    Ảnh danh mục sản phẩm
                                  </Label>
                                  <Col xs={8} sm={8}>
                                    <ListImage
                                      canEdit={!noEdit}
                                      name="images_url"
                                      values={values.images_url}
                                      isRequired={false}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col> */}

                              <Col sm={12} xs={12}>
                                <FormGroup row>
                                  <Col sm={4}></Col>
                                  <Col sm={3} xs={12}>
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
                                  </Col>
                                  <Col sm={3} xs={12}>
                                    <Field
                                      name="is_show_web"
                                      render={({ field /* _form */ }) => (
                                        <CustomInput
                                          {...field}
                                          className="pull-left"
                                          onBlur={null}
                                          checked={values.is_show_web}
                                          onChange={(event) => {
                                            const { target } = event;
                                            field.onChange({
                                              target: {
                                                name: "is_show_web",
                                                value: target.checked,
                                              },
                                            });
                                          }}
                                          type="checkbox"
                                          id="is_show_web"
                                          label="Hiển thị Web"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>

                          {/* Upload image */}
                          <Col xs={12} sm={4}>
                            <Row className="mb-4">
                              <Col xs={12}>
                                <b className="underline title_page_h1 text-primary">
                                  Ảnh banner danh mục
                                </b>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={10}>
                                <Field
                                  name="banner_url"
                                  render={({ field /* _form */ }) => (
                                    <div className="combo-image-upload">
                                      <Upload
                                        onChange={(img) => {
                                          field.onChange({
                                            target: {
                                              name: "banner_url",
                                              value: img,
                                            },
                                          });
                                        }}
                                        imageUrl={values.banner_url}
                                        accept="image/*"
                                        disabled={noEdit}
                                        id={1}
                                        label="Thêm ảnh"
                                      />
                                    </div>

                                    // <CustomInput
                                    //   {...field}
                                    //   className="pull-left"
                                    //   onBlur={null}
                                    //   checked={values.is_show_web}
                                    //   onChange={(event) => {
                                    //     const { target } = event;
                                    //     field.onChange({
                                    //       target: {
                                    //         name: "is_show_web",
                                    //         value: target.checked,
                                    //       },
                                    //     });
                                    //   }}
                                    //   type="checkbox"
                                    //   id="is_show_web"
                                    //   label="Hiển thị Web"
                                    //   disabled={noEdit}
                                    // />
                                  )}
                                />

                                {/* <UploadImage
                                  urlImageEdit={this.state.bannerUrl}
                                  clearImage={this.state.clearImage}
                                  isEdit={!noEdit}
                                  name="banner_url"
                                  title="Ảnh banner danh mục"
                                  style={{ paddingLeft: 0, paddingRight: 0 }}
                                  isRequired={false}
                                /> */}
                              </Col>
                              {/* <Col xs={12}>
                                <ListImage
                                  title="Ảnh danh mục sản phẩm"
                                  canEdit={!noEdit}
                                  name="images_url"
                                  values={initialValues.images_url}
                                />
                              </Col> */}
                            </Row>
                          </Col>
                        </Row>

                        <ActionButton
                          isSubmitting={isSubmitting}
                          buttonList={[
                            {
                              title: "Chỉnh sửa",
                              color: "primary",
                              isShow: noEdit,
                              icon: "edit",
                              permission: "MD_PRODUCTCATEGORY_EDIT",
                              onClick: () =>
                                window._$g.rdr(
                                  ProductCategoryEnt
                                    ? `/product-category/edit/${ProductCategoryEnt.product_category_id}`
                                    : ""
                                ),
                            },
                            {
                              title: "Lưu",
                              color: "primary",
                              isShow: !noEdit,
                              icon: "save",
                              permission: [
                                "MD_PRODUCTCATEGORY_EDIT",
                                "MD_PRODUCTCATEGORY_ADD",
                              ],
                              onClick: () => this.handleSubmit("save"),
                            },
                            {
                              title: "Lưu và đóng",
                              color: "success",
                              isShow: !noEdit,
                              icon: "save",
                              permission: [
                                "MD_PRODUCTCATEGORY_EDIT",
                                "MD_PRODUCTCATEGORY_ADD",
                              ],
                              onClick: () => this.handleSubmit("save_n_close"),
                            },
                            {
                              title: "Đóng",
                              icon: "times-circle",
                              isShow: true,
                              notSubmit: true,
                              onClick: () =>
                                window._$g.rdr("/product-category"),
                            },
                          ]}
                        />
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
