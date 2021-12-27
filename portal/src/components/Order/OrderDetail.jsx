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
  CustomInput
} from "reactstrap";
import { useParams } from "react-router";
import { layoutFullWidthHeight } from "../../utils/html";
import { initialValues } from "./const";
import OrderModel from "../../models/OrderModel";
import { formatPrice } from "utils/index";
import Loading from "components/Common/Loading";
layoutFullWidthHeight();

function OrderDetail() {
  let { id } = useParams();
  const _orderModel = new OrderModel();
  const [order, setOrder] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    _initData();
  }, []);

  const _initData = async () => {
    setLoading(true);
    try {
      let _order = await _orderModel.detail(id);
      setOrder(_order);
    } catch (error) {
      window._$g.dialogs.alert(
        window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
      );
    } finally {
      setLoading(false);
    }
  };

  const renderOrderDetails = () => {
    let { order_details = [] } = order || {};
    if (order_details.length > 0) {
      return order_details.map((item, index) => {
        return (
          <tr key={index}>
            <td className="text-center text-middle">{index + 1}</td>
            <td className="text-middle">{item.product_name}</td>
            <td className="text-middle text-center">{item.quantity}</td>
            <td className="text-middle text-center">
              {formatPrice(item.price)} đ
            </td>
            <td className="text-middle text-center">
              {formatPrice(item.sub_total)} đ
            </td>
          </tr>
        );
      });
    }
    return null;
  };

  return loading ? (
    <Loading />
  ) : (
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
                  <Col xs={12} className="mb15">
                    <b className="underline title_page_h1 text-primary">
                      Thông tin đơn hàng
                    </b>
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
                              disabled={true}
                              value={order.order_no || ""}
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
                              value={order.order_date || ""}
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
                              disabled={true}
                              value={
                                order.status == 1
                                  ? "Đã thanh toán"
                                  : "Chưa thanh toán"
                              }
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={12} className="mb15">
                    <b className="underline title_page_h1 text-primary">
                      Thông tin khách hàng
                    </b>
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
                              name="customer_name"
                              id="customer_name"
                              type="text"
                              disabled={true}
                              value={order.customer_name || ""}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
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
                              disabled={true}
                              value={order.email || ""}
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
                          <Label for="relationship_id" sm={3}>
                            Số điện thoại
                          </Label>
                          <Col sm={9}>
                            <Input
                              name="phone_number"
                              id="phone_number"
                              type="text"
                              disabled={true}
                              value={order.phone_number || ""}
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
                              value={order.address || ""}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={12} className="mb15">
                    <b className="underline title_page_h1 text-primary">
                      Danh sách sản phẩm
                    </b>
                  </Col>

                  <Col xs={12} className="border-secondary align-middle">
                    <table className="table table-bordered table-hover ">
                      <thead className="bg-light">
                        <tr>
                          <th className="align-middle text-center" width="5%">
                            <b>STT</b>
                          </th>
                          <th className=" align-middle text-center">
                            <b>Tên Sản phẩm/Combo</b>
                          </th>
                          <th className=" align-middle text-center" width="15%">
                            <b>Số lượng</b>
                          </th>
                          <th className=" align-middle text-center" width="15%">
                            <b>Đơn giá(VNĐ)</b>
                          </th>
                          <th className=" align-middle text-center" width="15%">
                            {" "}
                            <b>Tổng tiền(VNĐ)</b>{" "}
                          </th>
                        </tr>
                      </thead>
                      <tbody>{renderOrderDetails()}</tbody>

                      <tfoot>
                        <tr>
                          <td className=" align-middle text-left" colSpan={4}>
                            <b>Tổng cộng</b>
                          </td>
                          <td className="font-weight-bold align-middle text-right">
                            {formatPrice(order.sub_total)} đ
                          </td>
                        </tr>
                        <tr>
                          <td className=" align-middle text-left" colSpan={4}>
                            <b className=" title_page_h1 text-primary">
                              Khuyến mãi
                            </b>
                          </td>
                          <td className=" align-middle text-right"></td>
                        </tr>
                        <tr>
                          <td className=" align-middle text-left" colSpan={4}>
                            <b>Tổng tiền giảm giá</b>{" "}
                          </td>
                          <td className="font-weight-bold align-middle text-right">
                            {formatPrice(order.total_discount)} đ
                          </td>
                        </tr>
                        <tr>
                          <td className=" align-middle text-left" colSpan={4}>
                            <b>Tổng tiền thanh toán</b>
                          </td>
                          <td className="font-weight-bold align-middle text-right">
                            {formatPrice(order.total)} đ
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="m-t-10 mb-2">
                    <FormGroup row>
                      <Col sm={2} xs={12}>
                        <CustomInput
                          className="pull-left"
                          onBlur={null}
                          checked={order.is_grow_revenue}
                          type="checkbox"
                          id="is_grow_revenue"
                          label="Có tính doanh thu"
                          disabled={true}
                        />
                      </Col>
                    </FormGroup>
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
