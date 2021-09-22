import {
  configTableOptions,
  configIDRowTable,
  numberFormat,
  getPropsConfigTable,
} from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import React from "react";
import { Button } from "reactstrap";
import { Checkbox } from "antd";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import * as yup from "yup";
export const initialValues = {
  interpret_detail_id: "",
  order_index: "",

  interpret_id: "",
  interpret_detail_name: "",
  // interpret_detail_parentname: "",
  interpret_detail_short_content: "",
  interpret_detail_full_content: "",
  interpret_detail_parent_id: 0,
  is_active: 1,
};
///// validate
export const validationSchema = yup.object().shape({
  // interpret_detail_parentid: yup.string().required("Luận giải chi tiết cha không được để trống .").nullable(),
  interpret_detail_name: yup.string().required("Tên luận giải  không được để trống .").nullable(),
  interpret_detail_full_content: yup
    .string()
    .required("Mô tả không được để trống .")
    // .max(2000, "Mô tả tối đa 2000 kí tự .")
    .nullable(),
  interpret_detail_short_content: yup
    .string()
    .required("Mô tả ngắn không được để trống .")
    // .max(300, "Mô tả ngắn tối đa 300 kí tự .")
    .nullable(),
  // note: yup.string().max(300, "Ghi chú tối đa 300 kí tự .").nullable(),
});
export const getColumTable = (data, total, query, handleDelete, handleReply, handleReview) => {
  // console.log(data);
  return [
    configIDRowTable("interpret_detail_id", "/interpret/interpret-detail/detail/", query),
    {
      name: "interpret_detail_name",
      label: "Tên luận giải",
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
      name: "interpret_detail_parentname",
      label: "Luận giải phụ thuộc",
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
      name: "interpret_detail_short_content",
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
          // console.log(data[tableMeta["rowIndex"]].news_comment_user_fullname);
          return (
            <div className="text-center">
              <CheckAccess permission="FOR_INTERPRET_DETAIL_EDIT">
                <Button
                  color={"primary"}
                  title="Chỉnh sửa"
                  className="mr-1"
                  onClick={(evt) => {
                    window._$g.rdr(
                      `/interpret/interpret-detail/edit/${
                        data[tableMeta["rowIndex"]].interpret_detail_id
                      }`
                    );
                  }}
                >
                  <i className="fa fa-edit" />
                </Button>
              </CheckAccess>

              <CheckAccess permission="FOR_INTERPRET_DETAIL_DEL">
                <Button
                  color="danger"
                  title="Xóa"
                  className=""
                  onClick={(evt) =>
                    handleDelete(
                      data[tableMeta["rowIndex"]].interpret_detail_id,
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
  ];
};
