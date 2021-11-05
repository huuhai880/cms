import React, { useState, useEffect } from "react";
import { Table, Badge, Menu, Dropdown, Space } from "antd";
import { Alert, Card, CardBody, CardHeader, Col, Input, FormGroup, Button } from "reactstrap";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { configTableOptions, splitString } from "../../utils/index";
import { Link } from "react-router-dom";
import { Label } from "reactstrap";
import { Checkbox } from "antd";

const regex = /(<([^>]+)>)/gi;

function InterpretTableChild({
  noEdit,
  data = [],
  indexParent,
  handleChangeInterpretChildConfig,
  indexInterPret,
  selectedParent,
}) {
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
      title: "Hiển thị tra cứu",
      dataIndex: "is_show_search_result",
      width: "12%",
      key: "is_show_search_result",
      responsive: ["md"],
      render: (text, record, index) => (
        <div className="text-center">
          <Checkbox
            checked={record.is_show_search_result || false}
            disabled={noEdit}
            onChange={({ target }) =>
              handleChangeInterpretChildConfig(
                "is_show_search_result",
                target.checked,
                index,
                indexInterPret
              )
            }
          />
        </div>
      ),
    },
    {
      title: "Text Link",
      dataIndex: "text_url",
      width: "10%",
      key: "text_url",
      responsive: ["md"],
      render: (text, record, index) => (
        <div className="text-left">
          <Input
            type="text"
            placeholder="Text Link"
            name="text_url"
            value={record.text_url || ""}
            disabled={record.is_show_search_result}
            onChange={({ target }) => {
              handleChangeInterpretChildConfig("text_url", target.value, index, indexInterPret);
            }}
          />
        </div>
      ),
    },
    {
      title: "Link",
      dataIndex: "url",
      width: "10%",
      key: "url",
      responsive: ["md"],
      render: (text, record, index) => (
        <div className="text-left">
          <Input
            type="text"
            placeholder="Link"
            name="url"
            value={record.url || ""}
            disabled={record.is_show_search_result}
            onChange={({ target }) => {
              handleChangeInterpretChildConfig("url", target.value, index, indexInterPret);
            }}
          />
        </div>
      ),
    },
    // {
    //   title: "Thao tác",
    //   dataIndex: "is_selected",
    //   key: "is_selected",
    //   width: "6%",
    //   responsive: ["md"],
    //   render: (text, record, index) => (
    //     <div className="text-center">
    //       <Checkbox
    //         checked={record.is_selected || false}
    //         onChange={({ target }) =>
    //           handleChangeInterpretChildConfig("is_selected", target.checked, index, indexInterPret)
    //         }
    //       />
    //     </div>
    //   ),
    // },
  ];
  const selectedRowKeys = () => {
    const select_key = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.is_selected == true) {
        select_key.push(element.interpret_detail_id);
      }
    }
    return select_key;
  };
  const rowSelection = {
    onSelect: (record, selected) => {
      const index_select = data.findIndex(
        (item) => item.interpret_detail_id === record.interpret_detail_id
      );
      handleChangeInterpretChildConfig("is_selected", selected, index_select, indexInterPret);
    },
    onSelectAll: (selected) => {
      data.map((item, index) => {
        handleChangeInterpretChildConfig("is_selected", selected, index, indexInterPret);
      });
    },
    getCheckboxProps: () => ({
      disabled: !selectedParent||noEdit,
    }),
  };
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      bordered={true}
      rowKey={"interpret_detail_id"}
      rowSelection={{
        selectedRowKeys: selectedRowKeys(),
        hideSelectAll:noEdit,
        ...rowSelection,
      }}
    />
  );
}

export default InterpretTableChild;
