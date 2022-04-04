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
import TabInfoAffiliate from "./TabInfoAffiliate";
import TabOrder from "./TabOrder";
import TabCustomer from "./TabCustomer";
import TabMember from "./TabMember";
import CardAffReport from "./CardAffReport";
import CardAffInfo from "./CardAffInfo";


const _affiliateService = new AffiliateService();
function AffiliateDetail(props) {
    let { id } = useParams();
    const [activeTab, setActiveTab] = useState('INFO')
    const [affiliate, setAffiliate] = useState({});
    const [loading, setLoading] = useState(false);
    const [policyCommsions, setPolicyCommisions] = useState([])

    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {
        setLoading(true)
        try {
            let _affiliate = await _affiliateService.getDetailAff(id);
            let { policy_commisions } = await _affiliateService.init();
            let {affiliate_type_id} = _affiliate || {};
            let _policyCommisions = (policy_commisions || []).filter(p => p.affiliate_type_id == affiliate_type_id)
            setPolicyCommisions(_policyCommisions);
            setAffiliate(_affiliate);
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
            );
        }
        finally {
            setLoading(false)
        }
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'INFO':
                return <TabInfoAffiliate affiliate={affiliate} policyCommsions={policyCommsions}/>
            case 'ORDER':
                return <TabOrder />
            case 'CUSTOMER':
                return <TabCustomer />
            case 'MEMBER':
                return <TabMember />
            default:
                break;
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
                            <b>Chi tiết đối tác{" "}{affiliate.full_name} </b>
                        </CardHeader>
                        <CardBody>
                            <Row style={{ border: '1px solid #dce0e3', margin: 5 }}>
                                <Col xs={12} sm={4} style={{ padding: 15, borderRight: '1px solid #dce0e3' }}>
                                    <CardAffInfo affiliate={affiliate} />
                                </Col>

                                <Col xs={12} sm={8} style={{ padding: 15 }}>
                                    <CardAffReport />
                                </Col>
                            </Row>
                            <Row style={{ margin: '10px 5px' }}>
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={`${activeTab === "INFO" ? "active" : ""}`}
                                            onClick={() => setActiveTab("INFO")}>
                                            Thông tin Affiliate
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={`${activeTab === "ORDER" ? "active" : ""}`}
                                            onClick={() => setActiveTab("ORDER")}>
                                            Danh sách đơn hàng
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={`${activeTab === "CUSTOMER" ? "active" : ""}`}
                                            onClick={() => setActiveTab("CUSTOMER")}>
                                            Danh sách khách hàng
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={`${activeTab === "MEMBER" ? "active" : ""}`}
                                            onClick={() => setActiveTab("MEMBER")}>
                                            Danh sách Member
                                        </NavLink>
                                    </NavItem>
                                </Nav>

                                <TabContent style={{ width: "100%" }}>
                                    <TabPane className="active">
                                        {renderTabContent()}
                                    </TabPane>
                                </TabContent>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AffiliateDetail;