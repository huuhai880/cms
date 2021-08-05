import React, { Component } from "react";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Rate } from "antd";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress, Checkbox } from "@material-ui/core";
import CustomPagination from "@utils/CustomPagination";
import ImageModal from "./ImageModal";

// Component(s)
import { CheckAccess } from "@navigation/VerifyAccess";

// Util(s)
import { configTableOptions, configIDRowTable } from "@utils/index";
import { PageFilter } from "@widget";
import { fnGet, fnDelete } from "@utils/api";

import "./index.scss";

class CommentRating extends Component {
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      toggleSearch: true,
      isLoading: false,
      willShowImportExcel: false,
      page: 0,
      count: 1,
      data: [],
      totalItems: 0,
      totalPages: 0,
      query: {
        itemsPerPage: 25,
        page: 1,
        is_active: 1,
        keyword: "",
      },
      isModal: false,
      comment_rating_id: "",
      isShowComemnt: false,
      current_data: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  // get data
  getData = async (_query = {}) => {
    this.setState({ isLoading: true });
    let { query } = this.state;

    const res = await fnGet({
      url: "comment-rating",
      query: { ...query, ..._query },
    });
    let { items = [], totalItems, totalPages, ...rest } = res;
    let isLoading = false;
    this.setState({
      isLoading,
      data: items,
      totalItems,
      totalPages,
      query: Object.assign(query, rest),
    });
  };

  handleClickAdd = () => {
    window._$g.rdr("/publishing-company/add");
  };

  async handleActionItemClick(type, id, rowIndex) {
    if (type === "view") {
      let comment = this.state.data[rowIndex];
      let commentType = "";
      switch (comment.key_type) {
        case "pro":
          commentType = `chi-tiet-san-pham/${comment.product}`;
          break;
        case "author":
          commentType = `chi-tiet-tac-gia/${comment.author}`;
          break;
        case "news":
          commentType = `chi-tiet-tin-tuc/${comment.news}`;
          break;
      }
      window.open(`${process.env.REACT_APP_WEBSITE}${commentType}`);
    } else if (type === "delete") {
      window._$g.dialogs.prompt(
        "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
        "Xóa",
        (confirm) => this.handleClose(confirm, id, rowIndex)
      );
    }
  }

  handleClose(confirm, id, rowIndex) {
    const { data } = this.state;
    if (confirm) {
      fnDelete({ url: `comment-rating/${id}` })
        .then(() => {
          const cloneData = JSON.parse(JSON.stringify(data));
          cloneData.splice(rowIndex, 1);
          this.setState({
            data: cloneData,
          });
        })
        .catch(() => {
          window._$g.dialogs.alert(
            window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
          );
        });
    }
  }

  handleChangeRowsPerPage = (event) => {
    let query = { ...this.state.query };
    query.itemsPerPage = event.target.value;
    query.page = 1;
    this.getData(query);
  };

  handleChangePage = (event, newPage) => {
    let query = { ...this.state.query };
    query.page = newPage + 1;
    this.getData(query);
  };

  handleFilter = (filter) => {
    let query = { ...this.state.query, ...filter };
    this.getData(query);
  };

  handleShowImage = (data) => {
    if (data) {
      const { comment_rating_id } = data;
      this.setState({
        isModal: !this.state.isModal,
        comment_rating_id,
      });
    } else {
      this.setState({
        isModal: !this.state.isModal,
      });
    }
  };
  handleShowComment = (data) => {
    if (data) {
      this.setState({
        isShowComemnt: !this.state.isShowComemnt,
        current_data: data,
      });
    } else {
      this.setState({
        isShowComemnt: !this.state.isShowComemnt,
        current_data: null,
      });
    }
  };

  trimString(s) {
    const strList = s.split(" ");
    let len = 0;
    let i = 0;
    let str = [];
    while (len < 30 && i < strList.length) {
      len += strList[i].length;
      str.push(strList[i]);
      i++;
    }
    let joined = str.join(" ");
    if (i === strList.length) {
      return joined;
    } else {
      return str.join(" ") + "...";
    }
  }

  render() {
    let { handlePick } = this.props;

    const columns = [
      configIDRowTable(),
      {
        name: "username",
        label: "Người binh luận",
        options: {
          filter: false,
          sort: false,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
              >
                <div className="text-center">{columnMeta.label}</div>
              </th>
            );
          },
        },
      },
      {
        name: "rating",
        label: "Điểm rating",
        options: {
          filter: false,
          sort: false,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
              >
                <div className="text-center">{columnMeta.label}</div>
              </th>
            );
          },
          customBodyRender: (value) => (
            <Rate value={parseInt(value)} disabled />
          ),
        },
      },
      {
        name: "key_type",
        label: "Danh mục",
        options: {
          filter: false,
          sort: false,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
              >
                <div className="text-center">{columnMeta.label}</div>
              </th>
            );
          },
          customBodyRender: (value) => (
            <div>
              {value === "pro"
                ? "sản phẩm"
                : value === "author"
                ? "tác giả"
                : value === "news"
                ? "tin tức"
                : ""}
            </div>
          ),
        },
      },
      {
        name: "content",
        label: "Nội dung",
        options: {
          filter: false,
          sort: false,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
              >
                <div className="text-center">{columnMeta.label}</div>
              </th>
            );
          },
          customBodyRender: (value, tableMeta) => (
            <div
              className="cmt-view"
              onClick={() =>
                this.handleShowComment(this.state.data[tableMeta.rowIndex])
              }
            >
              {this.trimString(value)}
            </div>
          ),
        },
      },
      {
        name: "image",
        label: "Hình ảnh",
        options: {
          filter: false,
          sort: false,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
              >
                <div className="text-center">{columnMeta.label}</div>
              </th>
            );
          },
          customBodyRender: (_, tableMeta) => (
            <div
              className="view-image underline"
              onClick={() =>
                this.handleShowImage(this.state.data[tableMeta.rowIndex])
              }
            >
              Xem hình ảnh
            </div>
          ),
        },
      },
      {
        name: "created_date",
        label: "Ngày bình luận",
        options: {
          filter: false,
          sort: false,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
              >
                <div className="text-center">{columnMeta.label}</div>
              </th>
            );
          },
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div className="text-center">{value}</div>;
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
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
              >
                <div className="text-center">{columnMeta.label}</div>
              </th>
            );
          },
          customBodyRender: (value, tableMeta, updateValue) => {
            if (handlePick) {
              return (
                <div className="text-center mb-1">
                  <Checkbox
                    onChange={({ target }) => {
                      let item = this.state.data[tableMeta["rowIndex"]];
                      let { _pickDataItems = {} } = this;
                      if (target.checked) {
                        _pickDataItems[item.product_id] = item;
                      } else {
                        delete _pickDataItems[item.product_id];
                      }
                      Object.assign(this, { _pickDataItems });
                    }}
                  />
                </div>
              );
            }
            return (
              <div className="text-center">
                <CheckAccess permission="CRM_COMMENTRATING_VIEW">
                  <Button
                    color="primary"
                    title="Chỉnh sửa"
                    className="mr-1"
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "view",
                        this.state.data[tableMeta["rowIndex"]]
                          .publishing_company_id,
                        tableMeta["rowIndex"]
                      )
                    }
                    disabled={this.state.data[tableMeta["rowIndex"]].view === 0}
                  >
                    <i className="fa fa-eye" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="CRM_COMMENTRATING_DEL">
                  <Button
                    color="danger"
                    title="Xóa"
                    className=""
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "delete",
                        this.state.data[tableMeta["rowIndex"]]
                          .comment_rating_id,
                        tableMeta["rowIndex"]
                      )
                    }
                    disabled={this.state.data[tableMeta["rowIndex"]].del === 0}
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

    const { totalItems, query } = this.state;
    const options = configTableOptions(totalItems, 0, query);

    return (
      <div className="animated fadeIn">
        <PageFilter
          smInputs={9}
          smButtons={3}
          filters={[
            {
              name: "keyword",
              label: "Từ khoá",
              type: "input",
              sm: 4,
              defaultValue: query.keyword,
              placeholder: "Nhập tên người bình luận",
            },
            {
              name: "rating",
              label: "Đánh giá",
              type: "select",
              list: [
                { label: "Tất cả", value: 0 },
                { label: "1 sao", value: 1 },
                { label: "2 sao", value: 2 },
                { label: "3 sao", value: 3 },
                { label: "4 sao", value: 4 },
                { label: "5 sao", value: 5 },
              ],
              sm: 4,
              defaultValue: query.rating,
            },
            {
              name: "is_active",
              label: "Kích hoạt",
              type: "select",
              list: [
                { label: "Không", value: 0 },
                { label: "Có", value: 1 },
                { label: "Cả hai", value: 2 },
              ],
              sm: 4,
              defaultValue: query.is_active,
            },
          ]}
          handleSubmit={(value) => this.handleFilter(value)}
        />
        {handlePick ? (
          <div className="text-right mb-1">
            <Button
              color="success"
              size="sm"
              className="col-12 max-w-110 ml-2 mobile-reset-width"
              onClick={() => {
                let { _pickDataItems } = this;
                handlePick(_pickDataItems);
              }}
            >
              <i className="fa fa-plus mr-1" />
              Chọn
            </Button>
          </div>
        ) : null}
        <Card className="animated fadeIn">
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-root__custom">
              {this.state.isLoading ? (
                <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                  <CircularProgress />
                </div>
              ) : (
                <div>
                  <MUIDataTable
                    data={this.state.data}
                    columns={columns}
                    options={options}
                  />
                  <CustomPagination
                    count={1 * totalItems}
                    rowsPerPage={1 * query.itemsPerPage}
                    page={1 * query.page - 1}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
        <Modal
          isOpen={this.state.isModal}
          toggle={() => this.handleShowImage()}
          size="lg"
        >
          <ModalBody>
            <div
              className="cmt-modal-close"
              onClick={() => this.handleShowImage()}
            >
              <i
                className="fa fa-times-circle fa-2x"
                style={{ color: "#FF9494" }}
              />
            </div>
            <ImageModal comment_rating_id={this.state.comment_rating_id} />
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.isShowComemnt}
          toggle={() => this.handleShowComment()}
        >
          <ModalHeader>Nội dung bình luận</ModalHeader>
          <ModalBody>
            <div>
              {this.state.current_data ? this.state.current_data.content : ""}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.handleShowComment()}>
              Đóng
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CommentRating;
