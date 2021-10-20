import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import { useFormik } from "formik";
import { initialValues } from "./const";
import IngredientModel from "../../models/IngredientModel";
import NumberFormat from "../Common/NumberFormat";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Checkbox } from "antd";
import Select from "react-select";
import * as yup from "yup";

layoutFullWidthHeight();
function FormulaIngredientsAdd({ noEdit }) {
  const _ingredientModel = new IngredientModel();
  const [dataIngredient, setDataIngredient] = useState(initialValues);

  let { id } = useParams();
  const [btnType, setbtnType] = useState("");
  const [dataParamDob, setDataParamDob] = useState([]);
  const [dataParamName, setDataParamName] = useState([]);
  const [dataCalculation, setDataCalculation] = useState([]);
  const [dataIngredientChild, setDataIngredientChild] = useState([]);

  const validationSchema = yup.object().shape({
    ingredient_name: yup.string().required("Tên thành phần không được để trống .").nullable(),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataIngredient,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCreateOrUpdate(values);
    },
  });

  //// create letter
  const handleCreateOrUpdate = (values) => {
    try {
      _ingredientModel.checkIngredient({ ingredient_name: values.ingredient_name }).then((data) => {
        if (data.INGREDIENTID && formik.values.ingredient_name != dataIngredient.ingredient_name) {
          // setalert("Email đã tồn tại!");
          formik.setFieldError("ingredient_name", "Tên thành phần đã tồn tại!");
          // window.scrollTo(0, 0);
        } else {
          _ingredientModel.create(values).then((data) => {
            if (btnType == "save") {
              if (id) {
                _initDataDetail();
              } else {
                formik.resetForm();
              }
              window._$g.toastr.show("Lưu thành công!", "success");
            } else if (btnType == "save&quit") {
              window._$g.toastr.show("Lưu thành công!", "success");
              // setDataInterpret(initialValues);
              return window._$g.rdr("/formula-ingredients");
            }
          });
        }
      });
    } catch (error) {}finally {
      formik.setSubmitting(false);
      window.scrollTo(0, 0);

    }
  };
  //////get data detail
  useEffect(() => {
    if (id) {
      _initDataDetail();
    }
  }, [id]);

  //// data detail
  const _initDataDetail = async () => {
    try {
      _ingredientModel.detail(id).then((data) => {
        if (data.is_total_2_digit == 1) {
          data.is_numletter_digit = data.is_numletter_2digit;
          data.is_total_value_digit = data.is_total_value_2digit;
          data.is_total_letter_first_digit = data.is_total_letter_first_2digit;
          data.is_total_letter_digit = data.is_total_letter_2digit;
        } else if(data.is_total_shortened == 1) {
          data.is_numletter_digit = data.is_numletter_1digit;
          data.is_total_value_digit = data.is_total_value_1digit;
          data.is_total_letter_first_digit = data.is_total_letter_first_1digit;
          data.is_total_letter_digit = data.is_total_letter_1digit;
        }else{
          data.is_numletter_digit = data.is_numletter_noshort;
          data.is_total_value_digit = data.is_total_value_noshort;
          data.is_total_letter_first_digit = data.is_total_letter_first_noshort;
          data.is_total_letter_digit = data.is_total_letter_noshort;
        }
        setDataIngredient(data);
        // formik.setFieldValue(`type`, true);
        // formik.setFieldValue(`is_total`, true);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };
  console.log(formik.values);
  useEffect(() => {
    const _callAPI = () => {
      try {
        _ingredientModel.getListCalculation().then((data) => {
          setDataCalculation(data.items);
          //   console.log(setDataPartner);
        });
        _ingredientModel.getListParamDob().then((data) => {
          setDataParamDob(data.items);

          //   console.log(setDataPartner);
        });
        _ingredientModel.getListParamName().then((data) => {
          setDataParamName(data.items);
          //   console.log(setDataPartner);
        });
        _ingredientModel.getListIngredientChild().then((data) => {
          setDataIngredientChild(data.items);
          //   console.log(setDataPartner);
        });
      } catch (error) {
        console.log(error);
        window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
      }
    };
    _callAPI();
  }, []);
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
  ///////// option Relationship
  const getOptionCalculation = () => {
    if (dataCalculation && dataCalculation.length) {
      return dataCalculation.map((item) => {
        // console.log(dataPartner);
        return formik.values.calculation_id == item.calculation_id
          ? {
              value: item.calculation_id,
              label: item.calculation,
              // isDisabled: true,
            }
          : {
              value: item.calculation_id,
              label: item.calculation,
            };
      });
    }
    return [];
  };
  ///////// option Relationship
  const getOptionName = () => {
    if (dataParamName && dataParamName.length) {
      return dataParamName.map((item) => {
        // console.log(dataPartner);
        return formik.values.param_name_id == item.param_name_id
          ? {
              value: item.param_name_id,
              label: item.name_type,
              // isDisabled: true,
            }
          : {
              value: item.param_name_id,
              label: item.name_type,
            };
      });
    }
    return [];
  };
  ///////// option Relationship
  const getOptionIngredientChild2 = () => {
    if (dataIngredientChild && dataIngredientChild.length) {
      return dataIngredientChild.map((item) => {
        // console.log(dataIngredientChild);
        return formik.values.ingredient__child_2_id == item.ingredient_id ||
          formik.values.ingredient__child_1_id == item.ingredient_id
          ? {
              value: item.ingredient_id,
              label: item.ingredient_name,
              isDisabled: true,
            }
          : {
              value: item.ingredient_id,
              label: item.ingredient_name,
            };
      });
    }
    return [];
  };
  ///////// option Relationship
  const getOptionIngredientChild1 = () => {
    if (dataIngredientChild && dataIngredientChild.length) {
      return dataIngredientChild.map((item) => {
        // console.log(dataPartner);
        return formik.values.ingredient__child_1_id == item.ingredient_id ||
          formik.values.ingredient__child_2_id == item.ingredient_id
          ? {
              value: item.ingredient_id,
              label: item.ingredient_name,
              isDisabled: true,
            }
          : {
              value: item.ingredient_id,
              label: item.ingredient_name,
            };
      });
    }
    return [];
  };
  ///////// option Mainnumber
  const getOptionDob = () => {
    if (dataParamDob && dataParamDob.length) {
      return dataParamDob.map((item) => {
        // console.log(dataPartner);
        return formik.values.param_dob_id == item.param_dob_id
          ? {
              value: item.param_dob_id,
              label: item.dob_type,
              // isDisabled: true,
            }
          : {
              value: item.param_dob_id,
              label: item.dob_type,
            };
      });
    }
    return [];
  };
  // console.log(formik.values)
  return (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <b>{id ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} thành phần </b>
            </CardHeader>
            <CardBody>
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                <Col xs={12} sm={12}>
                  <Row className="mb15">
                    <Col xs={12}>
                      <b className="underline">Thông tin chung</b>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <FormGroup row>
                        <Label for="ingredient_name" sm={2}>
                          Tên thành phần <span className="font-weight-bold red-text">*</span>
                        </Label>
                        <Col sm={10}>
                          <Input
                            name="ingredient_name"
                            id="ingredient_name"
                            type="text"
                            placeholder="Tên thành phần"
                            disabled={noEdit}
                            value={formik.values.ingredient_name}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.ingredient_name && formik.touched.ingredient_name ? (
                            <div
                              className="field-validation-error alert alert-danger fade show"
                              role="alert"
                            >
                              {formik.errors.ingredient_name}
                            </div>
                          ) : null}
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <FormGroup row>
                        <Label for="desc" sm={2}>
                          Mô tả
                        </Label>
                        <Col sm={10}>
                          <Input
                            name="desc"
                            id="desc"
                            type="textarea"
                            placeholder="Mô tả"
                            disabled={noEdit}
                            value={formik.values.desc}
                            onChange={formik.handleChange}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <FormGroup row>
                        <Label for="Calculation_id" sm={2}></Label>
                        <Col sm={10}>
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_active`, e.target.checked ? 1 : 0);
                            }}
                            checked={formik.values.is_active}
                          >
                            Kích hoạt
                          </Checkbox>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <FormGroup row>
                        <Label for="ingredient_name" sm={2}>
                          Hình thức
                        </Label>
                        <Col sm={3}>
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(
                                `is_no_total_shortened`,
                                e.target.checked ? 1 : 0
                              );
                              if (e.target.checked == 1) {
                                formik.setFieldValue(`is_total_shortened`, 0);
                                formik.setFieldValue(`is_total_2_digit`, 0);
                                // formik.setFieldValue(`is_total`, true);
                              }
                            }}
                            checked={formik.values.is_no_total_shortened}
                          >
                            Tổng không rút gọn
                          </Checkbox>
                        </Col>
                        <Col sm={3}>
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_total_shortened`, e.target.checked ? 1 : 0);
                              if (e.target.checked == 1) {
                                formik.setFieldValue(`is_no_total_shortened`, 0);
                                formik.setFieldValue(`is_total_2_digit`, 0);
                                // formik.setFieldValue(`is_total`, true);
                              }
                            }}
                            checked={formik.values.is_total_shortened}
                          >
                            Tổng 1 chữ số
                          </Checkbox>
                        </Col>
                        <Col sm={3}>
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_total_2_digit`, e.target.checked ? 1 : 0);
                              if (e.target.checked == 1) {
                                formik.setFieldValue(`is_no_total_shortened`, 0);
                                formik.setFieldValue(`is_total_shortened`, 0);
                                // formik.setFieldValue(`is_total`, true);
                              }
                            }}
                            checked={formik.values.is_total_2_digit}
                          >
                            Tổng 2 chữ số
                          </Checkbox>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <FormGroup row>
                        <Label for="ingredient_name" sm={2}>
                          Thành phần 1
                        </Label>
                        <Col sm={3}>
                          <Select
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            menuPortalTarget={document.querySelector("body")}
                            isDisabled={noEdit}
                            isClearable={true}
                            placeholder={"--Chọn thành phần--"}
                            value={convertValue(
                              formik.values.ingredient__child_1_id,
                              getOptionIngredientChild1()
                            )}
                            options={getOptionIngredientChild1(
                              formik.values.ingredient__child_1_id,
                              true
                            )}
                            onChange={(value) => {
                              // formik.setFieldValue("ingredient__child_1_id", value.value);
                              if (!value) {
                                formik.setFieldValue("ingredient__child_1_id", "");
                              } else {
                                formik.setFieldValue("ingredient__child_1_id", value.value);
                              }
                            }}
                          />
                        </Col>
                        <Col sm={2}>
                          <Select
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            menuPortalTarget={document.querySelector("body")}
                            isDisabled={noEdit}
                            isClearable={true}
                            placeholder={"-Chọn phép tính-"}
                            value={convertValue(
                              formik.values.calculation_id,
                              getOptionCalculation()
                            )}
                            options={getOptionCalculation(formik.values.calculation_id, true)}
                            onChange={(value) => {
                              // formik.setFieldValue("calculation_id", value.value);
                              if (!value) {
                                formik.setFieldValue("calculation_id", "");
                              } else {
                                formik.setFieldValue("calculation_id", value.value);
                              }
                            }}
                          />
                        </Col>
                        <Label for="ingredient_name" sm={2}>
                          Thành phần 2
                        </Label>
                        <Col sm={3}>
                          <Select
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            menuPortalTarget={document.querySelector("body")}
                            isDisabled={noEdit}
                            isClearable={true}
                            placeholder={"--Chọn thành phần--"}
                            value={convertValue(
                              formik.values.ingredient__child_2_id,
                              getOptionIngredientChild2()
                            )}
                            options={getOptionIngredientChild2(
                              formik.values.ingredient__child_2_id,
                              true
                            )}
                            onChange={(value) => {
                              // formik.setFieldValue("ingredient__child_2_id", value.value);
                              if (!value) {
                                formik.setFieldValue("ingredient__child_2_id", "");
                              } else {
                                formik.setFieldValue("ingredient__child_2_id", value.value);
                              }
                            }}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <FormGroup row>
                        <Label for="ingredient_name" sm={2}>
                          {/* Hình thức <span className="font-weight-bold red-text">*</span> */}
                        </Label>
                        <Col sm={2} className="align-self-center">
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_gender`, e.target.checked ? 1 : 0);
                            }}
                            checked={formik.values.is_gender}
                          >
                            Giới tính
                          </Checkbox>
                        </Col>
                        <Col sm={2} className="align-self-center">
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_crrent_age`, e.target.checked ? 1 : 0);
                            }}
                            checked={formik.values.is_crrent_age}
                          >
                            Tuổi hiện tại
                          </Checkbox>
                        </Col>
                        <Col sm={2} className="align-self-center">
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_crrent_year`, e.target.checked ? 1 : 0);
                            }}
                            checked={formik.values.is_crrent_year}
                          >
                            Năm hiện tại
                          </Checkbox>
                        </Col>
                        <Col sm={2} className="align-self-center">
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_value`, e.target.checked ? 1 : 0);
                            }}
                            checked={formik.values.is_value}
                          >
                            Thành phần giá trị
                          </Checkbox>
                        </Col>
                        <Col sm={2}>
                          <Input
                            name="ingredient_value"
                            id="ingredient_value"
                            type="text"
                            placeholder="Nhập giá trị"
                            disabled={noEdit}
                            value={formik.values.ingredient_value}
                            onChange={formik.handleChange}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mb15">
                    <Col xs={12}>
                      <b className="underline">Thông tin biến số</b>
                    </Col>
                  </Row>
                  {/* <Row className="mb15">
                    <Col xs={12}>
                      {formik.errors.type && formik.touched.type ? (
                        <div
                          className="field-validation-error alert alert-danger fade show"
                          role="alert"
                        >
                          {formik.errors.type}
                        </div>
                      ) : null}
                    </Col>
                  </Row> */}

                  <Row>
                    <Col xs={12}>
                      <FormGroup row>
                        <Col sm={3} className="align-self-center">
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_apply_dob`, e.target.checked ? 1 : 0);
                              if (e.target.checked == 1) {
                                formik.setFieldValue(`is_apply_name`, 0);
                                // formik.setFieldValue(`type`, true);
                              }
                            }}
                            checked={formik.values.is_apply_dob}
                          >
                            Áp dụng cho ngày sinh
                          </Checkbox>
                        </Col>
                        {formik.values.is_apply_dob == 1 ? (
                          <>
                            <Col sm={5}>
                              <Row>
                                <Label for="ingredient_name" sm={4}>
                                  Biến số ngày sinh
                                </Label>
                                <Col sm={8}>
                                  <Select
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                    menuPortalTarget={document.querySelector("body")}
                                    isDisabled={noEdit}
                                    isClearable={true}
                                    placeholder={"--Chọn biến số--"}
                                    value={convertValue(formik.values.param_dob_id, getOptionDob())}
                                    options={getOptionDob(formik.values.param_dob_id, true)}
                                    onChange={(value) => {
                                      // formik.setFieldValue("param_dob_id", value.value);
                                      if (!value) {
                                        formik.setFieldValue("param_dob_id", "");
                                      } else {
                                        formik.setFieldValue("param_dob_id", value.value);
                                      }
                                    }}
                                  />
                                  {formik.errors.param_dob_id && formik.touched.param_dob_id ? (
                                    <div
                                      className="field-validation-error alert alert-danger fade show"
                                      role="alert"
                                    >
                                      {formik.errors.param_dob_id}
                                    </div>
                                  ) : null}
                                </Col>
                              </Row>
                            </Col>

                            <Col sm={3} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    `is_get_last_2_digit`,
                                    e.target.checked ? 1 : 0
                                  );
                                }}
                                checked={formik.values.is_get_last_2_digit}
                              >
                                Lấy 2 số cuối cùng
                              </Checkbox>
                            </Col>
                          </>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mb15">
                    <Col xs={12}>
                      <FormGroup row>
                        <Col sm={3} className="align-self-center">
                          <Checkbox
                            disabled={noEdit}
                            onChange={(e) => {
                              formik.setFieldValue(`is_apply_name`, e.target.checked ? 1 : 0);
                              if (e.target.checked == 1) {
                                formik.setFieldValue(`is_apply_dob`, 0);
                                // formik.setFieldValue(`type`, true);
                              }
                            }}
                            checked={formik.values.is_apply_name}
                          >
                            Áp dụng cho tên
                          </Checkbox>
                        </Col>
                      </FormGroup>
                    </Col>
                    {formik.values.is_apply_name == 1 ? (
                      <>
                        <Col xs={12}>
                          <Row>
                            <Label for="ingredient_name" sm={2} style={{ paddingLeft: "35px" }}>
                              Biến số tên
                            </Label>
                            <Col sm={4}>
                              <Select
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                menuPortalTarget={document.querySelector("body")}
                                isClearable={true}
                                isDisabled={noEdit}
                                placeholder={"--Chọn biến số--"}
                                value={convertValue(formik.values.param_name_id, getOptionName())}
                                options={getOptionName(formik.values.param_name_id, true)}
                                onChange={(value) => {
                                  if (!value) {
                                    formik.setFieldValue("param_name_id", "");
                                  } else {
                                    formik.setFieldValue("param_name_id", value.value);
                                  }
                                  // formik.setFieldValue("param_name_id", value.value);
                                }}
                              />
                              {formik.errors.param_name_id && formik.touched.param_name_id ? (
                                <div
                                  className="field-validation-error alert alert-danger fade show"
                                  role="alert"
                                >
                                  {formik.errors.param_name_id}
                                </div>
                              ) : null}
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={12}>
                          <Row style={{ paddingTop: "15px" }}>
                            <Label for="ingredient_name" sm={2} style={{ paddingLeft: "35px" }}>
                              Hình thức
                            </Label>
                            <Col sm={2} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(`is_vowel`, e.target.checked ? 1 : 0);
                                }}
                                checked={formik.values.is_vowel}
                              >
                                Nguyên âm
                              </Checkbox>
                            </Col>
                            <Col sm={2} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(`is_consonant`, e.target.checked ? 1 : 0);
                                }}
                                checked={formik.values.is_consonant}
                              >
                                Phụ âm
                              </Checkbox>
                            </Col>
                            <Col sm={2} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(`is_last_letter`, e.target.checked ? 1 : 0);
                                }}
                                checked={formik.values.is_last_letter}
                              >
                                Kí tự cuối cùng
                              </Checkbox>
                            </Col>
                            <Col sm={3} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    `is_onlyfirst_vowel`,
                                    e.target.checked ? 1 : 0
                                  );
                                }}
                                checked={formik.values.is_onlyfirst_vowel}
                              >
                                Chỉ lấy nguyên âm đầu tiên
                              </Checkbox>
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={12}>
                          <Row style={{ paddingTop: "15px" }}>
                            <Label
                              for="ingredient_name"
                              sm={2}
                              style={{ paddingLeft: "35px" }}
                            ></Label>
                            <Col sm={2} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(`is_show_3_time`, e.target.checked ? 1 : 0);
                                }}
                                checked={formik.values.is_show_3_time}
                              >
                                {`Số xuất hiện >= 3 lần`}
                              </Checkbox>
                            </Col>
                            <Col sm={2} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(`is_show_0_time`, e.target.checked ? 1 : 0);
                                }}
                                checked={formik.values.is_show_0_time}
                              >
                                Số xuất hiện 0 lần
                              </Checkbox>
                            </Col>
                            <Col sm={2} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(`is_first_letter`, e.target.checked ? 1 : 0);
                                }}
                                checked={formik.values.is_first_letter}
                              >
                                Kí tự đầu tiên
                              </Checkbox>
                            </Col>
                            <Col sm={3} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    `is_numletter_digit`,
                                    e.target.checked ? 1 : 0
                                  );
                                }}
                                checked={formik.values.is_numletter_digit}
                              >
                                Số lượng các chữ cái
                              </Checkbox>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12}>
                          <Row style={{ paddingTop: "15px" }}>
                            <Label
                              for="ingredient_name"
                              sm={2}
                              style={{ paddingLeft: "35px" }}
                            ></Label>
                            <Col sm={2} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    `is_total_letter_digit`,
                                    e.target.checked ? 1 : 0
                                  );
                                }}
                                checked={formik.values.is_total_letter_digit}
                              >
                                Tổng các chữ cái
                              </Checkbox>
                            </Col>
                            <Col sm={2} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    `is_total_letter_first_digit`,
                                    e.target.checked ? 1 : 0
                                  );
                                }}
                                checked={formik.values.is_total_letter_first_digit}
                              >
                                Tổng chữ cái đầu tiên
                              </Checkbox>
                            </Col>
                            <Col sm={2} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    `is_total_value_digit`,
                                    e.target.checked ? 1 : 0
                                  );
                                }}
                                checked={formik.values.is_total_value_digit}
                              >
                                Tổng các giá trị
                              </Checkbox>
                            </Col>
                            <Col sm={3} className="align-self-center">
                              <Checkbox
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(`is_count_tofnum`, e.target.checked ? 1 : 0);
                                }}
                                checked={formik.values.is_count_tofnum}
                              >
                                Số lượng con số
                              </Checkbox>
                            </Col>
                          </Row>
                        </Col>
                      </>
                    ) : null}
                  </Row>
                </Col>
                <div className="text-right mb-2">
                  <div>
                    {noEdit ? (
                      <CheckAccess permission="FOR_FORMULAINGREDIENTS_VIEW">
                        <Button
                          color="primary"
                          className="mr-2 btn-block-sm"
                          onClick={() => window._$g.rdr(`/formula-ingredients/edit/${id}`)}
                        >
                          <i className="fa fa-edit mr-1" />
                          Chỉnh sửa
                        </Button>
                      </CheckAccess>
                    ) : (
                      <>
                        <CheckAccess
                          permission={
                            id ? `FOR_FORMULAINGREDIENTS_EDIT` : `FOR_FORMULAINGREDIENTS_ADD`
                          }
                        >
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
                        </CheckAccess>
                        <CheckAccess
                          permission={
                            id ? `FOR_FORMULAINGREDIENTS_EDIT` : `FOR_FORMULAINGREDIENTS_ADD`
                          }
                        >
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
                        </CheckAccess>
                      </>
                    )}
                    <button
                      className=" btn-block-sm btn btn-secondary"
                      type="button"
                      onClick={() => window._$g.rdr(`/formula-ingredients`)}
                    >
                      <i className="fa fa-times-circle mr-1" />
                      Đóng
                    </button>
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default FormulaIngredientsAdd;
