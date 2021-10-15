import {
  configTableOptions,
  configIDRowTable,
  numberFormat,
  getPropsConfigTable,
  splitString,
} from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import React from "react";
import { Button } from "reactstrap";
import { Checkbox } from "antd";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import * as yup from "yup";
import { Link } from "react-router-dom";

const regex = /(<([^>]+)>)/gi;

export const initialValues = {
  interpret_id: "",
  relationship_id: "",
  mainnumber_id: "",
  compare_mainnumber_id: "",
  attribute_id: "",
  attribute_list: [],

  is_active: 1,
  is_master: "",
  decs: "",
  brief_decs: "",
  note: "",
  order_index: "",
  is_for_power_diagram: false,
  compare_attribute_id: null,
  is_interpretspectial: 0,
};

export const validationSchema = (is_for_power_diagram = false, is_interpretspectial = false) => {
  return yup.object().shape({
    mainnumber_id:
      is_for_power_diagram || is_interpretspectial
        ? yup.string().optional().nullable()
        : yup.string().required("Chỉ số không được để trống .").nullable(),
    attribute_id:
      is_for_power_diagram || is_interpretspectial
        ? yup.string().optional().nullable()
        : yup.string().required("Tên thuộc tính không được để trống .").nullable(),
    order_index: yup.string().required("Vị trí hiển thị không được để trống .").nullable(),
    decs: yup.string().required("Mô tả không được để trống .").nullable(),
    brief_decs: yup.string().required("Tóm tắt không được để trống .").nullable(),
  });
};

export const getColumTable = (data, total, query, handleDelete, handleReply, handleReview) => {
  return [
    configIDRowTable("interpret_id", "/interpret/detail/", query),
    {
      name: "attribute_name",
      label: "Tên thuộc tính",
      options: {
        filter: false,
        sort: true,
        customHeadRender: (columnMeta, handleToggleColumn) => {
          return (
            <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
              <div className="text-center">{columnMeta.label}</div>
            </th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div className="text-left">{value}</div>;
        },
      },
    },
    {
      name: "brief_decs",
      label: "Mô tả ngắn",
      options: {
        filter: false,
        sort: true,
        customHeadRender: (columnMeta, handleToggleColumn) => {
          return (
            <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
              <div className="text-center">{columnMeta.label}</div>
            </th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div className="text-left">{value.replace(/<[^>]+>/g, "")}</div>;
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
            <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
              <div className="text-center">{columnMeta.label}</div>
            </th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="text-center">{value == 1 ? "Có" : value == 0 ? "Không" : "Không"}</div>
          );
        },
      },
    },
    {
      name: "Thao tác",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customHeadRender: (columnMeta, handleToggleColumn) => {
          return (
            <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
              <div className="text-center">{columnMeta.label}</div>
            </th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="text-center">
              <CheckAccess permission="FOR_INTERPRET_ADD">
                <Button
                  color="warning"
                  title="Thêm mới luận giải chi tiết"
                  className="mr-1"
                  onClick={(evt) => {
                    window._$g.rdr(
                      `/interpret/interpret-detail/add/${data[tableMeta["rowIndex"]].interpret_id}`
                    );
                  }}
                >
                  <i className="fa fa-plus" />
                </Button>
              </CheckAccess>
              <CheckAccess permission="FOR_INTERPRET_VIEW">
                <Button
                  title="Danh sách luận giải chi tiết"
                  className="mr-1"
                  onClick={(evt) => {
                    window._$g.rdr(
                      `/interpret/interpret-detail/${data[tableMeta["rowIndex"]].interpret_id}`
                    );
                  }}
                >
                  <i className="fa fa-list" />
                </Button>
              </CheckAccess>
              <CheckAccess permission="FOR_INTERPRET_VIEW">
                <Button
                  color="info"
                  title="Chi tiết luận giải trên web"
                  className="mr-1"
                  onClick={(evt) => {
                    // window._$g.rdr(`/interpret/detail-web/${data[tableMeta["rowIndex"]].interpret_id}`);
                    window.open(
                      `/portal/interpret/detail-web/${data[tableMeta["rowIndex"]].interpret_id}`,
                      "_blank"
                    );
                    // window._$g.rdr(
                    //   `/interpret/detail-web/${data[tableMeta["rowIndex"]].interpret_id}`, '_blank'
                    // );
                  }}
                >
                  <i className="fa fa-eye" />
                </Button>
              </CheckAccess>
              <CheckAccess permission="FOR_INTERPRET_EDIT">
                <Button
                  color={"primary"}
                  title="Duyệt"
                  className="mr-1"
                  onClick={(evt) => {
                    window._$g.rdr(`/interpret/edit/${data[tableMeta["rowIndex"]].interpret_id}`);
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
                  onClick={(evt) =>
                    handleDelete(data[tableMeta["rowIndex"]].interpret_id, tableMeta["rowIndex"])
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
  ];
};

export const column = (handleDelete) => {
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
      width: "20%",
      render: (text, record, index) => {
        // console.log(record)
        return <div className="text-left">{record.is_interpretspectial==1 ? record.attributes_name : record.attribute_name }</div>;
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
      dataIndex: "brief_decs",
      key: "brief_decs",
      responsive: ["md"],
      render: (text, record, index) => {
        let value = text.replace(regex, "");
        value = splitString(value, 80);
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
      key: "x",
      dataIndex: "",
      width: "15%",
      render: (text, record, index) => {
        return (
          <div className="text-center">
            <CheckAccess permission="FOR_INTERPRET_VIEW">
              <Button
                title="Copy"
                className="mr-1"
                onClick={(evt) => {
                  window._$g.rdr(`/interpret/copy/${record["interpret_id"]}`);
                }}
              >
                <i className="fa fa-copy" />
              </Button>
            </CheckAccess>

            <CheckAccess permission="FOR_INTERPRET_ADD">
              <Button
                color="warning"
                title="Thêm mới luận giải chi tiết"
                className="mr-1"
                onClick={(evt) => {
                  window._$g.rdr(`/interpret/d-add/${record["interpret_id"]}`);
                }}
              >
                <i className="fa fa-plus" />
              </Button>
            </CheckAccess>

            <CheckAccess permission="FOR_INTERPRET_VIEW_DETAIL_WEB">
              <Button
                color="info"
                title="Chi tiết luận giải trên web"
                className="mr-1"
                onClick={(evt) => {
                 if(record.is_interpretspectial!=1){
                  window.open(`/portal/interpret/detail-web/${record["interpret_id"]}`, "_blank");
                 }else{
                  window.open(`/portal/interpret/detail-web-spectial/${record["interpret_id"]}`, "_blank");

                 }
                }}
              >
                <i className="fa fa-eye" />
              </Button>
            </CheckAccess>
            <CheckAccess permission="FOR_INTERPRET_EDIT">
              <Button
                color={"primary"}
                title="Chinh sửa"
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
                onClick={(evt) => handleDelete(record["interpret_id"])}
              >
                <i className="fa fa-trash" />
              </Button>
            </CheckAccess>
          </div>
        );
      },
      responsive: ["md"],
    },
  ];
};
