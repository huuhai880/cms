import React from 'react';
import * as Yup from "yup";
import {
   Alert,
   Card,
   CardBody,
   CardHeader,
   Col,
   Row,
   Button,
   Table,
   Modal,
   ModalBody,
   CustomInput,
   FormGroup,
   Label,
   Input,
   Form,
} from "reactstrap";
import {ActionButton} from "@widget";

import { useState } from "react";
import NumberFormat from "../Common/NumberFormat";
import { useEffect } from "react";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./_constant";
import MessageError from "../Product/MessageError";
import Loading from "../Common/Loading";
import './style.scss'
import Upload from "../Common/Antd/Upload";
import Product from 'components/Product/Product';
import ProductComboModel from 'models/ProductComboModel/index';

const _productComboModel = new ProductComboModel();

function ProductComboAdd({ comboId = null, noEdit = false }) {
   const [combo, setCombo] = useState(initialValues)
   const [alerts, setAlerts] = useState([])
   const [buttonType, setButtonType] = useState(null);
   const [isShowAddProduct, setShowAddProduct] = useState(false)
   const [loading, setLoading] = useState(false);

   const formik = useFormik({
      enableReinitialize: true,
      initialValues: combo,
      validationSchema,
      validateOnBlur: false,
      validateOnChange: true,
      onSubmit: (values) => {
         handleSubmitProductCombo(values);
      },
   });

   useEffect(() => {
      initData();
   }, [])

   const initData = async () => {
      setLoading(true);
      try {
         if (comboId) {
            let combo = await _productComboModel.read(comboId);
            let value = {
               ...initialValues,
               ...combo
            }
            setCombo(value);
         }
      } catch (error) {
         window._$g.dialogs.alert(
            window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại")
         );
      } finally {
         setLoading(false);
      }
   }

   const handleOnKeyDown = (keyEvent) => {
      if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
         keyEvent.preventDefault();
      }
   };

   const handleSubmitProductCombo = async (values) => {
      try {
         let result = false;
         if (comboId) {
            result = await _productComboModel.update(comboId, values);
         } else {
            result = await _productComboModel.create(values);
         }
         window._$g.toastr.show("Lưu thành công!", "success");
         if (buttonType == "save_n_close") {
            return window._$g.rdr("/product-combo");
         }

         if (buttonType == "save" && !comboId) {
            formik.setFieldValue('combo_image_url', null)
            formik.resetForm();
         }
      } catch (error) {
         let { errors, statusText, message } = error;
         let msg = [`<b>${statusText || message}</b>`]
            .concat(errors || [])
            .join("<br/>");

         setAlerts([{ color: "danger", msg }]);
         window.scrollTo(0, 0);
      } finally {
         formik.setSubmitting(false);
      }
   }

   const handleSubmitForm = (type) => {
      setButtonType(type);
      formik.submitForm();
   };

   const handleAddProduct = (products = {}) => {
      setShowAddProduct(false)
      let _combo_products = [...formik.values.combo_products] || [];
      let _products = Object.keys(products).length == 0 ? _combo_products :
         (Object.keys(products) || []).reduce((arr, key) => {
            arr.push(products[key]);
            return arr;
         }, []);

      if (_products.length > 0) {
         for (let index = 0; index < _products.length; index++) {
            const product = _products[index];
            let check = _combo_products.find(p => p.product_id == product.product_id);
            if (!check) {
               let product_combo = {
                  combo_id: combo.combo_id,
                  product_id: product.product_id,
                  product_name: product.product_name,
                  number_search: 1,
                  is_time_limit: false,
                  time_limit: 0
               }
               _combo_products.push(product_combo)
            }
         }
      }

      formik.setFieldValue('combo_products', _combo_products)
   }

   const isAllowed = (values) => {
      // const { formattedValue, floatValue } = values;
      // return  floatValue <= 999;
      const { floatValue = 0 } = values;
      return floatValue >= 0 && floatValue <= 999;
   }

   const handleDeleteProduct = index => {
      let { combo_products = [] } = formik.values;
      combo_products.splice(index, 1)
      formik.setFieldValue('combo_products', combo_products)
   }

   const handleChangeValueProduct = (value, name, index) => {
      let _combo_products = [...formik.values.combo_products] || [];
      _combo_products[index][name] = value;
      if (name == 'is_time_limit' && !value) {
         _combo_products[index]['time_limit'] = 0;
      }
      formik.setFieldValue('combo_products', _combo_products)
   }

   return loading ? <Loading /> : (
      <div key={`view-${comboId || 0}`} className="animated fadeIn">
         <Row className="d-flex justify-content-center">
            <Col xs={12} md={12}>
               <Card>
                  <CardHeader>
                     <b>
                        {comboId ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"}{" "}
                        combo {comboId ? combo.combo_name : ""}
                     </b>
                  </CardHeader>
                  <CardBody>
                     {alerts.map(({ color, msg }, idx) => {
                        return (
                           <Alert
                              key={`alert-${idx}`}
                              color={color}
                              isOpen={true}
                              toggle={() => setAlerts([])}>
                              <span dangerouslySetInnerHTML={{ __html: msg }} />
                           </Alert>
                        );
                     })}

                     <Form
                        id="frmProduct"
                        onSubmit={formik.handleSubmit}
                        onKeyDown={handleOnKeyDown}>

                        <Row>
                           <Col xs={12} sm={12} md={9} lg={9}>
                              <Row className="mb-4">
                                 <Col xs={12}>
                                    <b className="underline title_page_h1 text-primary">Thông tin Combo</b>
                                 </Col>
                              </Row>
                              <Row>
                                 <Col xs={12}>
                                    <FormGroup row>
                                       <Label
                                          className="text-left"
                                          sm={3}>
                                          Tên Combo
                                          <span className="font-weight-bold red-text"> *</span>
                                       </Label>
                                       <Col sm={9}>
                                          <Input
                                             className="text-left"
                                             type="text"
                                             id="combo_name"
                                             name="combo_name"
                                             placeholder="Tên combo"
                                             disabled={noEdit}
                                             maxLength={400}
                                             {...formik.getFieldProps('combo_name')}
                                          />
                                          <MessageError formik={formik} name="combo_name" />
                                       </Col>
                                    </FormGroup>
                                 </Col>
                                 <Col sm={12}>
                                    <FormGroup row>
                                       <Label className="col-sm-3 col-form-label">
                                          Mô tả
                                       </Label>
                                       <Col sm={9}>
                                          <Input
                                             type="textarea"
                                             placeholder="Mô tả"
                                             disabled={noEdit}
                                             rows={6}
                                             name="description"
                                             {...formik.getFieldProps('description')}
                                          />
                                       </Col>
                                    </FormGroup>
                                 </Col>

                                 <Col sm={12}>
                                    <FormGroup row>
                                       <Label className="col-sm-3 col-form-label">

                                       </Label>
                                       <Col sm={9}>
                                          <CustomInput
                                             className="pull-left"
                                             onBlur={null}
                                             checked={formik.values.is_active}
                                             type="checkbox"
                                             id="is_active"
                                             onChange={(e) => {
                                                formik.setFieldValue("is_active", e.target.checked);
                                             }}
                                             label="Kích hoạt"
                                             disabled={noEdit}
                                          />
                                       </Col>
                                    </FormGroup>
                                 </Col>

                              </Row>
                           </Col>

                           <Col xs={12} sm={12} md={3} lg={3}>
                              <Row className="mb-4">
                                 <Col xs={12}>
                                    <b className="underline title_page_h1 text-primary">Hình ảnh</b>
                                 </Col>
                              </Row>
                              <Row>
                                 <Col xs={12}>
                                    <FormGroup row>
                                       <Col sm={12}>
                                          <div className="combo-image-upload">
                                             <Upload
                                                onChange={(img) => formik.setFieldValue('combo_image_url', img)}
                                                imageUrl={formik.values.combo_image_url}
                                                accept="image/*"
                                                disabled={noEdit}
                                                id={comboId}
                                             />
                                          </div>
                                       </Col>
                                    </FormGroup>
                                 </Col>
                              </Row>
                           </Col>
                        </Row>

                        <Row className="mb15">
                           <Col xs={12}>
                              <b className="underline title_page_h1 text-primary">Danh sách sản phẩm</b>
                           </Col>
                        </Row>

                        <Row>
                           <Col
                              sm={12}
                              className="d-flex align-items-center justify-content-end">
                              <Button
                                 key="buttonAddItem"
                                 color="success"
                                 disabled={noEdit}
                                 onClick={() => setShowAddProduct(true)}
                                 className="pull-right btn-block-sm mt-md-0 mt-sm-2 mb-2">
                                 <i className="fa fa-plus-circle mr-2" />
                                 Chọn sản phẩm
                              </Button>
                           </Col>
                        </Row>
                        <Row>
                           <Col xs={12} sm={12}>
                              <Table
                                 bordered
                                 className="table-news-related"
                                 striped
                                 style={{ marginBottom: 0 }}>
                                 <thead>
                                    <tr>
                                       <th className="text-center" style={{ width: 50 }}>STT</th>
                                       <th className="text-center">Tên sản phẩm</th>
                                       <th className="text-center" style={{ width: '20%' }}>SL tra cứu</th>
                                       <th className="text-center" style={{ width: '10%' }}>Giới hạn</th>
                                       <th className="text-center" style={{ width: '20%' }}>SL giới hạn</th>
                                       <th className="text-center" style={{ width: 100 }}>Thao tác</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {
                                       formik.values.combo_products && formik.values.combo_products.length > 0 ?
                                          formik.values.combo_products.map((item, index) => (
                                             <tr key={index}>
                                                <td className="text-center"
                                                   style={{
                                                      verticalAlign: "middle",
                                                   }}>{index + 1}</td>
                                                <td style={{
                                                   verticalAlign: "middle",
                                                }}>{item.product_name}</td>
                                                <td>
                                                   <NumberFormat
                                                      name={`number_search_${index}`}
                                                      value={item.number_search || ''}
                                                      disabled={noEdit}
                                                      onValueChange={({ value }) => {
                                                         let number_search = 1 * value.replace(/,/g, "");
                                                         handleChangeValueProduct(number_search, 'number_search', index)
                                                      }}
                                                      style={{ width: "100%" }}
                                                      isAllowed={isAllowed}
                                                   />
                                                </td>
                                                <td
                                                   className="text-center wrap-chbx"
                                                   style={{
                                                      verticalAlign: "middle",
                                                   }}
                                                >
                                                   <CustomInput
                                                      className="check-limit"
                                                      onBlur={null}
                                                      checked={item.is_time_limit}
                                                      type="checkbox"
                                                      id={`is_time_limit${index}`}
                                                      onChange={({ target }) => {
                                                         handleChangeValueProduct(target.checked, 'is_time_limit', index)
                                                      }}
                                                      disabled={noEdit}
                                                   />

                                                </td>
                                                <td>

                                                   <NumberFormat
                                                      name={`time_limit_${index}`}
                                                      value={item.time_limit || ''}
                                                      disabled={noEdit || !item.is_time_limit}
                                                      onValueChange={({ value }) => {
                                                         let time_limit = 1 * value.replace(/,/g, "");
                                                         handleChangeValueProduct(time_limit, 'time_limit', index)
                                                      }}
                                                      style={{ width: "100%" }}
                                                      isAllowed={isAllowed}
                                                   />
                                                </td>
                                                <td
                                                   className="text-center"
                                                   style={{
                                                      verticalAlign: "middle",
                                                   }}
                                                >
                                                   <Button
                                                      color="danger"
                                                      style={{
                                                         width: 24,
                                                         height: 24,
                                                         padding: 0,
                                                      }}
                                                      onClick={() => handleDeleteProduct(index)}
                                                      title="Xóa"
                                                      disabled={noEdit}
                                                   >
                                                      <i className="fa fa-minus-circle" />
                                                   </Button>
                                                </td>
                                             </tr>
                                          )) :

                                          <tr>
                                             <td className="text-center" colSpan={50}>
                                                Không có dữ liệu
                                             </td>
                                          </tr>
                                    }
                                 </tbody>
                              </Table>

                              <MessageError formik={formik} name="combo_products" />
                           </Col>
                        </Row>

                        <Row className="mt-4">
                           <Col xs={12} sm={12} style={{ padding: "0px" }}>
                              <ActionButton
                                 isSubmitting={formik.isSubmitting}
                                 buttonList={[
                                    {
                                       title: "Chỉnh sửa",
                                       color: "primary",
                                       isShow: noEdit,
                                       icon: "edit",
                                       permission: "PRO_COMBOS_EDIT",
                                       notSubmit: true,
                                       onClick: () =>
                                          window._$g.rdr(`/product-combo/edit/${comboId}`),
                                    },
                                    {
                                       title: "Lưu",
                                       color: "primary",
                                       isShow: !noEdit,
                                       notSubmit: true,
                                       icon: "save",
                                       onClick: () => handleSubmitForm("save"),
                                    },
                                    {
                                       title: "Lưu và đóng",
                                       color: "success",
                                       isShow: !noEdit,
                                       notSubmit: true,
                                       icon: "save",
                                       onClick: () => handleSubmitForm("save_n_close"),
                                    },
                                    {
                                       title: "Đóng",
                                       icon: "times-circle",
                                       isShow: true,
                                       notSubmit: true,
                                       onClick: () => window._$g.rdr("/product-combo"),
                                    },
                                 ]}
                              />
                           </Col>
                        </Row>
                     </Form>
                  </CardBody>
               </Card>
            </Col>
         </Row>

         {isShowAddProduct ? (
            <Modal isOpen={true} size={"lg"} style={{ maxWidth: "60rem" }}>
               <ModalBody className="p-0">
                  <Product
                     handlePick={handleAddProduct}
                     isOpenModal={isShowAddProduct}
                     products={formik.values.combo_products}
                  />
               </ModalBody>
            </Modal>
         ) : null}

      </div>
   );
}

export default ProductComboAdd;