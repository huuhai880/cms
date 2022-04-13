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
import Loading from "../Common/Loading";
import "./style.scss";
import Upload from "../Common/Antd/Upload";
import AffiliateService from "./Service/index";
import Select from "react-select";
import { ProvinceComponent, DistrictComponent, WardComponent } from '../Common/Address';
import DatePicker from "../Common/DatePicker";
import moment from 'moment'
import { useParams } from "react-router";

const _affiliateService = new AffiliateService();

function AffiliateReview(props) {
    let { id } = useParams();
    const [affiliateRequest, setAffiliateRequest] = useState({});
    const [loading, setLoading] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);
    const [policyCommsions, setPolicyCommisions] = useState([]);
    const [msgError, setMsgError] = useState(null)


    useEffect(() => {
        initData();
    }, [])

    const initData = async () => {
        setLoading(true)
        try {
            let { affiliate_request, affiliate_types, policy_commisions } = await _affiliateService.detailAffRequest(id);
            policy_commisions = policy_commisions.map(p => {
                return {
                    ...p,
                    label: p.policy_commision_name,
                    value: p.policy_commision_id
                }
            })
            setAffiliateRequest(affiliate_request);
            setPolicyCommisions(policy_commisions)
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
            );
        }
        finally {
            setLoading(false)
        }
    }

    const handleReviewAffiliate = async (status) => {
        setIsSubmit(true)
        try {
            let { policy_commision_apply = [] } = affiliateRequest || {};
            if (status == 2 && (!policy_commision_apply || policy_commision_apply.length == 0)) {
                setMsgError('Vui lòng chọn chính sách theo loại Affliate tương ứng');
                return;
            }
            //affiliateRequest.request_status = status;
            if(status == 2){ //Dong y
                await _affiliateService.approveAffRequest({
                    review_note: affiliateRequest.review_note,
                    affiliate_request_id: affiliateRequest.affiliate_request_id,
                    member_id: affiliateRequest.member_id,
                    policy_commision_apply
                })
            }
            else { //Tu choi
                await _affiliateService.rejectAffRequest({
                    review_note: affiliateRequest.review_note,
                    affiliate_request_id: affiliateRequest.affiliate_request_id
                })
            }
            window._$g.toastr.show("Duyệt thành công!", "success");
            //initData();
            return window._$g.rdr("/affiliate-request");
        } catch (error) {
            let { errors, statusText, message } = error;
            let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");
            setAlerts([{ color: "danger", msg }]);
            window.scrollTo(0, 0);
        }
        finally {
            setIsSubmit(false)
        }
    }

    const handleChangeReviewNote = (e) => {
        let _affiliateRequest = { ...affiliateRequest };
        _affiliateRequest.review_note = e.target.value;
        setAffiliateRequest(_affiliateRequest)
    }

    const handleChangePolicyCommisionApply = (e) => {
        let _affiliateRequest = { ...affiliateRequest };
        _affiliateRequest.policy_commision_apply = e;
        setAffiliateRequest(_affiliateRequest)
        if (msgError) {
            setMsgError(null)
        }
    }

    return loading ? (
        <Loading />
    ) : (
        <div key={`view-${id || 0}`} className="animated fadeIn">
            <Row className="d-flex justify-content-center">
                <Col xs={12} md={12}>
                    <Card>
                        <CardHeader>
                            <b>
                                Duyệt đối tác{" "} {affiliateRequest ? affiliateRequest.full_name : ''}
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

                            <Form id="frmAff">
                                <Row>
                                    <Col xs={12} className="mb15">
                                        <b className="underline title_page_h1 text-primary">Thông tin đăng ký</b>
                                    </Col>

                                    <Col xs={12}>
                                        <Row>
                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="request_no" sm={4}>
                                                        Mã đăng ký
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="request_no"
                                                            id="request_no"
                                                            type="text"
                                                            placeholder="Mã đăng ký"
                                                            value={affiliateRequest ? affiliateRequest.request_no : ''}
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="registration_date" sm={4}>
                                                        Ngày đăng ký
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="registration_date"
                                                            id="registration_date"
                                                            type="text"
                                                            placeholder="Ngày đăng ký"
                                                            value={affiliateRequest ? affiliateRequest.registration_date : ''}
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="request_status_name" sm={4}>
                                                        Trạng thái
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="request_status_name"
                                                            id="request_status_name"
                                                            type="text"
                                                            placeholder="Trạng thái"
                                                            value={affiliateRequest ? affiliateRequest.request_status_name : ''}
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={12} className="mb15">
                                        <b className="underline title_page_h1 text-primary">Thông tin đối tác</b>
                                    </Col>

                                    <Col xs={12}>
                                        <Row>
                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="full_name" sm={4}>
                                                        Họ và tên
                                                        {/* <span className="font-weight-bold red-text"> *</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="full_name"
                                                            id="full_name"
                                                            type="text"
                                                            placeholder="Họ và tên"
                                                            value={affiliateRequest ? affiliateRequest.full_name : ''}
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="affiliate_type_name" sm={4}>
                                                        Loại
                                                        {/* <span className="font-weight-bold red-text"> *</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="affiliate_type_name"
                                                            id="affiliate_type_name"
                                                            type="text"
                                                            placeholder="Loại"
                                                            value={affiliateRequest ? affiliateRequest.affiliate_type_name : ''}
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="birth_day" sm={4}>
                                                        Ngày sinh
                                                        {/* <span className="font-weight-bold red-text">*</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="birth_day"
                                                            id="birth_day"
                                                            type="text"
                                                            placeholder="Ngày sinh"
                                                            value={affiliateRequest ? affiliateRequest.birth_day : ''}
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="email" sm={4}>
                                                        Email
                                                        {/* <span className="font-weight-bold red-text"> *</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="email"
                                                            id="email"
                                                            type="text"
                                                            placeholder="Email"
                                                            value={affiliateRequest ? affiliateRequest.email : ''}
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="phone_number" sm={4}>
                                                        Số điện thoại
                                                        {/* <span className="font-weight-bold red-text"> *</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="phone_number"
                                                            id="phone_number"
                                                            type="text"
                                                            placeholder="Số điện thoại"
                                                            value={affiliateRequest ? affiliateRequest.phone_number : ''}
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={12} className="mb15">
                                        <b className="underline title_page_h1 text-primary">Địa chỉ</b>
                                    </Col>


                                    <Col xs={12}>
                                        <Row>
                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="province_id" sm={4}>
                                                        Tỉnh/TP
                                                        {/* <span className="font-weight-bold red-text"> *</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <ProvinceComponent
                                                            id={"province_id"}
                                                            name={"province_id"}
                                                            onChange={(selected) => { }}
                                                            mainValue={6}
                                                            value={affiliateRequest["province_id"]}
                                                            styles={{
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                }),
                                                            }}
                                                            menuPortalTarget={document.querySelector("body")}
                                                            isDisabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="district_id" sm={4}>
                                                        Quận/Huyện
                                                        {/* <span className="font-weight-bold red-text"> *</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <DistrictComponent
                                                            id={"district_id"}
                                                            name={"district_id"}
                                                            onChange={(selected) => { }}
                                                            mainValue={affiliateRequest["province_id"]}
                                                            value={affiliateRequest["district_id"]}
                                                            styles={{
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                }),
                                                            }}
                                                            menuPortalTarget={document.querySelector("body")}
                                                            isDisabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="ward_id" sm={4}>
                                                        Phường/Xã
                                                        {/* <span className="font-weight-bold red-text"> *</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <WardComponent
                                                            id={"ward_id"}
                                                            name={"ward_id"}
                                                            onChange={(selected) => { }}
                                                            mainValue={affiliateRequest["district_id"]}
                                                            value={affiliateRequest["ward_id"]}
                                                            styles={{
                                                                menuPortal: (base) => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                }),
                                                            }}
                                                            menuPortalTarget={document.querySelector("body")}
                                                            isDisabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6}>
                                                <FormGroup row>
                                                    <Label for="address" sm={4}>
                                                        Địa chỉ
                                                        {/* <span className="font-weight-bold red-text"> *</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="address"
                                                            id="address"
                                                            type="text"
                                                            placeholder="Địa chỉ"
                                                            value={affiliateRequest ? affiliateRequest.address : ''}
                                                            disabled={true}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={12} className="mb15">
                                        <b className="underline title_page_h1 text-primary">Thông tin giấy tờ pháp lý</b>
                                    </Col>

                                    <Col xs={12}>
                                        <Row>
                                            <Col xs={12} sm={6}>
                                                <FormGroup row>
                                                    <Label for="id_card" sm={4}>
                                                        Số CMND
                                                        {/* <span className="font-weight-bold red-text">*</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="id_card"
                                                            id="id_card"
                                                            type="text"
                                                            placeholder="Số CMND"
                                                            disabled={true}
                                                            value={affiliateRequest ? affiliateRequest.id_card : ''}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <FormGroup row>
                                                    <Label for="id_card_date" sm={4}>
                                                        Ngày cấp
                                                        {/* <span className="font-weight-bold red-text">*</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <DatePicker
                                                            id="id_card_date"
                                                            date={
                                                                affiliateRequest.id_card_date
                                                                    ? moment(affiliateRequest.id_card_date, 'DD/MM/YYYY')
                                                                    : null
                                                            }
                                                            onDateChange={(date) => { }}
                                                            disabled={true}
                                                            maxToday
                                                            placeholder="Ngày cấp"
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <FormGroup row>
                                                    <Label for="id_card_place" sm={4}>
                                                        Nơi cấp
                                                        {/* <span className="font-weight-bold red-text">*</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            name="id_card_place"
                                                            id="id_card_place"
                                                            type="text"
                                                            placeholder="Nơi cấp"
                                                            disabled={true}
                                                            value={affiliateRequest ? affiliateRequest.id_card_place : ''}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={12} sm={6}>

                                            </Col>

                                            <Col xs={6} sm={6} >
                                                <FormGroup row>
                                                    <Label sm={4} for="id_card_front_side">Ảnh CMND/CCCD
                                                        {/* <span className="font-weight-bold red-text">*</span> */}
                                                    </Label>
                                                    <Col sm={8} style={{ display: 'flex' }}>
                                                        <div className="cmnd-upload mr-2">
                                                            <Upload
                                                                onChange={(img) => { }}
                                                                imageUrl={affiliateRequest.id_card_front_side}
                                                                accept="image/*"
                                                                disabled={true}
                                                                label="Thêm ảnh"
                                                            />
                                                            <i>Ảnh mặt trước</i>
                                                        </div>
                                                        <div className="cmnd-upload ml-2">
                                                            <Upload
                                                                onChange={(img) => { }}
                                                                imageUrl={affiliateRequest.id_card_back_side}
                                                                accept="image/*"
                                                                disabled={true}
                                                                label="Thêm ảnh"
                                                            />
                                                            <i>Ảnh mặt sau</i>
                                                        </div>
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={6} sm={6}>
                                                <FormGroup row>
                                                    <Label sm={4} for="live_image">Ảnh live
                                                        {/* <span className="font-weight-bold red-text">*</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <div className="cmnd-upload" style={{ width: '50%' }}>
                                                            <Upload
                                                                onChange={(img) => { }}
                                                                imageUrl={affiliateRequest.live_image}
                                                                accept="image/*"
                                                                disabled={true}
                                                                label="Thêm ảnh"
                                                            />
                                                        </div>
                                                        <i>Ảnh có chứa khuôn mặt đối tác</i>
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={6} sm={6}>
                                                <FormGroup row>
                                                    <Label sm={4} for="is_agree">
                                                    </Label>
                                                    <Col sm={8}>
                                                        <CustomInput
                                                            className="pull-left"
                                                            onBlur={null}
                                                            checked={affiliateRequest.is_agree}
                                                            type="checkbox"
                                                            id="is_agree"
                                                            onChange={(e) => { }}
                                                            label="Xác nhận đồng ý với Chính sách điều khoản Affiliate"
                                                            disabled={true}
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
                                            <Col xs={12}>
                                                <FormGroup row>
                                                    <Label for="policy_commision_id" sm={2}>
                                                        Chính sách Affliate
                                                        {/* <span className="font-weight-bold red-text">*</span> */}
                                                    </Label>
                                                    <Col sm={10}>
                                                        <Select
                                                            className="MuiPaper-filter__custom--select"
                                                            id="policy_commision_id"
                                                            name="policy_commision_id"
                                                            onChange={(e) => handleChangePolicyCommisionApply(e)}
                                                            isSearchable={true}
                                                            placeholder={"Vui lòng chọn chính sách theo loại Affliate tương ứng"}
                                                            value={affiliateRequest.policy_commision_apply}
                                                            options={policyCommsions}
                                                            isDisabled={affiliateRequest.request_status != 1}
                                                            isMulti
                                                        />
                                                        {msgError && <Alert
                                                            color="danger"
                                                            className="field-validation-error">
                                                            {msgError}
                                                        </Alert>}
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                    </Col>

                                    <Col xs={12} className="mb15">
                                        <b className="underline title_page_h1 text-primary">Thông tin duyệt</b>
                                    </Col>

                                    <Col xs={12}>
                                        <FormGroup row>
                                            <Label for="review_note" sm={2}>
                                                Ghi chú duyệt
                                            </Label>
                                            <Col sm={10}>
                                                <Input
                                                    name="review_note"
                                                    id="review_note"
                                                    type="textarea"
                                                    placeholder="Ghi chú duyệt"
                                                    maxlength={200}
                                                    rows={4}
                                                    disabled={affiliateRequest.request_status != 1}
                                                    value={affiliateRequest ? affiliateRequest.review_note : ''}
                                                    onChange={handleChangeReviewNote}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row className="mt-4">
                                    <Col xs={12} sm={12} style={{ padding: "0px" }}>
                                        <ActionButton
                                            isSubmitting={isSubmit}
                                            buttonList={[
                                                {
                                                    title: "Duyệt đồng ý",
                                                    color: "primary",
                                                    isShow: affiliateRequest.request_status == 1,
                                                    notSubmit: true,
                                                    permission: ["AFF_AFFILIATE_REVIEW"],
                                                    icon: "check",
                                                    onClick: () => handleReviewAffiliate(2),
                                                },
                                                {
                                                    title: "Duyệt từ chối",
                                                    color: "danger",
                                                    isShow: affiliateRequest.request_status == 1,
                                                    permission: ["AFF_AFFILIATE_REVIEW"],
                                                    notSubmit: true,
                                                    icon: "close",
                                                    onClick: () => handleReviewAffiliate(4),
                                                },
                                                {
                                                    title: "Đóng",
                                                    icon: "times-circle",
                                                    isShow: true,
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr("/affiliate-request"),
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

export default AffiliateReview;