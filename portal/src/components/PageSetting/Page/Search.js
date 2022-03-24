import React, { PureComponent } from "react";
import { Formik } from 'formik';
import * as Yup from "yup";
import {
    Alert,
    Col,
    Row,
    Button,
    Form,
    FormGroup,
} from "reactstrap";
import {
    FormInput,
    UploadImage
} from "@widget";

import Loading from '../../Common/Loading';
import ConfigModel from '../../../models/ConfigModel';

export default class Search extends PureComponent {
    formikProps = null;
    constructor(props) {
        super(props);
        this._configModel = new ConfigModel();
        this.handleFormikSubmit = this.handleFormikSubmit.bind(this);

        this.state = {
            alerts: [],
            ready: false,
            configEnt: {}
        };
    }


    componentDidMount() {
        (async () => {
            let configEnt = await this._getBundleData();
            this.setState({
                configEnt,
                ready: true
            });
        })();
    }


    getInitialValues() {
        let values = Object.assign(
            {},
            {
                PHONENUMBER_TITLE: {
                    value: '',
                    data_type: "string",
                },
                PHONENUMBER_DESCRIPTION: {
                    value: '',
                    data_type: "string",
                },

                CUSTOMER_TITLE: {
                    value: '',
                    data_type: "string",
                },
                CUSTOMER_DESCRIPTION: {
                    value: '',
                    data_type: "string",
                },

                HOUSENUMBER_TITLE: {
                    value: '',
                    data_type: "string",
                },

                HOUSENUMBER_DESCRIPTION: {
                    value: '',
                    data_type: "string",
                },

                LOVE_TITLE: {
                    value: '',
                    data_type: "string",
                },

                LOVE_DESCRIPTION: {
                    value: '',
                    data_type: "string",
                },

                CHILD_TITLE: {
                    value: '',
                    data_type: "string",
                },

                CHILD_DESCRIPTION: {
                    value: '',
                    data_type: "string",
                },

            },
        );
        if (this.state.configEnt) {
            values = Object.assign(values, this.state.configEnt)
        }
        Object.keys(values).forEach(key => {
            if (null === values[key]) {
                values[key] = "";
            }
        });
        return values;
    }

    async _getBundleData() {
        let bundle = {};
        let all = [
            this._configModel.getPageConfig('SEARCH_BOX')
                .then(data => bundle = data)
        ];

        await Promise.all(all)
            .catch(err => window._$g.dialogs.alert(
                window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`)
            ));
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

    handleFormikSubmit(values, formProps) {
        let { setSubmitting } = formProps;
        let alerts = [];
        let apiCall = this._configModel.updatePageConfig('SEARCH_BOX', values);
        apiCall
            .then(data => { // OK
                window._$g.toastr.show('Cập nhật thành công!', 'success');
                return data;
            })
            .catch(apiData => { // NG
                let { errors, statusText, message } = apiData;
                let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join('<br/>');
                alerts.push({ color: "danger", msg });
            })
            .finally(() => {
                setSubmitting(false);
                this.setState(() => ({ alerts }), () => { window.scrollTo(0, 0); });
            });
    }

    render() {
        let {
            ready,
            alerts,
        } = this.state;
        let initialValues = this.getInitialValues();

        // Ready?
        if (!ready) {
            return <Loading />;
        }

        return (
            <div key={`view-search-box`} className="animated fadeIn">
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
                            {formikProps => {

                                let {
                                    errors,
                                    handleSubmit,
                                    handleReset,
                                    isSubmitting
                                } = (this.formikProps = window._formikProps = formikProps);
                                // Render
                                return (
                                    <Form
                                        id="form1st"
                                        onSubmit={handleSubmit}
                                        onReset={handleReset}
                                    >
                                        <Row className="d-flex justify-content-center">
                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">Tra cứu Số điện thoại</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="PHONENUMBER_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả"
                                                                type="textarea"
                                                                name="PHONENUMBER_DESCRIPTION.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">Tra cứu Số nhà</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="HOUSENUMBER_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả"
                                                                type="textarea"
                                                                name="HOUSENUMBER_DESCRIPTION.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">Tra cứu Khách hàng</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="CUSTOMER_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả"
                                                                type="textarea"
                                                                name="CUSTOMER_DESCRIPTION.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">Tra cứu Sự tương hợp</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="LOVE_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả"
                                                                type="textarea"
                                                                name="LOVE_DESCRIPTION.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>


                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">Tra cứu Con cái</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="CHILD_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả"
                                                                type="textarea"
                                                                name="CHILD_DESCRIPTION.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
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
                                                                <Button key="buttonSave" type="submit" color="primary" disabled={isSubmitting} onClick={() => this.handleSubmit('save')} className="mr-2 btn-block-sm">
                                                                    <i className="fa fa-save mr-2" />Cập nhật
                                                                </Button>
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Form>
                                );
                            }}</Formik>
                    </Col>
                </Row>
            </div>
        );
    }
}
