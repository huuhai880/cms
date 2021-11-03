import React from "react";
import { configIDRowTable } from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button, CustomInput } from "reactstrap";
import * as yup from "yup";
// import { Checkbox } from "@material-ui/core";

import { Link } from "react-router-dom";
import "./style.scss";
import { Checkbox } from "antd";

export const getColumnTable = (
  data,
  query,
  handleActionItemClick,
  handlePick = null,
  pickItems = {},
  setPickItem
) => {
  return [
    configIDRowTable("product_id", "/product/detail/", query),
    {
      name: "product_name",
      label: "Tên sản phẩm",
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
            <div>
              <Link to={`/product/detail/${data[tableMeta["rowIndex"]].product_id}`}>{value}</Link>
            </div>
          );
        },
      },
    },
    {
      name: "category_name",
      label: "Danh mục sản phẩm",
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
      name: "product_name_show_web",
      label: "Tên hiển thị Web",
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

    // {
    //     name: "price",
    //     label: "Giá sản phẩm",
    //     options: {
    //         filter: false,
    //         sort: true,
    //         customHeadRender: (columnMeta, handleToggleColumn) => {
    //             return (
    //                 <th
    //                     key={`head-th-${columnMeta.label}`}
    //                     className="MuiTableCell-root MuiTableCell-head"
    //                 >
    //                     <div className="text-center">{columnMeta.label}</div>
    //                 </th>
    //             );
    //         },
    //         customBodyRender: (value, tableMeta, updateValue) => {
    //             return <div className="text-center">{numberFormat(value)}</div>;
    //         },
    //     },
    // },
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
          return <div className="text-center">{value ? "Có" : "Không"}</div>;
        },
      },
    },

    {
      name: "is_show_web",
      label: "Hiển thị Web",
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
            // return (
            //     <div className="text-center mb-1">
            //         <Checkbox
            //             checked={!!pickItems[item.product_id]}
            //             onChange={({ target }) => {
            //                 if (target.checked) {
            //                     pickItems[item.product_id] = item;
            //                 } else {
            //                     delete pickItems[item.product_id];
            //                 }
            //                 setPickItem(pickItems)
            //             }}
            //         />
            //     </div>
            // );

            return (
              <div className="text-center">
                <Checkbox
                  checked={!!pickItems[item.product_id]}
                  onChange={({ target }) => {
                    if (target.checked) {
                      pickItems[item.product_id] = item;
                    } else {
                      delete pickItems[item.product_id];
                    }
                    setPickItem(pickItems);
                  }}
                />
              </div>
            );
          } else
            return (
              <div className="text-center">
                <CheckAccess permission="MD_PRODUCT_EDIT">
                  <Button
                    color="primary"
                    title="Chỉnh sửa"
                    className="mr-1"
                    onClick={(evt) =>
                      handleActionItemClick(
                        "edit",
                        data[tableMeta["rowIndex"]].product_id,
                        tableMeta["rowIndex"]
                      )
                    }
                  >
                    <i className="fa fa-edit" />
                  </Button>
                </CheckAccess>

                <CheckAccess permission="MD_PRODUCT_DEL">
                  <Button
                    color="danger"
                    title="Xóa"
                    className=""
                    onClick={(evt) =>
                      handleActionItemClick(
                        "delete",
                        data[tableMeta["rowIndex"]].product_id,
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

export const initialValues = {
  product_id: null,
  product_name: "",
  product_category_id: null,
  product_name_show_web: "",
  url_product: "",
  // price: 0,
  short_description: "",
  product_content_detail: "",
  product_images: [],
  product_attributes:[],
  is_active: true,
  is_show_web: true,
  product_attributes: [],
  is_web_view: false, //false: export pdf, true: show web
  is_show_menu: false, //co show tren menu hay khong?
};

export const validationSchema = yup.object().shape({
  product_name: yup
    .string()
    .required("Tên sản phẩm là bắt buộc.")
    .max(400, "Tên sản phẩm tối đa 400 ký tự."),
  product_name_show_web: yup
    .string()
    .required("Tên hiển thị trên web là bắt buộc.")
    .max(120, "Tên hiển thị trên web tối đa 120 ký tự."),
  short_description: yup
    .string()
    .required("Mô tả ngắn gọn sản phẩm là bắt buộc.")
    .max(400, "Mô tả ngắn gọn tối đa 400 ký tự."),
  product_category_id: yup.string().required("Danh mục sản phẩm là bắt buộc.").nullable(),
  product_images: yup.array().nullable().required("Hình ảnh sản phẩm là bắt buộc"),
  product_content_detail: yup.string().required("Mô tả là bắt buộc"),
  product_attributes: yup
    .array()
    .required("Nội dung là bắt buộc.")
    .test("product_attributes", null, (arr) => {
      // check chọn page
      const checkPageId = arr.findIndex((item, index) => {
        return item.product_page_id == null;
      });
      if (checkPageId !== -1) {
        return new yup.ValidationError("Chỉ số là bắt buôc.", null, "product_attributes");
      }

      return true;
    }),
  // url_product: yup.string().required(
  //     "Url sản phẩm là bắt buộc"
  // ).nullable(),
  // price: yup.number()
  //     .test(
  //         'price',
  //         'Giá sản phẩm là bắt buộc',
  //         function (value) {
  //             if (value <= 0) {
  //                 return false //Loi
  //             }
  //             return true;
  //         }
  //     )
  //     .required('Giá sản phẩm là bắt buộc'),

  // product_attributes: yup.array().nullable()
  //     .test(
  //         'product_attribute',
  //         'Nội dung là bắt buộc',
  //         value => {
  //             let check = (value || []).find(p => !p.attributes_group_id || !p.interprets.length)
  //             if (check) {
  //                 return false;
  //             }
  //             return true;
  //         }
  //     )
  //     .required("Nội dung là bắt buộc"),
});
