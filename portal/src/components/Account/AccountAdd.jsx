import React, { useState, useEffect } from "react";
import {
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
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import { useFormik } from "formik";
import { initialValues } from "./const";
import { readFileAsBase64 } from "../../utils/html";
import AccountModel from "../../models/AccountModel";
import DatePicker from "../Common/DatePicker";
import moment from "moment";
import { Radio } from "antd";
import Upload from "../Common/Antd/Upload";
import AcccountAddress from "./AcccountAddress";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Modal } from "antd";
import "./styles.scss";
import "./style.css";
import * as yup from "yup";
import Select from "react-select";
import SearchHistory from "./SearchHistory/SearchHistory";
import AccountEdit from "./AccountEdit";
import AccountEntity from "models/AccountEntity/index";
import { Checkbox } from "antd";

layoutFullWidthHeight();
function AccountAdd({ noEdit }) {
  let { id } = useParams();
  const [activeTab, setActiveTab] = useState("INFO");
  const [dataAccount, setDataAccount] = useState(initialValues);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [value, setValue] = useState(1);
  const [state, setState] = useState();
  const _accountModel = new AccountModel();
  const [btnType, setbtnType] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordconfirm] = useState("");
  const [alerPassword, setAlerPassword] = useState("");
  const [dataType, setDataType] = useState("");
  const validationSchema = yup.object().shape({
    user_name: yup
      .string()
      .required("Tên đăng nhập không được để trống .")
      .nullable()
      .email("Vui lòng nhập tên đăng nhập theo đinh dạng email ."),
    pass_word: id
      ? undefined
      : yup
          .string()
          .required("Mật khẩu không được để trống .")
          .matches(
            /^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})((?=.*[0-9]){1})((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "Mật khẩu tối thiêu 6 ký tự, 1 ký tự thường, 1 ký tự đặc biệt, 1 ký tự hoa và 1 số ."
          ),
    full_name: yup.string().required("Họ và tên khai sinh không được để trống .").nullable(),
    nick_name: yup.string().required("Họ và tên không được để trống .").nullable(),
    birth_day: yup.string().required("Ngày sinh không được để trống .").nullable(),
    email: yup
      .string()
      .required("Email không được để trống .")
      .nullable()
      .email("Vui lòng nhập tên đăng nhập theo đinh dạng email ."),
    id_card: yup.string().required("Số CMND/CCCD không được để trống .").nullable(),
    id_card_place: yup.string().required("Nơi cấp không được để trống .").nullable(),
    id_card_date: yup.string().required("Ngày cấp không được để trống .").nullable(),
    // ward_id: yup.string().required("Phường/ Xã không được để trống !").nullable(),
    // province_id: yup.string().required("Tỉnh/ Thành phố không được để trống !").nullable(),
    // district_id: yup.string().required("Quận/ Huyện không được để trống !").nullable(),
    // phone_number: yup
    //   .string()
    //   .required("Số điện thoại không được để trống .")
    //   .matches(/^[0-9]{7,10}$/, "Số điện thoại không hợp lệ")
    //   .nullable(),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataAccount,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      if (id) {
        handleUpdateAcount(values);
      } else {
        handleCreateAcount(values);
      }
    },
  });
  //// update account
  const handleUpdateAcount = async (values) => {
    values.birth_day=moment(values.birth_day)
    values.id_card_date=moment(values.id_card_date)

    try {
      await _accountModel.check({ email: values.email }).then((data) => {
        if (data.MEMBERID && formik.values.email != dataAccount.email) {
          formik.setFieldError("email", "Email đã tồn tại!");
        } else {
          _accountModel.checkIdCard({ id_card: values.id_card }).then((data) => {
            if (data.MEMBERID && formik.values.id_card != dataAccount.id_card) {
              formik.setFieldError("id_card", "Mã số chứng minh nhân dân đã tồn tại  đã tồn tại!");
            } else {
              _accountModel.checkPhone({ phone_number: values.phone_number }).then((data) => {
                if (data.MEMBERID && formik.values.phone_number != dataAccount.phone_number) {
                  formik.setFieldError("phone_number", "Số điện thoại đã tồn tại đã tồn tại!");
                } else {
                  _accountModel.update(id, values).then((data) => {
                    if (btnType == "save") {
                      if(id){
                        _initDataDetail()
                      }else{
                        formik.resetForm();
                      }
                      window._$g.toastr.show("Lưu thành công!", "success");
                    } else if (btnType == "save&quit") {
                      window._$g.toastr.show("Lưu thành công!", "success");
                      setDataAccount(initialValues);
                      return window._$g.rdr("/account");
                    }
                  });
                }
              });
            }
          });
        }
      });
    } catch (error) {}finally {
      formik.setSubmitting(false);
      window.scrollTo(0, 0);

    }
  };
  ///// get data partnert
  useEffect(() => {
    const _callAPI = async () => {
      try {
        await _accountModel.getListCustomerType().then((data) => {
          setDataType(data.items);
          if (!id) {
            data.items.map((item, index) => {
              if (item.is_default == 1) {
                formik.setFieldValue("customer_type_id", item.customer_type_id);
                // console.log(item)
              }
            });
          }
        });
      } catch (error) {
        // console.log(error);
        window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
      }
    };
    _callAPI();
  }, []);
  // console.log(dataAccount)
  //// create account
  const handleCreateAcount = async (values) => {
    try {
      await _accountModel.check({ email: values.email }).then((data) => {
        if (data.MEMBERID && formik.values.email != dataAccount.email) {
          formik.setFieldError("email", "Email đã tồn tại!");
        } else {
          _accountModel.checkIdCard({ id_card: values.id_card }).then((data) => {
            if (data.MEMBERID && formik.values.id_card != dataAccount.id_card) {
              formik.setFieldError("id_card", "Mã số chứng minh nhân dân đã tồn tại  đã tồn tại!");
            } else {
              _accountModel.checkPhone({ phone_number: values.phone_number }).then((data) => {
                if (data.MEMBERID && formik.values.phone_number != dataAccount.phone_number) {
                  formik.setFieldError("phone_number", "Số điện thoại đã tồn tại đã tồn tại!");
                } else {
                  _accountModel.create(values).then((data) => {
                    if (btnType == "save") {
                      formik.resetForm();
                      _initData();
                      window._$g.toastr.show("Lưu thành công!", "success");
                    } else if (btnType == "save&quit") {
                      window._$g.toastr.show("Lưu thành công!", "success");
                      setDataAccount(initialValues);
                      return window._$g.rdr("/account");
                    }
                  });
                }
              });
            }
          });
        }
      });
    } catch (error) {}
  };
  //// scroll to error
  useEffect(() => {
    if (!formik.isSubmitting) return;
    if (Object.keys(formik.errors).length > 0) {
      document.getElementsByName(Object.keys(formik.errors)[0])[0].focus();
    }
  }, [formik]);
  ////gen code
  const _initData = async () => {
    try {
      await _accountModel.GenCode().then((data) => {
        formik.setFieldValue("customer_code", data.customer_code);
        // formik.setFieldValue("customer_code", data.customer_code);
      });
    } catch (error) {
      // console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };
  useEffect(() => {
    _initData();
  }, []);
  const _initDataDetail = async () => {
    try {
      await _accountModel.read(id).then((data) => {
        // console.log(data)
        setDataAccount(data);
      });
    } catch (error) {
      // console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };
  useEffect(() => {
    if (id) {
      _initDataDetail();
    }
  }, [id]);
  /////// config img
  const handleUserImageChange = (event) => {
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
          formik.setFieldValue("image_avatar", usrImgBase64[0]);
        })
        .catch((err) => {
          window._$g.dialogs.alert(window._$g._(err.message));
        });
    }
  };
  //config modal
  const handleOk = async () => {
    if (password == "" || password_confirm == "") {
      setAlerPassword("Vui lòng điền đầy đủ thông tin");
    } else if (password != password_confirm) {
      setAlerPassword("Mật khẩu nhập lại không đúng");
    } else {
      setAlerPassword("");
      try {
        let formData = { password: password };
        await _accountModel.changePassword(id, formData).then((data) => {
          window._$g.toastr.show("thay đổi mật khẩu thành công!", "success");
          _initDataDetail();
          setIsModalVisible(false);
        });
      } catch (error) {
        // console.log(error);
        window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  ////config select
  const convertValue = (value, options) => {
    // console.log(value)
    if (!(typeof value === "object") && options && options.length) {
      value = ((_val) => {
        return options.find((item) => "" + item.value === "" + _val);
      })(value);
    } else if (Array.isArray(value) && options && options.length) {
      return options.filter((item) => {
        return value.find((e) => e == item.value);
      });
    }
    // console.log(value)
    return value;
  };
  const getOptionAttribute = () => {
    if (dataType && dataType.length) {
      return dataType.map((item) => {
        // console.log(dataPartner);
        return formik.values.customer_type_id == item.customer_type_id
          ? {
              value: item.customer_type_id,
              label: item.customer_type_name,
              isDisabled: true,
            }
          : {
              value: item.customer_type_id,
              label: item.customer_type_name,
            };
      });
    }
    return [];
  };
  const handleChangeAttribute = async (value, index) => {
    // let listcl = [...formik.values.main_number_img];
    // listcl[index].partner_id = value ? value.value : null;
    formik.setFieldValue("customer_type_id", value.value);
  };
  return (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <b>{id ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} khách hàng </b>
            </CardHeader>

            <CardBody>
              <Row>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={`${activeTab === "INFO" ? "active" : ""}`}
                      onClick={() => setActiveTab("INFO")}
                    >
                      Thông tin tài khoản
                    </NavLink>
                  </NavItem>
                </Nav>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={`${activeTab === "SEARCHHISTORY" ? "active" : ""}`}
                      onClick={() => setActiveTab("SEARCHHISTORY")}
                    >
                      Lịch sử tra cứu
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} style={{ width: "100%" }}>
                  <TabPane tabId={"INFO"}>
                    <Form id="formInfo" onSubmit={formik.handleSubmit}>
                      <Row>
                        <Col xs={12} sm={3}>
                          <FormGroup row>
                            <Col sm={12}>
                              <div className="ps-relative">
                                {formik.values.image_avatar ? (
                                  <Media
                                    object
                                    src={formik.values.image_avatar}
                                    alt="User image"
                                    // className="user-imgage"
                                    className="user-imgage radius-50-percent"
                                  />
                                ) : (
                                  <i
                                    style={{
                                      fontSize: 50,
                                      paddingTop: 65,
                                      paddingLeft: 70,
                                    }}
                                    className="user-imgage radius-50-percent fa fa-plus"
                                  />
                                )}
                                <Input
                                  type="file"
                                  id="icon"
                                  className="input-overlay"
                                  onChange={handleUserImageChange}
                                  disabled={noEdit}
                                />
                              </div>
                              <div className="justify-content-center text-center">
                                {formik.values.customer_code ? (
                                  <b>
                                    {formik.values.customer_code
                                      ? formik.values.customer_code
                                      : null}{" "}
                                    - {formik.values.full_name ? formik.values.full_name : null}
                                  </b>
                                ) : null}
                              </div>
                            </Col>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={9}>
                          <Row className="mb15">
                            <Col xs={12}>
                              <b className="underline">Thông tin tài khoản</b>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="user_name" sm={4}>
                                  Tên đăng nhập <span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={8}>
                                  <Input
                                    name="user_name"
                                    id="user_name"
                                    type="text"
                                    placeholder="Tên đăng nhập"
                                    disabled={id}
                                    value={formik.values.user_name}
                                    onChange={(e) => {
                                      formik.setFieldValue("user_name", e.target.value);
                                      formik.setFieldValue("email", e.target.value);
                                    }}
                                  />
                                  {formik.errors.user_name && (
                                    <div
                                      className="field-validation-error alert alert-danger fade show"
                                      role="alert"
                                    >
                                      {formik.errors.user_name}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                            </Col>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="pass_word" sm={4}>
                                  Mật khẩu<span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={8}>
                                  <InputGroup>
                                    <Input
                                      // onBlur={null}
                                      type={`${passwordVisible ? "text" : "password"}`}
                                      name="pass_word"
                                      id="pass_word"
                                      placeholder="******"
                                      disabled={noEdit}
                                      value={formik.values.pass_word}
                                      onChange={formik.handleChange}
                                    />
                                    {id ? (
                                      <CheckAccess permission="CRM_ACCOUNT_EDIT">
                                        <InputGroupAddon addonType="append">
                                          <Button
                                            color="success"
                                            block
                                            onClick={() => {
                                              setIsModalVisible(true);
                                            }}
                                          >
                                            Đổi mật khẩu
                                          </Button>
                                        </InputGroupAddon>
                                      </CheckAccess>
                                    ) : (
                                      <InputGroupAddon addonType="append">
                                        <Button
                                          block
                                          onClick={() => {
                                            setPasswordVisible(!passwordVisible);
                                          }}
                                        >
                                          <i
                                            className={`fa ${
                                              passwordVisible ? "fa-eye" : "fa-eye-slash"
                                            }`}
                                          />
                                        </Button>
                                      </InputGroupAddon>
                                    )}
                                  </InputGroup>
                                  {formik.errors.pass_word && (
                                    <div
                                      className="field-validation-error alert alert-danger fade show"
                                      role="alert"
                                    >
                                      {formik.errors.pass_word}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="user_name" sm={4}>
                                  Mã khách hàng
                                </Label>
                                <Col sm={8}>
                                  <Input
                                    name="customer_code"
                                    id="customer_code"
                                    type="text"
                                    // placeholder="Tên đăng nhập"
                                    disabled={true}
                                    value={formik.values.customer_code}
                                    // onChange={formik.handleChange}
                                  />
                                </Col>
                              </FormGroup>
                            </Col>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="Password" sm={4}>
                                  Ngày đăng ký
                                </Label>
                                <Col sm={8}>
                                  {formik.values.register_date ? (
                                    <Input
                                      name="register_date"
                                      id="register_date"
                                      type="text"
                                      // placeholder="Tên đăng nhập"
                                      disabled={true}
                                      value={formik.values.register_date}
                                      // onChange={formik.handleChange}
                                    />
                                  ) : (
                                    <DatePicker
                                      id="register_date"
                                      date={moment()}
                                      disabled={true}
                                      maxToday
                                    />
                                  )}
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="user_name" sm={4}>
                                  Loại khách hàng{" "}
                                  <span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={8}>
                                  <Select
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                    isDisabled={noEdit}
                                    placeholder={"-- Chọn --"}
                                    value={
                                      convertValue(
                                        formik.values.customer_type_id,
                                        getOptionAttribute()
                                      ) ||
                                      convertValue(
                                        {
                                          value: formik.values.customer_type_id,
                                          label: formik.values.customer_type_name,
                                        },
                                        getOptionAttribute()
                                      )
                                    }
                                    options={getOptionAttribute(
                                      formik.values.customer_type_id,
                                      true
                                    )}
                                    onChange={(value) => handleChangeAttribute(value)}
                                  />
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row className="mb15">
                            <Col xs={12}>
                              <b className="underline">Thông tin cá nhân</b>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="nick_name" sm={4}>
                                  Họ và tên <span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={8}>
                                  <Input
                                    name="nick_name"
                                    id="nick_name"
                                    type="text"
                                    placeholder="Họ và tên đệm"
                                    disabled={noEdit}
                                    value={formik.values.nick_name}
                                    onChange={formik.handleChange}
                                  />
                                  {formik.errors.nick_name && (
                                    <div
                                      className="field-validation-error alert alert-danger fade show"
                                      role="alert"
                                    >
                                      {formik.errors.nick_name}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                            </Col>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="user_name" sm={4}>
                                  Họ và tên khai sinh
                                  <span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={8}>
                                  <Input
                                    name="full_name"
                                    id="full_name"
                                    type="text"
                                    placeholder="Tên khai sinh"
                                    disabled={noEdit}
                                    value={formik.values.full_name}
                                    onChange={formik.handleChange}
                                  />
                                  {formik.errors.full_name && (
                                    <div
                                      className="field-validation-error alert alert-danger fade show"
                                      role="alert"
                                    >
                                      {formik.errors.full_name}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="nick_name" sm={4}>
                                  Ngày sinh <span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={8}>
                                  <DatePicker
                                    id="birth_day"
                                    date={
                                      formik.values.birth_day
                                        ? moment(formik.values.birth_day)
                                        : null
                                    }
                                    onDateChange={(dates) => {
                                      // setFieldValue("birth_day", dates);
                                      formik.setFieldValue("birth_day", dates);
                                    }}
                                    disabled={noEdit}
                                    maxToday
                                  />
                                  {formik.errors.birth_day && (
                                    <div
                                      className="field-validation-error alert alert-danger fade show"
                                      role="alert"
                                    >
                                      {formik.errors.birth_day}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                            </Col>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="user_name" sm={4}>
                                  Giới tính<span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={8}>
                                  <Radio.Group
                                    disabled={noEdit}
                                    onChange={(e) => {
                                      // setValue(e.target.value);
                                      formik.setFieldValue("gender", e.target.value);
                                    }}
                                    value={formik.values.gender}
                                  >
                                    <Radio value={1}>Nam</Radio>
                                    <Radio value={0}>Nữ</Radio>
                                  </Radio.Group>
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="nick_name" sm={4}>
                                  Tình trạng hôn nhân{" "}
                                </Label>
                                <Col sm={8}>
                                  <Radio.Group
                                    disabled={noEdit}
                                    onChange={(e) => {
                                      // setValue(e.target.value);
                                      formik.setFieldValue("marital_status", e.target.value);
                                    }}
                                    value={formik.values.marital_status}
                                  >
                                    <Radio value={0}>Chưa kết hôn</Radio>
                                    <Radio value={1}>Đã kết hôn</Radio>
                                  </Radio.Group>
                                </Col>
                              </FormGroup>
                            </Col>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="user_name" sm={4}>
                                  Số điện thoại
                                </Label>
                                <Col sm={8}>
                                  <Input
                                    name="phone_number"
                                    id="phone_number"
                                    type="text"
                                    placeholder="Số điện thoại"
                                    disabled={noEdit}
                                    value={formik.values.phone_number}
                                    onChange={formik.handleChange}
                                  />
                                  {formik.errors.phone_number && (
                                    <div
                                      className="field-validation-error alert alert-danger fade show"
                                      role="alert"
                                    >
                                      {formik.errors.phone_number}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="email" sm={4}>
                                  Email<span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={8}>
                                  <Input
                                    name="email"
                                    id="email"
                                    type="text"
                                    placeholder="email"
                                    disabled={noEdit}
                                    value={formik.values.email}
                                    onChange={(e) => {
                                      formik.setFieldValue("user_name", e.target.value);
                                      formik.setFieldValue("email", e.target.value);
                                    }}
                                  />
                                  {formik.errors.email && (
                                    <div
                                      className="field-validation-error alert alert-danger fade show"
                                      role="alert"
                                    >
                                      {formik.errors.email}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                              {id ? (
                                <Label for="email">
                                  <span className="red-text pd-0">
                                    * Thay đổi email là thay đổi tài khoản đang nhập
                                  </span>
                                </Label>
                              ) : null}
                            </Col>
                          </Row>
                          <Row className="mb15">
                            <Col xs={12}>
                              <b className="underline">Chứng minh nhân dân/ Thẻ căn cước</b>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="id_card" sm={4}>
                                  Số CMND<span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={8}>
                                  <Input
                                    name="id_card"
                                    id="id_card"
                                    type="text"
                                    placeholder=" Số CMND"
                                    disabled={noEdit}
                                    value={formik.values.id_card}
                                    onChange={formik.handleChange}
                                  />
                                  {formik.errors.id_card && (
                                    <div
                                      className="field-validation-error alert alert-danger fade show"
                                      role="alert"
                                    >
                                      {formik.errors.id_card}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                            </Col>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="email" sm={4}>
                                  Ngày cấp<span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={8}>
                                  <DatePicker
                                    id="id_card_date"
                                    date={
                                      formik.values.id_card_date
                                        ? moment(formik.values.id_card_date)
                                        : null
                                    }
                                    onDateChange={(dates) => {
                                      // setFieldValue("birth_day", dates);
                                      formik.setFieldValue("id_card_date", dates);
                                    }}
                                    disabled={noEdit}
                                    maxToday
                                  />
                                  {formik.errors.id_card_date && (
                                    <div
                                      className="field-validation-error alert alert-danger fade show"
                                      role="alert"
                                    >
                                      {formik.errors.id_card_date}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={12}>
                              <FormGroup row>
                                <Label for="id_card_place" sm={2}>
                                  Nơi cấp<span className="font-weight-bold red-text">*</span>
                                </Label>
                                <Col sm={10}>
                                  <Input
                                    name="id_card_place"
                                    id="id_card_place"
                                    type="text"
                                    placeholder="Nơi cấp CMND"
                                    disabled={noEdit}
                                    value={formik.values.id_card_place}
                                    onChange={formik.handleChange}
                                  />
                                  {formik.errors.id_card_place && (
                                    <div
                                      className="field-validation-error alert alert-danger fade show"
                                      role="alert"
                                    >
                                      {formik.errors.id_card_place}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={6} sm={6}>
                              <FormGroup>
                                <Label for="id_card_front_image">Ảnh CMND/căn cước mặt trước</Label>

                                <div className="author-banner-upload">
                                  <Upload
                                    onChange={(img) => {
                                      formik.setFieldValue("id_card_front_image", img);
                                    }}
                                    imageUrl={formik.values.id_card_front_image}
                                    accept="image/*"
                                    disabled={noEdit}
                                  />
                                </div>
                              </FormGroup>
                            </Col>
                            <Col xs={6} sm={6}>
                              <FormGroup>
                                <Label for="id_card_back_image">Ảnh CMND/căn cước mặt sau</Label>

                                <div className="author-banner-upload">
                                  <Upload
                                    onChange={(img) => {
                                      formik.setFieldValue("id_card_back_image", img);
                                    }}
                                    imageUrl={formik.values.id_card_back_image}
                                    accept="image/*"
                                    disabled={noEdit}
                                  />
                                </div>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={6} sm={6}>
                              <FormGroup>
                                <Label for="id_card_front_image">Ảnh live</Label>
                                <div className="author-banner-upload">
                                  <Upload
                                    onChange={(img) => {
                                      formik.setFieldValue("live_image", img);
                                    }}
                                    imageUrl={formik.values.live_image}
                                    accept="image/*"
                                    disabled={noEdit}
                                  />
                                </div>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row className="mb15">
                            <AcccountAddress noEdit={noEdit} formik={formik} />
                          </Row>
                          <Row className="mb15">
                            <Col xs={12}>
                              <b className="underline">Mạng xã hội</b>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="nick_name" sm={4}>
                                  Facebook
                                </Label>
                                <Col sm={8}>
                                  <Input
                                    name="facebook"
                                    id="facebook"
                                    type="text"
                                    placeholder="https://www.facebook.com/abc"
                                    disabled={noEdit}
                                    value={formik.values.facebook}
                                    onChange={formik.handleChange}
                                  />
                                </Col>
                              </FormGroup>
                            </Col>
                            <Col xs={12} sm={6}>
                              <FormGroup row>
                                <Label for="user_name" sm={4}>
                                  Twitter
                                </Label>
                                <Col sm={8}>
                                  <Input
                                    name="twitter"
                                    id="twitter"
                                    type="text"
                                    placeholder="https://twitter.com/abc"
                                    disabled={noEdit}
                                    value={formik.values.twitter}
                                    onChange={formik.handleChange}
                                  />
                                </Col>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_active`, e.target.checked ? 1 : 0);
                            }}
                            checked={formik.values.is_active}
                          >
                            Kích hoạt
                          </Checkbox>
                          {/* <CustomInput
                            className="pull-left"
                            onBlur={null}
                            checked={formik.values.is_active}
                            type="switch"
                            id="is_active"
                            label="Kích hoạt"
                            name="is_active"
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue("is_active", e.target.checked ? 1 : 0);
                            }}
                          /> */}
                        </Col>
                      </Row>
                      <div className="text-right mb-2">
                        <div>
                          {noEdit ? (
                            <CheckAccess permission="CRM_ACCOUNT_EDIT">
                              <Button
                                color="primary"
                                className="mr-2 btn-block-sm"
                                onClick={() =>
                                  window._$g.rdr(`/account/edit/${dataAccount.member_id}`)
                                }
                              >
                                <i className="fa fa-edit mr-1" />
                                Chỉnh sửa
                              </Button>
                            </CheckAccess>
                          ) : (
                            <>
                              <button
                                className="mr-2 btn-block-sm btn btn-primary"
                                onClick={() => {
                                  setbtnType("save");
                                }}
                                type="submit"
                              >
                                <i className="fa fa-save mr-1" />
                                Lưu
                              </button>
                              <button
                                className="mr-2 btn-block-sm btn btn-success"
                                onClick={() => {
                                  setbtnType("save&quit");
                                }}
                                type="submit"
                              >
                                <i className="fa fa-save mr-1" />
                                Lưu và đóng
                              </button>
                            </>
                          )}
                          <button
                            className=" btn-block-sm btn btn-secondary"
                            type="button"
                            onClick={() => window._$g.rdr(`/account`)}
                          >
                            <i className="fa fa-times-circle mr-1" />
                            Đóng
                          </button>
                        </div>
                      </div>
                    </Form>
                  </TabPane>
                  <TabPane tabId={"SEARCHHISTORY"}>
                    <SearchHistory id={id} />
                  </TabPane>
                </TabContent>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal
        wrapClassName="vertical-center-modal"
        title={`Đổi mật khẩu`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
        footer={null}
      >
        <Col xs={12} sm={12} className="px-0">
          <FormGroup row>
            <Label for="nick_name" sm={4}>
              Mật khẩu mới <span className="font-weight-bold red-text">*</span>
            </Label>
            <Col sm={8}>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="*******"
                disabled={noEdit}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Col>
          </FormGroup>
        </Col>
        <Col xs={12} sm={12} className="px-0">
          <FormGroup row>
            <Label for="user_name" sm={4}>
              Nhập lại mật khẩu mới<span className="font-weight-bold red-text">*</span>
            </Label>
            <Col sm={8}>
              <Input
                name="password_confirm"
                id="password_confirm"
                type="password"
                placeholder="*******"
                disabled={noEdit}
                onChange={(e) => {
                  setPasswordconfirm(e.target.value);
                }}
              />
            </Col>
          </FormGroup>
        </Col>
        <Col xs={12} className="px-0">
          {alerPassword && (
            <div className="field-validation-error alert alert-danger fade show" role="alert">
              {alerPassword}
            </div>
          )}
        </Col>
        <Col xs={12} className="px-0 text-right">
          <button type="submit" onClick={handleOk} className=" btn-block-sm btn btn-primary mr-2">
            Cập nhật
          </button>
          <button type="button" onClick={handleCancel} className=" btn-block-sm btn btn-secondary">
            Đóng
          </button>
        </Col>
      </Modal>
    </div>
  );
}

export default AccountAdd;
