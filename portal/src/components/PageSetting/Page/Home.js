import React, { PureComponent } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Alert, Col, Row, Button, Form, FormGroup, Table } from "reactstrap";

import { FormInput } from "@widget";

// Component(s)
import Loading from "../../Common/Loading";
// Model(s)
import ConfigModel from "../../../models/ConfigModel";
import HomeModal from "./HomeModal";

/**
 * @class HomePage
 */
export default class HomePage extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._configModel = new ConfigModel();

    // Bind method(s)
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikValidate = this.handleFormikValidate.bind(this);

    this.state = {
      _id: 0,
      alerts: [],
      ready: false,
      configEnt: null,
      isOpenModal: false,
      founderSelected: null,
      indexFounderSelected: -1,
    };
  }

  componentDidMount() {
    (async () => {
      let { configEnt } = this.state;
      let bundle = await this._getBundleData();
      if (bundle) configEnt = bundle;
      this.setState({ ...bundle, configEnt, ready: true });
    })();
  }

  formikValidationSchema = Yup.object().shape({
    HOME_TSH_TITLE1: Yup.object().shape({
      value: Yup.string().required("Tiêu đề trên của KHÁM PHÁ BÍ MẬT là bắt buộc."),
    }),
    HOME_TSH_TITLE2: Yup.object().shape({
      value: Yup.string().required("Tiêu đề dưới của KHÁM PHÁ BÍ MẬT là bắt buộc."),
    }),
    HOME_TSH_DESCRIPTION: Yup.object().shape({
      value: Yup.string().required("Mô tả ngắn của KHÁM PHÁ BÍ MẬT là bắt buộc."),
    }),
    HOME_TSH_BUTTON: Yup.object().shape({
      value: Yup.string().required("Tên link của KHÁM PHÁ BÍ MẬT là bắt buộc."),
    }),
    HOME_TSH_USED: Yup.object().shape({
      value: Yup.string().required("Số người dùng là bắt buộc."),
    }),
    HOME_TSH_USED_DESCRIPTION: Yup.object().shape({
      value: Yup.string().required("Mô tả ngắn SỐ NGƯỜI DÙNG là bắt buộc."),
    }),
    HOME_TSH_STARTNOW_TITLE: Yup.object().shape({
      value: Yup.string().required("Tiêu đề BẮT ĐẦU NGAY là bắt buộc."),
    }),
    HOME_TSH_WELCOME_TITLE1: Yup.object().shape({
      value: Yup.string().required("Tiêu đề trên của CHÀO MỪNG là bắt buộc."),
    }),
    HOME_TSH_WELCOME_TITLE2: Yup.object().shape({
      value: Yup.string().required("Tiêu đề dưới của CHÀO MỪNG là bắt buộc."),
    }),
    HOME_TSH_WELCOME_DESCRIPTION: Yup.object().shape({
      value: Yup.string().required("Mô tả ngắn của CHÀO MỪNG là bắt buộc."),
    }),
    HOME_TSH_WELCOME_BUTTON: Yup.object().shape({
      value: Yup.string().required("Tên link của CHÀO MỪNG là bắt buộc."),
    }),
    HOME_TSH_NUMBER_TITLE: Yup.object().shape({
      value: Yup.string().required("Tiêu đề CHỌN SỐ PATH là bắt buộc."),
    }),
    HOME_TSH_FOOTER_TITLE: Yup.object().shape({
      value: Yup.string().required("Tiêu đề ở FOOTER là bắt buộc."),
    }),
    HOME_TSH_FOOTER_DESCRIPTION: Yup.object().shape({
      value: Yup.string().required("Mô tả ngắn gọn ở FOOTER là bắt buộc."),
    }),
    HOME_TSH_REVIEW_TITLE: Yup.object().shape({
      value: Yup.string().required("Tiêu đề CẢM NHẬN KHÁCH HÀNG là bắt buộc."),
    }),
  });

  getInitialValues() {
    let values = Object.assign(
      {},
      {
        HOME_TSH_TITLE1: {
          value: "KHÁM PHÁ BÍ MẬT",
          data_type: "string",
        },
        HOME_TSH_TITLE2: {
          value: "QUA NGÀY THÁNG NĂM SINH CỦA BẠN",
          data_type: "string",
        },
        HOME_TSH_DESCRIPTION: {
          value:
            "Những kiến thức trí tuệ cổ xưa của Nhà toán học Pythagoras giúp bạn Thấu hiểu sâu sắc về chính bản thân mình.",
          data_type: "string",
        },
        HOME_TSH_BUTTON: {
          value: "Nhận báo cáo miễn phí",
          data_type: "string",
        },
        HOME_TSH_USED: {
          value: "883 600",
          data_type: "string",
        },
        HOME_TSH_USED_DESCRIPTION: {
          value:
            "Người lựa chọn ungdungthansohoc.com để sở hữu những kiến thức chính xác nhất định hướng phát triển cá nhân và tổ chức của mình",
          data_type: "string",
        },
        HOME_TSH_STARTNOW_TITLE: {
          value: "BẮT ĐẦU NGAY",
          data_type: "string",
        },
        HOME_TSH_WELCOME_TITLE1: {
          value: "CHÀO MỪNG BẠN ĐẾN VỚI",
          data_type: "string",
        },
        HOME_TSH_WELCOME_TITLE2: {
          value: "HÀNH TRÌNH KHÁM PHÁ BẢN THÂN",
          data_type: "string",
        },
        HOME_TSH_WELCOME_DESCRIPTION: {
          value:
            "Trang ungdungthansohoc.com ra đời với mục tiêu số 1 là hỗ trợ bạn trên con đường thấu hiểu sâu sắc chính bản thân mình và trở nên tự tin hơn trong cuộc sống. Tại đây, bạn không chỉ tìm thấy cho mình những luận giải chính xác nhất, hữu ích nhất về bản thân thông qua ngày tháng năm sinh mà còn tìm thấy những công cụ đầy sức mạnh để hỗ trợ bạn trong việc phát triển sự nghiệp, hài hòa trong các mối quan hệ và phát triển bản thân tốt nhất.",
          data_type: "string",
        },
        HOME_TSH_WELCOME_BUTTON: {
          value: "Bắt đầu hành trình nào!",
          data_type: "string",
        },
        HOME_TSH_NUMBER_TITLE: {
          value: "HÃY CHỌN SỐ PATH CHO CUỘC SỐNG CỦA BẠN",
          data_type: "string",
        },
        HOME_TSH_FOOTER_TITLE: {
          value: "THẦN SỐ HỌC: CÔNG THỨC KHÁM PHÁ CUỘC CỦA ĐỜI BẠN",
          data_type: "string",
        },
        HOME_TSH_FOOTER_DESCRIPTION: {
          value:
            "Tính số đường đời, số thúc giục linh hồn và số biểu hiện của bạn chỉ dựa trên tên và ngày sinh của bạn với Máy tính số học của chúng tôi .",
          data_type: "string",
        },
        HOME_TSH_REVIEW_TITLE: {
          value: "CẢM NHẬN TỪ KHÁCH HÀNG",
          data_type: "string",
        },
      }
    );
    if (this.state.configEnt) {
      values = Object.assign(values, this.state.configEnt);
    }
    Object.keys(values).forEach((key) => {
      if (null === values[key]) {
        values[key] = "";
      }
    });
    return values;
  }

  async _getBundleData() {
    let bundle = {};
    let all = [this._configModel.getPageConfig("HOME").then((data) => (bundle = data))];
    await Promise.all(all).catch((err) =>
      window._$g.dialogs.alert(window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`))
    );
    Object.keys(bundle).forEach((key) => {
      let data = bundle[key];
      let stateValue = this.state[key];
      if (data instanceof Array && stateValue instanceof Array) {
        data = [stateValue[0]].concat(data);
      }
      bundle[key] = data;
    });
    console.log(bundle);

    return bundle;
  }

  handleSubmit() {
    let { submitForm } = this.formikProps;
    return submitForm();
  }

  handleFormikValidate(values) {
    // Trim string values,...
    Object.keys(values).forEach((prop) => {
      typeof values[prop] === "string" && (values[prop] = values[prop].trim());
    });
    //.end
  }
  handleFormikSubmit(values, formProps) {
    let { setSubmitting } = formProps;
    let alerts = [];
    let apiCall = this._configModel.updatePageConfig("HOME", values);
    // console.log(values)
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Cập nhật thành công!", "success");
        return data;
      })
      .catch((apiData) => {
        // NG
        let { errors, statusText, message } = apiData;
        let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");
        alerts.push({ color: "danger", msg });
      })
      .finally(() => {
        setSubmitting(false);
        this.setState(
          () => ({ alerts }),
          () => {
            window.scrollTo(0, 0);
          }
        );
      });
  }
  handleAddItem = () => {
    this.setState({ isOpenModal: true });
  };
  handleEditItem = (item, index) => {
    this.setState(
      {
        founderSelected: item,
        indexFounderSelected: index,
      },
      () => {
        this.setState({ isOpenModal: true });
      }
    );
  };
  handleSortFDTeam = (type, item) => {
    let { values, handleChange } = this.formikProps;
    let {
      HOME_STARTNOW_LIST: { value },
    } = values;
    let nextIdx = null;
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
      handleChange({ target: { name: "HOME_STARTNOW_LIST.value", value } });
    }
  };
  handleCreateOrUpdateItem = (item, index) => {
    this.setState(
      {
        isOpenModal: false,
      },
      () => {
        let { values, handleChange } = this.formikProps;
        let {
          HOME_STARTNOW_LIST: { value },
        } = values;
        let cloneData = JSON.parse(JSON.stringify(value));
        if (index >= 0) {
          cloneData[index] = item;
        } else {
          cloneData.push(item);
        }
    //   console.log(values)
        handleChange({
          target: {
            name: "HOME_STARTNOW_LIST",
            value: { value: cloneData, data_type: "json" },
          },
        });
        
        this.setState({
          founderSelected: null,
          indexFounderSelected: -1,
        });
      }
    );
  };
  handleCloseHomeModal = () => {
    this.setState({ isOpenModal: false, founderSelected: null });
  };

  handleRemoveItem = (index) => {
    window._$g.dialogs.prompt("Bạn có chắc chắn muốn xóa dữ liệu đang chọn?", "Xóa", (confirm) =>
      this.handleDelete(confirm, index)
    );
  };
  handleDelete(confirm, index) {
    let { values, handleChange } = this.formikProps;
    let {
      HOME_STARTNOW_LIST: { value },
    } = values;
    if (confirm) {
      const cloneData = JSON.parse(JSON.stringify(value));
      cloneData.splice(index, 1);
      handleChange({
        target: {
          name: "HOME_STARTNOW_LIST",
          value: { value: cloneData, data_type: "json" },
        },
      });
    }
  }
  render() {
    // let { _id, ready, alerts } = this.state;
    let { noEdit } = this.props;
    let initialValues = this.getInitialValues();
    let { _id, ready, alerts, indexFounderSelected, founderSelected, isOpenModal } = this.state;
    // Ready?
    if (!ready) {
      return <Loading />;
    }

    return (
      <div key={`view-${_id}`} className="animated fadeIn">
        <Row className="d-flex justify-content-center">
          <Col xs={12}>
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
              validate={this.handleFormikValidate}
              onSubmit={this.handleFormikSubmit}
            >
              {(formikProps) => {
                let { values, errors, handleSubmit, handleReset, isSubmitting } =
                  (this.formikProps =
                  window._formikProps =
                    formikProps);
                // Render
                return (
                  <Form id="form1st" onSubmit={handleSubmit} onReset={handleReset}>
                    <Row className="d-flex justify-content-center">
                      <Col xs={12}>
                        <Row className="mb-4">
                          <Col xs={8} className="mx-auto">
                            <b className="title_page_h1 text-primary underline">
                              Khám phá bí mật & Số người sử dụng
                            </b>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={8} className="mx-auto">
                            <Row>
                              <FormInput
                                label="Tiêu đề trên"
                                name="HOME_TSH_TITLE1.value"
                                labelSm={3}
                                inputSm={9}
                                isEdit={!noEdit}
                              />
                              <FormInput
                                label="Tiêu đề dưới"
                                name="HOME_TSH_TITLE2.value"
                                labelSm={3}
                                inputSm={9}
                                isEdit={!noEdit}
                              />
                              <FormInput
                                label="Mô tả ngắn"
                                type="textarea"
                                name="HOME_TSH_DESCRIPTION.value"
                                isEdit={!noEdit}
                                labelSm={3}
                                inputSm={9}
                                inputClassName="home-page_textarea"
                              />
                              <FormInput
                                label="Tiêu đề link"
                                name="HOME_TSH_BUTTON.value"
                                labelSm={3}
                                inputSm={9}
                                isEdit={!noEdit}
                              />
                              <FormInput
                                label="Số người sử dụng"
                                name="HOME_TSH_USED.value"
                                labelSm={3}
                                inputSm={9}
                                isEdit={!noEdit}
                              />
                              <FormInput
                                label="Mô tả ngắn"
                                type="textarea"
                                name="HOME_TSH_USED_DESCRIPTION.value"
                                isEdit={!noEdit}
                                labelSm={3}
                                inputSm={9}
                                inputClassName="home-page_textarea"
                              />
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row className="mb-4">
                          <Col xs={8} className="mx-auto">
                            <b className="title_page_h1 text-primary underline">Bắt đầu ngay</b>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={8} className="mx-auto">
                            <Row>
                              <FormInput
                                label="Tiêu đề"
                                name="HOME_TSH_STARTNOW_TITLE.value"
                                labelSm={3}
                                inputSm={9}
                                isEdit={!noEdit}
                              />
                              <Col>
                                <Col
                                  sm={6}
                                  xs={12}
                                  className="text-right mb-3 pull-right pr-0 mr-0"
                                >
                                  <Button
                                    className="btn-sm"
                                    onClick={(e) => this.handleAddItem(e)}
                                    color="secondary"
                                  >
                                    <i className="fa fa-plus mr-2" />
                                    Thêm
                                  </Button>
                                </Col>
                                <Table bordered>
                                  <thead>
                                    <tr>
                                      <th style={{ width: 100 }} className="text-center">
                                        <i className="fa fa-list" />
                                      </th>
                                      <th style={{ width: 100 }} className="text-center">
                                        Thứ tự
                                      </th>
                                      <th style={{ width: 150 }} className="text-center">
                                        Hình ảnh/Icon
                                      </th>
                                      <th className="text-center">Mô tả </th>
                                      <th className="text-center">Button </th>
                                      <th className="text-center">Link button </th>
                                      <th
                                        style={{
                                          width: 100,
                                        }}
                                        className="text-center"
                                      >
                                        Thao tác
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {values.HOME_STARTNOW_LIST &&
                                    values.HOME_STARTNOW_LIST.value &&
                                    values.HOME_STARTNOW_LIST.value.length
                                      ? values.HOME_STARTNOW_LIST.value.map((item, index) => (
                                          <tr key={index}>
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
                                                disabled={0 === index || noEdit}
                                                onClick={(evt) =>
                                                  this.handleSortFDTeam("up", item, evt)
                                                }
                                              >
                                                <i className="fa fa-arrow-up" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                color="success"
                                                disabled={
                                                  values.HOME_STARTNOW_LIST.value.length - 1 ===
                                                    index || noEdit
                                                }
                                                onClick={(evt) =>
                                                  this.handleSortFDTeam("down", item, evt)
                                                }
                                              >
                                                <i className="fa fa-arrow-down" />
                                              </Button>
                                            </td>
                                            <td
                                              className="text-center"
                                              style={{ verticalAlign: "middle" }}
                                            >
                                              {index + 1}
                                            </td>
                                            <td
                                              style={{
                                                verticalAlign: "middle",
                                                textAlign: "center",
                                              }}
                                            >
                                              {item.image ? (
                                                <img
                                                  src={item.image}
                                                  style={{
                                                    height: 50,
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              ) : null}
                                            </td>
                                            {/* <td className="text-left">{item.title}</td> */}
                                            <td className="text-left">{item.description}</td>
                                            <td className="text-left">{item.button}</td>
                                            <td className="text-left">{item.linkbutton}</td>

                                            <td
                                              className="text-center"
                                              style={{ verticalAlign: "middle" }}
                                            >
                                              <Button
                                                color="primary"
                                                title="Chỉnh sửa"
                                                style={{
                                                  width: 24,
                                                  height: 24,
                                                  padding: 0,
                                                }}
                                                onClick={(e) => this.handleEditItem(item, index)}
                                                className="mr-1"
                                              >
                                                <i className="fa fa-edit" />
                                              </Button>
                                              <Button
                                                color="danger"
                                                style={{
                                                  width: 24,
                                                  height: 24,
                                                  padding: 0,
                                                }}
                                                onClick={(e) => this.handleRemoveItem(index)}
                                                title="Xóa"
                                              >
                                                <i className="fa fa-minus-circle" />
                                              </Button>
                                            </td>
                                          </tr>
                                        ))
                                      : null}
                                  </tbody>
                                </Table>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row className="mb-4">
                          <Col xs={8} className="mx-auto">
                            <b className="title_page_h1 text-primary underline">Chào mừng</b>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={8} className="mx-auto">
                            <Row>
                              <FormInput
                                label="Tiêu đề trên"
                                name="HOME_TSH_WELCOME_TITLE1.value"
                                labelSm={3}
                                inputSm={9}
                                isEdit={!noEdit}
                              />
                              <FormInput
                                label="Tiêu đề dưới"
                                name="HOME_TSH_WELCOME_TITLE2.value"
                                labelSm={3}
                                inputSm={9}
                                isEdit={!noEdit}
                              />
                              <FormInput
                                label="Mô tả ngắn"
                                type="textarea"
                                name="HOME_TSH_WELCOME_DESCRIPTION.value"
                                isEdit={!noEdit}
                                labelSm={3}
                                inputSm={9}
                                inputClassName="home-page_textarea_WELCOME"
                              />
                              <FormInput
                                label="Tiêu đề link"
                                name="HOME_TSH_WELCOME_BUTTON.value"
                                labelSm={3}
                                inputSm={9}
                                isEdit={!noEdit}
                              />
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row className="mb-4">
                          <Col xs={8} className="mx-auto">
                            <b className="title_page_h1 text-primary underline">Chọn số PATH</b>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={8} className="mx-auto">
                            <Row>
                              <FormInput
                                label="Tiêu đề"
                                name="HOME_TSH_NUMBER_TITLE.value"
                                labelSm={3}
                                inputSm={9}
                                isEdit={!noEdit}
                              />
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row className="mb-4">
                          <Col xs={8} className="mx-auto">
                            <b className="title_page_h1 text-primary underline">
                              Cảm nhận khách hàng
                            </b>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={8} className="mx-auto">
                            <Row>
                              <FormInput
                                label="Tiêu đề"
                                name="HOME_TSH_REVIEW_TITLE.value"
                                labelSm={3}
                                inputSm={9}
                                isEdit={!noEdit}
                              />
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row className="mb-4">
                          <Col xs={8} className="mx-auto">
                            <b className="title_page_h1 text-primary underline">
                              Thần số học & Công thức khám phá
                            </b>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={8} className="mx-auto">
                            <Row>
                              <FormInput
                                label="Tiêu đề"
                                name="HOME_TSH_FOOTER_TITLE.value"
                                labelSm={3}
                                inputSm={9}
                                isEdit={!noEdit}
                              />
                              <FormInput
                                label="Mô tả ngắn"
                                type="textarea"
                                name="HOME_TSH_FOOTER_DESCRIPTION.value"
                                isEdit={!noEdit}
                                labelSm={3}
                                inputSm={9}
                                inputClassName="home-page_textarea"
                              />
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row>
                          <Col xs={8} className="mx-auto">
                            <FormGroup row>
                              <Col sm={12} className="text-right">
                                <Button
                                  key="buttonSave"
                                  type="submit"
                                  color="primary"
                                  disabled={isSubmitting}
                                  onClick={() => this.handleSubmit("save")}
                                  className="mr-2 btn-block-sm"
                                >
                                  <i className="fa fa-save mr-2" />
                                  Cập nhật
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
          </Col>
        </Row>
        {isOpenModal && (
          <HomeModal
            item={founderSelected}
            index={indexFounderSelected}
            handleCreateOrUpdateItem={this.handleCreateOrUpdateItem}
            handleCloseHomeModal={this.handleCloseHomeModal}
          />
        )}
      </div>
    );
  }
}
