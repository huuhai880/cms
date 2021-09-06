import React from "react";
// import { Formik, Form } from "formik";
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
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CustomInput,
  FormGroup,
  Label,
  Input,
  Form,
} from "reactstrap";
import "react-image-lightbox/style.css";
import {
  FormInput,
  FormSwitch,
  FormSelect,
  FormSelectGroup,
  ListImage,
  FormRichEditor,
  ActionButton,
  FormCreateSelect,
  YoutubePreview,
  FormDatePicker,
  GenQR,
} from "@widget";
import { useState } from "react";
import Select from "react-select";
import { Editor } from "@tinymce/tinymce-react";
import NumberFormat from "../Common/NumberFormat";
import {
  convertValue,
  mapDataOptions4Select,
  readFileAsBase64,
  readImageAsBase64,
} from "../../utils/html";
import AuthorModel from "../../models/AuthorModel/index";
import ProductImage from "./ProductImage";
import SelectProductCategory from "./SelectProductCategory";
import ProductCategoryModel from "models/ProductCategoryModel/index";
import { useEffect } from "react";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./ProductConstant";
import ProductModel from "models/ProductModel/index";
import MessageError from "./MessageError";
import Loading from "../Common/Loading";

const _authorModel = new AuthorModel();
const _productCategoryModel = new ProductCategoryModel();
const _productModel = new ProductModel();

function ProductAdd({ noEdit = false, productId = null }) {
  const [alerts, setAlerts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [product, setProduct] = useState(initialValues);
  const [buttonType, setButtonType] = useState(null);
  const [attributesGroup, setAttributesGroup] = useState([]);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: product,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      handleSubmitProduct(values);
    },
  });

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setLoading(true);
    try {
      if (productId) {
        let product = await _productModel.read(productId);
        let value = {
            ...initialValues,
            ...product
        }
        setProduct(value);
      }
      
      let data = await _productCategoryModel.getOptions({ is_active: 1 });
      let productCategoryOption = mapDataOptions4Select(data);

      productCategoryOption = productCategoryOption.map((item) => {
        return {
          ...item,
          parent_id: item.parent_id ? item.parent_id : 0,
        };
      });
      setProductCategories(productCategoryOption);
      let listAttributesGroup = await _productModel.getListAttributesGroup();
      setAttributesGroup(listAttributesGroup);
    } catch (error) {
      window._$g.dialogs.alert(
        window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (blobInfo, success, failure) => {
    readImageAsBase64(blobInfo.blob(), async (imageUrl) => {
      try {
        const imageUpload = await _authorModel.upload({
          base64: imageUrl,
          folder: "files",
          includeCdn: true,
        });
        success(imageUpload);
      } catch (error) {
        failure(error);
      }
    });
  };

  const handleOnKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  const handleSubmitForm = (type) => {
    setButtonType(type);
    formik.submitForm();
  };

  const handleSubmitProduct = async (values) => {
    try {
      let result = false;
      if (productId) {
        result = await _productModel.update(productId, values);
      } else {
        result = await _productModel.create(values);
      }

      window._$g.toastr.show("Lưu thành công!", "success");
      if (buttonType == "save_n_close") {
        return window._$g.rdr("/product");
      }

      if (buttonType == "save" && !productId) {
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
  };

  const handleAddAttributeProduct = () => {
    let attribute_add = {
      product_id: null,
      attributes_group_id: null,
      interprets: [],
    };
    let { product_attributes = [] } = formik.values || {};
    let check_attribute = product_attributes.find(
      (p) => p.attributes_group_id == attribute_add
    );
    if (!check_attribute) {
      formik.setFieldValue("product_attributes", [
        ...product_attributes,
        attribute_add,
      ]);
    }
  };

  const optionAttributesGroup = () => {
    let { product_attributes = [] } = formik.values || {};
    if (attributesGroup && attributesGroup.length > 0) {
      return attributesGroup.map(
        ({ attributes_group_id: value, attributes_group_name: label }) => {
          return product_attributes.find((p) => p.attributes_group_id == value)
            ? {
                value,
                label,
                isDisabled: true,
              }
            : { value, label };
        }
      );
    }
    return [];
  };

  const handleChangeAttributesGroup = (selected, index) => {
    let attrProduct = [...formik.values.product_attributes];
    attrProduct[index].attributes_group_id = selected ? selected.value : null;
    formik.setFieldValue("product_attributes", attrProduct);
  };

  const optionInterpretDetail = (attributes_group_id) => {
    if (attributesGroup && attributesGroup.length > 0) {
      let attributeGg = attributesGroup.find(
        (p) => p.attributes_group_id == attributes_group_id
      );
      return attributeGg
        ? attributeGg.interprets.map(
            ({ interpret_detail_id: value, interpret_detail_name: label }) => {
              return {
                label,
                value,
              };
            }
          )
        : [];
    }
    return [];
  };

  const handleChangeInterpretDetail = (selected, index) => {
    let attrProduct = [...formik.values.product_attributes];

    let { attributes_group_id } = attrProduct[index];
    let attributeGg = attributesGroup.find(
      (p) => p.attributes_group_id == attributes_group_id
    );

    let interpret_select =
      attributeGg && selected
        ? attributeGg.interprets.filter((p) => {
            return selected.find((x) => x.value == p.interpret_detail_id);
          })
        : [];

    attrProduct[index].interprets = interpret_select
      ? interpret_select.map(
          ({ interpret_detail_id, interpret_id, attribute_id }) => {
            return {
              interpret_detail_id,
              interpret_id,
              attribute_id,
            };
          }
        )
      : [];
    formik.setFieldValue("product_attributes", attrProduct);
  };

  const handleRemoveAttributeProduct = (index) => {
    let attrProduct = [...formik.values.product_attributes];
    attrProduct.splice(index, 1);
    formik.setFieldValue("product_attributes", attrProduct);
  };

  const renderProductAttributes = () => {
    return formik.values.product_attributes &&
      formik.values.product_attributes.length ? (
      <Table
        size="sm"
        bordered
        striped
        hover
        className="tb-product-attributes mt-2"
      >
        <tbody>
          {formik.values.product_attributes.map((item, index) => (
            <tr key={index}>
              <td style={{ width: "30%" }}>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id={`attribute_group_id_${item.attributes_group_id}`}
                  name={`attribute_group_id_${item.attributes_group_id}`}
                  onChange={(value) =>
                    handleChangeAttributesGroup(value, index)
                  }
                  isSearchable={true}
                  placeholder={"-- Chọn Thuộc tính --"}
                  value={convertValue(
                    item.attributes_group_id,
                    optionAttributesGroup() || []
                  )}
                  options={optionAttributesGroup()}
                  isDisabled={noEdit}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.querySelector("body")}
                />
              </td>
              <td>
                <Select
                  className="MuiPaper-filter__custom--select"
                  name="attribute_group_id"
                  onChange={(selected) =>
                    handleChangeInterpretDetail(selected, index)
                  }
                  isSearchable={true}
                  placeholder={"-- Chọn Luận giải --"}
                  value={convertValue(
                    (item.interprets || []).map((x) => x.interpret_detail_id),
                    optionInterpretDetail(item.attributes_group_id) || []
                  )}
                  options={optionInterpretDetail(item.attributes_group_id)}
                  isMulti={true}
                  isDisabled={noEdit}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.querySelector("body")}
                />
              </td>
              <td
                style={{
                  width: "5%",
                  verticalAlign: "middle",
                }}
                className="text-center"
              >
                {!noEdit && (
                  <Button
                    color="danger"
                    onClick={() => handleRemoveAttributeProduct(index)}
                    className="btn-sm"
                  >
                    {" "}
                    <i className="fa fa-trash" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : null;
  };

  return loading ? (
    <Loading />
  ) : (
    <div key={`view-${productId || 0}`} className="animated fadeIn">
      <Row className="d-flex justify-content-center">
        <Col xs={12} md={12}>
          <Card>
            <CardHeader>
              <b>
                {productId ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"}{" "}
                sản phẩm {productId ? product.product_name : ""}
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
                onKeyDown={handleOnKeyDown}
              >
                <Row>
                  <Col xs={12} sm={12} md={7} lg={7}>
                    <Row className="mb-4">
                      <Col xs={12}>
                        <b className="title_page_h1 text-primary">
                          Thông tin sản phẩm
                        </b>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12} sm={12}>
                        <FormGroup row>
                          <Label className="col-sm-4 col-form-label">
                            Danh mục sản phẩm
                            <span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <SelectProductCategory
                              name="product_category_id"
                              onChange={(item) => {
                                let product_category_id = item
                                  ? item.value
                                  : null;
                                formik.setFieldValue(
                                  "product_category_id",
                                  product_category_id
                                );
                              }}
                              isSearchable={true}
                              defaultValue={(productCategories || []).find(
                                ({ value }) =>
                                  1 * value ==
                                  1 * formik.values.product_category_id
                              )}
                              listOption={productCategories}
                              isDisabled={noEdit}
                              isClearable={true}
                              id={
                                productId ? product.product_category_id : null
                              }
                            />
                            <MessageError
                              formik={formik}
                              name="product_category_id"
                            />
                          </Col>
                        </FormGroup>
                      </Col>

                      <Col xs={12} sm={12}>
                        <FormGroup row>
                          <Label className="col-sm-4 col-form-label">
                            Tên sản phẩm
                            <span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <Input
                              type="text"
                              placeholder="Tên sản phẩm"
                              disabled={noEdit}
                              name="product_name"
                              {...formik.getFieldProps("product_name")}
                            />
                            <MessageError formik={formik} name="product_name" />
                          </Col>
                        </FormGroup>
                      </Col>

                      <Col xs={12} sm={12}>
                        <FormGroup row>
                          <Label className="col-sm-4 col-form-label">
                            Tên hiển thị web
                            <span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <Input
                              type="text"
                              placeholder="Tên hiển thị Web"
                              disabled={noEdit}
                              name="product_name_show_web"
                              {...formik.getFieldProps("product_name_show_web")}
                            />
                            <MessageError
                              formik={formik}
                              name="product_name_show_web"
                            />
                          </Col>
                        </FormGroup>
                      </Col>

                      <Col xs={12} sm={12}>
                        <FormGroup row>
                          <Label className="col-sm-4 col-form-label">
                            Url sản phẩm
                            {/* <span className="font-weight-bold red-text">*</span> */}
                          </Label>
                          <Col sm={8}>
                            <Input
                              type="text"
                              placeholder="Url sản phẩm"
                              disabled={noEdit}
                              name="url_product"
                              {...formik.getFieldProps("url_product")}
                            />
                            {/* <MessageError formik={formik} name="url_product" /> */}
                          </Col>
                        </FormGroup>
                      </Col>

                      {/* <Col xs={12} sm={12}>
                        <FormGroup row>
                          <Label className="col-sm-4 col-form-label">
                            Giá sản phẩm
                            <span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <NumberFormat
                              name="price"
                              value={1 * formik.values.price}
                              disabled={noEdit}
                              onValueChange={({ value }) => {
                                let price = 1 * value.replace(/,/g, "");
                                formik.setFieldValue("price", price);
                              }}
                              min={0}
                              style={{ width: "100%" }}
                            />
                            <MessageError formik={formik} name="price" />
                          </Col>
                        </FormGroup>
                      </Col> */}

                      <Col xs={12} sm={12}>
                        <FormGroup row>
                          <Label className="col-sm-4 col-form-label">
                            Mô tả ngắn ngọn
                            <span className="font-weight-bold red-text">*</span>
                          </Label>
                          <Col sm={8}>
                            <Input
                              type="textarea"
                              placeholder="Mô tả ngắn ngọn"
                              disabled={noEdit}
                              rows={4}
                              name="short_description"
                              {...formik.getFieldProps("short_description")}
                            />
                            <MessageError
                              formik={formik}
                              name="short_description"
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={12} sm={12} md={5} lg={5}>
                    <ProductImage
                      title="Ảnh sản phẩm"
                      canEdit={!noEdit}
                      name="product_images"
                      formik={formik}
                    />
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col xs={12}>
                    <b className="title_page_h1 text-primary">
                      Thuộc tính sản phẩm{" "}
                    </b>
                    <span className="font-weight-bold red-text"> * </span>
                  </Col>

                  <Col sm={12}>
                    {renderProductAttributes()}
                    <MessageError formik={formik} name="product_attributes" />
                  </Col>

                  <Col xs={12}>
                    {!noEdit && (
                      <Button
                        className="btn-sm mt-1"
                        color="secondary"
                        onClick={handleAddAttributeProduct}
                        disabled={
                          (formik.values.product_attributes || []).length ==
                          attributesGroup.length
                        }
                      >
                        <i className="fa fa-plus mr-2" />
                        Thêm thuộc tính
                      </Button>
                    )}
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col xs={12}>
                    <b className="title_page_h1 text-primary">
                      Nội dung sản phẩm{" "}
                    </b>
                    <span className="font-weight-bold red-text"> * </span>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <FormGroup row>
                      <Col sm={12} xs={12}>
                        <Editor
                          apiKey={
                            "3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"
                          }
                          scriptLoading={{
                            delay: 500,
                          }}
                          value={formik.values.product_content_detail}
                          disabled={noEdit}
                          init={{
                            height: "300px",
                            width: "100%",
                            menubar: false,
                            branding: false,
                            statusbar: false,
                            plugins: [
                              "advlist autolink fullscreen lists link image charmap print preview anchor",
                              "searchreplace visualblocks code fullscreen ",
                              "insertdatetime media table paste code help",
                              "image imagetools ",
                              "toc",
                            ],
                            menubar:
                              "file edit view insert format tools table tc help",
                            toolbar1:
                              "undo redo | fullscreen | formatselect | bold italic backcolor | \n" +
                              "alignleft aligncenter alignright alignjustify",
                            toolbar2:
                              "bullist numlist outdent indent | removeformat | help | image | toc",
                            file_picker_types: "image",
                            images_dataimg_filter: function (img) {
                              return img.hasAttribute("internal-blob");
                            },
                            images_upload_handler: handleUploadImage,
                          }}
                          onEditorChange={(newValue) => {
                            formik.setFieldValue(
                              "product_content_detail",
                              newValue
                            );
                          }}
                        />
                        <MessageError
                          formik={formik}
                          name="product_content_detail"
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} className="m-t-10 mb-2 mt-2">
                    <FormGroup row>
                      <Col sm={2} xs={12}>
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
                      <Col sm={2} xs={12} className="offset-xs-0">
                        <CustomInput
                          className="pull-left"
                          onBlur={null}
                          checked={formik.values.is_show_web}
                          type="checkbox"
                          id="is_show_web"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "is_show_web",
                              e.target.checked
                            );
                          }}
                          label="Hiển thị Web"
                          disabled={noEdit}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col xs={12} sm={12} style={{ padding: "0px" }}>
                    <ActionButton
                      isSubmitting={formik.isSubmitting}
                      buttonList={[
                        {
                          title: "Chỉnh sửa",
                          color: "primary",
                          isShow: noEdit,
                          icon: "edit",
                          permission: "MD_PRODUCT_EDIT",
                          notSubmit: true,
                          onClick: () =>
                            window._$g.rdr(`/product/edit/${productId}`),
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
                          onClick: () => window._$g.rdr("/product"),
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
    </div>
  );
}

export default ProductAdd;
