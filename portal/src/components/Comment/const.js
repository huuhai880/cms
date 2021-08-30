import {
  configTableOptions,
  configIDRowTable,
  numberFormat,
  getPropsConfigTable,
} from "../../utils/index";
import { CheckAccess } from "../../navigation/VerifyAccess";
import React from "react";
import { Button } from "reactstrap";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

export const getColumTable = (data, total, query, handleDelete, handleReply, handleReview) => {
  // console.log(data)
  return [
    configIDRowTable("news_comment_id", "", query),
    {
      name: "news_comment_user_fullname",
      label: "Người bình luận",
      options: {
        filter: false,
        sort: false,
        customHeadRender: (columnMeta, handleToggleColumn) => {
          return (
            <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
              <div className="text-center">{columnMeta.label}</div>
            </th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="text-left">
              {data[tableMeta["rowIndex"]].news_comment_user_img ? (
                <img
                  className="mr-2"
                  style={{ width: 40, height: 40 }}
                  src={
                    data[tableMeta["rowIndex"]].news_comment_user_img
                      ? data[tableMeta["rowIndex"]].news_comment_user_img
                      : null
                  }
                  //   alt="H1"
                />
              ) : null}
              {value}
            </div>
          );
        },
      },
    },
    {
      name: "news_comment_content",
      label: "Nội dung bình luận",
      options: {
        filter: false,
        sort: false,
        customHeadRender: (columnMeta, handleToggleColumn) => {
          return (
            <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
              <div className="text-center">{columnMeta.label}</div>
            </th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          //   console.log(tableMeta);
          return <div className="text-left">{value}</div>;
        },
      },
    },
    {
      name: "is_review",
      label: "Trạng thái",
      options: {
        filter: false,
        sort: false,
        customHeadRender: (columnMeta, handleToggleColumn) => {
          return (
            <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
              <div className="text-center">{columnMeta.label}</div>
            </th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          // console.log(data[tableMeta["rowIndex"]].is_review_user)
          return (
            <div className="text-left">
              {data[tableMeta["rowIndex"]].is_review_user == null
                ? "Chưa duyệt"
                : value == 1
                ? "Đã duyệt"
                : value == 0
                ? "Không duyệt"
                : "Không duyệt"}
            </div>
          );
        },
      },
    },
    {
      name: "is_staffcomment",
      label: "Phản hồi",
      options: {
        filter: false,
        sort: false,
        customHeadRender: (columnMeta, handleToggleColumn) => {
          return (
            <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
              <div className="text-center">{columnMeta.label}</div>
            </th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          console.log(data[tableMeta["rowIndex"]].news_comment_reply_user)
          return (
            <div className="text-left">
              {value == 1
                ? `Đã phản hồi(${data[tableMeta["rowIndex"]].news_comment_reply_user})`
                : value == 0
                ? `Chưa phản hồi`
                : "Chưa phản hồi"}
            </div>
          );
        },
      },
    },
    {
      name: "news_comment_create_date",
      label: "Ngày bình luận",
      options: {
        filter: false,
        sort: false,
        customHeadRender: (columnMeta, handleToggleColumn) => {
          return (
            <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
              <div className="text-center">{columnMeta.label}</div>
            </th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="text-center">
              {/* <Link to={`/affiliate/detail/${id}/${data[tableMeta["rowIndex"]].member_id}`}> */}
              {value}
              {/* </Link> */}
            </div>
          );
        },
      },
    },

    {
      name: "Thao tác",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customHeadRender: (columnMeta, handleToggleColumn) => {
          return (
            <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
              <div className="text-center">{columnMeta.label}</div>
            </th>
          );
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          // console.log(data[tableMeta["rowIndex"]].news_comment_user_fullname);
          return (
            <div className="text-center">
              <CheckAccess permission="NEWS_NEWS_COMMENT">
                <Button
                  color="warning"
                  title="Trả lời bình luận"
                  className="mr-1"
                  onClick={(evt) =>
                    handleReply({
                      id: data[tableMeta["rowIndex"]].news_comment_id,
                      fullname: data[tableMeta["rowIndex"]].news_comment_user_fullname,
                    })
                  }
                  disabled={data[tableMeta["rowIndex"]].is_review_user == null}
                >
                  <i className="fa fa-comment" />
                </Button>
              </CheckAccess>
              <CheckAccess permission="NEWS_NEWS_REVIEW">
                <Button
                  color={"success"}
                  title="Duyệt"
                  className="mr-1"
                  onClick={(evt) => handleReview({
                    id: data[tableMeta["rowIndex"]].news_comment_id,
                    fullname: data[tableMeta["rowIndex"]].news_comment_user_fullname,
                  })}
                  disabled={data[tableMeta["rowIndex"]].is_review_user != null}
                >
                  <i className="fa fa-check" />
                </Button>
              </CheckAccess>

              <CheckAccess permission="NEWS_NEWS_DEL">
                <Button
                  color="danger"
                  title="Xóa"
                  className=""
                  onClick={(evt) =>
                    handleDelete(data[tableMeta["rowIndex"]].news_comment_id, tableMeta["rowIndex"])
                  }
                >
                  <i className="fa fa-trash" />
                </Button>
              </CheckAccess>
            </div>
          );
        },
      },
    },
  ];
};
