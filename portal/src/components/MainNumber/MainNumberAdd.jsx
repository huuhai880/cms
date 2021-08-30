import React, { useState, useEffect } from "react";
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
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  Table,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./const";
import { readFileAsBase64 } from "../../utils/html";
import MainNumberModel from "../../models/MainNumberModel";
import DatePicker from "../Common/DatePicker";
import moment from "moment";
import Upload from "../Common/Antd/Upload";
import NumberFormat from "../Common/NumberFormat";
import Select from "react-select";
import { Radio, Space, Checkbox } from "antd";
import { CheckAccess } from "../../navigation/VerifyAccess";

layoutFullWidthHeight();

function MainNumberAdd() {
  let { id } = useParams();
  const _mainNumberModel = new MainNumberModel();
  const [dataNumber, setDataNumber] = useState(initialValues);
  const [dataPartner, setDataPartner] = useState([]);
  const [value, setvalue] = useState("");
  const [btnType, setbtnType] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataNumber,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCreateOrNumber(values);
    },
  });
  //// create Number
  const handleCreateOrNumber = async (values) => {
    try {
      _mainNumberModel.create(values).then((data) => {
        if (btnType == "save") {
          // _initData();
          window._$g.toastr.show("Lưu thành công!", "success");
        } else if (btnType == "save&quit") {
          window._$g.toastr.show("Lưu thành công!", "success");
          //   setDataPosition(initialValues);
          return window._$g.rdr("/main-number");
        }
        // console.log(data);
      });
    } catch (error) {}
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
      await _mainNumberModel.detail(id).then((data) => {
        // console.log(data)
        setDataNumber(data);
        // console.log()
      });
      await _mainNumberModel.listNumImg(id).then((data) => {
        formik.setFieldValue("main_number_img", [...formik.values.main_number_img, ...data.items]);
        data.items.map((item, index) => {
          if (item.img_is_default == 1) {
            setvalue(item.partner_id);
          }
        });
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };
  ///// get data partnert
  useEffect(() => {
    const _callAPI = async () => {
      try {
        await _mainNumberModel.getListPartner().then((data) => {
          setDataPartner(data.items);
          //   console.log(setDataPartner);
        });
      } catch (error) {
        console.log(error);
        window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
      }
    };
    _callAPI();
  }, []);
  //// config table
  const addNewImg = () => {
    let AddRowPro = {
      partner_id: null,
      main_number_images_url: null,
      partner_name: null,
      img_is_default: 0,
      img_is_active: 1,
    };
    if (!formik.values.main_number_img.find((x) => x.partner_id == null)) {
      formik.setFieldValue("main_number_img", [...formik.values.main_number_img, AddRowPro]);
    }
  };
  const handleDeleteRowNewImg = (index) => {
    let clone = [...formik.values.main_number_img];
    clone.splice(index, 1);
    formik.setFieldValue("main_number_img", clone);
    // setdataTabProduct(clone);
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
    if (dataPartner && dataPartner.length) {
      return dataPartner.map((item) => {
        // console.log(dataPartner);
        return formik.values.main_number_img.find((x) => x.partner_id == item.partner_id)
          ? {
              value: item.partner_id,
              label: item.partner_name,
              isDisabled: true,
            }
          : {
              value: item.partner_id,
              label: item.partner_name,
            };
      });
    }
    return [];
  };
  const handleChangeAttribute = async (value, index) => {
    let listcl = [...formik.values.main_number_img];
    listcl[index].partner_id = value ? value.value : null;
    formik.setFieldValue("main_number_img", listcl);
  };
  // console.log(formik.values)
  return (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <b>{id ? "Chỉnh sửa" : "Thêm mới"} con số </b>
            </CardHeader>
            <CardBody>
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                <Row>
                  <Col xs={12} sm={12}>
                    <FormGroup row>
                      <Label for="main_number" sm={4}>
                        Số chủ đạo <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={8}>
                        <NumberFormat
                          name="main_number"
                          id="main_number"
                          onChange={(value) => {
                            formik.setFieldValue("main_number", value.target.value);
                            // console.log(value)
                          }}
                          value={formik.values.main_number}
                        />
                        {/* <NumberFormat
                          name="main_number"
                          onValueChange={(value) => {
                            formik.setFieldValue("main_number", value);
                          }}
                          value={formik.values.main_number}
                          max={99999}
                          min={1}
                          decimalScale={formik.values.main_number ? 2 : 0}
                          //   disabled={noEdit}
                        /> */}

                        {formik.errors.main_number && formik.touched.main_number ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.main_number}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={12}>
                    <FormGroup row>
                      <Label for="main_number" sm={4}>
                        Mô tả
                      </Label>
                      <Col sm={8}>
                        <Input
                          name="main_number_desc"
                          id="main_number_desc"
                          type="textarea"
                          placeholder=" Mô tả"
                          //   disabled={noEdit}
                          value={formik.values.main_number_desc}
                          onChange={formik.handleChange}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs={12} sm={12}>
                    <FormGroup row>
                      <Label for="is_active" sm={4}>
                        {/* Tên chức vụ <span className="font-weight-bold red-text">*</span> */}
                      </Label>
                      <Col sm={8}>
                        <CustomInput
                          className="pull-left"
                          onBlur={null}
                          checked={formik.values.is_active}
                          type="switch"
                          id="is_active"
                          label="Kích hoạt"
                          name="is_active"
                          // disabled={noEdit}
                          onChange={(e) => {
                            formik.setFieldValue("is_active", e.target.checked ? 1 : 0);
                          }}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs={12}>
                    <Row className="mb15">
                      <Col xs={12}>
                        <b className="underline">Hình ảnh</b>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    xs={12}
                    // style={{ maxHeight: 351, overflowY: "auto" }}
                    className="border-secondary align-middle"
                  >
                    <div
                      className="col-xs-12 col-sm-12 col-md-12 col-lg-12 border align-middle"
                      style={{ padding: 5 }}
                    >
                      <table className="table table-bordered table-hover ">
                        <thead className="bg-light">
                          <td className="align-middle text-center" width="10%">
                            <b>STT</b>
                          </td>

                          <td className=" align-middle text-center" width="20%">
                            <b>Đối tác</b>
                          </td>
                          <td className=" align-middle text-center" width="40%">
                            <b>Ảnh</b>
                          </td>
                          <td className=" align-middle text-center" width="10%">
                            <b>Mặc định</b>
                          </td>
                          <td className=" align-middle text-center" width="10%">
                            <b>Kích hoạt</b>
                          </td>
                          <td className=" align-middle text-center" width="10%"></td>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="align-middle text-center" width="10%"></td>
                            <td className=" align-middle text-center" width="20%"></td>
                            <td className=" align-middle text-center" width="40%">
                              <div className="ps-relative">
                                <i
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    padding: 0,
                                  }}
                                  className="fa fa-plus"
                                />
                              </div>
                            </td>
                            <td className=" align-middle text-center" width="10%">
                              <Radio.Group>
                                <Space direction="vertical">
                                  <Radio value={false} isDisabled={true}></Radio>
                                </Space>
                              </Radio.Group>
                            </td>
                            <td className=" align-middle text-center" width="10%">
                              <Checkbox isDisabled={true}></Checkbox>
                            </td>
                            <td className=" align-middle text-center" width="10%">
                              <Button
                                color="success"
                                title="Thêm"
                                type="button"
                                className=""
                                onClick={addNewImg}
                              >
                                <i className="fa fa-plus" />
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                        {formik.values.main_number_img &&
                          formik.values.main_number_img.map((item, index) => {
                            return (
                              <tbody>
                                <tr key={index}>
                                  <td className="align-middle text-center" width="10%">
                                    {index + 1}
                                  </td>
                                  <td className=" align-middle" width="20%">
                                    <Select
                                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                      //   isDisabled={noEdit}
                                      placeholder={"-- Chọn --"}
                                      value={
                                        convertValue(item.partner_id, getOptionAttribute()) ||
                                        convertValue(
                                          { value: item.partner_id, label: item.partner_name },
                                          getOptionAttribute()
                                        )
                                      }
                                      options={getOptionAttribute(item.partner_id, true)}
                                      onChange={(value) => handleChangeAttribute(value, index)}
                                    />
                                  </td>
                                  <td className=" align-middle text-center" width="40%">
                                    <div className="ps-relative">
                                      {item.main_number_images_url ? (
                                        <Media
                                          object
                                          src={item.main_number_images_url}
                                          alt="User image"
                                          // className="user-imgage"
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            padding: 0,
                                          }}
                                        />
                                      ) : (
                                        <i
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            padding: 0,
                                          }}
                                          className="fa fa-plus"
                                        />
                                      )}
                                      <Input
                                        type="file"
                                        id="icon"
                                        className="input-overlay"
                                        onChange={(event) => {
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
                                                let clone = [...formik.values.main_number_img];
                                                clone[index].main_number_images_url =
                                                  usrImgBase64[0] ? usrImgBase64[0] : null;
                                                formik.setFieldValue(`main_number_img`, clone);
                                                // formik.setFieldValue(
                                                //   "image_avatar",
                                                //   usrImgBase64[0]
                                                // );
                                              })
                                              .catch((err) => {
                                                window._$g.dialogs.alert(window._$g._(err.message));
                                              });
                                          }
                                        }}
                                        // disabled={noEdit}
                                      />
                                    </div>
                                  </td>
                                  {/* <td className=" align-middle text-center" width="10%">
                                    <CustomInput
                                      className="pull-left"
                                      onBlur={null}
                                      checked={item.img_is_default}
                                      type="checkbox"
                                      id={`img_is_default${index}`}
                                      label="Mặc định"
                                      name={`img_is_default${index}`}
                                      // disabled={noEdit}
                                      onChange={(e) => {
                                        let clone = [...formik.values.main_number_img];
                                        // console.log(e.target.checked)
                                        clone.clone[index].img_is_default = e
                                          ? e.target.checked
                                            ? 1
                                            : 0
                                          : null;
                                        formik.setFieldValue(`main_number_img`, clone);
                                      }}
                                    />
                                  </td> */}
                                  <td className=" align-middle text-center" width="10%">
                                    <Radio.Group
                                      onChange={(e) => {
                                        // console.log(e.target.value);
                                        // console.log(e.target.value);

                                        formik.values.main_number_img.map((item, index) => {
                                          if (item.partner_id == e.target.value) {
                                            item.img_is_default = 1;
                                          } else {
                                            item.img_is_default = 0;
                                          }
                                        });
                                        setvalue(e.target.value);
                                      }}
                                      value={value}
                                    >
                                      <Space direction="vertical">
                                        <Radio
                                          // checked={item.img_is_default == 1}
                                          value={item.partner_id}
                                        ></Radio>
                                      </Space>
                                    </Radio.Group>
                                    {/* <CustomInput
                                      className="pull-left"
                                      onBlur={null}
                                      checked={item.img_is_default}
                                      type="radio"
                                      id={`img_is_default${index}`}
                                      label="Mặc định"
                                      name={`img_is_default${index}`}
                                      // disabled={noEdit}
                                      onChange={(e) => {
                                        let clone = [...formik.values.main_number_img];
                                        // clone.img_is_default = 0
                                        console.log(clone)
                                        clone[index].img_is_default = e
                                          ? e.target.checked
                                            ? 1
                                            : 0
                                          : null;
                                        formik.setFieldValue(`main_number_img`, clone);
                                      }}
                                    /> */}
                                  </td>
                                  <td className=" align-middle text-center" width="10%">
                                    <Checkbox
                                      onChange={(e) => {
                                        let clone = [...formik.values.main_number_img];
                                        clone[index].img_is_active = e
                                          ? e.target.checked
                                            ? 1
                                            : 0
                                          : null;
                                        formik.setFieldValue(`main_number_img`, clone);
                                      }}
                                      checked={item.img_is_active}
                                    ></Checkbox>
                                    {/* <Checkbox
                                      className="pull-left"
                                      onBlur={null}
                                      checked={item.img_is_active}
                                      type="checkbox"
                                      id={`img_is_active${index}`}
                                      label="Kích hoạt"
                                      name={`img_is_active${index}`}
                                      // disabled={noEdit}
                                      onChange={(e) => {
                                        let clone = [...formik.values.main_number_img];
                                        clone[index].img_is_active = e
                                          ? e.target.checked
                                            ? 1
                                            : 0
                                          : null;
                                        formik.setFieldValue(`main_number_img`, clone);
                                      }}
                                    /> */}
                                  </td>
                                  <td className=" align-middle text-center" width="10%">
                                    <Button
                                      color="danger"
                                      title="Xóa"
                                      className=""
                                      type="button"
                                      onClick={() => handleDeleteRowNewImg(index)}
                                    >
                                      <i className="fa fa-trash" />
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            );
                          })}
                      </table>
                      {formik.errors.main_number_img && formik.touched.main_number_img ? (
                    <div
                      className="col-xs-12 col-sm-12 col-md-12 col-lg-12 field-validation-error alert alert-danger fade show"
                      role="alert"
                    >
                      {formik.errors.main_number_img}
                    </div>
                  ) : null}
                    </div>
                  </Col>
                  
                </Row>
                <div className="text-right mb-2 mt-2">
                  <div>
                    <CheckAccess permission={id ? `FOR_MAINNUMBER_EDIT` : `FOR_MAINNUMBER_ADD`}>
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
                    <CheckAccess permission={id ? `FOR_MAINNUMBER_EDIT` : `FOR_MAINNUMBER_ADD`}>
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

                    <button
                      className=" btn-block-sm btn btn-secondary"
                      type="button"
                      onClick={() => window._$g.rdr(`/main-number`)}
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

export default MainNumberAdd;