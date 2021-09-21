import React, { Component } from "react";
import { Card, CardBody, CardHeader, Button, Col, FormGroup } from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import SearchHistoryFillter from "./SearchHistoryFillter";
// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions, configIDRowTable } from "../../utils/index";
// Model(s)
import SearchHistoryModel from "../../models/SearchHistoryModel";
import SearchHistoryDetail from "./SearchHistoryDetail";

// Set layout full-wh
layoutFullWidthHeight();

/**
 * @class SearchHistory
 */
class SearchHistory extends Component {
  /**
   * @var {Partner}
   */
  _partnerModel;

  constructor(props) {
    super(props);

    // Init model(s)
    this._searchHistoryModel = new SearchHistoryModel();

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
      is_active: 1,
    },
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
      this.setState(
        {
          isLoading,
        },
        () => {
          this.setState({
            data: dataConfig,
            count,
            page,
          });
        }
      );
    })();
    //.end
  }

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let bundle = {};
    let all = [
      // @TODO:
      this._searchHistoryModel.getList(this.state.query).then((data) => (bundle["data"] = data)),
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
    return this._searchHistoryModel.getList(query).then((res) => {
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
    window._$g.rdr("/search-history/add");
  };

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: "/search-history/detail/",
      delete: "/search-history/delete/",
    };
    const route = routes[type];
    if (type.match(/detail/i)) {
      this.props.history.push(`${route}${id}`, this.state.data[rowIndex].search_date);
    } else {
      window._$g.dialogs.prompt("Bạn có chắc chắn muốn xóa dữ liệu đang chọn?", "Xóa", (confirm) =>
        this.handleClose(confirm, id, rowIndex)
      );
    }
  }

  handleClose(confirm, id, rowIndex) {
    const { data } = this.state;
    let search_date = this.state.data[rowIndex].search_date
    if (confirm) {
      this._searchHistoryModel
        .delete(id, {search_date})
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

  handleSubmitFilter = (search, is_active, start_date, end_date) => {
    let query = { ...this.state.query };
    query.page = 1;
    query = Object.assign(query, {
      search,
      is_active,
      start_date,
      end_date,
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

  SearchHistoryDetailMember = (member_id, search_date) => {
    this.props.history.push({
      pathname: `${"/search-history/detail/"}${member_id}`,
      state: search_date,
    });
  };

  render() {
    const columns = [
      // configIDRowTable("member_id", "/search-history/detail/", this.state.query),
      {
        name: "",
        label: "STT",
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
            let indx = this.state.data.indexOf(this.state.data[tableMeta["rowIndex"]]);
            return (
              <div>
                <div
                  className="text-center"
                  style={{ cursor: "pointer", color: "#20a8d8" }}
                  onClick={() =>
                    this.SearchHistoryDetailMember(
                      this.state.data[tableMeta["rowIndex"]].member_id,
                      this.state.data[tableMeta["rowIndex"]].search_date
                    )
                  }
                >
                  {indx + 1}
                </div>
              </div>
            );
          },
        },
      },
      {
        name: "full_name",
        label: "Tên khách hàng",
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
            return <div className="text-left">{value}</div>;
          },
        },
      },
      {
        name: "product_name",
        label: "Tên sản phẩm",
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
            return <div className="text-left">{value}</div>;
          },
        },
      },
      {
        name: "search_count",
        label: "Số lần tra cứu",
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
        name: "search_date",
        label: "Ngày tra cứu ",
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
            return (
              <div className="text-center">
                <Button
                  color="warning"
                  title="Chi tiết"
                  className="mr-1"
                  onClick={(evt) =>
                    this.handleActionItemClick(
                      "detail",
                      this.state.data[tableMeta["rowIndex"]].member_id,
                      tableMeta["rowIndex"]
                    )
                  }
                >
                  <i className="fa fa-info" />
                </Button>
                <CheckAccess permission="CUS_SEARCHHISTORY_DEL">
                  <Button
                    color="danger"
                    title="Xóa"
                    className=""
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "delete",
                        this.state.data[tableMeta["rowIndex"]].member_id,
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
    const options = configTableOptions(count, page, query);

    return (
      <div>
        <Card className="animated fadeIn z-index-222 mb-3">
          <CardHeader className="d-flex">
            <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
            <div
              className="minimize-icon cur-pointer"
              onClick={() =>
                this.setState((prevState) => ({
                  toggleSearch: !prevState.toggleSearch,
                }))
              }
            >
              <i className={`fa ${this.state.toggleSearch ? "fa-minus" : "fa-plus"}`} />
            </div>
          </CardHeader>
          {this.state.toggleSearch && (
            <CardBody className="px-0 py-0">
              <div className="MuiPaper-filter__custom z-index-2">
                <SearchHistoryFillter handleSubmit={this.handleSubmitFilter} />
              </div>
            </CardBody>
          )}
        </Card>
        <Card className="animated fadeIn">
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-root__custom">
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
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default SearchHistory;
