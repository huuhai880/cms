import {
  configTableOptions,
  configIDRowTable,
  numberFormat,
  getPropsConfigTable,
} from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import React from "react";
import { Button } from "reactstrap";
import NumberFormat from "../Common/NumberFormat";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import * as yup from "yup";
export const initialValues = {
  order_id: "",
  status: "",
  order_date: "",
  phone_number: "",
  full_name: "",
  address: "",
  email: "",
  product_list: [],
  status:""
};
export const getColumTable = (data, total, query) => {
  // console.log(data);
  return [
    configIDRowTable("order_id", "/order/detail/", query),
    {
      name: "order_id",
      label: "Mã đơn hàng",
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
      name: "order_date",
      label: "Ngày tạo đơn",
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
      name: "order_total_sub",
      label: "Tổng tiền",
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
            <div className="text-right">
              {new Intl.NumberFormat("de-DE", { style: "currency", currency: "VND" }).format(value)}
            </div>
          );
        },
      },
    },
    {
      name: "full_name",
      label: "Tên khách hàng",
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
      name: "phone_number",
      label: "Số điện thoại",
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
      name: "status",
      label: "Trạng thái thanh toán",
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
          // console.log(value)
          return (
            <div className="text-center">
              {value == 1 ? "Đã thanh toán" : value == 0 ? "Chưa thanh toán" : "Chưa thanh toán"}
            </div>
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
              <CheckAccess permission="SL_ORDER_VIEW">
                <Button
                  color="warning"
                  title="Chi tiết"
                  className="mr-1"
                  onClick={(evt) => {
                    window._$g.rdr(`/order/detail/${data[tableMeta["rowIndex"]].order_id}`);
                  }}
                >
                  <i className="fa fa-info" />
                </Button>
              </CheckAccess>
            </div>
          );
        },
      },
    },
  ];
};
