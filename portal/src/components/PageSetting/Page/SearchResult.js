import React, { useEffect, useState } from 'react';
import { Formik } from "formik";
import * as yup from "yup";
import { Alert, Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useFormik } from "formik";

// Component(s)
import Loading from "../../Common/Loading";
// Model(s)
import ConfigModel from "../../../models/ConfigModel";
import '../styles.scss';

let initValue = {
    SEARCH_RESULTS_CONTENT: {
        value: "",
        data_type: "string",
    },
    SEARCH_RESULTS_LINK: {
        value: "",
        data_type: "string",
    },
    SEARCH_RESULTS_LIMIT_NOT_LOGIN: {
        value: 0,
        data_type: "number",
    },
    SEARCH_RESULTS_LIMIT_LOGIN: {
        value: 0,
        data_type: "number",
    },
}

const SearchResults = () => {
    const [_id, _setid] = useState(0);
    const [isSubmitting, setSubmitting] = useState(false)
    const _configModel = new ConfigModel();
    const [configEnt, set_configEnt] = useState(null)
    const [ready, set_ready] = useState(false);

    const [initialValues, set_initialValues] = useState(initValue)
    

    const validationSchema = yup.object().shape({
        SEARCH_RESULTS_CONTENT: yup.object().shape({
            value: yup
                .string()
                .required("Nội dung tra cứu là bắt buộc."),
        }),
        SEARCH_RESULTS_LINK: yup.object().shape({
            value: yup
                .string()
                .required("Link tra cứu là bắt buộc.")
                .matches(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!%\$&'\(\)\*\+,;=.]+$/,
                    "Link tra cứu không đúng định dạng."),
        }),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: (values) => {
            handelInsertOrUpdate(values)
        },
    });
    useEffect(() => {
        const fetchAPI = async () => {
            await _getBundleData();
        }
        fetchAPI();
    }, [])

    const _getBundleData = async () => {
        let bundle = {};
        let all = [_configModel.getPageConfig("SEARCHRESULTS").then((data) => (bundle = data))];
        await Promise.all(all).catch((err) =>
            window._$g.dialogs.alert(
                window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`)
            )
        );
        if (Object.keys(bundle).length > 0) {
            let value = {
                ...initValue,
                ...bundle
            }
            set_initialValues(value);
        }
        set_ready(true);
    }
    // hàm install or update
    const handelInsertOrUpdate = (values) => {
        let alerts = [];

        _configModel.updatePageConfig('SEARCHRESULTS', values).then(data => { // OK
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
                window.scrollTo(0, 0)
            });

    }
    if (!ready) {
        return <Loading />;
    }
    return (
        <div className="animated fadeIn">
            <Row className="d-flex justify-content-center">
                <Col xs={12}>
                    <Form id="formInfo" onSubmit={formik.handleSubmit}>
                        <Col xs={8} className="mx-auto">

                            <Col xs={12}>
                                <FormGroup row>
                                    <Label for="content_result" sm={4} >Nội dung <span className="font-weight-bold red-text">*</span></Label>
                                    <Col sm={8}>
                                        <Input value={formik.values.SEARCH_RESULTS_CONTENT.value} onChange={formik.handleChange}
                                            type="text" name="SEARCH_RESULTS_CONTENT.value" id="content_result" placeholder="Nội dung" />

                                        {formik.errors.SEARCH_RESULTS_CONTENT && formik.touched.SEARCH_RESULTS_CONTENT ? (
                                            <div
                                                className="field-validation-error alert alert-danger fade show"
                                                role="alert"
                                            >
                                                {formik.errors.SEARCH_RESULTS_CONTENT.value}
                                            </div>
                                        ) : null}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="link_result" sm={4} >Link <span className="font-weight-bold red-text">*</span></Label>
                                    <Col sm={8}>
                                        <Input value={formik.values.SEARCH_RESULTS_LINK.value} onChange={formik.handleChange}
                                            type="text" name="SEARCH_RESULTS_LINK.value" id="link_result" placeholder="Link" />
                                        {formik.errors.SEARCH_RESULTS_LINK && formik.touched.SEARCH_RESULTS_LINK ? (
                                            <div
                                                className="field-validation-error alert alert-danger fade show"
                                                role="alert"
                                            >
                                                {formik.errors.SEARCH_RESULTS_LINK.value}
                                            </div>
                                        ) : null}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="limit_result" sm={4}>Số lần tra cứu free chưa đăng nhập</Label>
                                    <Col sm={8}>
                                        <Input value={formik.values.SEARCH_RESULTS_LIMIT_NOT_LOGIN.value} onChange={formik.handleChange}
                                            type="number" name="SEARCH_RESULTS_LIMIT_NOT_LOGIN.value" id="limit_result" placeholder="Số lượt tra cứu" 
                                            min={0} max={999999}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="limit_result" sm={4}>Số lần tra cứu free đã đăng nhập</Label>
                                    <Col sm={8}>
                                        <Input value={formik.values.SEARCH_RESULTS_LIMIT_LOGIN.value} onChange={formik.handleChange}
                                            type="number" name="SEARCH_RESULTS_LIMIT_LOGIN.value" id="limit_result" placeholder="Số lượt tra cứu" 
                                            min={0} max={999999}/>
                                    </Col>
                                </FormGroup>
                            </Col>
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
                    </Form>
                </Col>
            </Row>
        </div>
    )



}
export default SearchResults;