import React from 'react'
import { configIDRowTable, numberFormat } from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button, Badge} from "reactstrap";
import * as yup from "yup";
import { Link } from "react-router-dom";

export const getColumnTable = (data, query, handleActionItemClick) => {
    return [
        configIDRowTable("wd_request_id", "/withdraw-request/detail/", query),
        {
            name: "wd_request_no",
            label: "Mã yêu cầu rút tiền",
            options: {
                filter: false,
                sort: false,
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
                    return (
                        <div className="text-center">
                            <Link
                                to={`/withdraw-request/detail/${data[tableMeta["rowIndex"]].wd_request_id
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
            name: "full_name",
            label: "Tên đối tác",
            options: {
                filter: false,
                sort: true,
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
                    return <div className="text-left">
                        <Link to={`/affiliate/detail/${data[tableMeta["rowIndex"]].member_id}`}>
                            {value}
                        </Link>
                    </div>;
                },
            },
        },

        {
            name: "wd_values",
            label: "Số tiền rút",
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
                    return <div className="text-right">{numberFormat(value)}</div>;
                },
            },
        },

        {
            name: "wd_date_request",
            label: "Ngày yêu cầu",
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
            name: "wd_date_confirm",
            label: "Ngày xác nhận",
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
                    return <div className="text-center">{value ? value : '--/--/---- --:--:--'}</div>;
                },
            },
        },

        {
            name: "wd_request_status",
            label: "Trạng thái",
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
                    let { color, result } = getStatus(value);
                    return <div className="text-left">
                        <Badge color={color}>{result}</Badge>
                    </div>;
                },
            },
        },

        {
            name: "confirm_user_full_name",
            label: "Nhân viên xác nhận",
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
            name: "Thao tác",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRender: (value, tableMeta, updateValue) => {
                    let {wd_request_status = 0} = data[tableMeta["rowIndex"]] || {};
                    return (
                        <div className="text-center">
                            <Button
                                color={wd_request_status == 1 ? "success" : 'warning'}
                                title="Thao tác"
                                className="mr-1"
                                onClick={evt => window._$g.rdr(`/withdraw-request/detail/${data[tableMeta["rowIndex"]].wd_request_id}`)}>
                                <i className={`fa fa-${wd_request_status == 1 ? 'check' : 'info'}`} />
                            </Button>
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

export const getStatus = status => {
    switch (status) {
        case 1:
            return {
                result: 'Yêu cầu rút tiền mới',
                color: 'primary'
            }
        case 2:
            return {
                result: 'Đã hoàn thành',
                color: 'success'
            }
        case 3:
            return {
                result: 'KH Huỷ yêu cầu',
                color: 'danger'
            }
        case 4:
            return {
                result: 'Không duyệt',
                color: 'danger'
            }
        default:
            return '';
    }
}