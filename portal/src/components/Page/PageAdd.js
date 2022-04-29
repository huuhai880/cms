import React from "react";
import * as Yup from "yup";
import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Button,
    Table,
    Modal,
    ModalBody,
    CustomInput,
    FormGroup,
    Label,
    Input,
    Form,
} from "reactstrap";
import { ActionButton } from "@widget";
import { readImageAsBase64 } from "../../utils/html";
import { Editor } from "@tinymce/tinymce-react";

import { useState } from "react";
import NumberFormat from "../Common/NumberFormat";
import { useEffect } from "react";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./const";
import MessageError from "../Product/MessageError";
import Loading from "../Common/Loading";
import "./style.scss";
import Upload from "../Common/Antd/Upload";
import PageService from "./Service/index";
import Select from "react-select";
import { convertValueSelect } from "utils/index";

const _pageService = new PageService();

function PageAdd({ pageId = null, noEdit = false }) {
    const [page, setPage] = useState(initialValues);
    const [alerts, setAlerts] = useState([]);
    const [buttonType, setButtonType] = useState(null);
    const [loading, setLoading] = useState(false);

    const [opPageType] = useState([
        { label: 'Page fill luận giải', value: 1 },
        { label: 'Page không fill luận giải', value: 2 },
    ])

    const customStyles = {
        menu: (provided, state) => ({
            ...provided,
            zIndex: 10,
        }),
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: page,
        validationSchema,
        validateOnBlur: false,
        validateOnChange: true,
        onSubmit: (values) => {
            handleSubmitPage(values);
        },
    });


    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        setLoading(true);
        try {
            if (pageId) {
                let page = await _pageService.read(pageId);
                let value = {
                    ...initialValues,
                    ...page,
                };
                setPage(value);
            }
        } catch (error) {
            window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
        } finally {
            setLoading(false);
        }
    };

    const handleOnKeyDown = (keyEvent) => {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    };


    const handleSubmitPage = async (values) => {
        try {
            let result = await _pageService.createOrUpdate(Object.assign(values, { page_id: pageId }));
            window._$g.toastr.show("Lưu thành công!", "success");
            if (buttonType == "save_n_close") {
                return window._$g.rdr("/page");
            }

            if (buttonType == "save" && !pageId) {
                formik.setFieldValue("background_url", null);
                formik.resetForm();
            }
        } catch (error) {
            let { errors, statusText, message } = error;
            let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");

            setAlerts([{ color: "danger", msg }]);
            window.scrollTo(0, 0);
        } finally {
            formik.setSubmitting(false);
        }
    }

    const handleSubmitForm = (type) => {
        setButtonType(type);
        formik.submitForm();
    };

    const handleUploadImage = async (blobInfo, success, failure) => {
        readImageAsBase64(blobInfo.blob(), async (imageUrl) => {
            try {
                const imageUpload = await _pageService.upload({
                    base64: imageUrl,
                    folder: "files",
                    includeCdn: true,
                });
                success(imageUpload);
            } catch (error) {
                failure(error);
            }
        });
    };


    return loading ? (
        <Loading />
    ) : (
        <div key={`view-${pageId || 0}`} className="animated fadeIn">
            <Row className="d-flex justify-content-center">
                <Col xs={12} md={12}>
                    <Card>
                        <CardHeader>
                            <b>
                                {pageId ? (noEdit ? "Chi tiết" : "Chỉnh sửa") : "Thêm mới"} Page{" "}
                                {/* {pageId ? (page.page_name ? page.page_name.replace(/<[^>]+>/g, "") : '') : ""} */}
                            </b>
                        </CardHeader>
                        <CardBody>
                            {alerts.map(({ color, msg }, idx) => {
                                return (
                                    <Alert
                                        key={`alert-${idx}`}
                                        color={color}
                                        isOpen={true}
                                        toggle={() => setAlerts([])}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: msg }} />
                                    </Alert>
                                );
                            })}

                            <Form id="frmProduct" onSubmit={formik.handleSubmit} onKeyDown={handleOnKeyDown}>
                                <Row>
                                    <Col xs={12} sm={12} md={9} lg={9}>
                                        <Row className="mb-4">
                                            <Col xs={12}>
                                                <b className="underline title_page_h1 text-primary">Thông tin Page</b>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                <FormGroup row>
                                                    <Label className="text-left" sm={3}>
                                                        Tên Page
                                                        <span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Input
                                                            name="page_name"
                                                            id="page_name"
                                                            type="text"
                                                            disabled={noEdit}
                                                            {...formik.getFieldProps("page_name")}
                                                            placeholder="Tên Page"
                                                        />
                                                        <MessageError formik={formik} name="page_name" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col sm={12}>
                                                <FormGroup row>
                                                    <Label className="col-sm-3 col-form-label">
                                                        Kiểu Page<span className="font-weight-bold red-text"> *</span>
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Select
                                                            className="MuiPaper-filter__custom--select"
                                                            id="pageType"
                                                            name="pageType"
                                                            onChange={(e) => {
                                                                let page_type = e ? e.value : null;
                                                                formik.setFieldValue('page_type', page_type)
                                                            }}
                                                            isSearchable={true}
                                                            placeholder={"-- Chọn --"}
                                                            value={convertValueSelect(formik.values['page_type'], opPageType)}
                                                            options={opPageType}
                                                            isClearable={true}
                                                            isDisabled={noEdit}
                                                            styles={customStyles}
                                                        />
                                                        <MessageError formik={formik} name="page_type" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col sm={12}>
                                                <FormGroup row>
                                                    <Label className="col-sm-3 col-form-label">
                                                        Mô tả
                                                    </Label>
                                                    <Col sm={9}>
                                                        <Editor
                                                            apiKey={"3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"}
                                                            scriptLoading={{
                                                                delay: 0,
                                                            }}
                                                            value={formik.values.short_description}
                                                            disabled={noEdit}
                                                            init={{
                                                                height: "350px",
                                                                width: "100%",
                                                                menubar: false,
                                                                branding: false,
                                                                entity_encoding: "raw",
                                                                statusbar: false,
                                                                plugins: [
                                                                  "advlist autolink fullscreen lists link image charmap print preview anchor",
                                                                  "searchreplace visualblocks code fullscreen ",
                                                                  "insertdatetime media table paste code help",
                                                                  "image imagetools ",
                                                                  "toc",
                                                                ],
                                                                menubar:
                                                                  "file edit view insert format tools table tc help",
                                                                toolbar1:
                                                                  "undo redo | fullscreen | formatselect | bold italic underline strikethrough forecolor backcolor |fontselect |  fontsizeselect| \n" +
                                                                  "alignleft aligncenter alignright alignjustify",
                                                                toolbar2:
                                                                  "bullist numlist outdent indent | removeformat | help | image | toc",
                                                                file_picker_types: "image",
                                                                relative_urls: false,
                                                                remove_script_host: false,
                                                                convert_urls: true,
                                                                images_dataimg_filter: function (img) {
                                                                    return img.hasAttribute("internal-blob");
                                                                },
                                                                images_upload_handler: handleUploadImage,
                                                            }}
                                                            onEditorChange={(newValue) => {
                                                                formik.setFieldValue("short_description", newValue);
                                                            }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                            <Col xs={12}>
                                                <FormGroup row>
                                                    <Label className="col-sm-3 col-form-label"></Label>
                                                    <Col sm={3} xs={12}>
                                                        <CustomInput
                                                            className="pull-left"
                                                            onBlur={null}
                                                            checked={formik.values.is_active}
                                                            type="checkbox"
                                                            id="is_active"
                                                            onChange={(e) => {
                                                                formik.setFieldValue("is_active", e.target.checked);
                                                            }}
                                                            label="Kích hoạt"
                                                            disabled={noEdit}
                                                        />
                                                    </Col>
                                                    <Col sm={3} xs={12}>
                                                        <CustomInput
                                                            className="pull-left"
                                                            onBlur={null}
                                                            checked={formik.values.is_show_header}
                                                            type="checkbox"
                                                            id="is_show_header"
                                                            onChange={(e) => {
                                                                formik.setFieldValue("is_show_header", e.target.checked);
                                                            }}
                                                            label="Hiện Header"
                                                            disabled={noEdit}
                                                        />
                                                    </Col>
                                                    <Col sm={3} xs={12}>
                                                        <CustomInput
                                                            className="pull-left"
                                                            onBlur={null}
                                                            checked={formik.values.is_show_footer}
                                                            type="checkbox"
                                                            id="is_show_footer"
                                                            onChange={(e) => {
                                                                formik.setFieldValue("is_show_footer", e.target.checked);
                                                            }}
                                                            label="Hiện Footer"
                                                            disabled={noEdit}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={12} sm={12} md={3} lg={3}>
                                        <Row className="mb-4">
                                            <Col xs={12}>
                                                <b className="underline title_page_h1 text-primary">Hình nền Page</b>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12}>
                                                <FormGroup row>
                                                    <Col sm={12}>
                                                        <div className="background-url-upload">
                                                            <Upload
                                                                onChange={(img) => formik.setFieldValue("background_url", img)}
                                                                imageUrl={formik.values.background_url}
                                                                accept="image/*"
                                                                disabled={noEdit}
                                                                id={pageId}
                                                                label="Thêm ảnh"
                                                            />
                                                        </div>
                                                        <Label style={{ paddingLeft: 10 }}>
                                                            {`Vui lòng upload ảnh < 4MB và có kích thước A4 210 x 297 mm`}
                                                        </Label>
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row className="mb15 mt15">
                                    <Col xs={12}>
                                        <b className="underline title_page_h1 text-primary">Nội dung Page</b>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} sm={12}>
                                        <Editor
                                            apiKey={"3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"}
                                            scriptLoading={{
                                                delay: 0,
                                            }}
                                            value={formik.values.description}
                                            disabled={noEdit}
                                            init={{
                                                height: "600px",
                                                width: "100%",
                                                menubar: false,
                                                branding: false,
                                                entity_encoding: "raw",
                                                statusbar: false,
                                                plugins: [
                                                  "advlist autolink fullscreen lists link image charmap print preview anchor",
                                                  "searchreplace visualblocks code fullscreen ",
                                                  "insertdatetime media table paste code help",
                                                  "image imagetools ",
                                                  "toc",
                                                ],
                                                menubar:
                                                  "file edit view insert format tools table tc help",
                                                toolbar1:
                                                  "undo redo | fullscreen | formatselect | bold italic underline strikethrough forecolor backcolor |fontselect |  fontsizeselect| \n" +
                                                  "alignleft aligncenter alignright alignjustify",
                                                toolbar2:
                                                  "bullist numlist outdent indent | removeformat | help | image | toc",
                                                file_picker_types: "image",
                                                relative_urls: false,
                                                remove_script_host: false,
                                                convert_urls: true,
                                                images_dataimg_filter: function (img) {
                                                    return img.hasAttribute("internal-blob");
                                                },
                                                images_upload_handler: handleUploadImage,
                                            }}
                                            onEditorChange={(newValue) => {
                                                formik.setFieldValue("description", newValue);
                                            }}
                                        />
                                        <MessageError formik={formik} name="description" />
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col xs={12} className="m-t-10 mb-2 mt-2">
                                        <FormGroup row>
                                            <Col sm={2} xs={12}>
                                                <CustomInput
                                                    className="pull-left"
                                                    onBlur={null}
                                                    checked={formik.values.is_active}
                                                    type="checkbox"
                                                    id="is_active"
                                                    onChange={(e) => {
                                                        formik.setFieldValue("is_active", e.target.checked);
                                                    }}
                                                    label="Kích hoạt"
                                                    disabled={noEdit}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row> */}
                                <Row className="mt-4">
                                    <Col xs={12} sm={12} style={{ padding: "0px" }}>
                                        <ActionButton
                                            isSubmitting={formik.isSubmitting}
                                            buttonList={[
                                                {
                                                    title: "Chỉnh sửa",
                                                    color: "primary",
                                                    isShow: noEdit,
                                                    icon: "edit",
                                                    permission: "MD_PAGE_EDIT",
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr(`/page/edit/${pageId}`),
                                                },
                                                {
                                                    title: "Lưu",
                                                    color: "primary",
                                                    isShow: !noEdit,
                                                    notSubmit: true,
                                                    permission: ["MD_PAGE_EDIT", "MD_PAGE_ADD"],
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save"),
                                                },
                                                {
                                                    title: "Lưu và đóng",
                                                    color: "success",
                                                    isShow: !noEdit,
                                                    permission: ["MD_PAGE_EDIT", "MD_PAGE_ADD"],
                                                    notSubmit: true,
                                                    icon: "save",
                                                    onClick: () => handleSubmitForm("save_n_close"),
                                                },
                                                {
                                                    title: "Đóng",
                                                    icon: "times-circle",
                                                    isShow: true,
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr("/page"),
                                                },
                                            ]}
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default PageAdd;