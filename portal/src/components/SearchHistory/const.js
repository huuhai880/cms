import React from 'react'
import { configIDRowTable } from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button } from "reactstrap";
import * as yup from "yup";
import { Link } from "react-router-dom";

export const getColumnTable = (data, query) => {
    return [
        configIDRowTable("page_id", null, query),
        {
            name: "full_name",
            label: "Họ và tên",
            options: {
                filter: false,
                sort: false,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th
                            key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head"
                            style={{ width: 250 }}
                        >
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="text-left">
                            {value}
                        </div>
                    );
                },
            },
        },
        {
            name: "gender",
            label: "Giới tính",
            options: {
                filter: false,
                sort: true,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th
                            key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head"
                            style={{ width: 200 }}>
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <div className="text-center">{value == 1 ? 'Nam' : 'Nữ'}</div>;
                },
            },
        },

        {
            name: "birth_day",
            label: "Ngày sinh",
            options: {
                filter: false,
                sort: true,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th
                            key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head"
                            style={{ width: 200 }}
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
            name: "product_name",
            label: "Sản phẩm",
            options: {
                filter: false,
                sort: true,
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
            },
        },

        {
            name: "search_date",
            label: "Ngày tra cứu",
            options: {
                filter: false,
                sort: false,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th
                            key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head"
                            style={{ width: 250 }}
                        >
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <div className="text-center">{value}</div>;
                },
            },
        }
    ]
}

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}