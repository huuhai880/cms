import React, { Component } from "react";
import { Card, CardBody, CardHeader, Button } from "reactstrap";
import MUIDataTable from "mui-datatables";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";
//Components
import { CheckAccess } from "../../navigation/VerifyAccess";
import PlanCategoryFilter from "./PlanCategoryFilter";
//utils
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions, configIDRowTable } from "../../utils/index";
import { mapDataOptions4Select } from '../../utils/html';
//Model
import PlanCategoryModel from "../../models/PlanCategoryModel";

layoutFullWidthHeight();

class NewsCategory extends Component {
  _planCategoryModel;

  constructor(props) {
    super(props);
    this._planCategoryModel = new PlanCategoryModel()
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
      is_active: 1
    },
    parentList:[]
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    (async () => {
      let bundle = await this._getBundleData();
      let { data } = bundle;
      let dataConfig = data ? data.items : [];
      let isLoading = false;
      let count = data ? data.totalItems : 0;
      let page = 0;
      let {parentList} = this.state;
      parentList = parentList.concat(bundle.parentList || []);
      this.setState({isLoading},() => {
          this.setState({
            data: dataConfig,
            parentList,
            count,
            page
          });
        }
      );
    })();
  }

  async _getBundleData() {
    let bundle = {};
    let all = [
      this._planCategoryModel
        .getList(this.state.query)
        .then(data =>{
          return(bundle["data"] = data)
        } ),
      this._planCategoryModel.getOptionParentList({ is_active: 1 })
      .then(data => (bundle['parentList'] = mapDataOptions4Select(data)))
    ];
    await Promise.all(all).catch(err => {
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => {
          window.location.reload();
        }
      )
    });
    bundle.parentList = bundle.parentList.filter(Boolean)
    return bundle;
  }

  // get data
  getData = ( query = {} ) => {
    this.setState({ isLoading: true });
    return this._planCategoryModel.getList(query)
    .then(res => {
      let data = res.items;
      let isLoading = false;
      let count = res.totalItems;
      let page = query['page'] - 1 || 0;
      this.setState({
        data, isLoading,
        count, page, query
      })
    })
  }

  handleSubmitFilter = (search, is_active, create_date_from, create_date_to) => {
    let query = { ...this.state.query };
    query.page = 1;
    query = Object.assign(query, { search, is_active, create_date_from, create_date_to});
    this.getData(query).catch(() => {
      window._$g.dialogs.alert(
        window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
      );
    });
  };

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: '/plan-category/detail/',
      delete: '/plan-category/delete/',
      edit: '/plan-category/edit/',
    }
    const route = routes[type]
    if (type.match(/detail|edit|changePassword/i)) {
      window._$g.rdr(`${route}${id}`)
    } else {
      window._$g.dialogs.prompt(
        'Bạn có chắc chắn muốn xóa dữ liệu đang chọn?',
        'Xóa',
        (confirm) => this.handleClose(confirm, id, rowIndex)
      )
    }
  }

  handleClose(confirm, id, rowIndex) {
    const { data } = this.state
    if (confirm) {
      this._planCategoryModel.delete(id)
      .then(() => {
        const cloneData = JSON.parse(JSON.stringify(data))
        cloneData.splice(rowIndex, 1)
        this.setState({
          data: cloneData,
        })
      })
      .catch(() => {
        window._$g.dialogs.alert(
          window._$g._('Bạn vui lòng chọn dòng dữ liệu cần thao tác!')
        )
      })
    }
  }

  handleChangeRowsPerPage = (event ) => {
    let query = {...this.state.query};
    query.itemsPerPage = event.target.value;
    query.page = 1;
    this.getData(query);
  }

  handleChangePage = (event, newPage) => {
    let query = {...this.state.query};
    query.page = newPage + 1;
    this.getData(query);
  }

  handleClickAdd = () => {
    window._$g.rdr("/plan-category/add");
  };

  render() {
    const {count, page, query} = this.state;
    const options = configTableOptions(count, page, query)
    const columns = [
      configIDRowTable("plan_category_id", "/plan-category/detail/", this.state.query),
      {
        name: "category_name",
        label: "Tên danh mục",
        options: {
          filter: false,
          sort: false,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                <div className="text-center">
                  {columnMeta.label}
                </div>
              </th>
            )
          },
        }
      },
      {
        name: "created_user",
        label: "Người tạo",
        options: {
          filter: false,
          sort: false,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                <div className="text-center">
                  {columnMeta.label}
                </div>
              </th>
            )
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
              <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                <div className="text-center">
                  {columnMeta.label}
                </div>
              </th>
            )
          },
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="text-center">
                {value}
              </div>
            );
          }
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
              <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                <div className="text-center">
                  {columnMeta.label}
                </div>
              </th>
            )
          },
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="text-center">
                {value ? "Có" : "Không"}
              </div>
            );
          }
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
                <CheckAccess permission="MD_PLANCATEGORY_EDIT">
                  <Button color="primary" title="Chỉnh sửa" className="mr-1" onClick={evt => this.handleActionItemClick('edit', this.state.data[tableMeta['rowIndex']].plan_category_id, tableMeta['rowIndex'])}>
                    <i className="fa fa-edit" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="MD_PLANCATEGORY_DEL">
                  <Button color="danger" title="Xóa" className="" onClick={evt => this.handleActionItemClick('delete', this.state.data[tableMeta['rowIndex']].plan_category_id, tableMeta['rowIndex'])}>
                    <i className="fa fa-trash" />
                  </Button>
                </CheckAccess>
              </div>
            );
          }
        }
      },
    ]

    return (
      <div>
        <Card className="animated fadeIn z-index-222 mb-3">
          <CardHeader className="d-flex">
            <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
            <div
              className="minimize-icon cur-pointer"
              onClick={() =>
                this.setState(prevState => ({
                  toggleSearch: !prevState.toggleSearch
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
                <PlanCategoryFilter handleSubmit={this.handleSubmitFilter} parentList={this.state.parentList}/>
              </div>
            </CardBody>
          )}
        </Card>
        <div>
          <CheckAccess permission="MD_PLANCATEGORY_ADD">
            <Button
              className="col-12 max-w-110 mb-2 mobile-reset-width mr-2"
              color="success"
              size="sm"
              onClick={this.handleClickAdd}
            >
              <i className="fa fa-plus mr-1" />
              Thêm mới
            </Button>
          </CheckAccess>
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

export default NewsCategory;
