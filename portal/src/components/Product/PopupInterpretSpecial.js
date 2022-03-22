import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Button
} from "reactstrap";
import { Table } from "antd";
import { CircularProgress } from "@material-ui/core";
import "./style.scss";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons"; // icon antd
import InterpretSpecialChild from './InterpetSpecialChild'
import { splitString } from "../../utils/index";
import InterpretSpecialFilter from "./InterpretSpecialFilter";
import ProductPage from 'models/ProductPage/index'; // product page
import CustomPagination from "../../utils/CustomPagination";

const regex = /(<([^>]+)>)/gi;
const _productPageModel = new ProductPage();

function PopupInterpretSpecial({ formik = {}, handleClosePopup, detailRow = {}, noEdit }) {
    const [loading, setLoading] = useState(false)
    const [expandedRowKey, setExpandedRowKey] = useState([]);
    const [isSubmitSearch, setIsSubmitSearch] = useState(false)
    const [dataSelected, setDataSelected] = useState({})

    const [data, setData] = useState({
        list: [],
        total: 0,
    });

    const [query, setQuery] = useState({
        itemsPerPage: 25,
        page: 1,
        is_condition_or: 2,
        search: ""
    });


    useEffect(() => {
        try {
            let {
                index_parent = null,
                index_child = null
            } = detailRow || {}

            let attributesGroupOfPage = formik.values['product_page'][index_parent].data_child[index_child] || {};
            let { data_selected_special = {} } = attributesGroupOfPage || {};
            setDataSelected(data_selected_special)
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
            );
        }
        getListInterpretSpecial(query);
    }, [])


    const getListInterpretSpecial = async (query) => {
        setLoading(true);
        try {
            let data = await _productPageModel.getListInterpretSpecialPaging(query);
            setData(data);
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        let filter = { ...query };
        filter.page = newPage + 1;
        setQuery(filter);
        getListInterpretSpecial(filter);
    };

    const handleChangeRowsPerPage = (event) => {
        let filter = { ...query };
        filter.itemsPerPage = event.target.value;
        filter.page = 1;
        setQuery(filter);
        getListInterpretSpecial(filter);
    };

    const handleSubmitFilter = (params) => {
        let query_params = {
            ...query,
            ...params,
            page: 1,
            itemsPerPage: 25,
        };
        setQuery(query_params);
        setIsSubmitSearch(params.isSubmit)
        getListInterpretSpecial(query_params);
    };


    const column = [
        {
            title: "STT",
            dataIndex: "STT",
            key: "name",
            responsive: ["md"],
            render: (text, record, index) => {
                return <div className="text-center">{(query.page - 1) * query.itemsPerPage + index + 1}</div>
            },
            width: "5%",
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
                index_parent = null,
                index_child = null
            } = detailRow || {}

            let _dataSelectedSave = {};
            Object.keys(dataSelected).forEach(key => {
                let { is_selected = false, interpret_details = {}, order_index } = dataSelected[key];
                let _findChild = Object.keys(interpret_details).filter(k => interpret_details[k].is_selected);
                if (is_selected || _findChild.length > 0) {
                    _dataSelectedSave[key] = {
                        is_selected,
                        order_index,
                        interpret_details: Object.fromEntries(_findChild.map(e => [e, {
                            is_selected: interpret_details[e].is_selected,
                            order_index: interpret_details[e].order_index
                        }]))
                    }
                }
            })
            // console.log({ _dataSelectedSave })
            productPage[index_parent].data_child[index_child].data_selected_special = _dataSelectedSave;
            formik.setFieldValue("product_page", productPage);
            handleClosePopup();
        } catch (error) { }
    }

    // console.log({ dataSelected })

    const rowSelection = {
        onSelect: (record, selected) => {
            let { interpret_id = 0, interpret_details = [], order_index } = record || {};
            let _dataSelected = { ...dataSelected };
            _dataSelected[interpret_id] = {
                ..._dataSelected[interpret_id],
                ...{
                    is_selected: selected,
                    order_index,
                    interpret_details: Object.fromEntries(
                        interpret_details.map(e => [e.interpret_detail_id, {
                            is_selected: selected,
                            order_index: e.order_index
                        }])
                    )
                }
            }
            setDataSelected(_dataSelected)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            let _dataSelected = { ...dataSelected };
            for (let i = 0; i < data.list.length; i++) {
                const _item = data.list[i];
                let { interpret_id, interpret_details = [], order_index } = _item || {};
                _dataSelected[interpret_id] = {
                    is_selected: selected,
                    order_index,
                    interpret_details: Object.fromEntries(
                        interpret_details.map(e => [e.interpret_detail_id, {
                            is_selected: selected,
                            order_index: e.order_index
                        }])
                    )
                }
            };
            setDataSelected(_dataSelected)
        },
        getCheckboxProps: () => ({
            disabled: noEdit,
        }),
    };


    const handleSelectedChild = (record, selected, orderIndex) => {
        let { interpret_id = 0, interpret_detail_id = 0, order_index } = record || {};
        let _dataSelected = { ...dataSelected };

        //Neu chua co chon Luan giai Cha thi khoi tao, default la false
        if (!_dataSelected.hasOwnProperty(interpret_id)) {
            _dataSelected[interpret_id] = {
                is_selected: false,
                order_index: orderIndex,
                interpret_details: {}
            }
        }

        _dataSelected[interpret_id] = {
            ..._dataSelected[interpret_id],
            ...{
                interpret_details:
                {
                    ..._dataSelected[interpret_id].interpret_details,
                    [interpret_detail_id]: {
                        is_selected: selected,
                        order_index
                    }
                }
            }
        }
        setDataSelected(_dataSelected)
    }

    const handleSelectedAllChild = (selected, interpret_id, dataChild, orderIndex) => {
        let _dataSelected = { ...dataSelected };

        //Neu chua co chon Luan giai Cha thi khoi tao, default la false
        if (!_dataSelected.hasOwnProperty(interpret_id)) {
            _dataSelected[interpret_id] = {
                is_selected: selected,
                order_index: orderIndex,
                interpret_details: {}
            }
        }

        _dataSelected[interpret_id] = {
            ..._dataSelected[interpret_id],
            ...{
                interpret_details: Object.fromEntries(
                    dataChild.map(e => [e.interpret_detail_id, {
                        is_selected: selected,
                        order_index: e.order_index
                    }])
                )
            }
        }
        setDataSelected(_dataSelected)
    }

    const getSelectedRowKeys = () => {
        let _dataSelected = { ...dataSelected };
        let _rowKeys = Object.keys(_dataSelected).filter(key => _dataSelected[key].is_selected).map(p => p)
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
                                handleSubmitFilter={handleSubmitFilter}
                                handleSubmitSpecial={handleSubmitSpecial}
                            />
                        </div>
                    </CardBody>
                </Card>
                {isSubmitSearch && !loading ? <label style={{ color: 'red', fontWeight: 'bold' }}>{data.total} bản ghi được tìm kiếm</label> : null}
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
                                            dataSource={data.list}
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
                                                        indexParent={(query.page - 1) * query.itemsPerPage + index + 1}
                                                        handleSelectedChild={handleSelectedChild}
                                                        handleSelectedAllChild={handleSelectedAllChild}
                                                        noEdit={noEdit}
                                                        dataSelected={dataSelected ? dataSelected[record.interpret_id] : {}}
                                                        orderIndex={record.order_index}
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

                                        <CustomPagination
                                            count={data.total}
                                            rowsPerPage={query.itemsPerPage}
                                            page={query.page - 1 || 0}
                                            rowsPerPageOptions={[25, 50, 75, 100]}
                                            onChangePage={handleChangePage}
                                            onChangeRowsPerPage={handleChangeRowsPerPage}
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