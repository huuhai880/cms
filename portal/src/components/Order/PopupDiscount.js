import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Button,
    FormGroup,
    Label,
    Input,
    Form,
} from "reactstrap";
import { Table } from "antd";
import { column } from "./const";
import { CircularProgress } from "@material-ui/core";
import "./style.scss";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons"; // icon antd
import Select from "react-select";
import { changeAlias, formatPrice, splitString } from "../../utils/index";
import OrderModel from "models/OrderModel/index";
import { Checkbox } from 'antd';

const regex = /(<([^>]+)>)/gi;

function PopupDiscount({ orderDetails = [], discountSeleted = {}, handleClosePopup, noEdit, memberId, handleApplyDiscount }) {
    const [loading, setLoading] = useState(false);
    const [dataDiscount, setDataDiscount] = useState([]);
    const [keyword, setKeyword] = useState('')
    const [discountApply, setDiscountApply] = useState([])
    const [discountChecked, setDiscountChecked] = useState({})

    useEffect(() => {
        getDiscountApply();
    }, [])

    useEffect(() => {
        setDiscountChecked(discountSeleted)
    }, [discountSeleted])

    const getDiscountApply = async () => {
        setLoading(true)
        const _orderModel = new OrderModel();
        try {

            let _discountApply = await _orderModel.getListDiscountApply({
                order_details: orderDetails,
                member_id: memberId
            })
            let _discountClone = JSON.parse(JSON.stringify([..._discountApply]));
            setDiscountApply(_discountClone)
            setDataDiscount(_discountApply);
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại")
            );
        }
        finally {
            setLoading(false)
        }
    }

    const handleChangeDiscount = (record) => {
        setDiscountChecked(record)
    }

    const column = [
        {
            title: "#",
            dataIndex: "#",
            key: "#",
            responsive: ["md"],
            render: (text, record, index) => {
                let { discount_id = 0 } = discountChecked || {}
                return <div className="text-center">
                    <Checkbox
                        disabled={noEdit}
                        onChange={e => handleChangeDiscount(record)}
                        checked={discount_id == record.discount_id}>
                    </Checkbox>
                </div>
            },
            width: "10%",
        },
        {
            title: "STT",
            dataIndex: "STT",
            key: "name",
            responsive: ["md"],
            render: (text, record, index) => {
                return <div className="text-center">{index + 1}</div>
            },
            width: "10%",
        },
        {
            title: "Mã code",
            dataIndex: "discount_code",
            key: "discount_code",
            responsive: ["md"],
            render: (text, record, index) => {
                return (
                    <div className="text-left">
                        {text}
                    </div>
                );
            },
        },
        {
            title: "Hình thức khuyến mãi",
            dataIndex: "#",
            key: "#",
            responsive: ["md"],
            width: "30%",
            render: (text, record, index) => {
                const { is_percent_discount = false, discount_value = 0 } = record || {};

                return <div className="text-center">{is_percent_discount ? discount_value + '%' : formatPrice(discount_value) + ' VNĐ'}</div>;
            },
        },
        {
            title: "Thời gian áp dụng",
            dataIndex: "#",
            key: "#",
            responsive: ["md"],
            width: "30%",
            render: (text, record, index) => {
                let { start_date = '', end_date = '' } = record || {};
                return (
                    <div className="text-left">{start_date} - {end_date ? end_date : "Không thời hạn"}</div>
                );
            },
        },
    ];


    const handleChangeKeyword = (e) => {
        setKeyword(e.target.value)
    }

    const handleSubmitFillter = () => {
        _handleSubmitFillter(keyword)
    }

    const handleClear = () => {
        setKeyword('')
        _handleSubmitFillter('')
    }

    const handleKeyDown = (e) => {
        if (1 * e.keyCode === 13) {
            e.preventDefault();
            _handleSubmitFillter(keyword);
        }
    }

    const _handleSubmitFillter = (_keyword) => {
        setLoading(true)
        try {
            _keyword = _keyword ? _keyword.trim() : '';
            let _discountClone = JSON.parse(JSON.stringify([...dataDiscount]))
            if(_keyword != ''){
                _discountClone = _discountClone.filter((item) => item.discount_code.indexOf(_keyword) != -1);
            }
            setDiscountApply(_discountClone);
        } catch (error) { }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }

    const handleSubmitApplyDiscount = () => {
        handleApplyDiscount(discountChecked)
    }

    return (
        <div>
            <Card className={`animated fadeIn z-index-222 mb-3 news-header-no-border`}>
                <CardHeader
                    className="d-flex"
                    style={{
                        padding: "0.55rem",
                        alignItems: "center",
                    }}>
                    <div className="flex-fill font-weight-bold">Danh sách Mã khuyến mãi</div>
                    <Button color="danger" size="md" onClick={handleClosePopup}>
                        <i className={`fa fa-remove`} />
                    </Button>
                </CardHeader>
            </Card>
            <Col>
                <Card className="animated fadeIn z-index-222 mb-3 ">
                    <CardBody className="px-0 py-0">
                        <div className="MuiPaper-filter__custom">
                            <div className="ml-3 mr-3 mb-3 mt-3">
                                <Form autoComplete="nope" className="zoom-scale-9">
                                    <Row>
                                        <Col sm={8} xs={12}>
                                            <FormGroup className="mb-2 mb-sm-0">
                                                <Label for="inputValue" className="mr-sm-2">
                                                    Từ khóa
                                                </Label>
                                                <Col className="pl-0 pr-0">
                                                    <Input
                                                        className="MuiPaper-filter__custom--input pr-0"
                                                        autoComplete="nope"
                                                        type="text"
                                                        name="keyword"
                                                        placeholder="Nhập mã code"
                                                        value={keyword}
                                                        onChange={handleChangeKeyword}
                                                        onKeyDown={handleKeyDown}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>

                                        <Col sm={4} xs={12} className={`d-flex align-items-end justify-content-end`}>
                                            <FormGroup className="mb-2 mb-sm-0">
                                                <Button
                                                    className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                                    onClick={handleSubmitFillter}
                                                    color="primary"
                                                    type="button"
                                                    size="sm">
                                                    <i className="fa fa-search mr-1" />
                                                    Tìm kiếm
                                                </Button>
                                            </FormGroup>
                                            <FormGroup className="mb-2 ml-2 mb-sm-0">
                                                <Button
                                                    className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                                    onClick={handleClear}
                                                    type="button"
                                                    size="sm"
                                                >
                                                    <i className="fa fa-refresh mr-1" />
                                                    Làm mới
                                                </Button>
                                            </FormGroup>
                                            {
                                                !noEdit ?
                                                    <FormGroup className="mb-2 ml-2 mb-sm-0">
                                                        <Button
                                                            className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                                            onClick={handleSubmitApplyDiscount}
                                                            color="success"
                                                            type="button"
                                                            size="sm"
                                                        >
                                                            <i className="fa fa-plus mr-1" />
                                                            Chọn
                                                        </Button>
                                                    </FormGroup> : null
                                            }
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className={`animated fadeIn mb-3 `}>
                    <CardBody className="px-0 py-0">
                        <Row>
                            <Col xs={12} sm={12}>
                                {loading ? (
                                    <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                                        <CircularProgress />
                                    </div>
                                ) : (
                                    <div>
                                        <Table
                                            className="components-table-demo-nested"
                                            columns={column}
                                            dataSource={discountApply}
                                            bordered={true}
                                            pagination={false}
                                            // scroll={{ y: 370 }}
                                            rowKey={"discount_id"}
                                        />
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </div>
    );

}

export default PopupDiscount;