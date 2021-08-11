import React, { Component } from "react";
import { Card, CardBody, Button } from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress, Checkbox } from "@material-ui/core";
import CustomPagination from "@utils/CustomPagination";

// Component(s)
import { CheckAccess } from "@navigation/VerifyAccess";

// Util(s)
import { configTableOptions, configIDRowTable } from "@utils/index";
import { PageFilter } from "@widget";
import { fnGet, fnDelete } from "@utils/api";

/**
 * @class Products
 */
class PublishingCompany extends Component {
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
      url: "publishing-company",
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
    if (type === "edit") {
      window._$g.rdr(`/publishing-company/edit/${id}`);
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
      fnDelete({ url: `publishing-company/${id}` })
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

  render() {
    let { handlePick } = this.props;

    const columns = [
      configIDRowTable(
        "publishing_company_id",
        "/publishing-company/detail/",
        this.state.query
      ),
      {
        name: "publishing_company_name",
        label: "Tên nhà xuất bản",
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
        name: "created_user",
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
          customBodyRender: (value) => {
            return <div className="text-center">{value}</div>;
          },
        },
      },
      {
        name: "created_date",
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
          customBodyRender: (value) => {
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
                <CheckAccess permission="MD_PUBLISHINGCOMPANY_EDIT">
                  <Button
                    color="primary"
                    title="Chỉnh sửa"
                    className="mr-1"
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "edit",
                        this.state.data[tableMeta["rowIndex"]]
                          .publishing_company_id,
                        tableMeta["rowIndex"]
                      )
                    }
                    disabled={this.state.data[tableMeta["rowIndex"]].edit === 0}
                  >
                    <i className="fa fa-edit" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="MD_PUBLISHINGCOMPANY_DEL">
                  <Button
                    color="danger"
                    title="Xóa"
                    className=""
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "delete",
                        this.state.data[tableMeta["rowIndex"]]
                          .publishing_company_id,
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
              sm: 6,
              defaultValue: query.keyword,
              placeholder: "Nhập tên nhà xuất bản",
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
              sm: 6,
              defaultValue: query.is_active,
            },
          ]}
          handleSubmit={(value) => this.handleFilter(value)}
        />
        {handlePick ? (
          <div className="text-right mb-1">
            <Button
              color="success"
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
        {!handlePick ? (
          <div>
            <CheckAccess permission="MD_PUBLISHINGCOMPANY_ADD">
              <Button
                className="col-12 max-w-110 mb-2 mobile-reset-width mr-2"
                onClick={() => this.handleClickAdd()}
                color="success"
              >
                <i className="fa fa-plus mr-1" />
                Thêm mới
              </Button>
            </CheckAccess>
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
      </div>
    );
  }
}

export default PublishingCompany;
