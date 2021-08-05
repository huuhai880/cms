import React, { PureComponent } from 'react'
import { Card, CardBody, CardHeader, Button } from 'reactstrap'

import MUIDataTable from 'mui-datatables'
import { CircularProgress } from '@material-ui/core'
import CustomPagination from '../../utils/CustomPagination';

import { CheckAccess } from '../../navigation/VerifyAccess';
import PlanFilter from './PlanFilter'

import { configTableOptions, configIDRowTable } from '../../utils/index'

import PlanModel from '../../models/PlanModel'
import PlanCategoryModel from '../../models/PlanCategoryModel'
import { mapDataOptions4Select } from '../../utils/html';

class Plan extends PureComponent {

  constructor(props) {
    super(props)
    this._planModel = new PlanModel();
    this._planCategoryModel = new PlanCategoryModel();
  }

  state = {
    toggleSearch: true,
    page: 0,
    count: 1,
    data: [],
    query: {
      itemsPerPage: 25,
      page: 1,
      is_active: 1
    },
    isLoading: false,
    planCategoryOptions: [
      {label:'Tất cả', value: null}
    ]
  }

  componentDidMount() {
    // Get bundle data
    this.setState({ isLoading: true });
    (async () => {
      let bundle = await this._getBundleData();
      let { data = {} } = bundle;   
      let plans = data.items || [];
      let isLoading = false;
      let count = data.totalItems;
      let page = 0
      let {planCategoryOptions} = this.state;

      if(bundle.planCategoryOptions){
        planCategoryOptions = planCategoryOptions.concat(bundle.planCategoryOptions)
      }
      
      this.setState({
        isLoading
      }, () => {
        this.setState({
          ...bundle,
          data: plans,
          count, page,
          planCategoryOptions
        });
      })
    })();
    //.end
  }

  async _getBundleData() {
    let bundle = {}
    let all = [
      this._planCategoryModel.getOptionParentList({ is_active: 1 })
        .then(data => (bundle['planCategoryOptions'] = mapDataOptions4Select(data))),
      this._planModel.getList()
        .then(data => (bundle['data'] = data))
    ]
    await Promise.all(all)
      .catch(err => {
        window._$g.dialogs.alert(
          window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
          () => {
            window.location.reload();
          }
        )
      })
    return bundle
  }

  // get data
  getData = ( query = {} ) => {
    this.setState({ isLoading: true });
    return this._planModel.getList(query)
    .then(res => {
      let data = res.items;
      let isLoading = false;
      let count = res.totalItems;
      let page = query['page'] -1 || 0;
      this.setState({
        data, isLoading,
        count, page, query
      })
    })
  }

  handleClickAdd = () => {
    window._$g.rdr('/plan/add')
  }

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: '/plan/detail/',
      delete: '/plan/delete/',
      edit: '/plan/edit/',
    }
    const route = routes[type]
    if (type.match(/detail|edit/i)) {
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
      this._planModel.delete(id)
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

  handleSubmitFilter = (search, is_active, plan_category_id) => {
    let query = {...this.state.query}
    query.page = 1
    query = Object.assign(query, {search, is_active, plan_category_id})
    this.getData(query)
    .catch(() => {
      window._$g.dialogs.alert(
        window._$g._('Bạn vui lòng chọn dòng dữ liệu cần thao tác!')
      )
    })
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

  render() {
    const columns = [
      configIDRowTable("plan_id", "/plan/detail/", this.state.query),
      {
        name: "plan_title",
        label: "Tên dự án",
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
              <div className="text-left">
                {value}
              </div>
            );
          }
        }
      },    
      {
        name: "plan_category_name",
        label: "Thuộc dự án",
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
              <div className="text-left">
                {value}
              </div>
            );
          }
        }
      },
      
      {
        name: "created_user",
        label: "Nguời tạo",
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
          }
        }
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
        }
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
                {value?'Có':'Không'}
              </div>
            );
          }
        }
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
                    <div className="text-center">
                        {columnMeta.label}
                    </div>
                </th>
            )
        },
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="text-center">
                <CheckAccess permission="MD_PLAN_EDIT">
                  <Button color="primary" title="Chỉnh sửa" className="mr-1" onClick={evt => this.handleActionItemClick('edit', this.state.data[tableMeta['rowIndex']].plan_id, tableMeta['rowIndex'])}>
                    <i className="fa fa-edit" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="MD_PLAN_DEL">
                  <Button color="danger" title="Xóa" className="" onClick={evt => this.handleActionItemClick('delete', this.state.data[tableMeta['rowIndex']].plan_id, tableMeta['rowIndex'])}>
                    <i className="fa fa-trash" />
                  </Button>
                </CheckAccess>
              </div>
            );
          }
        }
      },
    ]

    const {count, page, query} = this.state;
    const options = configTableOptions(count, page, query)
    return (
      <div>
        <Card className="animated fadeIn z-index-222 mb-3">
          <CardHeader className="d-flex">
            <div className="flex-fill font-weight-bold">
              Thông tin tìm kiếm
            </div>
            <div
              className="minimize-icon cur-pointer"
              onClick={() => this.setState(prevState => ({
                toggleSearch: !prevState.toggleSearch
              }))}
            >
              <i className={`fa ${this.state.toggleSearch ? 'fa-minus' : 'fa-plus'}`} />
            </div>
          </CardHeader>
          {this.state.toggleSearch && (
            <CardBody className="px-0 py-0">
              <div className="MuiPaper-filter__custom z-index-2">
                <PlanFilter
                  planCategoryOptions={this.state.planCategoryOptions}
                  handleSubmit={this.handleSubmitFilter}
                />
              </div>
            </CardBody>
          )}
        </Card>
        <CheckAccess permission="MD_PLAN_ADD">
          <Button className="col-12 max-w-110 mb-3 mobile-reset-width" onClick={() => this.handleClickAdd()} color="success" size="sm">
            <i className="fa fa-plus" />
            <span className="ml-1">Thêm mới</span>
          </Button>
        </CheckAccess>
        <Card className="animated fadeIn">
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-root__custom MuiPaper-user">
              {this.state.isLoading
                ? (
                  <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                    <CircularProgress />
                  </div>
                )
                : (
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
                )
              }
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default Plan
