import React from "react";
import {
    Button,
    Input
} from "reactstrap";
import "./style.scss";
import Select from "react-select";
import { Checkbox } from "antd";
import { convertValue } from "utils/html";
export const columns_product_page = (noEdit, deleteItemPage, optionPageProductGroup, handleChangeProductPageGroup) => [

    {
        title: 'STT',
        dataIndex: 'key',
        key: 'key',
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
        title: 'Tên page',
        dataIndex: '',
        key: 'x',
        render: (text, record, index) => {
            return (
                <Select
                    className="MuiPaper-filter__custom--select"
                    id={`attribute_group_id_${record.product_page_id}`}
                    name={`attribute_group_id_${record.title_page}`}
                    onChange={(value) => handleChangeProductPageGroup(value, record, index)}
                    isSearchable={true}
                    placeholder={"-- Chọn chỉ số --"}
                    value={convertValue(record.product_page_id, optionPageProductGroup() || [])}
                    options={optionPageProductGroup()}
                    isDisabled={noEdit}
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={document.querySelector("body")}
                />
            )
        }
    },
    {
        title: 'Thao tác',
        dataIndex: '',
        key: 'x',
        width: 150,
        render: (text, record, index) => {
            return (
                <div style={{
                    display: "flex",
                    justifyContent: "center"
                }}>

                    <Button
                        color="danger"
                        className="btn-sm ml-2"
                        type="button"
                        disabled={noEdit}
                        onClick={() => deleteItemPage(index)}
                    >
                        <i className="fa fa-trash" />
                    </Button>
                </div>
            )
        },

    },

]
export const columns_page_child = (parent_key,
    handleDeleteChildAttributeProduct,
    setShowProductConfig,
    noEdit,
    optionAttributesGroupProductPage,
    handleChangeAttributesPageProduct,
    setNamePageProduct,
    changeShowIndex
) => [
        {
            title: 'STT',
            dataIndex: 'key',
            key: 'key',
            width: 80,
            render: (text, record, index) => {
                return (
                    <div style={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <span>
                            {(parent_key + 1) + '.' + (index + 1)}
                        </span>
                    </div>
                )
            },
        },
        {
            title: 'Chỉ số',
            dataIndex: '',
            key: 'x',
            render: (text, record, index) => {
                return (
                    <Select
                        className="MuiPaper-filter__custom--select"
                        id={`attribute_group_id_${record.attributes_group_id}`}
                        name={`attribute_group_id_${record.attributes_group_id}`}
                        isSearchable={true}
                        placeholder={"-- Chọn Thuộc tính --"}
                        onChange={(value) => handleChangeAttributesPageProduct(value, record, index, parent_key)}
                        value={convertValue(record.attributes_group_id, optionAttributesGroupProductPage || [])}
                        options={optionAttributesGroupProductPage}
                        isDisabled={noEdit}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={document.querySelector("body")}
                    />
                )
            },
        },
        {
            title: 'Nội dung',
            dataIndex: '',
            key: 'x',
            width: 100,
            render: (text, record, index) => {
                return (
                    <div style={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <Button
                            disabled={record.attributes_group_id == null}
                            color="primary"
                            className="btn-sm"
                            type="button"
                            onClick={() => {
                                setShowProductConfig(record.data_interpret, index, parent_key);

                            }}
                        >
                            <i className="fa fa-cog"></i>
                        </Button>
                    </div>
                )
            }
        },
        {
            title: 'Thứ tự hiển thị',
            dataIndex: 'show_index',
            key: 'show_index',
            width: 140,
            render: (showIndex, record, index) => {

                return (
                    <div className="hide_araw"
                     style={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <Input
                            type="number"
                            name="url"
                            className={'text-center'}
                            disabled={noEdit}
                            readOnly={record.isEdit}
                            value={showIndex}
                            placeholder="Thứ tự"
                            onChange={(e) => changeShowIndex(e.target.value, parent_key, index)}
                        />
                    </div>
                )
            },
        },
        {
            title: 'Thao tác',
            dataIndex: '',
            key: 'x',
            width: 150,
            render: (text, record, index) => {
                return (
                    <div style={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <Button
                            disabled={noEdit}
                            color="danger"
                            className="btn-sm ml-2"
                            type="button"
                            onClick={() => handleDeleteChildAttributeProduct(index, parent_key)}
                        >
                            <i className="fa fa-trash" />
                        </Button>
                    </div>
                )
            },

        },
    ];

export const columns_child_page_select = () => [
    {
        title: 'STT',
        dataIndex: '',
        key: 'x',
        width: 80,
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
        title: 'Tên thuộc tính',
        dataIndex: 'attributes_name',
        key: 'attributes_name',
        width: '40%',
        render: (attributes_name) => {
            return (
                <div>
                    <span>
                        {attributes_name}
                    </span>
                </div>
            )
        },
    },

    {
        title: 'Luận giải chi tiết',
        dataIndex: 'interpret_detail_name',
        key: 'interpret_detail_name',
        render: (interpret_detail_name) => {
            return (
                <div >
                    <span>
                        {interpret_detail_name}
                    </span>
                </div>
            )
        },
    },
]

export const columns_page_selected = (un_selected, changeRowIndexSelect,noEdit) => [
    {
        title: 'STT',
        dataIndex: '',
        key: 'x',
        width: 80,
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
        title: 'Tên thuộc tính',
        dataIndex: 'attributes_name',
        key: 'attributes_name',
        render: (attributes_name) => {
            return (
                <div>
                    <span>
                        {attributes_name}
                    </span>
                </div>
            )
        },
    },

    {
        title: 'Luận giải chi tiết',
        dataIndex: 'interpret_detail_name',
        key: 'interpret_detail_name',
        render: (interpret_detail_name) => {
            return (
                <div>
                    <span>
                        {interpret_detail_name}
                    </span>
                </div>
            )
        },
    },
    {
        title: 'Thứ tự hiển thị',
        dataIndex: 'showIndex',
        key: 'showIndex',
        width: 140,
        render: (showIndex, record, index) => {
            return (
                <div
                    className="hide_araw"
                    style={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                    <Input
                        disabled={noEdit}
                        type="number"
                        name="url"
                        className={'text-center'}
                        readOnly={record.isEdit}
                        onChange={(e) => changeRowIndexSelect(index, e.target.value)}
                        value={showIndex}
                        placeholder="Thứ tự"
                    />
                </div>
            )
        },
    },
    {
        title: 'Thao tác',
        dataIndex: '',
        key: 'x',
        width: 140,
        render: (text, record) => {
            return (
                <div style={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <Button
                        disabled={noEdit}
                        color="danger"
                        className="btn-sm ml-2"
                        type="button"
                        onClick={() => un_selected(record)}
                    >
                        <i className="fa fa-trash" />
                    </Button>
                </div>
            )
        },
    },

]
