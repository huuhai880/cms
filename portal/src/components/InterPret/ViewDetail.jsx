import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

import InterpretModel from "../../models/InterpretModel";

import "./bw_css/bw_blackwind.css";
import "./bw_css/bw_main.css";
import logo from "./bw_image/logo_c.png"; // relative path to image
import { Modal } from "antd";
import { layoutFullWidthHeight } from "../../utils/html";

layoutFullWidthHeight();
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
  const _initDataDetail = () => {
    try {
      _interpretModel.detailWeb(id).then((data) => {
        data.viewContent = data.introduction + data.decs;
        data.interPretDetail.map((item, index) => {
          data.viewContent = data.viewContent + item.interpret_detail_full_content;
        });
        console.log(data)
        setDataInterpret(data);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    }
  };
  useEffect(() => {
    const createPage = (page, index) => {
      let html = `<div class="bw_wrapper bw_page_8 ">
                      <div class="bw_page_header bw_color_black">
                      <img src=${logo} alt="1" />
                      </div>
                      <div class="bw_content bw_mt_20">
                          <div class="bw_mt_40 bw_luangiai">
                              <div class="bw_content_luangiai">
                                  
                              </div>
                          </div>
                      </div>
                      <div class="bw_absolute bw_page_footer bw_color_black">
                          <p> © 2021 - Bản quyền thuộc về ungdungthansohoc.com</p>

                      </div>
                  </div>`;
      page.insertAdjacentHTML("afterend", html);
    };

    const appendToLastPage = (page, html) => {
      //Child
      let child = page.querySelector(".bw_content_luangiai");
      //Noi dung
      var pageText = child.innerHTML;
      child.innerHTML += html; // saves the text of the last page
      if (page.offsetHeight > 1123) {
        child.innerHTML = pageText; //resets the page-text
        return false; // returns false because page is full
      } else {
        return true; // returns true because word was successfully filled in the page
      }
    };

    const paginateText = () => {
      //Lấy danh sách page cần split
      // debugger
      let pagesPaging = document.getElementsByClassName("bw_split");
      //Duyệt
      for (let index = 0; index < pagesPaging.length; index++) {
        let page = pagesPaging[index];
        //Lấy element content
        let divLuanGiai = page.querySelector(".bw_content_luangiai");

        var cloneDivLuanGiai = page.querySelector(".bw_content_luangiai").cloneNode(true);

        //Lấy all Child
        var childsLuanGiai = cloneDivLuanGiai.children;

        //Reset
        divLuanGiai.innerHTML = "";

        for (let j = 0; j < childsLuanGiai.length; j++) {
          const childHtml = childsLuanGiai[j];
          let html = childHtml.outerHTML;
          var success = appendToLastPage(page, html);
          if (!success) {
            createPage(page);
            page = page.nextSibling;
            appendToLastPage(page, html);
          }
        }
      }
    };

    paginateText();
  }, [dataInterpret]);
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
        <div class="bw_wrapper bw_page_8 bw_split">
          <div class="bw_page_header bw_color_black">
            <img src={logo} alt="1"></img>
          </div>
          <div class="bw_text_center bw_sdfs">
            <h1>{dataInterpret.group_name}</h1>
          </div>
          <div class="bw_content bw_mt_20 ">
            <div class="bw_index_items">
              <p>{dataInterpret.mainnumber}</p>
            </div>
            <div class="bw_tetx">
              <div dangerouslySetInnerHTML={{ __html: dataInterpret.desc_attributes_gruop }} />
            </div>

            <div class="bw_mt_40 bw_luangiai">
              <div
                class="bw_content_luangiai"
                dangerouslySetInnerHTML={{ __html: dataInterpret.viewContent }}
              >
                {/* <div  /> */}
                {/* <div dangerouslySetInnerHTML={{ __html: dataInterpret.introduction }} />

                <div dangerouslySetInnerHTML={{ __html: dataInterpret.brief_decs }} />

                <div dangerouslySetInnerHTML={{ __html: dataInterpret.decs }} />

                {dataInterpret.interPretDetail &&
                  dataInterpret.interPretDetail.map((item, index) => {
                    return (
                      <>
                        <div
                          dangerouslySetInnerHTML={{ __html: item.interpret_detail_short_content }}
                        />

                        <div
                          dangerouslySetInnerHTML={{ __html: item.interpret_detail_full_content }}
                        />
                      </>
                    );
                  })} */}
              </div>
            </div>
            <div class="bw_absolute bw_page_footer bw_color_black">
                          <p> © 2021 - Bản quyền thuộc về ungdungthansohoc.com</p>

                      </div>
          </div>
        </div>
        <div id="paginatedText"></div>
      </Modal>
    </div>
  );
}

export default ViewDetail;
