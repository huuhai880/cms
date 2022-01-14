import {
  configIDRowTable,
} from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import React from "react";
import { Button } from "reactstrap";
import { Checkbox } from "antd";

import * as yup from "yup";
export const initialValues = {
  discount_id: null,
  discount_code: "",
  is_percent_discount: true,
  is_money_discount: false,
  discount_value: "",
  is_all_product: true,
  is_appoint_product: false,
  is_all_customer_type: true,
  is_app_point_customer_type: false,
  is_apply_orther_discount: true,
  is_none_requirement: true,
  is_mintotal_money: false,
  value_mintotal_money: null,
  is_min_product: false,
  is_value_min_product: null,
  discount_status: 1,
  product_list: [],
  customer_type_list: [],
  is_active: 1,
  start_date: null,
  end_date: null,
  description: '',

};
///// validate
export const validationSchema = yup.object().shape({
  discount_code: yup.string().required("Mã code là bắt buộc."),
  discount_value: yup.string().required("Giá trị là bắt buộc."),
  start_date: yup.string().required("Thời gian bắt đầu áp dụng là bắt buộc.")
});
export const getColumTable = (data, total, query, handleDelete, handleReply, handleReview) => {
  // console.log(data);
  return [
    configIDRowTable("letter_id", "/letter/detail/", query),
    {
      name: "letter_name",
      label: "Tên chữ cái",
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
      name: "letter",
      label: "Chữ cái",
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
      name: "is_vowel",
      label: "Nguyên âm",
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
          return (
            <div className="text-center">
              <Checkbox checked={value == 1}></Checkbox>
            </div>
          );
        },
      },
    },

    {
      name: "number",
      label: "Số",
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
    // {
    //   name: "is_active",
    //   label: "Kích hoạt",
    //   options: {
    //     filter: false,
    //     sort: true,
    //     customHeadRender: (columnMeta, handleToggleColumn) => {
    //       return (
    //         <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
    //           <div className="text-center">{columnMeta.label}</div>
    //         </th>
    //       );
    //     },
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return (
    //         <div className="text-center">
    //           <Checkbox checked={value == 1}></Checkbox>
    //         </div>
    //       );
    //     },
    //   },
    // },
    {
      name: "desc",
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
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div className="text-left">{value}</div>;
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
              <CheckAccess permission="MD_LETTER_EDIT">
                <Button
                  color="primary"
                  title="Chỉnh sửa"
                  className="mr-1"
                  onClick={(evt) => {
                    window._$g.rdr(`/letter/edit/${data[tableMeta["rowIndex"]].letter_id}`);
                  }}
                >
                  <i className="fa fa-edit" />
                </Button>
              </CheckAccess>
              <CheckAccess permission="MD_LETTER_DEL">
                <Button
                  color="danger"
                  title="Xóa"
                  className=""
                  onClick={(evt) =>
                    handleDelete(data[tableMeta["rowIndex"]].letter_id, tableMeta["rowIndex"])
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
