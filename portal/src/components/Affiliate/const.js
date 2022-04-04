import React from 'react'
import { configIDRowTable, numberFormat } from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button, Badge} from "reactstrap";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { Checkbox } from "antd";

export const getColumnTable = (data, query, handleActionItemClick, setMemberUpLevel, memberUpLevel) => {
    return [
        {
            name: "#",
            label: "Chọn",
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
                    let { affiliate_type_id = 0, is_affiliate_level_1 = false, member_id } = data[tableMeta["rowIndex"]] || {}
                    return (
                        <div className="text-center">
                            <Checkbox
                                checked={!!memberUpLevel[member_id]}
                                onChange={({ target }) => {
                                    if (target.checked) {
                                        memberUpLevel[member_id] = data[tableMeta["rowIndex"]];
                                    } else {
                                        delete memberUpLevel[member_id];
                                    }
                                    setMemberUpLevel(memberUpLevel);
                                }}
                                disabled={!is_affiliate_level_1}
                            />
                        </div>
                    );
                },
            },
        },
        configIDRowTable("affiliate_id", "/affiliate/detail/", query),
        {
            name: "full_name",
            label: "Tên đối tác",
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
                    return (
                        <div className="text-left">
                            <Link
                                to={`/affiliate/detail/${data[tableMeta["rowIndex"]].affiliate_id}`}>
                                {value}
                            </Link>
                        </div>
                    );
                },
            },
        },

        {
            name: "affiliate_type_name",
            label: "Loại",
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
                    return <div className="text-left">{value}</div>;
                },
            },
        },
        {
            name: "total_order",
            label: "Tổng số đơn hàng",
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
                    return <div className="text-center">{value ? value : 0}</div>;
                },
            },
        },
        
        {
            name: "total_commision",
            label: "Tổng hoa hồng",
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
                    return <div className="text-center">{numberFormat(value)}</div>;
                },
            },
        },
        {
            name: "registration_source",
            label: "Nguồn đăng ký",
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
                    return <div className="text-center">{value == 1 ? 'Poral' : 'Website'}</div>;
                },
            },
        },

        {
            name: "registration_date",
            label: "Ngày đăng ký",
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
                    return <div className="text-center">{value}</div>;
                },
            },
        },

        {
            name: "is_active",
            label: "Kích hoạt",
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
                    let { status_affiliate = 0 } = data[tableMeta["rowIndex"]] || {}
                    return (
                        <div className="text-center">
                            <CheckAccess permission="AFF_AFFILIATE_EDIT">
                                <Button
                                    color="primary"
                                    title="Chỉnh sửa"
                                    className="mr-1"
                                    onClick={(evt) =>
                                        handleActionItemClick(
                                            "edit",
                                            data[tableMeta["rowIndex"]].affiliate_id,
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
                                        data[tableMeta["rowIndex"]].affiliate_id,
                                        tableMeta["rowIndex"]
                                    )
                                }>
                                <i className="fa fa-info" />
                            </Button>
                        </div>
                    );
                },
            },
        },
    ]
}

export const initialValues = {
    affiliate_id: null,
    member_id: null,
    affiliate_type_id: null,
    birth_day: "",
    affiliate_leader_id: null,
    email: "",
    phone_number: "",
    full_name: "",
    address: "",
    province_id: null,
    district_id: null,
    ward_id: null,
    address: '',
    id_card: '',
    id_card_date: '',
    id_card_place: '',
    id_card_back_side: null,
    id_card_front_side: null,
    live_image: null,
    is_agree: true,
    is_active: true,
    policy_commision_apply: []
};

export const validationSchema = yup.object().shape({
    member_id: yup.number()
        .required("Họ và tên là bắt buộc.").nullable(),
    affiliate_type_id: yup.number()
        .required("Loại Affiliate là bắt buộc.")
        .nullable(),
    birth_day: yup.string()
        .required("Ngày sinh là bắt buộc.").nullable(),
    email: yup.string()
        .required("Email là bắt buộc.").nullable(),
    phone_number: yup
        .string()
        .required("Số điện thoại là bắt buộc .")
        .matches(/^[0-9]{7,10}$/, "Số điện thoại không hợp lệ.")
        .nullable(),
    ward_id: yup.number().required("Phường/ Xã là bắt buộc.").nullable(),
    province_id: yup.number().required("Tỉnh/ Thành phố là bắt buộc.").nullable(),
    district_id: yup.number().required("Quận/ Huyện là bắt buộc.").nullable(),
    address: yup.string().required("Địa chỉ là bắt buộc.").nullable(),
    id_card: yup.string().required("Số CMND/CCCD là bắt buộc.").nullable(),
    id_card_place: yup.string().required("Nơi cấp CMND/CCCD là bắt buộc.").nullable(),
    id_card_date: yup.string().required("Ngày cấp CMND/CCCD là bắt buộc.").nullable(),
    id_card_back_side: yup.string().required("Ảnh mặt sau CMND/CCCD là bắt buộc.").nullable(),
    id_card_front_side: yup.string().required("Ảnh mặt trước CMND/CCCD là bắt buộc.").nullable(),
    live_image: yup.string().required("Ảnh Live là bắt buộc.").nullable(),
    policy_commision_apply: yup.array().required('Chính sách Affiliate là bắt buộc').nullable(),
    affiliate_leader_id: yup.number().nullable()
})

export const columnsOrder = (query) => {
    return [
        configIDRowTable("order_id", "", query),
        {
            name: "order_date",
            label: "Ngày ghi nhận",
            options: {
                filter: false,
                sort: false,
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
                    return (
                        <div className="text-left">
                            {value}
                        </div>
                    );
                },
            },
        },
        {
            name: "order_no",
            label: "Mã đơn hàng",
            options: {
                filter: false,
                sort: false,
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
                    return (
                        <div className="text-center">
                            {value}
                        </div>
                    );
                },
            },
        },
        {
            name: "full_name",
            label: "Thành viên",
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
                    return (
                        <div className="text-left">
                            {value}
                        </div>
                    );
                },
            },
        },
        {
            name: "total_amount",
            label: "Giá trị đơn hàng",
            options: {
                filter: false,
                sort: false,
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
                    return (
                        <div className="text-right">
                            {numberFormat(value)}
                        </div>
                    );
                },
            },
        },
        {
            name: "total_commision",
            label: "Hoa hồng",
            options: {
                filter: false,
                sort: false,
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
                    return (
                        <div className="text-right">
                            {numberFormat(value)}
                        </div>
                    );
                },
            },
        },
        {
            name: "status",
            label: "Trạng thái đơn hàng",
            options: {
                filter: false,
                sort: false,
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
                    return (
                        <div className="text-right">
                            {value}
                        </div>
                    );
                },
            },
        },
    ]
};

export const columnsCustomer = (query) => {
    return [
        configIDRowTable("member_id", "", query),
        {
            name: "registration_date",
            label: "Thời gian đăng ký",
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
                    return (
                        <div className="text-center">
                            {value}
                        </div>
                    );
                },
            },
        },

        {
            name: "full_name",
            label: "Họ tên",
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
                    return (
                        <div className="text-left">
                            {value}
                        </div>
                    );
                },
            },
        },
        {
            name: "total_amount",
            label: "Tổng giá trị đơn hàng",
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
                    return (
                        <div className="text-right">
                            {numberFormat(value)}
                        </div>
                    );
                },
            },
        },
        {
            name: "commision_value",
            label: "Hoa hồng",
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
                    return (
                        <div className="text-right">
                            {numberFormat(value)}
                        </div>
                    );
                },
            },
        },
    ]
};

export const columnsMember = (query) => {
    return [
        configIDRowTable("member_id", "", query),
        {
            name: "registration_date",
            label: "Thời gian duyệt đăng ký",
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
                    return (
                        <div className="text-center">
                            {value}
                        </div>
                    );
                },
            },
        },

        {
            name: "full_name",
            label: "Họ tên",
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
                    return (
                        <div className="text-left">
                            {value}
                        </div>
                    );
                },
            },
        },
        {
            name: "total_amount",
            label: "Tổng giá trị đơn hàng",
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
                    return (
                        <div className="text-right">
                            {numberFormat(value)}
                        </div>
                    );
                },
            },
        },
        {
            name: "commision_value",
            label: "Hoa hồng",
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
                    return (
                        <div className="text-right">
                            {numberFormat(value)}
                        </div>
                    );
                },
            },
        },
    ]
};

export const columnAffRequest = (data, query) => {
    return [
        configIDRowTable("affiliate_request_id", "/affiliate-request/review/", query),
        {
            name: "request_no",
            label: "Mã đăng ký",
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
                    return <div className="text-center">
                        <Link
                            to={`/affiliate-request/review/${data[tableMeta["rowIndex"]].affiliate_request_id}`}>
                            {value}
                        </Link>
                    </div>;
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
                    return <div className="text-left">{value}</div>;
                },
            },
        },

        {
            name: "registration_date",
            label: "Ngày yêu cầu",
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
                    return <div className="text-center">{value}</div>;
                },
            },
        },

        {
            name: "approved_date",
            label: "Ngày xác nhận",
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
                    return <div className="text-center">{value ? value : '--/--/---- --:--:--'}</div>;
                },
            },
        },

        {
            name: "request_status",
            label: "Trạng thái",
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
                    let {result, color} = getStatus(value);
                   
                    return <div className="text-center">
                        <Badge color={color}>{result}</Badge>
                    </div>;
                },
            },
        },

        {
            name: "review_user_full_name",
            label: "Nhân viên xác nhận",
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
                    return <div className="text-center">{value ? value : '------'}</div>;
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
                    let { affiliate_request_id } = data[tableMeta["rowIndex"]] || {}
                    return (
                        <div className="text-center">
                            <CheckAccess permission="AFF_AFFILIATE_REVIEW">
                                <Button
                                    color={"success"}
                                    title="Duyệt"
                                    className="mr-1"
                                    onClick={(evt) => window._$g.rdr(`/affiliate-request/review/${affiliate_request_id}`)}>
                                    <i className="fa fa-check" />
                                </Button>
                            </CheckAccess>
                        </div>
                    );
                },
            },
        },
    ]
}

export const getStatus = status => {
    switch (status) {
        case 1:
            return {
                result: 'Yêu cầu mới',
                color: 'primary'
            }
        case 2:
            return {
                result: 'Thành công',
                color: 'success'
            }
        case 3:
            return {
                result: 'KH Huỷ yêu cầu',
                color: 'danger'
            }
        case 4:
            return {
                result: 'Huỷ yêu cầu',
                color: 'danger'
            }
        default:
            return '';
    }
}