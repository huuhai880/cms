import React, { Component } from "react";
import { Card, CardBody, CardHeader, Button, Badge } from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import FaqFilter from "./FaqFilter";
// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions, configIDRowTable } from "../../utils/index";
// Model(s)
import { RowAction } from "@widget";
import { fnGet, fnUpdate, fnDelete } from "@utils/api";

// Set layout full-wh
layoutFullWidthHeight();

/**
 * @class Faq
 */
class Faq extends Component {
  constructor(props) {
    super(props);
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
      faq_type: null,
    },
  };

  componentDidMount() {
    // Get bundle data
    this.setState({ isLoading: true });
    (async () => {
      let bundle = await this._getBundleData();
      let { data } = bundle;
      let dataConfig = data ? data.items : [];
      let faqType = dataConfig.faq_type;
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
   * Goi API, lay toan bo data lien quan
   */
  async _getBundleData() {
    try {
      const [data] = await Promise.all([
        fnGet({ url: "faq", query: this.state.query }),
      ]);
      return { data };
    } catch (err) {
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => {
          window.location.reload();
        }
      );
      console.log("error");
    }
  }

  // get data
  getData = (query = {}) => {
    this.setState({ isLoading: true });
    return fnGet({ url: "faq", query }).then((res) => {
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
    window._$g.rdr("/faq/add");
  };

  handleClose(confirm, id, rowIndex) {
    const { data } = this.state;
    if (confirm) {
      fnDelete({ url: `faq/${id}` })
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

  handleSubmitFilter = (search, is_active, faq_type) => {
    let query = { ...this.state.query };
    query.page = 1;
    query = Object.assign(query, { search, is_active, faq_type });
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

  render() {
    const columns = [
      configIDRowTable("faq_id", "/faq/detail/", this.state.query),
      {
        name: "question",
        label: "Câu hỏi",
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
        name: "answer",
        label: "Trả lời",
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
        name: "faq_type",
        label: "Phân loại",
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
            let newValue = "";
            if (value === 1) {
              newValue = "Góc tác giả";
            } else if (value === 2) {
              newValue = "Góc nhà sản xuất";
            }
            return <div>{newValue}</div>;
          },
        },
      },
      {
        name: "order_index",
        label: "Thứ tự",
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
              <RowAction
                data={this.state.data}
                updateData={(data) => this.setState({ data })}
                tableMeta={tableMeta}
                fieldName="faq_id"
                editPermission="MD_FAQ_EDIT"
                deletePermission="MD_FAQ_DEL"
                // detailLink="/faq/detail/"
                editLink="/faq/edit/"
                deleteLink="/faq/"
              />
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
              <i
                className={`fa ${
                  this.state.toggleSearch ? "fa-minus" : "fa-plus"
                }`}
              />
            </div>
          </CardHeader>
          {this.state.toggleSearch && (
            <CardBody className="px-0 py-0">
              <div className="MuiPaper-filter__custom z-index-2">
                <FaqFilter handleSubmit={this.handleSubmitFilter} />
              </div>
            </CardBody>
          )}
        </Card>
        <div>
          <CheckAccess permission="MD_Faq_ADD">
            <Button
              className="col-12 max-w-110 mb-2 mobile-reset-width mr-2"
              onClick={() => this.handleClickAdd()}
              color="success"
              size="sm"
            >
              <i className="fa fa-plus mr-1" />
              Thêm mới
            </Button>
          </CheckAccess>
          {/* <CheckAccess permission="MD_Faq_EXPORT">
            <Button className="col-12 max-w-110 mb-2 mobile-reset-width" color="excel"  size="sm">
              <i className="fa fa-download mr-1" />Xuất excel
            </Button>
          </CheckAccess> */}
        </div>
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

export default Faq;
