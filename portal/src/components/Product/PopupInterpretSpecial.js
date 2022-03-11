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
import InterpretSpecialFilter from "./InterpretSpecialFilter";

const regex = /(<([^>]+)>)/gi;
function PopupInterpretSpecial({ interpretSpecial = [], formik = {}, handleClosePopup, detailRow = {}, noEdit }) {
    const [dataInterpretSpecial, setDataInterpretSpecial] = useState([]);
    const [dataUpdate, setDataUpdate] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRowKey, setExpandedRowKey] = useState([]);
    const [isSubmitSearch, setIsSubmitSearch] = useState(false)

    useEffect(() => {
        setDataInterpretSpecial(JSON.parse(JSON.stringify([...interpretSpecial])));
        setDataUpdate(JSON.parse(JSON.stringify([...interpretSpecial])));
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
            productPage[index_parent].data_child[index_child].data_interpret = dataUpdate;
            formik.setFieldValue("product_page", productPage);
            handleClosePopup();
        } catch (error) { }
    }

    const _handleSubmitFillter = (filter) => {
        setIsSubmitSearch(filter.isSubmit)
        setLoading(true)
        try {
            let _interpretSpecialCl = JSON.parse(JSON.stringify([...interpretSpecial]));

            if (filter.keyword != '') {
                _interpretSpecialCl = _interpretSpecialCl.filter(p => changeAlias(p.interpret_view_name).includes(changeAlias(filter.keyword)) ||
                    changeAlias(p.brief_description).includes(changeAlias(filter.keyword)) ||
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
            }, 500)
        }
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

            setDataInterpretSpecial(_interpretSpecialCl);

            //Update
            let _cloneDataUpdate = [...dataUpdate];
            let _cloneDataIndex = _cloneDataUpdate.findIndex(p => p.interpret_id == interpret_id);
            _cloneDataUpdate[_cloneDataIndex].is_selected = selected;
            _cloneDataUpdate[_cloneDataIndex].interpret_details = (_cloneDataUpdate[_cloneDataIndex].interpret_details || []).map(p => {
                return {
                    ...p,
                    ...{ is_selected: selected }
                }
            });
            setDataUpdate(_cloneDataUpdate);

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
            setDataInterpretSpecial(_interpretSpecialCl);

            //Update
            let _cloneDataUpdate = [...dataUpdate];
            for (let index = 0; index < _cloneDataUpdate.length; index++) {
                const _interpret = _cloneDataUpdate[index];
                let { interpret_id = 0 } = _interpret || {};
                let _find = _interpretSpecialCl.find(p => p.interpret_id == interpret_id);
                if (_find) {
                    _interpret.is_selected = selected;
                    _interpret.interpret_details = _interpret.interpret_details.map(k => ({ ...k, is_selected: selected }))
                }
            }
            setDataUpdate(_cloneDataUpdate)
        },
        getCheckboxProps: () => ({
            disabled: noEdit,
        }),
    };


    const handleSelectedChild = (record, selected, indexChild) => {
        let _interpretSpecialCl = [...dataInterpretSpecial];
        let { interpret_id = 0, interpret_detail_id = 0 } = record || {};
        let _indexParent = _interpretSpecialCl.findIndex(p => p.interpret_id == interpret_id);
        let { interpret_details = [] } = _interpretSpecialCl[_indexParent] || {}
        interpret_details[indexChild].is_selected = selected;
        setDataInterpretSpecial(_interpretSpecialCl)

        //Update
        let _cloneDataUpdate = [...dataUpdate];
        let _indexParentCloneData = _cloneDataUpdate.findIndex(p => p.interpret_id == interpret_id);
        let _indexChildClone = (_cloneDataUpdate[_indexParentCloneData].interpret_details || []).findIndex(p => p.interpret_detail_id == interpret_detail_id);
        _cloneDataUpdate[_indexParentCloneData].interpret_details[_indexChildClone].is_selected = selected;
        setDataUpdate(_cloneDataUpdate)
    }

    const handleSelectedAllChild = (selected, interpret_id) => {
        let _interpretSpecialCl = [...dataInterpretSpecial];
        let _indexParent = _interpretSpecialCl.findIndex(p => p.interpret_id == interpret_id);
        let { interpret_details = [] } = _interpretSpecialCl[_indexParent] || {}
        for (let i = 0; i < interpret_details.length; i++) {
            const _detail = interpret_details[i];
            _detail.is_selected = selected;
        }

        setDataInterpretSpecial(_interpretSpecialCl);

        //Update
        let _cloneDataUpdate = [...dataUpdate];
        let _indexParentCloneData = _cloneDataUpdate.findIndex(p => p.interpret_id == interpret_id);
        for (let i = 0; i < _cloneDataUpdate[_indexParentCloneData].interpret_details.length; i++) {
            const _detail = _cloneDataUpdate[_indexParentCloneData].interpret_details[i];
            _detail.is_selected = selected;
        }
        setDataUpdate(_cloneDataUpdate)
    }

    const getSelectedRowKeys = () => {
        let _data = [...dataUpdate];
        let _rowKeys = _data.filter(p => p.is_selected).map(p => parseInt(p.interpret_id)) || [];
        return _rowKeys;
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
                            <InterpretSpecialFilter 
                                noEdit={noEdit}
                                handleSubmitFilter={_handleSubmitFillter}
                                handleSubmitSpecial={handleSubmitSpecial}
                            />
                        </div>
                    </CardBody>
                </Card>
                {isSubmitSearch && !loading ? <label style={{ color: 'red', fontWeight: 'bold' }}>{dataInterpretSpecial.length} bản ghi được tìm kiếm</label> : null}
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
                                                selectedRowKeys: getSelectedRowKeys(),
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
                                                        dataUpdate={dataUpdate.find(p => p.interpret_id == record.interpret_id)}
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