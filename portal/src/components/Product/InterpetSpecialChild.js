import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { splitString } from "../../utils/index";
import './style.scss'

const regex = /(<([^>]+)>)/gi;

function InterpetSpecialChild({
    data = [],
    indexParent,
    selectedParent,
    handleSelectedChild,
    handleSelectedAllChild,
    noEdit,
    dataUpdate = {}
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
            let index = data.findIndex(p => p.interpret_detail_id == record.interpret_detail_id);
            handleSelectedChild(record, selected, index)
        },
        onSelectAll: (selected, selectedRows) => {
            let { interpret_id = 0 } = data[0] || {}
            handleSelectedAllChild(selected, interpret_id)
        },
        getCheckboxProps: () => ({
            disabled: noEdit,
        }),
    };

    const getSelectedRowKeys = () => {
        let { interpret_details = [] } = dataUpdate || {}
        return interpret_details.filter(p => p.is_selected).map(x => x.interpret_detail_id);
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