import React, { Component } from "react";
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
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  Table,
} from "reactstrap";
import QRCode from "react-qr-code";
import Select from "react-select";
import moment from "moment";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import { Editor } from "@tinymce/tinymce-react";

// Assets
import "../Products/styles.scss";
// Component(s)
import Loading from "../Common/Loading";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { FormSelectGroup, DateTimePicker } from "@widget";
import urlFriendly from "@utils/urlFriendly";
import News from "./News";
// Util(s)
import {
  mapDataOptions4Select,
  readFileAsBase64,
  readImageAsBase64,
} from "../../utils/html";
// Model(s)
import NewsModel from "../../models/NewsModel";
import NewsCategoryModel from "../../models/NewsCategoryModel";
import AuthorModel from "../../models/AuthorModel";
import ProductModel from "../../models/ProductModel";
import PublishingCompanyModel from "../../models/PublishingCompanyModel";
import { fnUpdate } from "@utils/api";
import { FormInput } from "@widget";

import "./styles.scss";
import { fnGet } from "@utils/api";

/** @var {Object} */
const userAuth = window._$g.userAuth;

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * @class NewsAdd
 */
export default class NewsAdd extends Component {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);
    this.reviewNote = React.createRef();

    // Init model(s)
    this._newsModel = new NewsModel();
    this._newsCategoryModel = new NewsCategoryModel();
    this._authorModel = new AuthorModel();
    this._productModel = new ProductModel();
    this._publishingCompanyModel = new PublishingCompanyModel();

    this.handleUserImageChange = this.handleUserImageChange.bind(this);
    this.handleFormikBeforeRender = this.handleFormikBeforeRender.bind(this);
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);
    this.handleFormikValidate = this.handleFormikValidate.bind(this);

    this.btnSave = React.createRef();

    // Init state
    // +++
    let { NewsEnt } = props;
    // let {} = NewsEnt || {};
    // +++
    this.state = {
      /** @var {Number} */
      _id: 0,
      /** @var {Array} */
      alerts: [],
      /** @var {String|null} */
      usrImgBase64: (NewsEnt && NewsEnt.defaultPictureUrl()) || null,
      /** @var {Boolean} */
      ready: false,
      /** @var {Object|null} */
      userData: null,
      /** @var {Object} */
      newsCategoryOtps: [{ label: "-- Chọn --", value: "" }],
      /** @var {Object} */
      authorOpts: [{ label: "-- Chọn --", value: "" }],
      /** @var {Object} */
      productOpts: [{ label: "-- Chọn --", value: "" }],
      /** @var {Object} */
      publishsingCompanyOpts: [{ label: "-- Chọn --", value: "" }],
      /** @var {String} */
      seo_name: "",
      news_date: "",
      isQrCode: false,
      isOpenReview: false,
      currentItem: {},
      isRequireNote: false,
      activeTab: "INFO",
      isOpenNewsList: false,
    };
  }

  formikValidationSchema = Yup.object().shape({
    news_title: Yup.string().trim().required("Tiêu đề tin tức là bắt buộc."),
    image_url: Yup.string().required("Hình ảnh là bắt buộc."),
    content: Yup.string().required("Nội dung là bắt buộc."),
  });

  componentDidMount() {
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    //.end
    let { NewsEnt } = this.props;
    if (NewsEnt && NewsEnt.is_qrcode) {
      this.setState({ isQrCode: NewsEnt.is_qrcode });
    }
  }

  getInitialValues() {
    let { NewsEnt, modalData, isModal } = this.props;
    let values = Object.assign({}, this._newsModel.fillable());

    if (NewsEnt) {
      Object.assign(values, NewsEnt);
    }

    // Format
    Object.keys(values).forEach((key) => {
      if (null === values[key]) {
        values[key] = "";
      }
    });

    if (isModal) {
      const modal = modalData();
      // values.is_qrcode = 1;
      const { product_id, author_id, publishing_company_id } = modal;
      // if (product_id) values.product_id = product_id;
      if (author_id) values.author_id = author_id;
      if (publishing_company_id)
        values.publishing_company_id = publishing_company_id;
    }
    // Return;
    return values;
  }

  async _getBundleData() {
    let bundle = {};
    let all = [
      // @TODO
      this._newsCategoryModel
        .getOptionsForCreate({ is_active: 1 })
        .then(
          (data) => (bundle["newsCategoryOpts"] = mapDataOptions4Select(data))
        ),
      this._authorModel
        .getOptions({ is_active: 1 })
        .then((data) => (bundle["authorOpts"] = mapDataOptions4Select(data))),
      // this._productModel
      //   .getOptions({ is_active: 1 })
      //   .then((data) => (bundle["productOpts"] = mapDataOptions4Select(data))),
      this._publishingCompanyModel
        .getOptions({ is_active: 1 })
        .then(
          (data) =>
            (bundle["publishsingCompanyOpts"] = mapDataOptions4Select(data))
        ),
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

  handleUserImageChange(event) {
    let { target } = event;
    const { setFieldValue } = this.formikProps;
    if (target.files[0]) {
      readFileAsBase64(target, {
        // option: validate input
        validate: (file) => {
          // Check file's type
          if ("type" in file) {
            if (file.type.indexOf("image/") !== 0) {
              return "Chỉ được phép sử dụng tập tin ảnh.";
            }
          }
          // Check file's size in bytes
          if ("size" in file) {
            let maxSize = 4; /*4mb*/
            if (file.size / 1024 / 1024 > maxSize) {
              return `Dung lượng tập tin tối đa là: ${maxSize}mb.`;
            }
          }
        },
      })
        .then((usrImgBase64) => {
          this.setState({ usrImgBase64: usrImgBase64[0] });
          setFieldValue("image_url", usrImgBase64[0]);
        })
        .catch((err) => {
          window._$g.dialogs.alert(window._$g._(err.message));
        });
    }
  }

  handleSeoNameChange(event) {
    let { target } = event;
    let seoname = target.value || "";
    this.setState({ seo_name: seoname });
  }

  updateURLNews = (item, seoName) => {
    if (seoName.length == 0) {
      let news_name_change = item.target.value
        ? this.ChangeAlias(item.target.value)
        : "";
      this.setState({ seo_name: news_name_change });
    }
  };

  ChangeAlias = (val) => {
    var str = val;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );
    str = str.replace(/ + /g, "-");
    str = str.replace(/[ ]/g, "-");
    str = str.trim();
    return str;
  };

  // handleChangeQrCode = (event) => {
  //   const { setFieldValue } = this.formikProps;
  //   this.setState({ isQrCode: event.target.checked });
  //   setFieldValue("is_qrcode", event.target.checked);
  //   setFieldValue("news_category_id", "");
  // };

  handleFormikBeforeRender({ initialValues }) {
    let { values } = this.formikProps;
    if (values === initialValues) {
      return;
    }
    // Reformat data
    let province_id = values.country_id ? values.province_id : "";
    let district_id = province_id ? values.district_id : "";
    let ward_id = district_id ? values.ward_id : "";
    // +++
    Object.assign(values, {
      // +++ address
      province_id,
      district_id,
      ward_id,
    });
  }

  /** @var {String} */
  _btnType = null;

  handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;
    return submitForm();
  }

  handleFormikSubmit(values, formProps) {
    let { NewsEnt, isModal, handleToggleAddQr } = this.props;
    let { usrImgBase64, seo_name } = this.state;
    let { setSubmitting } = formProps;
    let willRedirect = false;
    let alerts = [];
    // Build form data
    // +++
    let today = new Date();
    let { news_date } = values;
    let newsDate = news_date
      ? moment(news_date, "DD/MM/YYYY HH:mm", true).isValid()
        ? moment(news_date, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm")
        : moment(news_date, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD HH:mm")
      : "";
    let formData = Object.assign({}, values, {
      image_url: usrImgBase64,
      is_video: values.is_video == true ? 1 : 0,
      is_show_home: values.is_show_home == true ? 1 : 0,
      is_high_light: values.is_high_light == true ? 1 : 0,
      is_show_notify: values.is_show_notify == true ? 1 : 0,
      is_hot_news: values.is_hot_news == true ? 1 : 0,
      is_system: values.is_system == true ? 1 : 0,
      news_tag: "",
      meta_key_words: "",
      image_file_id: 0,
      news_date: newsDate || "",
      seo_name: seo_name != "" ? seo_name : values.seo_name,
      is_active: values.is_active == true ? 1 : 0,
      // is_qrcode: values.is_qrcode == true ? 1 : 0,
      news_category_id: values.news_category_id * 1,
    });

    //
    let newsId = (NewsEnt && NewsEnt.news_id) || formData[this._newsModel];
    let apiCall = newsId
      ? this._newsModel.update(newsId, formData)
      : this._newsModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return this.setState({ activeTab: "RELATED" });
          // return window._$g.rdr("/news");
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

        //set if is modal
        if (isModal && handleToggleAddQr) handleToggleAddQr();
        //
        if (!NewsEnt && !willRedirect && !alerts.length) {
          return this.handleFormikReset();
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
      ready: false,
      alerts: [],
      usrImgBase64: null,
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    //.end
  }

  handleEnterSession(session, data, key, ref) {
    let { values, handleChange } = this.formikProps;
    let value = values[key] || [];
    let newsValue = data.find((d) => "" + d.label === "" + session);
    if (newsValue === undefined) {
      let item = { label: session, value: uuidv4() };
      value.push(item);
      handleChange({ target: { name: key, value } });
      ref.blur();
      ref.focus();
    }
  }
  handleFormikValidate(values) {
    const { isQrCode } = this.state;
    const { newsEnt } = this.props;
    const { news_category_id, news_date } = values;
    let errors = {};
    if (
      !newsEnt &&
      news_date &&
      moment().diff(moment(news_date, "DD/MM/YYYY HH:mm"), "minutes") > -1
    ) {
      errors.news_date = "Thời gian đăng bài không hợp lệ";
    }
    if (isQrCode) {
      return {};
    }
    if (typeof news_category_id !== "string" || !news_category_id.length) {
      errors.news_category_id = "Chuyên mục bài viết là bắt buộc.";
    }
    return errors;
  }

  // handleChangeAuthor(author_id) {
  //   this._productModel
  //     .getOptions({ is_active: 1, author_id: author_id })
  //     .then((data) => {
  //       this.formikProps.setFieldTouched("poroduct_id", true, false);
  //       this.formikProps.setFieldValue("poroduct_id", "", true);
  //       this.setState({
  //         productOpts: [
  //           { label: "-- Chọn --", value: "" },
  //           ...mapDataOptions4Select(data),
  //         ],
  //       });
  //     });
  // }

  // handleChangeProduct(product_id) {
  //   this._productModel.read(product_id).then((data) => {
  //     this.formikProps.setFieldTouched("author_id", true, false);
  //     this.formikProps.setFieldValue("author_id", data.author_id, true);
  //   });
  // }

  handleOpenReview = (item) => {
    this.setState({
      isOpenReview: true,
      currentItem: item,
      isRequireNote: false,
    });
  };
  toggleOpenReview() {
    this.setState({
      isOpenReview: !this.state.isOpenReview,
      isRequireNote: false,
    });
  }
  handleReivewAction(isOk) {
    if (this.reviewNote.current.value) {
      const data = this.state.currentItem;
      fnUpdate({
        url: `news/${data.news_id}/update-review`,
        body: {
          note: this.reviewNote.current.value,
          is_review: isOk ? 1 : 0,
        },
      }).then(() => {
        this.getReviewData();
        this.toggleOpenReview();
      });
    } else {
      this.setState({ isRequireNote: true });
    }
  }
  getReviewData() {
    fnGet({ url: `news/${this.props.NewsEnt.news_id}` }).then((data) => {
      const { setFieldTouched, setFieldValue } = this.formikProps;
      setFieldTouched("review_user", true, false);
      setFieldValue("review_user", data.review_user, true);
      setFieldTouched("review_date", true, false);
      setFieldValue("review_date", data.review_date, true);
      setFieldTouched("review_note", true, false);
      setFieldValue("review_note", data.review_note, true);
    });
  }

  handleUploadImage = async (blobInfo, success, failure) => {
    readImageAsBase64(blobInfo.blob(), async (imageUrl) => {
      try {
        const imageUpload = await this._authorModel.upload({
          base64: imageUrl,
          folder: "files",
          includeCdn: true,
        });
        success(imageUpload);
      } catch (error) {
        failure(error);
      }
    });
  };

  // Open modal pick news related
  handleOpenModalNewsList = () => {
    this.setState({ isOpenNewsList: !this.state.isOpenNewsList });
  };
  // Pick news related
  handlePickNews = (news = {}) => {
    const { setFieldValue, values } = this.formikProps;
    this.setState({ isOpenNewsList: false }, () => {
      let related = values.related || [];
      (Object.keys(news) || []).forEach((key) => {
        if (related.findIndex((item) => item.news_id === key) < 0) {
          related.unshift(news[key]);
        }
      });

      setFieldValue("related", related);
      this.setState({ dataRelated: related });
    });
  };

  // Remove news item
  handleRemoveItem = (index) => {
    window._$g.dialogs.prompt(
      "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
      "Xóa",
      (confirm) => this.handleSubmitRemoveItem(confirm, index)
    );
  };

  // Submit remove
  async handleSubmitRemoveItem(confirm, index) {
    
    let { values, handleChange } = this.formikProps;
    const { NewsEnt } = this.props;
    let { related } = values;
    const newsSelected = related[index];
    if (confirm) {
      if (newsSelected.parent_id && NewsEnt) {
        // Call api remove news related
        await this._newsModel.deleteRelated(
        NewsEnt.news_id,
          newsSelected.news_id
        );
      }
      let cloneData = JSON.parse(JSON.stringify(related));
      cloneData.splice(index, 1);
      handleChange({ target: { name: "related", value: cloneData } });
    }
  }

  render() {
    let {
      _id,
      ready,
      alerts,
      usrImgBase64,
      newsCategoryOpts,
      productOpts,
      authorOpts,
      activeTab,
      isOpenNewsList,
    } = this.state;
    let { NewsEnt, noEdit, isModal, clickAdd } = this.props;

    let initialValues = this.getInitialValues();

    if (!ready) {
      return <Loading />;
    }

    if (this.btnSave && clickAdd) {
      clickAdd(this.btnSave.current);
    }
    return (
      <div key={`view-${_id}`} className="animated fadeIn news">
        <button
          ref={this.btnSave}
          style={{ display: "none" }}
          onClick={() => this.handleSubmit("save")}
        ></button>
        <Row className="d-flex justify-content-center">
          <Col xs={12}>
            <Card>
              {!isModal && (
                <CardHeader>
                  <b>
                    {NewsEnt ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"}{" "}
                    bài viết {NewsEnt ? NewsEnt.news_title : ""}
                  </b>
                </CardHeader>
              )}

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
                      errors,
                      handleSubmit,
                      handleReset,
                      isSubmitting,
                      /* and other goodies */
                    } = (this.formikProps = window._formikProps = formikProps);
                    // Render
                    return (
                      <Form
                        id="form1st"
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                      >
                        <Row>
                          <Nav tabs>
                            <NavItem>
                              <NavLink
                                className={`${
                                  activeTab === "INFO" ? "active" : ""
                                }`}
                                onClick={() =>
                                  this.setState({ activeTab: "INFO" })
                                }
                              >
                                Thông tin bài viết
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                className={`${
                                  activeTab === "RELATED" ? "active" : ""
                                }`}
                                onClick={() =>
                                  this.setState({ activeTab: "RELATED" })
                                }
                              >
                                Danh sách bài viết liên quan
                              </NavLink>
                            </NavItem>
                          </Nav>
                          <TabContent
                            activeTab={activeTab}
                            style={{ width: "100%" }}
                          >
                            <TabPane tabId={"INFO"}>
                              <Row>
                                <Col xs={12}>
                                  <Row>
                                    <Col xs={12}>
                                      <Row>
                                        <Col xs={12}>
                                          <Row>
                                            <Col xs={12}>
                                              <FormGroup row>
                                                <Label for="news_title" sm={2}>
                                                  {" "}
                                                  Tiêu đề{" "}
                                                  <span className="font-weight-bold red-text">
                                                    {" "}
                                                    *{" "}
                                                  </span>
                                                </Label>
                                                <Col sm={10}>
                                                  <Field
                                                    name="news_title"
                                                    render={({ field }) => (
                                                      <Input
                                                        {...field}
                                                        //  onBlur={(item) => this.updateURLNews(item, values.seo_name)}
                                                        type="text"
                                                        placeholder=""
                                                        disabled={noEdit}
                                                      />
                                                    )}
                                                  />
                                                  <ErrorMessage
                                                    name="news_title"
                                                    component={({
                                                      children,
                                                    }) => (
                                                      <Alert
                                                        color="danger"
                                                        className="field-validation-error"
                                                      >
                                                        {" "}
                                                        {children}{" "}
                                                      </Alert>
                                                    )}
                                                  />
                                                </Col>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <FormSelectGroup
                                              label="Chuyên mục bài viết"
                                              name="news_category_id"
                                              // isObject
                                              smColSelect={10}
                                              smColLabel={2}
                                              isEdit={!noEdit}
                                              placeHolder={
                                                "-- Chọn mục tin tức--"
                                              }
                                              list={newsCategoryOpts}
                                              isTarget={false}
                                            />
                                          </Row>

                                          <Row>
                                            <Col xs={12}>
                                              <FormGroup row>
                                                <Label for="author_id" sm={2}>
                                                  {" "}
                                                  Tác giả{" "}
                                                </Label>
                                                <Col sm={10}>
                                                  <Field
                                                    name="author_id"
                                                    render={({
                                                      field /*, form*/,
                                                    }) => {
                                                      let defaultValue =
                                                        authorOpts.find(
                                                          ({ value }) =>
                                                            1 * value ===
                                                            1 * field.value
                                                        );
                                                      let placeholder =
                                                        (authorOpts[0] &&
                                                          authorOpts[0]
                                                            .label) ||
                                                        "";
                                                      return (
                                                        <Select
                                                          name={field.name}
                                                          onChange={({
                                                            value,
                                                          }) => {
                                                            field.onChange({
                                                              target: {
                                                                type: "select",
                                                                name: field.name,
                                                                value,
                                                              },
                                                            });
                                                            // this.handleChangeAuthor(
                                                            //   value
                                                            // );
                                                          }}
                                                          isSearchable={true}
                                                          placeholder={
                                                            placeholder
                                                          }
                                                          value={defaultValue}
                                                          options={authorOpts}
                                                          isDisabled={noEdit}
                                                        />
                                                      );
                                                    }}
                                                  />
                                                  <ErrorMessage
                                                    name="author_id"
                                                    component={({
                                                      children,
                                                    }) => (
                                                      <Alert
                                                        color="danger"
                                                        className="field-validation-error"
                                                      >
                                                        {" "}
                                                        {children}{" "}
                                                      </Alert>
                                                    )}
                                                  />
                                                </Col>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          {/* <Row>
                                            <Col xs={12}>
                                              <FormGroup row>
                                                <Label for="product_id" sm={3}>
                                                  {" "}
                                                  Sách{" "}
                                                </Label>
                                                <Col sm={9}>
                                                  <Field
                                                    name="product_id"
                                                    render={({
                                                      field ,
                                                    }) => {
                                                      let defaultValue =
                                                        productOpts.find(
                                                          ({ value }) =>
                                                            1 * value ===
                                                            1 * field.value
                                                        );
                                                      let placeholder =
                                                        (productOpts[0] &&
                                                          productOpts[0]
                                                            .label) ||
                                                        "";
                                                      return (
                                                        <Select
                                                          name={field.name}
                                                          onChange={({
                                                            value,
                                                          }) => {
                                                            field.onChange({
                                                              target: {
                                                                type: "select",
                                                                name: field.name,
                                                                value,
                                                              },
                                                            });
                                                            this.handleChangeProduct(
                                                              value
                                                            );
                                                          }}
                                                          isSearchable={true}
                                                          placeholder={
                                                            placeholder
                                                          }
                                                          value={defaultValue}
                                                          options={productOpts}
                                                          isDisabled={noEdit}
                                                        />
                                                      );
                                                    }}
                                                  />
                                                  <ErrorMessage
                                                    name="product_id"
                                                    component={({
                                                      children,
                                                    }) => (
                                                      <Alert
                                                        color="danger"
                                                        className="field-validation-error"
                                                      >
                                                        {" "}
                                                        {children}{" "}
                                                      </Alert>
                                                    )}
                                                  />
                                                </Col>
                                              </FormGroup>
                                            </Col>
                                          </Row> */}
                                          <Row>
                                            <Col xs={12} sm={12}>
                                              <FormGroup row>
                                                <Label for="image_url" sm={2}>
                                                  {" "}
                                                  Hình ảnh{" "}
                                                  <span className="font-weight-bold red-text">
                                                    {" "}
                                                    *{" "}
                                                  </span>
                                                </Label>
                                                <Col sm={4}>
                                                  <div className="ps-relative">
                                                    <Media
                                                      object
                                                      src={
                                                        usrImgBase64 ||
                                                        NewsModel.defaultImgBase64
                                                      }
                                                      alt="User image"
                                                      className="user-imgage"
                                                    />
                                                    <Input
                                                      type="file"
                                                      id="image_url"
                                                      className="input-overlay"
                                                      onChange={
                                                        this
                                                          .handleUserImageChange
                                                      }
                                                      disabled={noEdit}
                                                    />
                                                  </div>
                                                  <ErrorMessage
                                                    name="image_url"
                                                    component={({
                                                      children,
                                                    }) => (
                                                      <Alert
                                                        color="danger"
                                                        className="field-validation-error"
                                                      >
                                                        {" "}
                                                        {children}{" "}
                                                      </Alert>
                                                    )}
                                                  />
                                                </Col>
                                                <Col
                                                  sm={4}
                                                  className="d-flex flex-column"
                                                >
                                                  {/* <Field
                                                    name="is_qrcode"
                                                    render={({ field }) => (
                                                      <CustomInput
                                                        {...field}
                                                        className="pull-left"
                                                        onBlur={null}
                                                        checked={
                                                          values.is_qrcode
                                                        }
                                                        type="checkbox"
                                                        id="is_qrcode"
                                                        label="Tạo QR code"
                                                        disabled={noEdit}
                                                        onChange={
                                                          this
                                                            .handleChangeQrCode
                                                        }
                                                      />
                                                    )}
                                                  /> */}
                                                  {values.is_qrcode &&
                                                  NewsEnt &&
                                                  NewsEnt.news_id ? (
                                                    <div className="mt-2">
                                                      <QRCode
                                                        value={`${
                                                          process.env
                                                            .REACT_APP_WEBSITE
                                                        }/${
                                                          NewsEnt
                                                            ? `${
                                                                process.env
                                                                  .REACT_APP_WEBSITE
                                                              }chi-tiet-tin-tuc/${urlFriendly(
                                                                NewsEnt.news_title
                                                              )}-qr${
                                                                NewsEnt.news_id
                                                              }`
                                                            : ""
                                                        }`}
                                                        size={170}
                                                      />
                                                    </div>
                                                  ) : null}
                                                </Col>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col sm={12}>
                                              <FormGroup row>
                                                <Label for="news_date" sm={2}>
                                                  Ngày đăng tin
                                                </Label>
                                                <Col sm={9} className="pl-0">
                                                  <DateTimePicker
                                                    // label="Ngày đăng tin"
                                                    name="news_date"
                                                    labelsm={4}
                                                    inputsm={6}
                                                    isRequired={false}
                                                    isEdit={
                                                      !(
                                                        noEdit
                                                        // NewsEnt &&
                                                        // NewsEnt.news_date
                                                        // &&
                                                        // moment(
                                                        //   NewsEnt.news_date
                                                        // ) < moment()
                                                      )
                                                    }
                                                    isDisabledDate={noEdit}
                                                  />
                                                </Col>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col xs={12}>
                                              <FormGroup row>
                                                <Label
                                                  for="short_description"
                                                  sm={2}
                                                >
                                                  {" "}
                                                  Mô tả ngắn
                                                </Label>
                                                <Col sm={10}>
                                                  <Field
                                                    name="short_description"
                                                    render={({
                                                      field /* _form */,
                                                    }) => (
                                                      <Input
                                                        {...field}
                                                        onBlur={null}
                                                        type="textarea"
                                                        id="short_description"
                                                        disabled={noEdit}
                                                        maxLength={500}
                                                      />
                                                    )}
                                                  />
                                                </Col>
                                              </FormGroup>
                                            </Col>
                                          </Row>

                                          <Row>
                                            <Col xs={12}>
                                              <FormGroup row>
                                                <Label for="seo_name" sm={2}>
                                                  {" "}
                                                  Tên SEO
                                                </Label>
                                                <Col sm={10}>
                                                  <Field
                                                    name="seo_name"
                                                    render={({ field }) => (
                                                      <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder=""
                                                        //onBlur={(Item) => this.setState({ seo_name: Item.target.value || "" })}
                                                        // onChange={(Item) =>this.setState({ seo_name: Item.target.value || "" })}
                                                        // value={seo_name || values.seo_name }
                                                        disabled={noEdit}
                                                      />
                                                    )}
                                                  />
                                                </Col>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col xs={12}>
                                              <FormGroup row>
                                                <Label for="meta_title" sm={2}>
                                                  {" "}
                                                  Meta keyword
                                                </Label>
                                                <Col sm={10}>
                                                  <Field
                                                    name="meta_title"
                                                    render={({
                                                      field /* _form */,
                                                    }) => (
                                                      <Input
                                                        {...field}
                                                        onBlur={null}
                                                        type="textarea"
                                                        id="meta_title"
                                                        disabled={noEdit}
                                                      />
                                                    )}
                                                  />
                                                </Col>
                                              </FormGroup>
                                            </Col>
                                          </Row>

                                          <Row>
                                            <Col sm={12}>
                                              <FormGroup row>
                                                <Label for="content" sm={2}>
                                                  Nội dung{" "}
                                                  <span className="font-weight-bold red-text">
                                                    {" "}
                                                    *{" "}
                                                  </span>
                                                </Label>
                                                <Col sm={10} xs={12}>
                                                  <Editor
                                                    apiKey={
                                                      "3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"
                                                    }
                                                    scriptLoading={{
                                                      delay: 500,
                                                    }}
                                                    value={values.content}
                                                    disabled={noEdit}
                                                    init={{
                                                      height: "300px",
                                                      width: "100%",
                                                      menubar: false,
                                                      branding: false,
                                                      statusbar: false,
                                                      plugins: [
                                                        "advlist autolink fullscreen lists link image charmap print preview anchor",
                                                        "searchreplace visualblocks code fullscreen ",
                                                        "insertdatetime media table paste code help",
                                                        "image imagetools ",
                                                        "toc",
                                                      ],
                                                      menubar:
                                                        "file edit view insert format tools table tc help",
                                                      toolbar1:
                                                        "undo redo | fullscreen | formatselect | bold italic backcolor | \n" +
                                                        "alignleft aligncenter alignright alignjustify",
                                                      toolbar2:
                                                        "bullist numlist outdent indent | removeformat | help | image | toc",
                                                      file_picker_types:
                                                        "image",
                                                      images_dataimg_filter:
                                                        function (img) {
                                                          return img.hasAttribute(
                                                            "internal-blob"
                                                          );
                                                        },
                                                      images_upload_handler:
                                                        this.handleUploadImage,
                                                    }}
                                                    onEditorChange={(
                                                      newValue
                                                    ) => {
                                                      formikProps.setFieldValue(
                                                        "content",
                                                        newValue
                                                      );
                                                    }}
                                                  />
                                                  <ErrorMessage
                                                    name="content"
                                                    component={({
                                                      children,
                                                    }) => (
                                                      <Alert
                                                        color="danger"
                                                        className="field-validation-error"
                                                      >
                                                        {" "}
                                                        {children}{" "}
                                                      </Alert>
                                                    )}
                                                  />
                                                </Col>
                                              </FormGroup>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>

                                  {NewsEnt && (
                                    <div>
                                      <Row>
                                        <FormInput
                                          name="review_user"
                                          label="Người duyệt"
                                          labelSm={2}
                                          inputSm={10}
                                          isRequired={false}
                                          isEdit={false}
                                          labelClassName="text-right"
                                        />
                                        <FormInput
                                          name="review_date"
                                          label="Ngày duyệt"
                                          labelSm={2}
                                          inputSm={10}
                                          isRequired={false}
                                          isEdit={false}
                                          labelClassName="text-right"
                                        />
                                        <FormInput
                                          name="review_note"
                                          label="Ghi chú"
                                          labelSm={2}
                                          inputSm={10}
                                          isRequired={false}
                                          isEdit={false}
                                          labelClassName="text-right"
                                        />
                                      </Row>
                                      <div className="d-flex justify-content-end">
                                        <CheckAccess permission="NEWS_NEWS_REVIEW">
                                          <Button
                                            onClick={() =>
                                              this.handleOpenReview(NewsEnt)
                                            }
                                            disabled={NewsEnt.is_review !== 2}
                                          >
                                            <i className="fa fa-check-circle mr-1" />{" "}
                                            <span className="ml-1">
                                              Duyệt bài viết
                                            </span>
                                          </Button>
                                        </CheckAccess>
                                      </div>
                                    </div>
                                  )}
                                  <Row>
                                    <Col xs={12} className="m-t-10 mb-2 mt-2">
                                      <FormGroup row>
                                        <Col
                                          sm={2}
                                          xs={12}
                                          className="offset-md-2 offset-xs-0"
                                        >
                                          <Field
                                            name="is_active"
                                            render={({ field, form }) => (
                                              <CustomInput
                                                {...field}
                                                className="pull-left"
                                                onBlur={null}
                                                checked={values.is_active}
                                                type="checkbox"
                                                id="is_active"
                                                onChange={(e) => {
                                                  form.setFieldValue(
                                                    field.name,
                                                    e.target.checked
                                                  );
                                                }}
                                                label="Kích hoạt"
                                                disabled={noEdit}
                                              />
                                            )}
                                          />
                                        </Col>
                                        <Col
                                          sm={2}
                                          xs={12}
                                          className="offset-xs-0"
                                        >
                                          <Field
                                            name="is_high_light"
                                            render={({ field }) => (
                                              <CustomInput
                                                {...field}
                                                className="pull-left"
                                                onBlur={null}
                                                checked={values.is_high_light}
                                                type="checkbox"
                                                onChange={(event) => {
                                                  const { target } = event;
                                                  field.onChange({
                                                    target: {
                                                      name: field.name,
                                                      value: target.checked,
                                                    },
                                                  });
                                                }}
                                                id="is_high_light"
                                                label="Tin nổi bật"
                                                disabled={noEdit}
                                              />
                                            )}
                                          />
                                        </Col>
                                        <Col
                                          sm={2}
                                          xs={12}
                                          className="offset-xs-0"
                                        >
                                          <Field
                                            name="is_hot_news"
                                            render={({ field }) => (
                                              <CustomInput
                                                {...field}
                                                className="pull-left"
                                                onBlur={null}
                                                checked={values.is_hot_news}
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
                                                id="is_hot_news"
                                                label="Tin hot"
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
                            </TabPane>
                            <TabPane tabId={"RELATED"}>
                              <Row>
                                <Col xs={12}>
                                  <Row className="mb-4">
                                    <Col xs={12} sm={6} className="mx-auto">
                                      <b className="title_page_h1 text-primary underline">
                                        Danh sách bài viết
                                      </b>
                                    </Col>
                                    <Col xs={12} sm={6} className="text-right">
                                      <Button
                                        size="md"
                                        onClick={(e) =>
                                          this.handleOpenModalNewsList(e)
                                        }
                                        color="secondary"
                                      >
                                        <i className="fa fa-plus mr-2" />
                                        Thêm bài viết
                                      </Button>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={12}>
                                  {
                                    <Table
                                      bordered
                                      className="table-news-related"
                                      striped
                                    >
                                      <thead>
                                        <th
                                          style={{ width: 50 }}
                                          className="text-center"
                                        >
                                          STT
                                        </th>
                                        <th className="text-center">Tiêu đề</th>
                                        <th className="text-center">
                                          Chuyên mục
                                        </th>
                                        <th
                                          style={{ width: 150 }}
                                          className="text-center"
                                        >
                                          Ngày đăng
                                        </th>
                                        <th
                                          style={{ width: 100 }}
                                          className="text-center"
                                        >
                                          Thao tác
                                        </th>
                                      </thead>
                                      <tbody>
                                        {!values.related ||
                                        !values.related.length ? (
                                          <tr>
                                            <td
                                              className="text-center"
                                              colSpan={5}
                                            >
                                              Không có bài viết liên quan
                                            </td>
                                          </tr>
                                        ) : (
                                          (values.related || []).map(
                                            (news, index) => (
                                              <tr key={index}>
                                                <td className="text-center">
                                                  {index + 1}
                                                </td>
                                                <td>
                                                  <a
                                                    target="_blank"
                                                    href={`/news/detail/${news.news_id}`}
                                                  >
                                                    {news.news_title}
                                                  </a>
                                                </td>
                                                <td>
                                                  {news.news_category_name}
                                                </td>
                                                <td className="text-center">
                                                  {news.create_date}
                                                </td>
                                                <td className="text-center">
                                                  <Button
                                                    color="danger"
                                                    style={{
                                                      width: 24,
                                                      height: 24,
                                                      padding: 0,
                                                    }}
                                                    onClick={(e) =>
                                                      this.handleRemoveItem(
                                                        index
                                                      )
                                                    }
                                                    title="Xóa"
                                                  >
                                                    <i className="fa fa-minus-circle" />
                                                  </Button>
                                                </td>
                                              </tr>
                                            )
                                          )
                                        )}
                                      </tbody>
                                    </Table>
                                  }
                                </Col>
                              </Row>
                            </TabPane>
                          </TabContent>
                        </Row>
                        {!isModal && (
                          <Row className="mt-3">
                            <Col xs={12}>
                              <FormGroup row>
                                <Label for="" sm={3}></Label>
                                <Col sm={9}>
                                  <div className="d-flex justify-content-end">
                                    {noEdit ? (
                                      <Button
                                        color="primary"
                                        className="mr-2 btn-block-sm"
                                        onClick={() =>
                                          window._$g.rdr(
                                            `/news/edit/${
                                              NewsEnt && NewsEnt.id()
                                            }`
                                          )
                                        }
                                      >
                                        <i className="fa fa-edit mr-1" />
                                        Chỉnh sửa
                                      </Button>
                                    ) : (
                                      [
                                        false !==
                                        this.props.handleActionSave ? (
                                          <Button
                                            key="buttonSave"
                                            type="submit"
                                            color="primary"
                                            disabled={isSubmitting}
                                            onClick={() =>
                                              this.handleSubmit("savnpme")
                                            }
                                            className="ml-3"
                                          >
                                            <i className="fa fa-save mr-2" />{" "}
                                            <span className="ml-1">Lưu</span>
                                          </Button>
                                        ) : null,
                                        false !==
                                        this.props.handleActionSaveAndClose ? (
                                          <Button
                                            key="buttonSaveClose"
                                            type="submit"
                                            color="success"
                                            disabled={isSubmitting}
                                            onClick={() =>
                                              this.handleSubmit("save_n_close")
                                            }
                                            className="ml-3"
                                          >
                                            <i className="fa fa-save mr-2" />{" "}
                                            <span className="ml-1">
                                              {" "}
                                              Lưu &amp; Đóng{" "}
                                            </span>
                                          </Button>
                                        ) : null,
                                      ]
                                    )}
                                    <Button
                                      disabled={isSubmitting}
                                      onClick={
                                        this.props.handleActionClose ||
                                        (() => window._$g.rdr("/news"))
                                      }
                                      className="ml-3"
                                    >
                                      <i className="fa fa-times-circle mr-1" />{" "}
                                      <span className="ml-1">Đóng</span>
                                    </Button>
                                  </div>
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                        )}
                      </Form>
                    );
                  }}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal
          isOpen={this.state.isOpenReview}
          toggle={() => this.toggleOpenReview()}
        >
          <ModalHeader>Duyệt bài viết</ModalHeader>
          <ModalBody>
            <span>
              Bạn có muốn duyệt bài viết {this.state.currentItem.news_title}
              {" không?"}
            </span>
            <Row className="mt-2">
              <Col sm={3}>
                <Label>
                  Ghi chú<span className="font-weight-bold red-text"> * </span>
                </Label>
              </Col>
              <Col sm={9}>
                <Input type="textarea" innerRef={this.reviewNote} />
                {this.state.isRequireNote && (
                  <Label className="note-required">bắt buộc nhập ghi chú</Label>
                )}
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.handleReivewAction(true)}
            >
              Đồng ý duyệt
            </Button>
            <Button
              color="success"
              onClick={() => this.handleReivewAction(false)}
            >
              không duyệt
            </Button>
            <Button color="secondary" onClick={() => this.toggleOpenReview()}>
              Huỷ bỏ
            </Button>
          </ModalFooter>
        </Modal>
        {/* Open modal News list here */}
        {isOpenNewsList ? (
          <Modal isOpen={true} size={"lg"} style={{ maxWidth: "60rem" }}>
            {/* <ModalHeader>Duyệt bài viết</ModalHeader> */}
            <ModalBody className="p-0">
              <News
                isOpenNewsList={isOpenNewsList}
                handlePick={this.handlePickNews}
                related={this.formikProps.values.related}
                excludeNewsId={NewsEnt ? NewsEnt.news_id : null}
              />
            </ModalBody>
          </Modal>
        ) : null}
      </div>
    );
  }
}
