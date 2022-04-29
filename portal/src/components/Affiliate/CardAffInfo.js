import React, { useEffect, useState } from 'react';
import {
    Col,
    Row,
    Label,
    Badge,
} from "reactstrap";
import { Checkbox } from 'antd';
import { Link } from "react-router-dom";
import AffiliateService from './Service/index';

const _affiliateService = new AffiliateService();
function CardAffInfo({ affiliate = {} }) {
    const [isActive, setIsActive] = useState(false)

    let {
        full_name = '',
        affiliate_type_name = '',
        email = '',
        phone_number = '',
        affiliate_id,
        label
    } = affiliate || {};

    useEffect(() => {
        setIsActive(affiliate.is_active)
    }, [affiliate])

    const handleChangeActive = async (e) => {
        try {
            await _affiliateService.updateStatusAff({ is_active: e.target.checked }, affiliate_id)
            setIsActive(e.target.checked)
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
            );
        }
    }

    return (
        <>
            <Row className="align-items-center">
                <Col xs={12} className="d-flex align-items-center">
                    <Label className="font-weight-bold mr-4"
                        style={{textDecoration: 'underline' }}>
                        <Link to={`/account/detail/${affiliate.member_id}`}>
                            {label}
                        </Link>
                    </Label>
                    <h5><Badge color={'primary'}>{affiliate_type_name}</Badge></h5>
                </Col>
            </Row>
            <Row className="align-items-center">
                <Col sm={2}><i className="fa fa-envelope"></i> </Col>
                <Label sm={10}>{email}</Label>
            </Row>
            <Row className="align-items-center">
                <Col sm={2}><i className="fa fa-phone"></i></Col>
                <Label sm={10}>{phone_number}</Label>
            </Row>
            <Row className="align-items-center">
                <Col sm={2}>
                    <Checkbox
                        checked={isActive}
                        onChange={handleChangeActive}
                    />
                </Col>
                <Label sm={10}>Kích hoạt</Label>
            </Row>
        </>
    );
}

export default CardAffInfo;