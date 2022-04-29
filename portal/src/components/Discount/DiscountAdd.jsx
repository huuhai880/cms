import React, {useState, useEffect} from 'react';
import {
    Alert,
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
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from 'reactstrap';
import moment from 'moment';

import {Radio, Checkbox, Space, Table} from 'antd';
import {useParams} from 'react-router';
import {useFormik} from 'formik';
import {layoutFullWidthHeight, mapDataOptions4Select} from '../../utils/html';
import {initialValues, validationSchema} from './const';
import DiscountModel from '../../models/DiscountModel';
import NumberFormat from '../Common/NumberFormat';
import {CheckAccess} from '../../navigation/VerifyAccess';
import Select from 'react-select';
import {columns_customer_type, columns_product} from './colums';
import DatePicker from '../Common/DatePicker';
layoutFullWidthHeight();

function DiscountAdd({noEdit}) {
    const _discountModel = new DiscountModel();
    const [dataDiscount, setDataDiscount] = useState(initialValues);
    let {id = null} = useParams();
    const [alerts, setAlerts] = useState([]);
    const [btnType, setbtnType] = useState('');
    const [productOption, setProductOption] = useState([]);
    const [customerTypeOption, setCustomerTypeOption] = useState([]);

    const [dataStatus] = useState([
        {label: 'Chưa áp dụng', value: '1'},
        {label: 'Đang áp dụng', value: '2'},
        {label: 'Hết thời gian áp dụng', value: '3'},
    ]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: dataDiscount,
        validationSchema,
        validate: values => handleCheckValidate(values),
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: values => {
            handleCreateOrUpdate(values);
        },
    });

    const handleCreateOrUpdate = async values => {
        try {
            values.product_list = values.is_all_product ? [] : values.product_list;
            values.customer_type_list = values.is_all_customer_type ? [] : values.customer_type_list;
            await _discountModel.create(values);
            window._$g.toastr.show('Lưu thành công!', 'success');

            if (btnType == 'save' && !id) {
                formik.resetForm();
            }
            if (btnType == 'save&quit') {
                return window._$g.rdr('/discount');
            }
        } catch (error) {
            let {errors, statusText, message} = error;
            let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join('<br/>');
            setAlerts([{color: 'danger', msg}]);
            window.scrollTo(0, 0);
        } finally {
            formik.setSubmitting(false);
        }
    };

    useEffect(() => {
        initData();
    }, []);

    useEffect(() => {
        if (formik.values.start_date) {
            var _now = moment();
            let discount_status = 1;
            var _start_date = moment(formik.values.start_date, 'DD/MM/YYYY');
            var _end_date = formik.values.end_date ?  moment(formik.values.end_date, 'DD/MM/YYYY') : null;
            if(_now >= _start_date && (_now <= _end_date || !_end_date)){
                discount_status = 2;
            }
            else if(_now < _start_date){
                discount_status = 1;
            }
            else if(_now > _end_date && _end_date){
                discount_status = 3;
            }

            formik.setFieldValue('discount_status', discount_status);
        }
    }, [formik.values.start_date, formik.values.end_date]);

    const handleCheckValidate = value => {
        let errors = {};

        if (value.is_min_num_product && !value.value_min_num_product) {
            errors.value_min_num_product = 'Số lượng sản phẩm tối thiểu là bắt buộc.';
        } else if (value.is_min_total_money && !value.value_min_total_money) {
            errors.value_min_total_money = 'Giá trị đơn hàng tối thiểu là bắt buộc.';
        }
        if (value.is_appoint_product && value.product_list.length == 0) {
            errors.is_appoint_product = 'Sản phẩm chỉ định là bắt buộc.';
        }
        if (value.is_apppoint_customer_type && value.customer_type_list.length == 0) {
            errors.is_apppoint_customer_type = 'Loại khách hàng chỉ định là bắt buộc.';
        }
        if (value.is_percent_discount && value.discount_value > 100) {
            errors.discount_value = 'Giá trị % không được lớn hơn 100.';
        }
        return errors;
    };

    const initData = async () => {
        try {
            let {resProduct = [], resCustomer = []} = await _discountModel.getOptions();
            let _productOption = mapDataOptions4Select(resProduct, 'temp_id', 'product_name');
            let _customerTypeOption = mapDataOptions4Select(resCustomer, 'customer_type_id', 'customer_type_name');
            setProductOption(_productOption);
            setCustomerTypeOption(_customerTypeOption);

            if (id) {
                let _dataDiscount = await _discountModel.detail(id);
                setDataDiscount({
                    ...initialValues,
                    ..._dataDiscount
                });
            }
        } catch (error) {
            window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vui lòng F5 thử lại'));
        }
    };

    const getOptionCustomerType = () => {
        let {customer_type_list = []} = formik.values || {};
        if (customerTypeOption && customerTypeOption.length > 0) {
            return customerTypeOption.map(item => {
                return customer_type_list.find(p => p.customer_type_id == item.value)
                    ? {
                          ...item,
                          isDisabled: true,
                      }
                    : item;
            });
        }
        return [];
    };

    const getOptionProduct = () => {
        let {product_list = []} = formik.values || {};
        if (productOption && productOption.length > 0) {
            return productOption.map(item => {
                return product_list.find(p => p.temp_id == item.temp_id)
                    ? {
                          ...item,
                          isDisabled: true,
                      }
                    : item;
            });
        }
        return [];
    };

    const defaultValueStatus = () => {
        let newData = dataStatus.find(x => x.value == formik.values.discount_status);
        return newData;
    };

    const handleChangeDiscountType = (name, value) => {
        formik.setFieldValue('is_percent_discount', value ? false : true);
        formik.setFieldValue('is_money_discount', value ? true : false);
        formik.setFieldValue('discount_value', '');
    };

    const handleChangeApplyProduct = value => {
        formik.setFieldValue('is_all_product', value ? false : true);
        formik.setFieldValue('is_appoint_product', value ? true : false);
        if (value == 0) {
            formik.setFieldValue('product_list', []);
        }
    };
    const handleChangeCustomer = value => {
        formik.setFieldValue('is_all_customer_type', value ? false : true);
        formik.setFieldValue('is_apppoint_customer_type', value ? true : false);
        if (value == 0) {
            formik.setFieldValue('customer_type_list', []);
        }
    };

    const handleRequetDiscount = value => {
        switch (value) {
            case 1:
                formik.setFieldValue('is_none_requirement', true);
                formik.setFieldValue('is_min_total_money', false);
                formik.setFieldValue('is_min_num_product', false);
                formik.setFieldValue('value_min_total_money', null);
                formik.setFieldValue('value_min_num_product', null);
                break;
            case 2:
                formik.setFieldValue('is_none_requirement', false);
                formik.setFieldValue('is_min_total_money', true);
                formik.setFieldValue('is_min_num_product', false);
                formik.setFieldValue('value_min_num_product', null);
                break;
            case 3:
                formik.setFieldValue('is_none_requirement', false);
                formik.setFieldValue('is_min_total_money', false);
                formik.setFieldValue('is_min_num_product', true);
                formik.setFieldValue('value_min_total_money', null);
                break;
            default:
                formik.setFieldValue('is_none_requirement', true);
                formik.setFieldValue('is_min_total_money', false);
                formik.setFieldValue('is_min_num_product', false);
                break;
        }
    };

    const handleSelectCustomerType = e => {
        let _customer_type_list = [...formik.values.customer_type_list];
        let {customer_type_id, customer_type_name} = e || {};
        _customer_type_list.push({
            customer_type_id,
            customer_type_name,
        });
        formik.setFieldValue('customer_type_list', _customer_type_list);
    };

    const handleSelectProduct = e => {
        let _product_list = [...formik.values.product_list];
        let {product_id = null, combo_id = null, is_combo = false, temp_id = null, product_name = ''} = e || {};
        _product_list.push({
            product_id,
            product_name,
            is_combo,
            combo_id,
            temp_id,
        });
        formik.setFieldValue('product_list', _product_list);
    };

    const handleDeleteProduct = record => {
        let _product_list = [...formik.values.product_list];
        const findIndex = _product_list.findIndex(x => x.product_id == record.product_id);
        _product_list.splice(findIndex, 1);
        formik.setFieldValue('product_list', _product_list);
    };

    const handleDeleteCustomerType = record => {
        let _customer_type_list = [...formik.values.customer_type_list];
        const findIndex = _customer_type_list.findIndex(x => x.customer_type_id == record.customer_type_id);
        _customer_type_list.splice(findIndex, 1);
        formik.setFieldValue('customer_type_list', _customer_type_list);
    };

    function disabledDate(current) {
        return current && current.valueOf() < moment().add(-1, 'days');
    }

    const handleChangeDate = (startDate, endDate) => {
        formik.setFieldValue('start_date', startDate ? moment(startDate).format('DD/MM/YYYY') : '');
        formik.setFieldValue('end_date', endDate ? moment(endDate).format('DD/MM/YYYY') : '');
    };

    const isAllowed = (values, isPercent = true) => {
        const {floatValue = 0} = values;
        return floatValue >= 0 && floatValue <= (!isPercent ? 999999999 : 100);
    };

    return (
        <div key={`view`} className="animated fadeIn news">
            <Row className="d-flex justify-content-center">
                <Col xs={12}>
                    <Card>
                        <CardHeader>
                            <b>{id ? (noEdit ? 'Chi tiết' : 'Chỉnh sửa') : 'Thêm mới'} mã khuyến mãi </b>
                        </CardHeader>

                        <CardBody>
                            {alerts.map(({color, msg}, idx) => {
                                return (
                                    <Alert
                                        key={`alert-${idx}`}
                                        color={color}
                                        isOpen={true}
                                        toggle={() => setAlerts([])}>
                                        <span dangerouslySetInnerHTML={{__html: msg}} />
                                    </Alert>
                                );
                            })}
                            <Form id="formInfo" onSubmit={formik.handleSubmit}>
                                <Row>
                                    <Col xs={12} sm={6}>
                                        <Row>
                                            <Col xs={12} sm={12}>
                                                <FormGroup>
                                                    <Label for="letter" sm={12}>
                                                        Nhập code <span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={12}>
                                                        <Input
                                                            name="discount_code"
                                                            id="discount_code"
                                                            type="text"
                                                            placeholder="Nhập mã code"
                                                            disabled={noEdit}
                                                            value={formik.values.discount_code}
                                                            onChange={formik.handleChange}
                                                        />
                                                        {formik.errors.discount_code && formik.touched.discount_code ? (
                                                            <div
                                                                className="field-validation-error alert alert-danger fade show"
                                                                role="alert">
                                                                {formik.errors.discount_code}
                                                            </div>
                                                        ) : null}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Col xs={12} className="mb-2">
                                                        <b className="underline title_page_h1 text-primary">
                                                            {' '}
                                                            Hình thức khuyến mãi{' '}
                                                            <span className="font-weight-bold red-text">*</span>
                                                        </b>
                                                    </Col>

                                                    <Col sm={12}>
                                                        <Space direction="vertical">
                                                            <Radio
                                                                onChange={e =>
                                                                    handleChangeDiscountType(
                                                                        'is_percent_discount',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                disabled={noEdit}
                                                                checked={formik.values.is_percent_discount}
                                                                value={0}>
                                                                %
                                                            </Radio>
                                                            <Radio
                                                                onChange={e =>
                                                                    handleChangeDiscountType(
                                                                        'is_money_discount',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                disabled={noEdit}
                                                                checked={formik.values.is_money_discount}
                                                                value={1}>
                                                                Tiền cố định
                                                            </Radio>
                                                        </Space>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Col xs={12} className="mb-2">
                                                        <b className="underline title_page_h1 text-primary">
                                                            {' '}
                                                            Sản phẩm áp dụng{' '}
                                                            <span className="font-weight-bold red-text">*</span>
                                                        </b>
                                                    </Col>

                                                    <Col sm={12}>
                                                        <Space direction="vertical">
                                                            <Radio
                                                                disabled={noEdit}
                                                                onChange={e => handleChangeApplyProduct(e.target.value)}
                                                                checked={formik.values.is_all_product}
                                                                value={0}>
                                                                Toàn bộ sản phẩm
                                                            </Radio>
                                                            <Radio
                                                                disabled={noEdit}
                                                                checked={formik.values.is_appoint_product}
                                                                onChange={e => handleChangeApplyProduct(e.target.value)}
                                                                value={1}>
                                                                Sản phẩm chỉ định
                                                            </Radio>
                                                        </Space>

                                                        <div style={{marginTop: 8}}>
                                                            <Select
                                                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                                                placeholder={'-- Chọn --'}
                                                                isDisabled={noEdit || !formik.values.is_appoint_product}
                                                                onChange={e => handleSelectProduct(e)}
                                                                value={''}
                                                                options={getOptionProduct()}
                                                            />
                                                        </div>
                                                        <div style={{marginTop: 8}}>
                                                            <Table
                                                                columns={columns_product(handleDeleteProduct, noEdit)}
                                                                dataSource={[...formik.values.product_list]}
                                                                pagination={false}
                                                                bordered={true}
                                                                locale={{
                                                                    emptyText: 'Không có dữ liệu',
                                                                }}
                                                            />
                                                        </div>

                                                        {formik.errors.is_appoint_product ? (
                                                            <div
                                                                className="field-validation-error alert alert-danger fade show"
                                                                role="alert">
                                                                {formik.errors.is_appoint_product}
                                                            </div>
                                                        ) : null}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Col sm={12}>
                                                        <Checkbox
                                                            disabled={noEdit}
                                                            checked={formik.values.is_apply_orther_discount}
                                                            onChange={e =>
                                                                formik.setFieldValue(
                                                                    'is_apply_orther_discount',
                                                                    e.target.checked,
                                                                )
                                                            }>
                                                            Không áp dụng đồng thời với các CT khuyến mãi khác
                                                        </Checkbox>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Col xs={12} className="mb-2">
                                                        <b className="underline title_page_h1 text-primary">
                                                            {' '}
                                                            Yêu cầu được áp dụng khuyến mãi{' '}
                                                            <span className="font-weight-bold red-text">*</span>
                                                        </b>
                                                    </Col>

                                                    <Col sm={12}>
                                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                                            <div>
                                                                <Radio
                                                                    disabled={noEdit}
                                                                    onChange={e => handleRequetDiscount(e.target.value)}
                                                                    checked={formik.values.is_none_requirement}
                                                                    value={1}>
                                                                    Không yêu cầu
                                                                </Radio>
                                                            </div>
                                                            <div style={{marginTop: 8, marginBottom: 8}}>
                                                                <Radio
                                                                    disabled={noEdit}
                                                                    onChange={e => handleRequetDiscount(e.target.value)}
                                                                    checked={formik.values.is_min_total_money}
                                                                    value={2}>
                                                                    Giá trị đơn hàng tối thiểu
                                                                </Radio>
                                                            </div>

                                                            <InputGroup>
                                                                <NumberFormat
                                                                    type="text"
                                                                    name="value_min_total_money"
                                                                    placeholder="Giá trị đơn hàng tối thiểu"
                                                                    // disabled={false}
                                                                    allowNegative={false}
                                                                    thousandSeparator=","
                                                                    decimalSeparator="."
                                                                    disabled={
                                                                        noEdit || !formik.values.is_min_total_money
                                                                    }
                                                                    value={
                                                                        formik.values.value_min_total_money
                                                                            ? formik.values.value_min_total_money
                                                                            : ''
                                                                    }
                                                                    onValueChange={({value}) => {
                                                                        let minTotal = 1 * value.replace(/,/g, '');
                                                                        formik.setFieldValue(
                                                                            'value_min_total_money',
                                                                            minTotal,
                                                                        );
                                                                    }}
                                                                    isAllowed={values => isAllowed(values, false)}
                                                                />
                                                                <InputGroupAddon addonType="append">
                                                                    <InputGroupText>VNĐ</InputGroupText>
                                                                </InputGroupAddon>
                                                            </InputGroup>
                                                            {formik.errors.value_min_total_money &&
                                                            formik.touched.value_min_total_money ? (
                                                                <div
                                                                    className="field-validation-error alert alert-danger fade show"
                                                                    role="alert">
                                                                    {formik.errors.value_min_total_money}
                                                                </div>
                                                            ) : null}

                                                            <div style={{marginTop: 8, marginBottom: 8}}>
                                                                <Radio
                                                                    disabled={noEdit}
                                                                    onChange={e => handleRequetDiscount(e.target.value)}
                                                                    checked={formik.values.is_min_num_product}
                                                                    value={3}>
                                                                    Số lượng sản phẩm mua tối thiểu
                                                                </Radio>
                                                            </div>
                                                            <NumberFormat
                                                                type="text"
                                                                name="value_min_num_product"
                                                                // disabled={false}
                                                                allowNegative={false}
                                                                thousandSeparator=","
                                                                decimalSeparator="."
                                                                placeholder="Số lượng sản phẩm mua tối thiểu"
                                                                disabled={noEdit || !formik.values.is_min_num_product}
                                                                value={
                                                                    formik.values.value_min_num_product
                                                                        ? formik.values.value_min_num_product
                                                                        : ''
                                                                }
                                                                onValueChange={({value}) => {
                                                                    let minNumProduct = 1 * value.replace(/,/g, '');
                                                                    formik.setFieldValue(
                                                                        'value_min_num_product',
                                                                        minNumProduct,
                                                                    );
                                                                }}
                                                                isAllowed={values => isAllowed(values, false)}
                                                            />
                                                            {formik.errors.value_min_num_product &&
                                                            formik.touched.value_min_num_product ? (
                                                                <div
                                                                    className="field-validation-error alert alert-danger fade show"
                                                                    role="alert">
                                                                    {formik.errors.value_min_num_product}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Col sm={12}>
                                                        <Checkbox
                                                            className="mr-1"
                                                            disabled={noEdit}
                                                            onChange={e => {
                                                                formik.setFieldValue(`is_active`, e.target.checked);
                                                            }}
                                                            checked={formik.values.is_active}>
                                                            Kích hoạt
                                                        </Checkbox>
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={12} sm={6}>
                                        <Row>
                                            <Col xs={12} sm={12}>
                                                <FormGroup>
                                                    <Label for="discount_status" sm={12}>
                                                        Trạng thái <span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={12}>
                                                        <Select
                                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                                            placeholder={'-- Chọn --'}
                                                            isDisabled={true}
                                                            onChange={e => {
                                                                formik.setFieldValue('discount_status', e.value);
                                                            }}
                                                            value={defaultValueStatus()}
                                                            options={dataStatus}
                                                        />
                                                        {formik.errors.discount_status &&
                                                        formik.touched.discount_status ? (
                                                            <div
                                                                className="field-validation-error alert alert-danger fade show"
                                                                role="alert">
                                                                {formik.errors.discount_status}
                                                            </div>
                                                        ) : null}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="discount_value" sm={12}>
                                                        Giá trị <span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={12}>
                                                        <InputGroup>
                                                            <NumberFormat
                                                                type="text"
                                                                name="discount_value"
                                                                // disabled={false}
                                                                allowNegative={false}
                                                                thousandSeparator=","
                                                                decimalSeparator="."
                                                                disabled={noEdit}
                                                                value={
                                                                    formik.values.discount_value
                                                                        ? formik.values.discount_value
                                                                        : ''
                                                                }
                                                                onValueChange={({value}) => {
                                                                    let price = 1 * value.replace(/,/g, '');
                                                                    formik.setFieldValue('discount_value', price);
                                                                }}
                                                                isAllowed={values =>
                                                                    isAllowed(values, formik.values.is_percent_discount)
                                                                }
                                                            />
                                                            <InputGroupAddon addonType="append">
                                                                <InputGroupText>
                                                                    {formik.values.is_percent_discount ? '%' : 'VNĐ'}
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                        {formik.errors.discount_value &&
                                                        formik.touched.discount_value ? (
                                                            <div
                                                                className="field-validation-error alert alert-danger fade show"
                                                                role="alert">
                                                                {formik.errors.discount_value}
                                                            </div>
                                                        ) : null}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Col xs={12} className="mb-2">
                                                        <b className="underline title_page_h1 text-primary">
                                                            {' '}
                                                            Đối tượng khách hàng áp dụng{' '}
                                                            <span className="font-weight-bold red-text">*</span>
                                                        </b>
                                                    </Col>

                                                    <Col sm={12}>
                                                        <Space direction="vertical">
                                                            <Radio
                                                                disabled={noEdit}
                                                                checked={formik.values.is_all_customer_type}
                                                                onChange={e => handleChangeCustomer(e.target.value)}
                                                                value={0}>
                                                                Tất cả khách hàng
                                                            </Radio>
                                                            <Radio
                                                                disabled={noEdit}
                                                                checked={formik.values.is_apppoint_customer_type}
                                                                onChange={e => handleChangeCustomer(e.target.value)}
                                                                value={1}>
                                                                Khách hàng chỉ định
                                                            </Radio>
                                                        </Space>

                                                        <div style={{marginTop: 8}}>
                                                            <Select
                                                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                                                placeholder={'-- Chọn --'}
                                                                isDisabled={
                                                                    noEdit || !formik.values.is_apppoint_customer_type
                                                                }
                                                                onChange={e => handleSelectCustomerType(e)}
                                                                value={''}
                                                                options={getOptionCustomerType()}
                                                            />
                                                        </div>
                                                        <div style={{marginTop: 8}}>
                                                            <Table
                                                                columns={columns_customer_type(
                                                                    handleDeleteCustomerType,
                                                                    noEdit,
                                                                )}
                                                                dataSource={[...formik.values.customer_type_list]}
                                                                pagination={false}
                                                                bordered={true}
                                                                locale={{
                                                                    emptyText: 'Không có dữ liệu',
                                                                }}
                                                            />
                                                        </div>

                                                        {formik.errors.is_apppoint_customer_type ? (
                                                            <div
                                                                className="field-validation-error alert alert-danger fade show"
                                                                role="alert">
                                                                {formik.errors.is_apppoint_customer_type}
                                                            </div>
                                                        ) : null}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="date_apply" sm={12}>
                                                        Thời gian áp dụng{' '}
                                                        <span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={12}>
                                                        <DatePicker
                                                            disabled={noEdit}
                                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                                            startDate={
                                                                formik.values.start_date
                                                                    ? moment(formik.values.start_date, 'DD/MM/YYYY')
                                                                    : ''
                                                            }
                                                            startDateId="your_unique_start_date_id"
                                                            endDate={
                                                                formik.values.end_date
                                                                    ? moment(formik.values.end_date, 'DD/MM/YYYY')
                                                                    : ''
                                                            }
                                                            endDateId="your_unique_end_date_id"
                                                            onDatesChange={({startDate, endDate}) => {
                                                                handleChangeDate(startDate, endDate);
                                                            }}
                                                            isMultiple
                                                            minToday={disabledDate}
                                                        />
                                                        {formik.errors.start_date && formik.touched.start_date ? (
                                                            <div
                                                                className="field-validation-error alert alert-danger fade show"
                                                                role="alert">
                                                                {formik.errors.start_date}
                                                            </div>
                                                        ) : null}
                                                    </Col>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="note" sm={12}>
                                                        Ghi chú
                                                    </Label>
                                                    <Col sm={12}>
                                                        <Input
                                                            name="note"
                                                            id="note"
                                                            type="textarea"
                                                            placeholder="Ghi chú"
                                                            disabled={noEdit}
                                                            value={formik.values.note}
                                                            onChange={({target: {value}}) =>
                                                                formik.setFieldValue('note', value)
                                                            }
                                                            rows={3}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12} sm={12}>
                                        <div className="text-right mb-2">
                                            <div>
                                                {noEdit ? (
                                                    <CheckAccess permission="PRO_DISCOUNT_EDIT">
                                                        <Button
                                                            color="primary"
                                                            className="mr-2 btn-block-sm"
                                                            onClick={() =>
                                                                window._$g.rdr(
                                                                    `/discount/edit/${dataDiscount.discount_id}`,
                                                                )
                                                            }>
                                                            <i className="fa fa-edit mr-1" />
                                                            Chỉnh sửa
                                                        </Button>
                                                    </CheckAccess>
                                                ) : (
                                                    <>
                                                        <CheckAccess
                                                            permission={id ? `PRO_DISCOUNT_EDIT` : `PRO_DISCOUNT_ADD`}>
                                                            <button
                                                                className="mr-2 btn-block-sm btn btn-primary"
                                                                onClick={() => {
                                                                    setbtnType('save');
                                                                }}
                                                                type="submit">
                                                                <i className="fa fa-save mr-1" />
                                                                Lưu
                                                            </button>
                                                        </CheckAccess>
                                                        <CheckAccess
                                                            permission={id ? `PRO_DISCOUNT_EDIT` : `PRO_DISCOUNT_ADD`}>
                                                            <button
                                                                className="mr-2 btn-block-sm btn btn-success"
                                                                onClick={() => {
                                                                    setbtnType('save&quit');
                                                                }}
                                                                type="submit">
                                                                <i className="fa fa-save mr-1" />
                                                                Lưu và đóng
                                                            </button>
                                                        </CheckAccess>
                                                    </>
                                                )}
                                                <button
                                                    className=" btn-block-sm btn btn-secondary"
                                                    type="button"
                                                    onClick={() => window._$g.rdr(`/discount`)}>
                                                    <i className="fa fa-times-circle mr-1" />
                                                    Đóng
                                                </button>
                                            </div>
                                        </div>
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

export default DiscountAdd;
