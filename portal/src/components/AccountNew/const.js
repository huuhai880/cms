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

//// init value
export const initialValues = {
  member_id: "",
  image_avatar: "",
  customer_code: "",
  full_name: "",
  user_name: "",
  pass_word: "",
  register_date: "",
  nick_name: "",
  birth_day: "",
  gender: 1,
  marital_status: 0,
  phone_number: "",
  email: "",
  id_card: "",
  id_card_date: "",
  id_card_place: "",
  id_card_front_image: "",
  id_card_back_image: "",
  live_image: "",
  country_id: "",
  province_id: "",
  district_id: "",
  ward_id: "",
  address: "",
  facebook: "",
  twitter: "",
  is_active: 1,
};
export const initialPassword = {
  password: "",
  password_confirm: "",
};
///// validate
export const validationPassword = yup.object().shape({
  password: yup.string()
    .trim()
    .required("Mật khẩu là bắt buộc.")
    .min(8, "Mật khẩu quá ngắn, ít nhất 8 ký tự!")
    .max(25, "Mật khẩu quá dài, tối đa 25 ký tự!"),
  password_confirm: yup.string()
    .trim()
    .required("Mật khẩu mới là bắt buộc.")
    .min(8, "Mật khẩu quá ngắn, ít nhất 8 ký tự!")
    .max(25, "Mật khẩu quá dài, tối đa 25 ký tự!"),
});
///// validate
export const validationSchema = yup.object().shape({
  user_name: yup
    .string()
    .required("Tên đăng nhập không được để trống !")
    .nullable()
    .email("Vui lòng nhập tên đăng nhập theo đinh dạng email"),
  pass_word: yup.string().required("Mật khẩu không được để trống !").nullable(),
  full_name: yup.string().required("Họ và tên khai sinh không được để trống !").nullable(),
  nick_name: yup.string().required("Họ và tên không được để trống !").nullable(),
  birth_day: yup.string().required("Ngày sinh không được để trống !").nullable(),
  email: yup.string().required("Ngày sinh không được để trống !").nullable(),
  id_card: yup.string().required("Số CMND/CCCD không được để trống !").nullable(),
  id_card_place: yup.string().required("Nơi cấp không được để trống !").nullable(),
  id_card_date: yup.string().required("Ngày cấp không được để trống !").nullable(),
  ward_id: yup.string().required("Phường/ Xã không được để trống !").nullable(),
  province_id: yup.string().required("Tỉnh/ Thành phố không được để trống !").nullable(),
  district_id: yup.string().required("Quận/ Huyện không được để trống !").nullable(),
  phone_number: yup
    .string()
    .required("Số điện thoại không được để trống !")
    .matches(/^[0-9]{7,10}$/, "Số điện thoại không hợp lệ"),
});

export const getColumTable = (data, total, query, handleDelete, handleReply, handleReview) => {
  // console.log(data);
  return [
    configIDRowTable("member_id", "/account/detail/", query),
    {
      name: "customer_code",
      label: "Mã khách hàng",
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
      name: "full_name",
      label: "Tên khách hàng",
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
      },
    },
    {
      name: "gender",
      label: "Giới tính",
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
          let result = null;
          switch ("" + value) {
            case "0":
              result = <span>Nữ</span>;
              break;
            case "1":
              result = <span>Nam</span>;
              break;
            default:
              result = <span>Khác</span>;
          }
          return result;
        },
      },
    },
    {
      name: "birth_day",
      label: "Ngày sinh",
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
      },
    },
    {
      name: "phone_number",
      label: "Số điện thoại",
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
      },
    },
    {
      name: "address_full",
      label: "Địa chỉ",
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
            <div className="text-left">{value == 1 ? "Có" : value == 0 ? "Không" : "Không"}</div>
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
              <CheckAccess permission="CRM_ACCOUNT_EDIT">
                <Button
                  color="primary"
                  title="Chỉnh sửa"
                  className="mr-1"
                  onClick={(evt) => {
                    window._$g.rdr(`/account-new/edit/${data[tableMeta["rowIndex"]].member_id}`);
                  }}
                >
                  <i className="fa fa-edit" />
                </Button>
              </CheckAccess>
              <CheckAccess permission="CRM_ACCOUNT_DEL">
                <Button
                  color="danger"
                  title="Xóa"
                  className=""
                  onClick={(evt) =>
                    handleDelete(data[tableMeta["rowIndex"]].member_id, tableMeta["rowIndex"])
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
