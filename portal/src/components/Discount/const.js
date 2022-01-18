

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
  is_apppoint_customer_type: false,
  is_apply_orther_discount: true,
  is_none_requirement: true,
  is_min_total_money: false,
  value_min_total_money: null,
  is_min_num_product: false,
  value_min_num_product: null,
  discount_status: 1,
  product_list: [],
  customer_type_list: [],
  is_active: 1,
  start_date: null,
  end_date: null,
  note: '',
};

export const validationSchema = yup.object().shape({
  discount_code: yup.string().required("Mã code là bắt buộc."),
  discount_value: yup.string().required("Giá trị là bắt buộc."),
  start_date: yup.string().nullable().required("Thời gian bắt đầu áp dụng là bắt buộc.")
});

