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
  ingredient_id: "",
  ingredient_name: "",
  ingredient__child_1_id: "",
  ingredient__child_2_id: "",
  is_total: "",
  type: "",
  is_active: 1,
  is_apply_dob: 0,
  is_apply_name: 0,
  desc: "",
  ingredient_value: "",
  is_vowel: 0,
  is_onlyfirst_vowel: 0,
  is_consonant: 0,
  is_first_letter: 0,
  is_last_letter: 0,
  is_show_3_time: 0,
  is_show_0_time: 0,
  is_total_shortened: 0,
  is_no_total_shortened: 0,
  is_total_2_digit: 0,
  calculation_id: "",
  param_name_id: "",
  param_dob_id: "",
  is_crrent_age: 0,
  is_crrent_year: 0,
  is_value: 0,
  is_count_tofnum: 0,
  is_numletter_digit: 0,
  is_total_value_digit: 0,
  is_total_letter_first_digit: 0,
  is_total_letter_digit: 0,
  is_total: "",
  is_gender: "",
  type: "",
  is_apply_other:false,
  param_other_id :null
};

export const getColumTable = (data, total, query, handleDelete, handleReply, handleReview) => {
  // console.log(data);
  return [
    configIDRowTable("ingredient_id", "/formula-ingredients/detail/", query),
    {
      name: "ingredient_name",
      label: "Tên thành phần",
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
      name: "is_apply_dob",
      label: "Áp dụng ngày sinh",
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
      name: "is_apply_name",
      label: "Áp dụng cho tên",
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
      name: "created_date",
      label: "Ngày tạo",
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
      name: "Thao tác",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="text-center">
              <CheckAccess permission="FOR_FORMULAINGREDIENTS_EDIT">
                <Button
                  color="primary"
                  title="Chỉnh sửa"
                  className="mr-1"
                  onClick={(evt) => {
                    window._$g.rdr(
                      `/formula-ingredients/edit/${data[tableMeta["rowIndex"]].ingredient_id}`
                    );
                  }}
                >
                  <i className="fa fa-edit" />
                </Button>
              </CheckAccess>
              <CheckAccess permission="FOR_FORMULAINGREDIENTS_DEL">
                <Button
                  color="danger"
                  title="Xóa"
                  className=""
                  onClick={(evt) =>
                    handleDelete(data[tableMeta["rowIndex"]].ingredient_id, tableMeta["rowIndex"])
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
