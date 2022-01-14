import React, { useState, useEffect } from "react";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import moment from 'moment'
import { Radio, Checkbox, Space, Table } from 'antd';
import { useParams } from "react-router";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./const";
import DiscountModel from "../../models/DiscountModel";
import NumberFormat from "../Common/NumberFormat";
import { CheckAccess } from "../../navigation/VerifyAccess";
import Select from "react-select";
import { columns_customer_type, columns_product } from "./colums";
import DatePicker from "../Common/DatePicker";

function DiscountAdd({ noEdit }) {
  const _discountModel = new DiscountModel();
  const [dataDiscount, setDataDiscount] = useState(initialValues);
  let { id } = useParams();
  const [alerts, setAlerts] = useState([])
  const [btnType, setbtnType] = useState("");
  const [dataOption, setDataOption] = useState({
    product: [],
    customerType: [],
  })
  const [dataStatus, setDataStaus] = useState([
    { name: "Chưa áp dụng", id: "1" },
    { name: "Đang áp dụng", id: "2" },
    { name: "Đã kết thúc", id: "3" },
  ]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataDiscount,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCreateOrUpdate(values);
    },
  });
  //// create discount
  const handleCreateOrUpdate = async (values) => {
    let alerts = [];
    try {
      _discountModel.create(values).then((data) => {
        if (btnType == "save") {
          if (id) {
            setDataDiscount(values);
          } else {
            formik.resetForm();
          }
          window._$g.toastr.show("Lưu thành công!", "success");
        } else if (btnType == "save&quit") {
          window._$g.toastr.show("Lưu thành công!", "success");
          setDataDiscount(initialValues);
          return window._$g.rdr("/discount");
        }
        setAlerts([]);
      }).catch((error) => {
        let { errors, statusText, message } = error;

        let msg = [`<b>${statusText || message}</b>`]
          .concat(errors || [])
          .join("<br/>");

        alerts.push({ color: "danger", msg });
        setAlerts(alerts);
      });
    } catch (error) {


    } finally {
      
      formik.setSubmitting(false);
      window.scrollTo(0, 0);

    }

  };



  //////get data detail
  useEffect(() => {
    if (id) {
      _initDataDetail();
    }
    (async () => {
      await _getBundleData();

    })();


  }, [id]);

  //// data detail
  const _initDataDetail = async () => {
    try {
      await _discountModel.detail(id).then((data) => {

        setDataDiscount(data);
      });
    } catch (error) {

      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };


  const _getBundleData = async () => {
    let bundle = {};
    let all = [
      _discountModel.getOptions()
        .then(data => {
          bundle['product'] = data.resProduct
          bundle['customerType'] = data.resCustomer
        }),
    ];
    await Promise.all(all)
      .catch(err => window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => window.location.reload()
      ));

    setDataOption({
      ...bundle
    })

  }

  const optionCustomerType = () => {
    let { customer_type_list = [] } = formik.values || {};
    if (dataOption.customerType && dataOption.customerType.length > 0) {
      return dataOption.customerType.map(({ customer_type_name: label, customer_type_id: value }) => {
        return customer_type_list.find((p) => p.customer_type_id == value) ? {
          value,
          label,
          isDisabled: true,
        } :
          { value, label };
      });
    }
    return []
  }

  const optionProduct = () => {
    let { product_list = [] } = formik.values || {};
    if (dataOption.product && dataOption.customerType.length > 0) {
      return dataOption.product.map(({ product_name: label, product_id: value }) => {
        return product_list.find((p) => p.product_id == value) ? {
          value,
          label,
          isDisabled: true,
        } :
          { value, label };
      });
    }
    return []
  }


  const handleChangeDiscountType = (value) => {
    formik.setFieldValue('is_percent_discount', value ? false : true);
    formik.setFieldValue('is_money_discount', value ? true : false)

  }

  const handleChangeApplyProduct = (value) => {
    formik.setFieldValue('is_all_product', value ? false : true)
    formik.setFieldValue('is_appoint_product', value ? true : false)

  }

  const handleChangeCustomer = (value) => {
    formik.setFieldValue('is_all_customer_type', value ? false : true)
    formik.setFieldValue('is_app_point_customer_type', value ? true : false)
  }

  const handleRequetDiscount = (value) => {

    switch (value) {
      case 1:
        formik.setFieldValue('is_none_requirement', true)
        formik.setFieldValue('is_mintotal_money', false)
        formik.setFieldValue('is_min_product', false)
        break;
      case 2:
        formik.setFieldValue('is_none_requirement', false)
        formik.setFieldValue('is_mintotal_money', true)
        formik.setFieldValue('is_min_product', false)
        break;
      case 3:
        formik.setFieldValue('is_none_requirement', false)
        formik.setFieldValue('is_mintotal_money', false)
        formik.setFieldValue('is_min_product', true)
        break;
      default:
        formik.setFieldValue('is_none_requirement', true)
        formik.setFieldValue('is_mintotal_money', false)
        formik.setFieldValue('is_min_product', false)
        break;
    }
  }

  const handleSelectCustomerType = (e) => {
    let { customer_type_list = [] } = formik.values || {};

    customer_type_list.push({
      customer_type_id: e.value,
      customer_type_name: e.label,
    })
    formik.setFieldValue('customer_type_list', customer_type_list)
  }

  const handleSelectProduct = (e) => {
    let { product_list = [] } = formik.values || {};

    product_list.push({
      product_id: e.value,
      product_name: e.label,
    })
    formik.setFieldValue('product_list', product_list)
  }

  const handleDeleteProduct = (record) => {
    let { product_list = [] } = formik.values || {};
    const findIndex = product_list.findIndex((x) => x.product_id == record.product_id)
    product_list.splice(findIndex, 1)
    formik.setFieldValue('product_list', product_list)
  }

  const handleDeleteCustomerType = (record) => {
    let { customer_type_list = [] } = formik.values || {};
    const findIndex = customer_type_list.findIndex((x) => x.customer_type_id == record.customer_type_id)
    customer_type_list.splice(findIndex, 1)
    formik.setFieldValue('customer_type_list', customer_type_list)
  }
  function disabledDate(current) {

    return current && current.valueOf() < moment().add(-1, 'days');
  }

  const handleChangeDate = (startDate, endDate) => {
    formik.setFieldValue('start_date', startDate ? moment(startDate).format('DD/MM/YYYY') : '');
    formik.setFieldValue('end_date', endDate ? moment(endDate).format('DD/MM/YYYY') : '');
  }

  return (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
              {/* <b>{id ? "Chỉnh sửa" : "Thêm mới"}  </b> */}
              <b>{id ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} mã khuyến mãi </b>
            </CardHeader>

            <CardBody>
              {alerts.map(({ color, msg }, idx) => {
                return (
                  <Alert
                    key={`alert-${idx}`}
                    color={color}
                    isOpen={true}
                    toggle={() => setAlerts({ alerts: [] })}
                  >
                    <span dangerouslySetInnerHTML={{ __html: msg }} />
                  </Alert>
                );
              })}
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                <Row xs={12} sm={12}>
                  <Col xs={6} sm={6}>
                    <FormGroup>
                      <Label for="letter" sm={12}>
                        Nhập code <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={12}>
                        <Input
                          name="discount_code"
                          id="discount_code"
                          type="text"
                          placeholder="Nhập mã code"
                          disabled={noEdit}
                          value={formik.values.discount_code}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.discount_code && formik.touched.discount_code ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.discount_code}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label for="is_discount" sm={12}>
                        Hình thức khuyến mãi <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={12}>
                        <Radio.Group onChange={(e) => handleChangeDiscountType(e.target.value)}>
                          <Space direction="vertical">
                            <Radio checked={formik.values.is_percent_discount} value={0}>%</Radio>
                            <Radio checked={formik.values.is_money_discount} value={1}>Tiền cố định</Radio>
                          </Space>
                        </Radio.Group>
                        {formik.errors.is_discount && formik.touched.is_discount ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.is_discount}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label for="is_appoint_product" sm={12}>
                        Áp dụng cho <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={12}>
                        <Space direction="vertical">
                          <Radio onChange={(e) => handleChangeApplyProduct(e.target.value)}
                            checked={formik.values.is_all_product} value={0}>Toàn bộ sản phẩm</Radio>
                          <Radio checked={formik.values.is_appoint_product}
                            onChange={(e) => handleChangeApplyProduct(e.target.value)}
                            value={1}>Sản phẩm chỉ định</Radio>
                        </Space>


                        <div style={{ marginTop: 8 }}>
                          <Select
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            placeholder={"-- Chọn --"}
                            isDisabled={!formik.values.is_appoint_product}
                            onChange={(e) => handleSelectProduct(e)}
                            value={''}
                            options={optionProduct()}
                          />
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Table
                            columns={columns_product(handleDeleteProduct)}
                            dataSource={[...formik.values.product_list]}
                            pagination={false}
                            bordered={true}
                            locale={{
                              emptyText: 'Không có dữ liệu',
                            }}

                          />
                        </div>


                        {formik.errors.is_appoint_product && formik.touched.is_appoint_product ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.is_appoint_product}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={12}>
                        <Checkbox checked={formik.values.is_apply_orther_discount} >Không áp dụng đồng thời với các CT khuyến mãi khác</Checkbox>
                      </Col>
                    </FormGroup>

                    <FormGroup>
                      <Label for="is_none_requirement" sm={12}>
                        Yêu cầu được áp dụng khuyến mãi<span className="font-weight-bold red-text">*</span>
                      </Label>

                      <Col sm={12}>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div>
                            <Radio onChange={(e) => handleRequetDiscount(e.target.value)}
                              checked={formik.values.is_none_requirement}
                              value={1}>Không yêu cầu</Radio>
                          </div>
                          <div style={{ marginTop: 8 }}>
                            <Radio onChange={(e) => handleRequetDiscount(e.target.value)}
                              checked={formik.values.is_mintotal_money}
                              value={2}>Giá trị đơn hàng tối thiểu</Radio>
                          </div>
                          <Input
                            style={{ marginTop: 8, display: 'block' }}
                            name="is_mintotal_money"
                            id="is_mintotal_money"
                            type="text"
                            placeholder="Đơn giá tối thiểu"
                            disabled={noEdit ? noEdit : !formik.values.is_mintotal_money}
                            value={formik.values.letter_name}
                            onChange={formik.handleChange}
                          />
                          <div style={{ marginTop: 8 }}>
                            <Radio onChange={(e) => handleRequetDiscount(e.target.value)}
                              checked={formik.values.is_min_product}
                              value={3}>Số lượng sản phẩm mua tối thiểu</Radio>
                          </div>
                          <Input
                            style={{ marginTop: 8, display: 'block' }}
                            name="is_value_min_product"
                            id="is_value_min_product"
                            type="text"
                            placeholder="Sản phẩm tối thiểu"
                            disabled={noEdit ? noEdit : !formik.values.is_min_product}
                            value={formik.values.letter_name}
                            onChange={formik.handleChange}
                          />
                        </div>


                        {formik.errors.letter_name && formik.touched.letter_name ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.letter_name}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs={6} sm={6}>
                    <FormGroup>
                      <Label for="discount_status" sm={12}>
                        Trạng thái <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={12}>
                        <Select
                          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          placeholder={"-- Chọn --"}
                          isDisabled={true}
                          onChange={(e) => {

                          }}
                          value={''}
                          options={dataStatus.map(({ name: label, id: value }) => ({
                            value,
                            label,
                          }))}
                        />
                        {formik.errors.discount_status && formik.touched.discount_status ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.discount_status}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label for="discount_value" sm={12}>
                        Giá trị <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={12}>
                        <Input
                          name="discount_value"
                          id="discount_value"
                          type="number"
                          placeholder="Giá trị"
                          min={0}
                          disabled={noEdit}
                          value={formik.values.discount_value}
                          onChange={formik.handleChange}
                        >
                        </Input>

                        {formik.errors.discount_value && formik.touched.discount_value ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.discount_value}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label for="is_app_point_customer_type" sm={12}>
                        Đối tượng khách hàng áp dụng <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={12}>

                        <Space direction="vertical">
                          <Radio checked={formik.values.is_all_customer_type}
                            onChange={(e) => handleChangeCustomer(e.target.value)}
                            value={0}>Tất cả khách hàng</Radio>
                          <Radio checked={formik.values.is_app_point_customer_type}
                            onChange={(e) => handleChangeCustomer(e.target.value)}
                            value={1}>Khách hàng chỉ định</Radio>
                        </Space>


                        <div style={{ marginTop: 8 }}>
                          <Select
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            placeholder={"-- Chọn --"}
                            isDisabled={!formik.values.is_app_point_customer_type}
                            onChange={(e) => handleSelectCustomerType(e)}
                            value={''}
                            options={optionCustomerType()}
                          />
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Table
                            columns={columns_customer_type(handleDeleteCustomerType)}
                            dataSource={[...formik.values.customer_type_list]}
                            pagination={false}
                            bordered={true}
                            locale={{
                              emptyText: 'Không có dữ liệu',
                            }}

                          />
                        </div>


                        {formik.errors.is_app_point_customer_type && formik.touched.is_app_point_customer_type ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.is_app_point_customer_type}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label for="date_apply" sm={12}>
                        Thời gian áp dụng <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={12}>
                        <DatePicker
                          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          startDate={formik.values.start_date ? moment(formik.values.start_date, "DD/MM/YYYY") : ""}
                          startDateId="your_unique_start_date_id"
                          endDate={formik.values.end_date ? moment(formik.values.end_date, "DD/MM/YYYY") : ""}
                          endDateId="your_unique_end_date_id"
                          onDatesChange={({ startDate, endDate }) => {
                            handleChangeDate(startDate, endDate)
                          }}
                          isMultiple
                          minToday={disabledDate}
                        />
                        {formik.errors.start_date && formik.touched.start_date ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.start_date}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label for="description" sm={12}>
                        Ghi chú
                      </Label>
                      <Col sm={12}>
                        <Input
                          name="description"
                          id="description"
                          type="textarea"
                          placeholder="Ghi chú"
                          disabled={noEdit}
                          value={formik.values.description}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.description && formik.touched.description ? (
                          <div
                            className="field-validation-error alert alert-danger fade show"
                            role="alert"
                          >
                            {formik.errors.description}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Col xs={12} sm={12}>
                  <Row>

                    <Col xs={10}>
                      <Row>
                        <Col>
                          <FormGroup row>
                            <Col>
                              <Checkbox
                                className="mr-1"
                                disabled={noEdit}
                                onChange={(e) => {
                                  formik.setFieldValue(`is_active`, e.target.checked ? 1 : 0);
                                }}
                                checked={formik.values.is_active}
                              ></Checkbox>

                              <Label for="desc">Kích hoạt</Label>
                            </Col>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <div className="text-right mb-2">
                  <div>
                    {noEdit ? (
                      <CheckAccess permission="MD_DISCOUNT_VIEW">
                        <Button
                          color="primary"
                          className="mr-2 btn-block-sm"
                          onClick={() => window._$g.rdr(`/discount/edit/${dataDiscount.letter_id}`)}
                        >
                          <i className="fa fa-edit mr-1" />
                          Chỉnh sửa
                        </Button>
                      </CheckAccess>
                    ) : (
                      <>
                        <CheckAccess permission={id ? `MD_DISCOUNT_EDIT` : `MD_DISCOUNT_ADD`}>
                          <button
                            className="mr-2 btn-block-sm btn btn-primary"
                            onClick={() => {
                              setbtnType("save");
                            }}
                            type="submit"
                          >
                            <i className="fa fa-save mr-1" />
                            Lưu
                          </button>
                        </CheckAccess>
                        <CheckAccess permission={id ? `MD_DISCOUNT_EDIT` : `MD_DISCOUNT_ADD`}>
                          <button
                            className="mr-2 btn-block-sm btn btn-success"
                            onClick={() => {
                              setbtnType("save&quit");
                            }}
                            type="submit"
                          >
                            <i className="fa fa-save mr-1" />
                            Lưu và đóng
                          </button>
                        </CheckAccess>
                      </>
                    )}
                    <button
                      className=" btn-block-sm btn btn-secondary"
                      type="button"
                      onClick={() => window._$g.rdr(`/letter`)}
                    >
                      <i className="fa fa-times-circle mr-1" />
                      Đóng
                    </button>
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DiscountAdd;
