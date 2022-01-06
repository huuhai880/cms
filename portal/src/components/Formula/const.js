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
  formula_id: "",
  formula_name: "",
  attribute_gruop_id: "",
  desc: "",
  is_active: 1,
  is_default: 1,
  order_index: "",
  type1: "",
  type2: "",
  orderid_1: "",
  orderid_2: "",
  calculation_id: "",
  is_total_no_shortened: false,
  is_total_shortened: false,
  is_total_2digit: false,
  list_condition_formula: [],
  is_couple_formula: false, //Cong thuc cap
  is_condition_formula: false, //Cong thuc dieu kien
  ref_formula_id: null, //Cong thuc tham chieu
  ref_condition_id: null, //Chi so dieu kien tham chieu
  interpret_formula_id: null, //Cong thuc tham chieu de lay luan giai 
};
///// validate
export const validationSchema = yup.object().shape({
  formula_name: yup.string().required("Công thức không được để trống .").nullable(),
  attribute_gruop_id: yup.number().required("Chỉ số không được để trống .").nullable(),
  desc: yup.string().required("Mô tả không được để trống .").nullable(),
  order_index: yup.number().required("Thứ tự sắp xếp không được để trống .").nullable(),

});
export const getColumTable = (data, total, query, handleDelete, handleReply, handleReview) => {
  // console.log(data);
  return [
    configIDRowTable("formula_id", "/formula/detail/", query),
    {
      name: "formula_name",
      label: "Tên công thức",
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
      name: "gruop_name",
      label: "Chỉ số",
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
      name: "#",
      label: "Loại công thức",
      options: {
        filter: false,
        sort: true,
        customHeadRender: (columnMeta, handleToggleColumn) => {
          return (
            <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head" style={{width:'15%'}}>
              <div className="text-center">{columnMeta.label}</div>
            </th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          let {is_condition_formula = false, is_couple_formula = false} = data[tableMeta["rowIndex"]] || {};
          let type_formula = 'Công thức thông thường';
          if(is_condition_formula){
            type_formula = 'Công thức điều kiện'
          }
          else if(is_couple_formula){
            type_formula = 'Công thức cặp'
          }
          return <div className="text-left">{type_formula}</div>;
        },
      },
    },
    
    {
      name: "order_index",
      label: "Thứ tự sắp xếp ",
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
              <CheckAccess permission="FOR_FORMULA_EDIT">
                <Button
                  color="primary"
                  title="Chỉnh sửa"
                  className="mr-1"
                  onClick={(evt) => {
                    window._$g.rdr(`/formula/edit/${data[tableMeta["rowIndex"]].formula_id}`);
                  }}
                >
                  <i className="fa fa-edit" />
                </Button>
              </CheckAccess>
              <CheckAccess permission="FOR_FORMULA_DEL">
                <Button
                  color="danger"
                  title="Xóa"
                  className=""
                  onClick={(evt) =>
                    handleDelete(data[tableMeta["rowIndex"]].formula_id, tableMeta["rowIndex"])
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
