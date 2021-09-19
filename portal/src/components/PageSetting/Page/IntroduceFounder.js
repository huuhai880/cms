import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Col, Row, Button, Modal, ModalHeader, ModalBody, FormGroup } from "reactstrap";
import { FormInput, YoutubePreview, UploadImage } from "@widget";
import '../styles.scss'

export default class IntroduceFounder extends React.Component {
    formikProps = null;

    constructor(props) {
        super(props);

        this.handleFormikSubmit = this.handleFormikSubmit.bind(this);

        this.state = {
            isOpenModal: true,
            imageUrl: null,
            clearImage: false,
        };
    }

    formikValidationSchema = Yup.object().shape({
        // title: Yup.string().required("Tiêu đề là bắt buộc."),
        image: Yup.string().required("Hình ảnh/Icon là bắt buộc."),
        description: Yup.string().required("Mô tả ngắn là bắt buộc."),
    });

    componentDidMount() {
        if (this.props.item) {
            this.setState({
                imageUrl: this.props.item.image,
            });
        }
    }

    getInitialValues() {
        let values = Object.assign(
            {},
            {
                // title: "",
                image: "",
                description: "",
            }
        );
        if (this.props.item) {
            values = Object.assign(values, this.props.item);
        }
        Object.keys(values).forEach((key) => {
            if (null === values[key]) {
                values[key] = "";
            }
        });
        return values;
    }

    handleSubmit() {
        let { submitForm } = this.formikProps;
        return submitForm();
    }

    handleFormikSubmit(values, formProps) {
        const { handleCreateOrUpdateItem } = this.props;
        handleCreateOrUpdateItem(values, this.props.index);
        this.setState({ isOpenModal: false });
    }

    handleToggle = () => {
        this.setState({ isOpenModal: !this.state.isOpenModal }, () =>
            this.props.handleCloseIntroduceFounder()
        );
    };

    render() {
        const { isOpenModal, imageUrl, clearImage } = this.state;
        const { item, noEdit } = this.props;
        let initialValues = this.getInitialValues();
        return (
            <Modal
                isOpen={isOpenModal}
                toggle={() => this.handleToggle()}
                size="lg"
                centered
                scrollable={false}
            >
                <ModalHeader toggle={() => this.handleToggle()}>
                    {item ? "Chỉnh sửa" : "Thêm mới"}
                </ModalHeader>
                <ModalBody>
                    <Row className="d-flex justify-content-center">
                        <Col xs={12}>
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
                                                        <Col xs={12} className="mx-auto">
                                                            <Row>
                                                                {/* <FormInput
                                                                    label="Tiêu đề"
                                                                    name="title"
                                                                    labelSm={3}
                                                                    inputSm={9}
                                                                    isEdit={!noEdit}
                                                                /> */}
                                                                <UploadImage
                                                                    urlImageEdit={imageUrl}
                                                                    clearImage={clearImage}
                                                                    isEdit={!noEdit}
                                                                    name="image"
                                                                    title="Hình ảnh/Icon"
                                                                    isHorizontal={true}
                                                                    textColor=""
                                                                    labelSm={3}
                                                                    inputSm={4}
                                                                    isBoldLabel={false}
                                                                    dropzoneText={
                                                                        "Ưu tiên ảnh có kích thước 69x73 px "
                                                                    }
                                                                    styleDropImg={{minHeight: 150, height: 150}}
                                                                    dropzoneClass="dropzone-descryption"
                                                                />
                                                                <FormInput
                                                                    label="Mô tả ngắn"
                                                                    type="textarea"
                                                                    name="description"
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
                                                        <Col xs={12} className="mx-auto">
                                                            <FormGroup row>
                                                                <Col sm={12} className="text-right">
                                                                    <Button
                                                                        key="buttonSave"
                                                                        type="submit"
                                                                        color="primary"
                                                                        disabled={isSubmitting}
                                                                        onClick={() =>
                                                                            this.handleSubmit(
                                                                                "save"
                                                                            )
                                                                        }
                                                                        className="mr-2 btn-block-sm"
                                                                    >
                                                                        <i className="fa fa-save mr-2" />
                                                                        Lưu
                                                                    </Button>
                                                                    <Button
                                                                        disabled={isSubmitting}
                                                                        onClick={() =>
                                                                            this.handleToggle()
                                                                        }
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
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        );
    }
}
