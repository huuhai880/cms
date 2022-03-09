import React from 'react'
import { configIDRowTable } from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button } from "reactstrap";
import * as yup from "yup";
import { Link } from "react-router-dom";

export const getColumnTable = (data, query, handleActionItemClick) => {
    return [
        configIDRowTable("page_id", "/page/detail/", query),
        {
            name: "page_name",
            label: "Tên Page",
            options: {
                filter: false,
                sort: false,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th
                            key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head"
                        >
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="text-left">
                            <Link
                                to={`/page/detail/${data[tableMeta["rowIndex"]].page_id
                                    }`}
                            >
                                {value}
                            </Link>
                        </div>
                    );
                },
            },
        },
        {
            name: "page_type",
            label: "Loại",
            options: {
                filter: false,
                sort: true,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th
                            key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head"
                            style={{ width: 150 }}>
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <div className="text-left">{value == 1 ? 'Page fill luận giải' : (value == 2 ? 'Page không fill luận giải' : '----')}</div>;
                },
            },
        },

        {
            name: "created_date",
            label: "Ngày tạo",
            options: {
                filter: false,
                sort: true,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th
                            key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head"
                            style={{ width: 150 }}
                        >
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
            name: "created_full_name",
            label: "Người tạo",
            options: {
                filter: false,
                sort: true,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th
                            key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head"
                            style={{ width: 150 }}
                        >
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
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
                        <th
                            key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head"
                            style={{ width: 150 }}
                        >
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <div className="text-center">{value ? "Có" : "Không"}</div>;
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
                            <CheckAccess permission="MD_PAGE_EDIT">
                                <Button
                                    color="primary"
                                    title="Chỉnh sửa"
                                    className="mr-1"
                                    onClick={(evt) =>
                                        handleActionItemClick(
                                            "edit",
                                            data[tableMeta["rowIndex"]].page_id,
                                            tableMeta["rowIndex"]
                                        )
                                    }>
                                    <i className="fa fa-edit" />
                                </Button>
                            </CheckAccess>

                            <Button
                                color="warning"
                                title="Chi tiết"
                                className="mr-1"
                                onClick={evt =>
                                    handleActionItemClick(
                                        "detail",
                                        data[tableMeta["rowIndex"]].page_id,
                                        tableMeta["rowIndex"]
                                    )
                                }>
                                <i className="fa fa-info" />
                            </Button>

                            <CheckAccess permission="MD_PAGE_DEL">
                                <Button
                                    color="danger"
                                    title="Xóa"
                                    className=""
                                    onClick={(evt) =>
                                        handleActionItemClick(
                                            "delete",
                                            data[tableMeta["rowIndex"]].page_id,
                                            tableMeta["rowIndex"]
                                        )
                                    }>
                                    <i className="fa fa-trash" />
                                </Button>
                            </CheckAccess>
                        </div>
                    );
                },
            },
        },
    ]
}

export const initialValues = {
    page_id: 0,
    page_name: '',
    description: '',
    short_description: '',
    is_active: true,
    background_url: null,
    page_type: null,
    is_show_header: true,
    is_show_footer: true
}

export const validationSchema = yup.object().shape({
    page_name: yup.string()
        .required("Tên Page là bắt buộc.")
        .max(500, "Tên Page tối đa 400 ký tự."),
    page_type: yup.number()
        .min(1, "Kiểu page là bắt buộc.")
        .required("Kiểu page là bắt buộc.")
        .nullable(),
})