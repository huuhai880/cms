import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

import InterpretModel from "../../models/InterpretModel";

import "./bw_css/bw_blackwind.css";
import "./bw_css/bw_main.css";
import logo from "./bw_image/logo_c.png"; // relative path to image
import { Modal } from "antd";
function ViewDetail() {
  const _interpretModel = new InterpretModel();
  const [dataInterpret, setDataInterpret] = useState("");
  const [visible, setVisible] = useState(true);
  let { id } = useParams();
  //////get data detail
  useEffect(() => {
    if (id) {
      _initDataDetail();
      //   setVisible(true)
    }
  }, [id]);


  //// data detail
  const _initDataDetail = async () => {
    try {
      await _interpretModel.detail(id).then((data) => {
        // console.log(
        //   (document.querySelector("#elementToBeReplace").innerHTML = data.brief_decs),
        //   (document.querySelector("#elementToBeReplace").innerHTML = data.decs)
        // );

        setDataInterpret(data);
        // console.log()
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };
  return (
    <div>
      <Modal
        // title="Modal 1000px width"
        // This was removed
        // centered
        visible={visible}
        footer={(null, null)}
        zIndex="99999"
        closable={false}
      >
        <div class="bw_wrapper bw_page_8">
          <div class="bw_page_header bw_color_black">
            <img src={logo} alt="1"></img>
          </div>
          <div class="bw_text_center bw_sdfs">
            <h1>{dataInterpret.attribute_name}</h1>
          </div>
          <div class="bw_content bw_mt_20">
            <div class="bw_index_items">
              <p>{dataInterpret.mainnumber}</p>
            </div>
            <div class="bw_tetx">
              <div dangerouslySetInnerHTML={{ __html: dataInterpret.brief_decs }} />
              {/* dangerouslySetInnerHTML={{ __html: this.state.note}} */}
              {/* {dataInterpret.brief_decs} */}
            </div>
            <div class="bw_mt_40 bw_luangiai">
              <div class="bw_content_luangiai">
                <div dangerouslySetInnerHTML={{ __html: dataInterpret.decs }} />
              </div>
            </div>
          </div>
          <div class="bw_absolute bw_page_footer bw_color_black">
            <p> © 2021 - Bản quyền thuộc về ungdungthansohoc.com</p>
            <p>Trang 4</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ViewDetail;