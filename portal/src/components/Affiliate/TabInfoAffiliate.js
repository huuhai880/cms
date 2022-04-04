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
    Badge,
    Nav,
    NavItem,
    NavLink,
    TabPane,
    TabContent,
    InputGroup,
    InputGroupAddon,
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
import { useParams } from "react-router";
import { Checkbox } from 'antd';

function TabInfoAffiliate({ affiliate = {}, policyCommisions = [] }) {
    let {
        registration_date = '',
        approved_date = '',
    } = affiliate || {}

    const [policyCommisionApply, setPolicyCommisionApply] = useState([]);

    useEffect(() => {
        if(affiliate){
            setPolicyCommisionApply(affiliate.policy_commision_apply)
        }
    },[affiliate])

    const handleSubmitForm = () => {

    }

    return (
        <Row>
            <Col xs={6}>
                <FormGroup row>
                    <Label for="attribute_id" sm={3}>
                        Chính sách áp dụng
                    </Label>
                    <Col sm={9}>
                        <Select
                            className="MuiPaper-filter__custom--select"
                            id="policy_commision_apply"
                            name="policy_commision_apply"
                            onChange={(e) => setPolicyCommisionApply(e)}
                            isSearchable={true}
                            placeholder={"-- Chọn --"}
                            value={policyCommisionApply}
                            options={policyCommisions}
                            isMulti
                            isClearable={true}
                        />
                    </Col>
                </FormGroup>
            </Col>
            <Col xs={6}>
                <FormGroup row>
                    <Label for="attribute_id" sm={3}>
                        Ngày đăng ký
                    </Label>
                    <Col sm={9}>
                        <Input
                            name="registration_date"
                            id="registration_date"
                            type="text"
                            placeholder="Ngày đăng ký"
                            value={registration_date}
                            disabled={true}
                        />
                    </Col>
                </FormGroup>
            </Col>
            <Col xs={6}>
                <FormGroup row>
                    <Label for="attribute_id" sm={3}>
                        Ngày duyệt đăng ký
                    </Label>
                    <Col sm={9}>
                        <Input
                            name="date_approve"
                            id="date_approve"
                            type="text"
                            placeholder="Ngày duyệt đăng ký"
                            value={approved_date}
                            disabled={true}
                        />
                    </Col>
                </FormGroup>
            </Col>

            <Col xs={12}>
                <Row className="mt-4">
                    <Col xs={12} sm={12}>
                        <ActionButton
                            isSubmitting={false}
                            buttonList={[

                                {
                                    title: "Lưu",
                                    color: "primary",
                                    isShow: true,
                                    notSubmit: true,
                                    permission: ["AFF_AFFILIATE_EDIT", "AFF_AFFILIATE_ADD"],
                                    icon: "save",
                                    onClick: () => handleSubmitForm("save"),
                                },
                                {
                                    title: "Lưu và đóng",
                                    color: "success",
                                    isShow: true,
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
            </Col>
        </Row>
    );
}

export default TabInfoAffiliate;