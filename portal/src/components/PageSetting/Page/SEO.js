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

// Component(s)
import Loading from '../../Common/Loading';
// Model(s)
import ConfigModel from '../../../models/ConfigModel';

/**
 * @class SEO
 */
export default class SEO extends PureComponent {

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
            seoDefaultImage: "",
            clearSeoDefaultImage: false,

            //Home
            seoPageHomeImage: "",
            clearSeoPageHomeImage: false,
            //Tra cuu
            seoPageSearchImage: "",
            clearSeoPageSearchImage: false,
            //Kien thuc
            seoPageNewsImage: "",
            clearSeoPageNewsImage: false,
            //Ve chung toi
            seoPageAboutImage: "",
            clearSeoPageAboutImage: false,
            //San pham
            seoPageProductImage: "",
            clearSeoPageProductImage: false,
            //Dang nhap
            seoPageLoginImage: "",
            clearSeoPageLoginImage: false,
            //Dang ky
            seoPageRegisterImage: "",
            clearSeoPageRegisterImage: false,
        };
    }

    componentDidMount() {
        (async () => {
            let { 
                    seoDefaultImage = "", 
                    configEnt,
                    seoPageHomeImage,
                    seoPageSearchImage,
                    seoPageNewsImage,
                    seoPageAboutImage,
                    seoPageProductImage,
                    seoPageLoginImage,
                    seoPageRegisterImage
                } = this.state;
            let bundle = await this._getBundleData();
            if (bundle['SEO_DEFAULT_IMAGE']) seoDefaultImage = bundle["SEO_DEFAULT_IMAGE"] ? bundle["SEO_DEFAULT_IMAGE"].value : null;
            if (bundle['SEO_HOME_IMAGE']) seoPageHomeImage = bundle["SEO_HOME_IMAGE"] ? bundle["SEO_HOME_IMAGE"].value : null;
            if (bundle['SEO_SEARCH_IMAGE']) seoPageSearchImage = bundle["SEO_SEARCH_IMAGE"] ? bundle["SEO_SEARCH_IMAGE"].value : null;
            if (bundle['SEO_NEWS_IMAGE']) seoPageNewsImage = bundle["SEO_NEWS_IMAGE"] ? bundle["SEO_NEWS_IMAGE"].value : null;
            if (bundle['SEO_ABOUT_IMAGE']) seoPageAboutImage = bundle["SEO_ABOUT_IMAGE"] ? bundle["SEO_ABOUT_IMAGE"].value : null;
            if (bundle['SEO_PRODUCT_IMAGE']) seoPageProductImage = bundle["SEO_PRODUCT_IMAGE"] ? bundle["SEO_PRODUCT_IMAGE"].value : null;
            if (bundle['SEO_LOGIN_IMAGE']) seoPageLoginImage = bundle["SEO_LOGIN_IMAGE"] ? bundle["SEO_LOGIN_IMAGE"].value : null;
            if (bundle['SEO_REGISTER_IMAGE']) seoPageRegisterImage = bundle["SEO_REGISTER_IMAGE"] ? bundle["SEO_REGISTER_IMAGE"].value : null;

            
            if (bundle) configEnt = bundle;
            this.setState({ ...bundle, configEnt, ready: true, seoDefaultImage });
        })();
    }

    formikValidationSchema = Yup.object().shape({
        // DEFAULT
        SEO_DEFAULT_TITLE: Yup.object().shape({
            value: Yup.string().required("Tiêu đề SEO mặc định là bắt buộc."),
        }),
        SEO_DEFAULT_URL: Yup.object().shape({
            value: Yup.string().required("Link SEO mặc định là bắt buộc."),
        }),
        SEO_DEFAULT_IMAGE: Yup.object().shape({
            value: Yup.string().required("Hình ảnh SEO mặc định là bắt buộc."),
        }),
        SEO_DEFAULT_DESCRIPTION: Yup.object().shape({
            value: Yup.string().required("Mô tả ngắn gọn SEO mặc định là bắt buộc."),
        }),
        SEO_DEFAULT_KEYWORDS: Yup.object().shape({
            value: Yup.string().required("Từ khóa SEO mặc định là bắt buộc."),
        }),
    });

    getInitialValues() {
        let values = Object.assign(
            {},
            {
                // SEO MẶC ĐỊNH
                SEO_DEFAULT_TITLE: {
                    value: "",
                    data_type: 'string'
                },
                SEO_DEFAULT_KEYWORDS: {
                    value: "",
                    data_type: 'string'
                },
                SEO_DEFAULT_FACEBOOK: {
                    value: "",
                    data_type: 'string'
                },
                SEO_DEFAULT_DESCRIPTION: {
                    value: "",
                    data_type: 'string'
                },
                SEO_DEFAULT_URL: {
                    value: "",
                    data_type: 'string'
                },
                SEO_DEFAULT_IMAGE: {
                    value: "",
                    data_type: 'image'
                },

                //SEO TRANG CHU
                SEO_HOME_TITLE: {
                    value: "",
                    data_type: 'string'
                },
                SEO_HOME_KEYWORDS: {
                    value: "",
                    data_type: 'string'
                },
                SEO_HOME_DESCRIPTION: {
                    value: "",
                    data_type: 'string'
                },
                SEO_HOME_URL: {
                    value: "",
                    data_type: 'string'
                },
                SEO_HOME_IMAGE: {
                    value: "",
                    data_type: 'image'
                },

                //SEO TRA CUU
                SEO_SEARCH_TITLE: {
                    value: "",
                    data_type: 'string'
                },
                SEO_SEARCH_KEYWORDS: {
                    value: "",
                    data_type: 'string'
                },
                SEO_SEARCH_DESCRIPTION: {
                    value: "",
                    data_type: 'string'
                },
                SEO_SEARCH_URL: {
                    value: "",
                    data_type: 'string'
                },
                SEO_SEARCH_IMAGE: {
                    value: "",
                    data_type: 'image'
                },

                //SEO KIEN THUC
                SEO_NEWS_TITLE: {
                    value: "",
                    data_type: 'string'
                },
                SEO_NEWS_KEYWORDS: {
                    value: "",
                    data_type: 'string'
                },
                SEO_NEWS_DESCRIPTION: {
                    value: "",
                    data_type: 'string'
                },
                SEO_NEWS_URL: {
                    value: "",
                    data_type: 'string'
                },
                SEO_NEWS_IMAGE: {
                    value: "",
                    data_type: 'image'
                },

                //SEO VE CHUNG TOI
                SEO_ABOUT_TITLE: {
                    value: "",
                    data_type: 'string'
                },
                SEO_ABOUT_KEYWORDS: {
                    value: "",
                    data_type: 'string'
                },
                SEO_ABOUT_DESCRIPTION: {
                    value: "",
                    data_type: 'string'
                },
                SEO_ABOUT_URL: {
                    value: "",
                    data_type: 'string'
                },
                SEO_ABOUT_IMAGE: {
                    value: "",
                    data_type: 'image'
                },

                //SEO SAN PHAM
                SEO_PRODUCT_TITLE: {
                    value: "",
                    data_type: 'string'
                },
                SEO_PRODUCT_KEYWORDS: {
                    value: "",
                    data_type: 'string'
                },
                SEO_PRODUCT_DESCRIPTION: {
                    value: "",
                    data_type: 'string'
                },
                SEO_PRODUCT_URL: {
                    value: "",
                    data_type: 'string'
                },
                SEO_PRODUCT_IMAGE: {
                    value: "",
                    data_type: 'image'
                },

                //SEO DANG NHAP
                SEO_LOGIN_TITLE: {
                    value: "",
                    data_type: 'string'
                },
                SEO_LOGIN_KEYWORDS: {
                    value: "",
                    data_type: 'string'
                },
                SEO_LOGIN_DESCRIPTION: {
                    value: "",
                    data_type: 'string'
                },
                SEO_LOGIN_URL: {
                    value: "",
                    data_type: 'string'
                },
                SEO_LOGIN_IMAGE: {
                    value: "",
                    data_type: 'image'
                },
    
                //SEO DANG KY
                SEO_REGISTER_TITLE: {
                    value: "",
                    data_type: 'string'
                },
                SEO_REGISTER_KEYWORDS: {
                    value: "",
                    data_type: 'string'
                },
                SEO_REGISTER_DESCRIPTION: {
                    value: "",
                    data_type: 'string'
                },
                SEO_REGISTER_URL: {
                    value: "",
                    data_type: 'string'
                },
                SEO_REGISTER_IMAGE: {
                    value: "",
                    data_type: 'image'
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
            this._configModel.getPageConfig('SEO')
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
        let apiCall = this._configModel.updatePageConfig('SEO', values);
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
            seoDefaultImage,
            clearSeoDefaultImage,
            seoPageHomeImage,
            clearSeoPageHomeImage,
            seoPageSearchImage,
            clearSeoPageSearchImage,
            seoPageNewsImage,
            clearSeoPageNewsImage,
            seoPageAboutImage,
            clearSeoPageAboutImage,
            seoPageProductImage,
            clearSeoPageProductImage,
            seoPageLoginImage,
            clearSeoPageLoginImage,
            seoPageRegisterImage,
            clearSeoPageRegisterImage
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
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">SEO mặc định</b>
                                                    </Col>
                                                    <Col xs={8} className="mx-auto">
                                                        <b>Lưu ý:</b> SEO mặc định sẽ được áp dụng trên trang <b><i>Trang chủ</i></b>,<b><i>Liên hệ</i></b>, <b><i>Giới thiệu</i></b> và các trang chưa cài đặt SEO. Đối với một số trang kiến thức lấy các cài đặt SEO từ dữ liệu .
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_DEFAULT_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_DEFAULT_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_DEFAULT_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Facebook AppId"
                                                                name="SEO_DEFAULT_FACEBOOK.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_DEFAULT_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoDefaultImage}
                                                                clearImage={clearSeoDefaultImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_DEFAULT_IMAGE.value"
                                                                title="Ảnh SEO"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 280x280 px '}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">SEO Trang chủ</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_HOME_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_HOME_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_HOME_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_HOME_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoPageHomeImage}
                                                                clearImage={clearSeoPageHomeImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_HOME_IMAGE.value"
                                                                title="Ảnh SEO"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 280x280 px '}
                                                                isRequired={false}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">SEO Tra cứu</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_SEARCH_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_SEARCH_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_SEARCH_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_SEARCH_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoPageSearchImage}
                                                                clearImage={clearSeoPageSearchImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_SEARCH_IMAGE.value"
                                                                title="Ảnh SEO"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 280x280 px '}
                                                                isRequired={false}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">SEO Kiến thức</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_NEWS_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_NEWS_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_NEWS_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_NEWS_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoPageNewsImage}
                                                                clearImage={clearSeoPageNewsImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_NEWS_IMAGE.value"
                                                                title="Ảnh SEO"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 280x280 px '}
                                                                isRequired={false}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">SEO Về chúng tôi</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_ABOUT_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_ABOUT_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_ABOUT_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_ABOUT_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoPageAboutImage}
                                                                clearImage={clearSeoPageAboutImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_ABOUT_IMAGE.value"
                                                                title="Ảnh SEO"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 280x280 px '}
                                                                isRequired={false}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">SEO Sản phẩm</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_PRODUCT_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_PRODUCT_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_PRODUCT_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_PRODUCT_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoPageProductImage}
                                                                clearImage={clearSeoPageProductImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_PRODUCT_IMAGE.value"
                                                                title="Ảnh SEO"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 280x280 px '}
                                                                isRequired={false}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">SEO Đăng nhập</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_LOGIN_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_LOGIN_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_LOGIN_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_LOGIN_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoPageLoginImage}
                                                                clearImage={clearSeoPageLoginImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_LOGIN_IMAGE.value"
                                                                title="Ảnh SEO"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 280x280 px '}
                                                                isRequired={false}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">SEO Đăng ký</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_REGISTER_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_REGISTER_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_REGISTER_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_REGISTER_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoPageRegisterImage}
                                                                clearImage={clearSeoPageRegisterImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_REGISTER_IMAGE.value"
                                                                title="Ảnh SEO"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 280x280 px '}
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
