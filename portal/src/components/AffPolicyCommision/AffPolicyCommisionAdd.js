import React from "react";
import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    CustomInput,
    FormGroup,
    Label,
    Input,
    Form,
    Button,
    Table,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "reactstrap";
import { ActionButton } from "@widget";
import { useState } from "react";
import { useEffect } from "react";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./const";
import MessageError from "../Product/MessageError";
import Loading from "../Common/Loading";
// import "./style.scss";
import Select from "react-select";
import { convertValueSelect } from "utils/index";
import DatePicker from "../Common/DatePicker";
import moment from 'moment'
import { Radio } from 'antd'
import AffPolicyCommisionService from "./Service/index";
import NumberFormat from "../Common/NumberFormat";
import { SwapRightOutlined } from '@ant-design/icons';

const _affPolicyCommisionService = new AffPolicyCommisionService();
function AffPolicyCommisionAdd({ policyCommisionId, noEdit = false }) {
    const [alerts, setAlerts] = useState([]);
    const [buttonType, setButtonType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [policyCommision, setPolicyCommision] = useState(initialValues);

    const [dataSelect, setDataSelect] = useState({
        affiliate_types: [],
        conditions: []
    })
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: policyCommision,
        validationSchema,
        validateOnBlur: false,
        validateOnChange: true,
        onSubmit: (values) => {
            handleSubmitPolicyCommision(values);
        },
        // validate: values => handleValidateLeader(values),
    });

    useEffect(() => {
        initData();
    }, [])

    const initData = async () => {
        setLoading(true)
        try {
            let data = await _affPolicyCommisionService.initDataSelect();
            setDataSelect(data);
            if (policyCommisionId) {
                let _policyCommision = await _affPolicyCommisionService.detail(policyCommisionId);
                let value = { ...initialValues, ..._policyCommision };
                setPolicyCommision(value)
            }
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
            );
        }
        finally {
            setLoading(false)
        }
    }

    const handleSubmitPolicyCommision = async (values) => {
        try {

            values.policy_commision_id = policyCommisionId;
            await _affPolicyCommisionService.createOrUpdPolicy(values);
            window._$g.toastr.show("Lưu thành công!", "success");
            if (buttonType == "save_n_close") {
                return window._$g.rdr("/policy-commision");
            }
            if (buttonType == "save" && !policyCommisionId) {
                formik.resetForm();
            }

        } catch (error) {
            let { errors, statusText, message } = error;
            let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");

            setAlerts([{ color: "danger", msg }]);
            window.scrollTo(0, 0);
            formik.setSubmitting(false);
        } finally {
            formik.setSubmitting(false);
        }
    }

    const handleOnKeyDown = (keyEvent) => {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    };

    const handleChangeDate = ({ startDate, endDate }) => {
        formik.setFieldValue('start_date_register', startDate ? startDate.format("DD/MM/YYYY") : null);
        formik.setFieldValue('end_date_register', endDate ? endDate.format("DD/MM/YYYY") : null)
    };

    const handleSubmitForm = (type) => {
        setButtonType(type);
        formik.submitForm();
    };

    const handleAddRowCondition = () => {
        let { policy_commision_detail = [] } = formik.values || {};
        let policy_condition_add = {
            policy_commision_id: null,
            condition_id: null,
            condition_name: null,
            condition_type: null, //--1: VNĐ, 2: User
            data_child: [],
            order_index: (policy_commision_detail || []).length + 1
        }
        formik.setFieldValue('policy_commision_detail', [...policy_commision_detail, policy_condition_add]);
    }


    const getOptionConditions = () => {
        let { conditions = [] } = dataSelect || {};
        let { policy_commision_detail = [] } = formik.values || {};
        if (conditions.length) {
            return conditions.map(p => {
                return policy_commision_detail.find(e => e.condition_id == p.condition_id) ?
                    {
                        ...p,
                        isDisabled: true
                    } : p
            })
        }
        return []
    }

    const handleChangeCondition = (value, item, index) => {
        let _policy_commision_detail = [...formik.values.policy_commision_detail];
        _policy_commision_detail[index] = Object.assign(_policy_commision_detail[index], (value || {}))
        //Reset 
        // _policy_commision_detail[index].data_child = []
        _policy_commision_detail[index].data_child = (_policy_commision_detail[index].data_child || [])
            .map(p => {
                return {
                    ...p,
                    condition_type: value.condition_type,
                    condition_id: value.condition_id
                }
            })
        formik.setFieldValue('policy_commision_detail', _policy_commision_detail)
    }

    const handleRemoveCondition = (index) => {
        let _policy_commision_detail = [...formik.values.policy_commision_detail];
        _policy_commision_detail.splice(index, 1);
        formik.setFieldValue('policy_commision_detail', _policy_commision_detail);
    }

    const handleRemoveConditionDetail = (index, indexParent) => {
        let _policy_commision_detail = [...formik.values.policy_commision_detail];
        _policy_commision_detail[indexParent].data_child.splice(index, 1);
        formik.setFieldValue('policy_commision_detail', _policy_commision_detail);
    }

    const handleAddRowConditionDetail = (indexParent) => {
        let _policy_commision_detail = [...formik.values.policy_commision_detail];
        let _item = _policy_commision_detail[indexParent] || {};
        console.log({ _item })
        let { data_child = [] } = _item || {};
        data_child.push({
            condition_id: _item.condition_id,
            from_value: '',
            to_value: '',
            type: 1, //%
            comission_value: null,
            condition_type: _item.condition_type
        });
        formik.setFieldValue('policy_commision_detail', _policy_commision_detail);
    }

    const handleChangeConditionDetail = (value, name, index, indexParent) => {
        let _policy_commision_detail = [...formik.values.policy_commision_detail];
        let _item = _policy_commision_detail[indexParent] || {};
        let { data_child = [] } = _item || {};
        data_child[index][name] = value;
        formik.setFieldValue('policy_commision_detail', _policy_commision_detail);
    }

    const renderConditionDetail = (item, index) => {
        let { data_child = [], condition_name = '', condition_type = 1 } = item || {};
        return data_child.map((p, _index) => {
            return <tr key={_index}>
                <td style={{ verticalAlign: 'middle', }}
                    className="text-center">{index + 1}.{_index + 1}</td>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InputGroup>
                            <NumberFormat
                                type="text"
                                name="from_value"
                                style={{ marginRight: 15 }}
                                disabled={noEdit}
                                allowNegative={false}
                                thousandSeparator=","
                                decimalSeparator="."
                                decimalScale={0}
                                placeholder={`${condition_type == 1 ? 'đ' : 'Số lượng User'} Từ`}
                                isNumericString
                                value={p.from_value ? p.from_value : ''}
                                onValueChange={({ value }) => handleChangeConditionDetail(value, 'from_value', _index, index)}
                                isAllowed={values => isAllowed(values)}
                            />
                            {/* <SwapRightOutlined /> */}
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <svg
                                    className="DateRangePickerInput_arrow_svg DateRangePickerInput_arrow_svg_1"
                                    focusable="false"
                                    viewBox="0 0 1000 1000"
                                >
                                    <path d="M694 242l249 250c12 11 12 21 1 32L694 773c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210-210H68c-13 0-23-10-23-23s10-23 23-23h806L662 275c-21-22 11-54 32-33z"></path>
                                </svg>
                            </div>
                            <NumberFormat
                                type="text"
                                name="to_value"
                                style={{ marginLeft: 15 }}
                                disabled={noEdit}
                                allowNegative={false}
                                thousandSeparator=","
                                decimalSeparator="."
                                decimalScale={0}
                                placeholder={`${condition_type == 1 ? 'đ' : 'Số lượng User'} Đến`}
                                isNumericString
                                value={p.to_value ? p.to_value : ''}
                                onValueChange={({ value }) => handleChangeConditionDetail(value, 'to_value', _index, index)}
                                isAllowed={values => isAllowed(values)}
                            />
                            <InputGroupAddon addonType="append">
                                <InputGroupText>{`${condition_type == 1 ? 'VNĐ' : 'User'}`}</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </td>
                <td>
                    <InputGroup>
                        <NumberFormat
                            type="text"
                            name="comission_value"
                            disabled={noEdit}
                            allowNegative={false}
                            thousandSeparator=","
                            decimalSeparator="."
                            decimalScale={1}
                            placeholder="% hoa hồng nhận được"
                            isNumericString
                            value={p.comission_value ? p.comission_value : ''}
                            onValueChange={({ value }) => handleChangeConditionDetail(value, 'comission_value', _index, index)}
                            isAllowed={values => isAllowed(values, true)}
                        />
                        <InputGroupAddon addonType="append">
                            <InputGroupText>%</InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                </td>
                <td
                    style={{ verticalAlign: 'middle', }}
                    className="text-center">
                    <Button
                        color="danger"
                        onClick={() => handleRemoveConditionDetail(_index, index)}
                        className="btn-sm"
                        disabled={noEdit}>
                        {' '}
                        <i className="fa fa-trash" />
                    </Button>
                </td>
            </tr>

        })
    }

    const renderCondition = () => {
        let { policy_commision_detail = [] } = formik.values || {};
        if (policy_commision_detail.length) {
            return policy_commision_detail.map((item, index) => {
                return <React.Fragment key={index}>
                    <tr>
                        <td style={{ verticalAlign: 'middle', }}
                            className="text-center">{index + 1}</td>
                        <td colSpan={2} style={{ verticalAlign: 'middle', }}
                            className="text-center">
                            <Select
                                className="MuiPaper-filter__custom--select"
                                id={`condtion_id_${item.condition_id}_${index}`}
                                name={`condtion_id_${item.condition_id}_${index}`}
                                onChange={(value) => handleChangeCondition(value, item, index)}
                                isSearchable={true}
                                placeholder={"-- Chọn điều kiện đạt --"}
                                value={convertValueSelect(item.condition_id, getOptionConditions() || [])}
                                options={getOptionConditions()}
                                isDisabled={noEdit}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                                menuPortalTarget={document.querySelector("body")}
                            />
                        </td>
                        <td
                            style={{ verticalAlign: 'middle', }}
                            className="text-center">
                            <Button
                                color="danger"
                                onClick={() => handleRemoveCondition(index)}
                                className="btn-sm"
                                disabled={noEdit}>
                                {' '}
                                <i className="fa fa-trash" />
                            </Button>
                        </td>
                    </tr>
                    {renderConditionDetail(item, index)}
                    <tr>
                        <td colSpan={10}>
                            {!noEdit && (
                                <Button
                                    className="btn-sm mt-1"
                                    color="success"
                                    style={{ marginLeft: 40 }}
                                    onClick={() => handleAddRowConditionDetail(index)}>
                                    <i className="fa fa-plus mr-2" />
                                    Thêm dòng
                                </Button>
                            )}
                        </td>
                    </tr>
                </React.Fragment>
            })
        }
        return <tr>
            <td colSpan={10} className="text-center">Không có dữ liệu</td>
        </tr>
    }

    const isAllowed = (values, isPercent = false) => {
        const { floatValue = 0 } = values;
        return floatValue >= 0 && floatValue <= (!isPercent ? 999999999 : 100);
    }


    return loading ? (
        <Loading />
    ) : (
        <div key={`view-${policyCommisionId || 0}`} className="animated fadeIn">
            <Row className="d-flex justify-content-center">
                <Col xs={12} md={12}>
                    <Card>
                        <CardHeader>
                            <b>
                                {policyCommisionId ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} chính sách{" "}
                            </b>
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

                            <Form id="frmPolicy" onSubmit={formik.handleSubmit} onKeyDown={handleOnKeyDown}>
                                <Row>
                                    <Col xs={12} className="mb15">
                                        <b className="underline title_page_h1 text-primary">Thông tin chính sách</b>
                                    </Col>
                                    <Col xs={12}>
                                        <Row>
                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="policy_commision_name" sm={4}>
                                                        Tên chính sách
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="policy_commision_name"
                                                            id="policy_commision_name"
                                                            type="text"
                                                            placeholder="Tên chính sách"
                                                            value={formik.values.policy_commision_name || ''}
                                                            disabled={noEdit}
                                                            {...formik.getFieldProps('policy_commision_name')}
                                                        />
                                                        <MessageError formik={formik} name="policy_commision_name" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="affiliate_type_id" sm={4}>
                                                        Loại
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Select
                                                            className="MuiPaper-filter__custom--select"
                                                            id="affiliate_type_id"
                                                            name="affiliate_type_id"
                                                            onChange={(e) => {
                                                                formik.setFieldValue('affiliate_type_id', e ? e.value : null)
                                                            }}
                                                            isSearchable={true}
                                                            placeholder={"-- Chọn --"}
                                                            value={convertValueSelect(formik.values['affiliate_type_id'], dataSelect.affiliate_types)}
                                                            options={dataSelect.affiliate_types}
                                                            isDisabled={noEdit}
                                                        />
                                                        <MessageError formik={formik} name="affiliate_type_id" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={12}>
                                                <FormGroup row>
                                                    <Label for="description" sm={2}>
                                                        Mô tả
                                                    </Label>
                                                    <Col sm={10}>
                                                        <Input
                                                            name="description"
                                                            id="description"
                                                            type="textarea"
                                                            placeholder="Mô tả"
                                                            value={formik.values.description || ''}
                                                            disabled={noEdit}
                                                            rows={4}
                                                            {...formik.getFieldProps('description')}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={12}>
                                                <Row>
                                                    <Label sm={2}>
                                                        Chiết khấu
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={10}>
                                                        <Table
                                                            bordered
                                                            className="table-news-related"
                                                            striped
                                                            style={{ marginBottom: 0 }}>
                                                            <thead>
                                                                <tr>
                                                                    <th className="text-center" style={{ width: 50 }}>STT</th>
                                                                    <th className="text-center" style={{ width: '50%' }}>Điều kiện đạt</th>
                                                                    <th className="text-center">% hoa hồng nhận được/Tổng doanh số</th>
                                                                    <th className="text-center" style={{ width: 100 }}>Thao tác</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {renderCondition()}
                                                            </tbody>
                                                        </Table>
                                                        <MessageError style={{ marginBottom: 0 }} formik={formik} name="policy_commision_detail" />
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12} className="mt-2">
                                                <FormGroup row>
                                                    <Col xs={2}></Col>
                                                    <Col xs={10}>
                                                        {!noEdit && (
                                                            <Button
                                                                className="btn-sm mt-1"
                                                                color="primary"
                                                                onClick={handleAddRowCondition}
                                                                disabled={
                                                                    (formik.values.policy_commision_detail || []).length == dataSelect.conditions.length
                                                                }>
                                                                <i className="fa fa-plus mr-2" />
                                                                Thêm điều kiện
                                                            </Button>
                                                        )}
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Label xs={12}>
                                        Áp dụng khung thời gian đăng ký
                                        <span className="font-weight-bold red-text"> *</span>
                                    </Label>

                                    <Col xs={12}>
                                        <div className="row form-group">
                                            <Col sm={12}>
                                                <Row>
                                                    <Col xs={2}></Col>
                                                    <Col xs={10}>
                                                        <Radio value={false}
                                                            checked={!formik.values['is_limited_time']}
                                                            disabled={noEdit}
                                                            onChange={e => {
                                                                formik.setFieldValue('is_limited_time', false);
                                                                formik.setFieldValue('start_date_register', null);
                                                                formik.setFieldValue('end_date_register', null);
                                                            }}>
                                                            Không giới hạn
                                                        </Radio>
                                                    </Col>
                                                </Row>

                                            </Col>
                                            <Col sm={12}>
                                                <Row className="align-items-center">
                                                    <Col xs={2}></Col>
                                                    <Col sm={2}>
                                                        <Radio value={true}
                                                            disabled={noEdit}
                                                            checked={formik.values['is_limited_time']}
                                                            onChange={e => formik.setFieldValue('is_limited_time', true)}>
                                                            Thời gian cụ thể
                                                        </Radio>
                                                    </Col>
                                                    <Col sm={3}>
                                                        <DatePicker
                                                            startDate={
                                                                formik.values.start_date_register ?
                                                                    moment(formik.values.start_date_register, 'DD/MM/YYYY') : null
                                                            }
                                                            startDateId="start_date_id"
                                                            endDate={
                                                                formik.values.end_date_register ?
                                                                    moment(formik.values.end_date_register, 'DD/MM/YYYY') : null
                                                            }
                                                            endDateId="end_date_id"
                                                            onDatesChange={handleChangeDate}
                                                            isMultiple
                                                            disabled={noEdit || !formik.values['is_limited_time']}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </div>
                                    </Col>

                                    <Col xs={12}>
                                        <FormGroup row className="mt-2">
                                            <Col sm={2}></Col>
                                            <Col sm={2}>
                                                <CustomInput
                                                    className="pull-left"
                                                    onBlur={null}
                                                    checked={formik.values.is_active}
                                                    type="checkbox"
                                                    id="is_active"
                                                    onChange={e => {
                                                        formik.setFieldValue('is_active', e.target.checked)
                                                    }}
                                                    label="Kích hoạt"
                                                    disabled={noEdit}
                                                />
                                            </Col>
                                            <Col sm={4}>
                                                <CustomInput
                                                    className="pull-left"
                                                    onBlur={null}
                                                    checked={formik.values.is_default}
                                                    type="checkbox"
                                                    id="is_default"
                                                    onChange={e => {
                                                        formik.setFieldValue('is_default', e.target.checked)
                                                    }}
                                                    label="Chính sách mặc định"
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
                                                    permission: "AFF_POLICYCOMMISION_EDIT",
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr(`/policy-commision/edit/${policyCommisionId}`),
                                                },
                                                {
                                                    title: "Lưu",
                                                    color: "primary",
                                                    isShow: !noEdit,
                                                    notSubmit: true,
                                                    permission: ["AFF_POLICYCOMMISION_EDIT", "AFF_POLICYCOMMISION_ADD"],
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save"),
                                                },
                                                {
                                                    title: "Lưu và đóng",
                                                    color: "success",
                                                    isShow: !noEdit,
                                                    permission: ["AFF_POLICYCOMMISION_EDIT", "AFF_POLICYCOMMISION_ADD"],
                                                    notSubmit: true,
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save_n_close"),
                                                },
                                                {
                                                    title: "Đóng",
                                                    icon: "times-circle",
                                                    isShow: true,
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr("/policy-commision"),
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

export default AffPolicyCommisionAdd;