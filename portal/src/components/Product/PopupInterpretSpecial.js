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
import InterpretSpecialChild from './InterpetSpecialChild'
import { changeAlias, splitString } from "../../utils/index";

const regex = /(<([^>]+)>)/gi;
function PopupInterpretSpecial({ interpretSpecial = [], formik = {}, handleClosePopup, detailRow = {}, noEdit }) {
    const [dataInterpretSpecial, setDataInterpretSpecial] = useState([]);

    const [dataCondition] = useState([
        { label: 'Tất cả', value: 2 },
        { label: 'Họặc', value: 1 },
        { label: 'Và', value: 0 },
    ])
    const [query, setQuery] = useState({
        keyword: '',
        conditionSelected: { label: 'Tất cả', value: 2 },
    })

    const [loading, setLoading] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRowKey, setExpandedRowKey] = useState([]);

    useEffect(() => {
        let _selectedRowKeys = dataInterpretSpecial.filter(p => p.is_selected).map(k => k.interpret_id);
        setSelectedRowKeys(_selectedRowKeys)
    }, [dataInterpretSpecial])

    useEffect(() => {
        setDataInterpretSpecial(interpretSpecial)
    }, [])


    const column = [
        {
            title: "STT",
            dataIndex: "STT",
            key: "name",
            responsive: ["md"],
            render: (text, record, index) => {
                return <div className="text-center">{index + 1}</div>
            },
            width: "4%",
        },
        {
            title: "Tên luận giải",
            dataIndex: "interpret_view_name",
            key: "interpret_view_name",
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
            title: "Vị trí hiển thị",
            dataIndex: "order_index",
            key: "order_index",
            responsive: ["md"],
            width: "8%",
            render: (text, record, index) => {
                return <div className="text-center">{text}</div>;
            },
        },
        {
            title: "Tóm tắt",
            dataIndex: "brief_description",
            key: "brief_description",
            responsive: ["md"],
            width: "35%",
            render: (text, record, index) => {
                let value = text ? text.replace(regex, "") : "";
                value = splitString(value, 80);
                return value;
            },
        },
        {
            title: "Điều kiện",
            key: "x",
            dataIndex: "",
            responsive: ["md"],
            width: "10%",
            render: (text, record, index) => {
                let { is_condition_or = false } = record || {};
                return <div className="text-left">{is_condition_or ? 'Luận giải hoặc' : 'Luận giải và'}</div>;
            },
        },
    ];


    const handleSubmitSpecial = () => {
        try {
            let productPage = [...formik.values.product_page];
            let {
                attributes_group_id = null,
                index_parent = null,
                index_child = null
            } = detailRow || {}
            productPage[index_parent].data_child[index_child].data_interpret = dataInterpretSpecial;
            formik.setFieldValue("product_page", productPage);
            handleClosePopup();
        } catch (error) { }
    }

    const handleClear = () => {
        setQuery({
            keyword: '',
            conditionSelected: { label: 'Tất cả', value: 2 }
        })
        _handleSubmitFillter({ keyword: '', conditionSelected: null })
    }

    const handleKeyDown = (e) => {
        if (1 * e.keyCode === 13) {
            e.preventDefault();
            _handleSubmitFillter(query);
        }
    }

    const handleSubmitFillter = () => {
        _handleSubmitFillter(query)
    }

    const _handleSubmitFillter = (filter) => {
        setLoading(true)
        try {
            let _interpretSpecialCl = [...dataInterpretSpecial];

            if (filter.keyword != '') {
                _interpretSpecialCl = _interpretSpecialCl.filter(p => changeAlias(p.interpret_view_name).includes(changeAlias(filter.keyword)) ||
                    p.interpret_details.some(x => changeAlias(x.interpret_detail_name).includes(changeAlias(filter.keyword)))
                )
            }
            if (filter.conditionSelected != null) {
                let { value = 2 } = filter.conditionSelected;
                _interpretSpecialCl = _interpretSpecialCl.filter(p => (p.is_condition_or && value == 1) ||
                    (!p.is_condition_or && value == 0) || value == 2
                );
            }
            setDataInterpretSpecial(_interpretSpecialCl);

        } catch (error) {

        }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }

    const handleChangeQuery = (name, val) => {
        setQuery({
            ...query,
            [name]: val
        })
    }

    const rowSelection = {
        onSelect: (record, selected) => {
            let { interpret_id = 0 } = record || {};
            let _interpretSpecialCl = [...dataInterpretSpecial];
            let index = _interpretSpecialCl.findIndex(p => p.interpret_id == interpret_id);

            _interpretSpecialCl[index].is_selected = selected;
            _interpretSpecialCl[index].interpret_details = _interpretSpecialCl[index].interpret_details.map(p => {
                return {
                    ...p,
                    ...{ is_selected: selected }
                }
            });

            setDataInterpretSpecial(_interpretSpecialCl)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            let _interpretSpecialCl = [...dataInterpretSpecial];
            _interpretSpecialCl = _interpretSpecialCl.map(p => {
                return {
                    ...p,
                    ...{ is_selected: selected },
                    ...{
                        interpret_details: p.interpret_details.map(k => ({ ...k, is_selected: selected }))
                    }
                }
            })
            setDataInterpretSpecial(_interpretSpecialCl)
        },
        getCheckboxProps: () => ({
            disabled: noEdit,
        }),
    };


    const handleSelectedChild = (record, selected, indexChild) => {
        let _interpretSpecialCl = [...dataInterpretSpecial];
        let { interpret_id = 0 } = record || {};
        let _indexParent = _interpretSpecialCl.findIndex(p => p.interpret_id == interpret_id);
        let { interpret_details = [] } = _interpretSpecialCl[_indexParent] || {}
        interpret_details[indexChild].is_selected = selected;
        setDataInterpretSpecial(_interpretSpecialCl)
    }

    const handleSelectedAllChild = (selected, interpret_id) => {
        let _interpretSpecialCl = [...dataInterpretSpecial];
        let _indexParent = _interpretSpecialCl.findIndex(p => p.interpret_id == interpret_id);
        let { interpret_details = [] } = _interpretSpecialCl[_indexParent] || {}
        for (let i = 0; i < interpret_details.length; i++) {
            const _detail = interpret_details[i];
            _detail.is_selected = selected;
        }

        setDataInterpretSpecial(_interpretSpecialCl)
    }

    return (
        <div>
            <Card className={`animated fadeIn z-index-222 mb-3 news-header-no-border`}>
                <CardHeader
                    className="d-flex"
                    style={{
                        padding: "0.55rem",
                        alignItems: "center",
                    }}
                >
                    <div className="flex-fill font-weight-bold">Cấu hình Luận giải đặc biệt</div>
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
                                        <Col sm={6} xs={12}>
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
                                                        placeholder="Nhập tên thuộc tính ,luận giải đặc biệt "
                                                        value={query.keyword}
                                                        onChange={(e) => handleChangeQuery('keyword', e.target.value)}
                                                        onKeyDown={handleKeyDown}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>

                                        <Col sm={3} xs={12}>
                                            <FormGroup className="mb-2 mb-sm-0">
                                                <Label className="mr-sm-2">
                                                    Điều kiện
                                                </Label>
                                                <Col className="pl-0 pr-0">
                                                    <Select
                                                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                        placeholder={"-- Chọn --"}
                                                        onChange={(e) => handleChangeQuery('conditionSelected', e)}
                                                        value={query.conditionSelected}
                                                        options={dataCondition}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>

                                        <Col sm={3} xs={12} className={`d-flex align-items-end justify-content-end`}>
                                            <FormGroup className="mb-2 mb-sm-0">
                                                <Button
                                                    className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                                    onClick={handleSubmitFillter}
                                                    color="primary"
                                                    type="button"
                                                    size="sm"
                                                >
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
                                                            onClick={handleSubmitSpecial}
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
                                            dataSource={dataInterpretSpecial}
                                            bordered={true}
                                            pagination={false}
                                            scroll={{ y: 370 }}
                                            rowKey={"interpret_id"}
                                            rowSelection={{
                                                selectedRowKeys,
                                                ...rowSelection,
                                            }}
                                            expandable={{
                                                expandedRowRender: (record, index) => (
                                                    <InterpretSpecialChild
                                                        data={record.interpret_details}
                                                        indexParent={index + 1}
                                                        selectedParent={record.is_selected}
                                                        handleSelectedChild={handleSelectedChild}
                                                        handleSelectedAllChild={handleSelectedAllChild}
                                                        noEdit={noEdit}
                                                    />
                                                ),
                                                rowExpandable: (record) => record.interpret_details.length > 0,
                                                onExpand: (expanded, record) => {
                                                    !expanded
                                                        ? setExpandedRowKey([])
                                                        : setExpandedRowKey([record.interpret_id]);
                                                },
                                                expandedRowKeys: expandedRowKey,
                                                expandIcon: ({ expanded, onExpand, record }) =>
                                                    record.interpret_details.length > 0 ? (
                                                        expanded ? (
                                                            <MinusSquareOutlined
                                                                className={"custom_icon"}
                                                                style={{ fontSize: 16, color: "#20a8d8" }}
                                                                onClick={(e) => onExpand(record, e)}
                                                            />
                                                        ) : (
                                                            <PlusSquareOutlined
                                                                className={"custom_icon"}
                                                                style={{ fontSize: 16, color: "#20a8d8" }}
                                                                onClick={(e) => onExpand(record, e)}
                                                            />
                                                        )
                                                    ) : null,
                                            }}
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

export default PopupInterpretSpecial;