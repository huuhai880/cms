import React from 'react'
import { configIDRowTable, numberFormat } from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button } from "reactstrap";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { Checkbox } from "antd";

export const getColumnTable = (data, query, handleActionItemClick) => {
    return [
        // configIDRowTable("page_id", "/page/detail/", query),
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
                            className="MuiTableCell-root MuiTableCell-head"
                        >
                            <div className="text-center">{columnMeta.label}</div>
                        </th>
                    );
                },
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="text-center">
                            <Checkbox
                                checked={false}
                                onChange={({ target }) => {
                                    // if (target.checked) {
                                    //     pickItems[item.product_id] = item;
                                    // } else {
                                    //     delete pickItems[item.product_id];
                                    // }
                                    // setPickItem(pickItems);
                                }}
                            />
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
                                to={`/page/detail/${data[tableMeta["rowIndex"]].member_id
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
            name: "policy_commision_name",
            label: "Chính sách áp dụng",
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
                        <Link
                            to={`/policy-commision/detail/${data[tableMeta["rowIndex"]].policy_commision_id
                                }`}
                        >
                            {value}
                        </Link>
                    </div>;
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
                    return <div className="text-center">{value}</div>;
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
                    return <div className="text-center">{numberFormat(value)} đ</div>;
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
                    return <div className="text-center">{value}</div>;
                },
            },
        },

        {
            name: "status",
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
                    let result = ''
                    return <div className="text-center">{numberFormat(value)} đ</div>;
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
                    return <div className="text-center">{numberFormat(value)} đ</div>;
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
                    return <div className="text-center">{numberFormat(value)} đ</div>;
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
                    return (
                        <div className="text-center">
                            <CheckAccess permission="AFF_AFFILIATE_REVIEW">
                                <Button
                                    color={"success"}
                                    title="Duyệt"
                                    className="mr-1"
                                    onClick={(evt) => handleActionItemClick(
                                        "review",
                                        data[tableMeta["rowIndex"]].member_id,
                                        tableMeta["rowIndex"]
                                    )}>
                                    <i className="fa fa-check" />
                                </Button>
                            </CheckAccess>

                            <CheckAccess permission="AFF_AFFILIATE_EDIT">
                                <Button
                                    color="primary"
                                    title="Chỉnh sửa"
                                    className="mr-1"
                                    onClick={(evt) =>
                                        handleActionItemClick(
                                            "edit",
                                            data[tableMeta["rowIndex"]].member_id,
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
                                        data[tableMeta["rowIndex"]].member_id,
                                        tableMeta["rowIndex"]
                                    )
                                }>
                                <i className="fa fa-info" />
                            </Button>

                            <CheckAccess permission="AFF_AFFILIATE_DEL">
                                <Button
                                    color="danger"
                                    title="Xóa"
                                    className=""
                                    onClick={(evt) =>
                                        handleActionItemClick(
                                            "delete",
                                            data[tableMeta["rowIndex"]].member_id,
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
    member_id: null,
    affiliate_type_id: null,
    status: null,
    birth_day: "",
    aff_leader_id: null,
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
    id_card_plate: '',
    id_card_back_side: null,
    id_card_front_side: null,
    live_image: null,
    is_agree: true,
    is_active: true
};

export const validationSchema = yup.object().shape({
    member_id: yup.number()
        .required("Họ và tên là bắt buộc.").nullable(),
    affiliate_type_id: yup.number()
        .required("Loại Affiliate là bắt buộc.")
        .nullable(),
    birth_day: yup.string()
        .required("Ngày sinh là bắt buộc."),
    email: yup.string()
        .required("Email là bắt buộc."),
    phone_number: yup
        .string()
        .required("Số điện thoại là bắt buộc .")
        .matches(/^[0-9]{7,10}$/, "Số điện thoại không hợp lệ.")
        .nullable(),
    ward_id: yup.number().required("Phường/ Xã là bắt buộc.").nullable(),
    province_id: yup.number().required("Tỉnh/ Thành phố là bắt buộc.").nullable(),
    district_id: yup.number().required("Quận/ Huyện là bắt buộc.").nullable(),
    address: yup.string()
        .required("Địa chỉ là bắt buộc."),

    id_card: yup.string().required("Số CMND/CCCD là bắt buộc.").nullable(),
    id_card_place: yup.string().required("Nơi cấp CMND/CCCD  là bắt buộc.").nullable(),
    id_card_date: yup.string().required("Ngày cấp CMND/CCCD  là bắt buộc.").nullable(),

    id_card_back_side: yup.string().required("Ảnh mặt sau CMND/CCCD là bắt buộc.").nullable(),
    id_card_front_side: yup.string().required("Ảnh mặt trước CMND/CCCD là bắt buộc.").nullable(),
    live_image: yup.string().required("Ảnh Live là bắt buộc.").nullable(),
})