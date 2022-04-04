import React from "react";
import {
    Alert,
    Col,
    Row,
    FormGroup,
    Label,
    Input
} from "reactstrap";
import { ActionButton } from "@widget";
import { useState } from "react";
import { useEffect } from "react";
import "./style.scss";
import AffiliateService from "./Service/index";
import Select from "react-select";

const _affiliateService = new AffiliateService();

function TabInfoAffiliate({ affiliate = {}, policyCommisions = [] }) {
    let {
        registration_date = '',
        approved_date = '',
        member_id
    } = affiliate || {}

    const [policyCommisionApply, setPolicyCommisionApply] = useState([]);
    const [msgError, setMsgError] = useState(null)
    const [alerts, setAlerts] = useState([]);

    console.log({ policyCommisions })
    useEffect(() => {
        if (affiliate) {
            setPolicyCommisionApply(affiliate.policy_commision_apply)
        }
    }, [affiliate])

    const handleSubmit = async (isClose = false) => {
        try {
            if (policyCommisionApply.length == 0) {
                setMsgError('Vui lòng chọn chính sách theo loại Affliate tương ứng');
                return;
            }
            await _affiliateService.updPolicyCommisionApply({
                policy_commision_apply: policyCommisionApply,
                member_id
            })
            window._$g.toastr.show("Cập nhật chính sách thành công!", "success");
            if (isClose) {
                return window._$g.rdr("/affiliate");
            }
        } catch (error) {
            let { errors, statusText, message } = error;
            let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");
            setAlerts([{ color: "danger", msg }]);
            window.scrollTo(0, 0);
        }
    }

    return (
        <>
            <Row>
                <Col xs={12}>
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
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <FormGroup row>
                        <Label for="attribute_id" sm={2}>
                            Chính sách áp dụng
                        </Label>
                        <Col sm={10}>
                            <Select
                                className="MuiPaper-filter__custom--select"
                                id="policy_commision_apply"
                                name="policy_commision_apply"
                                onChange={(e) => {
                                    setPolicyCommisionApply(e)
                                    if (msgError) {
                                        setMsgError(null)
                                    }
                                }}
                                isSearchable={true}
                                placeholder={"Vui lòng chọn chính sách theo loại Affliate tương ứng"}
                                value={policyCommisionApply}
                                options={policyCommisions}
                                isMulti
                                isClearable={true}
                            />
                            {msgError && <Alert
                                color="danger"
                                className="field-validation-error">
                                {msgError}
                            </Alert>}
                        </Col>
                    </FormGroup>
                </Col>
                <Col xs={6}>
                    <FormGroup row>
                        <Label for="attribute_id" sm={4}>
                            Ngày đăng ký
                        </Label>
                        <Col sm={8}>
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
                        <Label for="attribute_id" sm={4}>
                            Ngày duyệt đăng ký
                        </Label>
                        <Col sm={8}>
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
                                        onClick: () => handleSubmit(),
                                    },
                                    {
                                        title: "Lưu và đóng",
                                        color: "success",
                                        isShow: true,
                                        permission: ["AFF_AFFILIATE_EDIT", "AFF_AFFILIATE_ADD"],
                                        notSubmit: true,
                                        icon: "save",
                                        onClick: () => handleSubmit(true),
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
        </>
    );
}

export default TabInfoAffiliate;