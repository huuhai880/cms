import React from "react";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button } from "reactstrap";
import {
    configIDRowTable, formatPrice,
} from "../../utils/index";
import moment from 'moment'

export const getColumTable = (data, total, query, handleDelete, handleReply, handleReview) => {

    return [
        configIDRowTable("discount_id", "/discount/detail/", query),
        {
            name: "discount_code",
            label: "Mã code",
            options: {
                filter: false,
                sort: true,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <div className="text-left">{value}</div>;
                },
            },
        },
        {
            name: "discount_value",
            label: "Hình thức khuyến mãi",
            options: {
                filter: false,
                sort: true,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th style={{ width: '15%' }} key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    const is_percent_discount = data[tableMeta["rowIndex"]].is_percent_discount;
                    return <div className="text-center">{is_percent_discount ? value + '%' : formatPrice(value) + ' VNĐ'}</div>;
                },
            },
        },
        {
            name: "start_date",
            label: "Thời gian áp dụng",
            options: {
                filter: false,
                sort: true,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th style={{ width: '15%' }} key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    const end_date = data[tableMeta["rowIndex"]].end_date;
                    return (
                        <div className="text-left">{value} - {end_date ? end_date : "Không thời hạn"}</div>
                    );
                },
            },
        },
        {
            name: "create_date",
            label: "Ngày tạo",
            options: {
                filter: false,
                sort: true,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th style={{ width: '13%' }} key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <div className="text-center">{value}</div>;
                },
            },
        },
        {
            name: "discount_status",
            label: "Trạng thái",
            options: {
                filter: false,
                sort: false,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th style={{ width: '13%' }} key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    const end_date = data[tableMeta["rowIndex"]].end_date;
                    const start_date = data[tableMeta["rowIndex"]].start_date;
                    var _now = moment();
                    let discount_status = 1;
                    var _start_date = moment(start_date, 'DD/MM/YYYY');
                    var _end_date = end_date ? moment(end_date, 'DD/MM/YYYY') : null;
                    if (_now >= _start_date && (_now <= _end_date || !_end_date)) {
                        discount_status = 2;
                    }
                    else if (_now < _start_date) {
                        discount_status = 1;
                    }
                    else if (_now > _end_date && _end_date) {
                        discount_status = 1;
                    }
                    return (
                        <div className="text-left">{discount_status == 1 ? "Chưa áp dụng" : discount_status == 2 ? "Đang áp dụng" : "Đã kết thúc"}</div>
                    );
                },
            },
        },

        {
            name: "is_active",
            label: "Kích hoạt",
            options: {
                filter: false,
                sort: false,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="text-center">{value == 1 ? "Có" : value == 0 ? "Không" : "Không"}</div>
                    );
                },
            },
        },


        {
            name: "Thao tác",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="text-center">
                            <CheckAccess permission="MD_DISCOUNT_DETAIL">
                                <Button
                                    color="warning"
                                    title="Chi tiết"
                                    className="mr-1"
                                    onClick={(evt) => {
                                        window._$g.rdr(`/discount/detail/${data[tableMeta["rowIndex"]].discount_id}`);
                                    }}
                                >
                                    <i className="fa fa-info" />
                                </Button>
                            </CheckAccess>
                            <CheckAccess permission="MD_DISCOUNT_EDIT">
                                <Button
                                    color="primary"
                                    title="Chỉnh sửa"
                                    className="mr-1"
                                    onClick={(evt) => {
                                        window._$g.rdr(`/discount/edit/${data[tableMeta["rowIndex"]].discount_id}`);
                                    }}
                                >
                                    <i className="fa fa-edit" />
                                </Button>
                            </CheckAccess>
                            <CheckAccess permission="MD_DISCOUNT_DEL">
                                <Button
                                    color="danger"
                                    title="Xóa"
                                    className=""
                                    onClick={(evt) =>
                                        handleDelete(data[tableMeta["rowIndex"]].discount_id, tableMeta["rowIndex"])
                                    }
                                >
                                    <i className="fa fa-trash" />
                                </Button>
                            </CheckAccess>
                        </div>
                    );
                },
            },
        },
    ];
};

export const columns_product = (handleDeleteProduct, noEdit) => [
    {
        title: 'STT',
        dataIndex: '',
        key: '',
        width: 80,
        render: (value, record, index) => {
            return (
                <div className="text-center">{index + 1}</div>
            )
        },
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'product_name',
        key: 'product_name',
        render: (value, record, index) => {
            return (
                <span>{value}</span>
            )
        },
    },
    {
        title: '',
        dataIndex: 'x',
        key: '',
        width: 80,
        render: (value, record) => {
            return (
                <div style={{ textAlign: "center" }}>
                    <CheckAccess permission="PRO_DISCOUNT_DEL">
                        <Button
                            color="danger"
                            title="Xóa"
                            className=""
                            onClick={(evt) =>
                                handleDeleteProduct(record)
                            }
                            disabled={noEdit}>
                            <i className="fa fa-trash" />
                        </Button>
                    </CheckAccess>
                </div>
            )
        }
    },

];
export const columns_customer_type = (handleDeleteCustomerType, noEdit) => [
    {
        title: 'STT',
        dataIndex: '',
        key: '',
        width: 80,
        render: (value, record, index) => {
            return (
                <div className="text-center">{index + 1}</div>
            )
        },
    },
    {
        title: 'Loại khách hàng',
        dataIndex: 'customer_type_name',
        key: 'customer_type_name',
        render: (value, record, index) => {
            return (
                <span>{value}</span>
            )
        },
    },
    {
        title: '',
        dataIndex: 'x',
        key: '',
        width: 100,
        render: (value, record) => {
            return (
                <div style={{ textAlign: "center" }}>
                    <CheckAccess permission="PRO_DISCOUNT_DEL">
                        <Button
                            color="danger"
                            title="Xóa"
                            className=""
                            onClick={(evt) =>
                                handleDeleteCustomerType(record)
                            }
                            disabled={noEdit}>
                            <i className="fa fa-trash" />
                        </Button>
                    </CheckAccess>
                </div>
            )
        }
    },

];