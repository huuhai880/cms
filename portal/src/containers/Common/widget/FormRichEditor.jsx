import React from "react";
import { Row, Col, Label, FormGroup, Alert } from "reactstrap";
import { Editor } from "@tinymce/tinymce-react";
import { readFileAsBase64, readImageAsBase64 } from "@utils/html";
import { fnPost } from "@utils/api";
import { ErrorMessage } from "formik";

const FormRichEditor = ({
  name,
  label,
  formikProps,
  xs = 12,
  sm = 12,
  content,
  isEdit,
  isRequired = true,
  labelSm = 12,
  inputSm = 12,
  textColor= "text-primary"
}) => {
  const handleUploadImage = async (blobInfo, success, failure) => {
    readImageAsBase64(blobInfo.blob(), async (imageUrl) => {
      try {
        const imageUpload = await fnPost({
          url: "upload-file",
          body: {
            base64: imageUrl,
            folder: "files",
            includeCdn: true,
          },
        });
        success(imageUpload);
      } catch (error) {
        failure(error);
      }
    });
  };

  return (
    <Col xs={xs} sm={sm}>
      <FormGroup>
        <Row>
          {label && (
            <Label sm={labelSm}>
              <b className={`title_page_h1 ${textColor}`}>
                {label}
                {isRequired && (
                  <span className="font-weight-bold red-text">*</span>
                )}
              </b>
            </Label>
          )}
          <Col sm={inputSm}>
            <Editor
              apiKey={"3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku"}
              scriptLoading={{ delay: 500 }}
              value={content}
              disabled={!isEdit}
              init={{
                height: "300px",
                width: "100%",
                menubar: false,
                // plugins: [
                //   'lists link image paste help wordcount fullscreen',
                //   "image imagetools ",
                //  ],
                //  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | link | fullscreen',
                plugins: [
                  "advlist autolink fullscreen lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen ",
                  "insertdatetime media table paste code help wordcount",
                  "image imagetools ",
                ],
                menubar: "file edit view insert format tools table tc help",
                toolbar1:
                  "undo redo | fullscreen | formatselect | bold italic backcolor | \n" +
                  "alignleft aligncenter alignright alignjustify",
                toolbar2:
                  "bullist numlist outdent indent | removeformat | help | image",
                file_picker_types: "image",
                images_dataimg_filter: function (img) {
                  return img.hasAttribute("internal-blob");
                },
                images_upload_handler: handleUploadImage,
              }}
              onEditorChange={(newValue) => {
                formikProps.setFieldValue(name, newValue);
              }}
            />
            <ErrorMessage
              name={name}
              component={({ children }) => (
                <Alert color="danger" className="field-validation-error">
                  {children}
                </Alert>
              )}
            />
          </Col>
        </Row>
      </FormGroup>
    </Col>
  );
};

export default FormRichEditor;
