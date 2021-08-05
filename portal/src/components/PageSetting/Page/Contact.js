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
    FormInput
} from "@widget";

// Component(s)
import Loading from '../../Common/Loading';
// Model(s)
import ConfigModel from '../../../models/ConfigModel';

/**
 * @class Contact
 */
export default class Contact extends PureComponent {

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
            configEnt: null 
        };
    }

    componentDidMount() {
        (async () => {
            let {  configEnt} = this.state;
            let bundle = await this._getBundleData();
            if(bundle) configEnt = bundle;
            this.setState({ ...bundle, configEnt, ready: true });
        })();
    }

    formikValidationSchema = Yup.object().shape({
        CONTACT_ADDRESS: Yup.object().shape({
            value: Yup.string().required("Địa chỉ là bắt buộc."),
        }),
        CONTACT_EMAIL:  Yup.object().shape({
            value:  Yup.string().required("Email là bắt buộc."),
        }),
        CONTACT_HOTLINE:  Yup.object().shape({
            value:  Yup.string().required("Hotline là bắt buộc."),
        }),
        CONTACT_MAP:  Yup.object().shape({
            value: Yup.string().required("Link google map là bắt buộc."),
        }),
    });

    getInitialValues() {
        let values = Object.assign(
            {}, {
                CONTACT_ADDRESS: {
                    value: "Số 1 Võ Chí Công - Phường Nghĩa Đô - quận Cầu Giấy - TP. Hà Nội",
                    data_type: 'string'
                },
                CONTACT_EMAIL: {
                    value: "0936 021 086",
                    data_type: 'string'
                },
                CONTACT_HOTLINE: {
                    value: "trungtamkinhdoanh.scc@gmail.com",
                    data_type: 'string'
                },
                CONTACT_MAP:{
                    value:  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.4078107838995!2d106.3393020147001!3d20.93613189631049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31359b35ef0af157%3A0xb03b10434f1cf90!2zMSBOZ3V54buFbiBI4buvdSBD4bqndSwgUC4gTmfhu41jIENow6J1LCBUaMOgbmggcGjhu5EgSOG6o2kgRMawxqFuZywgSOG6o2kgRMawxqFuZywgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1618219654624!5m2!1svi!2s",
                    data_type: 'string'
                },
            },
        );
        if(this.state.configEnt){
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
            this._configModel.getPageConfig('CONTACT')
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

    handleFormikValidate(values) {
        // Trim string values,...
        Object.keys(values).forEach(prop => {
            (typeof values[prop] === "string") && (values[prop] = values[prop].trim());
        });
        //.end
    }
    handleFormikSubmit(values, formProps) {
        let { setSubmitting } = formProps;
        let alerts = [];
        let apiCall = this._configModel.updatePageConfig('CONTACT', values);
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
            })
            ;
    }

    render() {
        let {
            _id,
            ready,
            alerts,
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
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Địa chỉ"
                                                                name="CONTACT_ADDRESS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Email"
                                                                name="CONTACT_EMAIL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Hotline"
                                                                name="CONTACT_HOTLINE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Link google map"
                                                                name="CONTACT_MAP.value"
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
