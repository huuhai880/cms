import React, { useState, useEffect } from "react";
import { Alert, Card, CardBody, CardHeader, Col, Input } from "reactstrap";
import Filter from "./Filter";
import { layoutFullWidthHeight } from "../../utils/html";
import MUIDataTable from "mui-datatables";
import { configTableOptions } from "../../utils/index";
import CustomPagination from "../../utils/CustomPagination";
import { CircularProgress, Checkbox } from "@material-ui/core";
import NewsCommentModel from "models/NewsCommentModel";
import { useParams } from "react-router";
import { getColumTable } from "./const";
import { Modal, Button } from "antd";
layoutFullWidthHeight();
function Comment() {
  let { id } = useParams();
  const _newsCommentModel = new NewsCommentModel();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleReview, setIsModalVisibleReview] = useState(false);
  const [query, setQuery] = useState({
    newsId: id,
    pageSize: 10,
    pageIndex: 1,
    selectdReview: 2,
  });
  const [isLoading, setisLoading] = useState(true);
  const [toggleSearch, settoggleSearch] = useState(true);
  const [dataComment, setDataComment] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [commentId, setCommentId] = useState("");

  // config modal Reply
  const handleOk = async () => {
    if (replyContent == "") {
      window._$g.dialogs.alert(window._$g._("Nội dung không được để trống"));
    } else {
      try {
        let postData = {
          new_id: id,
          comment_title: "Reply",
          comment_content: replyContent,
          replyToComment_id: commentId,
        };
        await _newsCommentModel.create(postData).then((data) => {
          window._$g.toastr.show("Trả lời thành công", "success");
          setIsModalVisible(false);
        });
      } catch (error) {
        console.log(error);
        window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
      } finally {
        setisLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setReplyContent("");
  };
  // config modal Rewview
  const handleOkReview = async () => {
    try {
      let postData = {
        is_review: 1,
        replyToComment_id: commentId,
      };
      await _newsCommentModel.review(postData).then((data) => {
        window._$g.toastr.show("Đồng ý duyệt thành công", "success");
        _callAPI(query);
        setIsModalVisibleReview(false);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
    } finally {
      setisLoading(false);
    }
  };
  const handleNoReview = async () => {
    try {
      let postData = {
        is_review: 0,
        replyToComment_id: commentId,
      };
      await _newsCommentModel.review(postData).then((data) => {
        window._$g.toastr.show("Không đồng ý duyệt thành công", "success");
        _callAPI(query);
        setIsModalVisibleReview(false);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
    } finally {
      setisLoading(false);
    }
  };
  const handleCancelReview = () => {
    setIsModalVisibleReview(false);
    setReplyContent("");
  };
  ////search
  const handleSubmitFillter = async (value) => {
    let searchQuery = Object.assign(query, value);
    // console.log(searchQuery)
    _callAPI(searchQuery);
  };

  ////call API
  const _callAPI = async (props) => {
    try {
      await _newsCommentModel.getListComment(props).then((data) => {
        setDataComment(data);
        // console.log(data);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
    } finally {
      setisLoading(false);
    }
  };

  //// init data
  useEffect(() => {
    _callAPI(query);
  }, []);
  //// delete
  const handleDelete = (comment_id) => {
    window._$g.dialogs.prompt("Bạn có chắc chắn muốn xóa dữ liệu đang chọn?", "xóa", (confirm) => {
      if (confirm) {
        try {
          let postData = {
            replyToComment_id: comment_id,
          };
          _newsCommentModel.delete(postData).then((data) => {
            window._$g.toastr.show("Xóa thành công", "success");
            _callAPI(query);
          });
        } catch (error) {
          console.log(error);
          window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
        } finally {
          setisLoading(false);
        }
      }
    });
  };
  const handleReply = (comment_id) => {
    // console.log(comment_id)
    setCommentId(comment_id);
    setIsModalVisible(true);
  };
  const handleReview = (comment_id) => {
    setCommentId(comment_id);
    setIsModalVisibleReview(true);
  };

  return (
    <div>
      <Card className="animated fadeIn z-index-222 mb-3 ">
        <CardHeader className="d-flex">
          <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
          <div className="minimize-icon cur-pointer" onClick={() => settoggleSearch(!toggleSearch)}>
            <i className={`fa ${toggleSearch ? "fa-minus" : "fa-plus"}`} />
          </div>
        </CardHeader>
        {toggleSearch && (
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-filter__custom">
              <Filter handleSubmitFillter={handleSubmitFillter} />
            </div>
          </CardBody>
        )}
      </Card>
      <Card className={`animated fadeIn mb-3 `}>
        <CardBody className="px-0 py-0">
          <Col xs={12} style={{ padding: 0 }}>
            <div className="MuiPaper-root__custom">
              {isLoading ? (
                <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                  <CircularProgress />
                </div>
              ) : (
                <div>
                  <MUIDataTable
                    data={dataComment.items}
                    columns={getColumTable(
                      dataComment.items,
                      dataComment.totalItems,
                      query,
                      handleDelete,
                      handleReply,
                      handleReview
                    )}
                    options={configTableOptions(dataComment.totalItems, query.pageIndex, {
                      itemsPerPage: query.pageSize,
                    })}
                  />
                  <CustomPagination
                    count={dataComment.totalItems}
                    rowsPerPage={query.pageSize}
                    page={query.pageIndex - 1 || 0}
                    // onChangePage={handleChangePage}
                    // onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </div>
              )}
            </div>
          </Col>
        </CardBody>
      </Card>
      <Modal
        title="Nội dung"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Lưu
          </Button>,
        ]}
      >
        <Input
          type="textarea"
          placeholder="Nội dung"
          value={replyContent}
          onChange={(e) => {
            setReplyContent(e.target.value);
          }}
        />
      </Modal>
      <Modal
        title="Duyệt"
        visible={isModalVisibleReview}
        onCancel={handleCancelReview}
        footer={[
          <Button key="back" onClick={handleCancelReview}>
            Hủy bỏ
          </Button>,
          <Button key="back" onClick={handleNoReview} type="danger">
            Không duyệt
          </Button>,
          <Button key="submit" type="primary" onClick={handleOkReview}>
            Đồng ý duyệt
          </Button>,
        ]}
      ></Modal>
    </div>
  );
}

export default Comment;
