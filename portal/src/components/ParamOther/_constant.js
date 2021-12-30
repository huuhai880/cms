import React from 'react'
import { configIDRowTable } from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button, CustomInput } from "reactstrap";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { Checkbox } from 'antd';

export const getColumnTable = (data, query, handleActionItemClick) => {
    return [
        configIDRowTable("param_other_id", "/param-other/detail/", query),
        {
            name: "name_type",
            label: "Tên biến số",
            options: {
                filter: false,
                sort: false,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th
                            key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head">
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
            name: "is_house_number",
            label: "Số nhà",
            options: {
                filter: false,
                sort: false,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head" style={{ width: '15%' }}>
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    let { param_other_id = 0 } = data[tableMeta["rowIndex"]] || {}
                    return <div className="text-center">
                        <CustomInput type="checkbox" checked={value} id={`cbIsHouseNumber_${param_other_id}`} onChange={() => {}}/>
                    </div>;
                },
            },
        },

        {
            name: "is_phone_number",
            label: "Số điện thoại",
            options: {
                filter: false,
                sort: false,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head" style={{ width: '15%' }}>
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    let { param_other_id = 0 } = data[tableMeta["rowIndex"]] || {}
                    return <div className="text-center">
                        <CustomInput type="checkbox" checked={value} id={`cbIsPhoneNumber_${param_other_id}`} onChange={() => {}}/>
                    </div>;
                },
            },
        },

        {
            name: "is_license_plate",
            label: "Biển số xe",
            options: {
                filter: false,
                sort: false,
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head" style={{ width: '15%' }}>
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    let { param_other_id = 0 } = data[tableMeta["rowIndex"]] || {}
                    return <div className="text-center">
                        <CustomInput type="checkbox" checked={value} id={`cbIsLicensePlate_${param_other_id}`} onChange={() => {}}/>
                    </div>;
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
                        <th key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head" style={{ width: '15%' }}>
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
                customHeadRender: (columnMeta, handleToggleColumn) => {
                    return (
                        <th key={`head-th-${columnMeta.label}`}
                            className="MuiTableCell-root MuiTableCell-head" style={{ width: '10%' }}>
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="text-center">
                            <CheckAccess permission="MD_PARAMOTHER_EDIT">
                                <Button
                                    color="primary"
                                    title="Chỉnh sửa"
                                    className="mr-1"
                                    onClick={(evt) =>
                                        handleActionItemClick(
                                            "edit",
                                            data[tableMeta["rowIndex"]].param_other_id,
                                            tableMeta["rowIndex"]
                                        )
                                    }
                                >
                                    <i className="fa fa-edit" />
                                </Button>
                            </CheckAccess>

                            <CheckAccess permission="MD_PARAMOTHER__DEL">
                                <Button
                                    color="danger"
                                    title="Xóa"
                                    className=""
                                    onClick={(evt) =>
                                        handleActionItemClick(
                                            "delete",
                                            data[tableMeta["rowIndex"]].param_other_id,
                                            tableMeta["rowIndex"]
                                        )
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
    ]
}


export const initialValues = {
    param_other_id: null,
    name_type: '',
    is_house_number: false,
    is_phone_number: false,
    is_license_plate: false,
    is_active: true,
}

export const validationSchema = yup.object().shape({
    name_type: yup.string()
        .required("Tên biến số là bắt buộc.")
})