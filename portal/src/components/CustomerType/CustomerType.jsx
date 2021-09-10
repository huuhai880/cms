import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  FormGroup,
  Col,
  CustomInput,
} from "reactstrap";

// Assets

// Material
import MUIDataTable from "mui-datatables";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { CircularProgress, Checkbox } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import CustomerTypeFilter from "./CustomerTypeFilter";

// Util(s)
import { configTableOptions, configIDRowTable } from "../../utils/index";

// Model(s)
import CustomerTypeModel from "../../models/CustomerTypeModel";
import CompanyModel from "../../models/CompanyModel";
import BusinessModel from "../../models/BusinessModel";

/** @var {Object} */
const userAuth = window._$g.userAuth;

/**
 * @class CustomerType
 */
class CustomerType extends Component {
  _customerTypeModel;

  constructor(props) {
    super(props);

    // Init model(s)
    this._customerTypeModel = new CustomerTypeModel();
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
      is_default: 2,
      is_active: 1,
    },
    _pickDataItems: {},
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

      const _pickDataItems = this.props.customerTypes
        ? (this.props.customerTypes || []).reduce((obj, item) => {
            obj[item.customer_type_id] = item;
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
    //.end
  }

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let bundle = {};
    let all = [
      // @TODO:
      this._customerTypeModel
        .getList(this.state.query)
        .then((data) => (bundle["data"] = data)),
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
    return this._customerTypeModel.getList(query).then((res) => {
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
    window._$g.rdr("/customer-type/add");
  };

  handleChangeStatus = (status, id, rowIndex) => {
    window._$g.dialogs.prompt(
      "Bạn có chắc chắn muốn thay đổi trạng thái dữ liệu đang chọn?",
      "Cập nhật",
      (confirm) => this.onChangeStatus(confirm, status, id, rowIndex)
    );
  };

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: "/customer-type/detail/",
      delete: "/customer-type/delete/",
      edit: "/customer-type/edit/",
    };
    const route = routes[type];
    if (type.match(/detail|edit/i)) {
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
      this._customerTypeModel
        .delete(id)
        .then(() => {
          const cloneData = JSON.parse(JSON.stringify(data));
          cloneData.splice(rowIndex, 1);
          cloneData[0].is_default = 1
          const count = cloneData.length;
          this.setState({
            data: cloneData,
            count,
          });
        })
        .catch(() => {
          window._$g.dialogs.alert(
            window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
          );
        });
    }
  }

  handleSubmitFilter = (data) => {
    let query = { ...this.state.query };
    query = Object.assign(query, { ...data });
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

  handlePickCustomerType = () => {
    const { handlePick } = this.props;
    if (handlePick) {
      handlePick(this.state._pickDataItems);
    }
  };

  render() {
    let { handlePick } = this.props;

    const columns = [
      configIDRowTable(
        "customer_type_id",
        "/customer-type/detail/",
        this.state.query
      ),
      {
        name: "customer_type_name",
        label: "Tên loại khách hàng",
        options: {
          filter: false,
          sort: false,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
                style={{ width: "30%" }}
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
        name: "description",
        label: "Mô tả",
        options: {
          filter: false,
          sort: false,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
                style={{ width: "30%" }}
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
                style={{ width: "10%" }}
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
        name: "is_default",
        label: "Mặc định",
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
                <CustomInput type="checkbox" checked={value} />
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
                    checked={!!_pickDataItems[item.customer_type_id]}
                    onChange={({ target }) => {
                      if (target.checked) {
                        _pickDataItems[item.customer_type_id] = item;
                      } else {
                        delete _pickDataItems[item.customer_type_id];
                      }
                      this.setState({ _pickDataItems });
                    }}
                  />
                </div>
              );
            }

            return (
              <div className="text-center">
                <CheckAccess permission="CRM_CUSTOMERTYPE_EDIT">
                  <Button
                    color="primary"
                    title="Chỉnh sửa"
                    className="mr-1"
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "edit",
                        this.state.data[tableMeta["rowIndex"]].customer_type_id,
                        tableMeta["rowIndex"]
                      )
                    }
                  >
                    <i className="fa fa-edit" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="CRM_CUSTOMERTYPE_DEL">
                  <Button
                    color="danger"
                    title="Xóa"
                    className=""
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "delete",
                        this.state.data[tableMeta["rowIndex"]].customer_type_id,
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
        <Card
          className={`animated fadeIn z-index-222 mb-3 ${
            handlePick ? "news-header-no-border" : ""
          }`}
        >
          <CardHeader
            className="d-flex"
            style={{
              padding: handlePick ? "0.55rem" : "0.55rem 1.25rem",
              alignItems: handlePick ? "center" : "unset",
            }}
          >
            <div className="flex-fill font-weight-bold">
              {handlePick ? "Thêm Loại khách hàng" : "Thông tin tìm kiếm"}
            </div>
            {handlePick ? (
              <Button color="danger" size="md" onClick={() => handlePick({})}>
                <i className={`fa fa-remove`} />
              </Button>
            ) : (
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
            )}
          </CardHeader>
          {this.state.toggleSearch && (
            <CardBody className="px-0 py-0">
              <div className="MuiPaper-filter__custom z-index-2">
                <CustomerTypeFilter
                  customertypegroup={this.state.customertypegroup}
                  customertype={this.state.customertype}
                  businessArr={this.state.business}
                  companyArr={this.state.company}
                  handleSubmit={this.handleSubmitFilter}
                  {...this.props.filterProps}
                  handlePick={handlePick ? this.handlePickCustomerType : null}
                />
              </div>
            </CardBody>
          )}
        </Card>
        {!handlePick && (
          <Col
            xs={12}
            sm={4}
            className="d-flex align-items-end mb-3"
            style={{ padding: 0 }}
          >
            <CheckAccess permission="CRM_CUSTOMERTYPE_ADD">
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
      </div>
    );
  }
}

export default CustomerType;
