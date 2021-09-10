import React from 'react';
import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Button,
    Table,
    Modal,
    ModalBody,
    CustomInput,
    FormGroup,
    Label,
    Form,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "reactstrap";
import { ActionButton } from "@widget";

import { useState } from "react";
import NumberFormat from "../Common/NumberFormat";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./_constant";
import MessageError from "../Product/MessageError";
import './style.scss'
import Product from 'components/Product/Product';
import ProductCombo from 'components/ProductCombo/ProductCombo';
import CustomerType from 'components/CustomerType/CustomerType';
import DatePicker from "../Common/DatePicker";
import PriceModel from 'models/PriceModel/index';
import moment from 'moment';

const _priceModel = new PriceModel();

function PriceAdd(props) {
    const [price, setPrice] = useState(initialValues)
    const [alerts, setAlerts] = useState([])
    const [buttonType, setButtonType] = useState(null);
    const [isShowAddProduct, setShowAddProduct] = useState(false)
    const [isShowAddCombo, setShowAddCombo] = useState(false)
    const [isShowCustomerType, setShowCustomerType] = useState(false)

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: price,
        validationSchema,
        validateOnBlur: false,
        validateOnChange: true,
        onSubmit: (values) => {
            handleSubmitPrice(values);
        },
    });


    const handleSubmitPrice = async (values) => {
        try {
            let result = await _priceModel.create(values);
            window._$g.toastr.show("Lưu thành công!", "success");
            if (buttonType == "save_n_close") {
                return window._$g.rdr("/price");
            }
            if (buttonType == "save") {
                formik.resetForm();
            }
        } catch (error) {
            let { errors, statusText, message } = error;
            let msg = [`<b>${statusText || message}</b>`]
                .concat(errors || [])
                .join("<br/>");

            setAlerts([{ color: "danger", msg }]);
            window.scrollTo(0, 0);
        } finally {
            formik.setSubmitting(false);
        }
    }

    const handleOnKeyDown = (keyEvent) => {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    };

    const handleSubmitForm = (type) => {
        setButtonType(type);
        formik.submitForm();
    };

    const handleAddProduct = (objProduct = {}) => {
        setShowAddProduct(false)
        let productsCl = [...formik.values.products] || [];
        let _products = Object.keys(objProduct).length == 0 ? productsCl :
            (Object.keys(objProduct) || []).reduce((arr, key) => {
                arr.push(objProduct[key]);
                return arr;
            }, []);

        if (_products.length > 0) {
            for (let index = 0; index < _products.length; index++) {
                const product = _products[index];
                let check = productsCl.find(p => p.product_id == product.product_id);
                if (!check) {
                    productsCl.push(product)
                }
            }
        }

        formik.setFieldValue('products', productsCl)
    }

    const handleDeleteProduct = (index) => {
        let { products = [] } = formik.values;
        products.splice(index, 1)
        formik.setFieldValue('products', products)
    }

    const renderProduct = () => {
        let { products } = formik.values;
        if (products.length > 0) {
            return products.map((item, index) => (
                <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.product_name}</td>
                    <td
                        className="text-center"
                        style={{
                            verticalAlign: "middle",
                        }}>
                        <Button
                            color="danger"
                            style={{
                                width: 24,
                                height: 24,
                                padding: 0,
                            }}
                            onClick={() => handleDeleteProduct(index)}
                            title="Xóa"
                            disabled={false}
                        >
                            <i className="fa fa-minus-circle" />
                        </Button>
                    </td>
                </tr>
            ))
        }
        return <tr>
            <td className="text-center" colSpan={50}>
                Không có dữ liệu
            </td>
        </tr>
    }


    const handleAddCombo = (objCombo = {}) => {
        setShowAddCombo(false)
        let combosCl = [...formik.values.combos] || [];
        let _combos = Object.keys(objCombo).length == 0 ? combosCl :
            (Object.keys(objCombo) || []).reduce((arr, key) => {
                arr.push(objCombo[key]);
                return arr;
            }, []);

        if (_combos.length > 0) {
            for (let index = 0; index < _combos.length; index++) {
                const combo = _combos[index];
                let check = combosCl.find(p => p.combo_id == combo.combo_id);
                if (!check) {
                    combosCl.push(combo)
                }
            }
        }

        formik.setFieldValue('combos', combosCl)
    }

    const handleDeleteCombo = (index) => {
        let { combos = [] } = formik.values;
        combos.splice(index, 1)
        formik.setFieldValue('combos', combos)
    }

    const renderCombo = () => {
        let { combos } = formik.values;
        if (combos.length > 0) {
            return combos.map((item, index) => (
                <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.combo_name}</td>
                    <td
                        className="text-center"
                        style={{
                            verticalAlign: "middle",
                        }}>
                        <Button
                            color="danger"
                            style={{
                                width: 24,
                                height: 24,
                                padding: 0,
                            }}
                            onClick={() => handleDeleteCombo(index)}
                            title="Xóa"
                            disabled={false}
                        >
                            <i className="fa fa-minus-circle" />
                        </Button>
                    </td>
                </tr>
            ))
        }
        return <tr>
            <td className="text-center" colSpan={50}>
                Không có dữ liệu
            </td>
        </tr>
    }

    const handleAddCustomerType = (objCustomerType = {}) => {
        setShowCustomerType(false)
        let customer_typesCl = [...formik.values.customer_types] || [];
        let _customer_types = Object.keys(objCustomerType).length == 0 ? customer_typesCl :
            (Object.keys(objCustomerType) || []).reduce((arr, key) => {
                arr.push(objCustomerType[key]);
                return arr;
            }, []);

        if (_customer_types.length > 0) {
            for (let index = 0; index < _customer_types.length; index++) {
                const customer_type = _customer_types[index];
                let check = customer_typesCl.find(p => p.customer_type_id == customer_type.customer_type_id);
                if (!check) {
                    customer_typesCl.push(customer_type)
                }
            }
        }
        formik.setFieldValue('customer_types', customer_typesCl)
    }

    const handleDeleteCustomerType = (index) => {
        let { customer_types = [] } = formik.values;
        customer_types.splice(index, 1)
        formik.setFieldValue('customer_types', customer_types)
    }

    const renderCustomerType = () => {
        let { customer_types } = formik.values;
        if (customer_types.length > 0) {
            return customer_types.map((item, index) => (
                <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.customer_type_name}</td>
                    <td
                        className="text-center"
                        style={{
                            verticalAlign: "middle",
                        }}>
                        <Button
                            color="danger"
                            style={{
                                width: 24,
                                height: 24,
                                padding: 0,
                            }}
                            onClick={() => handleDeleteCustomerType(index)}
                            title="Xóa"
                            disabled={false}
                        >
                            <i className="fa fa-minus-circle" />
                        </Button>
                    </td>
                </tr>
            ))
        }
        return <tr>
            <td className="text-center" colSpan={50}>
                Không có dữ liệu
            </td>
        </tr>
    }

    const isAllowed = (values, isPrice = false) => {
        let { is_percent = false } = formik.values;
        const { floatValue = 0 } = values;
        return floatValue >= 0 && floatValue <= (!is_percent || isPrice ? 999999999 : 100);
    }

    return (
        <div className="animated fadeIn">
            <Row className="d-flex justify-content-center">
                <Col xs={12} md={12}>
                    <Card>
                        <CardHeader>
                            <b>
                                Làm giá
                            </b>
                        </CardHeader>

                        <CardBody>
                            {alerts.map(({ color, msg }, idx) => {
                                return (
                                    <Alert
                                        key={`alert-${idx}`}
                                        color={color}
                                        isOpen={true}
                                        toggle={() => setAlerts([])}>
                                        <span dangerouslySetInnerHTML={{ __html: msg }} />
                                    </Alert>
                                );
                            })}
                            <Form
                                id="frmPrice"
                                onSubmit={formik.handleSubmit}
                                onKeyDown={handleOnKeyDown}
                            >
                                <Row className="mb-4">
                                    <Col xs={12}>
                                        <b className="underline title_page_h1 text-primary">Thông tin làm giá</b>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={12}>
                                        <CustomInput
                                            className="pull-left"
                                            onBlur={null}
                                            checked={formik.values.is_apply_combo}
                                            type="checkbox"
                                            id="is_apply_combo"
                                            onChange={({ target }) => {
                                                formik.setFieldValue('is_apply_combo', target.checked)
                                                if (target.checked) {
                                                    formik.setFieldValue('products', [])
                                                }
                                                else {
                                                    formik.setFieldValue('combos', [])
                                                }
                                            }}
                                            label="Áp dụng cho Combo"
                                        // disabled={false}
                                        />
                                    </Col>
                                </Row>
                                {
                                    !formik.values.is_apply_combo ?
                                        <>
                                            {/* <Row className="mb15">
                                                <Col xs={12}>
                                                    <b className="underline title_page_h1 text-primary">Danh sách sản phẩm</b>
                                                </Col>
                                            </Row> */}

                                            <Row>
                                                <Col
                                                    sm={12}
                                                    className="d-flex align-items-center justify-content-end">
                                                    <Button
                                                        key="buttonAddItem"
                                                        color="success"
                                                        disabled={false}
                                                        onClick={() => setShowAddProduct(true)}
                                                        className="pull-right btn-block-sm mt-md-0 mt-sm-2 mb-2">
                                                        <i className="fa fa-plus-circle mr-2" />
                                                        Chọn sản phẩm
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col xs={12} sm={12}>
                                                    <Table
                                                        bordered
                                                        className="table-news-related"
                                                        striped
                                                        style={{ marginBottom: 0 }}>
                                                        <thead>
                                                            <tr>
                                                                <th className="text-center" style={{ width: 50 }}>STT</th>
                                                                <th className="text-center">Tên sản phẩm</th>
                                                                <th className="text-center" style={{ width: 100 }}>Thao tác</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {renderProduct()}
                                                        </tbody>
                                                    </Table>
                                                    <MessageError formik={formik} name="products" />
                                                </Col>
                                            </Row>
                                        </> :
                                        <>
                                            {/* <Row className="mb15">
                                                <Col xs={12}>
                                                    <b className="underline title_page_h1 text-primary">Danh sách Combo</b>
                                                </Col>
                                            </Row> */}

                                            <Row>
                                                <Col
                                                    sm={12}
                                                    className="d-flex align-items-center justify-content-end">
                                                    <Button
                                                        key="buttonAddItem"
                                                        color="success"
                                                        disabled={false}
                                                        onClick={() => setShowAddCombo(true)}
                                                        className="pull-right btn-block-sm mt-md-0 mt-sm-2 mb-2">
                                                        <i className="fa fa-plus-circle mr-2" />
                                                        Chọn Combo
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col xs={12} sm={12}>
                                                    <Table
                                                        bordered
                                                        className="table-news-related"
                                                        striped
                                                        style={{ marginBottom: 0 }}>
                                                        <thead>
                                                            <tr>
                                                                <th className="text-center" style={{ width: 50 }}>STT</th>
                                                                <th className="text-center">Tên Combo</th>
                                                                <th className="text-center" style={{ width: 100 }}>Thao tác</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {renderCombo()}
                                                        </tbody>
                                                    </Table>
                                                    <MessageError formik={formik} name="combos" />
                                                </Col>
                                            </Row>

                                        </>
                                }
                                <Row className="mt-4">
                                    <Col xs={12} sm={6}>
                                        <FormGroup row>
                                            <Label
                                                className="text-left"
                                                sm={4}>
                                                Giá {formik.values.is_apply_combo ? 'Combo' : 'sản phẩm'}
                                                <span className="font-weight-bold red-text"> *</span>
                                            </Label>
                                            <Col sm={8}>
                                                <InputGroup>
                                                    <NumberFormat
                                                        type="text"
                                                        name="price"
                                                        disabled={false}
                                                        allowNegative={false}
                                                        thousandSeparator=","
                                                        decimalSeparator="."
                                                        value={formik.values.price ? formik.values.price : ''}
                                                        onValueChange={({ value }) => {
                                                            let price = 1 * value.replace(/,/g, "");
                                                            formik.setFieldValue('price', price)
                                                        }}
                                                        isAllowed={values => isAllowed(values, true)}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                        <InputGroupText>VNĐ</InputGroupText>
                                                    </InputGroupAddon>

                                                </InputGroup>
                                                <MessageError formik={formik} name="price" />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col xs={12}>
                                        <b className="underline title_page_h1 text-primary">Thông tin khuyến mãi</b>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} sm={3}>
                                        <FormGroup row>
                                            <Col sm={12}>
                                                <CustomInput
                                                    className="pull-left"
                                                    onBlur={null}
                                                    checked={formik.values.is_apply_promotion}
                                                    type="checkbox"
                                                    id="is_apply_promotion"
                                                    onChange={({ target }) => {
                                                        formik.setFieldValue("is_apply_promotion", target.checked)
                                                    }}
                                                    label="Áp dụng khuyến mãi"
                                                    disabled={false} />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                {formik.values.is_apply_promotion && <Row>
                                    <Col xs={12} sm={6}>
                                        <FormGroup row>
                                            <Label
                                                className="text-left"
                                                sm={4}>
                                                Thời gian áp dụng
                                                <span className="font-weight-bold red-text"> *</span>
                                            </Label>
                                            <Col sm={8}>
                                                <DatePicker
                                                    startDate={formik.values.from_date ?
                                                        moment(formik.values.from_date, 'DD/MM/YYYY') : null}
                                                    startDateId="from_date"
                                                    endDate={formik.values.to_date ?
                                                        moment(formik.values.to_date, 'DD/MM/YYYY') : null}
                                                    endDateId="to_date"
                                                    onDatesChange={({ startDate, endDate }) => {
                                                        let from_date = startDate ? startDate.format("DD/MM/YYYY") : null;
                                                        let to_date = endDate ? endDate.format("DD/MM/YYYY") : null;
                                                        formik.setFieldValue('from_date', from_date)
                                                        formik.setFieldValue('to_date', to_date)
                                                    }}
                                                    isMultiple
                                                    minToday={true}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>


                                    <Col xs={12} sm={6}>
                                        <FormGroup row>
                                            <Col xs={12} sm={3}>
                                                <CustomInput
                                                    className="pull-left mt-2"
                                                    onBlur={null}
                                                    checked={formik.values.is_percent}
                                                    type="checkbox"
                                                    id="is_percent"
                                                    onChange={(e) => {
                                                        formik.setFieldValue('is_percent', e.target.checked)
                                                    }}
                                                    label="Giảm giá %"
                                                    disabled={false}
                                                />
                                            </Col>
                                            <Label
                                                className="text-left"
                                                sm={3}>
                                                Giá trị khuyến mãi
                                                <span className="font-weight-bold red-text"> *</span>
                                            </Label>
                                            <Col sm={6}>
                                                <InputGroup>
                                                    <NumberFormat
                                                        type="text"
                                                        name="price"
                                                        disabled={false}
                                                        allowNegative={false}
                                                        thousandSeparator=","
                                                        decimalSeparator="."
                                                        value={formik.values.discount_value ? formik.values.discount_value : ''}
                                                        onValueChange={({ value }) => {
                                                            let discount_value = 1 * value.replace(/,/g, "");
                                                            formik.setFieldValue('discount_value', discount_value)
                                                        }}
                                                        isAllowed={values => isAllowed(values)}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                        <InputGroupText>{formik.values.is_percent ? '%' : 'VNĐ'}</InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <MessageError formik={formik} name="discount_value" />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                </Row>
                                }

                                <Row className="mb-4">
                                    <Col xs={12}>
                                        <b className="underline title_page_h1 text-primary">Thông tin áp dụng</b>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col xs={12} sm={12}>
                                        <CustomInput
                                            className="pull-left"
                                            onBlur={null}
                                            checked={formik.values.is_apply_customer_type}
                                            type="checkbox"
                                            id="is_apply_customer_type"
                                            onChange={(e) => {
                                                formik.setFieldValue('is_apply_customer_type', e.target.checked)
                                            }}
                                            label="Áp dụng loại khách hàng"
                                            disabled={false}
                                        />
                                    </Col>
                                </Row>

                                {
                                    formik.values.is_apply_customer_type &&
                                    <>
                                        {/* <Row className="mb15">
                                            <Col xs={12}>
                                                <b className="underline title_page_h1 text-primary">Danh sách Loại khách hàng</b>
                                            </Col>
                                        </Row> */}

                                        <Row >
                                            <Col
                                                sm={12}
                                                className="d-flex align-items-center justify-content-end">
                                                <Button
                                                    key="buttonAddItem"
                                                    color="success"
                                                    disabled={false}
                                                    onClick={() => setShowCustomerType(true)}
                                                    className="pull-right btn-block-sm mt-md-0 mt-sm-2 mb-2">
                                                    <i className="fa fa-plus-circle mr-2" />
                                                    Chọn Loại khách hàng
                                                </Button>
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <Col xs={12} sm={12}>
                                                <Table
                                                    bordered
                                                    className="table-news-related"
                                                    striped
                                                    style={{ marginBottom: 0 }}>
                                                    <thead>
                                                        <tr>
                                                            <th className="text-center" style={{ width: 50 }}>STT</th>
                                                            <th className="text-center">Tên Loại khách hàng</th>
                                                            <th className="text-center" style={{ width: 100 }}>Thao tác</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {renderCustomerType()}
                                                    </tbody>
                                                </Table>
                                                <MessageError formik={formik} name="customer_types" />
                                            </Col>
                                        </Row>
                                    </>
                                }


                                <Row className="mb-4 mt-4">
                                    <Col xs={12} sm={12}>
                                        <CustomInput
                                            className="pull-left"
                                            onBlur={null}
                                            checked={formik.values.is_active}
                                            type="checkbox"
                                            id="is_active"
                                            onChange={(e) => formik.setFieldValue('is_active', e.target.checked)}
                                            label="Kích hoạt"
                                            disabled={false}
                                        />
                                    </Col>
                                </Row>

                                <Row className="mt-4">
                                    <Col xs={12} sm={12} style={{ padding: "0px" }}>
                                        <ActionButton
                                            isSubmitting={formik.isSubmitting}
                                            buttonList={[

                                                {
                                                    title: "Lưu",
                                                    color: "primary",
                                                    isShow: true,
                                                    notSubmit: true,
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save"),
                                                },
                                                {
                                                    title: "Lưu và đóng",
                                                    color: "success",
                                                    isShow: true,
                                                    notSubmit: true,
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save_n_close"),
                                                },
                                                {
                                                    title: "Đóng",
                                                    icon: "times-circle",
                                                    isShow: true,
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr("/price"),
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

            {isShowAddProduct ? (
                <Modal isOpen={true} size={"lg"} style={{ maxWidth: "60rem" }}>
                    <ModalBody className="p-0">
                        <Product
                            handlePick={handleAddProduct}
                            isOpenModal={isShowAddProduct}
                            products={formik.values.products}
                        />
                    </ModalBody>
                </Modal>
            ) : null}

            {isShowAddCombo ? (
                <Modal isOpen={true} size={"lg"} style={{ maxWidth: "60rem" }}>
                    <ModalBody className="p-0">
                        <ProductCombo
                            handlePick={handleAddCombo}
                            isOpenModal={isShowAddCombo}
                            combos={formik.values.combos}
                        />
                    </ModalBody>
                </Modal>
            ) : null}

            {isShowCustomerType ? (
                <Modal isOpen={true} size={"lg"} style={{ maxWidth: "60rem" }}>
                    <ModalBody className="p-0">
                        <CustomerType
                            handlePick={handleAddCustomerType}
                            isOpenModal={isShowCustomerType}
                            customerTypes={formik.values.customer_types}
                        />
                    </ModalBody>
                </Modal>
            ) : null}
        </div>
    );
}

export default PriceAdd;