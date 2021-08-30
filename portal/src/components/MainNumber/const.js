import {
  configTableOptions,
  configIDRowTable,
  numberFormat,
  getPropsConfigTable,
} from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import React from "react";
import { Button } from "reactstrap";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import * as yup from "yup";
export const initialValues = {
  main_number_id: "",
  main_number: "",
  is_active: 1,
  main_number_desc: "",
  main_number_img: [],
};
///// validate
export const validationSchema = yup.object().shape({
  main_number: yup.string().required("Con số không được để trống .").nullable(),
  main_number_img:yup.array().required("Danh sách hình ảnh không được để trống .").nullable(),
});
export const getColumTable = (data, total, query, handleDelete, handleReply, handleReview) => {
  // console.log(data);
  return [
    configIDRowTable("main_number_id", "/main-number/edit/", query),
    {
      name: "main_number",
      label: "Số chủ đạo",
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
          return <div className="text-center">{value}</div>;
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
      name: "main_number_desc",
      label: "Mô tả",
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
              <CheckAccess permission="FOR_MAINNUMBER_EDIT">
                <Button
                  color="primary"
                  title="Chỉnh sửa"
                  className="mr-1"
                  onClick={(evt) => {
                    window._$g.rdr(
                      `/main-number/edit/${data[tableMeta["rowIndex"]].main_number_id}`
                    );
                  }}
                >
                  <i className="fa fa-edit" />
                </Button>
              </CheckAccess>
              <CheckAccess permission="FOR_MAINNUMBER_DEL">
                <Button
                  color="danger"
                  title="Xóa"
                  className=""
                  onClick={(evt) =>
                    handleDelete(data[tableMeta["rowIndex"]].main_number_id, tableMeta["rowIndex"])
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
