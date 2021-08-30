import React, { useState, useMemo, useEffect } from "react";
import { Upload, Modal } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import "./styles.scss";

const getImageUrl = (imageUrl, id) => {
  let fileLists = [];
  fileLists.push({
    uid: id,
    //name: "",
    status: "done",
    url: imageUrl,
  });
  return fileLists;
};

function UploadImage(props) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState(
    props.imageUrl ? getImageUrl(props.imageUrl, props.id) : []
  );

  // useEffect(() => {
  //   if (props.imageUrl) {
  //     setFileList(getImageUrl(props.imageUrl));
  //   }
  // }, [props]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    console.log(file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64View(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle("Hình ảnh");
  };

  const handleChange = (info) => {
    if (info.file.status === "removed") {
      setFileList([]);
      props.onChange("");
    } else if (info.file.status === "uploading") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setFileList(getImageUrl(imageUrl));
        props.onChange(imageUrl);
      });
    }
  };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{props.label || `Upload`}</div>
    </div>
  );

  const getBase64View = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <Upload
        {...props}
        listType="picture-card"
        fileList={fileList||[]}
        onPreview={handlePreview}
        onChange={handleChange}
        showUploadList={{ showRemoveIcon: true, showPreviewIcon: true }}
        customRequest={({ file, onSuccess }) => {
          props.isRequest
            ? props.requestUpload(file, onSuccess)
            : setTimeout(() => {
                onSuccess("ok");
              }, 0);
        }}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        // title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        className="modal-preview-image-upload"
        closeIcon={
          <span className="modal-preview-image-upload-close-icon">
            <CloseOutlined />
          </span>
        }
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
}

//export default UploadImage;
function MemoizedUploadImageProfile(props) {
  return useMemo(() => {
    console.log("props.imageUrl", props.imageUrl? 1: 0)
    return (
      <UploadImage
        onChange={props.onChange}
        imageUrl={props.imageUrl}
        id={props.id}
        {...props}
      />
    );
  }, [props.imageUrl, props.onChange, props.id]);
}

export default MemoizedUploadImageProfile;
