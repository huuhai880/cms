import React, { useState } from "react";
import { Row, Col, FormGroup, Alert, Label } from "reactstrap";
import { Field, ErrorMessage } from "formik";
import { DropzoneArea } from "material-ui-dropzone";

const UploadImage = ({
  name,
  title,
  clearImage,
  isEdit,
  urlImageEdit = "",
  isRequired = true,
  isTitleCenter,
  isHorizontal = false,
  textColor = 'text-primary',
  labelSm = 4,
  inputSm = 12,
  isBoldLabel = true,
  dropzoneText
}) => {
  const [image, setImage] = useState(urlImageEdit);

  const onDropImage = (files, field) => {
    const reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = (event) => {
      field.onChange({
        target: { type: "text", name, value: event.target.result },
      });
      setImage(event.target.result);
    };
  };

  return (
    <Col xs={12} sm={12} style={{ padding: !isHorizontal ? "0px" : 'auto'  }}>
      <FormGroup row={isHorizontal}>
        <Label
          style={{ padding: !isHorizontal ? "0px" : 'auto' }}
          for={name}
          className={!isHorizontal ? (isTitleCenter ? "col-12 text-center" : "col-12") : `col-sm-${labelSm}`}
        >
          { isBoldLabel ? 
          <b className={`title_page_h1 ${textColor} mt-2`}>
            {title}
            {isRequired && <span className="font-weight-bold red-text">*</span>}
          </b> : 
            <>
              {title}
              {isRequired && <span className="font-weight-bold red-text">*</span>}
            </>
          }

        </Label>
        {!clearImage && (
          <Col sm={inputSm}>
          <Field
            name={name}
            render={({ field }) => {
              // render image edit
              if (image) {
                return (
                  <div className="tl-render-image">
                    <img
                      src={image}
                      alt="images"
                      style={{ maxHeight: "220px" }}
                    />
                    {isEdit ? (
                      <button onClick={() => setImage("")}>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    ) : null}
                  </div>
                );
              }

              return (
                <div className="tl-drop-image">
                  <DropzoneArea
                    {...field}
                    acceptedFiles={[".jpg", ".png", ".jpeg"]}
                    filesLimit={1}
                    dropzoneText={""}
                    disabled={!isEdit}
                    onDrop={(files) => onDropImage(files, field)}
                    onDelete={() =>
                      field.onChange({
                        target: {
                          type: "text",
                          name,
                          value: "",
                        },
                      })
                    }
                  />
                 
                </div>
              );
            }}
          />
           {
                    dropzoneText && <small><b>{dropzoneText}</b></small>
                  }
          <ErrorMessage
          name={name}
          component={({ children }) => (
            <Alert color="danger" className="field-validation-error">
              {children}
            </Alert>
          )}
        />
          </Col>
        )}

        
      </FormGroup>
    </Col>
  );
};

export default UploadImage;
