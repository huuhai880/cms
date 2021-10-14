import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

import InterpretModel from "../../models/InterpretModel";
import logo_C from "./bw_image/logo_c.png"; // relative path to image
import "./bw_css/bw_blackwind_spectial.css";
import "./bw_css/bw_main_spectial.css";
import logo from "./bw_image_spectial/logo.png"; // relative path to image
import { Modal } from "antd";
import { layoutFullWidthHeight } from "../../utils/html";

layoutFullWidthHeight();

function ViewDetailSpectial() {
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
  const _initDataDetail = () => {
    try {
      _interpretModel.detailWeb(id).then((data) => {
        setDataInterpret(data);
        console.log(data);
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
        <div class="bw_wrapper bw_page_16 bw_page_23 ">
          <div class="bw_page_header">
            <img src={logo} alt="1"></img>
          </div>
          <div class="bw_content bw_back" style={{marginTop: "50mm"}}>
                NHẬN ĐỊNH<br/>&<br/>CHÚ Ý RIÊNG<br/>CHO LÁ SỐ<br/>CỦA BẠN
            </div>
        </div>
        <div class="bw_wrapper bw_page_20 bw_page_24 bw_page_33">
          <div class="bw_page_header bw_color_black">
            <img src={logo_C} alt="1"></img>
          </div>
          <div>
            <h1>NHẬN ĐỊNH VÀ CHÚ Ý RIÊNG</h1>
            <div class="bw_content_luangiai">
              <p>
                <b>
                  <i>Dành riêng cho bản DELUXE của bạn</i>
                </b>
                , dưới đây là những luận giải đặc biệt nhất, riêng nhất và độc đáo nhất từ bộ môn
                Numerology (Thần số học) mà chúng tôi đã nghiên cứu và đọc vị. Những luận giải này{" "}
                <b>
                  <i>dựa trên các khảo nghiệm, minh chứng từ hàng ngàn bộ số</i>
                </b>{" "}
                mà Đội ngũ Ứng dụng Thần số học đã nghiên cứu, hi vọng mang đến những Nhận định
                riêng hữu ích cho hành trình phát triển của bạn!
              </p>
              <p>
                <b>Bộ số của bạn tiết lộ những bí mật sau:</b>
              </p>
              <div class="bw_mt_40 bw_luangiai">
              <div class="bw_content_luangiai">
                <div dangerouslySetInnerHTML={{ __html: dataInterpret.brief_decs }} />
              </div>
            </div>
            <div class="bw_mt_40 bw_luangiai">
              <div class="bw_content_luangiai">
                <div dangerouslySetInnerHTML={{ __html: dataInterpret.decs }} />
              </div>
            </div>
            {dataInterpret.interPretDetail &&
              dataInterpret.interPretDetail.map((item, index) => {
                return (
                  <>
                    <div class="bw_mt_40 bw_luangiai">
                      <div class="bw_content_luangiai">
                        <div
                          dangerouslySetInnerHTML={{ __html: item.interpret_detail_short_content }}
                        />
                      </div>
                    </div>
                    <div class="bw_mt_40 bw_luangiai">
                      <div class="bw_content_luangiai">
                        <div
                          dangerouslySetInnerHTML={{ __html: item.interpret_detail_full_content }}
                        />
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div class="bw_absolute bw_page_footer bw_color_black">
            <p> © 2021 - Bản quyền thuộc về ungdungthansohoc.com</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ViewDetailSpectial;
