import React from 'react'
import { configIDRowTable, numberFormat } from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button, Badge } from "reactstrap";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { Checkbox } from "antd";
import moment from 'moment';
import Select from "react-select";
import { convertValue } from 'utils/html';

export const getColumnTable = (data, query, handleActionItemClick) => {
    return [
        configIDRowTable("affiliate_id", "/affiliate/detail/", query),
        {
            name: "policy_commision_name",
            label: "Tên chính sách",
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
                                to={`/policy-commision/detail/${data[tableMeta["rowIndex"]].policy_commision_id}`}>
                                {value}
                            </Link>
                        </div>
                    );
                },
            },
        },

        {
            name: "affiliate_type_name",
            label: "Loại Affiliate áp dụng",
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
            name: "#",
            label: "Thời gian đăng ký",
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
                    let { is_limited_time = false, start_date_register = null, end_date_register } = data[tableMeta["rowIndex"]] || {}
                    return <div className="text-center">
                        {
                            is_limited_time ? `${start_date_register ? start_date_register : '--/--/----'} - ${end_date_register ? end_date_register : '--/--/----'}` : 'Không giới hạn'
                        }
                    </div>;
                },
            },
        },

        {
            name: "is_default",
            label: "Mặc định",
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
                    return <div className="text-center">{value ? 'Có' : 'Không'}</div>;
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
                            <CheckAccess permission="AFF_POLICYCOMMISION_EDIT">
                                <Button
                                    color="primary"
                                    title="Chỉnh sửa"
                                    className="mr-1"
                                    onClick={(evt) =>
                                        handleActionItemClick(
                                            "edit",
                                            data[tableMeta["rowIndex"]].policy_commision_id,
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
                                        data[tableMeta["rowIndex"]].policy_commision_id,
                                        tableMeta["rowIndex"]
                                    )
                                }>
                                <i className="fa fa-info" />
                            </Button>

                            <CheckAccess permission="AFF_POLICYCOMMISION_DEL">
                                <Button
                                    color="danger"
                                    title="Xóa"
                                    className=""
                                    onClick={(evt) =>
                                        handleActionItemClick(
                                            "delete",
                                            data[tableMeta["rowIndex"]].policy_commision_id,
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
    policy_commision_id: null,
    policy_commision_name: null,
    affiliate_type_id: null,
    description: '',
    is_limited_time: false, //false: Khong gioi han, true: gioi han
    start_date_register: null,
    end_date_register: null,
    is_active: true,
    is_default: false,
    policy_commision_detail: []
};

export const validationSchema = yup.object().shape({
    policy_commision_name: yup.string()
        .required("Tên chính sách là bắt buộc.")
        .nullable(),
    affiliate_type_id: yup.number()
        .required("Loại Affiliate là bắt buộc.")
        .nullable(),

    policy_commision_detail: yup.array()
        .test("policy_commision_detail", null, (arr) => {

            //Check có chọn điều kiện hay chưa
            const checkConditionId = arr.findIndex((item, index) => {
                return item.condition_id == null;
            });
            if (checkConditionId !== -1) {
                return new yup.ValidationError("Điều kiện đạt là bắt buộc.", null, "policy_commision_detail");
            }

            //Check có nhập giá trị của điều kiện hoặc % chiết khấu
            let _find = arr.find(p => p.data_child.length == 0);
            if (_find) {
                let { condition_name = '' } = _find || {}
                return new yup.ValidationError("Chi tiết điều kiện " + condition_name + " là bắt buộc.", null, "policy_commision_detail");
            }

            let _findIndexNotValue = arr.findIndex(p => {
                return p.data_child.findIndex(child => !child.from_value || !child.to_value || !child.comission_value) != -1
            });

            if (_findIndexNotValue != -1) {
                return new yup.ValidationError("Chi tiết điều kiện đạt là bắt buộc.", null, "policy_commision_detail");
            }
        })
        .required('Chiết khấu là bắt buộc.').nullable(),
    start_date_register: yup.string().nullable()
        .when("is_limited_time", {
            is: true,
            then: yup.string()
                .test(
                    'start_date_register',
                    'Thời gian áp dụng từ ngày không được lớn hơn đến ngày',
                    function (value) {
                        let __to_date = this.options.parent.end_date_register;
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

export const columnsPolicyCommisionDetail = (noEdit, deleteCondition, getOptionConditions, handleChangeCondition) => [
    {
        title: 'STT',
        dataIndex: 'x',
        key: 'x',
        width: 100,
        render: (text, record, index) => {
            return (
                <div style={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <span>
                        {index + 1}
                    </span>
                </div>
            )
        },
    },
    {
        title: 'Điều kiện đạt',
        dataIndex: 'x',
        key: 'x',
        render: (text, record, index) => {
            return (
                <Select
                    className="MuiPaper-filter__custom--select"
                    id={`condtion_id_${record.condition_id}_${index}`}
                    name={`condtion_id_${record.condition_id}_${index}`}
                    onChange={(value) => handleChangeCondition(value, record, index)}
                    isSearchable={true}
                    placeholder={"-- Chọn điều kiện đạt --"}
                    value={convertValue(record.condition_id, getOptionConditions() || [])}
                    options={getOptionConditions()}
                    isDisabled={noEdit}
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={document.querySelector("body")}
                />
            )
        }
    },



]
