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
    YoutubePreview,
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
            seoAuthorImage: "",
            clearSeoAuthorImage: false,
            seoPublishingImage: "",
            clearSeoPublishingImage: false,
            seoServiceImage: "",
            clearSeoServiceImage: false,
            seoProductImage: "",
            clearSeoProductImage: false,
            seoNewsImage: "",
            clearSeoNewsImage: false,
            seoProjectImage: "",
            clearSeoProjectImage: false,
        };
    }

    componentDidMount() {
        (async () => {
            let { seoDefaultImage = "", seoAuthorImage = "", seoNewsImage = "", seoProductImage = "", seoProjectImage = "", seoPublishingImage = "", seoServiceImage = "", configEnt } = this.state;
            let bundle = await this._getBundleData();
            if (bundle['SEO_DEFAULT_IMAGE']) seoDefaultImage = bundle["SEO_DEFAULT_IMAGE"] ? bundle["SEO_DEFAULT_IMAGE"].value : null;
            if (bundle['SEO_AUTHOR_IMAGE']) seoAuthorImage = bundle["SEO_AUTHOR_IMAGE"] ? bundle["SEO_AUTHOR_IMAGE"].value : null;
            if (bundle['SEO_PUBLISHING_IMAGE']) seoPublishingImage = bundle["SEO_PUBLISHING_IMAGE"] ? bundle["SEO_PUBLISHING_IMAGE"].value : null;
            if (bundle['SEO_SERVICE_IMAGE']) seoServiceImage = bundle["SEO_SERVICE_IMAGE"] ? bundle["SEO_SERVICE_IMAGE"].value : null;
            if (bundle['SEO_PRODUCT_IMAGE']) seoProductImage = bundle["SEO_PRODUCT_IMAGE"] ? bundle["SEO_PRODUCT_IMAGE"].value : null;
            if (bundle['SEO_NEWS_IMAGE']) seoNewsImage = bundle["SEO_NEWS_IMAGE"] ? bundle["SEO_NEWS_IMAGE"].value : null;
            if (bundle['SEO_PROJECT_IMAGE']) seoProjectImage = bundle["SEO_PROJECT_IMAGE"] ? bundle["SEO_PROJECT_IMAGE"].value : null;

            if (bundle) configEnt = bundle;
            this.setState({ ...bundle, configEnt, ready: true, seoDefaultImage, seoAuthorImage, seoNewsImage, seoProductImage, seoProjectImage, seoPublishingImage, seoServiceImage });
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
        // TAC GIA
        // SEO_AUTHOR_TITLE: Yup.object().shape({
        //     value: Yup.string().required("Tiêu đề SEO góc tác giả là bắt buộc."),
        // }),
        // SEO_AUTHOR_URL: Yup.object().shape({
        //     value: Yup.string().required("Link SEO góc tác giả là bắt buộc."),
        // }),
        // SEO_AUTHOR_IMAGE: Yup.object().shape({
        //     value: Yup.string().required("Hình ảnh SEO góc tác giả là bắt buộc."),
        // }),
        // SEO_AUTHOR_DESCRIPTION: Yup.object().shape({
        //     value: Yup.string().required("Mô tả ngắn gọn SEO góc tác giả là bắt buộc."),
        // }),
        // SEO_AUTHOR_KEYWORDS: Yup.object().shape({
        //     value: Yup.string().required("Từ khóa SEO góc tác giả là bắt buộc."),
        // }),
        // // DON VI XUAT BẢN
        // SEO_PUBLISHING_TITLE: Yup.object().shape({
        //     value: Yup.string().required("Tiêu đề SEO đơn vị xuất bản là bắt buộc."),
        // }),
        // SEO_PUBLISHING_URL: Yup.object().shape({
        //     value: Yup.string().required("Link SEO đơn vị xuất bản là bắt buộc."),
        // }),
        // SEO_PUBLISHING_IMAGE: Yup.object().shape({
        //     value: Yup.string().required("Hình ảnh SEO đơn vị xuất bản là bắt buộc."),
        // }),
        // SEO_PUBLISHING_DESCRIPTION: Yup.object().shape({
        //     value: Yup.string().required("Mô tả ngắn gọn SEO đơn vị xuất bản là bắt buộc."),
        // }),
        // SEO_PUBLISHING_KEYWORDS: Yup.object().shape({
        //     value: Yup.string().required("Từ khóa SEO đơn vị xuất bản là bắt buộc."),
        // }),
        // // GOC DICH VU 
        // SEO_SERVICE_TITLE: Yup.object().shape({
        //     value: Yup.string().required("Tiêu đề SEO góc dịch vụ là bắt buộc."),
        // }),
        // SEO_SERVICE_URL: Yup.object().shape({
        //     value: Yup.string().required("Link SEO góc dịch vụ là bắt buộc."),
        // }),
        // SEO_SERVICE_IMAGE: Yup.object().shape({
        //     value: Yup.string().required("Hình ảnh SEO góc dịch vụ là bắt buộc."),
        // }),
        // SEO_SERVICE_DESCRIPTION: Yup.object().shape({
        //     value: Yup.string().required("Mô tả ngắn gọn SEO góc dịch vụ là bắt buộc."),
        // }),
        // SEO_SERVICE_KEYWORDS: Yup.object().shape({
        //     value: Yup.string().required("Từ khóa SEO góc dịch vụ là bắt buộc."),
        // }),
        // // GOC DOC GIA
        // SEO_PRODUCT_TITLE: Yup.object().shape({
        //     value: Yup.string().required("Tiêu đề SEO độc giả là bắt buộc."),
        // }),
        // SEO_PRODUCT_URL: Yup.object().shape({
        //     value: Yup.string().required("Link SEO độc giả là bắt buộc."),
        // }),
        // SEO_PRODUCT_IMAGE: Yup.object().shape({
        //     value: Yup.string().required("Hình ảnh SEO độc giả là bắt buộc."),
        // }),
        // SEO_PRODUCT_DESCRIPTION: Yup.object().shape({
        //     value: Yup.string().required("Mô tả ngắn gọn SEO độc giả là bắt buộc."),
        // }),
        // SEO_PRODUCT_KEYWORDS: Yup.object().shape({
        //     value: Yup.string().required("Từ khóa SEO độc giả là bắt buộc."),
        // }),
        // // GOC KIEN THUC 
        // SEO_NEWS_TITLE: Yup.object().shape({
        //     value: Yup.string().required("Tiêu đề SEO góc kiến thức là bắt buộc."),
        // }),
        // SEO_NEWS_URL: Yup.object().shape({
        //     value: Yup.string().required("Link SEO góc kiến thức là bắt buộc."),
        // }),
        // SEO_NEWS_IMAGE: Yup.object().shape({
        //     value: Yup.string().required("Hình ảnh SEO góc kiến thức là bắt buộc."),
        // }),
        // SEO_NEWS_DESCRIPTION: Yup.object().shape({
        //     value: Yup.string().required("Mô tả ngắn gọn SEO góc kiến thức là bắt buộc."),
        // }),
        // SEO_NEWS_KEYWORDS: Yup.object().shape({
        //     value: Yup.string().required("Từ khóa SEO góc kiến thức là bắt buộc."),
        // }),
        // // GOC DỰ ÁN
        // SEO_PROJECT_TITLE: Yup.object().shape({
        //     value: Yup.string().required("Tiêu đề SEO góc dự án là bắt buộc."),
        // }),
        // SEO_PROJECT_URL: Yup.object().shape({
        //     value: Yup.string().required("Link SEO góc dự án là bắt buộc."),
        // }),
        // SEO_PROJECT_IMAGE: Yup.object().shape({
        //     value: Yup.string().required("Hình ảnh SEO góc dự án là bắt buộc."),
        // }),
        // SEO_PROJECT_DESCRIPTION: Yup.object().shape({
        //     value: Yup.string().required("Mô tả ngắn gọn SEO góc dự án là bắt buộc."),
        // }),
        // SEO_PROJECT_KEYWORDS: Yup.object().shape({
        //     value: Yup.string().required("Từ khóa SEO góc dự án là bắt buộc."),
        // }),
    });

    getInitialValues() {
        let values = Object.assign(
            {}, {
            // SEO MẶC ĐỊNH
            SEO_DEFAULT_TITLE: {
                value: "SCC - Trung Tâm Tin Tức Di Động",
                data_type: 'string'
            },
            SEO_DEFAULT_KEYWORDS: {
                value: "SCC - Trung Tâm Tin Tức Di Động",
                data_type: 'string'
            },
            SEO_DEFAULT_FACEBOOK: {
                value: "",
                data_type: 'string'
            },
            SEO_DEFAULT_DESCRIPTION: {
                value: "SCC - Trung Tâm Tin Tức Di Động",
                data_type: 'string'
            },
            SEO_DEFAULT_URL: {
                value: "http://booknet.vn",
                data_type: 'string'
            },
            SEO_DEFAULT_IMAGE: {
                value: "",
                data_type: 'image'
            },
            // GOC TAC GIA 
            SEO_AUTHOR_TITLE: {
                value: "",
                data_type: 'string'
            },
            SEO_AUTHOR_KEYWORDS: {
                value: "",
                data_type: 'string'
            },
            SEO_AUTHOR_DESCRIPTION: {
                value: "",
                data_type: 'string'
            },
            SEO_AUTHOR_URL: {
                value: "http://booknet.vn/tac-gia",
                data_type: 'string'
            },
            SEO_AUTHOR_IMAGE: {
                value: "",
                data_type: 'image'
            },
            // DON VI XUAT BAN
            SEO_PUBLISHING_TITLE: {
                value: "",
                data_type: 'string'
            },
            SEO_PUBLISHING_KEYWORDS: {
                value: "",
                data_type: 'string'
            },
            SEO_PUBLISHING_DESCRIPTION: {
                value: "",
                data_type: 'string'
            },
            SEO_PUBLISHING_URL: {
                value: "http://booknet.vn/nha-xuat-ban",
                data_type: 'string'
            },
            SEO_PUBLISHING_IMAGE: {
                value: "",
                data_type: 'image'
            },
            // GOC DICH VU
            SEO_SERVICE_TITLE: {
                value: "",
                data_type: 'string'
            },
            SEO_SERVICE_KEYWORDS: {
                value: "",
                data_type: 'string'
            },
            SEO_SERVICE_DESCRIPTION: {
                value: "",
                data_type: 'string'
            },
            SEO_SERVICE_URL: {
                value: "http://booknet.vn/dich-vu",
                data_type: 'string'
            },
            SEO_SERVICE_IMAGE: {
                value: "",
                data_type: 'image'
            },
            // GOC DOC GIA
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
                value: "http://booknet.vn/goc-doc-gia",
                data_type: 'string'
            },
            SEO_PRODUCT_IMAGE: {
                value: "",
                data_type: 'image'
            },
            // GOC KIEN THUC
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
                value: "http://booknet.vn/kien-thuc",
                data_type: 'string'
            },
            SEO_NEWS_IMAGE: {
                value: "",
                data_type: 'image'
            },
            // GOC DU AN 
            SEO_PROJECT_TITLE: {
                value: "",
                data_type: 'string'
            },
            SEO_PROJECT_KEYWORDS: {
                value: "",
                data_type: 'string'
            },
            SEO_PROJECT_DESCRIPTION: {
                value: "",
                data_type: 'string'
            },
            SEO_PROJECT_URL: {
                value: "http://booknet.vn/du-an",
                data_type: 'string'
            },
            SEO_PROJECT_IMAGE: {
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
            seoAuthorImage,
            clearSeoAuthorImage,
            seoProjectImage,
            clearSeoProjectImage,
            seoProductImage,
            clearSeoProductImage,
            seoNewsImage,
            clearSeoNewsImage,
            seoServiceImage,
            clearSeoServiceImage,
            seoPublishingImage,
            clearSeoPublishingImage,
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
                                                        <b>Lưu ý:</b> SEO mặc định sẽ được áp dụng trên trang <b><i>Trang chủ</i></b>,<b><i>Liên hệ</i></b>, <b><i>Giới thiệu</i></b> và các trang chưa cài đặt SEO. Đối với một số trang kiến thức, tác giả và góc độc giả sẽ lấy các cài đặt SEO từ dữ liệu .
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
                                                        <b className="title_page_h1 text-primary underline">SEO góc tác giả</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_AUTHOR_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_AUTHOR_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_AUTHOR_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_AUTHOR_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoAuthorImage}
                                                                clearImage={clearSeoAuthorImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_AUTHOR_IMAGE.value"
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
                                                        <b className="title_page_h1 text-primary underline">SEO đơn vị xuất bản</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_PUBLISHING_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_PUBLISHING_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_PUBLISHING_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_PUBLISHING_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoPublishingImage}
                                                                clearImage={clearSeoPublishingImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_PUBLISHING_IMAGE.value"
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
                                                        <b className="title_page_h1 text-primary underline">SEO góc dịch vụ</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_SERVICE_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_SERVICE_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_SERVICE_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_SERVICE_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoServiceImage}
                                                                clearImage={clearSeoServiceImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_SERVICE_IMAGE.value"
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
                                                        <b className="title_page_h1 text-primary underline">SEO góc độc giả</b>
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
                                                                urlImageEdit={seoProductImage}
                                                                clearImage={clearSeoProductImage}
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
                                                        <b className="title_page_h1 text-primary underline">SEO kiến thức</b>
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
                                                                urlImageEdit={seoNewsImage}
                                                                clearImage={clearSeoNewsImage}
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
                                                        <b className="title_page_h1 text-primary underline">SEO góc dự án</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="SEO_PROJECT_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Từ khóa"
                                                                name="SEO_PROJECT_KEYWORDS.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Link SEO"
                                                                name="SEO_PROJECT_URL.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                                isRequired={false}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="SEO_PROJECT_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                                isRequired={false}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={seoProjectImage}
                                                                clearImage={clearSeoProjectImage}
                                                                isEdit={!noEdit}
                                                                name="SEO_PROJECT_IMAGE.value"
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
