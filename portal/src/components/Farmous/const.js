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
const regex = /(<([^>]+)>)/gi;

export const initialValues = {
  farmous_id: "",
  farmous_name: "",
  desc: "",
  short_desc: "",
  gender: "",
  position: "",
  birthday: "",
  is_active: 1,
  is_default: 0,
  image_avatar: "",
};
///// validate
export const validationSchema = yup.object().shape({
  farmous_name: yup.string().required("Họ và tên không được để trống .").nullable(),
  // desc: yup.string().required("Mô tả không được để trống .").nullable(),
  // short_desc: yup.string().required("Tóm tắt không được để trống .").nullable(),
  birthday: yup.string().required("Ngày sinh không được để trống .").nullable(),
  position: yup.string().required("Chức danh không được để trống .").nullable(),
  gender: yup.string().required("Giới tính không được để trống .").nullable(),
  image_avatar: yup.string().required("Hình đại diện không được để trống .").nullable(),
});
export const getColumTable = (data, total, query, handleDelete, handleReply, handleReview) => {
  // console.log(data);
  return [
    configIDRowTable("farmous_id", "/famous/detail/", query),
    {
      name: "farmous_name",
      label: "Họ và tên",
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
      name: "gender",
      label: "Giới tính",
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
          return <div className="text-left">{value == 1 ? "Nam" : "nữ"}</div>;
        },
      },
    },
    {
      name: "birthday",
      label: "Sinh nhật",
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
      name: "position",
      label: "Chức danh",
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
      name: "short_desc",
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
          let NewValue = value.replace(regex, "");
          NewValue = splitString(NewValue, 80);
          return <div className="text-left">{NewValue}</div>;
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
      name: "Thao tác",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="text-center">
              <CheckAccess permission="MD_FAMOUS_EDIT">
                <Button
                  color="primary"
                  title="Chỉnh sửa"
                  className="mr-1"
                  onClick={(evt) => {
                    window._$g.rdr(`/famous/edit/${data[tableMeta["rowIndex"]].farmous_id}`);
                  }}
                >
                  <i className="fa fa-edit" />
                </Button>
              </CheckAccess>
              <CheckAccess permission="MD_FAMOUS_DEL">
                <Button
                  color="danger"
                  title="Xóa"
                  className=""
                  onClick={(evt) =>
                    handleDelete(data[tableMeta["rowIndex"]].farmous_id, tableMeta["rowIndex"])
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
