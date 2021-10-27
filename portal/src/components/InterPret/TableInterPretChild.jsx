import React, { useState, useEffect } from "react";
import { Table, Badge, Menu, Dropdown, Space } from "antd";
import { Alert, Card, CardBody, CardHeader, Col, Input, FormGroup, Button } from "reactstrap";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { configTableOptions, splitString } from "../../utils/index";
import { Link } from "react-router-dom";
import { Label } from "reactstrap";

const regex = /(<([^>]+)>)/gi;

function TableInterPretChild({ data = [], indexParent, handleDelInterpretDetail }) {
  const [dataInterpret, setDataInterpret] = useState(["1"]);

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (text, record, index) => {
        return (
          <Link to={`/interpret/d-detail/${record["interpret_detail_id"]}`} target={"_self"}>
            <div className="text-center">
              {indexParent}.{index + 1}
            </div>
          </Link>
        );
      },
      width: "4%",
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
        let value = text ? text.replace(regex, "") : null;
        if (value) {
          value = splitString(value, 50);
        }
        return value;
      },
    },

    {
      title: "Kich hoạt",
      dataIndex: "is_active",
      width: "15%",
      key: "is_active",
      responsive: ["md"],
      filters: [
        {
          text: "Có",
          value: "1",
        },
        {
          text: "Không",
          value: "0",
        },
      ],
      // filteredValue: dataInterpret,
      render: (text, record, index) => {
        // console.log(reco)
        return <div className="text-center">{record.is_active ? "Có" : "Không"}</div>;
      },
      onFilter: (value, record) => {
        return record.is_active == value;
      },
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
                title="Chỉnh sửa"
                className="mr-1"
                onClick={(evt) => {
                  window._$g.rdr(`/interpret/d-edit/${record["interpret_detail_id"]}`);
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
                onClick={() => handleDelInterpretDetail(record["interpret_detail_id"])}
              >
                <i className="fa fa-trash" />
              </Button>
            </CheckAccess>
          </div>
        );
      },
    },
  ];
  const handleChange = (filters) => {
    console.log(filters);
  };
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      bordered={true}
      onChange={handleChange}
      // filters={filters}
    />
  );
}

export default TableInterPretChild;
