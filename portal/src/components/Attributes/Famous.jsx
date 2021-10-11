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
import FamousFilter from "./FamousFilter";
// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions, configIDRowTable } from "../../utils/index";
// Model(s)
import FarmousModel from "../../models/FarmousModel";
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
    this._famous = new FarmousModel();
    // Bind method(s)
  }

  state = {
    toggleSearch: true,
    isLoading: false,
    page: 0,
    count: 1,
    data: [],
    query: {
      itemsPerPage: 25,
      page: 1,
      selectdActive: 1,
      gender: 2,
    },
    isOpenReview: false,
    currentItem: {},
    isRequireNote: false,
    _pickDataItems: {},
  };

  componentDidMount() {
    // Get bundle data
    this.setState({ isLoading: true });
    (async () => {
      let bundle = await this._getBundleData();
      console.log(bundle);
      let { data } = bundle;
      let dataConfig = data ? data.items : [];
      let isLoading = false;
      let count = data ? data.totalItems : 0;
      let page = 0;
      const _pickDataItems = this.props.related
        ? (this.props.related || []).reduce((obj, item) => {
            obj[item.farmous_id] = item;
            return obj;
          }, {})
        : {};
      this.setState(
        {
          isLoading,
        },
        () => {
          this.setState({
            data: dataConfig,
            count,
            page,
            _pickDataItems,
          });
        }
      );
    })();
    if (this.props.related) {
    }
    //.end
  }

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let bundle = {};
    let all = [
      // @TODO:
      this._famous.getListFarmous({ ...this.state.query }).then((data) => (bundle["data"] = data)),
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
    return this._famous.getListFarmous({ ...query }).then((res) => {
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
          window._$g.dialogs.alert(window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!"));
        });
    }
  }

  handleSubmitFilter = (isReset, keyword) => {
    let query = { ...this.state.query };
    query.page = 1;
    if (isReset) {
      query = Object.assign(query, {
        news_key: null,
      });
    }
    query = Object.assign(query, {
      keyword,
    });
    this.getData(query).catch(() => {
      window._$g.dialogs.alert(window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!"));
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

  handlePickFamous = () => {
    const { handlePick } = this.props;
    if (handlePick) {
      handlePick(this.state._pickDataItems);
    }
  };

  render() {
    const columns = [
      configIDRowTable("farmous_id", "/famous/detail/", this.state.query),
      {
        name: "farmous_name",
        label: "Họ và tên",
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
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div className="text-left">{value}</div>;
          },
        },
      },
      {
        name: "position",
        label: "Chức danh",
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
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div className="text-left">{value}</div>;
          },
        },
      },
      {
        name: "birthday",
        label: "Sinh nhật",
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
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div className="text-left">{value}</div>;
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
                    checked={!!_pickDataItems[item.farmous_id]}
                    onChange={({ target }) => {
                      if (target.checked) {
                        _pickDataItems[item.farmous_id] = item;
                      } else {
                        delete _pickDataItems[item.farmous_id];
                      }
                      this.setState({ _pickDataItems });
                    }}
                  />
                </div>
              );
            }

            return (
              <div className="text-center">
                <CheckAccess permission="NEWS_NEWS_REVIEW">
                  <Button
                    color={
                      this.state.data[tableMeta["rowIndex"]].is_review !== 2 ? "success" : "dark"
                    }
                    title="Duyệt"
                    className="mr-1"
                    onClick={(evt) => this.handleOpenReview(this.state.data[tableMeta["rowIndex"]])}
                    disabled={this.state.data[tableMeta["rowIndex"]].is_review !== 2}
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
                        this.state.data[tableMeta["rowIndex"]].farmous_id,
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
                        this.state.data[tableMeta["rowIndex"]].farmous_id,
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
                        this.state.data[tableMeta["rowIndex"]].farmous_id,
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
                <i className={`fa ${this.state.toggleSearch ? "fa-minus" : "fa-plus"}`} />
              </div>
            )}
          </CardHeader>
          {this.state.toggleSearch && (
            <CardBody className="px-0 py-0">
              <div className="MuiPaper-filter__custom z-index-2">
                <FamousFilter
                  handleSubmit={this.handleSubmitFilter}
                  handlePick={handlePick ? this.handlePickFamous : null}
                />
              </div>
            </CardBody>
          )}
        </Card>

        <Col>
          <Card
            className="animated fadeIn"
            style={{ marginBottom: handlePick ? 0 : "1.5rem", border: "none" }}
          >
            <CardBody className={`py-0 ${!this.props.isOpenNewsList ? "px-0" : ""}`}>
              <div className="MuiPaper-root__custom MuiPaper-user">
                {this.state.isLoading ? (
                  <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                    <CircularProgress />
                  </div>
                ) : (
                  <div>
                    <MUIDataTable data={this.state.data} columns={columns} options={options} />
                    <CustomPagination
                      count={count}
                      rowsPerPage={query.itemsPerPage}
                      page={page}
                      rowsPerPageOptions={handlePick ? [10, 25, 50, 75, 100] : [25, 50, 75, 100]}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
        
      </div>
    );
  }
}

export default News;
