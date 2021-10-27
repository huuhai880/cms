import React, { PureComponent } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Alert, Col, Row, Button, Form, FormGroup, Table } from "reactstrap";
import { FormInput } from "@widget";

// Component(s)
import Loading from "../../Common/Loading";
// Model(s)
import ConfigModel from "../../../models/ConfigModel";
import IntroduceFounder from "./IntroduceFounder";

/**
 * @class Decryption
 */
export default class Decryption extends PureComponent {
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
         founderSelected: null,
         indexFounderSelected: -1,
         isOpenModal: false,
         visionImage: "",
         clearVisionImage: false,
         pureValueImage: "",
         clearPureValueImage: false,
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
      DECRYPTION_TITLE: Yup.object().shape({
         value: Yup.string().required("Tiêu đề trên là bắt buộc."),
      }),
      DECRYPTION_DESCRIPTION: Yup.object().shape({
         value: Yup.string().required("Mô tả là bắt buộc."),
      }),
      DECRYPTION_CONTENT_TITLE: Yup.object().shape({
         value: Yup.string().required("Nội dung là bắt buộc."),
      }),
      DECRYPTION_DESCRIPTION_BOTTOM: Yup.object().shape({
         value: Yup.string().required("Mô tả dưới là bắt buộc."),
      }),
   });

   getInitialValues() {
      let values = Object.assign(
         {},
         {
            DECRYPTION_TITLE: {
               value: "",
               data_type: "string",
            },
            DECRYPTION_DESCRIPTION: {
               value: "",
               data_type: "string",
            },
            DECRYPTION_CONTENT_TITLE: {
               value: "",
               data_type: "string",
            },
            DECRYPTION_CONTENT_LIST: {
               value: [
                  {
                     image: "",
                     description: "",
                  },
               ],
               data_type: "json",
            },
            DECRYPTION_DESCRIPTION_BOTTOM: {
               value: "",
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
      let all = [this._configModel.getPageConfig("DECRYPTION").then((data) => (bundle = data))];

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
      return bundle;
   }

   handleSubmit() {
      let { submitForm } = this.formikProps;
      return submitForm();
   }

   handleFormikValidate(values) {
      // Trim string values,...
      Object.keys(values).forEach((prop) => {
         values[prop]['data_type'] === "string" && (values[prop]['value'] = values[prop]['value'].trim());
      });
      //.end
   }
   handleFormikSubmit(values, formProps) {
      let { setSubmitting } = formProps;
      let alerts = [];
      let apiCall = this._configModel.updatePageConfig("DECRYPTION", values);
      console.log(values)
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

   handleDelete(confirm, index) {
      let { values, handleChange } = this.formikProps;
      let {
         DECRYPTION_CONTENT_LIST: { value },
      } = values;
      if (confirm) {
         const cloneData = JSON.parse(JSON.stringify(value));
         cloneData.splice(index, 1);
         handleChange({
            target: {
               name: "DECRYPTION_CONTENT_LIST",
               value: { value: cloneData, data_type: "json" },
            },
         });
      }
   }

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
         DECRYPTION_CONTENT_LIST: { value },
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
         handleChange({ target: { name: "DECRYPTION_CONTENT_LIST.value", value } });
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
               DECRYPTION_CONTENT_LIST: { value },
            } = values;
            let cloneData = JSON.parse(JSON.stringify(value));
            if (index >= 0) {
               cloneData[index] = item;
            } else {
               cloneData.push(item);
            }
            handleChange({
               target: {
                  name: "DECRYPTION_CONTENT_LIST",
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

   handleAddItem = () => {
      this.setState({ isOpenModal: true });
   };

   handleCloseIntroduceFounder = () => {
      this.setState({ isOpenModal: false, founderSelected: null });
   };

   handleRemoveItem = (index) => {
      window._$g.dialogs.prompt("Bạn có chắc chắn muốn xóa dữ liệu đang chọn?", "Xóa", (confirm) =>
         this.handleDelete(confirm, index)
      );
   };

   render() {
      let {
         _id,
         ready,
         alerts,
         visionImage,
         clearVisionImage,
         pureValueImage,
         clearPureValueImage,
         indexFounderSelected,
         founderSelected,
         isOpenModal,
      } = this.state;

      let { noEdit } = this.props;
      let initialValues = this.getInitialValues();

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
                                    <Row>
                                       <Col xs={8} className="mx-auto">
                                          <Row>
                                             <FormInput
                                                label="Tiêu đề trên"
                                                name="DECRYPTION_TITLE.value"
                                                labelSm={3}
                                                inputSm={9}
                                                isEdit={!noEdit}
                                             />
                                             <FormInput
                                                label="Mô tả"
                                                type="textarea"
                                                name="DECRYPTION_DESCRIPTION.value"
                                                isEdit={!noEdit}
                                                labelSm={3}
                                                inputSm={9}
                                                inputClassName="home-page_textarea"
                                             />
                                             <FormInput
                                                label="Nội dung"
                                                name="DECRYPTION_CONTENT_TITLE.value"
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
                                                         <th style={{ width: 150 }}
                                                            className="text-center"
                                                         >
                                                            Hình ảnh/Icon
                                                         </th>
                                                         <th

                                                            className="text-center"
                                                         >
                                                            Mô tả ngắn
                                                         </th>
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
                                                      {values.DECRYPTION_CONTENT_LIST &&
                                                         values.DECRYPTION_CONTENT_LIST.value &&
                                                         values.DECRYPTION_CONTENT_LIST.value.length
                                                         ? values.DECRYPTION_CONTENT_LIST.value.map((item, index) => (
                                                            <tr key={index}>
                                                               <td
                                                                  style={{

                                                                     verticalAlign: 'middle',
                                                                     textAlign: 'center'

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
                                                                        values.DECRYPTION_CONTENT_LIST.value.length -
                                                                        1 ===
                                                                        index || noEdit
                                                                     }
                                                                     onClick={(evt) =>
                                                                        this.handleSortFDTeam("down", item, evt)
                                                                     }
                                                                  >
                                                                     <i className="fa fa-arrow-down" />
                                                                  </Button>
                                                               </td>
                                                               <td className="text-center" style={{ verticalAlign: 'middle' }}>{index + 1}</td>
                                                               <td
                                                                  style={{

                                                                     verticalAlign: 'middle',
                                                                     textAlign: 'center'
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
                                                               <td className="text-center" style={{ verticalAlign: 'middle' }}>
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
                                             <FormInput
                                                label="Mô tả dưới"
                                                name="DECRYPTION_DESCRIPTION_BOTTOM.value"
                                                labelSm={3}
                                                inputSm={9}
                                                isEdit={!noEdit}
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
               <IntroduceFounder
                  item={founderSelected}
                  index={indexFounderSelected}
                  handleCreateOrUpdateItem={this.handleCreateOrUpdateItem}
                  handleCloseIntroduceFounder={this.handleCloseIntroduceFounder}
               />
            )}
         </div>
      );
   }
}
