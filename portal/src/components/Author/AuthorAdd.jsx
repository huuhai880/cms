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
  Media,
  InputGroup,
  CustomInput,
} from "reactstrap";
import moment from "moment";
import { Editor } from "@tinymce/tinymce-react";
import { Link } from "react-router-dom";
// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import Loading from "../Common/Loading";
import Address, { DEFAULT_COUNTRY_ID } from "../Common/Address";
import DatePicker from "../Common/DatePicker";
import Upload from "../Common/Antd/Upload";
import { FormSelectGroup } from "@widget";

// Util(s)
import {
  readFileAsBase64,
  readImageAsBase64,
  mapDataOptions4Select,
validateDimession,
} from "../../utils/html";
import { isHaveChild } from "@utils/arrayHelper";
// Model(s)
import AuthorModel from "../../models/AuthorModel";
import NewsCategoryModel from "../../models/NewsCategoryModel";

// Assets
import "./styles.scss";

/**
 * @class AuthorAdd
 */

const MIN_WIDTH_BANNER = 1600;
export default class AuthorAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._authorModel = new AuthorModel();
    this._newsCategoryModel = new NewsCategoryModel();

    // Bind method(s)
    this.handleAuthorImageChange = this.handleAuthorImageChange.bind(this);
    this.handleFormikBeforeRender = this.handleFormikBeforeRender.bind(this);
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);

    // Init state
    // +++
    let { authorEnt } = props;
    // +++
    this.state = {
      /** @var {Number} */
      _id: 0,
      /** @var {Array} */
      alerts: [],
      /** @var {String|null} */
      usrImgBase64: (authorEnt && authorEnt.defaultPictureUrl()) || null,
      /** @var {Boolean} */
      ready: false,
      /** @var {Object|null} */
      authorData: null,
      /** @var {Array} */
      newsCategoryOpts: null,
      /** @var {Array} */
      genders: [
        { name: "Nam", id: "1" },
        { name: "Nữ", id: "0" },
      ],
      /** @var {Boolean} */
      clearImageFront: false,
      /** @var {String} */
      urlImageFrontEdit: "",
      /** @var {Boolean} */
      clearImageBack: false,
      /** @var {String} */
      urlImageBackEdit: "",
      urlImageBannerEdit: "",
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      banner: [],
      slectedCategoryLength: 0,
    };

    // Init validator
    this.formikValidationSchema = Yup.object().shape({
      author_name: Yup.string().trim().required("ID nhân viên là bắt buộc."),
      password: authorEnt
        ? undefined
        : Yup.string()
            .trim()
            .min(8, "Mật khẩu quá ngắn, ít nhất 8 ký tự!")
            .max(25, "Mật khẩu quá dài, tối đa 25 ký tự!")
            .required("Mật khẩu là bắt buộc."),
      gender: Yup.string().required("Giới tính là bắt buộc."),
      email: Yup.string()
        .trim()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc."),
      // birthday: Yup.date()
      //   .typeError("Ngày sinh không hợp lệ.")
      //   .required("Ngày sinh là bắt buộc."),
      first_name: Yup.string()
        .trim()
        // .matches(
        //   /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]+$/,
        //   "Họ không chứa kí tự đặc biệt."
        // )
        .required("Họ là bắt buộc."),
      last_name: Yup.string()
        .trim()
        // .matches(
        //   /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ]+$/,
        //   "Tên không chứa kí tự đặc biệt."
        // )
        .required("Tên là bắt buộc."),
      // country_id: Yup.string().required("Quốc gia là bắt buộc."),
      // province_id: Yup.string().required("Tỉnh/Thành phố là bắt buộc."),
      // district_id: Yup.string().required("Quận/Huyện là bắt buộc."),
      // ward_id: Yup.string().required("Phường/Xã là bắt buộc."),
      // address: Yup.string()
      //   .trim()
      //   .matches(
      //     /^[a-zA-Z0-9\s\/ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/,
      //     "Địa chỉ cụ thể không chứa kí tự đặc biệt."
      //   ),
      phone_number: Yup.string()
        .trim()
        .matches(/^[0-9]{7,10}$/, "Số điện thoại không hợp lệ")
        .required("Điện thoại là bắt buộc."),
      banner_image: Yup.string().required("Hình ảnh banner là bắt buộc."),
      introduce: Yup.string().required("Giới thiệu bản thân là bắt buộc."),
      education_career: Yup.string().required(
        "Học vấn và sự nghiệp là bắt buộc."
      ),
      // news_category: Yup.string().required("Danh mục bài viết là bắt buộc."),
      order_index: Yup.number()
        .typeError("Thứ tự hiển thị phải là số.")
        .positive("Thứ tự hiển thị phải lớn hơn 0.")
        .required("Thứ tự hiển thị là bắt buộc."),
      nickname: Yup.string().required("Biệt danh là bắt buộc."),
      identity_number: Yup.string().matches(/^[0-9\b]+$/, "Số CMND/ Thẻ căn cước bắt buộc nhập là số."),
    });
  }

  componentDidMount() {
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    //.end
    // remove class if exits
    document.querySelector("body").classList.remove("tox-fullscreen");
  }

  /**
   *
   * @return {Object}
   */
  getInitialValues() {
    let { authorEnt } = this.props;
    let { authorData = {} } = this.state;

    let values = Object.assign(
      {},
      this._authorModel.fillable(),
      {
        // Set default country to 'VN'
        country_id: DEFAULT_COUNTRY_ID,
      },
      authorData
    );
    if (authorEnt) {
      Object.assign(values, authorEnt);
    }
    // Format
    Object.keys(values).forEach((key) => {
      if (null === values[key]) {
        values[key] = "";
      }
      // values[key] += '';
      // birthday
      if (key === "birthday") {
        let bdArr = values[key].match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
        bdArr && (values[key] = `${bdArr[3]}-${bdArr[2]}-${bdArr[1]}`);
      }
      //identity_date
      if (key === "identity_date") {
        let idArr = values[key].match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
        idArr && (values[key] = `${idArr[3]}-${idArr[2]}-${idArr[1]}`);
      }
    });
    // Return;
    return values;
  }

  initAuthorData() {
    let { authorEnt } = this.props;
    return authorEnt ? Promise.resolve({}) : this._authorModel.init();
  }

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let { authorEnt } = this.props;
    let bundle = {};
    let all = [
      this.initAuthorData().then((data) => (bundle["authorData"] = data)),
      this._newsCategoryModel
        .getOptionsForAuthorPost({ is_active: 1, is_author_post: 1 })
        .then(
          (data) => (bundle["newsCategoryOpts"] = mapDataOptions4Select(data))
        ),
    ];
    await Promise.all(all).catch((err) =>
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => window.location.reload()
      )
    );
    if (authorEnt && authorEnt.identity_front_image) {
      bundle["urlImageFrontEdit"] = authorEnt.identity_front_image;
    }
    if (authorEnt && authorEnt.identity_back_image) {
      bundle["urlImageBackEdit"] = authorEnt.identity_back_image;
    }
    if (authorEnt && authorEnt.banner_image) {
      bundle["urlImageBannerEdit"] = authorEnt.banner_image;
    }

    // if (authorEnt && authorEnt.news_category) {
    //   bundle["slectedCategoryLength"] = authorEnt.news_category.length;
    // }
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

  makeAvatarStr(values = {}) {
    let { positions = [], departments = [] } = this.state;
    let position = positions.find((p) => "" + p.id === "" + values.position_id);
    let department = departments.find(
      (d) => "" + d.id === "" + values.department_id
    );
    return [
      [
        values.nickname,
        [values.first_name, values.last_name].filter((_d) => !!_d).join(" "),
      ]
        .filter((_d) => !!_d)
        .join(" - "),
      [
        position && position.id ? position && position.name : "",
        department && department.id ? department && department.name : "",
      ]
        .filter((_d) => !!_d)
        .join(" - "),
    ];
  }

  handleAuthorImageChange(event) {
    let { target } = event;
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
        })
        .catch((err) => {
          window._$g.dialogs.alert(window._$g._(err.message));
        });
    }
  }

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
    window.scrollTo(0, 0);
    return submitForm();
  }

  handleFormikSubmit(values, formProps) {
    let { authorEnt } = this.props;
    let { usrImgBase64 } = this.state;
    let { setSubmitting } = formProps;
    let willRedirect = false;
    let alerts = [];
    // Build form data
    // +++
    let { birthday, identity_date } = values;
    let bdArr = (birthday && moment(birthday).format("DD/MM/YYYY")) || [];
    let idArr =
      (identity_date && moment(identity_date).format("DD/MM/YYYY")) || [];

    // if(banner.obje)
    // +++
    let formData = Object.assign({}, values, {
      avatar_image: usrImgBase64 || "",
      birthday: bdArr.length ? bdArr : "",
      identity_date: idArr.length ? idArr : "",
      phone_number: "" + values.phone_number,
      identity_number: values.identity_number,
      identity_place: values.identity_place,
      password_confirm: values.password,
      city_id: values.province_id,
      description: values.about_me,
      is_active: values.is_active * 1,
      is_review_news: values.is_review_news * 1,
    });
    //
    let authorId = (authorEnt && authorEnt.id()) || formData[this._authorModel];
    let apiCall = authorEnt
      ? this._authorModel.update(authorId, formData)
      : this._authorModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/author");
        }
        // Chain
        return data;
      })
      .catch((apiData) => {
        // NG
        let { errors, statusText, message } = apiData;
        let msg = [`<b>${errors}</b>`].concat([]).join("<br/>");
        alerts.push({ color: "danger", msg });
      })
      .finally(() => {
        // Submit form is done!
        setSubmitting(false);
        //
        if (!authorEnt && !willRedirect && !alerts.length) {
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
      urlImageBackEdit: null,
      urlImageFrontEdit: null,
      urlImageBannerEdit: null,
      clearImageFront: true,
      clearImageBack: true,
      newsCategoryOpts: [],
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({
        ...bundle,
        ready: true,
        clearImageFront: false,
        clearImageBack: false,
      });
    })();
    //.end
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

  // beforeUploadBannerImage = async (file) => {
  //   const { setFieldError, setFieldTouched } = this.formikProps;
  //   const isValidDimessions = await validateDimession(file, MIN_WIDTH_BANNER);
  //   if (!isValidDimessions) {
  //     setFieldTouched("banner_image", true, false);
  //     setFieldError(
  //       "banner_image",
  //       "Kích thước banner tối thiểu là 1600px",
  //       true
  //     );
  //   }
  //   return isValidDimessions;
  // };

  FancyLink = React.forwardRef((props, ref) => (
    <a ref={ref} {...props} className="underline mr-5">
      {props.children}
    </a>
  ));

  handleCategoryChange(values, field) {
    if (!values || !values.length) return;
    if (values.length < this.state.slectedCategoryLength) {
      this.setState({
        slectedCategoryLength: values.length,
      });
      return;
    } else {
      const lastValue = values[values.length - 1];
      let listCategory = this.state.newsCategoryOpts;
      listCategory = listCategory.filter(
        (e) =>
          e.parent_id == lastValue.value &&
          !values.find((item) => item.value == e.value)
      );

      if (listCategory.length) {
        const { setFieldValue } = this.formikProps;
        setFieldValue("news_category", [...values, ...listCategory]);
        this.setState({
          slectedCategoryLength: [...values, ...listCategory].length - 1,
        });
      }
    }
  }

  render() {
    let {
      _id,
      ready,
      alerts,
      usrImgBase64,
      newsCategoryOpts = [],
      genders,
    } = this.state;
    let { authorEnt, noEdit } = this.props;
    /** @var {Object} */
    let initialValues = this.getInitialValues();
    // Ready?
    if (!ready) {
      return <Loading />;
    }

    return (
      <div key={`view-${_id}`} className="animated fadeIn author">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {authorEnt ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"}{" "}
                  tác giả {authorEnt ? authorEnt.full_name : ""}
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
                    } = (this.formikProps = formikProps);
                    // [Event]
                    this.handleFormikBeforeRender({ initialValues });
                    // Render
                    return (
                      <Form
                        id="form1st"
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                      >
                        <Row>
                          <Col xs={12} md={3}>
                            <FormGroup row>
                              <Col sm={12}>
                                <div className="hidden ps-relative">
                                  <Media
                                    object
                                    src={
                                      usrImgBase64 ||
                                      AuthorModel.defaultImgBase64
                                    }
                                    alt="Author image"
                                    className="user-imgage radius-50-percent"
                                    onError={(event) =>
                                      (event.currentTarget.src =
                                        AuthorModel.defaultImgBase64)
                                    }
                                  />
                                  <Input
                                    type="file"
                                    id="author_image_file"
                                    className="input-overlay"
                                    onChange={this.handleAuthorImageChange}
                                    disabled={noEdit}
                                  />
                                </div>
                                <b className="center block">
                                  {this.makeAvatarStr(values).map((text, idx) =>
                                    text ? (
                                      <p key={`avatar-text-${idx}`}>{text}</p>
                                    ) : null
                                  )}
                                </b>
                              </Col>
                            </FormGroup>
                          </Col>
                          <Col xs={12} md={9}>
                            <Row>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="author_name" sm={4}>
                                    ID tác giả
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="author_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          readOnly={true}
                                          onBlur={null}
                                          type="text"
                                          name="author_name"
                                          id="author_name"
                                          placeholder="ASCC00001"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="author_name"
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
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="nickname" sm={4}>
                                    Biệt danh
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <InputGroup>
                                      <Field
                                        name="nickname"
                                        render={({ field /* _form */ }) => (
                                          <Input
                                            {...field}
                                            onBlur={null}
                                            type={`text`}
                                            name="nickname"
                                            id="nickname"
                                            disabled={noEdit}
                                          />
                                        )}
                                      />
                                    </InputGroup>
                                    <ErrorMessage
                                      name="nickname"
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
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="first_name" sm={4}>
                                    Họ
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="first_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="first_name"
                                          id="first_name"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="first_name"
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
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="last_name" sm={4}>
                                    Tên
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="last_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="last_name"
                                          id="last_name"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="last_name"
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
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="gender_1" sm={4}>
                                    Giới tính
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Row>
                                      {genders.map(({ name, id }, idx) => {
                                        return (
                                          <Col xs={4} key={`gender-${idx}`}>
                                            <FormGroup check>
                                              <Label check>
                                                <Field
                                                  name="gender"
                                                  render={({
                                                    field /* _form */,
                                                  }) => (
                                                    <Input
                                                      {...field}
                                                      onBlur={null}
                                                      value={id}
                                                      type="radio"
                                                      checked={
                                                        1 * values.gender ===
                                                        1 * id
                                                      }
                                                      id={`gender_${id}`}
                                                      disabled={noEdit}
                                                    />
                                                  )}
                                                />{" "}
                                                {name}
                                              </Label>
                                            </FormGroup>
                                          </Col>
                                        );
                                      })}
                                      <ErrorMessage
                                        name="gender"
                                        component={({ children }) => (
                                          <Alert
                                            color="danger"
                                            className="field-validation-error"
                                          >
                                            {children}
                                          </Alert>
                                        )}
                                      />
                                    </Row>
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="email" sm={4}>
                                    Email
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="email"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="email"
                                          name="email"
                                          id="email"
                                          placeholder="employee@company.com"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="email"
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
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="birthday" sm={4}>
                                    Ngày sinh
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="birthday"
                                      render={({
                                        date,
                                        form: {
                                          setFieldValue,
                                          setFieldTouched,
                                          values,
                                        },
                                        field,
                                        ...props
                                      }) => {
                                        return (
                                          <DatePicker
                                            id="birthday"
                                            date={
                                              values.birthday
                                                ? moment(values.birthday)
                                                : null
                                            }
                                            onDateChange={(date) => {
                                              setFieldValue("birthday", date);
                                            }}
                                            renderMonthElement
                                            disabled={noEdit}
                                            maxToday
                                          />
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="birthday"
                                      component={({ children }) => {
                                        return (
                                          <Alert
                                            color="danger"
                                            className="field-validation-error"
                                          >
                                            {" "}
                                            {children}
                                          </Alert>
                                        );
                                      }}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="phone_number" sm={4}>
                                    Điện thoại
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="phone_number"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="phone_number"
                                          id="phone_number"
                                          min={0}
                                          minLength={10}
                                          maxLength={11}
                                          placeholder="Nhập số điện thoại"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="phone_number"
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
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="order_index" sm={4}>
                                    Thứ tự hiển thị{" "}
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="order_index"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type={`number`}
                                          name="order_index"
                                          className="text-right"
                                          id="order_index"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="order_index"
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
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="author_degree" sm={4}>
                                    Học vị
                                  </Label>
                                  <Col sm={8}>
                                    <InputGroup>
                                      <Field
                                        name="author_degree"
                                        render={({ field /* _form */ }) => (
                                          <Input
                                            {...field}
                                            onBlur={null}
                                            type={`text`}
                                            name="author_degree"
                                            id="author_degree"
                                            disabled={noEdit}
                                          />
                                        )}
                                      />
                                    </InputGroup>
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={12}>
                                <FormGroup row>
                                  <Label for="about_me" sm={2}>
                                    Giới thiệu sơ lược
                                  </Label>
                                  <Col sm={10}>
                                    <Field
                                      name="about_me"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="textarea"
                                          name="about_me"
                                          id="about_me"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="about_me"
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

                            {authorEnt ? (
                              <Row className="my-3 mb15">
                                <Col sm={2}></Col>
                                <Col sm={10} xs={12}>
                                  <Link
                                    to={`/products?author_id=${authorEnt.author_id}`}
                                    component={this.FancyLink}
                                  >
                                    <b>
                                      {" "}
                                      <i
                                        className="fa fa-book mr-2"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Sách của tác giả
                                    </b>
                                  </Link>
                                  <Link
                                    to={`/news?author_id=${authorEnt.author_id}`}
                                    component={this.FancyLink}
                                  >
                                    <b>
                                      {" "}
                                      <i
                                        className="fa fa-newspaper-o mr-2"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Bài viết của tác giả
                                    </b>
                                  </Link>
                                </Col>
                              </Row>
                            ) : null}
                            <Row className="mb15">
                              <Col xs={12}>
                                <b className="underline">
                                  Chứng minh nhân dân/ Thẻ căn cước
                                </b>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="identity_number" sm={4}>
                                    Số CMND/ Thẻ căn cước
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="identity_number"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="identity_number"
                                          id="identity_number"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage name="identity_number" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="identity_date" sm={4}>
                                    Ngày cấp
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="identity_date"
                                      render={({
                                        date,
                                        form: {
                                          setFieldValue,
                                          setFieldTouched,
                                          values,
                                        },
                                        field,
                                        ...props
                                      }) => {
                                        return (
                                          <DatePicker
                                            id="identity_date"
                                            date={
                                              values.identity_date
                                                ? moment(values.identity_date)
                                                : null
                                            }
                                            onDateChange={(date) => {
                                              setFieldValue(
                                                "identity_date",
                                                date
                                              );
                                            }}
                                            renderMonthElement
                                            disabled={noEdit}
                                            autoUpdateInput
                                            // maxToday
                                          />
                                        );
                                      }}
                                    />
                                    {/* <ErrorMessage name="identity_date" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} /> */}
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={12}>
                                <FormGroup row>
                                  <Label for="identity_place" sm={2}>
                                    Nơi cấp
                                  </Label>
                                  <Col sm={10}>
                                    <Field
                                      name="identity_place"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="identity_place"
                                          id="identity_place"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    {/* <ErrorMessage name="identity_place" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} /> */}
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={2}>
                                <FormGroup row>
                                  <Label sm={12}>
                                    {" "}
                                    Ảnh CMND / Thẻ căn cước
                                  </Label>
                                </FormGroup>
                              </Col>

                              <Col xs={12} sm={10}>
                                <FormGroup row>
                                  <Col xs={12} sm={6}>
                                    <FormGroup row>
                                      {/* <Label sm={4}></Label> */}
                                      <Col xs={12} sm={12}>
                                        <Col xs={12} sm={12}>
                                          <FormGroup row>
                                            <Label
                                              sm={12}
                                              className="text-center"
                                              htmlFor="identity_front_image"
                                            >
                                              {" "}
                                              Ảnh mặt trước
                                            </Label>
                                          </FormGroup>
                                        </Col>
                                        {!this.state.clearImageFront && (
                                          <Field
                                            name="identity_front_image"
                                            render={({ field }) => {
                                              return (
                                                <div className="author-banner-upload">
                                                  <Upload
                                                    onChange={(img) =>
                                                      field.onChange({
                                                        target: {
                                                          name: field.name,
                                                          value: img,
                                                        },
                                                      })
                                                    }
                                                    imageUrl={
                                                      values.identity_front_image
                                                    }
                                                    accept="image/*"
                                                    disabled={noEdit}
                                                  />
                                                </div>
                                              );
                                            }}
                                          />
                                        )}
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                  <Col xs={12} sm={6}>
                                    <FormGroup row>
                                      <Col xs={12} sm={12}>
                                        <Col xs={12} sm={12}>
                                          <FormGroup row>
                                            <Label
                                              sm={12}
                                              className="text-center"
                                              htmlFor="identity_back_image"
                                            >
                                              {" "}
                                              Ảnh mặt sau
                                            </Label>
                                          </FormGroup>
                                        </Col>
                                        {!this.state.clearImageBack && (
                                          <Field
                                            name="identity_back_image"
                                            render={({ field }) => {
                                              return (
                                                <div className="author-banner-upload">
                                                  <Upload
                                                    onChange={(img) =>
                                                      field.onChange({
                                                        target: {
                                                          name: field.name,
                                                          value: img,
                                                        },
                                                      })
                                                    }
                                                    imageUrl={
                                                      values.identity_back_image
                                                    }
                                                    accept="image/*"
                                                    disabled={noEdit}
                                                  />
                                                </div>
                                              );
                                            }}
                                          />
                                        )}
                                        {/* <ErrorMessage name="identity_back_image" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} /> */}
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>

                            <Address className="row">
                              {(addrProps) => {
                                let {
                                  CountryComponent,
                                  ProvinceComponent,
                                  DistrictComponent,
                                  WardComponent,
                                } = addrProps;
                                return (
                                  <Col xs={12}>
                                    <FormGroup row>
                                      <Label sm={2}>
                                        <b className="underline">
                                          Địa chỉ
                                          {/* <span className="font-weight-bold red-text">
                                            *
                                          </span> */}
                                        </b>
                                      </Label>
                                      <Col sm={10}>
                                        <Row>
                                          <Col xs={12} sm={6} className="mb-1">
                                            <Field
                                              name="country_id"
                                              render={({ field, form }) => {
                                                return (
                                                  <CountryComponent
                                                    id={field.name}
                                                    name={field.name}
                                                    onChange={({ value }) => {
                                                      // change?
                                                      if (
                                                        "" +
                                                          values[field.name] !==
                                                        "" + value
                                                      ) {
                                                        return form.setValues(
                                                          Object.assign(
                                                            values,
                                                            {
                                                              [field.name]:
                                                                value,
                                                              province_id: "",
                                                              district_id: "",
                                                              ward_id: "",
                                                            }
                                                          )
                                                        );
                                                      }
                                                      field.onChange({
                                                        target: {
                                                          name: field.name,
                                                          value,
                                                        },
                                                      });
                                                    }}
                                                    value={values[field.name]}
                                                    isDisabled={noEdit}
                                                  />
                                                );
                                              }}
                                            />
                                            <ErrorMessage
                                              name="country_id"
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
                                          <Col xs={12} sm={6} className="mb-1">
                                            <Field
                                              key={`province_of_${values.country_id}`}
                                              name="province_id"
                                              render={({ field, form }) => {
                                                // console.log(values[field.name])
                                                return (
                                                  <ProvinceComponent
                                                    id={field.name}
                                                    name={field.name}
                                                    onChange={({ value }) => {
                                                      // change?
                                                      if (
                                                        "" +
                                                          values[field.name] !==
                                                        "" + value
                                                      ) {
                                                        return form.setValues(
                                                          Object.assign(
                                                            values,
                                                            {
                                                              [field.name]:
                                                                value,
                                                              district_id: "",
                                                              ward_id: "",
                                                            }
                                                          )
                                                        );
                                                      }
                                                      field.onChange({
                                                        target: {
                                                          name: field.name,
                                                          value,
                                                        },
                                                      });
                                                    }}
                                                    mainValue={
                                                      values.country_id
                                                    }
                                                    value={values[field.name]}
                                                    isDisabled={noEdit}
                                                  />
                                                );
                                              }}
                                            />
                                            <ErrorMessage
                                              name="province_id"
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
                                        </Row>
                                        <Row>
                                          <Col xs={12} sm={6} className="mb-1">
                                            <Field
                                              key={`district_of_${values.province_id}`}
                                              name="district_id"
                                              render={({ field, form }) => {
                                                return (
                                                  <DistrictComponent
                                                    id={field.name}
                                                    name={field.name}
                                                    onChange={({ value }) => {
                                                      // change?
                                                      if (
                                                        "" +
                                                          values[field.name] !==
                                                        "" + value
                                                      ) {
                                                        return form.setValues(
                                                          Object.assign(
                                                            values,
                                                            {
                                                              [field.name]:
                                                                value,
                                                              ward_id: "",
                                                            }
                                                          )
                                                        );
                                                      }
                                                      field.onChange({
                                                        target: {
                                                          name: field.name,
                                                          value,
                                                        },
                                                      });
                                                    }}
                                                    mainValue={
                                                      values.province_id
                                                    }
                                                    value={values[field.name]}
                                                    isDisabled={noEdit}
                                                  />
                                                );
                                              }}
                                            />
                                            <ErrorMessage
                                              name="district_id"
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
                                          <Col xs={12} sm={6} className="mb-1">
                                            <Field
                                              key={`ward_of_${values.district_id}`}
                                              name="ward_id"
                                              render={({
                                                field /*, form*/,
                                              }) => {
                                                return (
                                                  <WardComponent
                                                    id={field.name}
                                                    name={field.name}
                                                    onChange={({ value }) =>
                                                      field.onChange({
                                                        target: {
                                                          name: field.name,
                                                          value,
                                                        },
                                                      })
                                                    }
                                                    mainValue={
                                                      values.district_id
                                                    }
                                                    value={values[field.name]}
                                                    isDisabled={noEdit}
                                                  />
                                                );
                                              }}
                                            />
                                            <ErrorMessage
                                              name="ward_id"
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
                                        </Row>
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                );
                              }}
                            </Address>
                            <Row>
                              <Col xs={12}>
                                <FormGroup row>
                                  <Label for="address" sm={2}>
                                    Địa chỉ cụ thể
                                    {/* <span className="font-weight-bold red-text">
                                      *
                                    </span> */}
                                  </Label>
                                  <Col sm={10}>
                                    <Field
                                      name="address"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="address"
                                          id="address"
                                          placeholder="Nhập địa chỉ cụ thể"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="address"
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
                              <Col sm={12} xs={12}>
                                <FormGroup row>
                                  <Label for="banner_image" sm={2}>
                                    <b className="underline">Banner</b>
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={5} xs={12}>
                                    <label className="text-center mb-0 mt-3 w-100">
                                      Phiên bản máy tính
                                    </label>
                                    <Field
                                      name="banner_image"
                                      render={({ field }) => {
                                        return (
                                          <div className="author-banner-upload">
                                            <Upload
                                              onChange={(img) =>
                                                field.onChange({
                                                  target: {
                                                    name: field.name,
                                                    value: img,
                                                  },
                                                })
                                              }
                                              imageUrl={values.banner_image}
                                              accept="image/*"
                                              disabled={noEdit}
                                              label="Upload (Ưu tiên ảnh có chiều ngang 1600px)"
                                              // beforeUpload={
                                              //   this.beforeUploadBannerImage
                                              // }
                                            />
                                          </div>
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="banner_image"
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
                                  <Col sm={5} xs={12}>
                                    <label className="text-center mb-0 mt-3 w-100">
                                      Phiên bản di động
                                    </label>
                                    {
                                      <Field
                                        name="banner_image_mobile"
                                        render={({ field }) => {
                                          return (
                                            <div className="author-banner-upload">
                                              <Upload
                                                onChange={(img) =>
                                                  field.onChange({
                                                    target: {
                                                      name: field.name,
                                                      value: img,
                                                    },
                                                  })
                                                }
                                                imageUrl={
                                                  values.banner_image_mobile
                                                }
                                                accept="image/*"
                                                disabled={noEdit}
                                                label="Upload (Ưu tiên ảnh có kích thước 450px * 965px)"
                                                // beforeUpload={
                                                //   this.beforeUploadBannerImage
                                                // }
                                              />
                                            </div>
                                          );
                                        }}
                                      />
                                    }
                                    <ErrorMessage
                                      name="banner_image_mobile"
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
                            {/* <Row>
                              <FormSelectGroup
                                isRequired
                                label="Danh mục bài viết"
                                name="news_category"
                                isMulti
                                isObject
                                smColSelect={10}
                                smColLabel={2}
                                isEdit={!noEdit}
                                placeHolder={"-- Chọn danh mục bài viết--"}
                                list={newsCategoryOpts}
                                onChange={(values, field) =>
                                  this.handleCategoryChange(values, field)
                                }
                              />
                            </Row> */}
                          </Col>
                          <Col xs={12} md={12}>
                            <Row>
                              <Col sm={12}>
                                <FormGroup >
                                  <Label for="introduce" sm={4}>
                                    <b className="underline">
                                      Giới thiệu bản thân
                                    </b>
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={12} xs={12}>
                                    <Editor
                                      apiKey={
                                        "3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"
                                      }
                                      scriptLoading={{ delay: 500 }}
                                      value={values.introduce}
                                      disabled={noEdit}
                                      init={{
                                        height: "300px",
                                        width: "100%",
                                        menubar: false,
                                        branding: false,
                                        statusbar : false,
                                        plugins: [
                                          "advlist autolink fullscreen lists link image charmap print preview anchor",
                                          "searchreplace visualblocks code fullscreen ",
                                          "insertdatetime media table paste code help ",
                                          "image imagetools ",
                                        ],
                                        menubar:
                                          "file edit view insert format tools table tc help",
                                        toolbar1:
                                          "undo redo | fullscreen | formatselect | bold italic backcolor | \n" +
                                          "alignleft aligncenter alignright alignjustify",
                                        toolbar2:
                                          "bullist numlist outdent indent | removeformat | help | image",
                                        file_picker_types: "image",
                                        images_dataimg_filter: function (img) {
                                          return img.hasAttribute(
                                            "internal-blob"
                                          );
                                        },
                                        images_upload_handler:
                                          this.handleUploadImage,
                                      }}
                                      onEditorChange={(newValue) => {
                                        formikProps.setFieldValue(
                                          "introduce",
                                          newValue
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="introduce"
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
                                <FormGroup >
                                  <Label for="education_career" sm={4}>
                                    <b className="underline">
                                      Học vấn & sự nghiệp
                                    </b>
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={12} xs={12}>
                                    <Editor
                                      apiKey={
                                        "3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"
                                      }
                                      scriptLoading={{ delay: 500 }}
                                      value={values.education_career}
                                      disabled={noEdit}
                                      init={{
                                        height: "300px",
                                        width: "100%",
                                        menubar: false,
                                        branding: false,
                                        statusbar : false,
                                        plugins: [
                                          "advlist autolink fullscreen lists link image charmap print preview anchor",
                                          "searchreplace visualblocks code fullscreen ",
                                          "insertdatetime media table paste code help ",
                                          "image imagetools ",
                                        ],
                                        menubar:
                                          "file edit view insert format tools table tc help",
                                        toolbar1:
                                          "undo redo | fullscreen | formatselect | bold italic backcolor | \n" +
                                          "alignleft aligncenter alignright alignjustify",
                                        toolbar2:
                                          "bullist numlist outdent indent | removeformat | help | image",
                                        file_picker_types: "image",
                                        images_dataimg_filter: function (img) {
                                          return img.hasAttribute(
                                            "internal-blob"
                                          );
                                        },
                                        images_upload_handler:
                                          this.handleUploadImage,
                                      }}
                                      onEditorChange={(newValue) => {
                                        formikProps.setFieldValue(
                                          "education_career",
                                          newValue
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="education_career"
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
                                <FormGroup >
                                  <Label for="author_quote" sm={4}>
                                    <b className="underline">
                                      Chuyên gia nói về Thần Số Học
                                    </b>
                                  </Label>
                                  <Col sm={12} xs={12}>
                                    <Field
                                      name="author_quote"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="textarea"
                                          name="author_quote"
                                          id="author_quote"
                                          className="author_quote_textarea"
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
                                  <Label sm={2}></Label>
                                  <Col sm={4}>
                                    {/* <Label for="is_review_news" sm={4}></Label> */}
                                    <Col sm={12} className="px-0">
                                      <Field
                                        name="is_review_news"
                                        render={({ field }) => (
                                          <CustomInput
                                            {...field}
                                            className="pull-left"
                                            onBlur={null}
                                            checked={values.is_review_news}
                                            type="checkbox"
                                            id="is_review_news"
                                            label="Tự động duyệt bài"
                                            onChange={(event) => {
                                              const { target } = event;
                                              field.onChange({
                                                target: {
                                                  name: field.name,
                                                  value: target.checked,
                                                },
                                              });
                                            }}
                                            disabled={noEdit}
                                          />
                                        )}
                                      />
                                    </Col>
                                  </Col>
                                  <Col sm={4}>
                                    {/* <Label for="is_active" sm={4}></Label> */}
                                    <Col sm={12} className="px-0">
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
                                            label="Kích hoạt"
                                            onChange={(event) => {
                                              const { target } = event;
                                              field.onChange({
                                                target: {
                                                  name: field.name,
                                                  value: target.checked,
                                                },
                                              });
                                            }}
                                            disabled={noEdit}
                                          />
                                        )}
                                      />
                                    </Col>
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12} className="text-right">
                                {noEdit ? (
                                  <CheckAccess permission="CRM_AUTHOR_EDIT">
                                    <Button
                                      color="primary"
                                      className="mr-2 btn-block-sm"
                                      onClick={() =>
                                        window._$g.rdr(
                                          `/author/edit/${authorEnt.author_id}`
                                        )
                                      }
                                    >
                                      <i className="fa fa-edit mr-1" />
                                      Chỉnh sửa
                                    </Button>
                                  </CheckAccess>
                                ) : (
                                  [
                                    authorEnt && authorEnt.author_id && (
                                      <CheckAccess
                                        key="buttonAuthorPassword"
                                        permission="CRM_AUTHOR_PASSWORD"
                                      >
                                        <Button
                                          color="warning text-white"
                                          className="mr-2 btn-block-sm"
                                          onClick={() =>
                                            window._$g.rdr(
                                              `/author/change-password/${authorEnt.author_id}`
                                            )
                                          }
                                        >
                                          <i className="fa fa-lock mr-1"></i>
                                          Thay đổi mật khẩu
                                        </Button>
                                      </CheckAccess>
                                    ),
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
                                  onClick={() => window._$g.rdr("/author")}
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
