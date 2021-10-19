import React from 'react'
import { configIDRowTable } from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button } from "reactstrap";
import * as yup from "yup";
// import { Checkbox } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Checkbox } from 'antd';

export const getColumnTable = (data, query, handleActionItemClick, handlePick = null, pickItems = {}, setPickItem) => {
   return [
      configIDRowTable("combo_id", "/produc-combo/detail/", query),
      {
         name: "combo_name",
         label: "Tên Combo",
         options: {
            filter: false,
            sort: false,
            customHeadRender: (columnMeta, handleToggleColumn) => {
               return (
                  <th
                     key={`head-th-${columnMeta.label}`}
                     className="MuiTableCell-root MuiTableCell-head"
                  >
                     <div className="text-center">{columnMeta.label}</div>
                  </th>
               );
            },
            customBodyRender: (value, tableMeta, updateValue) => {
               return (
                  <div>
                     <Link
                        to={`/product-combo/detail/${data[tableMeta["rowIndex"]].combo_id
                           }`}
                     >
                        {value}
                     </Link>
                  </div>
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
                  <th
                     key={`head-th-${columnMeta.label}`}
                     className="MuiTableCell-root MuiTableCell-head"
                  >
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
         name: "created_user_full_name",
         label: "Người tạo",
         options: {
            filter: false,
            sort: true,
            customHeadRender: (columnMeta, handleToggleColumn) => {
               return (
                  <th
                     key={`head-th-${columnMeta.label}`}
                     className="MuiTableCell-root MuiTableCell-head"
                  >
                     <div className="text-center">{columnMeta.label}</div>
                  </th>
               );
            },
         },
      },

      {
         name: "is_web_view",
         label: "Hiển thị web",
         options: {
            filter: false,
            sort: false,
            customHeadRender: (columnMeta, handleToggleColumn) => {
               return (
                  <th
                     key={`head-th-${columnMeta.label}`}
                     className="MuiTableCell-root MuiTableCell-head"
                  >
                     <div className="text-center">{columnMeta.label}</div>
                  </th>
               );
            },
            customBodyRender: (value, tableMeta, updateValue) => {
               return <div className="text-center">{value ? "Có" : "Không"}</div>;
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
                  <th
                     key={`head-th-${columnMeta.label}`}
                     className="MuiTableCell-root MuiTableCell-head"
                  >
                     <div className="text-center">{columnMeta.label}</div>
                  </th>
               );
            },
            customBodyRender: (value, tableMeta, updateValue) => {
               return <div className="text-center">{value ? "Có" : "Không"}</div>;
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
               if (handlePick) {
                  let item = data[tableMeta["rowIndex"]];
                  return (
                     <div className="text-center mb-1">
                        <Checkbox
                           checked={!!pickItems[item.combo_id]}
                           onChange={({ target }) => {
                              if (target.checked) {
                                 pickItems[item.combo_id] = item;
                              } else {
                                 delete pickItems[item.combo_id];
                              }
                              setPickItem(pickItems)
                           }}
                        />
                     </div>
                  );
               }
               else
                  return (
                     <div className="text-center">
                        <CheckAccess permission="PRO_COMBOS_EDIT">
                           <Button
                              color="primary"
                              title="Chỉnh sửa"
                              className="mr-1"
                              onClick={(evt) =>
                                 handleActionItemClick(
                                    "edit",
                                    data[tableMeta["rowIndex"]].combo_id,
                                    tableMeta["rowIndex"]
                                 )
                              }
                           >
                              <i className="fa fa-edit" />
                           </Button>
                        </CheckAccess>

                        <CheckAccess permission="PRO_COMBOS_DEL">
                           <Button
                              color="danger"
                              title="Xóa"
                              className=""
                              onClick={(evt) =>
                                 handleActionItemClick(
                                    "delete",
                                    data[tableMeta["rowIndex"]].combo_id,
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
   ]
}

export const initialValues = {
   combo_id: null,
   combo_name: '',
   description: '',
   content_detail:'',
   is_active: true,
   is_web_view: true,
   combo_image_url: null,
   combo_products: []
}

export const validationSchema = yup.object().shape({
   combo_name: yup.string()
      .required("Tên Combo là bắt buộc.")
      .max(400, "Tên Combo tối đa 400 ký tự."),
      description: yup.string()
      .required("Mô tả là bắt buộc."),
      content_detail: yup.string()
      .required("Mô tả chi tiết là bắt buộc."),
   combo_products: yup.array().nullable()
      .test(
         'product_attribute',
         'Danh sách sản phẩm là bắt buộc',
         value => {
            let check = (value || []).find(p => !p.number_search || (p.is_time_limit && !p.time_limit))
            if (check) {
               return false;
            }
            return true;
         }
      )
      .required("Danh sách sản phẩm là bắt buộc"),
})