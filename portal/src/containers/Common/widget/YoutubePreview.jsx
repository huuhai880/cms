import React, { useState } from "react";
import { Alert, Col, Input, Label, FormGroup } from "reactstrap";
import { Field, ErrorMessage } from "formik";
import { useEffect } from "react";
const YoutubePreview = ({
  title,
  isEdit = true,
  isRequired = true,
  name,
  type = "text",
  placeholder,
  useFormGroup = false,
  label,
  xs = 12,
  sm = 12,
  labelSm = 4,
  inputSm = 8,
  labelClassName = "",
  isBoldLabel = true,
  textColor="text-primary",
  textNote=""
}) => {
  const [videoId, setVideoId] = useState("");

  // useEffect(() => {
  //   setVideoId()
  // }, [videoId])

  const onBlurName = (event, field) => {
    if (event.target.value) {
      const url = new URLSearchParams(event.target.value);
      const videoId = url.get("https://www.youtube.com/watch?v");
      setVideoId(videoId);
    }
    field.onChange({
      target: { type: "text", name, value: event.target.value },
    });
  };

  const renderiFrameYoutube = (videoId) => {
    return (
      <div className="mt-2">
        <iframe
          width="100%"
          key={videoId}
          height="215"
          frameBorder="0"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    )
  }

  const renderField = (isEdit, placeholder, type) => {
    return <>
      <Field
          name={name}
          render={({ field }) => {
            if (field.value) {
              const url = new URLSearchParams(field.value);
              const videoId = url.get("https://www.youtube.com/watch?v");
              setVideoId(videoId);
            }
            return (
              <Input
                className="mt-2"
                {...field}
                value={field.value || ""}
                onBlur={(event) => onBlurName(event, field)}
                type={type}
                placeholder={placeholder}
                disabled={!isEdit}
              />
            );
          }}
        />
        {
          textNote && <small><b>{textNote}</b></small>
        }
        <ErrorMessage
          name={name}
          component={({ children }) => (
            <Alert color="danger" className="field-validation-error">
              {children}
            </Alert>
          )}
        />
      </>
  }

  const renderTitle = title => title && (
    isBoldLabel ?<b className={`title_page_h1 ${textColor}`}>
    {title}
    {isRequired && <span className="font-weight-bold red-text">*</span>}
  </b> : <>
    {title}
    {isRequired && <span className="font-weight-bold red-text">*</span>}
  </>
  )


  return (
    !useFormGroup ? <>
      <div>
        { renderTitle(title) }
        { renderField(isEdit, placeholder, type) }
      </div>
      { renderiFrameYoutube(videoId) }
    </> : 
    <Col xs={xs} sm={sm}>
    <FormGroup row>
      {label && (
        <Label for={name} sm={labelSm} className={labelClassName}>
          { renderTitle(title) }
        </Label>
      )}
      <Col sm={label ? inputSm : sm}>
        { renderField(isEdit, placeholder, type) }
        { renderiFrameYoutube(videoId) }
      </Col>
    </FormGroup>
  </Col>
  );
};

export default YoutubePreview;
