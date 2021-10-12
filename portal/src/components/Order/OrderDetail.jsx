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
import { initialValues } from "./const";
import { readFileAsBase64 } from "../../utils/html";
import OrderModel from "../../models/OrderModel";
import DatePicker from "../Common/DatePicker";
import moment from "moment";
import Upload from "../Common/Antd/Upload";
import NumberFormat from "../Common/NumberFormat";
import Select from "react-select";
import { Radio, Space, Checkbox } from "antd";
import { CheckAccess } from "../../navigation/VerifyAccess";

layoutFullWidthHeight();

function OrderDetail() {
  let { id } = useParams();
  const _orderModel = new OrderModel();
  const [dataOrder, setDataOrder] = useState(initialValues);
  const [dataPartner, setDataPartner] = useState([]);
  const [noEdit, setNoEdit] = useState(true);
  const [btnType, setbtnType] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataOrder,
    validateOnBlur: false,
    validateOnChange: false,
  });

  //////get data detail
  useEffect(() => {
    _initDataDetail();
  }, []);

  //// data detail
  const _initDataDetail = async () => {
    try {
      await _orderModel.detail(id).then((data) => {
        setDataOrder(data);
        // console.log(data);
      });
      await _orderModel.listProduct(id).then((data) => {
        formik.setFieldValue("product_list", [...formik.values.product_list, ...data.items]);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };
  //   console.log(formik.values)
  return (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <b>Chi tiết đơn hàng </b>
            </CardHeader>
            <CardBody>
              <Form id="formInfo">
                <Row>
                  <Col className="mb15">
                    <b className="underline">Đơn hàng</b>
                  </Col>
                  <Col xs={12} sm={12}>
                    <Row>
                      <Col xs={6}>
                        <FormGroup row>
                          <Label for="attribute_id" sm={3}>
                            Mã đơn hàng
                          </Label>
                          <Col sm={9}>
                            <Input
                              name="order_no"
                              id="order_no"
                              type="text"
                              disabled={noEdit}
                              value={formik.values.order_no}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs={6}>
                        <FormGroup row>
                          <Label for="relationship_id" sm={3}>
                          Ngày tạo đơn hàng 
                          </Label>
                          <Col sm={9}>
                            <Input
                              name="order_date"
                              id="order_date"
                              type="text"
                              disabled={true}
                              value={formik.values.order_date}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} sm={12}>
                    <Row>
                      <Col xs={6}>
                        <FormGroup row>
                          <Label for="attribute_id" sm={3}>
                            Tình trạng đơn hàng
                          </Label>
                          <Col sm={9}>
                            <Input
                              name="order_id"
                              id="order_id"
                              type="text"
                              disabled={noEdit}
                              value={
                                formik.values.status == 1
                                  ? "Đã thanh toán"
                                  : formik.values.status == 0
                                  ? "Chưa thanh toán"
                                  : "Chưa thanh toán"
                              }
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col className="mb15">
                    <b className="underline">Thông tin khách hàng</b>
                  </Col>
                  <Col xs={12} sm={12}>
                    <Row>
                      <Col xs={6}>
                        <FormGroup row>
                          <Label for="attribute_id" sm={3}>
                            Tên khách hàng
                          </Label>
                          <Col sm={9}>
                            <Input
                              name="full_name"
                              id="full_name"
                              type="text"
                              disabled={noEdit}
                              value={formik.values.full_name}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs={6}>
                        <FormGroup row>
                          <Label for="relationship_id" sm={3}>
                            Số điện thoại 
                          </Label>
                          <Col sm={9}>
                            <Input
                              name="phone_number"
                              id="phone_number"
                              type="text"
                              disabled={true}
                              value={formik.values.phone_number}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} sm={12}>
                    <Row>
                      <Col xs={6}>
                        <FormGroup row>
                          <Label for="attribute_id" sm={3}>
                            Email 
                          </Label>
                          <Col sm={9}>
                            <Input
                              name="email"
                              id="email"
                              type="text"
                              disabled={noEdit}
                              value={formik.values.email}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col xs={6}>
                        <FormGroup row>
                          <Label for="relationship_id" sm={3}>
                            Địa chỉ 
                          </Label>
                          <Col sm={9}>
                            <Input
                              name="address"
                              id="address"
                              type="text"
                              disabled={true}
                              value={formik.values.address}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col className="mb15">
                    <b className="underline">Danh sách sản phẩm</b>
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

                          <td className=" align-middle text-center" width="25%">
                            <b>Tên sản phẩm / combo</b>
                          </td>
                          <td className=" align-middle text-center" width="15%">
                            <b>Số lượng</b>
                          </td>
                          <td className=" align-middle text-center" width="20%">
                            <b>Giá</b>
                          </td>
                          <td className=" align-middle text-center" width="20%">
                            <b>Tổng tiền</b>
                          </td>
                        </thead>

                        {formik.values.product_list &&
                          formik.values.product_list.map((item, index) => {
                            // console.log(item)
                            return (
                              <tbody>
                                <tr key={index}>
                                  <td className="align-middle text-center" width="10%">
                                    {index + 1}
                                  </td>

                                  <td className=" align-middle text-left" width="25%">
                                    {item.product_name?item.product_name:item.combo_name}
                                  </td>
                                  <td className=" align-middle text-center" width="15%">
                                    {item.order_detail_quantity}
                                  </td>
                                  <td className=" align-middle text-right" width="20%">
                                    {new Intl.NumberFormat("de-DE", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(item.product_price)}
                                  </td>
                                  <td className=" align-middle text-right" width="20%">
                                    {new Intl.NumberFormat("de-DE", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(item.order_detail_total)}
                                  </td>
                                </tr>
                              </tbody>
                            );
                          })}
                        <tfoot>
                          <tr>
                            <td className=" align-middle text-left" width="20%">
                              <b>Tổng cộng</b>
                            </td>
                            <td className=" align-middle text-left" colspan="3" width="20%"></td>

                            <td className=" align-middle text-right" width="20%">
                              {" "}
                              {new Intl.NumberFormat("de-DE", {
                                style: "currency",
                                currency: "VND",
                              }).format(formik.values.order_total_money)}
                            </td>
                          </tr>
                          <tr>
                            <td className=" align-middle text-left" width="20%">
                              <b>Giá trị khuyến mãi</b>
                            </td>
                            <td className=" align-middle text-left" colspan="3" width="20%"></td>

                            <td className=" align-middle text-right" width="20%">
                              {new Intl.NumberFormat("de-DE", {
                                style: "currency",
                                currency: "VND",
                              }).format(formik.values.order_total_discount)}
                            </td>
                          </tr>{" "}
                          <tr>
                            <td className=" align-middle text-left" width="20%">
                              <b>Tổng tiền thanh toán</b>
                            </td>
                            <td className=" align-middle text-left" colspan="3" width="20%"></td>

                            <td className=" align-middle text-right" width="20%">
                              {new Intl.NumberFormat("de-DE", {
                                style: "currency",
                                currency: "VND",
                              }).format(formik.values.order_total_sub)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </Col>
                </Row>
                <div className="text-right mb-2 mt-2">
                  <button
                    className=" btn-block-sm btn btn-secondary"
                    type="button"
                    onClick={() => window._$g.rdr(`/order`)}
                  >
                    <i className="fa fa-times-circle mr-1" />
                    Đóng
                  </button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderDetail;
