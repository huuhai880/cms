import React from 'react';
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    Col,
    Input,
    FormGroup,
    Button,
} from "reactstrap";

import { CheckAccess } from "../../navigation/VerifyAccess";
import { configTableOptions, splitString } from "../../utils/index";
const regex = /(<([^>]+)>)/gi;

function TableInterPretChild({ data = [], indexParent }) {

    const columns = [
        {
            title: "STT",
            dataIndex: "STT",
            key: "STT",
            render: (text, record, index) => {
                return <div className="text-center">{indexParent}.{index + 1}</div>;
            },
            width: "5%",
        },
        {
            title: "Tên luận giải chi tiết",
            key: "interpret_detail_name",
            dataIndex: "interpret_detail_name",
            width: "15%",
        },
        {
            title: "Luận giải phụ thuộc",
            dataIndex: "parent_interpret_detail_name",
            key: "parent_interpret_detail_name",
            width: "15%",
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
            title: "Mô tả ngắn",
            dataIndex: "interpret_detail_short_content",
            key: "interpret_detail_short_content",
            responsive: ["md"],
            render: (text, record, index) => {
                let value = text.replace(regex, "");
                value = splitString(value, 50);
                return value;
              },
            
        },

        {
            title: "Kich hoạt",
            dataIndex: "is_active",
            width: "8%",
            key: "is_active",
            responsive: ["md"],
            render: (text, record, index) => (
                <div className="text-center">{record.is_active ? "Có" : "Không"}</div>
            ),
        },

        {
            title: "Thao tác",
            dataIndex: "",
            key: "x",
            width: "8%",
            render: (text, record, index) => {
                return (
                    <div className="text-center">
                        <CheckAccess permission="FOR_INTERPRET_EDIT">
                            <Button
                                color={"primary"}
                                title="Duyệt"
                                className="mr-1"
                                onClick={(evt) => {
                                    window._$g.rdr(`/interpret/edit/${record["interpret_id"]}`);
                                }}
                            >
                                <i className="fa fa-edit" />
                            </Button>
                        </CheckAccess>

                        <CheckAccess permission="FOR_INTERPRET_DEL">
                            <Button
                                color="danger"
                                title="Xóa"
                                className=""
                                onClick={() => { }}
                            >
                                <i className="fa fa-trash" />
                            </Button>
                        </CheckAccess>
                    </div>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered={true}
        />
    );
}

export default TableInterPretChild;