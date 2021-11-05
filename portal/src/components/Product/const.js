import { splitString } from "../../utils/index";

import React from "react";
import { Checkbox } from "antd";
import { Link } from "react-router-dom";
import { Button, Input } from "reactstrap";
const regex = /(<([^>]+)>)/gi;
export const column = (handleChangeInterpretConfig, handleChangeInterpretChildByInterpert,noEdit) => {
  return [
    {
      title: "STT",
      dataIndex: "STT",
      key: "name",
      responsive: ["md"],
      render: (text, record, index) => {
        return (
          <Link to={`/interpret/detail/${record["interpret_id"]}`} target={"_self"}>
            <div className="text-center">{index + 1}</div>
          </Link>
        );
      },
      width: "4%",
    },
    {
      title: "Tên thuộc tính",
      dataIndex: "attribute_name",
      key: "attribute_name",
      responsive: ["md"],
      width: "15%",
      render: (text, record, index) => {
        // console.log(record)
        return (
          <div className="text-left">
            <a target="_blank" href={`/portal/interpret/detail/${record.interpret_id}`}>
              {record.is_interpretspectial == 1 ? record.attributes_name : record.attribute_name}
            </a>
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
      dataIndex: "brief_desc",
      key: "brief_desc",
      responsive: ["md"],
      render: (text, record, index) => {
        let value = text ? text.replace(regex, "") : "";
        value = splitString(value, 80);
        return value;
      },
    },

    {
      title: "Hiển thị tra cứu",
      dataIndex: "is_show_search_result",
      width: "10%",
      key: "is_show_search_result",
      responsive: ["md"],
      render: (text, record, index) => (
        <div className="text-center">
          <Checkbox
            checked={record.is_show_search_result || false}
            disabled={noEdit}
            onChange={({ target }) =>
              handleChangeInterpretConfig("is_show_search_result", target.checked, index)
            }
          />
        </div>
      ),
    },
    {
      title: "Text Link",
      dataIndex: "text_url",
      width: "15%",
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
              handleChangeInterpretConfig("text_url", target.value, index);
            }}
          />
        </div>
      ),
    },
    {
      title: "Link",
      dataIndex: "url",
      width: "15%",
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
              handleChangeInterpretConfig("url", target.value, index);
            }}
          />
        </div>
      ),
    },
    // {
    //   title: "Thao tác",
    //   dataIndex: "is_selected",
    //   key: "is_selected",
    //   width: "8%",
    //   responsive: ["md"],
    //   render: (text, record, index) => (
    //     <div className="text-center">
    //       <Checkbox
    //         checked={record.is_selected || false}
    //         onChange={({ target }) => {
    //           handleChangeInterpretConfig("is_selected", target.checked, index);
    //           handleChangeInterpretChildByInterpert(target.checked, index);
    //           // console.log()
    //         }}
    //       />
    //     </div>
    //   ),
    // },
  ];
};
