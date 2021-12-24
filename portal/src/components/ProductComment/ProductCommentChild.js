import React from "react";
import { Table } from "antd";
import { Button } from "reactstrap";
import { CheckAccess } from "../../navigation/VerifyAccess";
import avt_0 from "../../assets/img/avt_0.png";
import avt_1 from "../../assets/img/avt_1.png";

function ProductCommentChild({ data = [], indexParent, handleDelete, handleReview}) {
    const columns = [
        {
            title: "STT",
            dataIndex: "STT",
            key: "STT",
            render: (text, record, index) => {
                return (
                    <div className="text-center">
                        {indexParent}.{index + 1}
                    </div>
                );
            },
            width: "4%",
        },
        {
            title: "Nguời bình luận",
            key: "user_comment",
            dataIndex: "user_comment",
            width: "18.5%",
            render: (text, record, index) => {
                let { is_staff = true, member_id = null, image_avatar = null, gender = 1 } = record || {};
                let avatar = member_id ? image_avatar : (gender == 1 ? avt_1 : avt_0);
                return (
                    <div className="text-left">
                        {
                            !is_staff && <img
                                className="mr-2"
                                style={{ width: 40, height: 40 }}
                                src={avatar}
                            />
                        }
                        {is_staff ? 'Admin' : text}
                    </div>
                );
            },
        },
        {
            title: "Nội dung bình luận",
            dataIndex: "content_comment",
            key: "content_comment",
            render: (text, record, index) => {
                return <div>{text}</div>;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "is_review",
            key: "is_review",
            responsive: ["md"],
            width: "9%",
            render: (text, record, index) => {
                let { review_user = null, is_review } = record || {};
                return <div className="text-left">
                    {review_user == null
                        ? "Chưa duyệt"
                        : is_review == 1
                            ? "Đã duyệt"
                            : is_review == 0
                                ? "Không duyệt"
                                : "Không duyệt"}
                </div>;
            },
        },

        {
            title: "Ngày bình luận",
            dataIndex: "comment_date",
            key: "comment_date",
            responsive: ["md"],
            width: "9%",
            render: (text, record, index) => {
                return (
                    <div className="text-center">
                        {text}
                    </div>
                );
            },
        },
        {
            title: "Thao tác",
            dataIndex: "",
            key: "x",
            width: "8%",
            render: (text, record, index) => {
                return (
                    <div className="text-center">
                        <CheckAccess permission="PRO_COMMENTS_REVIEW">
                            <Button
                                color={"success"}
                                title="Duyệt"
                                className="mr-1"
                                onClick={() => handleReview(record)}
                                disabled={record.review_user}
                            >
                                <i className="fa fa-check" />
                            </Button>
                        </CheckAccess>

                        <CheckAccess permission="PRO_COMMENTS_DEL">
                            <Button
                                color="danger"
                                title="Xóa"
                                className=""
                                onClick={() => handleDelete(record.product_comment_id)}
                            >
                                <i className="fa fa-trash" />
                            </Button>
                        </CheckAccess>
                    </div>
                );
            },
        },
    ];


    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered={true}
        />
    );
}

export default ProductCommentChild;