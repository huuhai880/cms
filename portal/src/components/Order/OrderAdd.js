import React from 'react';
import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Button,
    CustomInput,
    FormGroup,
    Label,
    Input,
    Form,
} from "reactstrap";
import { ActionButton } from "@widget";
import { mapDataOptions4Select } from "../../utils/html";
import { useState } from "react";
import { useEffect } from "react";
import { useFormik } from "formik";
import MessageError from "../Product/MessageError";
import Loading from "../Common/Loading";
import Select from "react-select";
import { convertValueSelect, formatPrice } from 'utils/index';
import { initialValues, validationSchema } from './const'
import OrderModel from 'models/OrderModel/index';
import "./style.scss";

function OrderAdd({ noEdit = false, order_id = 0 }) {
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(initialValues);
    const [customerOption, setCustomerOption] = useState([]);
    const [productComboOption, setProductComboOption] = useState([]);
    const [buttonType, setButtonType] = useState(null);
    const [alerts, setAlerts] = useState([]);

    const [dataOrderStatus] = useState([
        { label: "Chưa thanh toán", value: 0 },
        { label: "Đã thanh toán", value: 1 },
    ]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: order,
        validationSchema,
        validateOnBlur: false,
        validateOnChange: true,
        onSubmit: (values) => {
            handleSubmitOrder(values);
        },
    });


    useEffect(() => {
        initData();
    }, [])

    const initData = async () => {
        setLoading(true)
        const _orderModel = new OrderModel();
        try {
            let {
                order_no = '',
                listCustomer = [],
                listProductCombo = []
            } = await _orderModel.init(order_id);

            if (order_id > 0) {
                let _order = await _orderModel.detail(order_id);
                let value = {
                    ...initialValues,
                    ..._order,
                };
                setOrder(value);
            }
            else {
                let value = {
                    ...initialValues,
                    ...{ order_no }
                };
                setOrder(value);
            }

            let _productComboOption = mapDataOptions4Select(listProductCombo, 'temp_id', 'product_name');
            let _customerOption = mapDataOptions4Select(listCustomer, 'member_id', 'customer_name');
            setCustomerOption(_customerOption);
            setProductComboOption(_productComboOption);
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại")
            );
        }
        finally {
            setLoading(false)
        }
    }

    const handleSubmitOrder = async (values) => {
        const _orderModel = new OrderModel();
        try {
            if (buttonType == 'save_confirm') {
                handleConfirmOrder();
            }
            else {
                //Call API
                let { order_id_result, order_no_result } = await _orderModel.createOrUpdateOrder(values);
                window._$g.toastr.show("Lưu thành công!", "success");
                if (order_no_result != values.order_no && !order_id) {
                    window._$g.dialogs.alert(
                        window._$g._("Mã đơn hàng đã thay đổi. Mã đơn hàng mới " + order_no_result)
                    );
                }

                if (buttonType == "save_n_close") {
                    return window._$g.rdr("/order");
                }
                if (buttonType == "save" && !order_id) {
                    initData();
                    formik.resetForm();
                }
            }
        } catch (error) {
            let { errors, statusText, message } = error;
            let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");
            setAlerts([{ color: "danger", msg }]);
            window.scrollTo(0, 0);
        }
        finally {
            formik.setSubmitting(false);
        }
    }

    const handleSubmitForm = (type) => {
        setButtonType(type);
        formik.submitForm();
    };

    const handleConfirmOrder = () => {
        window._$g.dialogs.prompt(
            "Bạn có chắc chắn muốn tạo đơn hàng này?",
            "Xác nhận",
            async (confirm) => {
                if (confirm) {
                    try {
                        const _orderModel = new OrderModel();
                        let { values } = formik;
                        let { order_id_result, order_no_result } = await _orderModel.createOrUpdateOrder(values);
                        window._$g.toastr.show("Lưu thành công!", "success");

                        if (order_no_result != values.order_no && !order_id) {
                            window._$g.dialogs.alert(
                                window._$g._("Mã đơn hàng đã thay đổi. Mã đơn hàng mới " + order_no_result)
                            );
                        }

                        setTimeout(() => {
                            return window._$g.rdr("/order");
                        }, 500)
                    } catch (error) {
                        let { errors, statusText, message } = error;
                        let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");
                        setAlerts([{ color: "danger", msg }]);
                        window.scrollTo(0, 0);
                    }
                    finally {
                        formik.setSubmitting(false);
                    }
                }
                else {
                    formik.setSubmitting(false);
                }
            }
        );
    };

    const handleChangeCustomer = customer => {
        let {
            phone_number = '',
            email = '',
            address = '',
            member_id = 0,
            full_name = ''
        } = customer || {};
        let values = {
            ...formik.values,
            ...{
                member_id,
                phone_number: phone_number ? phone_number : '',
                email: email ? email : '',
                address: address ? address : '',
                full_name
            }
        };
        formik.setValues(values)
    }

    const handleAddProduct = () => {
        let order_detail = {
            product_id: null,
            combo_id: null,
            temp_id: null,
            product_name: null,
            quantity: 1,
            price: null,
            sub_total: null,
            is_combo: false
        };
        let _order_details = [...formik.values.order_details];
        _order_details.push(order_detail);
        formik.setFieldValue('order_details', _order_details)
    }

    const handleRemoveProduct = (index) => {
        let _order_details = [...formik.values.order_details];
        _order_details.splice(index, 1);
        formik.setFieldValue("order_details", _order_details);
    };


    const handleChangeQuantity = (index, value) => {
        let _order_details = [...formik.values.order_details];
        let _quantity = parseInt(_order_details[index].quantity);
        _quantity += parseInt(value);
        if (_quantity <= 0) _quantity = 1;
        _order_details[index].quantity = _quantity;
        _order_details[index].sub_total = _quantity * _order_details[index].price;
        formik.setFieldValue("order_details", _order_details);
        calculaOrder(_order_details)
    }

    const handleChangeInputQuantity = (index, e) => {
        let value = e.target.value;
        if (!value) {
            value = null;
        } else {
            value = parseInt(value);
        }
        let _order_details = [...formik.values.order_details];
        _order_details[index].quantity = value;
        _order_details[index].sub_total = value == 0 ? 0 : (value * _order_details[index].price);
        formik.setFieldValue("order_details", _order_details);
        calculaOrder(_order_details)
    }

    const handleBlurInputQuantity = (index, e) => {
        let value = e.target.value;
        if (!value) {
            value = 1;
        } else {
            value = parseInt(value);
        }
        let _order_details = [...formik.values.order_details];
        _order_details[index].quantity = value
        _order_details[index].sub_total = value == 0 ? 0 : (value * _order_details[index].price);
        formik.setFieldValue("order_details", _order_details);
        calculaOrder(_order_details)
    }

    const handleChangeProductCombo = (index, pro) => {
        let _order_details = [...formik.values.order_details];
        let {
            product_id = null,
            combo_id = null,
            temp_id = null,
            product_name = null,
            price = null,
            is_combo = false
        } = pro || {}

        _order_details[index].product_id = product_id;
        _order_details[index].combo_id = combo_id;
        _order_details[index].temp_id = temp_id;
        _order_details[index].product_name = product_name;
        _order_details[index].price = price;
        _order_details[index].is_combo = is_combo;
        _order_details[index].sub_total = _order_details[index].quantity == 0 ? 0 : (_order_details[index].quantity * price);
        formik.setFieldValue("order_details", _order_details);
        calculaOrder(_order_details)
    }

 

    const getProductComboOption = () => {
        let { order_details = [] } = formik.values || {};
        if (productComboOption && productComboOption.length > 0) {
            return productComboOption.map((item) => {
                return order_details.find((p) => p.temp_id == item.temp_id)
                    ? {
                        ...item,
                        isDisabled: true,
                    }
                    : item
            });
        }
        return [];
    }

    const calculaOrder = (order_details) => {
        let sub_total = 0;
        let total_discount = 0;
        order_details.forEach(item => {
            sub_total += item.quantity * item.price;
        });
        let _values = {
            ...formik.values,
            ...{
                sub_total,
                total: sub_total,
                total_discount
            }
        }
        formik.setValues(_values)
    }


    const renderListOrderDetail = () => {
        let { order_details = [] } = formik.values;
        if (order_details.length > 0) {
            return order_details.map((item, index) => {
                return <tr key={index}>
                    <td className='text-center text-middle'>{index + 1}</td>
                    <td className='text-middle' >
                        <Select
                            className="MuiPaper-filter__custom--select"
                            id={`product_combo_${item.temp_id}`}
                            name={`product_combo_${item.temp_id}`}
                            onChange={(e) => handleChangeProductCombo(index, e)}
                            isSearchable={true}
                            placeholder={"-- Chọn --"}
                            value={convertValueSelect(item.temp_id, getProductComboOption())}
                            options={getProductComboOption()}
                            isClearable={true}
                            styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            menuPortalTarget={document.querySelector("body")}
                        />
                    </td>
                    <td>
                        <div className="bw_quantity bw_flex" style={{ justifyContent: 'center' }}>
                            <div className={`bw_quantity_button bw_quantity_down ${!item.temp_id ? 'disabled' : ''}`}
                                onClick={() => !item.temp_id ? null : handleChangeQuantity(index, -1)}>
                                <i className="fa fa-minus"></i>
                            </div>
                            <input type="text"
                                value={item.quantity}
                                name="quantity"
                                onChange={e => handleChangeInputQuantity(index, e)}
                                onBlur={e => handleBlurInputQuantity(index, e)}
                                disabled={!item.temp_id}
                            />
                            <div className={`bw_quantity_button bw_quantity_up ${!item.temp_id ? 'disabled' : ''}`}
                                onClick={() => !item.temp_id ? null : handleChangeQuantity(index, 1)}>
                                <i className="fa fa-plus"></i>
                            </div>
                        </div>
                    </td>
                    <td className='text-middle text-center'>{formatPrice(item.price)} đ</td>
                    <td className='text-middle text-center'>{formatPrice(item.sub_total)} đ</td>
                    <td style={{ verticalAlign: "middle", }} className="text-center">
                        <Button
                            color="danger"
                            onClick={() => handleRemoveProduct(index)}
                            className="btn-sm"
                            disabled={noEdit}>
                            {" "}
                            <i className="fa fa-trash" />
                        </Button>
                    </td>
                </tr>
            })
        }
        return null;
    }

    const handleAddPromotion = () => {
        window._$g.dialogs.alert(
            window._$g._("Chức năng này đang được cập nhật.")
        );
    }

    return loading ? <Loading /> : (
        <div key={`view`} className="animated fadeIn news">
            <Row className="d-flex justify-content-center">
                <Col xs={12} md={12}>
                    <Card>
                        <CardHeader>
                            <b>Thêm mới đơn hàng </b>
                        </CardHeader>

                        <CardBody>
                            {alerts.map(({ color, msg }, idx) => {
                                return (
                                    <Alert
                                        key={`alert-${idx}`}
                                        color={color}
                                        isOpen={true}
                                        toggle={() => setAlerts([])}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: msg }} />
                                    </Alert>
                                );
                            })}
                            <Form id="formInfo">
                                <Row>
                                    <Col xs={12} className="mb15">
                                        <b className="underline title_page_h1 text-primary">Thông tin đơn hàng</b>
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
                                                            {...formik.getFieldProps("order_no")}
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
                                                            {...formik.getFieldProps("order_date")}
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
                                                        Trạng thái ĐH
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Select
                                                            className="MuiPaper-filter__custom--select"
                                                            id="status"
                                                            name="status"
                                                            onChange={(e) => {
                                                                let status = e ? e.value : null;
                                                                formik.setFieldValue('status', status)
                                                            }}
                                                            isSearchable={true}
                                                            placeholder={"-- Chọn --"}
                                                            value={convertValueSelect(formik.values['status'], dataOrderStatus)}
                                                            options={dataOrderStatus}
                                                            isClearable={true}
                                                        />
                                                        <MessageError formik={formik} name="status" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={12} className="mb15">
                                        <b className="underline title_page_h1 text-primary">Thông tin khách hàng</b>
                                    </Col>

                                    <Col xs={12} sm={12}>
                                        <Row>
                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="attribute_id" sm={3}>
                                                        Tên khách hàng
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Select
                                                            className="MuiPaper-filter__custom--select"
                                                            id="member_id"
                                                            name="member_id"
                                                            onChange={(e) => handleChangeCustomer(e)}

                                                            isSearchable={true}
                                                            placeholder={"-- Chọn --"}
                                                            value={convertValueSelect(formik.values['member_id'], customerOption)}
                                                            options={customerOption}
                                                        />
                                                        <MessageError formik={formik} name="member_id" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="attribute_id" sm={3}>
                                                        Email
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Input
                                                            name="email"
                                                            id="email"
                                                            type="text"
                                                            disabled={noEdit}
                                                            {...formik.getFieldProps('email')}
                                                            disabled={true}
                                                        />
                                                        <MessageError formik={formik} name="email" />
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
                                                        {/* <span className="font-weight-bold red-text"> *</span> */}
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Input
                                                            name="phone_number"
                                                            id="phone_number"
                                                            type="text"
                                                            disabled={noEdit}
                                                            {...formik.getFieldProps('phone_number')}
                                                            disabled={true}
                                                        />
                                                        {/* <MessageError formik={formik} name="phone_number" /> */}
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="relationship_id" sm={3}>
                                                        Địa chỉ
                                                        {/* <span className="font-weight-bold red-text"> *</span> */}
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Input
                                                            name="address"
                                                            id="address"
                                                            type="text"
                                                            disabled={noEdit}
                                                            {...formik.getFieldProps('address')}
                                                            disabled={true}
                                                        />
                                                        {/* <MessageError formik={formik} name="address" /> */}
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={12} className="mb15">
                                        <b className="underline title_page_h1 text-primary">Danh sách sản phẩm</b>
                                        <span className="font-weight-bold red-text"> *</span>
                                    </Col>


                                    <Col sm={12} className="d-flex align-items-center justify-content-end">
                                        {
                                            !noEdit && (
                                                <Button
                                                    key="buttonAddItem"
                                                    color="success"
                                                    disabled={(formik.values.order_details || []).length == productComboOption.length}
                                                    className="pull-right btn-block-sm mt-md-0 mt-sm-2 mb-2"
                                                    onClick={handleAddProduct}
                                                >
                                                    <i className="fa fa-plus-circle mr-2" />
                                                    Thêm sản phẩm
                                                </Button>
                                            )
                                        }
                                    </Col>

                                    <Col xs={12} className="border-secondary align-middle">
                                        <table className="table table-bordered table-hover ">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="align-middle text-center" width="5%"><b>STT</b></th>
                                                    <th className=" align-middle text-center"><b>Tên Sản phẩm/Combo</b></th>
                                                    <th className=" align-middle text-center" width="20%"><b>Số lượng</b></th>
                                                    <th className=" align-middle text-center" width="15%"><b>Đơn giá(VNĐ)</b></th>
                                                    <th className=" align-middle text-center" width="15%"> <b>Tổng tiền(VNĐ)</b> </th>
                                                    <th className=" align-middle text-center" width="10%"> <b>Thao tác</b></th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {renderListOrderDetail()}
                                            </tbody>

                                            <tfoot>
                                                <tr>
                                                    <td className=" align-middle text-left" colSpan={4}><b>Tổng cộng</b></td>
                                                    <td className="font-weight-bold align-middle text-right">{formatPrice(formik.values.sub_total)} đ</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td className=" align-middle text-left" colSpan={4}>
                                                        <b style={{ cursor: 'pointer' }} className='underline title_page_h1 text-primary' onClick={handleAddPromotion}>Thêm khuyến mãi</b>
                                                    </td>
                                                    <td className=" align-middle text-right"></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td className=" align-middle text-left" colSpan={4}><b>Tổng tiền giảm giá</b> </td>
                                                    <td className="font-weight-bold align-middle text-right">{formatPrice(formik.values.total_discount)} đ</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td className=" align-middle text-left" colSpan={4}><b>Tổng tiền thanh toán</b></td>
                                                    <td className="font-weight-bold align-middle text-right">{formatPrice(formik.values.total)} đ</td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                        <MessageError formik={formik} name="order_details" />
                                    </Col>
                                </Row>

                                <Row className="mt-2">
                                    <Col xs={12} className="m-t-10 mb-2 mt-2">
                                        <FormGroup row>
                                            <Col sm={2} xs={12}>
                                                <CustomInput
                                                    className="pull-left"
                                                    onBlur={null}
                                                    checked={formik.values.is_grow_revenue}
                                                    type="checkbox"
                                                    id="is_grow_revenue"
                                                    onChange={(e) => {
                                                        formik.setFieldValue("is_grow_revenue", e.target.checked);
                                                    }}
                                                    label="Có tính doanh thu"
                                                    disabled={noEdit}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>



                                <Row className="mt-4">
                                    <Col xs={12} sm={12} style={{ padding: "0px" }}>
                                        <ActionButton
                                            isSubmitting={formik.isSubmitting}
                                            buttonList={[
                                                {
                                                    title: "Chỉnh sửa",
                                                    color: "primary",
                                                    isShow: noEdit,
                                                    icon: "edit",
                                                    permission: "SL_ORDER_EDIT",
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr(`/order/edit/${order_id}`),
                                                },
                                                {
                                                    title: "Lưu",
                                                    color: "primary",
                                                    isShow: !noEdit && !formik.values.status,
                                                    notSubmit: true,
                                                    permission: ["SL_ORDER_EDIT", "SL_ORDER_ADD"],
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save"),
                                                },
                                                {
                                                    title: "Lưu và đóng",
                                                    color: "success",
                                                    isShow: !noEdit && !formik.values.status,
                                                    permission: ["SL_ORDER_EDIT", "SL_ORDER_ADD"],
                                                    notSubmit: true,
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save_n_close"),
                                                },

                                                {
                                                    title: "Lưu và xác nhận",
                                                    color: "primary",
                                                    isShow: !noEdit && formik.values.status,
                                                    notSubmit: true,
                                                    permission: ["SL_ORDER_EDIT", "SL_ORDER_ADD"],
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save_confirm"),
                                                },

                                                {
                                                    title: "Đóng",
                                                    icon: "times-circle",
                                                    isShow: true,
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr("/order"),
                                                },
                                            ]}
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>

                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default OrderAdd;