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
    ModalBody,
    Badge
} from "reactstrap";
import { ActionButton } from "@widget";
import { mapDataOptions4Select } from "../../utils/html";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "../Common/Loading";
import { convertValueSelect, formatPrice, numberFormat } from 'utils/index';

import {
    CloseOutlined
} from '@ant-design/icons';
import {
    FormInput,
    UploadImage
} from "@widget";
import Upload from "../Common/Antd/Upload";
import './style.scss'
import { DropzoneArea } from "material-ui-dropzone";
import { getStatus } from './const';
import { useParams } from "react-router";
import WithdrawRequestService from './Service/index';
import { Modal } from 'antd'

const _withdrawRequestService = new WithdrawRequestService();

function WithdrawRequestDetail(props) {
    let { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [withdrawRequest, setWithdrawRequest] = useState({});
    let { wd_request_status = 1 } = withdrawRequest || {};
    const { userAuth } = window._$g;

    const [isShowModalAccept, setIsShowModalAccept] = useState(false);
    const [isShowModalReject, setIsShowModalReject] = useState(false);
    const [note, setNote] = useState('');
    const [paymentImage, setPaymentImage] = useState(null);
    const [error, setError] = useState('')

    useEffect(() => {
        initData();
    }, [])

    const initData = async () => {
        setLoading(true);
        try {
            let _wdRequest = await _withdrawRequestService.read(id);
            let { payment_image = null } = _wdRequest || {};
            setWithdrawRequest(_wdRequest);
            setPaymentImage(payment_image)
        } catch (error) {
            window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
        } finally {
            setLoading(false);
        }
    };

    const handleAccpetRequest = () => {
        setIsShowModalAccept(true)
    }

    const handleRejectRequest = () => {
        setIsShowModalReject(true)
    }

    const renderStatus = () => {
        let { color, result } = getStatus(wd_request_status);
        return <Badge color={color}>{result}</Badge>
    }

    const handleCloseModalAccept = () => {
        setIsShowModalAccept(false)
    }

    const handleSubmitAccept = async () => {
        try {
            await _withdrawRequestService.accept({
                wd_request_id: withdrawRequest.wd_request_id,
                payment_image: paymentImage,
                wd_request_no: withdrawRequest.wd_request_no
            })
            window._$g.toastr.show('Duyệt yêu cầu thành công!', 'success');
            initData();
        } catch (error) {
            window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
        }
        finally{
            setIsShowModalAccept(false);
        }
    }

    const handleSubmitReject = async () => {
        if (!note) {
            setError('Lý do là bắt buộc')
            return;
        }
        try {
            await _withdrawRequestService.reject({
                wd_request_id: withdrawRequest.wd_request_id,
                note,
                email: withdrawRequest.email,
                full_name: withdrawRequest.full_name,
                wd_request_no: withdrawRequest.wd_request_no
            })
            window._$g.toastr.show('Huỷ yêu cầu thành công!', 'success');
            initData();
        } catch (error) {
            window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
        }
        finally {
            setIsShowModalReject(false);
        }
    }

    return loading ? <Loading /> : (
        <div key={`view`} className="animated fadeIn news">
            <Row className="d-flex justify-content-center">
                <Col xs={12} md={12}>
                    <Card>
                        <CardHeader>
                            <b>Chi tiết yêu cầu rút tiền</b>
                        </CardHeader>

                        <CardBody>
                            <Form>
                                <Row>
                                    <Col xs={12} sm={12} md={8} lg={8}>
                                        <Row className="mb-2">
                                            <Col xs={12}>
                                                <b className="underline title_page_h1 text-primary">Thông tin yêu cầu rút tiền</b>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={6}>
                                                <Row>
                                                    <Label className="text-left" sm={5}> Mã yêu cầu:</Label>
                                                    <Label className="text-left font-weight-bold" sm={7}>{withdrawRequest.wd_request_no}</Label>
                                                </Row>
                                            </Col>
                                            <Col xs={6}>
                                                <Row>
                                                    <Label className="text-left" sm={5}>Trạng thái:</Label>
                                                    <Label className="text-left font-weight-bold" sm={7}>{renderStatus()}</Label>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Label className="text-left" sm={5}>Khách hàng:</Label>
                                                    <Label className="text-left font-weight-bold" sm={7}>{withdrawRequest.full_name}</Label>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Label className="text-left" sm={5}>Số điện thoại:</Label>
                                                    <Label className="text-left font-weight-bold" sm={7}>{withdrawRequest.phone_number}</Label>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Label className="text-left" sm={5}>Email:</Label>
                                                    <Label className="text-left font-weight-bold" sm={7}>{withdrawRequest.email}</Label>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Label className="text-left" sm={5}>Số tiền rút:</Label>
                                                    <Label className="text-left font-weight-bold" sm={7}>{numberFormat(withdrawRequest.wd_values)}</Label>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Label className="text-left" sm={5}>Ngân hàng nhận:</Label>
                                                    <Label className="text-left font-weight-bold" sm={7}>{withdrawRequest.bank_name}</Label>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Label className="text-left" sm={5}>Số tài khoản:</Label>
                                                    <Label className="text-left font-weight-bold" sm={7}>{withdrawRequest.bank_account_name}</Label>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Label className="text-left" sm={5}>Ghi chú:</Label>
                                                    <Label className="text-left font-weight-bold" sm={7}>{withdrawRequest.description}</Label>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Label className="text-left" sm={5}>Nhân viên xác nhận:</Label>
                                                    <Label className="text-left font-weight-bold" sm={7}>
                                                        {wd_request_status == 1 ? userAuth._fullname() : withdrawRequest.confirm_user_full_name}
                                                    </Label>
                                                </Row>
                                            </Col>
                                            <Col sm={6}>
                                                <Row>
                                                    <Label className="text-left" sm={5}>Nội dung:</Label>
                                                    <Label className="text-left font-weight-bold" sm={7}>
                                                        {withdrawRequest.note}
                                                    </Label>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12} sm={12} md={4} lg={4}>
                                        <Row className="mb-4">
                                            <Col xs={12}>
                                                <b className="underline title_page_h1 text-primary">Hình ảnh chuyển khoản</b>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                <FormGroup row>
                                                    <Col sm={12}>
                                                        <div className="background-url-upload">
                                                            <Upload
                                                                onChange={(img) => setPaymentImage(img)}
                                                                imageUrl={paymentImage}
                                                                accept="image/*"
                                                                disabled={wd_request_status != 1}
                                                                id={1}
                                                                label="Thêm ảnh"
                                                            />
                                                        </div>
                                                        <Label style={{ paddingLeft: 10 }}>
                                                            {`Vui lòng upload ảnh < 4MB`}
                                                        </Label>
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                        </Row>
                                    </Col>
                                </Row>

                                <Row className="mt-4">
                                    <Col xs={12} sm={12} style={{ padding: "0px" }}>
                                        <ActionButton
                                            isSubmitting={false}
                                            buttonList={[
                                                {
                                                    title: "Duyệt và xác nhận yêu cầu",
                                                    color: "primary",
                                                    isShow: wd_request_status == 1,
                                                    notSubmit: true,
                                                    permission: ["WA_WITHDRAWREQUEST_EDIT"],
                                                    icon: "check",
                                                    onClick: handleAccpetRequest,
                                                },
                                                {
                                                    title: "Huỷ yêu cầu",
                                                    color: "danger",
                                                    isShow: wd_request_status == 1,
                                                    permission: ["WA_WITHDRAWREQUEST_EDIT"],
                                                    notSubmit: true,
                                                    icon: "close",
                                                    onClick: handleRejectRequest,
                                                },
                                                {
                                                    title: "Đóng",
                                                    icon: "times-circle",
                                                    isShow: true,
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr("/withdraw-request"),
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

            <Modal
                visible={isShowModalAccept}
                title={<span className='font-weight-bold'>DUYỆT VÀ XÁC NHẬN YÊU CẦU RÚT TIỀN?</span>}
                closable={false}
                footer={[
                    <Button
                        color="primary"
                        onClick={handleSubmitAccept}
                        className="mr-2 btn-block-sm"
                        type="button">
                        Đồng ý
                    </Button>,
                    <Button
                        onClick={handleCloseModalAccept}
                        className="btn-block-sm"
                        type="button">
                        Đóng
                    </Button>
                ]}
                bodyStyle={{ padding: '10px 24px' }}>
                <Label>
                    Thao tác này sẽ ghi nhận số tiền yêu cầu rút thành công trên tài khoản đối tác. Thao tác không thể phục hồi. Bạn có chắc chắn thực thi lệnh rút tiền của đối tác?
                </Label>
            </Modal>

            <Modal
                visible={isShowModalReject}
                title={<span className='font-weight-bold'>HUỶ YÊU CẦU RÚT TIỀN?</span>}
                closable={false}
                footer={[
                    <Button
                        color="primary"
                        onClick={handleSubmitReject}
                        className="mr-2 btn-block-sm"
                        type="button">
                        Xác nhận gửi Email
                    </Button>,
                    <Button
                        onClick={() => {
                            setIsShowModalReject(false);
                            setError('');
                            setNote('')
                        }}
                        className="btn-block-sm"
                        type="button">
                        Đóng
                    </Button>
                ]}
                bodyStyle={{ padding: '10px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="text-left">Từ chối duyệt yêu cầu rút tiền: <b style={{ color: '#2bc3c3' }}>{withdrawRequest.wd_request_no}</b></span>
                    <span className="text-left">Số tiền rút: <b style={{ color: 'red' }}>{numberFormat(withdrawRequest.wd_values)}</b> </span>
                    <span className="text-left mb-2">Nhập lý do(tối đa 100 ký tự):</span>
                    <textarea name="note"
                        id="note" placeholder="Lý do"
                        maxLength={100}
                        rows={3}
                        class="form-control"
                        value={note}
                        onChange={e => {
                            setNote(e.target.value);
                            if (error) {
                                setError('')
                            }
                        }} />
                    {
                        error ? <Alert
                            color="danger"
                            className="field-validation-error">
                            Lý do là bắt buộc
                        </Alert> : null
                    }
                    <i style={{ fontSize: 12, marginTop: 5 }}>Yêu cầu huỷ rút tiền sẽ được gửi đến email: <span style={{ color: '#2bc3c3' }}>{withdrawRequest.email}</span></i>
                </div>
            </Modal>
        </div>
    );
}

export default WithdrawRequestDetail;