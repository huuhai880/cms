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
} from "reactstrap";
import { readFileAsBase64 } from "../../utils/html";
import { mapDataOptions4Select } from "../../utils/html";
import Select from "react-select";
import "./styles.scss";
import _, { cloneDeep } from "lodash";
import { Modal } from "antd";
import "./styles.scss";
import moment from "moment";

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
    let values = Object.assign(
      {},
      this._attributesModel.fillable(),
      AttributesEnt
    );

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
        .getOptions({ is_active: 1 })
        .then((data) => (bundle["Options"] = mapDataOptions4Select(data))),
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
    // console.log('bundle: ', bundle);
    //
    return bundle;
  }

  formikValidationSchema = Yup.object().shape({
    attribute_name: Yup.string().required("Tên thuộc tính là bắt buộc."),
    main_number_id: Yup.number().required("Số chủ đạo là bắt buộc."),
    // list_attributes_image: Yup.array()
    //   .of(
    //     Yup.object().shape({
    //       partner_id: Yup.string().nullable().required("Required 1"),
    //       url_images: Yup.string().nullable().required("Required 1"),
    //     })
    //   )
    //   .required("Required"),
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

  handleFormikSubmit(values, formProps) {
    let { setSubmitting } = formProps;
    let willRedirect = false;
    let alerts = [];
    let { AttributesEnt } = this.props;
    // Build form data
    // +++

    let { is_active, list_attributes_image } = values;
    list_attributes_image = list_attributes_image.map((item) => {
      item.partner_id = item.partner_id.value;
      return item;
    });
    let formData = Object.assign({}, values, {
      is_active: is_active ? 1 : 0,
    });

    const attributeId =
      (AttributesEnt && AttributesEnt.attribute_id) ||
      formData[this._attributesModel];
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
        let msg = [`<b>${statusText || message}</b>`]
          .concat(errors || [])
          .join("<br/>");
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
      this.setState({ ...bundle, ready: true, clearImage: false });
    })();
    //.end
  };

  handleAddItem = () => {
    let { values, setFieldValue } = this.formikProps;
    values.list_attributes_image.unshift({
      images_id: "",
      partner_id: null,
      url_images: undefined,
      is_default: "",
      is_active_image: "",
    });
    setFieldValue("list_attributes_image", values.list_attributes_image);
  };

  handleRemoveItem = (index) => {
    let { values, setFieldValue } = this.formikProps;
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

    let { alerts, countries, provinces, districts, wards } = this.state;

    /** @var {Object} */
    let initialValues = this.getInitialValues();
    const { noEdit, AttributesEnt } = this.props;
    let { Options } = this.state;
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
                      <Form
                        id="form1st"
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                      >
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
                                  <Label
                                    for="attribute_name"
                                    className="text-left"
                                    sm={3}
                                  >
                                    Tên thuộc tính
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
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
                            </Row>
                            <Row>
                              <Col xs={6}>
                                <FormGroup row>
                                  <Label
                                    for="main_number_id"
                                    className="text-left"
                                    sm={4}
                                  >
                                    Số chủ đạo
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={6}>
                                    <Field
                                      name="main_number_id"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          className="text-right"
                                          onBlur={null}
                                          type="number"
                                          id="main_number_id"
                                          disabled={noEdit}
                                          min="0"
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="main_number_id"
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
                            </Row>
                            <Row>
                              <Col sm={12}>
                                <FormGroup row>
                                  <Label for="description" sm={2}>
                                    Mô tả
                                  </Label>
                                  <Col sm={10} xs={12}>
                                    <Field
                                      name="description"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          style={{ minHeight: "70px" }}
                                          {...field}
                                          onBlur={null}
                                          type="textarea"
                                          name="description"
                                          id="description"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={8}>
                                <FormGroup row>
                                  <Label for="is_active" sm={3}></Label>
                                  <Col sm={8}>
                                    <Field
                                      name="is_active"
                                      render={({ field /* _form */ }) => (
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
                            </Row>
                            <Row>
                              <Label
                                for="list_attributes_image"
                                sm={4}
                                className="mb-2"
                              >
                                Hình ảnh
                              </Label>
                              <Col
                                sm={8}
                                className="d-flex align-items-center justify-content-end"
                              >
                                <Button
                                  key="buttonAddItem"
                                  color="success"
                                  disabled={noEdit}
                                  onClick={() =>
                                    this.handleAddItem("save_n_close")
                                  }
                                  className="pull-right btn-block-sm mt-md-0 mt-sm-2"
                                >
                                  <i className="fa fa-plus-circle mr-2" />
                                  Thêm hình ảnh
                                </Button>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12} xs={12}>
                                {
                                  <Table
                                    bordered
                                    className="table-news-related"
                                    striped
                                  >
                                    <thead>
                                      <th
                                        style={{ width: 50 }}
                                        className="text-center"
                                      >
                                        STT
                                      </th>
                                      <th
                                        style={{ width: "40%" }}
                                        className="text-center"
                                      >
                                        Thành viên
                                      </th>
                                      <th
                                        style={{ width: "25%" }}
                                        className="text-center"
                                      >
                                        Ảnh
                                      </th>
                                      <th
                                        style={{ width: 30 }}
                                        className="text-center"
                                      >
                                        Mặc định
                                      </th>
                                      <th
                                        style={{ width: 30 }}
                                        className="text-center"
                                      >
                                        kích hoạt
                                      </th>
                                      <th
                                        style={{ width: 50 }}
                                        className="text-center"
                                      >
                                        Thao tác
                                      </th>
                                    </thead>
                                    <tbody>
                                      {values.list_attributes_image.map(
                                        (item, index) => (
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
                                                  name="partner_id"
                                                  render={({ field }) => (
                                                    <Select
                                                      {...field}
                                                      onBlur={null}
                                                      value={
                                                        values
                                                          .list_attributes_image[
                                                          index
                                                        ]
                                                          ? values
                                                              .list_attributes_image[
                                                              index
                                                            ].partner_id
                                                          : null
                                                      }
                                                      onChange={(item) => {
                                                        values.list_attributes_image[
                                                          index
                                                        ].partner_id = item;
                                                        field.onChange({
                                                          target: {
                                                            name: "list_attributes_image",
                                                            value: [
                                                              ...values.list_attributes_image,
                                                            ],
                                                          },
                                                        });
                                                      }}
                                                      options={Options}
                                                      placeholder="-- Chọn --"
                                                      id={`partner_id_${index}`}
                                                      isDisabled={noEdit}
                                                    />
                                                  )}
                                                />
                                                {/* {errors.list_attributes_image &&
                                                  errors.list_attributes_image[
                                                    errors.list_attributes_image
                                                      .length - 1
                                                  ].partner_id} */}
                                                {/* <ErrorMessage
                                                  name="partner_id"
                                                  component={({ children }) => {
                                                    <Alert
                                                      color="danger"
                                                      className="field-validation-error"
                                                    >{children}
                                                      {errors.list_attributes_image &&
                                                        errors
                                                          .list_attributes_image[
                                                          errors
                                                            .list_attributes_image
                                                            .length - 1
                                                        ].partner_id}
                                                    </Alert>
                                                  }}
                                                /> */}
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
                                                          if (
                                                            file.type.indexOf(
                                                              "image/"
                                                            ) !== 0
                                                          ) {
                                                            return "Chỉ được phép sử dụng tập tin ảnh.";
                                                          }
                                                        }
                                                        // Check file's size in bytes
                                                        if ("size" in file) {
                                                          let maxSize = 4; /*4mb*/
                                                          if (
                                                            file.size /
                                                              1024 /
                                                              1024 >
                                                            maxSize
                                                          ) {
                                                            return `Dung lượng tập tin tối đa là: ${maxSize}mb.`;
                                                          }
                                                        }
                                                      },
                                                    })
                                                      .then((usrImgBase64) => {
                                                        console.log(
                                                          usrImgBase64
                                                        );
                                                        let clone = [
                                                          ...values.list_attributes_image,
                                                        ];
                                                        clone[
                                                          index
                                                        ].url_images = usrImgBase64[0]
                                                          ? usrImgBase64[0]
                                                          : null;
                                                        this.formikProps.setFieldValue(
                                                          `list_attributes_image`,
                                                          clone
                                                        );
                                                        // formik.setFieldValue(
                                                        //   "image_avatar",
                                                        //   usrImgBase64[0]
                                                        // );
                                                      })
                                                      .catch((err) => {
                                                        window._$g.dialogs.alert(
                                                          window._$g._(
                                                            err.message
                                                          )
                                                        );
                                                      });
                                                  }
                                                }}
                                                disabled={noEdit}
                                              />
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
                                              )}
                                              <ErrorMessage
                                                name="url_images"
                                                component={({ children }) => (
                                                  <Alert
                                                    color="danger"
                                                    className="field-validation-error"
                                                  >
                                                    {children}
                                                  </Alert>
                                                )}
                                              /> */}
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
                                                  render={({
                                                    field /* _form */,
                                                  }) => (
                                                    <CustomInput
                                                      {...field}
                                                      onBlur={null}
                                                      checked={
                                                        values
                                                          .list_attributes_image[
                                                          index
                                                        ].is_default
                                                      }
                                                      onChange={(event) => {
                                                        const { target } =
                                                          event;
                                                        values.list_attributes_image[
                                                          index
                                                        ].is_default =
                                                          target.checked;
                                                        field.onChange({
                                                          target: {
                                                            name: "list_attributes_image",
                                                            value: [
                                                              ...values.list_attributes_image,
                                                            ],
                                                          },
                                                        });
                                                      }}
                                                      type="checkbox"
                                                      id={`is_default_${index}`}
                                                      disabled={noEdit}
                                                    />
                                                  )}
                                                />
                                                <ErrorMessage
                                                  name="is_default"
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
                                              className="text-center wrap-chbx"
                                              style={{
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <Col>
                                                <Field
                                                  name="is_active_image"
                                                  render={({
                                                    field /* _form */,
                                                  }) => (
                                                    <CustomInput
                                                      {...field}
                                                      onBlur={null}
                                                      checked={
                                                        values
                                                          .list_attributes_image[
                                                          index
                                                        ].is_active_image
                                                      }
                                                      onChange={(event) => {
                                                        const { target } =
                                                          event;
                                                        values.list_attributes_image[
                                                          index
                                                        ].is_active_image =
                                                          target.checked;
                                                        field.onChange({
                                                          target: {
                                                            name: "list_attributes_image",
                                                            value: [
                                                              ...values.list_attributes_image,
                                                            ],
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
                                                onClick={() =>
                                                  this.handleRemoveItem(index)
                                                }
                                                title="Xóa"
                                                disabled={noEdit}
                                              >
                                                <i className="fa fa-minus-circle" />
                                              </Button>
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </Table>
                                }
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12} className="text-right mt-3">
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
                                      onClick={() =>
                                        this.handleSubmit("save_n_close")
                                      }
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
      </div>
    );
  }
}
