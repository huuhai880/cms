import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Input } from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";

// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions } from "../../utils/index";
import { getColumnTable } from "./_constant";
import { Modal, Button } from "antd";
import ProductCommentFilter from "./ProductCommentFilter";
import ProductCommentModel from "models/ProductCommentModel/index";
import { Table, Badge, Menu, Dropdown, Space } from "antd";
import ProductCommentChild from "./ProductCommentChild";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import "./style.scss";

// Set layout full-wh
layoutFullWidthHeight();

function ProductComment({ product_id = 0, is_combo = false }) {
    const [expandedRowKey, setExpandedRowKey] = useState([]);
    const [toggleSearch, setToggleSearch] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        list: [],
        total: 0,
    });
    const [query, setQuery] = useState({
        itemsPerPage: 25,
        page: 1,
        is_review: 3,
        keyword: "",
        start_date: null,
        end_date: null,
    });

    const [isShowConfirmReview, setIsShowConfirmReview] = useState(false);
    const [commentSelected, setCommentSelected] = useState(null);
    const [isShowReply, setIsShowReply] = useState(false);
    const [msgError, setMsgError] = useState(null);
    const [contentComment, setContentComment] = useState('')

    useEffect(() => {
        getListComment(query);
    }, []);

    const getListComment = async (query) => {
        setIsLoading(true)
        try {
            const _productCommentModel = new ProductCommentModel();
            let data = await _productCommentModel.getList(Object.assign(query, { product_id, is_combo }));
            setData(data);
        } catch (error) {
            console.log(error)
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại")
            );
        }
        finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        }
    }

    const handleSubmitFilter = (params) => {
        let query_params = {
            ...query,
            ...params,
            page: 1,
            itemsPerPage: 25,
        };
        setQuery(query_params);
        getListComment(query_params);
    };


    const handleChangePage = (event, newPage) => {
        let filter = { ...query };
        filter.page = newPage + 1;
        setQuery(filter);
        getListComment(filter);
    };

    const handleChangeRowsPerPage = (event) => {
        let filter = { ...query };
        filter.itemsPerPage = event.target.value;
        filter.page = 1;
        setQuery(filter);
        getListComment(filter);
    };


    const handleDeleteComment = (product_comment_id) => {
        window._$g.dialogs.prompt("Bạn có chắc chắn muốn xóa dữ liệu đang chọn?", "xóa", (confirm) => {
            if (confirm) {
                try {
                    const _productCommentModel = new ProductCommentModel();
                    _productCommentModel.delete(product_comment_id).then(data => {
                        getListComment(query)
                    })
                        .catch(error => {
                            window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
                        })
                } catch (error) {
                    window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
                }
            }
        });
    };

    const handleReviewComment = (comment) => {
        setCommentSelected(comment);
        setIsShowConfirmReview(true)
    }

    const handleCancelReview = () => {
        setCommentSelected(null)
        setIsShowConfirmReview(false)
    }

    const handleSubmitReview = async (is_review = true) => {
        try {
            let { product_comment_id = null } = commentSelected || {};
            const _productCommentModel = new ProductCommentModel();
            let result = await _productCommentModel.review(product_comment_id, is_review);
            window._$g.toastr.show(`Duyệt bình luận của ${commentSelected ? commentSelected.user_comment : ''} thành công`, "success");
            setExpandedRowKey([commentSelected.product_comment_id])
            setIsShowConfirmReview(false);
            setCommentSelected(null)
            getListComment(query);
        } catch (error) {
            window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
        }
    }

    const handleReplyComment = (comment) => {
        setCommentSelected(comment)
        setIsShowReply(true);
        setMsgError(null);
    }

    const handleClosePopupReply = () => {
        setIsShowReply(false);
        setMsgError(null);
        setCommentSelected(null)
    }

    const handleSubmitReply = async () => {
        try {
            if (contentComment == "" || (contentComment && contentComment.trim() == "")) {
                setMsgError('Nội dung trả lời không được để trống !')
            }
            else {
                const _productCommentModel = new ProductCommentModel();
                let result = await _productCommentModel.reply({
                    product_id,
                    is_combo,
                    content_comment: contentComment,
                    comment_reply_id: commentSelected.product_comment_id
                })
                window._$g.toastr.show(`Trả lời bình luận của ${commentSelected ? commentSelected.user_comment : ''} thành công`, "success");
                setExpandedRowKey([commentSelected.product_comment_id])
                setContentComment('');
                setIsShowReply(false);
                setCommentSelected(null);
                getListComment(query);
            }
        } catch (error) {
            console.log(error)
            window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
        }
    }

    return (
        <div>
            <Card className={`animated fadeIn z-index-222 mb-3`}>
                <CardHeader className="d-flex">
                    <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
                    <div
                        className="minimize-icon cur-pointer "
                        onClick={() => setToggleSearch((p) => !p)}
                    >
                        <i className={`fa ${toggleSearch ? "fa-minus" : "fa-plus"}`} />
                    </div>
                </CardHeader>
                {toggleSearch && (
                    <CardBody className="px-0 py-0">
                        <div className="MuiPaper-filter__custom z-index-2">
                            <ProductCommentFilter handleSubmitFilter={handleSubmitFilter} />
                        </div>
                    </CardBody>
                )}
            </Card>

            <Card className="animated fadeIn">
                <CardBody className={`py-0 px-0`}>
                    <div className="MuiPaper-root__custom MuiPaper-user">
                        {isLoading? (
                            <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                                <CircularProgress />
                            </div>
                        ) : (
                            <div>
                                <Table
                                    className="components-table-demo-nested"
                                    columns={getColumnTable(handleDeleteComment, handleReplyComment, handleReviewComment)}
                                    dataSource={data.list}
                                    bordered={true}
                                    pagination={false}
                                    rowKey={"product_comment_id"}
                                    locale={{
                                        emptyText: "Không có dữ liệu",
                                    }}
                                    expandable={{
                                        expandedRowRender: (record, index) => (
                                            <ProductCommentChild
                                                data={record.reply_comments}
                                                indexParent={index + 1}
                                                handleDelete={handleDeleteComment}
                                                handleReview={handleReviewComment}
                                            />
                                        ),
                                        rowExpandable: (record) => record.reply_comments.length > 0,
                                        onExpand: (expanded, record) => {
                                            !expanded
                                                ? setExpandedRowKey([])
                                                : setExpandedRowKey([record.product_comment_id]);
                                        },
                                        expandedRowKeys: expandedRowKey,
                                        // expandRowByClick: true,
                                        expandIcon: ({ expanded, onExpand, record }) =>
                                            record.reply_comments.length > 0 ? (
                                                expanded ? (
                                                    <MinusSquareOutlined
                                                        className={"custom_icon"}
                                                        style={{ fontSize: 16, color: "#20a8d8" }}
                                                        onClick={(e) => onExpand(record, e)}
                                                    />
                                                ) : (
                                                    <PlusSquareOutlined
                                                        className={"custom_icon"}
                                                        style={{ fontSize: 16, color: "#20a8d8" }}
                                                        onClick={(e) => onExpand(record, e)}
                                                    />
                                                )
                                            ) : null,

                                    }}

                                />

                                <CustomPagination
                                    count={data.total}
                                    rowsPerPage={query.itemsPerPage}
                                    page={query.page - 1 || 0}
                                    rowsPerPageOptions={[25, 50, 75, 100]}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>

            <Modal
                wrapClassName="vertical-center-modal"
                width={500}
                title="Duyệt bình luận"
                visible={isShowConfirmReview}
                onCancel={handleCancelReview}
                footer={[
                    <Button key="back" onClick={handleCancelReview}>
                        Hủy bỏ
                    </Button>,
                    <Button key="back" onClick={() => handleSubmitReview(false)} type="danger">
                        Không duyệt
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => handleSubmitReview(true)}>
                        Đồng ý duyệt
                    </Button>
                ]} >
                <span>Bạn có muốn duyệt bình luận của {commentSelected ? commentSelected.user_comment : ''} không?</span>
            </Modal>

            <Modal
                wrapClassName="vertical-center-modal"
                title={`Phản hồi bình luận của ${commentSelected ? commentSelected.user_comment : ''}`}
                visible={isShowReply}
                onOk={handleSubmitReply}
                onCancel={handleClosePopupReply}
                width={500}
                footer={[
                    <Button key="back" onClick={handleClosePopupReply}>
                        Đóng
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmitReply}>
                        Lưu
                    </Button>,
                ]}
            >
                <Input
                    type="textarea"
                    placeholder="Nội dung"
                    value={contentComment}
                    onChange={(e) => {
                        setContentComment(e.target.value);
                    }}
                />
                {msgError && (
                    <div className="field-validation-error alert alert-danger fade show" role="alert">
                        {msgError}
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default ProductComment;