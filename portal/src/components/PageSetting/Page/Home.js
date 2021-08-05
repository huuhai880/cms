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
            authorImage: "",
            clearAuthorImage: false,
            publishingImage: "",
            clearPublishingImage: false,
            productImage: "",
            clearProductImage: false,
            sccImage: "",
            clearSCCImage: false,
            configEnt: null 
        };
    }

    componentDidMount() {
        (async () => {
            let {  authorImage= "", publishingImage= "", productImage= "", sccImage = "", configEnt} = this.state;
            let bundle = await this._getBundleData();
            if(bundle['HOME_AUTHOR_IMAGE']) authorImage = bundle["HOME_AUTHOR_IMAGE"] ? bundle["HOME_AUTHOR_IMAGE"].value : null ;
            if(bundle['HOME_PUBLISHING_IMAGE']) publishingImage = bundle["HOME_PUBLISHING_IMAGE"] ? bundle["HOME_PUBLISHING_IMAGE"].value : null;
            if(bundle['HOME_PRODUCT_IMAGE']) productImage = bundle["HOME_PRODUCT_IMAGE"] ? bundle["HOME_PRODUCT_IMAGE"].value : null ;
            if(bundle['HOME_SCC_IMAGE']) sccImage = bundle["HOME_SCC_IMAGE"] ? bundle["HOME_SCC_IMAGE"].value : null;
            if(bundle) configEnt = bundle;
            this.setState({ ...bundle, configEnt, ready: true , authorImage, publishingImage, productImage, sccImage});
        })();
    }

    formikValidationSchema = Yup.object().shape({
        HOME_SCC_TITLE: Yup.object().shape({
            value: Yup.string().required("Tiêu đề câu chuyện SCC là bắt buộc."),
        }),
        HOME_SCC_IMAGE:  Yup.object().shape({
            value:  Yup.string().required("Hình ảnh video câu chuyện SCC là bắt buộc."),
        }),
        HOME_SCC_VIDEO:  Yup.object().shape({
            value:  Yup.string().required("Link video câu chuyện SCC là bắt buộc."),
        }),
        HOME_SCC_DESCRIPTION:  Yup.object().shape({
            value: Yup.string().required("Mô tả ngắn gọn câu chuyện SCC là bắt buộc."),
        }),
        HOME_AUTHOR_TITLE:  Yup.object().shape({
            value: Yup.string().required("Tiêu đề góc độc giả là bắt buộc."),
        }),
        HOME_AUTHOR_IMAGE:  Yup.object().shape({
            value: Yup.string().required("Hình ảnh góc độc giả là bắt buộc."),
        }),
        HOME_AUTHOR_DESCRIPTION:  Yup.object().shape({
            value: Yup.string().required("Mô tả ngắn gọn góc độc giả là bắt buộc."),
        }),
        HOME_PUBLISHING_TITLE:  Yup.object().shape({
            value: Yup.string().required("Tiêu đề đơn vị xuất bản là bắt buộc."),
        }),
        HOME_PUBLISHING_IMAGE:  Yup.object().shape({
            value: Yup.string().required("Hình ảnh đơn vị xuất bản là bắt buộc."),
        }),
        HOME_PUBLISHING_DESCRIPTION:  Yup.object().shape({
            value: Yup.string().required("Mô tả ngắn gọn đơn vị xuất bản là bắt buộc."),
        }),
        HOME_PRODUCT_TITLE:  Yup.object().shape({
            value: Yup.string().required("Tiêu đề góc độc giả là bắt buộc."),
        }),
        HOME_PRODUCT_IMAGE:  Yup.object().shape({
            value: Yup.string().required("Hình ảnh góc độc giả là bắt buộc."),
        }),
        HOME_PRODUCT_DESCRIPTION:  Yup.object().shape({
            value: Yup.string().required("Mô tả ngắn gọn góc độc giả là bắt buộc."),
        }),
    });

    getInitialValues() {
        let values = Object.assign(
            {}, {
                HOME_SCC_TITLE: {
                    value: "CÂU CHUYỆN SCC",
                    data_type: 'string'
                },
                HOME_SCC_VIDEO: {
                    value: "https://www.youtube.com/watch?v=tcWmNwC7yyI",
                    data_type: 'string'
                },
                HOME_SCC_IMAGE: {
                    value: "",
                    data_type: 'image'
                },
                HOME_SCC_DESCRIPTION:{
                    value:  "Con người chúng ta đang lãng phí tri thức! Điều nhức nhối là người cần thì không có, người có thì lại “cất đi” chết mang theo”, vậy, bằng cách nào chúng ta giải quyết được vấn đề này? đó là câu dẫn lối chúng tôi đi tìm…",
                    data_type: 'string'
                },
                HOME_AUTHOR_TITLE: {
                    value: "GÓC TÁC GIẢ",
                    data_type: 'string'
                },
                HOME_AUTHOR_IMAGE: {
                    value: "",
                    data_type: 'image'
                },
                HOME_AUTHOR_DESCRIPTION: {
                    value:  "Bạn muốn Xuất bản một cuốn sách nhưng không có thời gian viết, khả năng viết của bạn không tốt và không hiểu biết về lĩnh vực Xuất bản. Vậy, chúng tôi sẽ giúp bạn Xuất bản một cuốn sách bằng cách nào ?",
                    data_type: 'string'
                },
                HOME_PUBLISHING_TITLE: {
                    value: "ĐƠN VỊ XUẤT BẢN",
                    data_type: 'string'
                },
                HOME_PUBLISHING_IMAGE: {
                    value: "",
                    data_type: 'image'
                },
                HOME_PUBLISHING_DESCRIPTION: {
                    value: "Bạn là Nhà Xuất bản hoặc đơn vị Liên kết Xuất bản thì việc nuôi một phòng Thiết kế sách là cả một vấn đề chi phí cũng như quản lý. Vậy, chúng tôi sẽ giúp bạn “giải phóng” phòng thiết kế bằng cách nào?",
                    data_type: 'string'
                },
                HOME_PRODUCT_TITLE: {
                    value:  "GÓC ĐỘC GIẢ",
                    data_type: 'string'
                },
                HOME_PRODUCT_IMAGE: {
                    value: "",
                    data_type: 'image'
                },
                HOME_PRODUCT_DESCRIPTION: {
                    value: "Bạn là Nhà Xuất bản hoặc đơn vị Liên kết Xuất bản thì việc nuôi một phòng Thiết kế sách là cả một vấn đề chi phí cũng như quản lý. Vậy, chúng tôi sẽ giúp bạn “giải phóng” phòng thiết kế bằng cách nào?",
                    data_type: 'string'
                }
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
            this._configModel.getPageConfig('HOME')
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
        let apiCall = this._configModel.updatePageConfig('HOME', values);
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
            productImage,
            clearProductImage,
            authorImage,
            clearAuthorImage,
            publishingImage,
            clearPublishingImage,
            sccImage,
            clearSCCImage
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
                                                        <b className="title_page_h1 text-primary underline">Câu chuyện SCC</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="HOME_SCC_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={sccImage}
                                                                clearImage={clearSCCImage}
                                                                isEdit={!noEdit}
                                                                name="HOME_SCC_IMAGE.value"
                                                                title="Ảnh thumbnail Video"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 1500x730 px '}
                                                            />
                                                            <YoutubePreview
                                                                title="Link Video"
                                                                canEdit={!noEdit}
                                                                name="HOME_SCC_VIDEO.value"
                                                                value={''}
                                                                useFormGroup={true}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                label
                                                                isBoldLabel={false}
                                                                textNote={'Định dạng link youtube: https://www.youtube.com/watch?v=xxxx (xxxx: là videoId)'}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="HOME_SCC_DESCRIPTION.value"
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
                                                        <b className="title_page_h1 text-primary underline">Góc tác giả</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="HOME_AUTHOR_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={authorImage}
                                                                clearImage={clearAuthorImage}
                                                                isEdit={!noEdit}
                                                                name="HOME_AUTHOR_IMAGE.value"
                                                                title="Ảnh banner"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 1500x1000 px '}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="HOME_AUTHOR_DESCRIPTION.value"
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
                                                        <b className="title_page_h1 text-primary underline">Đơn vị xuất bản</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="HOME_PUBLISHING_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={publishingImage}
                                                                clearImage={clearPublishingImage}
                                                                isEdit={!noEdit}
                                                                name="HOME_PUBLISHING_IMAGE.value"
                                                                title="Ảnh banner"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 1500x1000 px '}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="HOME_PUBLISHING_DESCRIPTION.value"
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
                                                        <b className="title_page_h1 text-primary underline">Góc độc giả</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="HOME_PRODUCT_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <UploadImage
                                                                urlImageEdit={productImage}
                                                                clearImage={clearProductImage}
                                                                isEdit={!noEdit}
                                                                name="HOME_PRODUCT_IMAGE.value"
                                                                title="Ảnh banner"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 1500x1000 px '}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="HOME_PRODUCT_DESCRIPTION.value"
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
