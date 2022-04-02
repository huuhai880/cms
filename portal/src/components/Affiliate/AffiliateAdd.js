import React from "react";
import * as Yup from "yup";
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
} from "reactstrap";
import { ActionButton } from "@widget";
import { readImageAsBase64 } from "../../utils/html";
import { Editor } from "@tinymce/tinymce-react";

import { useState } from "react";
import NumberFormat from "../Common/NumberFormat";
import { useEffect } from "react";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./const";
import MessageError from "../Product/MessageError";
import Loading from "../Common/Loading";
import "./style.scss";
import Upload from "../Common/Antd/Upload";
import AffiliateService from "./Service/index";
import Select from "react-select";
import { convertValueSelect } from "utils/index";
import { ProvinceComponent, DistrictComponent, WardComponent } from '../Common/Address';
import DatePicker from "../Common/DatePicker";
import moment from 'moment'

const _affiliateService = new AffiliateService();

function AffiliateAdd({ memberId = null, noEdit }) {
    const [alerts, setAlerts] = useState([]);
    const [buttonType, setButtonType] = useState(null);
    const [loading, setLoading] = useState(false);

    const [affiliate, setAffiliate] = useState(initialValues)

    const [dataSelect, setDataSelect] = useState({
        members: [],
        affiliate_types: [],
        aff_leaders: [],
        policy_commisions: []
    })


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: affiliate,
        validationSchema,
        validateOnBlur: false,
        validateOnChange: true,
        onSubmit: (values) => {
            handleSubmitAff(values);
        },
    });


    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {
        setLoading(true)
        try {
            let data = await _affiliateService.init();
            setDataSelect(data);
            if (memberId) {
                let _data = await _affiliateService.getDetailAff(memberId);
                let value = { ...initialValues, ..._data };
                setAffiliate(value)
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

    const handleSubmitAff = async (values) => {
        try {
            values.is_modify = memberId ? true : false;
            await _affiliateService.createAff(values);
            window._$g.toastr.show("Lưu thành công!", "success");
            if (buttonType == "save_n_close") {
                return window._$g.rdr("/affiliate");
            }
            if (buttonType == "save" && !memberId) {
                formik.resetForm();
            }

        } catch (error) {
            let { errors, statusText, message } = error;
            let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");

            setAlerts([{ color: "danger", msg }]);
            window.scrollTo(0, 0);
        } finally {
            formik.setSubmitting(false);
        }
    }

    const handleChangeCustomer = customer => {
        customer = customer ? customer : {};
        let values = {
            ...initialValues,
            ...customer
        };
        console.log({ values })
        formik.setValues(values)
    }

    const handleChangeSelect = (selected, name) => {
        let value = selected ? selected.value : "";
        if (name == "province_id") {
            formik.setFieldValue("province_id", value);
            formik.setFieldValue("district_id", "");
            formik.setFieldValue("ward_id", "");
        } else if (name == "district_id") {
            formik.setFieldValue("district_id", value);
            formik.setFieldValue("ward_id", "");
        } else {
            formik.setFieldValue("ward_id", value);
        }
    };

    const handleSubmitForm = (type) => {
        setButtonType(type);
        formik.submitForm();
    };

    const handleOnKeyDown = (keyEvent) => {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    };

    return loading ? (
        <Loading />
    ) : (
        <div key={`view-${memberId || 0}`} className="animated fadeIn">
            <Row className="d-flex justify-content-center">
                <Col xs={12} md={12}>
                    <Card>
                        <CardHeader>
                            <b>
                                {memberId ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} đối tác{" "}
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

                            <Form id="frmAff" onSubmit={formik.handleSubmit} onKeyDown={handleOnKeyDown}>
                                <Row>
                                    <Col xs={12} className="mb15">
                                        <b className="underline title_page_h1 text-primary">Thông tin đối tác</b>
                                    </Col>
                                    <Col xs={12}>
                                        <Row>
                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="attribute_id" sm={3}>
                                                        Họ và tên
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        {
                                                            memberId ?
                                                                <Input
                                                                    name="full_name"
                                                                    id="full_name"
                                                                    type="text"
                                                                    placeholder="Họ và tên"
                                                                    value={formik.values.label}
                                                                    disabled={true}
                                                                /> :
                                                                <Select
                                                                    className="MuiPaper-filter__custom--select"
                                                                    id="member_id"
                                                                    name="member_id"
                                                                    onChange={(e) => handleChangeCustomer(e)}
                                                                    isSearchable={true}
                                                                    placeholder={"-- Chọn --"}
                                                                    value={convertValueSelect(formik.values['member_id'], dataSelect.members)}
                                                                    options={dataSelect.members}
                                                                    disabled={noEdit}
                                                                />
                                                        }
                                                        <MessageError formik={formik} name="member_id" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="attribute_id" sm={3}>
                                                        Loại
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
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
                                                            disabled={noEdit}
                                                        />
                                                        <MessageError formik={formik} name="affiliate_type_id" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="attribute_id" sm={3}>
                                                        Ngày sinh<span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Input
                                                            name="birth_day"
                                                            id="birth_day"
                                                            type="text"
                                                            placeholder="Ngày sinh"
                                                            {...formik.getFieldProps('birth_day')}
                                                            disabled={true}
                                                        />
                                                        <MessageError formik={formik} name="birth_day" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="aff_leader_id" sm={3}>
                                                        Affiliate Leader
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Select
                                                            className="MuiPaper-filter__custom--select"
                                                            id="aff_leader_id"
                                                            name="aff_leader_id"
                                                            onChange={(e) => {
                                                                formik.setFieldValue('aff_leader_id', e ? e.value : null)
                                                            }}
                                                            isSearchable={true}
                                                            placeholder={"-- Chọn --"}
                                                            value={convertValueSelect(formik.values['aff_leader_id'], dataSelect.aff_leaders)}
                                                            options={dataSelect.aff_leaders}
                                                            disabled={noEdit}
                                                        />
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
                                                            placeholder="Email"
                                                            value={formik.values.email || ''}
                                                            disabled={true}
                                                        />
                                                        <MessageError formik={formik} name="email" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="relationship_id" sm={3}>
                                                        Số điện thoại
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Input
                                                            name="phone_number"
                                                            id="phone_number"
                                                            type="text"
                                                            placeholder="Số điện thoại"
                                                            value={formik.values.phone_number || ''}
                                                            onChange={formik.handleChange}
                                                            disabled={noEdit}
                                                        />
                                                        <MessageError formik={formik} name="phone_number" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="province_id" sm={3}>
                                                        Tỉnh/TP
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <ProvinceComponent
                                                            id={"province_id"}
                                                            name={"province_id"}
                                                            onChange={(selected) =>
                                                                handleChangeSelect(selected, "province_id")
                                                            }
                                                            mainValue={6}
                                                            value={formik.values["province_id"]}
                                                            isDisabled={false}
                                                            styles={{
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                }),
                                                            }}
                                                            menuPortalTarget={document.querySelector("body")}
                                                            disabled={noEdit}
                                                        />
                                                        <MessageError formik={formik} name="province_id" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="district_id" sm={3}>
                                                        Quận/Huyện
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <DistrictComponent
                                                            id={"district_id"}
                                                            name={"district_id"}
                                                            onChange={(selected) =>
                                                                handleChangeSelect(selected, "district_id")
                                                            }
                                                            mainValue={formik.values["province_id"]}
                                                            value={formik.values["district_id"]}
                                                            isDisabled={false}
                                                            styles={{
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                }),
                                                            }}
                                                            menuPortalTarget={document.querySelector("body")}
                                                            disabled={noEdit}
                                                        />
                                                        <MessageError formik={formik} name="district_id" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="ward_id" sm={3}>
                                                        Phường/Xã
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <WardComponent
                                                            id={"ward_id"}
                                                            name={"ward_id"}
                                                            onChange={(selected) =>
                                                                handleChangeSelect(selected, "ward_id")
                                                            }
                                                            mainValue={formik.values["district_id"]}
                                                            value={formik.values["ward_id"]}
                                                            isDisabled={false}
                                                            styles={{
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                }),
                                                            }}
                                                            menuPortalTarget={document.querySelector("body")}
                                                            disabled={noEdit}
                                                        />
                                                        <MessageError formik={formik} name="ward_id" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="relationship_id" sm={3}>
                                                        Địa chỉ
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Input
                                                            name="address"
                                                            id="address"
                                                            type="text"
                                                            placeholder="Địa chỉ"
                                                            value={formik.values.address || ''}
                                                            onChange={formik.handleChange}
                                                            disabled={noEdit}
                                                        />
                                                        <MessageError formik={formik} name="address" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={12} sm={6}>
                                                <FormGroup row>
                                                    <Label for="id_card" sm={3}>
                                                        Số CMND<span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Input
                                                            name="id_card"
                                                            id="id_card"
                                                            type="text"
                                                            placeholder="Số CMND"
                                                            disabled={noEdit}
                                                            value={formik.values.id_card || ''}
                                                            onChange={formik.handleChange}
                                                        // {...formik.getFieldProps('id_card')}
                                                        />
                                                        <MessageError formik={formik} name="id_card" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <FormGroup row>
                                                    <Label for="id_card_date" sm={3}>
                                                        Ngày cấp<span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <DatePicker
                                                            id="id_card_date"
                                                            date={
                                                                formik.values.id_card_date
                                                                    ? moment(formik.values.id_card_date, 'DD/MM/YYYY')
                                                                    : null
                                                            }
                                                            onDateChange={(date) => {
                                                                let _date = date ? moment(date).format("DD/MM/YYYY") : null;
                                                                console.log({ _date })
                                                                formik.setFieldValue("id_card_date", _date);
                                                            }}
                                                            disabled={noEdit}
                                                            maxToday
                                                            placeholder="Ngày cấp"
                                                        />
                                                        <MessageError formik={formik} name="id_card_date" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <FormGroup row>
                                                    <Label for="id_card_place" sm={3}>
                                                        Nơi cấp<span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Input
                                                            name="id_card_place"
                                                            id="id_card_place"
                                                            type="text"
                                                            placeholder="Nơi cấp"
                                                            disabled={noEdit}
                                                            value={formik.values.id_card_place || ''}
                                                            onChange={formik.handleChange}
                                                        />
                                                        <MessageError formik={formik} name="id_card_place" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={12} sm={6}>

                                            </Col>
                                            <Col xs={6} sm={6} >
                                                <FormGroup row>
                                                    <Label sm={3} for="id_card_front_side">Ảnh CMND/CCCD
                                                        <span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={9} style={{ display: 'flex' }}>
                                                        <div className="cmnd-upload mr-2">
                                                            <Upload
                                                                onChange={(img) => {
                                                                    formik.setFieldValue("id_card_front_side", img);
                                                                }}
                                                                imageUrl={formik.values.id_card_front_side}
                                                                accept="image/*"
                                                                disabled={noEdit}
                                                                label="Thêm ảnh"
                                                            />
                                                            <MessageError formik={formik} name="id_card_front_side" />
                                                            <i>Ảnh mặt trước</i>
                                                        </div>
                                                        <div className="cmnd-upload ml-2">
                                                            <Upload
                                                                onChange={(img) => {
                                                                    formik.setFieldValue("id_card_back_side", img);
                                                                }}
                                                                imageUrl={formik.values.id_card_back_side}
                                                                accept="image/*"
                                                                disabled={noEdit}
                                                                label="Thêm ảnh"
                                                            />
                                                            <MessageError formik={formik} name="id_card_back_side" />
                                                            <i>Ảnh mặt sau</i>
                                                        </div>
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6} sm={6}>
                                                <FormGroup row>
                                                    <Label sm={3} for="id_card_front_image">Ảnh live
                                                        <span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <div className="cmnd-upload" style={{ width: '50%' }}>
                                                            <Upload
                                                                onChange={(img) => {
                                                                    formik.setFieldValue("live_image", img);
                                                                }}
                                                                imageUrl={formik.values.live_image}
                                                                accept="image/*"
                                                                disabled={noEdit}
                                                                label="Thêm ảnh"
                                                            />
                                                        </div>
                                                        <MessageError formik={formik} name="live_image" />
                                                        <i>Upload ảnh có chứa khuôn mặt đối tác</i>
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={6} sm={6}>
                                                <FormGroup row>
                                                    <Col sm={9}>
                                                        <CustomInput
                                                            className="pull-left"
                                                            onBlur={null}
                                                            checked={formik.values.is_agree}
                                                            type="checkbox"
                                                            id="is_agree"
                                                            onChange={(e) => {
                                                                formik.setFieldValue("is_agree", e.target.checked);
                                                            }}
                                                            label="Xác nhận đồng ý với Chính sách điều khoản Affiliate"
                                                            disabled={noEdit}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={12} className="mb15">
                                        <b className="underline title_page_h1 text-primary">Thông tin chính sách hoa hồng</b>
                                    </Col>
                                    <Col xs={12}>
                                        <Row>
                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="attribute_id" sm={3}>
                                                        Chính sách Affliate
                                                        {/* <span className="font-weight-bold red-text"> *</span> */}
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Select
                                                            className="MuiPaper-filter__custom--select"
                                                            id="policy_commision_id"
                                                            name="policy_commision_id"
                                                            onChange={(e) => {

                                                            }}
                                                            isSearchable={true}
                                                            placeholder={"Vui lòng chọn chính sách theo loại Affliate tương ứng"}
                                                            value={convertValueSelect(formik.values['policy_commision_id'], dataSelect.policy_commisions)}
                                                            options={dataSelect.policy_commisions}
                                                            disabled={noEdit}
                                                        />
                                                        <MessageError formik={formik} name="policy_commision_id" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={6} sm={6}>
                                        <FormGroup row>
                                            <Col sm={9}>
                                                <CustomInput
                                                    className="pull-left"
                                                    onBlur={null}
                                                    checked={formik.values.is_active}
                                                    type="checkbox"
                                                    id="is_active"
                                                    onChange={(e) => {
                                                        formik.setFieldValue("is_active", e.target.checked);
                                                    }}
                                                    label="Kích hoạt"
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
                                                    permission: "AFF_AFFILIATE_EDIT",
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr(`/affiliate/edit/${memberId}`),
                                                },
                                                {
                                                    title: "Lưu",
                                                    color: "primary",
                                                    isShow: !noEdit,
                                                    notSubmit: true,
                                                    permission: ["AFF_AFFILIATE_EDIT", "AFF_AFFILIATE_ADD"],
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save"),
                                                },
                                                {
                                                    title: "Lưu và đóng",
                                                    color: "success",
                                                    isShow: !noEdit,
                                                    permission: ["AFF_AFFILIATE_EDIT", "AFF_AFFILIATE_ADD"],
                                                    notSubmit: true,
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save_n_close"),
                                                },
                                                {
                                                    title: "Đóng",
                                                    icon: "times-circle",
                                                    isShow: true,
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr("/affiliate"),
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

export default AffiliateAdd;