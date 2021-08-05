import {
  Row,
  Col,
  Input,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import React, { useEffect, useRef, useState } from "react";
// Util(s)
import { readFileAsBase64 } from "@utils/html";

import { Field, ErrorMessage } from "formik";
import "./listImageStyle.scss";

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export default function ListImage(props) {
  const {
    style,
    canEdit = true,
    values = [],
    onChange,
    name,
    title,
    isRequired = true,
    idName = "category_id",
  } = props;
  const [images, setImages] = useState(values);
  const inputUload = useRef();
  const [height, setHeight] = useState("auto");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showImages, setShowImages] = useState([]);
  const row = useRef();

  useEffect(() => {
    if (height === "auto") {
      setHeight(row.current.offsetHeight);
    }
  });

  const fnUpload = (field) => {
    const image = inputUload.current;
    readFileAsBase64(image, {
      validate: (file) => {
        if ("type" in file) {
          if (file.type.indexOf("image/") !== 0) {
            return "Chỉ được phép sử dụng tập tin ảnh.";
          }
        }
        if ("size" in file) {
          let maxSize = 4; /*4mb*/
          if (file.size / 1024 / 1024 > maxSize) {
            return `Dung lượng tập tin tối đa là: ${maxSize}mb.`;
          }
        }
      },
    })
      .then((imageBase64) => {
        const newImages = [
          ...images,
          ...imageBase64.map((e) => ({ [idName]: "", picture_url: e })),
        ];
        field.onChange({
          target: { type: "text", name, value: newImages },
        });
        setImages(newImages);
      })
      .catch((err) => {
        window._$g.dialogs.alert(window._$g._(err.message));
      });
  };

  const handleChangeDefaultPicture = (e, field) => {
    const filterImages = images.filter(
      (image) => image.picture_url !== e.picture_url
    );
    const newImages = [e, ...filterImages];
    field.onChange({
      target: { type: "text", name, value: newImages },
    });
    if (onChange) onChange(newImages);
    setImages(newImages);
  };

  const handleRemovePicture = (e, field) => {
    const newImages = images.filter(
      (image) => image.picture_url !== e.picture_url
    );
    field.onChange({
      target: { type: "text", name, value: newImages },
    });
    if (onChange) onChange(newImages);
    setImages(newImages);
  };

  const boxStyle = {
    maxHeight: "140%",
    minHeight: "140px",
    padding: "0px 15px",
  };

  const handleShowImage = () => {
    if (!isOpenModal) {
      setShowImages(
        images.map((e) => ({
          original: e.picture_url,
          thumbnail: e.picture_url,
        }))
      );
    }
    setIsOpenModal(!isOpenModal);
  };

  return (
    <div ref={row} style={style ? { ...boxStyle, ...style } : boxStyle}>
      <Row>
        <b className="title_page_h1 text-primary mt-2">
          {title}
          {isRequired && <span className="font-weight-bold red-text">*</span>}
        </b>
        <Field
          name={name}
          render={({ field }) => (
            <Col xs={12}>
              <Row>
                {images.length ? (
                  <Col xs={5} style={{ padding: "0px" }}>
                    <img
                      alt="image"
                      src={images[0].picture_url}
                      style={{
                        width: "100%",
                        maxWidth: "190px",
                        minHeight: boxStyle.minHeight,
                        maxHeight: "140px",
                      }}
                      onClick={() => handleShowImage()}
                    />
                  </Col>
                ) : (
                  ""
                )}

                <Col xs={7}>
                  <Row
                    style={{
                      height: height,
                      overflowY: "auto",
                      gap: "0px",
                      alignContent: "end",
                      padding: `0px ${images.length ? "12px" : "0px"}`,
                    }}
                  >
                    {canEdit ? (
                      <Col xs={4} className="list-image">
                        <div
                          onClick={() => {
                            inputUload.current.click();
                          }}
                          style={{
                            width: `${images.length ? "100%" : "190px"}`,
                            height: `${images.length ? "48px" : "138px"}`,
                            border: "1px dashed #aeaeae",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          className="file-upload"
                        >
                          <i className="fa fa-plus"></i>
                          <input
                            onInput={() => fnUpload(field)}
                            style={{ display: "none" }}
                            type="file"
                            multiple={true}
                            accept="image/*"
                            ref={inputUload}
                          />
                        </div>
                      </Col>
                    ) : (
                      ""
                    )}

                    {images.length
                      ? images.map(
                          (e, i) =>
                            i !== 0 && (
                              <Col
                                key={`imageList-${i}`}
                                xs={4}
                                className="list-image"
                              >
                                <div className="image-item">
                                  {canEdit && (
                                    <div className="image-item-action">
                                      <span
                                        className="mr-1 btn-remove-img"
                                        onClick={() =>
                                          handleRemovePicture(e, field)
                                        }
                                      >
                                        <i className="fa fa-minus-circle text-danger" />
                                      </span>
                                      <Input
                                        type="checkbox"
                                        checked={false}
                                        onChange={() =>
                                          handleChangeDefaultPicture(e, field)
                                        }
                                      />
                                    </div>
                                  )}
                                  <img
                                    alt="image"
                                    src={e.picture_url}
                                    style={{ width: "100%", height: "48px" }}
                                    onClick={() => handleShowImage()}
                                  />
                                </div>
                              </Col>
                            )
                        )
                      : ""}
                  </Row>
                </Col>
              </Row>
            </Col>
          )}
        />
        <ErrorMessage
          name={name}
          component={({ children }) => (
            <Alert color="danger" className="field-validation-error">
              {children}
            </Alert>
          )}
        />
      </Row>
      <Modal isOpen={isOpenModal} toggle={() => handleShowImage()} size="lg">
        <ModalBody>
          <div className="cmt-modal-close" onClick={() => handleShowImage()}>
            <i
              className="fa fa-times-circle fa-2x"
              style={{ color: "#FF9494" }}
            />
          </div>
          <ImageGallery
            items={showImages}
            showFullscreenButton={false}
            showPlayButton={false}
            showThumbnails={false}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}
