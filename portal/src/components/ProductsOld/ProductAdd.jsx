import React, { PureComponent } from "react";
import { Formik, Form } from "formik";
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

// Util(s)
import { mapDataOptions4Select } from "@utils/html";
import PdfTable from "./PdfTable";
import urlFriendly from "@utils/urlFriendly";

// Assets
import "./styles.scss";

// Component(s)
import Loading from "../Common/Loading";
import NewsAdd from "../News/NewsAdd";
import ProductsRelated from "./ProductsRelated";
import ModelProductsRelated from "./ModalProductRelated";

// Model(s)
import { fnGet, fnUpdate, fnPost, fnDelete } from "@utils/api";
import moment from "moment";

/**
 * @class ProductAdd
 */
export default class ProductAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Bind method(s)
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);

    // +++
    this.state = {
      isCheckService: false,
      _id: 0,
      alerts: [],
      ready: false,
      activeTab: "thongtin",
      authors: [{ label: "-- Chọn --", value: "" }],
      productCategories: [],
      productModels: [{ label: "-- Chọn --", value: "" }],
      units: [{ label: "", value: "" }],
      publishingCompany: [{ label: "-- Chọn --", value: "" }],
      productAttributes: [],
      productAttributeList: [],
      attributeLength: 0,
      deletedAttributeList: [],
      selectedAttribute: [],
      qrList: [],
      isAddQr: false,
      qr_check_header: false,
      qr_check_list: [],
      qr_selected: [],
      isAddProductRelated: false,
      products_related: [],
      delete_product_related: [],
      create_product_related: [],
    };
  }

  componentDidMount() {
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true, qr_check_header: false });
    })();
    //.end
  }

  formikValidationSchema = Yup.object().shape({
    product_code: Yup.string().required("Mã sản phẩm là bắt buộc."),
    product_name: Yup.string()
      .required("Tên sản phẩm là bắt buộc.")
      .max(400, "Tên sản phẩm tối đa 400 ký tự."),
    author_id: Yup.string().required("Tác giả là bắt buộc"),
    publishing_company_id: Yup.string().required("Nhà xuất bản là bắt buộc"),
    release_time: Yup.string().required("Thời gian xuất bản là bắt buộc"),
    product_name_show_web: Yup.string()
      .required("Tên hiển thị trên web là bắt buộc.")
      .max(120, "Tên hiển thị trên web tối đa 120 ký tự."),
    short_description: Yup.string()
      .required("Mô tả ngắn gọn sản phẩm là bắt buộc.")
      .max(400, "Mô tả ngắn gọn tối đa 400 ký tự."),
    product_category_id: Yup.string().required(
      "Danh mục sản phẩm là bắt buộc."
    ),
    video_url: Yup.string().required("Link video là bắt buộc."),
    pictures: Yup.array().nullable().required("Hình ảnh là bắt buộc"),
    product_content_detail: Yup.string().required(
      "Chi tiết sản phẩm là bắt buộc"
    ),
  });

  /** @var {String} */
  _btnType = null;

  getInitialValues() {
    let { productEnt } = this.props;
    let values = {
      product_code: "",
      product_name: "",
      author_id: "",
      publishing_company_id: "",
      release_time: "",
      product_name_show_web: "",
      product_category_id: "",
      short_description: "",
      video_url: "",
      pictures: "",
      product_content_detail: "",
      is_active: 1,
      is_show_web: 0,
      is_show_home: 0,
    };

    if (productEnt) {
      values = {
        ...values,
        ...productEnt,
      };
    }
    return values;
  }

  toggleTab(activeTab) {
    this.setState({ activeTab });
  }

  /**
   * Goi API, lay toan bo data lien quan,...
   */
  async _getBundleData() {
    let { productEnt } = this.props;
    let [productCategories, units, authors, publishingCompany] =
      await Promise.all([
        fnGet({ url: "product-category/get-options", query: { is_active: 1 } }),
        fnGet({ url: "unit/get-options", query: { is_active: 1 } }),
        fnGet({ url: "author/get-options", query: { is_active: 1 } }),
        fnGet({
          url: "publishing-company/get-options",
          query: { is_active: 1 },
        }),
      ]);
    let returnData = {};
    returnData = {
      productCategories: mapDataOptions4Select(productCategories),
      units: [
        { label: "-- Chọn --", value: "" },
        ...mapDataOptions4Select(units),
      ],
      authors: [
        { label: "-- Chọn --", value: "" },
        ...mapDataOptions4Select(authors),
      ],
      publishingCompany: [
        { label: "-- Chọn --", value: "" },
        ...mapDataOptions4Select(
          publishingCompany.sort((a, b) => {
            return a.name.localeCompare(b.name);
          })
        ),
      ],
    };

    // console.log(
    //   "test",
    //   [...publishingCompany, { name: "b" }, { name: "a" }].sort((a, b) => {
    //     return a.name.localeCompare(b.name);
    //   })
    // );

    if (productEnt && productEnt.product_category_id) {
      let data = await fnGet({
        url: "product-category/get-category-attribute",
        query: {
          product_id: productEnt.product_id || "",
          category_id: productEnt.product_category_id || "",
        },
      });
      returnData["productAttributes"] = [...data];
      returnData["attributeLength"] = [...data].length;
      returnData["deletedAttributeList"] = data.filter((e) => !e.selected);
      returnData["productAttributeList"] = data.filter((e) => !!e.selected);
    }

    return returnData;
  }

  async handleProductCategoryChange(value, field) {
    let data = "";
    const { productEnt } = this.props;
    let productCode = "";
    let { deletedAttributeList } = this.state;
    if (
      productEnt &&
      productEnt.product_code &&
      productEnt.product_category_id == value
    ) {
      productCode = productEnt.product_code;
    } else {
      if (productEnt && productEnt.product_code) {
        data = productEnt.product_code.split("-")[1];
      } else {
        const { data: newOrder } = await fnGet({ url: "product/order-number" });
        data = newOrder;
      }
      const currentCategory = this.state.productCategories.find(
        (e) => e.id === value
      );
      // const shortName = currentCategory.name
      //   .replace(/[\W_]/g, " ")
      //   .trim()
      //   .split(" ")
      //   .map((e) => (e && e.length ? e[0].toUpperCase() : ""))
      //   .join("");
      const shortName = urlFriendly(currentCategory.name)
        .split("-")
        .map((e) => (e && e.length ? e[0].toUpperCase() : ""))
        .join("");

      productCode = "P" + shortName + moment().format("YYYYMM") + "-" + data;
    }
    field.onChange({
      target: { type: "text", name: "product_code", value: productCode },
    });

    let productAttributeList = await fnGet({
      url: "product-category/get-category-attribute",
      query: {
        product_id: productEnt ? productEnt.product_id || "" : "",
        category_id: value || "",
      },
    });

    deletedAttributeList = [];
    if (productEnt && value == productEnt.product_category_id) {
      deletedAttributeList = productAttributeList.filter((e) => !e.selected);
      productAttributeList = productAttributeList.filter((e) => !!e.selected);
    }
    this.setState({
      productAttributeList: [...productAttributeList],
      productAttributes: [...productAttributeList],
      attributeLength: productAttributeList.length,
      deletedAttributeList: [...deletedAttributeList],
    });
  }

  fnFillterAttributeList = () => {
    const attributes = this.state.productAttributes;
    let selected = new Set([]);
    this.state.productAttributeList();
  };

  async handdleAttributeSelect(value, index) {
    let { deletedAttributeList, productAttributeList } = this.state;
    const newAttribute = deletedAttributeList.find((e) => e.value == value);
    deletedAttributeList = deletedAttributeList.filter(
      (e) => e.value != newAttribute.value
    );
    deletedAttributeList.push({ ...productAttributeList[index] });
    productAttributeList[index] = newAttribute;
    this.setState({
      productAttributeList,
      deletedAttributeList,
    });
  }

  handleCreateNewAttributeValue(value, index) {
    const { productAttributeList } = this.state;
    const currentAttribute = productAttributeList[index];
    currentAttribute.attribute_values.unshift({
      value: value,
      label: value,
      attribute_value_id: value,
      attribute_value: value,
      porduct_attribute_id: productAttributeList[index].value,
    });
    currentAttribute.selected = value;
    this.setState({
      productAttributeList: [...productAttributeList],
    });
  }
  handleAttributeValueInput(value, index) {
    const { productAttributeList } = this.state;
    productAttributeList[index].selected = value.attribute_value_id;
    this.setState({
      productAttributeList,
    });
  }
  handleAddProductAttribute = () => {
    let { productAttributeList, deletedAttributeList } = this.state;
    productAttributeList.push(deletedAttributeList[0]);
    deletedAttributeList.shift();
    this.setState({
      productAttributeList: [...productAttributeList],
      deletedAttributeList,
    });
  };
  handleRemoveProductAttribute = (data, index) => {
    let { productAttributeList, deletedAttributeList } = this.state;
    const deleteAttribute = { ...productAttributeList[index] };
    productAttributeList = productAttributeList.filter(
      (e) => e.value !== data.value
    );
    this.setState({
      productAttributeList,
      deletedAttributeList: [...deletedAttributeList, deleteAttribute],
    });
  };

  async handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;
    return submitForm();
  }

  async handleFormikSubmit(values, formProps) {
    let { productEnt } = this.props;
    let { setSubmitting, resetForm } = formProps;
    let { deletedAttributeList } = this.state;

    let willRedirect = false;
    let alerts = [];

    let formData = {
      ...values,
    };

    let productId = (productEnt && productEnt.product_id) || "";
    setSubmitting(true);
    try {
      formData.product_attribute_values = this.state.productAttributeList;
      formData.release_time = moment(formData.release_time).format(
        "DD/MM/YYYY"
      );
      formData.is_show_web = 1 * formData.is_show_web || 0;
      formData.is_show_home = 1 * formData.is_show_home || 0;
      formData.is_active = 1 * formData.is_active || 0;
      formData.deleted_attributes = deletedAttributeList
        .map((e) => {
          const value = e.attribute_values.find((item) =>
            RegExp(/^s_/gm).test(item.value)
          );
          return value ? value.attribute_value_id.replace(/^s_/, "") : "";
        })
        .filter(Boolean);

      formData.newImages = [];
      formData.updateImages = [];
      formData.deleteImages = [];

      if (productId) {
        const { pictures } = formData;
        const mapImages = pictures.map((e, i) =>
          i === 0 ? { ...e, is_default: 1 } : { ...e, is_default: 0 }
        );
        const newImages = mapImages.filter((e) => e.product_picture_id === "");
        const updateImages = mapImages.filter(
          (e) => e.product_picture_id !== ""
        );
        const deleteImages = productEnt.pictures.filter(
          (e) =>
            !updateImages.find(
              (img) => img.product_picture_id === e.product_picture_id
            )
        );
        formData.newImages = newImages;
        formData.updateImages = updateImages;
        formData.deleteImages = deleteImages;

        await fnUpdate({
          url: `product/${productId}`,
          body: formData,
        });
        await fnPost({
          url: `product/update-product-related/${productId}`,
          body: {
            create_list: this.state.create_product_related.map(
              (e) => e.product_id
            ),
            delete_list: this.state.delete_product_related
              .filter((e) => !!e.product_related_id)
              .map((e) => e.product_related_id),
          },
        });
      } else {
        const { pictures } = formData;
        const mapImages = pictures.map((e, i) =>
          i === 0 ? { ...e, is_default: 1 } : { ...e, is_default: 0 }
        );
        const newImages = mapImages.filter((e) => e.product_picture_id === "");
        formData.newImages = newImages;

        const response = await fnPost({
          url: `product`,
          body: formData,
        });
        await fnPost({
          url: `product/update-product-related/${response.product_id}`,
          body: {
            create_list: this.state.create_product_related.map(
              (e) => e.product_id
            ),
            delete_list: [],
          },
        });
      }
      window._$g.toastr.show("Lưu thành công!", "success");
      if (this._btnType === "save_n_close") {
        willRedirect = true;
        return window._$g.rdr("/products");
      }

      if (this._btnType === "save") resetForm();
    } catch (e) {
      let { errors, statusText, message } = e;
      let msg = [`<b>${statusText || message}</b>`]
        .concat(errors || [])
        .join("<br/>");
      alerts.push({ color: "danger", msg });
    }

    setSubmitting(false);
    //
    if (!productEnt && !willRedirect && !alerts.length) {
      return this.handleFormikReset();
    }
    this.setState(
      () => ({ alerts }),
      () => {
        window.scrollTo(0, 0);
      }
    );
  }

  handleFormikReset() {
    // let { campaignEnt } = this.props;
    this.setState((state) => ({
      ready: false,
      alerts: [],
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    //.end
  }

  async handleGetQrList() {
    let { productEnt } = this.props;
    if (productEnt && productEnt.product_id) {
      const data = await fnGet({
        url: `product/get-qr/${productEnt.product_id}`,
      });
      const qr_check_list = data.map(() => false);
      this.setState({
        qrList: data.map((e) => ({
          ...e,
          qr: `${process.env.REACT_APP_WEBSITE}chi-tiet-tin-tuc/${urlFriendly(
            e.news_title
          )}-qr${e.news_id}`,
        })),
        qr_check_list,
      });
    }
  }
  handleToggleAddQr(value = "") {
    if (value === "refresh") {
      this.handleGetQrList();
    }
    this.setState({
      isAddQr: !this.state.isAddQr,
    });
  }
  handleAddQrNews() {
    this.handleToggleAddQr();
  }
  handleRemoveNews(id) {
    window._$g.dialogs.prompt(
      "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
      "Xóa",
      (confirm) => {
        if (confirm) {
          fnDelete({ url: `news/${id}` })
            .then(() => {
              this.handleGetQrList();
            })
            .catch(() => {
              window._$g.dialogs.alert(
                window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
              );
            });
        }
      }
    );
  }
  handleCheckHeader(bind) {
    const willCheck = bind || !this.state.qr_check_header;
    let childCheck = [];
    if (willCheck) {
      this.state.qr_check_list.forEach(() => childCheck.push(willCheck));
    }
    const selected = [...childCheck]
      .map((e, i) => (e ? i : -1))
      .filter((e) => e > -1);
    childCheck = Array.from(
      { length: this.state.qrList.length },
      (i) => (i = willCheck)
    );
    this.setState({
      qr_check_header: willCheck,
      qr_check_list: [...childCheck],
      qr_selected: selected,
    });
  }
  handleCheckItem(index) {
    let items = this.state.qr_check_list;
    items[index] = !items[index];
    let checkHeader = [...items].filter(Boolean).length === items.length;
    const selected = [...items]
      .map((e, i) => (!!e ? i : -1))
      .filter((e) => e > -1);
    this.setState({
      qr_check_header: checkHeader,
      qr_check_list: [...items],
      qr_selected: selected,
    });
  }
  handlePrint() {
    const selected = this.state.qr_selected;
    const qrList = this.state.qrList;
    const { values } = this.formikProps;
    const list = qrList.filter((_, i) => selected.some((e) => e === i));
    PdfTable({ list: list, header: values.product_name });
  }

  handleAddProductRelated() {
    this.handleToggleAddProductRelated();
  }
  handleToggleAddProductRelated() {
    this.setState({
      isAddProductRelated: !this.state.isAddProductRelated,
    });
  }

  addQrButton = null;
  addProductRelated = null;

  render() {
    let {
      _id,
      ready,
      alerts,
      productCategories,
      productAttributeList,
      deletedAttributeList,
      productAttributes,
      units,
      authors,
      publishingCompany,
      qrList,
      qr_check_header,
      qr_check_list,
      isAddQr,
      isAddProductRelated,
    } = this.state;
    let { productEnt, noEdit } = this.props;
    let initialValues = this.getInitialValues();
    // Ready?
    if (!ready) {
      return <Loading />;
    }
    return (
      <div key={`view-${_id}`} className="animated fadeIn">
        <Row className="d-flex justify-content-center">
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <b>
                  {productEnt
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  sản phẩm {productEnt ? productEnt.product_name : ""}
                </b>
              </CardHeader>
              <CardBody>
                {/* general alerts */}
                {alerts.map(({ color, msg }, idx) => {
                  return (
                    <Alert
                      key={`alert-${idx}`}
                      color={color}
                      isOpen={true}
                      toggle={() => this.setState({ alerts: [] })}
                    >
                      <span dangerouslySetInnerHTML={{ __html: msg }} />
                    </Alert>
                  );
                })}
                <Formik
                  initialValues={initialValues}
                  validationSchema={this.formikValidationSchema}
                  onSubmit={this.handleFormikSubmit}
                >
                  {(formikProps) => {
                    let { values, handleSubmit, handleReset, isSubmitting } =
                      (this.formikProps =
                      window._formikProps =
                        formikProps);
                    // Render
                    return (
                      <>
                        <Row>
                          <Nav tabs>
                            <NavItem>
                              <NavLink
                                className={`${
                                  this.state.activeTab === "thongtin"
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => this.toggleTab("thongtin")}
                              >
                                {" "}
                                Thông tin sản phẩm{" "}
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                className={`${
                                  this.state.activeTab === "qr" ? "active" : ""
                                }`}
                                onClick={() => {
                                  this.toggleTab("qr");
                                  this.handleGetQrList();
                                }}
                              >
                                {" "}
                                thông tin mã QR{" "}
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                className={`${
                                  this.state.activeTab === "productrelated"
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => {
                                  this.toggleTab("productrelated");
                                }}
                              >
                                {" "}
                                Sản phẩm liên quan{" "}
                              </NavLink>
                            </NavItem>
                          </Nav>
                          <TabContent
                            activeTab={this.state.activeTab}
                            style={{ width: "100%" }}
                          >
                            <TabPane tabId="thongtin">
                              <Form
                                id="form1st"
                                onSubmit={handleSubmit}
                                onReset={handleReset}
                              >
                                <Row>
                                  {/* start#Product info */}
                                  <Col xs={12} sm={12} md={7} lg={7}>
                                    <Row className="mb-4">
                                      <Col xs={12}>
                                        <b className="title_page_h1 text-primary">
                                          Thông tin danh mục
                                        </b>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <FormSelectGroup
                                        name="product_category_id"
                                        label="Danh mục sản phẩm"
                                        list={productCategories}
                                        isEdit={!noEdit}
                                        onChange={({ value }, field) =>
                                          this.handleProductCategoryChange(
                                            value,
                                            field
                                          )
                                        }
                                      />
                                      <FormInput
                                        label="Mã sản phẩm"
                                        name="product_code"
                                        isEdit={false}
                                      />
                                      <FormInput
                                        label="Tên sản phẩm"
                                        name="product_name"
                                        isEdit={!noEdit}
                                      />
                                      <FormSelect
                                        name="author_id"
                                        label="Tác giả"
                                        list={authors}
                                        isEdit={!noEdit}
                                      />
                                      <FormInput
                                        name="publishing_company"
                                        label="Nhà xuất bản"
                                        isEdit={!noEdit}
                                      />
                                      <FormDatePicker
                                        name="release_time"
                                        label="Ngày xuất bản"
                                        isEdit={!noEdit}
                                      />
                                      <FormInput
                                        label="Tên hiển thị trên web"
                                        name="product_name_show_web"
                                        isEdit={!noEdit}
                                      />
                                      <FormInput
                                        label="Mô tả ngắn gọn"
                                        type="textarea"
                                        name="short_description"
                                        isEdit={!noEdit}
                                      />
                                    </Row>
                                  </Col>
                                  <Col xs={12} sm={12} md={5} lg={5}>
                                    <YoutubePreview
                                      title="Link youtube sản phẩm"
                                      canEdit={!noEdit}
                                      name="video_url"
                                      value={values.video_url}
                                    />
                                    <ListImage
                                      title="Ảnh sản phẩm"
                                      canEdit={!noEdit}
                                      name="pictures"
                                      values={values.pictures}
                                      idName="product_picture_id"
                                    />
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs={12} className="mb-2">
                                    <b className="title_page_h1 text-primary">
                                      Thuộc tính
                                      <span className="font-weight-bold red-text">
                                        *
                                      </span>
                                    </b>
                                  </Col>
                                  {values.product_category_id ||
                                  (productEnt &&
                                    productEnt.product_category_id) ? (
                                    <React.Fragment>
                                      <Col sm={12}>
                                        <Table
                                          size="sm"
                                          bordered
                                          striped
                                          hover
                                          className="tb-product-attributes"
                                        >
                                          <tbody>
                                            {productAttributeList.map(
                                              (e, i) => (
                                                <tr
                                                  key={`product-attribute-${i}`}
                                                >
                                                  <td>
                                                    <FormSelect
                                                      defaultVal={e.value}
                                                      list={
                                                        e.value
                                                          ? [
                                                              e,
                                                              ...deletedAttributeList,
                                                            ]
                                                          : deletedAttributeList
                                                      }
                                                      onChange={({ value }) =>
                                                        this.handdleAttributeSelect(
                                                          value,
                                                          i
                                                        )
                                                      }
                                                      selectOnly={true}
                                                    />
                                                  </td>
                                                  <td>
                                                    <FormCreateSelect
                                                      defaultValue={
                                                        e.attribute_values
                                                          ? e.attribute_values.find(
                                                              (item) =>
                                                                item.attribute_value_id ==
                                                                e.selected
                                                            )
                                                          : ""
                                                      }
                                                      list={
                                                        e.attribute_values || []
                                                      }
                                                      onChange={(value) =>
                                                        this.handleAttributeValueInput(
                                                          value,
                                                          i
                                                        )
                                                      }
                                                      onCreateOption={(item) =>
                                                        this.handleCreateNewAttributeValue(
                                                          item,
                                                          i
                                                        )
                                                      }
                                                    />
                                                  </td>
                                                  <td>
                                                    <FormSelect
                                                      selectOnly={true}
                                                      isEdit={false}
                                                      defaultVal={e.unit_id}
                                                      list={units}
                                                    />
                                                  </td>
                                                  <td>
                                                    {!noEdit && (
                                                      <Button
                                                        color="danger"
                                                        onClick={() =>
                                                          this.handleRemoveProductAttribute(
                                                            e,
                                                            i
                                                          )
                                                        }
                                                        className="btn-sm"
                                                      >
                                                        {" "}
                                                        <i className="fa fa-trash" />
                                                      </Button>
                                                    )}
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </tbody>
                                        </Table>
                                      </Col>
                                      {!noEdit && (
                                        <Col xs={12}>
                                          <Button
                                            className="btn-sm"
                                            color="secondary"
                                            onClick={(evt) =>
                                              this.handleAddProductAttribute(
                                                evt
                                              )
                                            }
                                            disabled={
                                              productAttributes.length ===
                                              productAttributeList.length
                                            }
                                          >
                                            <i className="fa fa-plus mr-2" />
                                            Thêm thuộc tính
                                          </Button>
                                        </Col>
                                      )}
                                    </React.Fragment>
                                  ) : (
                                    <Col sm={12}>
                                      <div className="product-attributes-empty">
                                        <b className="text-danger">
                                          Bạn vui lòng chọn "Danh mục sản phẩm"
                                          để thực hiện
                                        </b>
                                      </div>
                                    </Col>
                                  )}
                                </Row>
                                <Row>
                                  <FormRichEditor
                                    label="Chi tiết sản phẩm"
                                    isEdit={!noEdit}
                                    name="product_content_detail"
                                    formikProps={formikProps}
                                    content={values.product_content_detail}
                                  />
                                </Row>
                                <Row>
                                  <FormSwitch
                                    name="is_active"
                                    label="Kích hoạt"
                                    isEdit={!noEdit}
                                    checked={values.is_active}
                                    sm={4}
                                  />
                                </Row>
                              </Form>
                            </TabPane>
                            <TabPane tabId="qr">
                              <Row>
                                <Col xs={12} ms={12}>
                                  <Button
                                    className="col-12 max-w-110 mb-2 mobile-reset-width mr-2"
                                    color="success"
                                    size="sm"
                                    onClick={() => this.handleAddQrNews()}
                                  >
                                    <i className="fa fa-plus mr-1" />
                                    Thêm mới
                                  </Button>
                                  <Button
                                    className="col-12 max-w-110 mb-2 mobile-reset-width"
                                    color="excel"
                                    size="sm"
                                    onClick={() => this.handlePrint()}
                                  >
                                    <i className="fa fa-download mr-1" />
                                    Tải QR
                                  </Button>
                                  <Table
                                    size="sm"
                                    bordered
                                    striped
                                    hover
                                    className="tb-product-qr"
                                  >
                                    <thead>
                                      <tr>
                                        <th>
                                          <div>
                                            <FormGroup
                                              check
                                              className="qr-formCheck"
                                            >
                                              <CustomInput
                                                type="checkbox"
                                                id="headerCheck"
                                                checked={
                                                  qr_check_header || false
                                                }
                                                onInput={() =>
                                                  this.handleCheckHeader()
                                                }
                                              />
                                            </FormGroup>
                                          </div>
                                        </th>
                                        <th>Bài viết</th>
                                        <th>Mã QR</th>
                                        <th>Xem trước</th>
                                        <th>Thao tác</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {qrList.map((e, i) => {
                                        let clickEmit = null;
                                        return (
                                          <tr>
                                            <td>
                                              <FormGroup
                                                check
                                                className="qr-formCheck"
                                              >
                                                <CustomInput
                                                  type="checkbox"
                                                  id={`check-${i}`}
                                                  checked={
                                                    qr_check_list[i] || false
                                                  }
                                                  onInput={() =>
                                                    this.handleCheckItem(i)
                                                  }
                                                />
                                              </FormGroup>
                                            </td>
                                            <td>{e.news_title}</td>
                                            <td>
                                              <GenQR
                                                value={e.qr}
                                                click={(evt) =>
                                                  (clickEmit = evt)
                                                }
                                              />
                                            </td>
                                            <td>
                                              <a href={e.qr} target="_blank">
                                                {e.qr}
                                              </a>
                                            </td>
                                            <td>
                                              <Button
                                                color="warning"
                                                title="In mã QR"
                                                onClick={() =>
                                                  clickEmit.click()
                                                }
                                              >
                                                <i className="fa fa-file-pdf-o" />
                                              </Button>
                                              <Button
                                                color="danger"
                                                title="Xóa"
                                                className="ml-2"
                                                onClick={() =>
                                                  this.handleRemoveNews(
                                                    e.news_id
                                                  )
                                                }
                                              >
                                                <i className="fa fa-trash" />
                                              </Button>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </Table>
                                </Col>
                              </Row>
                            </TabPane>
                            <TabPane tabId="productrelated">
                              <Row>
                                <Col
                                  xs={12}
                                  sm={12}
                                  className="text-right mb-2"
                                >
                                  <Button
                                    size="md"
                                    onClick={() =>
                                      this.handleAddProductRelated()
                                    }
                                    color="secondary"
                                  >
                                    <i className="fa fa-plus mr-2" />
                                    Thêm bài viết
                                  </Button>
                                </Col>
                                <Col xs={12} ms={12}>
                                  <ProductsRelated
                                    product_id={productEnt?.product_id}
                                    setState={this.setState.bind(this)}
                                    delete_product_related={
                                      this.state.delete_product_related
                                    }
                                    create_product_related={
                                      this.state.create_product_related
                                    }
                                  />
                                </Col>
                              </Row>
                            </TabPane>
                          </TabContent>
                        </Row>

                        <Row className="mt-2">
                          <Col xs={12} sm={12} style={{ padding: "0px" }}>
                            {/* action button */}
                            <ActionButton
                              isSubmitting={isSubmitting}
                              buttonList={[
                                {
                                  title: "Chỉnh sửa",
                                  color: "primary",
                                  isShow: noEdit,
                                  icon: "edit",
                                  permission: "MD_PRODUCT_EDIT",
                                  onClick: () =>
                                    window._$g.rdr(
                                      `/products/edit/${productEnt.product_id}`
                                    ),
                                },
                                {
                                  title: "Lưu",
                                  color: "primary",
                                  isShow: !noEdit,
                                  icon: "save",
                                  onClick: () => this.handleSubmit("save"),
                                },
                                {
                                  title: "Lưu và đóng",
                                  color: "success",
                                  isShow: !noEdit,
                                  icon: "save",
                                  onClick: () =>
                                    this.handleSubmit("save_n_close"),
                                },
                                {
                                  title: "đóng",
                                  icon: "times-circle",
                                  isShow: true,
                                  notSubmit: true,
                                  onClick: () => window._$g.rdr("/products"),
                                },
                              ]}
                            />
                          </Col>
                        </Row>
                      </>
                    );
                  }}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal
          isOpen={isAddQr}
          toggle={() => this.handleToggleAddQr()}
          size="lg"
        >
          <ModalHeader toggle={() => this.handleToggleAddQr()}>
            Thêm mới bài viết
          </ModalHeader>
          <ModalBody>
            <NewsAdd
              isModal={true}
              modalData={() => this.formikProps.values}
              clickAdd={(inputSave) => (this.addQrButton = inputSave)}
              handleToggleAddQr={() => this.handleToggleAddQr("refresh")}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.addQrButton.click();
              }}
            >
              Thêm mới
            </Button>{" "}
            <Button color="secondary" onClick={() => this.handleToggleAddQr()}>
              Đóng
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={isAddProductRelated}
          toggle={() => this.handleToggleAddProductRelated()}
          size="lg"
        >
          <ModalHeader toggle={() => this.handleToggleAddProductRelated()}>
            Thêm sản phẩm liên quan
          </ModalHeader>
          <ModalBody style={{ padding: "0px" }}>
            <ModelProductsRelated
              product_id={productEnt?.product_id}
              products_related={this.state.products_related}
              setState={this.setState.bind(this)}
              clickAdd={(inputSave) => (this.addProductRelated = inputSave)}
            />
          </ModalBody>
          {/* <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                this.addProductRelated.click();
              }}
            >
              Thêm
            </Button>{" "}
            <Button
              color="secondary"
              onClick={() => this.handleToggleAddProductRelated()}
            >
              Đóng
            </Button>
          </ModalFooter> */}
        </Modal>
      </div>
    );
  }
}
