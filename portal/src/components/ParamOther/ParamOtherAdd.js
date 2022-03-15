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
} from "reactstrap";
import { ActionButton } from "@widget";

import { useState } from "react";
import { useEffect } from "react";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./_constant";
import MessageError from "../Product/MessageError";
import Loading from "../Common/Loading";
import ParamOtherModel from "models/ParamOtherModel/index";

const _paramOtherModel = new ParamOtherModel();

function ParamOtherAdd({ paramOtherId = null, noEdit = false }) {
    const [paramOther, setParamOther] = useState(initialValues)
    const [alerts, setAlerts] = useState([]);
    const [buttonType, setButtonType] = useState(null);
    const [loading, setLoading] = useState(false);


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: paramOther,
        validationSchema,
        validateOnBlur: false,
        validateOnChange: true,
        onSubmit: (values) => {
            handleSubmitParamOther(values);
        },
    });

    const handleSubmitParamOther = async (values) => {
        try {
            await _paramOtherModel.createOrUpdate(Object.assign(values, { param_other_id: paramOtherId }))
            window._$g.toastr.show("Lưu thành công!", "success");
            if (buttonType == "save_n_close") {
                return window._$g.rdr("/param-other");
            }
            if (buttonType == "save" && !paramOtherId) {
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

    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        setLoading(true);
        try {
            if (paramOtherId) {
                let _paramOther = await _paramOtherModel.read(paramOtherId);
                let value = {
                    ...initialValues,
                    ..._paramOther,
                };
                setParamOther(value);
            }
        } catch (error) {
            window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
        } finally {
            setLoading(false);
        }
    };

    const handleOnKeyDown = (keyEvent) => {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    };

    const handleSubmitForm = (type) => {
        setButtonType(type);
        formik.submitForm();
    };


    return loading ? (
        <Loading />
    ) : (
        <div key={`view-${paramOtherId || 0}`} className="animated fadeIn">
            <Row className="d-flex justify-content-center">
                <Col xs={12} md={12}>
                    <Card>
                        <CardHeader>
                            <b>
                                {paramOtherId ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} biến số khác{" "}
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
                            <Form id="frmParamOther" onSubmit={formik.handleSubmit} onKeyDown={handleOnKeyDown}>
                                <Row>
                                    <Col xs={12} sm={12}>
                                        <Row className="mb-4">
                                            <Col xs={12} sm={12}>
                                                <b className="underline title_page_h1 text-primary">Thông tin biến số</b>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} sm={12} className="mb-2">
                                                <FormGroup row>
                                                    <Label className="text-left" sm={2} xs={12}>
                                                        Tên biến số
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={10} xs={12}>
                                                        <Input
                                                            className="text-left"
                                                            type="text"
                                                            id="name_type"
                                                            name="name_type"
                                                            placeholder="Tên biến số"
                                                            disabled={noEdit}
                                                            maxLength={400}
                                                            {...formik.getFieldProps("name_type")}
                                                        />
                                                        <MessageError formik={formik} name="name_type" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col sm={12} xs={12}>
                                                <FormGroup row>
                                                    <Label className="col-sm-2 col-form-label"></Label>
                                                    <Col sm={3} xs={12} className="mb-2">
                                                        <CustomInput
                                                            className="pull-left"
                                                            onBlur={null}
                                                            checked={formik.values.is_house_number}
                                                            type="checkbox"
                                                            id="is_house_number"
                                                            onChange={(e) => {
                                                                formik.setFieldValue("is_house_number", e.target.checked);
                                                            }}
                                                            label="Số nhà"
                                                            disabled={noEdit}
                                                        />
                                                    </Col>
                                                    <Col sm={3} xs={12} className="mb-2">
                                                        <CustomInput
                                                            className="pull-left"
                                                            onBlur={null}
                                                            checked={formik.values.is_phone_number}
                                                            type="checkbox"
                                                            id="is_phone_number"
                                                            onChange={(e) => {
                                                                formik.setFieldValue("is_phone_number", e.target.checked);
                                                            }}
                                                            label="Số điện thoại"
                                                            disabled={noEdit}
                                                        />
                                                    </Col>
                                                    <Col sm={3} xs={12} className="mb-2">
                                                        <CustomInput
                                                            className="pull-left"
                                                            onBlur={null}
                                                            checked={formik.values.is_license_plate}
                                                            type="checkbox"
                                                            id="is_license_plate"
                                                            onChange={(e) => {
                                                                formik.setFieldValue("is_license_plate", e.target.checked);
                                                            }}
                                                            label="Biển số xe"
                                                            disabled={noEdit}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col sm={12} xs={12}>
                                                <FormGroup row>
                                                    <Label className="col-sm-2 col-form-label"></Label>
                                                    <Col sm={3} xs={12}>
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
                                                    permission: "MD_PARAMOTHER_EDIT",
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr(`/param-other/edit/${paramOtherId}`),
                                                },
                                                {
                                                    title: "Lưu",
                                                    color: "primary",
                                                    isShow: !noEdit,
                                                    notSubmit: true,
                                                    permission: ["MD_PARAMOTHER_EDIT", "MD_PARAMOTHER_ADD"],

                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save"),
                                                },
                                                {
                                                    title: "Lưu và đóng",
                                                    color: "success",
                                                    isShow: !noEdit,
                                                    permission: ["MD_PARAMOTHER_EDIT", "MD_PARAMOTHER_ADD"],

                                                    notSubmit: true,
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save_n_close"),
                                                },
                                                {
                                                    title: "Đóng",
                                                    icon: "times-circle",
                                                    isShow: true,
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr("/param-other"),
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

export default ParamOtherAdd;