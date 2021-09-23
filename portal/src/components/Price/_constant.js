import React from 'react'
import { configIDRowTable, numberFormat } from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button } from "reactstrap";
import * as yup from "yup";
import moment from 'moment';

import { Link } from "react-router-dom";

export const getColumnTable = (data, query, handleActionItemClick) => {
    return [
        configIDRowTable("price_id", "/price/detail/", query),
        {
            name: "price_display_name",
            label: "Tên Sản phẩm/Combo",
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
                        <div>
                            <Link
                                to={`/price/detail/${data[tableMeta["rowIndex"]].price_id
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
            name: "price",
            label: "Giá niêm yết",
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
                customBodyRender: (value, tableMeta, updateValue) => {
                    return <div className="text-right">{numberFormat(value)}</div>;
                },
            },
        },

        // {
        //     name: "is_apply_promotion",
        //     label: "Áp dụng khuyến mãi",
        //     options: {
        //         filter: false,
        //         sort: false,
        //         customHeadRender: (columnMeta, handleToggleColumn) => {
        //             return (
        //                 <th
        //                     key={`head-th-${columnMeta.label}`}
        //                     className="MuiTableCell-root MuiTableCell-head"
        //                 >
        //                     <div className="text-center">{columnMeta.label}</div>
        //                 </th>
        //             );
        //         },
        //         customBodyRender: (value, tableMeta, updateValue) => {
        //             return <div className="text-center">{value ? "Có" : "Không"}</div>;
        //         },
        //     },
        // },

        {
            name: "new_sale_price",
            label: "Giá bán",
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
                    return <div className="text-right">{numberFormat(value)}</div>;
                },
            },
        },

        {
            name: "time_apply_price_new",
            label: "Thời gian áp dụng",
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
                    return <div className="text-center">{value}</div>;
                },
            },
        },

        // {
        //     name: "is_apply_combo",
        //     label: "Áp dụng Combo",
        //     options: {
        //         filter: false,
        //         sort: false,
        //         customHeadRender: (columnMeta, handleToggleColumn) => {
        //             return (
        //                 <th
        //                     key={`head-th-${columnMeta.label}`}
        //                     className="MuiTableCell-root MuiTableCell-head"
        //                 >
        //                     <div className="text-center">{columnMeta.label}</div>
        //                 </th>
        //             );
        //         },
        //         customBodyRender: (value, tableMeta, updateValue) => {
        //             return <div className="text-center">{value ? "Có" : "Không"}</div>;
        //         },
        //     },
        // },

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
                            <CheckAccess permission="SL_PRICE_EDIT">
                                <Button
                                    color="primary"
                                    title="Chỉnh sửa"
                                    className="mr-1"
                                    onClick={(evt) =>
                                        handleActionItemClick(
                                            "edit",
                                            data[tableMeta["rowIndex"]].price_id,
                                            tableMeta["rowIndex"]
                                        )
                                    }
                                >
                                    <i className="fa fa-edit" />
                                </Button>
                            </CheckAccess>

                            <CheckAccess permission="SL_PRICE_DEL">
                                <Button
                                    color="danger"
                                    title="Xóa"
                                    className=""
                                    onClick={(evt) =>
                                        handleActionItemClick(
                                            "delete",
                                            data[tableMeta["rowIndex"]].price_id,
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
    is_apply_combo: false,
    is_apply_promotion: false,
    is_apply_customer_type: false,
    is_percent: false,
    discount_value: null,
    products: [],
    combos: [],
    customer_types: [],
    price: 0,
    is_active: true,
    from_date: null,
    to_date: null
}

export const validationSchema = (is_combo = false) => {
    return yup.object().shape({
        price: yup.number().nullable()
            .test(
                'price',
                `Giá ${is_combo ? 'combo' : 'sản phẩm'} là bắt buộc`,
                function (value) {
                    if (value < 0) {
                        return false //Loi
                    }
                    return true;
                }
            )
            .required(`Giá ${is_combo ? 'combo' : 'sản phẩm'} là bắt buộc`,),

        discount_value: yup
            .number()
            .nullable()
            .when("is_apply_promotion", {
                is: true,
                then: yup.number()
                    .test(
                        'discount_value',
                        `Giá bán mới không được lớn hơn giá ${is_combo ? 'combo' : 'sản phẩm'}`,
                        function (value) {
                            let _price = this.options.parent.price;
                            if (value > _price) {
                                return false;
                            }
                            return true;
                        }
                    )
                    .required("Giá bán mới là bắt buộc")
            }),
        products: yup.array().nullable()
            .when("is_apply_combo", {
                is: false,
                then: yup.array().required("Sản phẩm làm giá là bắt buộc")
            }),
        combos: yup.array().nullable()
            .when("is_apply_combo", {
                is: true,
                then: yup.array().required("Combo làm giá là bắt buộc")
            }),
        // customer_types: yup.array().nullable()
        //     .when("is_apply_customer_type", {
        //         is: true,
        //         then: yup.array()
        //             .test(
        //                 'customer_types',
        //                 'Vui lòng chọn loại áp dụng cho loại khách hàng',
        //                 function (value) {
        //                     let check = (value || []).filter(p => !p.is_apply_promotion && !p.is_apply_price)
        //                     if (check.length > 0) {
        //                         return false //Loi
        //                     }
        //                     return true;
        //                 }
        //             )
        //             .required("Loại khách hàng áp dụng là bắt buộc")
        //     }),
        from_date: yup.string().nullable()
            .when("is_apply_promotion", {
                is: true,
                then: yup.string()
                    .test(
                        'from_date',
                        'Thời gian áp dụng từ ngày không được lớn hơn đến ngày',
                        function (value) {
                            let __to_date = this.options.parent.to_date;
                            if (value && __to_date) {
                                let _from_date = moment(value, 'DD/MM/YYYY');
                                let _to_date = moment(__to_date, 'DD/MM/YYYY');
                                return !(_from_date > _to_date)
                            }
                            return true;
                        }
                    )
                    .required("Thời gian áp dụng là bắt buộc")
            }),
    })
}


export const validationSchemaUpdate = (is_combo = false) => {
    return yup.object().shape({
        price: yup.number().nullable()
            .test(
                'price',
                `Giá ${is_combo ? 'combo' : 'sản phẩm'} là bắt buộc`,
                function (value) {
                    if (value < 0) {
                        return false //Loi
                    }
                    return true;
                }
            )
            .required(`Giá ${is_combo ? 'combo' : 'sản phẩm'} là bắt buộc`,),
        discount_value: yup
            .number()
            .nullable()
            .when("is_apply_promotion", {
                is: true,
                then: yup.number()
                    .test(
                        'discount_value',
                        `Giá bán mới không được lớn hơn giá ${is_combo ? 'combo' : 'sản phẩm'}`,
                        function (value) {
                            let _price = this.options.parent.price;
                            if (value > _price) {
                                return false;
                            }
                            return true;
                        }
                    )
                    .required("Giá bán mới là bắt buộc")
            }),
        from_date: yup.string().nullable()
            .when("is_apply_promotion", {
                is: true,
                then: yup.string()
                    .test(
                        'from_date',
                        'Thời gian áp dụng từ ngày không được lớn hơn đến ngày',
                        function (value) {
                            let __to_date = this.options.parent.to_date;
                            if (value && __to_date) {
                                let _from_date = moment(value, 'DD/MM/YYYY');
                                let _to_date = moment(__to_date, 'DD/MM/YYYY');
                                return !(_from_date > _to_date)
                            }
                            return true;
                        }
                    )
                    .required("Thời gian áp dụng là bắt buộc")
            }),
    })
}

export const initialValuesUpdate = {
    is_apply_combo: false,
    is_apply_promotion: false,
    is_apply_customer_type: false,
    is_percent: false,
    discount_value: null,
    customer_types: [],
    price: 0,
    is_active: true,
    from_date: null,
    to_date: null,
    product_id: null,
    product_name: '',
    combo_id: null,
    combo_name: ''
}