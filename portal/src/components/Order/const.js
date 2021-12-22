import {
    configIDRowTable,
} from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import React from "react";
import { Button } from "reactstrap";
import * as yup from "yup";
import moment from "moment";

export const initialValues = {
    order_id: "",
    order_no: '',
    status: null,
    order_date: moment().format("DD/MM/YYYY"),
    phone_number: "",
    full_name: "",
    address: "",
    email: "",
    is_grow_revenue: true,
    member_id: null,
    order_details: [],
    sub_total: 0,
    total: 0,
    total_discount: 0
};

export const getColumTable = (data, total, query, handleDelete) => {
    return [
        configIDRowTable("order_id", "/order/detail/", query),
        {
            name: "order_no",
            label: "Mã đơn hàng",
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
            name: "product_name",
            label: "Tên Sản phẩm/Combo",
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
                    return <div className="text-left order-product-name" dangerouslySetInnerHTML={{__html: value}} />
                },
            },
        },
        {
            name: "customer_name",
            label: "Tên khách hàng",
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
            name: "total",
            label: "Tổng tiền(VNĐ)",
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
                        <div className="text-right">
                            {new Intl.NumberFormat("de-DE", { style: "currency", currency: "VND" }).format(value)}
                        </div>
                    );
                },
            },
        },

        {
            name: "order_date",
            label: "Ngày tạo đơn hàng",
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
                    return <div className="text-center">{value}</div>;
                },
            },
        },
        {
            name: "status",
            label: "Trạng thái thanh toán",
            options: {
                filter: false,
                sort: true,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                            <div>{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div>
                            {value == 1 ? "Đã thanh toán" : value == 0 ? "Chưa thanh toán" : "Chưa thanh toán"}
                        </div>
                    );
                },
            },
        },

        {
            name: "order_type",
            label: "Nguồn",
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
                    return (
                        <div className="text-center">
                            {value == 2 ? "Portal" : "Website"}
                        </div>
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
                    let {status = false} = data[tableMeta["rowIndex"]]
                    return (
                        <div className="text-right">
                            {
                               status == 0 && <CheckAccess permission="SL_ORDER_EDIT">
                                    <Button
                                        color="primary"
                                        title="Chỉnh sửa"
                                        className="mr-1"
                                        onClick={(evt) =>  window._$g.rdr(`/order/edit/${data[tableMeta["rowIndex"]].order_id}`)}>
                                        <i className="fa fa-edit" />
                                    </Button>
                                </CheckAccess>
                            }

                            <CheckAccess permission="SL_ORDER_VIEW">
                                <Button
                                    color="warning"
                                    title="Chi tiết"
                                    className="mr-1"
                                    onClick={(evt) => {
                                        window._$g.rdr(`/order/detail/${data[tableMeta["rowIndex"]].order_id}`);
                                    }}
                                >
                                    <i className="fa fa-info" />
                                </Button>
                            </CheckAccess>
                            <CheckAccess permission="SL_ORDER_DEL">
                                <Button
                                    color="danger"
                                    title="Xóa"
                                    className=""
                                    onClick={(evt) =>
                                        handleDelete(data[tableMeta["rowIndex"]].order_id, tableMeta["rowIndex"])
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


export const validationSchema = yup.object().shape({
    member_id: yup.number().nullable()
        .required("Vui lòng chọn khách hàng."),
    email: yup.string()
        .required("Email là bắt buộc.")
        .email("Email không hợp lệ"),
    order_details: yup.array().nullable()
        .required("Danh sách sản phẩm là bắt buộc")
        .test("order_details", null, (arr) => {
            const checkProduct = arr.findIndex((item, index) => {
                return item.temp_id == null;
            });
            if (checkProduct !== -1) {
                return new yup.ValidationError("Sản phẩm là bắt buộc.", null, "order_details");
            }
            return true
        }),
    status: yup.number().nullable()
        .required("Vui lòng chọn trạng thái đơn hàng."),

})