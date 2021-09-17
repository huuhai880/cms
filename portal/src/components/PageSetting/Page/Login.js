import React, { PureComponent } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Alert, Col, Row, Button, Form, FormGroup } from "reactstrap";
import { FormInput } from "@widget";

// Component(s)
import Loading from "../../Common/Loading";
// Model(s)
import ConfigModel from "../../../models/ConfigModel";

/**
 * @class Login
 */
export default class Login extends PureComponent {
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
        LOGIN_TITLE: Yup.object().shape({
            value: Yup.string().required("Tiêu đề lớn là bắt buộc."),
        }),
        LOGIN_H1: Yup.object().shape({
            value: Yup.string().required("Tiêu đề là bắt buộc."),
        }),
        LOGIN_DESCRIPTIONH1: Yup.object().shape({
            value: Yup.string().required("Mô tả ngắn là bắt buộc."),
        }),
        LOGIN_H21: Yup.object().shape({
            value: Yup.string().required("Tiêu đề là bắt buộc."),
        }),
        LOGIN_DESCRIPTIONH21: Yup.object().shape({
            value: Yup.string().required("Mô tả ngắn là bắt buộc."),
        }),
        LOGIN_H22: Yup.object().shape({
            value: Yup.string().required("Tiêu đề là bắt buộc."),
        }),
        LOGIN_DESCRIPTIONH22: Yup.object().shape({
            value: Yup.string().required("Mô tả ngắn là bắt buộc."),
        }),
        LOGIN_H23: Yup.object().shape({
            value: Yup.string().required("Tiêu đề là bắt buộc."),
        }),
        LOGIN_DESCRIPTIONH23: Yup.object().shape({
            value: Yup.string().required("Mô tả ngắn là bắt buộc."),
        }),
    });

    getInitialValues() {
        let values = Object.assign(
            {},
            {
                LOGIN_TITLE: {
                    value: "",
                    data_type: "string",
                },
                LOGIN_H1: {
                    value: "",
                    data_type: "string",
                },
                LOGIN_DESCRIPTIONH1: {
                    value: "",
                    data_type: "string",
                },
                LOGIN_H21: {
                    value: "",
                    data_type: "string",
                },
                LOGIN_DESCRIPTIONH21: {
                    value: "",
                    data_type: "string",
                },
                LOGIN_H22: {
                    value: "",
                    data_type: "string",
                },
                LOGIN_DESCRIPTIONH22: {
                    value: "",
                    data_type: "string",
                },
                LOGIN_H23: {
                    value: "",
                    data_type: "string",
                },
                LOGIN_DESCRIPTIONH23: {
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
        let all = [this._configModel.getPageConfig("LOGIN").then((data) => (bundle = data))];

        await Promise.all(all).catch((err) =>
            window._$g.dialogs.alert(
                window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`)
            )
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
            typeof values[prop] === "string" && (values[prop] = values[prop].trim());
        });
        //.end
    }
    handleFormikSubmit(values, formProps) {
        let { setSubmitting } = formProps;
        let alerts = [];
        let apiCall = this._configModel.updatePageConfig("LOGIN", values);
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

    render() {
        let { _id, ready, alerts } = this.state;
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
                                let { errors, handleSubmit, handleReset, isSubmitting } =
                                    (this.formikProps =
                                    window._formikProps =
                                        formikProps);
                                // Render
                                return (
                                    <Form
                                        id="form1st"
                                        onSubmit={handleSubmit}
                                        onReset={handleReset}
                                    >
                                        <Row className="d-flex justify-content-center">
                                            <Col xs={12}>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề lớn"
                                                                name="LOGIN_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="LOGIN_H1.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn"
                                                                type="textarea"
                                                                name="LOGIN_DESCRIPTIONH1.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                            />
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="LOGIN_H21.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn"
                                                                type="textarea"
                                                                name="LOGIN_DESCRIPTIONH21.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                            />
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="LOGIN_H22.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn"
                                                                type="textarea"
                                                                name="LOGIN_DESCRIPTIONH22.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                            />
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="LOGIN_H23.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn"
                                                                type="textarea"
                                                                name="LOGIN_DESCRIPTIONH23.value"
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
                                                                    onClick={() =>
                                                                        this.handleSubmit("save")
                                                                    }
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
            </div>
        );
    }
}
