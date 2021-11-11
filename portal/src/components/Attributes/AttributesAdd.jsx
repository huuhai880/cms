import React, { PureComponent } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  Table,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { readFileAsBase64 } from "../../utils/html";
import { mapDataOptions4Select } from "../../utils/html";
import Select from "react-select";
import "./styles.scss";
import { Editor } from "@tinymce/tinymce-react";
import Famous from "./Famous";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import Loading from "../Common/Loading";

// Model(s)
import AttributesModel from "../../models/AttributesModel";

/**
 * @class AttributesAdd
 */
export default class AttributesAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._attributesModel = new AttributesModel();

    // Bind method(s)
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);

    // Init state
    // +++
    this.state = {
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
      clearImage: false,
      isOpenFamousList: false,
    };
  }

  componentDidMount() {
    (async () => {
      let bundle = await this._getBundleData({});
      this.setState({ ...bundle, ready: true });
    })();
    //.end
  }

  /**
   *
   * @return {Object}
   */
  getInitialValues = () => {
    let { AttributesEnt } = this.props;
    let values = Object.assign({}, this._attributesModel.fillable(), AttributesEnt);
    // Format
    Object.keys(values).forEach((key) => {
      if (null === values[key]) {
        values[key] = "";
      }
    });
    // Return;
    return values;
  };

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let bundle = {};
    let all = [
      this._attributesModel
        .getOptionPartner({ is_active: 1 })
        .then((data) => (bundle["OptionPartner"] = mapDataOptions4Select(data))),
      this._attributesModel
        .getOptionGroup({ is_active: 1 })
        .then((data) => (bundle["OptionGroup"] = mapDataOptions4Select(data))),
      this._attributesModel
        .getOptionMainNumber({ is_active: 1 })
        .then((data) => (bundle["OptionMainNumber"] = mapDataOptions4Select(data))),
    ];

    await Promise.all(all).catch((err) =>
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`)
        //,() => window.location.reload()
      )
    );
    //
    Object.keys(bundle).forEach((key) => {
      let data = bundle[key];
      let stateValue = this.state[key];
      if (data instanceof Array && stateValue instanceof Array) {
        data = [stateValue[0]].concat(data);
      }
      bundle[key] = data;
    });
    //
    return bundle;
  }

  formikValidationSchema = Yup.object().shape({
    attribute_name: Yup.string().required("Tên thuộc tính là bắt buộc."),
    main_number_id: Yup.object().required("Giá trị là bắt buộc."),
    attributes_group_id: Yup.object().required("Chỉ số là bắt buộc."),

    list_attributes_image: Yup.array()
      .of(
        Yup.object().shape({
          partner_id: Yup.object()
            .shape({
              value: Yup.string(),
              label: Yup.string(),
            })
            .required("Đối tác là bắt buộc."),
        })
      )
      .test("list_attributes_image", null, (arr) => {
        let checkIsDefault = arr.filter((item) => {
          return item.is_default == true;
        });
        if (checkIsDefault.length === 0) {
          return new Yup.ValidationError(
            "Chọn một ảnh mặc định là bắt buộc.",
            null,
            "check_is_default"
          );
        }
        return true;
      }),
  });

  handleFormikBeforeRender = ({ initialValues }) => {
    let { values } = this.formikProps;
    if (values === initialValues) {
      return;
    }
    // Reformat data
    // +++
    Object.assign(values, {
      // +++
    });
  };

  /** @var {String} */
  _btnType = null;

  handleSubmit = (btnType) => {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;
    return submitForm();
  };
  //////////config modal
  handleOpenModalFamousList = () => {
    this.setState({ isOpenFamousList: !this.state.isOpenFamousList });
  };
  handlePickFamous = (news = {}) => {
    // console.log(news);
    const { setFieldValue, values } = this.formikProps;
    this.setState({ isOpenFamousList: false }, () => {
      let related =
        Object.keys(news).length == 0
          ? values.related
          : (Object.keys(news) || []).reduce((arr, key) => {
              arr.push(news[key]);
              return arr;
            }, []);

      setFieldValue("related", related);
      this.setState({ dataRelated: related });
    });
  };

  handleSortFDTeam = (type, item) => {
    let { values, handleChange } = this.formikProps;
    let { related: value } = values;
    let nextIdx = null;
    // console.log(value)
    let foundIdx = value.findIndex((_item) => _item === item);
    if (foundIdx < 0) {
      return;
    }
    if ("up" === type) {
      nextIdx = Math.max(0, foundIdx - 1);
    }
    if ("down" === type) {
      nextIdx = Math.min(value.length - 1, foundIdx + 1);
    }
    if (foundIdx !== nextIdx && null !== nextIdx) {
      let _tempItem = value[foundIdx];
      value[foundIdx] = value[nextIdx];
      value[nextIdx] = _tempItem;
      handleChange({ target: { name: "related", value } });
    }
  };

  handleFormikSubmit(values, formProps) {
    let { setSubmitting } = formProps;
    let willRedirect = false;
    let alerts = [];
    let { AttributesEnt } = this.props;
    // Build form data
    // +++

    let { is_active, list_attributes_image, attributes_group_id, main_number_id, attribute_name } =
      values;

    let formData = Object.assign({}, values, {
      is_active: is_active ? 1 : 0,
      attributes_group_id: attributes_group_id.value,
      attributes_group_name: attributes_group_id.label,
      main_number_id: main_number_id.value,
      attribute_name: attribute_name ? attribute_name.trim() : "",
    });
    const attributeId =
      (AttributesEnt && AttributesEnt.attribute_id) || formData[this._attributesModel];
    let apiCall = attributeId
      ? this._attributesModel.update(attributeId, formData)
      : this._attributesModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/attributes");
        }
        // Chain
        return data;
      })
      .catch((apiData) => {
        // NG
        let { errors, statusText, message } = apiData;
        let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");
        alerts.push({ color: "danger", msg });
      })
      .finally(() => {
        // Submit form is done!
        setSubmitting(false);
        //
        if (!AttributesEnt && !willRedirect && !alerts.length) {
          this.handleFormikReset();
        }

        this.setState(
          () => ({ alerts }),
          () => {
            window.scrollTo(0, 0);
          }
        );
      });
  }

  handleFormikReset = () => {
    this.setState((state) => ({
      ready: false,
      alerts: [],
      clearImage: true,
      
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ bundle, ready: true, clearImage: false });
    })();
    //.end
  };

  handleAddItem = () => {
    let { values, setFieldValue } = this.formikProps;
    values.list_attributes_image.unshift({
      images_id: "",
      partner_id: "",
      url_images: undefined,
      is_default: 0,
      is_active_image: 1,
    });
    setFieldValue("list_attributes_image", values.list_attributes_image);
  };

  handleRemoveItem = (index) => {
    let { values, setFieldValue, resetForm } = this.formikProps;
    if (values.list_attributes_image.length === 1) {
      setFieldValue("list_attributes_image", [
        {
          images_id: "",
          partner_id: "",
          url_images: "",
          is_default: 1,
          is_active_image: 1,
        },
      ]);
      return;
    }
    values.list_attributes_image.splice(index, 1);
    setFieldValue("list_attributes_image", values.list_attributes_image);
  };

  handleImage = (files, index) => {
    let { values, setFieldValue } = this.formikProps;
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        values.list_attributes_image[index].url_images = reader.result;
        setFieldValue("list_attributes_image", values.list_attributes_image);
      },
      false
    );

    if (files) {
      reader.readAsDataURL(files);
    }
  };

  render() {
    let { ready } = this.state;

    // Ready?
    if (!ready) {
      return <Loading />;
    }

    let { alerts, countries, provinces, districts, isOpenFamousList } = this.state;

    /** @var {Object} */
    let initialValues = this.getInitialValues();
    const { noEdit, AttributesEnt } = this.props;
    let { OptionPartner, OptionGroup, OptionMainNumber } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {AttributesEnt && AttributesEnt.attribute_id
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  thuộc tính {AttributesEnt ? AttributesEnt.attribute_name : ""}
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
                    let {
                      values,
                      errors,
                      // status,
                      // touched, handleChange, handleBlur,
                      //submitForm,
                      //resetForm,
                      handleSubmit,
                      handleReset,
                      // isValidating,
                      isSubmitting,
                      /* and other goodies */
                    } = (this.formikProps = window._formikProps = formikProps);
                    // [Event]
                    this.handleFormikBeforeRender({ initialValues });
                    // Render
                    return (
                      <Form id="form1st" onSubmit={handleSubmit} onReset={handleReset}>
                        <Row className="mb15">
                          <Col xs={12}>
                            <b className="underline">Thông tin thuộc tính</b>
                          </Col>
                        </Row>
                        <Row className="pt-3">
                          <Col xs={12}>
                            <Row>
                              <Col xs={8}>
                                <FormGroup row>
                                  <Label for="attribute_name" className="text-left" sm={3}>
                                    Tên thuộc tính
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={9}>
                                    <Field
                                      name="attribute_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          className="text-left"
                                          onBlur={null}
                                          type="text"
                                          id="attribute_name"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="attribute_name"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={8}>
                                <FormGroup row>
                                  <Label for="attributes_group_id" className="text-left" sm={3}>
                                    Chỉ số
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={9} style={{ zIndex: "4" }}>
                                    <Field
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          isSearchable={true}

                                          className="text-left"
                                          value={values.attributes_group_id || null}
                                          onChange={(item) => {
                                            field.onChange({
                                              target: {
                                                name: "attributes_group_id",
                                                value: item,
                                              },
                                            });
                                          }}
                                          options={OptionGroup}
                                          placeholder="-- Chọn --"
                                          isDisabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="attributes_group_id"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={8}>
                                <FormGroup row>
                                  <Label for="main_number_id" className="text-left" sm={3}>
                                    Giá trị
                                    <span className="font-weight-bold red-text">*</span>
                                  </Label>
                                  <Col sm={9} style={{ zIndex: "3" }}>
                                    <Field
                                      name="main_number_id"
                                      render={({ field /* _form */ }) => (
                                        <Select
                                          {...field}
                                          onBlur={null}
                                          isSearchable={true}
                                          className="text-left"
                                          value={values.main_number_id || null}
                                          onChange={(item) => {
                                            field.onChange({
                                              target: {
                                                name: "main_number_id",
                                                value: item,
                                              },
                                            });
                                          }}
                                          options={OptionMainNumber}
                                          placeholder="-- Chọn --"
                                          isDisabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="main_number_id"
                                      component={({ children }) => (
                                        <Alert color="danger" className="field-validation-error">
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12}>
                                <FormGroup row>
                                  <Label for="description" sm={2}>
                                    Mô tả
                                  </Label>
                                  <Col sm={12} xs={12}>
                                    <Editor
                                      apiKey={"3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"}
                                      scriptLoading={{
                                        delay: 0,
                                      }}
                                      value={values.description}
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
                                        menubar: "file edit view insert format tools table tc help",
                                        toolbar1:
                                          "undo redo | fullscreen | formatselect | bold italic backcolor | \n" +
                                          "alignleft aligncenter alignright alignjustify",
                                        toolbar2:
                                          "bullist numlist outdent indent | removeformat | help | image | toc",
                                        file_picker_types: "image",
                                        images_dataimg_filter: function (img) {
                                          return img.hasAttribute("internal-blob");
                                        },
                                        images_upload_handler: this.handleUploadImage,
                                      }}
                                      onEditorChange={(newValue) => {
                                        this.formikProps.setFieldValue("description", newValue);
                                      }}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row className="mb15">
                              <Col xs={4}>
                                <b className="underline">Thông tin người nổi tiếng</b>
                                {/* <span className="font-weight-bold red-text">*</span> */}
                              </Col>
                              <Col
                                sm={8}
                                className="d-flex align-items-center justify-content-end mb15"
                              >
                                <Button
                                  key="buttonAddItem"
                                  color="success"
                                  disabled={noEdit}
                                  onClick={(e) => this.handleOpenModalFamousList(e)}
                                  className="pull-right btn-block-sm mt-md-0 mt-sm-2"
                                >
                                  <i className="fa fa-plus-circle mr-2" />
                                  Chọn
                                </Button>
                              </Col>
                              <Col xs={12}>
                                {
                                  <Table bordered className="table-news-related" striped>
                                    <thead>
                                      <th style={{ width: 50 }} className="text-center">
                                        STT
                                      </th>
                                      <th className="text-center">Tên</th>
                                      <th className="text-center">Ngày sinh</th>
                                      <th className="text-center">Thứ tự hiển thị</th>
                                      <th className="text-center">Minh chứng</th>
                                      <th style={{ width: 100 }} className="text-center">
                                        Thao tác
                                      </th>
                                    </thead>
                                    <tbody>
                                      {!values.related || !values.related.length ? (
                                        <tr>
                                          <td className="text-center" colSpan={6}>
                                            Không có dữ liệu
                                          </td>
                                        </tr>
                                      ) : (
                                        (values.related || []).map((famous, index) => {
                                          return (
                                            <tr key={index}>
                                              <td className="text-center">{index + 1}</td>
                                              <td>
                                                {famous.image_avatar ? (
                                                  <img
                                                    className="mr-2"
                                                    style={{ width: 40, height: 40 }}
                                                    src={
                                                      famous.image_avatar
                                                        ? famous.image_avatar
                                                        : null
                                                    }
                                                    //   alt="H1"
                                                  />
                                                ) : null}
                                                <a
                                                  target="_blank"
                                                  href={`/portal/famous/detail/${famous.farmous_id}`}
                                                >
                                                  {famous.farmous_name}
                                                </a>
                                                \{famous.position}
                                              </td>
                                              <td className="text-center">{famous.birthday}</td>
                                              <td
                                                style={{
                                                  verticalAlign: "middle",
                                                  textAlign: "center",
                                                }}
                                              >
                                                <Button
                                                  size="sm"
                                                  color="primary"
                                                  className="mr-1"
                                                  type="button"
                                                  disabled={0 === index || noEdit}
                                                  onClick={(evt) =>
                                                    this.handleSortFDTeam("up", famous, evt)
                                                  }
                                                >
                                                  <i className="fa fa-arrow-up" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  color="success"
                                                  type="button"
                                                  disabled={
                                                    values.related.length - 1 === index || noEdit
                                                  }
                                                  onClick={(evt) =>
                                                    this.handleSortFDTeam("down", famous, evt)
                                                  }
                                                >
                                                  <i className="fa fa-arrow-down" />
                                                </Button>
                                              </td>
                                              <td
                                                className="text-center wrap-chbx"
                                                style={{
                                                  verticalAlign: "middle",
                                                }}
                                              >
                                                <Col>
                                                  <Field
                                                    name="is_default"
                                                    render={({ field /* _form */ }) => (
                                                      <CustomInput
                                                        {...field}
                                                        onBlur={null}
                                                        checked={values.related[index].is_default}
                                                        onChange={(event) => {
                                                          const { target } = event;
                                                          values.related = values.related.map(
                                                            (value) => {
                                                              value.is_default = false;
                                                              return value;
                                                            }
                                                          );
                                                          values.related[index].is_default = true;
                                                          field.onChange({
                                                            target: {
                                                              name: "related",
                                                              value: [...values.related],
                                                            },
                                                          });
                                                        }}
                                                        type="checkbox"
                                                        id={`is_default_${index}`}
                                                        disabled={noEdit}
                                                      />
                                                    )}
                                                  />
                                                </Col>
                                              </td>
                                              <td className="text-center">
                                                <Col>
                                                  <Field
                                                    name="is_default"
                                                    render={({ field /* _form */ }) => (
                                                      <Button
                                                        color="danger"
                                                        style={{
                                                          width: 24,
                                                          height: 24,
                                                          padding: 0,
                                                        }}
                                                        onClick={(e) => {
                                                          let clone = [...values.related];
                                                          clone.splice(index, 1);
                                                          field.onChange({
                                                            target: {
                                                              name: "related",
                                                              value: clone,
                                                            },
                                                          });
                                                        }}
                                                        title="Xóa"
                                                      >
                                                        <i className="fa fa-minus-circle" />
                                                      </Button>
                                                    )}
                                                  />
                                                </Col>
                                              </td>
                                            </tr>
                                          );
                                        })
                                      )}
                                    </tbody>
                                  </Table>
                                }
                              </Col>
                              <ErrorMessage
                                name="check_is_default_famous"
                                component={({ children }) => (
                                  <Alert color="danger" className="field-validation-error">
                                    {children}
                                  </Alert>
                                )}
                              />
                            </Row>

                            <Row className="mb15">
                              <Col xs={4}>
                                <b className="underline">Hình ảnh</b>
                                <span className="font-weight-bold red-text">*</span>
                              </Col>
                              <Col sm={8} className="d-flex align-items-center justify-content-end">
                                <Button
                                  key="buttonAddItem"
                                  color="success"
                                  disabled={noEdit}
                                  onClick={() => this.handleAddItem("save_n_close")}
                                  className="pull-right btn-block-sm mt-md-0 mt-sm-2"
                                >
                                  <i className="fa fa-plus-circle mr-2" />
                                  Thêm
                                </Button>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12} xs={12}>
                                {
                                  <Table bordered className="table-news-related" striped>
                                    <thead>
                                      <th style={{ width: 50 }} className="text-center">
                                        STT
                                      </th>
                                      <th style={{ width: "40%" }} className="text-center">
                                        Đối tác
                                      </th>
                                      <th style={{ width: "25%" }} className="text-center">
                                        Ảnh
                                      </th>
                                      <th style={{ width: 30 }} className="text-center">
                                        Mặc định
                                      </th>
                                      <th style={{ width: 30 }} className="text-center">
                                        Kích hoạt
                                      </th>
                                      <th style={{ width: 50 }} className="text-center">
                                        Thao tác
                                      </th>
                                    </thead>
                                    <tbody>
                                      {values.list_attributes_image.map((item, index) => (
                                        <tr key={index}>
                                          <td
                                            className="text-center"
                                            style={{
                                              verticalAlign: "middle",
                                            }}
                                          >
                                            {index + 1}
                                          </td>
                                          <td
                                            className="text-center wrap-chbx"
                                            style={{
                                              verticalAlign: "middle",
                                            }}
                                          >
                                            <Col>
                                              <Field
                                                render={({ field }) => (
                                                  <Select
                                                    onBlur={null}
                                                    className="text-left"
                                                    value={
                                                      values.list_attributes_image
                                                        ? values.list_attributes_image[index]
                                                            .partner_id
                                                        : ""
                                                    }
                                                    onChange={(item) => {
                                                      values.list_attributes_image[
                                                        index
                                                      ].partner_id = item;
                                                      field.onChange({
                                                        target: {
                                                          name: "list_attributes_image",
                                                          value: [...values.list_attributes_image],
                                                        },
                                                      });
                                                    }}
                                                    options={OptionPartner}
                                                    placeholder="-- Chọn --"
                                                    id={`partner_id_${index}`}
                                                    isDisabled={noEdit}
                                                  />
                                                )}
                                              />
                                              {errors && errors.list_attributes_image && (
                                                <ErrorMessage
                                                  name="list_attributes_image"
                                                  component={({ children }) => (
                                                    <Alert
                                                      color="danger"
                                                      className="field-validation-error text-left"
                                                      style={{
                                                        display: `${
                                                          children[index] &&
                                                          children[index].partner_id
                                                            ? "block"
                                                            : "none"
                                                        }`,
                                                      }}
                                                    >
                                                      {children[index]
                                                        ? children[index].partner_id
                                                        : null}
                                                    </Alert>
                                                  )}
                                                />
                                              )}
                                            </Col>
                                          </td>
                                          <td
                                            style={{
                                              verticalAlign: "middle",
                                              padding: "0 !important",
                                              margin: "0",
                                              position: "relative",
                                            }}
                                          >
                                            {item.url_images ? (
                                              <Media
                                                object
                                                src={item.url_images}
                                                alt="User image"
                                                // className="user-imgage"
                                                style={{
                                                  width: "100%",
                                                  height: "90px",
                                                  padding: 0,
                                                  objectFit: "cover",
                                                }}
                                              />
                                            ) : (
                                              <i
                                                style={{
                                                  width: "100%",
                                                  height: "100%",
                                                  padding: 0,
                                                  textAlign: "center",
                                                }}
                                                className="fa fa-plus"
                                              />
                                            )}
                                            <Input
                                              type="file"
                                              id="icon"
                                              className="input-overlay"
                                              style={{ cursor: "pointer" }}
                                              onChange={(event) => {
                                                let { target } = event;
                                                if (target.files[0]) {
                                                  readFileAsBase64(target, {
                                                    // option: validate input
                                                    validate: (file) => {
                                                      // Check file's type
                                                      if ("type" in file) {
                                                        if (file.type.indexOf("image/") !== 0) {
                                                          return "Chỉ được phép sử dụng tập tin ảnh.";
                                                        }
                                                      }
                                                      // Check file's size in bytes
                                                      if ("size" in file) {
                                                        let maxSize = 4; /*4mb*/
                                                        if (file.size / 1024 / 1024 > maxSize) {
                                                          return `Dung lượng tập tin tối đa là: ${maxSize}mb.`;
                                                        }
                                                      }
                                                    },
                                                  })
                                                    .then((usrImgBase64) => {
                                                      let clone = [...values.list_attributes_image];
                                                      if (usrImgBase64[0]) {
                                                        let checkImage = clone.filter((item) => {
                                                          return (
                                                            clone[index].partner_id ===
                                                              item.partner_id &&
                                                            usrImgBase64[0] === item.url_images
                                                          );
                                                        });
                                                        if (checkImage && checkImage.length) {
                                                          return window._$g.dialogs.alert(
                                                            window._$g._(
                                                              "Không chọn trùng ảnh trên cùng một đối tác."
                                                            )
                                                          );
                                                        }
                                                      }
                                                      clone[index].url_images = usrImgBase64[0]
                                                        ? usrImgBase64[0]
                                                        : null;
                                                      this.formikProps.setFieldValue(
                                                        `list_attributes_image`,
                                                        clone
                                                      );
                                                    })
                                                    .catch((err) => {
                                                      window._$g.dialogs.alert(
                                                        window._$g._(err.message)
                                                      );
                                                    });
                                                }
                                              }}
                                              disabled={noEdit}
                                            />
                                            {errors && errors.list_attributes_image && (
                                              <ErrorMessage
                                                name="list_attributes_image"
                                                component={({ children }) => (
                                                  <Alert
                                                    color="danger"
                                                    className="field-validation-error text-left"
                                                    style={{
                                                      display: `${
                                                        children[index] &&
                                                        children[index].url_images
                                                          ? "block"
                                                          : "none"
                                                      }`,
                                                      marginBottom: "0",
                                                    }}
                                                  >
                                                    {children[index]
                                                      ? children[index].url_images
                                                      : null}
                                                  </Alert>
                                                )}
                                              />
                                            )}
                                            {/* {!this.state.clearImage && (
                                                <Field
                                                  name="url_images"
                                                  id={`url_images_${index}`}
                                                  render={({ field }) => {
                                                    return (
                                                      <>
                                                        <Modal
                                                          footer={null}
                                                          onCancel={
                                                            this.handleCancel
                                                          }
                                                        >
                                                          <img
                                                            alt="example"
                                                            style={{
                                                              width: "100%",
                                                            }}
                                                            src={
                                                              values
                                                                .list_attributes_image[
                                                                index
                                                              ].url_images
                                                            }
                                                          />
                                                        </Modal>
                                                        <img
                                                          id={`image_${index}`}
                                                          style={{
                                                            width: "100%",
                                                          }}
                                                          src={
                                                            values
                                                              .list_attributes_image[
                                                              index
                                                            ].url_images
                                                          }
                                                        />
                                                        <input
                                                          {...field}
                                                          id={`url_images_${index}`}
                                                          onChange={(files) => {
                                                            files =
                                                              files.target
                                                                .files[0];
                                                            this.handleImage(
                                                              files,
                                                              index
                                                            );
                                                          }}
                                                          label="dsadsad"
                                                          accept="image/*"
                                                          type="file"
                                                          disabled={noEdit}
                                                        />
                                                      </>
                                                    );
                                                  }}
                                                />
                                              )} */}
                                          </td>
                                          <td
                                            className="text-center wrap-chbx"
                                            style={{
                                              verticalAlign: "middle",
                                            }}
                                          >
                                            <Col>
                                              <Field
                                                name="is_default"
                                                render={({ field /* _form */ }) => (
                                                  <CustomInput
                                                    {...field}
                                                    onBlur={null}
                                                    checked={
                                                      values.list_attributes_image[index].is_default
                                                    }
                                                    onChange={(event) => {
                                                      const { target } = event;
                                                      values.list_attributes_image =
                                                        values.list_attributes_image.map(
                                                          (value) => {
                                                            value.is_default = false;
                                                            return value;
                                                          }
                                                        );
                                                      values.list_attributes_image[
                                                        index
                                                      ].is_default = true;
                                                      field.onChange({
                                                        target: {
                                                          name: "list_attributes_image",
                                                          value: [...values.list_attributes_image],
                                                        },
                                                      });
                                                    }}
                                                    type="checkbox"
                                                    id={`is_default_${index}`}
                                                    disabled={noEdit}
                                                  />
                                                )}
                                              />
                                            </Col>
                                          </td>
                                          <td
                                            className="text-center wrap-chbx"
                                            style={{
                                              verticalAlign: "middle",
                                            }}
                                          >
                                            <Col>
                                              <Field
                                                name="is_active_image"
                                                render={({ field /* _form */ }) => (
                                                  <CustomInput
                                                    {...field}
                                                    onBlur={null}
                                                    checked={
                                                      values.list_attributes_image[index]
                                                        .is_active_image
                                                    }
                                                    onChange={(event) => {
                                                      const { target } = event;
                                                      values.list_attributes_image[
                                                        index
                                                      ].is_active_image = target.checked;
                                                      field.onChange({
                                                        target: {
                                                          name: "list_attributes_image",
                                                          value: [...values.list_attributes_image],
                                                        },
                                                      });
                                                    }}
                                                    type="checkbox"
                                                    id={`is_active_image_${index}`}
                                                    disabled={noEdit}
                                                  />
                                                )}
                                              />
                                              <ErrorMessage
                                                name="is_active_image"
                                                component={({ children }) => (
                                                  <Alert
                                                    color="danger"
                                                    className="field-validation-error"
                                                  >
                                                    {children}
                                                  </Alert>
                                                )}
                                              />
                                            </Col>
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
                                              onClick={() => this.handleRemoveItem(index)}
                                              title="Xóa"
                                              disabled={noEdit}
                                            >
                                              <i className="fa fa-minus-circle" />
                                            </Button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                }
                                <ErrorMessage
                                  name="check_image"
                                  component={({ children }) => (
                                    <Alert color="danger" className="field-validation-error">
                                      {children}
                                    </Alert>
                                  )}
                                />
                                <ErrorMessage
                                  name="check_is_default"
                                  component={({ children }) => (
                                    <Alert color="danger" className="field-validation-error">
                                      {children}
                                    </Alert>
                                  )}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12}>
                                <FormGroup row>
                                  <Col sm={6}>
                                    <FormGroup row className="mt-3">
                                      <Label for="is_active" sm={6}></Label>
                                      <Col sm={6}>
                                        <Field
                                          name="is_active"
                                          render={({ field }) => (
                                            <CustomInput
                                              {...field}
                                              className="pull-left"
                                              onBlur={null}
                                              checked={values.is_active}
                                              onChange={(event) => {
                                                const { target } = event;
                                                field.onChange({
                                                  target: {
                                                    name: "is_active",
                                                    value: target.checked,
                                                  },
                                                });
                                              }}
                                              type="checkbox"
                                              id="is_active"
                                              label="Kích hoạt"
                                              disabled={noEdit}
                                            />
                                          )}
                                        />
                                        <ErrorMessage
                                          name="is_active"
                                          component={({ children }) => (
                                            <Alert
                                              color="danger"
                                              className="field-validation-error"
                                            >
                                              {children}
                                            </Alert>
                                          )}
                                        />
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                  <Col sm={6} className="text-right mt-3">
                                    {noEdit ? (
                                      <CheckAccess permission="FOR_ATTRIBUTES_EDIT">
                                        <Button
                                          color="primary"
                                          className="mr-2 btn-block-sm"
                                          onClick={() =>
                                            window._$g.rdr(
                                              `/attributes/edit/${AttributesEnt.attribute_id}`
                                            )
                                          }
                                        >
                                          <i className="fa fa-edit mr-1" />
                                          Chỉnh sửa
                                        </Button>
                                      </CheckAccess>
                                    ) : (
                                      [
                                        <Button
                                          key="buttonSave"
                                          type="submit"
                                          color="primary"
                                          disabled={isSubmitting}
                                          onClick={() => this.handleSubmit("save")}
                                          className="mr-2 btn-block-sm"
                                        >
                                          <i className="fa fa-save mr-2" />
                                          Lưu
                                        </Button>,
                                        <Button
                                          key="buttonSaveClose"
                                          type="submit"
                                          color="success"
                                          disabled={isSubmitting}
                                          onClick={() => this.handleSubmit("save_n_close")}
                                          className="mr-2 btn-block-sm mt-md-0 mt-sm-2"
                                        >
                                          <i className="fa fa-save mr-2" />
                                          Lưu &amp; Đóng
                                        </Button>,
                                      ]
                                    )}
                                    <Button
                                      disabled={isSubmitting}
                                      onClick={() => window._$g.rdr("/attributes")}
                                      className="btn-block-sm mt-md-0 mt-sm-2"
                                    >
                                      <i className="fa fa-times-circle mr-1" />
                                      Đóng
                                    </Button>
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Form>
                    );
                  }}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {isOpenFamousList ? (
          <Modal isOpen={true} size={"lg"} style={{ maxWidth: "60rem" }}>
            {/* <ModalHeader>Duyệt bài viết</ModalHeader> */}
            <ModalBody className="p-0">
              <Famous
                isOpenFamousList={isOpenFamousList}
                handlePick={this.handlePickFamous}
                // excludeNewsId={NewsEnt ? NewsEnt.farmous_id : null}
                related={this.formikProps.values.related}
              />
            </ModalBody>
          </Modal>
        ) : null}
      </div>
    );
  }
}
