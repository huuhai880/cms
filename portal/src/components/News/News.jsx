import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Row,
  Col,
  Label,
  FormGroup,
} from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress, Checkbox } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import NewsFilter from "./NewsFilter";
// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions, configIDRowTable } from "../../utils/index";
// Model(s)
import NewsModel from "../../models/NewsModel";
import NewsCategoryModel from "../../models/NewsCategoryModel";
import NewsStatusModel from "../../models/NewsStatusModel";
import "./styles.scss";
import { fnUpdate } from "@utils/api";
// Set layout full-wh
layoutFullWidthHeight();

/**
 * @class News
 */
class News extends Component {
  /**
   * @var {NewsModel}
   */
  _newsModel;

  constructor(props) {
    super(props);
    this.reviewNote = React.createRef();

    // Init model(s)
    this._newsModel = new NewsModel();
    this._newsCategoryModel = new NewsCategoryModel();
    this._newsStatusModel = new NewsStatusModel();
    // Bind method(s)
  }

  state = {
    toggleSearch: true,
    isLoading: false,
    page: 0,
    count: 1,
    data: [],
    query: {
      itemsPerPage: this.props.handlePick ? 10 : 25,
      page: 1,
      is_active: 1,
      exclude_id: this.props.excludeNewsId || null,
    },
    newsCategoryArr: [{ name: "Tất cả", id: "", value: "" }],
    newsStatusArr: [],
    isOpenReview: false,
    currentItem: {},
    isRequireNote: false,
    _pickDataItems: {}
  };

  componentDidMount() {
    // Get bundle data
    this.setState({ isLoading: true });
    (async () => {
      let bundle = await this._getBundleData();
      let { data } = bundle;
      let dataConfig = data ? data.items : [];
      let isLoading = false;
      let count = data ? data.totalItems : 0;
      let page = 0;
      //

      let { newsCategoryArr = [], newsStatusArr = [] } = this.state;
      newsCategoryArr = newsCategoryArr.concat(bundle.newsCategoryArr || []);
      newsStatusArr = newsStatusArr.concat(bundle.newsStatusArr || []);
      const _pickDataItems = this.props.related ? (this.props.related||[]).reduce((obj, item) => {
        obj[item.news_id] = item;
        return obj;
      }, {}) : {};
      this.setState(
        {
          isLoading,
        },
        () => {
          this.setState({
            data: dataConfig,
            count,
            page,
            newsCategoryArr: newsCategoryArr,
            newsStatusArr: newsStatusArr,
            _pickDataItems
          });
        }
      );
    })();
    if(this.props.related){
      
    }
    //.end
  }

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let bundle = {};
    const queryPrams =
      this.props.history && this.props.history.location
        ? new URLSearchParams(this.props.history.location.search)
        : null;
    const author_id = queryPrams ? queryPrams.get("author_id") : "";
    let all = [
      // @TODO:
      this._newsModel
        .getList({ ...this.state.query, author_id })
        .then((data) => (bundle["data"] = data)),
      this._newsCategoryModel
        .getOptions({})
        .then((data) => (bundle["newsCategoryArr"] = data)),
    ];
    await Promise.all(all).catch((err) => {
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => {
          window.location.reload();
        }
      );
    });
    return bundle;
  }

  // get data
  getData = (query = {}) => {
    this.setState({ isLoading: true });
    const queryPrams =
      this.props.history && this.props.history.location
        ? new URLSearchParams(this.props.history.location.search)
        : null;
    const author_id = queryPrams ? queryPrams.get("author_id") : "";
    return this._newsModel.getList({ ...query, author_id }).then((res) => {
      let data = res.items;
      let isLoading = false;
      let count = res.totalItems;
      let page = query["page"] - 1 || 0;
      this.setState({
        data,
        isLoading,
        count,
        page,
        query,
      });
    });
  };

  handleClickAdd = () => {
    window._$g.rdr("/news/add");
  };

  handleChangeStatus = (status, id, rowIndex) => {
    window._$g.dialogs.prompt(
      "Bạn có chắc chắn muốn thay đổi trạng thái dữ liệu đang chọn?",
      "Cập nhật",
      (confirm) => this.onChangeStatus(confirm, status, id, rowIndex)
    );
  };

  onChangeStatus = (confirm, status, id, idx) => {
    if (confirm) {
      let postData = { is_active: status ? 1 : 0 };
      this._newsModel
        .changeStatus(id, postData)
        .then(() => {
          const cloneData = [...this.state.data];
          cloneData[idx].is_active = status;
          this.setState(
            {
              data: cloneData,
            },
            () => {
              window._$g.toastr.show(
                "Cập nhật trạng thái thành công.",
                "success"
              );
            }
          );
        })
        .catch(() => {
          window._$g.toastr.show(
            "Cập nhật trạng thái không thành công.",
            "error"
          );
        });
    }
  };

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: "/news/detail/",
      comment: "/news/comment/",
      delete: "/news/delete/",
      edit: "/news/edit/",
    };
    const route = routes[type];

    if (type.match(/detail|edit|comment/i)) {
      window._$g.rdr(`${route}${id}`);
    } else {
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
      this._newsModel
        .delete(id)
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

  handleSubmitFilter = (
    isReset,
    search,
    is_active,
    news_category_id,
    news_date_from,
    news_date_to,
    create_date_from,
    create_date_to
  ) => {
    let query = { ...this.state.query };
    query.page = 1;
    if (isReset) {
      query = Object.assign(query, {
        news_key: null,
      });
    }
    query = Object.assign(query, {
      search,
      is_active,
      news_category_id,
      news_date_from,
      news_date_to,
      create_date_from,
      create_date_to,
    });
    this.getData(query).catch(() => {
      window._$g.dialogs.alert(
        window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
      );
    });
  };

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

  handleOpenReview = (item) => {
    this.setState({
      isOpenReview: true,
      currentItem: item,
      isRequireNote: false,
    });
  };
  toggleOpenReview() {
    this.setState({
      isOpenReview: !this.state.isOpenReview,
      isRequireNote: false,
    });
  }
  handleReivewAction(isOk) {
    if (this.reviewNote.current.value) {
      const data = this.state.currentItem;
      fnUpdate({
        url: `news/${data.news_id}/update-review`,
        body: {
          note: this.reviewNote.current.value,
          is_review: isOk ? 1 : 0,
        },
      }).then(() => {
        this.getData();
        this.toggleOpenReview();
      });
    } else {
      this.setState({ isRequireNote: true });
    }
  }

  handlePickNews = () => {
    const { handlePick } = this.props;
    if (handlePick) {
      handlePick(this.state._pickDataItems);
    }
  };

  render() {
    const columns = [
      configIDRowTable("news_id", "/news/detail/", this.state.query),
      {
        name: "news_title",
        label: "Tiêu đề",
        options: {
          filter: false,
          sort: true,
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
        name: "news_category_name",
        label: "Chuyên mục",
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
        name: "create_date",
        label: "Ngày tạo",
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
        name: "news_date",
        label: "Ngày đăng",
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
        name: "user",
        label: "Người tạo",
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
        name: "is_review",
        label: "Trạng thái",
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
            return (
              <div className="text-center">
                {value == 1
                  ? "Đã duyệt"
                  : value == 2
                  ? "Chưa duyệt"
                  : "Không duyệt"}
              </div>
            );
          },
        },
      },
      {
        name: "is_active",
        label: "Kích hoạt",
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
            return <div className="text-center">{value ? "Có" : "Không"}</div>;
          },
        },
      },
      {
        name: "Thao tác",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (handlePick) {
              let item = this.state.data[tableMeta["rowIndex"]];
              let { _pickDataItems = {} } = this.state;
              return (
                <div className="text-center mb-1">
                  <Checkbox
                    checked={!!_pickDataItems[item.news_id]}
                    onChange={({ target }) => {
                      if (target.checked) {
                        _pickDataItems[item.news_id] = item;
                      } else {
                        delete _pickDataItems[item.news_id];
                      }
                      this.setState({_pickDataItems})
                    }}
                  />
                </div>
              );
            }

            return (
              <div className="text-center">
                <CheckAccess permission="NEWS_NEWS_REVIEW ">
                  <Button
                    color={
                      this.state.data[tableMeta["rowIndex"]].is_review !== 2
                        ? "success"
                        : "dark"
                    }
                    title="Duyệt"
                    className="mr-1"
                    onClick={(evt) =>
                      this.handleOpenReview(
                        this.state.data[tableMeta["rowIndex"]]
                      )
                    }
                    disabled={
                      this.state.data[tableMeta["rowIndex"]].is_review !== 2
                    }
                  >
                    <i className="fa fa-check" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="NEWS_NEWS_COMMENT">
                  <Button
                    color="warning"
                    title="Bình luận"
                    className="mr-1"
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "comment",
                        this.state.data[tableMeta["rowIndex"]].news_id,
                        tableMeta["rowIndex"]
                      )
                    }
                    // disabled={this.state.data[tableMeta["rowIndex"]].is_review !== 2}
                  >
                    <i className="fa fa-comment" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="NEWS_NEWS_EDIT">
                  <Button
                    color="primary"
                    title="Chỉnh sửa"
                    className="mr-1"
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "edit",
                        this.state.data[tableMeta["rowIndex"]].news_id,
                        tableMeta["rowIndex"]
                      )
                    }
                  >
                    <i className="fa fa-edit" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="NEWS_NEWS_DEL">
                  <Button
                    color="danger"
                    title="Xóa"
                    className=""
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "delete",
                        this.state.data[tableMeta["rowIndex"]].news_id,
                        tableMeta["rowIndex"]
                      )
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

    const { count, page, query } = this.state;
    const { handlePick } = this.props;
    const options = configTableOptions(count, page, query);
    return (
      <div>
        <Card
          className={`animated fadeIn z-index-222 mb-3 ${
            handlePick ? "news-header-no-border" : ""
          }`}
        >
          <CardHeader className="d-flex">
            <div className="flex-fill font-weight-bold">
              {handlePick ? "Thêm bài viết liên quan" : "Thông tin tìm kiếm"}
            </div>
            {handlePick ? (
              <Button color="danger" size="md" onClick={() => handlePick({})}>
                <i className={`fa fa-remove`} />
              </Button>
            ) : (
              <div
                className="minimize-icon cur-pointer "
                onClick={() =>
                  this.setState((prevState) => ({
                    toggleSearch: !prevState.toggleSearch,
                  }))
                }
              >
                <i
                  className={`fa ${
                    this.state.toggleSearch ? "fa-minus" : "fa-plus"
                  }`}
                />
              </div>
            )}
          </CardHeader>
          {this.state.toggleSearch && (
            <CardBody className="px-0 py-0">
              <div className="MuiPaper-filter__custom z-index-2">
                <NewsFilter
                  handleSubmit={this.handleSubmitFilter}
                  newsCategoryArr={this.state.newsCategoryArr}
                  newsStatusArr={this.state.newsStatusArr}
                  handlePick={handlePick ? this.handlePickNews : null}
                />
              </div>
            </CardBody>
          )}
        </Card>
        {handlePick ? null : (
          <Col
            xs={12}
            sm={4}
            className="d-flex align-items-end mb-3"
            style={{ padding: 0 }}
          >
            <CheckAccess permission="NEWS_NEWS_ADD">
              <FormGroup className="mb-2 mb-sm-0">
                <Button
                  className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                  onClick={() => this.handleClickAdd()}
                  color="success"
                  size="sm"
                >
                  <i className="fa fa-plus mr-1" />
                  Thêm mới
                </Button>
              </FormGroup>
            </CheckAccess>
          </Col>
        )}
        <Card
          className="animated fadeIn"
          style={{ marginBottom: handlePick ? 0 : "1.5rem", border: "none" }}
        >
          <CardBody
            className={`py-0 ${!this.props.isOpenNewsList ? "px-0" : ""}`}
          >
            <div className="MuiPaper-root__custom MuiPaper-user">
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
                    count={count}
                    rowsPerPage={query.itemsPerPage}
                    page={page}
                    rowsPerPageOptions={
                      handlePick ? [10, 25, 50, 75, 100] : [25, 50, 75, 100]
                    }
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
        <Modal
          isOpen={this.state.isOpenReview}
          toggle={() => this.toggleOpenReview()}
        >
          <ModalHeader>Duyệt bài viết</ModalHeader>
          <ModalBody>
            <span>
              Bạn có muốn duyệt bài viết {this.state.currentItem.news_title}
              {" không?"}
            </span>
            <Row className="mt-2">
              <Col sm={3}>
                <Label>
                  Ghi chú<span className="font-weight-bold red-text"> * </span>
                </Label>
              </Col>
              <Col sm={9}>
                <Input type="textarea" innerRef={this.reviewNote} />
                {this.state.isRequireNote && (
                  <Label className="note-required">bắt buộc nhập ghi chú</Label>
                )}
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.handleReivewAction(true)}
            >
              Đồng ý duyệt
            </Button>
            <Button
              color="success"
              onClick={() => this.handleReivewAction(false)}
            >
              không duyệt
            </Button>
            <Button color="secondary" onClick={() => this.toggleOpenReview()}>
              Huỷ bỏ
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default News;
