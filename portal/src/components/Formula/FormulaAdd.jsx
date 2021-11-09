import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row, Form, FormGroup, Label, Input } from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./const";
import FormulaModel from "../../models/FormulaModel";
import NumberFormat from "../Common/NumberFormat";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Checkbox } from "antd";
import InterpretModel from "../../models/InterpretModel";
import Select from "react-select";
import { CircularProgress } from "@material-ui/core";
import Loading from "../Common/Loading";

layoutFullWidthHeight();

function FormulaAdd({ noEdit }) {
  const _formulaModel = new FormulaModel();
  const _interpretModel = new InterpretModel();
  const [isLoading, setisLoading] = useState(true);

  const [dataFormula, setDataFormula] = useState(initialValues);
  const [dataIngredient, setDataIngredient] = useState([]);
  const [dataAttribute, setDataAttribute] = useState([]);
  const [dataCalculation, setDataCalculation] = useState([]);
  const [dataFormulaParent, setDataFormulaParent] = useState([]);
  let { id } = useParams();
  const [btnType, setbtnType] = useState("");
  const [isType1, setType1] = useState([
    { name: "Công thức", id: "1" },
    { name: "Thành phần", id: "0" },
  ]);
  const [isType2, setType2] = useState([
    { name: "Công thức", id: "1" },
    { name: "Thành phần", id: "0" },
  ]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataFormula,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCreateOrUpdate(values);
    },
  });
  ///// get data option
  const _callAPI = async () => {
    try {
      _formulaModel.getAttributeGruop().then((data) => {
        setDataAttribute(data.items);
        //   console.log(setDataPartner);
      });
      _formulaModel.getListCalculation().then((data) => {
        setDataCalculation(data.items);
        //   console.log(setDataPartner);
      });
      _formulaModel.getListFormulaParent().then((data) => {
        setDataFormulaParent(data.items);
        //   console.log(setDataPartner);
      });
      _formulaModel.getListIngredient().then((data) => {
        setDataIngredient(data.items);
        //   console.log(setDataPartner);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
    }
  };
  useEffect(() => {
    setTimeout(() => setisLoading(false), 500);
    _callAPI();
  }, []);
  //// create letter
  const handleCreateOrUpdate = async (values) => {
    try {
      _formulaModel.create(values).then((data) => {
        if (btnType == "save") {
          if (id) {
            _initDataDetail();
          } else {
            formik.resetForm();
            _callAPI();
            setisLoading(true);
            setTimeout(() => setisLoading(false), 500);
          }
          window._$g.toastr.show("Lưu thành công!", "success");
        } else if (btnType == "save&quit") {
          window._$g.toastr.show("Lưu thành công!", "success");
          // setDataInterpret(initialValues);
          return window._$g.rdr("/formula");
        }
      });
    } catch (error) {
    } finally {
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
      _formulaModel.detail(id).then((data) => {
        // console.log(data);
        setDataFormula(data);
        // console.log()
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
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
    if (!value) {
      value = "";
    }
    return value;
  };
  ///////// option Relationship
  const getOptionAttribute = () => {
    if (dataAttribute && dataAttribute.length) {
      return dataAttribute.map((item) => {
        // console.log(dataPartner);
        return formik.values.attribute_gruop_id == item.attribute_gruop_id
          ? {
              value: item.attribute_gruop_id,
              label: item.gruop_name,
              // isDisabled: true,
            }
          : {
              value: item.attribute_gruop_id,
              label: item.gruop_name,
            };
      });
    }
    return [];
  };
  const getOptionFormula = () => {
    if (dataFormulaParent && dataFormulaParent.length) {
      return dataFormulaParent.map((item) => {
        // console.log(dataPartner);
        return formik.values.orderid_1 == item.formula_id ||
          formik.values.orderid_2 == item.formula_id
          ? {
              value: item.formula_id,
              label: item.formula_name,
              isDisabled: true,
            }
          : {
              value: item.formula_id,
              label: item.formula_name,
            };
      });
    }
    return [];
  };
  const getOptionIngdient = () => {
    if (dataIngredient && dataIngredient.length) {
      return dataIngredient.map((item) => {
        // console.log(dataPartner);
        return formik.values.orderid_1 == item.ingredient_id ||
          formik.values.orderid_2 == item.ingredient_id
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
  const getOptionType1 = () => {
    if (isType1 && isType1.length) {
      return isType1.map((item) => {
        // console.log(dataPartner);
        return formik.values.type1 == item.id
          ? {
              value: item.id,
              label: item.name,
              isDisabled: true,
            }
          : {
              value: item.id,
              label: item.name,
            };
      });
    }
    return [];
  };
  const getOptionType2 = () => {
    if (isType2 && isType2.length) {
      return isType2.map((item) => {
        // console.log(dataPartner);
        return formik.values.type2 == item.id
          ? {
              value: item.id,
              label: item.name,
              isDisabled: true,
            }
          : {
              value: item.id,
              label: item.name,
            };
      });
    }
    return [];
  };
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
  // console.log(formik.values);
  return isLoading ? (
    <Loading />
  ) : (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
              {/* <b>{id ? "Chỉnh sửa" : "Thêm mới"} công thức </b> */}
              <b>{id ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} công thức </b>
            </CardHeader>
            <CardBody>
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                {/* <Col xs={12} sm={12}> */}
                <Row>
                  <Col xs={6}>
                    <FormGroup row>
                      <Label for="formula_name" sm={4} className="text-right">
                        Tên công thức <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          name="formula_name"
                          id="formula_name"
                          type="text"
                          placeholder="Tên công thức"
                          disabled={noEdit}
                          value={formik.values.formula_name}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.formula_name && formik.touched.formula_name ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.formula_name}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs={6}>
                    <FormGroup row>
                      <Label for="attribute_gruop_id" sm={4} className="text-right">
                        Chỉ số <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={8}>
                        {/* {isLoading ? (
                          <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                            <CircularProgress />
                          </div>
                        ) : ( */}
                        <Select
                          className="MuiPaper-filter__custom--select"
                          id={`attribute_gruop_id`}
                          name={`attribute_gruop_id`}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPortalTarget={document.querySelector("body")}
                          isDisabled={noEdit}
                          isClearable={true}
                          placeholder={"-- Chọn --"}
                          value={convertValue(
                            formik.values.attribute_gruop_id,
                            getOptionAttribute()
                          )}
                          options={getOptionAttribute(formik.values.attribute_gruop_id, true)}
                          onChange={(value) => {
                            // formik.setFieldValue("attribute_gruop_id", value.value);
                            if (!value) {
                              formik.setFieldValue("attribute_gruop_id", "");
                            } else {
                              formik.setFieldValue("attribute_gruop_id", value.value);
                            }
                          }}
                        />
                        {/* )} */}
                        {formik.errors.attribute_gruop_id && formik.touched.attribute_gruop_id ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.attribute_gruop_id}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup row>
                      <Label for="formula_name" sm={2} className="text-right">
                        Mô tả <span className="font-weight-bold red-text">*</span>
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
                        {formik.errors.desc && formik.touched.desc ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.desc}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <FormGroup row style={{ alignItems: "center" }}>
                      <Label for="ingredient_name" sm={2} className="text-right">
                        Hình thức
                      </Label>
                      <Col sm={2}>
                        <Checkbox
                          disabled={noEdit}
                          onChange={(e) => {
                            formik.setFieldValue(`is_total_no_shortened`, e.target.checked);
                            if (e.target.checked) {
                              formik.setFieldValue(`is_total_shortened`, false);
                              formik.setFieldValue(`is_total_2digit`, false);
                            }
                          }}
                          checked={formik.values.is_total_no_shortened}
                        >
                          Tổng không rút gọn
                        </Checkbox>
                      </Col>
                      <Col sm={2}>
                        <Checkbox
                          disabled={noEdit}
                          onChange={(e) => {
                            formik.setFieldValue(`is_total_shortened`, e.target.checked);
                            if (e.target.checked) {
                              formik.setFieldValue(`is_total_no_shortened`, false);
                              formik.setFieldValue(`is_total_2digit`, false);
                            }
                          }}
                          checked={formik.values.is_total_shortened}
                        >
                          Tổng 1 chữ số
                        </Checkbox>
                      </Col>
                      <Col sm={2}>
                        <Checkbox
                          disabled={noEdit}
                          onChange={(e) => {
                            formik.setFieldValue(`is_total_2digit`, e.target.checked);
                            if (e.target.checked) {
                              formik.setFieldValue(`is_total_no_shortened`, false);
                              formik.setFieldValue(`is_total_shortened`, false);
                            }
                          }}
                          checked={formik.values.is_total_2digit}
                        >
                          Tổng 2 chữ số
                        </Checkbox>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col xs={6}>
                    <FormGroup row>
                      <Label for="order_index" sm={4} className="text-right">
                        Thứ tự sắp xếp <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={8}>
                        <NumberFormat
                          name="order_index"
                          id="order_index"
                          disabled={noEdit}
                          onChange={(value) => {
                            formik.setFieldValue("order_index", value.target.value);
                            // console.log(value)
                          }}
                          value={formik.values.order_index}
                        />
                        {formik.errors.order_index && formik.touched.order_index ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.order_index}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                {/* {isLoading ? (
                  <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                    <CircularProgress />
                  </div>
                ) : ( */}
                <Row>
                  <Col xs={12}>
                    <FormGroup row>
                      <Label for="formula_name" sm={2} className="text-right">
                        Công thức
                      </Label>
                      <Col sm={2}>
                        <Select
                          className="MuiPaper-filter__custom--select"
                          id={`type1`}
                          name={`type1`}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPortalTarget={document.querySelector("body")}
                          isDisabled={noEdit}
                          isClearable={true}
                          placeholder={"Chọn CT/TP 1"}
                          value={convertValue(formik.values.type1, getOptionType1())}
                          options={getOptionType1(formik.values.type1, true)}
                          onChange={(value) => {
                            if (!value) {
                              formik.setFieldValue("type1", "");
                              formik.setFieldValue("orderid_1", "");
                            } else {
                              formik.setFieldValue("type1", value.value);
                            }
                          }}
                        />
                      </Col>
                      <Col sm={2}>
                        {/* {id ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} */}
                        {formik.values.type1 !== "" ? (
                          formik.values.type1 == 0 ? (
                            <Select
                              className="MuiPaper-filter__custom--select"
                              id={`orderid_1`}
                              isClearable={true}
                              name={`orderid_1`}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              menuPortalTarget={document.querySelector("body")}
                              isDisabled={noEdit}
                              placeholder={"Chọn thành phần"}
                              value={convertValue(formik.values.orderid_1, getOptionIngdient())}
                              options={getOptionIngdient(formik.values.orderid_1, true)}
                              onChange={(value) => {
                                // formik.setFieldValue("orderid_1", value.value);
                                if (!value) {
                                  formik.setFieldValue("orderid_1", "");
                                } else {
                                  formik.setFieldValue("orderid_1", value.value);
                                }
                              }}
                            />
                          ) : (
                            <Select
                              className="MuiPaper-filter__custom--select"
                              id={`orderid_1`}
                              isClearable={true}
                              name={`orderid_1`}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              menuPortalTarget={document.querySelector("body")}
                              isDisabled={noEdit}
                              placeholder={"Chọn công thức"}
                              value={convertValue(formik.values.orderid_1, getOptionFormula())}
                              options={getOptionFormula(formik.values.orderid_1, true)}
                              onChange={(value) => {
                                // formik.setFieldValue("orderid_1", value.value);
                                if (!value) {
                                  formik.setFieldValue("orderid_1", "");
                                } else {
                                  formik.setFieldValue("orderid_1", value.value);
                                }
                              }}
                            />
                          )
                        ) : (
                          <Select
                            className="MuiPaper-filter__custom--select"
                            value={convertValue(formik.values.orderid_1, getOptionFormula())}
                            menuPortalTarget={document.querySelector("body")}
                            isDisabled={noEdit}
                            placeholder={"Chọn"}
                          />
                        )}
                      </Col>
                      <Col sm={2}>
                        <Select
                          className="MuiPaper-filter__custom--select"
                          id={`calculation_id`}
                          isClearable={true}
                          name={`calculation_id`}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPortalTarget={document.querySelector("body")}
                          isDisabled={noEdit}
                          placeholder={"Chọn phép tính"}
                          value={convertValue(formik.values.calculation_id, getOptionCalculation())}
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
                      <Col sm={2}>
                        <Select
                          className="MuiPaper-filter__custom--select"
                          id={`orderid_1`}
                          isClearable={true}
                          name={`orderid_2`}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPortalTarget={document.querySelector("body")}
                          isDisabled={noEdit}
                          placeholder={"Chọn CT/TP 2"}
                          value={convertValue(formik.values.type2, getOptionType2())}
                          options={getOptionType2(formik.values.type2, true)}
                          onChange={(value) => {
                            // formik.setFieldValue("type2", value.value);
                            // formik.setFieldValue("orderid_2", "");
                            if (!value) {
                              formik.setFieldValue("type2", "");
                              formik.setFieldValue("orderid_2", "");
                            } else {
                              formik.setFieldValue("type2", value.value);
                            }
                          }}
                        />
                      </Col>
                      <Col sm={2}>
                        {formik.values.type2 !== "" ? (
                          formik.values.type2 == 0 ? (
                            <Select
                              className="MuiPaper-filter__custom--select"
                              id={`orderid_2`}
                              isClearable={true}
                              name={`orderid_2`}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              menuPortalTarget={document.querySelector("body")}
                              isDisabled={noEdit}
                              placeholder={"Chọn thành phần"}
                              value={convertValue(formik.values.orderid_2, getOptionIngdient())}
                              options={getOptionIngdient(formik.values.orderid_2, true)}
                              onChange={(value) => {
                                // formik.setFieldValue("orderid_2", value.value);
                                if (!value) {
                                  formik.setFieldValue("orderid_2", "");
                                } else {
                                  formik.setFieldValue("orderid_2", value.value);
                                }
                              }}
                            />
                          ) : (
                            <Select
                              className="MuiPaper-filter__custom--select"
                              isClearable={true}
                              id={`orderid_2`}
                              name={`orderid_2`}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              menuPortalTarget={document.querySelector("body")}
                              isDisabled={noEdit}
                              placeholder={"Chọn công thức"}
                              value={convertValue(formik.values.orderid_2, getOptionFormula())}
                              options={getOptionFormula(formik.values.orderid_2, true)}
                              onChange={(value) => {
                                // formik.setFieldValue("orderid_2", value.value);
                                if (!value) {
                                  formik.setFieldValue("orderid_2", "");
                                } else {
                                  formik.setFieldValue("orderid_2", value.value);
                                }
                              }}
                            />
                          )
                        ) : (
                          <Select
                            className="MuiPaper-filter__custom--select"
                            value={convertValue(formik.values.orderid_2, getOptionFormula())}
                            menuPortalTarget={document.querySelector("body")}
                            isDisabled={noEdit}
                            placeholder={"Chọn"}
                          />
                        )}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                {/* )} */}
                <Row>
                  <Col xs={12}>
                    <FormGroup row>
                      <Label for="formula_name" sm={2} className="text-right">
                        {/* Công thức */}
                      </Label>
                      <Col xs={2}>
                        <Checkbox
                          disabled={noEdit}
                          onChange={(e) => {
                            formik.setFieldValue(`is_default`, e.target.checked ? 1 : 0);
                          }}
                          checked={formik.values.is_default}
                        >
                          Ưu tiên
                        </Checkbox>
                      </Col>
                      <Col xs={2}>
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
                <div className="text-right mb-2">
                  <div>
                    {noEdit ? (
                      <CheckAccess permission="FOR_FORMULA_VIEW">
                        <button
                          color="primary"
                          className="mr-2 btn-block-sm btn btn-primary"
                          onClick={() => window._$g.rdr(`/formula/edit/${id}`)}
                        >
                          <i className="fa fa-edit mr-1" />
                          Chỉnh sửa
                        </button>
                      </CheckAccess>
                    ) : (
                      <>
                        <CheckAccess permission={id ? `FOR_FORMULA_EDIT` : `FOR_FORMULA_ADD`}>
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
                        <CheckAccess permission={id ? `FOR_FORMULA_EDIT` : `FOR_FORMULA_ADD`}>
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
                      onClick={() => window._$g.rdr(`/formula`)}
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

export default FormulaAdd;
