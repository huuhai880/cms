import QRCode from "react-qr-code";
import React, { useState, useRef, useEffect } from "react";
import { Col, Modal } from "reactstrap";
import ReactToPrint from "react-to-print";
import ReactToPdf from "react-to-pdf";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  backdrop: {
    backgroundColor: "transparent",
    alignItems: "center",
    border: "none",
  },
}));

const GenQR = ({ sm = 12, xs = 12, value, click, toPdf = false }) => {
  const [open, setOpen] = useState(false);
  const qrRef = useRef(null);
  const btnRef = useRef(null);
  const showPng = useRef(null);
  const classes = useStyles();
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (click) {
      // click(btnRef.current);
      click(showPng.current);
    }
  });

  function openBase64InNewTab(data, mimeType) {
    var byteCharacters = atob(data.substr(`data:${mimeType};base64,`.length));
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], { type: mimeType + ";base64" });
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }

  const handleShowQrPng = () => {
    const svgElement = qrRef.current.querySelector("svg");
    let { width, height } = svgElement.getBBox();
    let clonedSvgElement = svgElement.cloneNode(true);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var xml = new XMLSerializer().serializeToString(svgElement);
    var svg64 = btoa(xml);
    var b64Start = "data:image/svg+xml;base64,";

    var image64 = b64Start + svg64;
    const img = document.createElement("img");

    img.onload = function () {
      canvas.getContext("2d").drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL();
      openBase64InNewTab(dataUrl, "image/png");
    };
    img.src = image64;

    // const imgData = canvas.toDataURL("image/png");
    // let outerHTML = imgData.outerHTML,
    //   blob = new Blob([outerHTML], { type: "image/svg+xml;charset=utf-8" });
    // let URL = window.URL || window.webkitURL || window;
    // let blobURL = URL.createObjectURL(blob);
    // window.open(blobURL, "_blank");
  };

  return (
    <Col xs={xs} sm={sm}>
      <div style={{ display: "inline-block", cursor: "pointer" }}>
        {toPdf && (
          <ReactToPdf targetRef={qrRef} filename="qr.pdf">
            {({ toPdf, targetRef }) => (
              <button onClick={toPdf} ref={btnRef} style={{ display: "none" }}>
                Generate pdf
              </button>
            )}
          </ReactToPdf>
        )}
        <button
          ref={showPng}
          onClick={handleShowQrPng}
          style={{ display: "none" }}
        >
          click
        </button>
        <div ref={qrRef}>
          <QRCode
            size={54}
            value={value}
            onClick={handleToggle}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <Modal
        isOpen={open}
        toggle={handleToggle}
        contentClassName={classes.backdrop}
        centered
        onClick={handleToggle}
      >
        <QRCode size={254} value={value} />
      </Modal>
    </Col>
  );
};

export default GenQR;
