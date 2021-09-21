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
} from "reactstrap";
import { Link } from "react-router-dom";

// Component(s)
import Loading from "../Common/Loading";

// Model(s)
import SearchHistoryModel from "../../models/SearchHistoryModel";

/**
 * @class SearchHistoryDetail
 */
export default class SearchHistoryDetail extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._searchHistoryModel = new SearchHistoryModel();

    // Init state
    // +++
    this.state = {
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
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
    let values = Object.assign({}, this._searchHistoryModel.fillable());
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
    let ID = this.props.match.params.id;
    let search_date = this.props.history.location.state;
    let all = [
      this._searchHistoryModel
        .read(ID, { start_date: search_date, end_date: search_date })
        .then((data) => (bundle["data"] = data)),
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

  formikValidationSchema = Yup.object().shape({});

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

  render() {
    let { ready, data } = this.state;

    // Ready?
    if (!ready) {
      return <Loading />;
    }

    let { alerts, countries, provinces, districts, wards } = this.state;

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
                <b>{"Chi tiết"} lịch sử tra cứu</b>
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
                    // [Event]
                    this.handleFormikBeforeRender({ initialValues });
                    // Render
                    return (
                      <Form id="form1st" onSubmit={handleSubmit} onReset={handleReset}>
                        <Row className="mb15">
                          <Col xs={12}>
                            <b className="underline">Thông tin lịch sử tra cứu</b>
                          </Col>
                        </Row>
                        <Row className="pt-3">
                          <Col xs={12}>
                            <Row>
                              <Col xs={7}>
                                <FormGroup row>
                                  <Label className="text-left" sm={3}>
                                    Tên khách hàng
                                  </Label>
                                  <Col sm={9}>
                                    <Field
                                      name="attribute_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          className="text-left"
                                          value={data ? data.full_name : ""}
                                          onBlur={null}
                                          type="text"
                                          id="attribute_name"
                                          disabled={true}
                                        />
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={7}>
                                <FormGroup row>
                                  <Label className="text-left" sm={3}>
                                    Ngày tra cứu
                                  </Label>
                                  <Col sm={9} style={{ zIndex: "4" }}>
                                    <Field
                                      render={({ field }) => (
                                        <Input
                                          {...field}
                                          className="text-left"
                                          value={data ? data.search_date : ""}
                                          onBlur={null}
                                          type="text"
                                          id="attribute_name"
                                          disabled={true}
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
                              <Col sm={12} xs={12}>
                                {
                                  <Table bordered className="table-news-related" striped>
                                    <thead>
                                      <th
                                        style={{
                                          width: 10,
                                        }}
                                        className="text-center"
                                      >
                                        STT
                                      </th>
                                      <th
                                        style={{
                                          width: "60%",
                                        }}
                                        className="text-center"
                                      >
                                        Tên sản phẩm
                                      </th>
                                      <th
                                        style={{
                                          width: "30%",
                                        }}
                                        className="text-center"
                                      >
                                        Số lần tra cứu
                                      </th>
                                    </thead>
                                    <tbody>
                                      {data &&
                                        data.list_product.length &&
                                        data.list_product.map((item, index) => (
                                          <tr key={index}>
                                            <td
                                              className="text-center"
                                              style={{
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <Link to={`/product/detail/${item.product_id}`}>
                                                {index + 1}
                                              </Link>
                                            </td>
                                            <td
                                              className="text-center wrap-chbx"
                                              style={{
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <Col className="text-left">{item.product_name}</Col>
                                            </td>
                                            <td
                                              className="text-center wrap-chbx"
                                              style={{
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <Col className="text-center">{item.search_count}</Col>
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
                                  <Col sm={7}>
                                    <FormGroup row className="mt-3">
                                      <Label for="is_active" sm={3}></Label>
                                      <Col sm={6}>
                                        <Field
                                          name="is_active"
                                          render={({ field }) => (
                                            <CustomInput
                                              {...field}
                                              className="pull-left"
                                              onBlur={null}
                                              checked={data ? data.is_active : false}
                                              type="checkbox"
                                              id="is_active"
                                              label="Kích hoạt"
                                              disabled={noEdit}
                                            />
                                          )}
                                        />
                                      </Col>
                                    </FormGroup>
                                  </Col>
                                  <Col sm={5} className="text-right mt-3">
                                    <Button
                                      disabled={isSubmitting}
                                      onClick={() => window._$g.rdr("/search-history")}
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
      </div>
    );
  }
}
