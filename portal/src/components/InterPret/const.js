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
  interpret_id: "",
  relationship_id: "",
  mainnumber_id: "",
  compare_mainnumber_id: "",
  attribute_id: "",
  is_active: 1,
  is_master: "",
  decs: "",
  brief_decs: "",
  note: "",
  order_index: "",
};
///// validate
export const validationSchema = yup.object().shape({
  relationship_id: yup.string().required("Mối quan hệ không được để trống .").nullable(),
  mainnumber_id: yup.string().required("Chỉ số không được để trống .").nullable(),
  compare_mainnumber_id: yup.string().required("Chỉ số so sánh không được để trống .").nullable(),
  attribute_id: yup.string().required("Tên thuộc tính không được để trống .").nullable(),
  order_index: yup.string().required("Vị trí hiển thị không được để trống .").nullable(),
  decs: yup
    .string()
    .required("Mô tả không được để trống .")
    // .max(2000, "Mô tả tối đa 2000 kí tự .")
    .nullable(),
  brief_decs: yup
    .string()
    .required("Tóm tắt không được để trống .")
    // .max(300, "Tóm tắt tối đa 300 kí tự .")
    .nullable(),
  // note: yup.string().max(300, "Ghi chú tối đa 300 kí tự .").nullable(),
});
export const getColumTable = (data, total, query, handleDelete, handleReply, handleReview) => {
  // console.log(data);
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
          // var doc = new DOMParser().parseFromString(value, "text/xml");
          // // console.log(doc.firstChild.innerHTML); // => <a href="#">Link...
          // console.log(doc.firstChild.firstChild.innerHTML); // => Link
          return (
            <div className="text-left">{value.replace(/<[^>]+>/g, "")}</div>

            // <div
            //   className="text-left align-self-center"
            //   style={{ margin: "auto" }}
            //   dangerouslySetInnerHTML={{ __html: value }}
            // >
            //   {/* <div  /> */}
            // <div className="text-center">{value == 1 ? "Có" : value == 0 ? "Không" : "Không"}</div>

            // </div>
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
              <CheckAccess permission="FOR_INTERPRET_DETAIL_ADD">
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
              <CheckAccess permission="FOR_INTERPRET_DETAIL_VIEW">
                <Button
                  // color="warning"
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
              <CheckAccess permission="FOR_INTERPRET_DETAIL_VIEW">
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
