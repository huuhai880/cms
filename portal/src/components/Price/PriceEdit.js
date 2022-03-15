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
    Input,
    Form,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "reactstrap";
import { ActionButton } from "@widget";

import { useState } from "react";
import NumberFormat from "../Common/NumberFormat";
import { useEffect } from "react";
import { useFormik } from "formik";
import { initialValuesUpdate as initialValues, validationSchemaUpdate as validationSchema } from "./_constant";
import MessageError from "../Product/MessageError";
import Loading from "../Common/Loading";
import './style.scss'
import CustomerType from 'components/CustomerType/CustomerType';
import DatePicker from "../Common/DatePicker";
import PriceModel from 'models/PriceModel/index';
import moment from 'moment';
import { useParams } from "react-router";

const _priceModel = new PriceModel();

function PriceEdit({ noEdit = false, priceId = null }) {
    const [price, setPrice] = useState(initialValues)
    const [alerts, setAlerts] = useState([])
    const [buttonType, setButtonType] = useState(null);
    const [isShowCustomerType, setShowCustomerType] = useState(false)
    const [loading, setLoading] = useState(false);
    const [isApplyCombo, setIsApplyCombo] = useState(false)

    let { id } = useParams()

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: price,
        validationSchema: validationSchema(isApplyCombo),
        validateOnBlur: false,
        validateOnChange: true,
        onSubmit: (values) => {
            handleUpdatePrice(values);
        },
    });


    useEffect(() => {
        getPrice()
    }, [])

    const getPrice = async () => {
        setLoading(true);
        try {
            let data = await _priceModel.read(id);

            let value = {
                ...initialValues,
                ...data,
            }
            setIsApplyCombo(value.is_apply_combo)
            setPrice(value)
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
            );
        }
        finally {
            setLoading(false);
        }
    }

    const handleUpdatePrice = async (values) => {
        try {
            let result = _priceModel.update(id, values);
            window._$g.toastr.show("Lưu thành công!", "success");
            if (buttonType == "save_n_close") {
                return window._$g.rdr("/price");
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
        //let { customer_types = [] } = formik.values;
        let customer_types_Cl = [...formik.values.customer_types] || [];
        customer_types_Cl.splice(index, 1)
        formik.setFieldValue('customer_types', customer_types_Cl)
    }

    const renderCustomerType = () => {
        let { customer_types } = formik.values;
        if (customer_types.length > 0) {
            return customer_types.map((item, index) => (
                <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.customer_type_name}</td>
                    <td
                        className="text-center wrap-chbx"
                        style={{
                            verticalAlign: "middle",
                        }} >
                        <CustomInput
                            className="check-limit"
                            onBlur={null}
                            checked={item.is_apply_price}
                            type="checkbox"
                            id={`is_apply_price_${index}`}
                            onChange={({ target }) => {
                                handleChangeCustomerType(target.checked, 'is_apply_price', index)
                            }}
                            disabled={noEdit}
                        />

                    </td>
                    <td
                        className="text-center wrap-chbx"
                        style={{
                            verticalAlign: "middle",
                        }} >
                        <CustomInput
                            className="check-limit"
                            onBlur={null}
                            checked={item.is_apply_promotion}
                            type="checkbox"
                            id={`is_apply_promotion_${index}`}
                            onChange={({ target }) => {
                                handleChangeCustomerType(target.checked, 'is_apply_promotion', index)
                            }}
                            disabled={!formik.values.is_apply_promotion || noEdit}
                        />

                    </td>
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
                            disabled={noEdit}
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

    const genTitle = () => {
        let { product_name = '', combo_name = '', is_apply_combo = false } = formik.values;
        return (noEdit ? 'Chi tiết giá' : 'Chỉnh sửa giá') + ' ' + (is_apply_combo ? combo_name : product_name)
    }

    const isAllowed = (values, isPrice = false) => {
        let { is_percent = false } = formik.values;
        const { floatValue = 0 } = values;
        return floatValue >= 0 && floatValue <= (!is_percent || isPrice ? 999999999 : 100);
    }

    const handleChangeCustomerType = (value, name, index) => {
        let customer_types_cl = [...formik.values.customer_types] || [];
        customer_types_cl[index][name] = value
        formik.setFieldValue('customer_types', customer_types_cl)
    }

    return loading ? (
        <Loading />
    ) : (
        <div className="animated fadeIn">
            <Row className="d-flex justify-content-center">
                <Col xs={12} md={12}>
                    <Card>
                        <CardHeader>
                            <b>{genTitle()}</b>
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
                                onKeyDown={handleOnKeyDown}>
                                <Row className="mb-4">
                                    <Col xs={12}>
                                        <b className="underline title_page_h1 text-primary">Thông tin làm giá</b>
                                    </Col>
                                </Row>

                                <Row className="mt-4">
                                    <Col xs={12} sm={6}>
                                        <FormGroup row>
                                            <Label
                                                className="text-left"
                                                sm={4}>
                                                {formik.values.is_apply_combo ? "Tên Combo" : "Tên sản phẩm"}
                                            </Label>
                                            <Col sm={8}>
                                                <Input
                                                    type="text"
                                                    placeholder={formik.values.is_apply_combo ? "Tên Combo" : "Tên sản phẩm"}
                                                    disabled={true}
                                                    name={formik.values.is_apply_combo ? "combo_name" : "product_name"}
                                                    value={formik.values.is_apply_combo ? formik.values.combo_name : formik.values.product_name}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
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
                                                        disabled={noEdit}
                                                        allowNegative={false}
                                                        thousandSeparator=","
                                                        decimalSeparator="."
                                                        value={formik.values.price ? formik.values.price : ''}
                                                        onValueChange={({ value }) => {
                                                            // let price = 1 * value.replace(/,/g, "");
                                                            formik.setFieldValue('price', value)
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
                                        <b className="underline title_page_h1 text-primary">Thông tin ưu đãi</b>
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
                                                        let { checked } = target;
                                                        if (!checked) {
                                                            formik.setFieldValue("discount_value", null);
                                                            formik.setFieldValue('from_date', null)
                                                            formik.setFieldValue('to_date', null)
                                                        }
                                                        formik.setFieldValue("is_apply_promotion", checked)
                                                    }}
                                                    label="Áp dụng ưu đãi"
                                                    disabled={noEdit} />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                {formik.values.is_apply_promotion ? <Row>
                                    <Col xs={12} sm={6}>
                                        <FormGroup row>
                                            <Label
                                                className="text-left"
                                                sm={4}>
                                                Giá ưu đãi
                                                <span className="font-weight-bold red-text"> *</span>
                                            </Label>
                                            <Col sm={8}>
                                                <InputGroup>
                                                    <NumberFormat
                                                        type="text"
                                                        name="price"
                                                        disabled={noEdit}
                                                        allowNegative={false}
                                                        thousandSeparator=","
                                                        decimalSeparator="."
                                                        value={formik.values.discount_value ? formik.values.discount_value : ''}
                                                        onValueChange={({ value }) => {
                                                            // let discount_value = 1 * value.replace(/,/g, "");
                                                            formik.setFieldValue('discount_value', value)
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
                                                    disabled={noEdit}
                                                    minToday={true}
                                                />
                                               <MessageError formik={formik} name="from_date" />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row> : null
                                }

                                {/* <Row className="mb-4">
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
                                            disabled={noEdit}
                                        />
                                    </Col>
                                </Row>

                                {
                                    formik.values.is_apply_customer_type &&
                                    <>
                                        <Row >
                                            <Col
                                                sm={12}
                                                className="d-flex align-items-center justify-content-end">
                                                <Button
                                                    key="buttonAddItem"
                                                    color="success"
                                                    disabled={noEdit}
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
                                                            <th className="text-center" style={{ width: '20%' }}>Áp dụng giá</th>
                                                            <th className="text-center" style={{ width: '20%' }}>Áp dụng khuyến mãi</th>
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
                                } */}

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
                                            disabled={noEdit}
                                        />
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
                                                    permission: "SL_PRICE_EDIT",
                                                    notSubmit: true,
                                                    onClick: () =>
                                                        window._$g.rdr(`/price/edit/${id}`),
                                                },
                                                {
                                                    title: "Lưu",
                                                    color: "primary",
                                                    isShow: !noEdit,
                                                    notSubmit: true,
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save"),
                                                },
                                                {
                                                    title: "Lưu và đóng",
                                                    color: "success",
                                                    isShow: !noEdit,
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

export default PriceEdit;