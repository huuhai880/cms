import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { splitString } from "../../utils/index";
import './style.scss'

const regex = /(<([^>]+)>)/gi;

function InterpetSpecialChild({
    data = [],
    indexParent,
    handleSelectedChild,
    handleSelectedAllChild,
    noEdit,
    dataSelected = {},
    orderIndex
}) {

    const column = [
        {
            title: "STT",
            dataIndex: "STT",
            key: "name",
            responsive: ["md"],
            render: (text, record, index) => {
                return <div className="text-center">{indexParent}.{index + 1}</div>
            },
            width: "4%",
        },
        {
            title: "Tên luận giải",
            dataIndex: "interpret_detail_name",
            key: "interpret_detail_name",
            responsive: ["md"],
            width: "35%",
            render: (text, record, index) => {
                return (
                    <div className="text-left">
                        {text}
                    </div>
                );
            },
        },
        {
            title: "Vị trí hiển thị",
            dataIndex: "order_index",
            key: "order_index",
            responsive: ["md"],
            width: "8%",
            render: (text, record, index) => {
                return <div className="text-center">{text}</div>;
            },
        },
        {
            title: "Tóm tắt",
            dataIndex: "short_content",
            key: "short_content",
            responsive: ["md"],

            render: (text, record, index) => {
                let value = text ? text.replace(regex, "") : "";
                value = splitString(value, 80);
                return value;
            },
        }
    ];


    const rowSelection = {
        onSelect: (record, selected) => {
            handleSelectedChild(record, selected, orderIndex)
        },
        onSelectAll: (selected, selectedRows) => {
            let { interpret_id = 0 } = data[0] || {}
            handleSelectedAllChild(selected, interpret_id, data, orderIndex)
        },
        getCheckboxProps: () => ({
            disabled: noEdit,
        }),
    };

    const getSelectedRowKeys = () => {
        let { interpret_details = {} } = dataSelected || {}
        let _rowKeys = Object.keys(interpret_details).filter(key => interpret_details[key].is_selected).map(p => parseInt(p))
        return _rowKeys;
    }

    return (
        <Table
            columns={column}
            dataSource={data}
            pagination={false}
            bordered={true}
            rowKey={"interpret_detail_id"}
            rowSelection={{
                selectedRowKeys: getSelectedRowKeys(),
                ...rowSelection,
            }}
            className="tb-special"
        />
    );
}

export default InterpetSpecialChild;