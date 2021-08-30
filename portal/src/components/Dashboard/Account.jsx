import React, { Component } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Row,
  Col
} from 'reactstrap'

// Material
import MUIDataTable from 'mui-datatables'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { CircularProgress } from '@material-ui/core'
import CustomPagination from '../../utils/CustomPaginationCustom'

// Component(s)
import { CheckAccess } from '../../navigation/VerifyAccess'

// Util(s)
import { layoutFullWidthHeight } from '../../utils/html'
import { configTableOptions, configIDRowTable } from '../../utils/index';
// Model(s)
import AccountModel from '../../models/AccountModel'
import UserModel from '../../models/UserModel'
// Set layout full-wh
layoutFullWidthHeight()

/**
 * @class Account
 */
class Account extends Component {
  /**
   * @var {AccountModel}
   */
  _accountModel

  constructor(props) {
    super(props)

    // Init model(s)
    this._accountModel = new AccountModel();
    this._userModel = new UserModel();
    // Bind method(s)
    this.handleMergeDataCustomertype = this.handleMergeDataCustomertype.bind();
  }

  state = {
    isLoading: false,
    page: 0,
    count: 1,
    data: [],
    query: {
      itemsPerPage: 10,
      page: 1,
      // is_active: 1,
    }
  }

  componentDidMount() {
    // Get bundle data
    this.setState({ isLoading: true });
    (async () => {
      let user = await this._userModel.getUserAuth();
      let bundle = await this._getBundleData(user);
      let { data } = bundle;
      let newData = this.handleMergeDataCustomertype(data.items);
      let dataConfig = newData ? newData : [];
      let isLoading = false;
      let count = data ? dataConfig.length : 0;
      let page = 0;
      this.setState({
        isLoading
      }, () => {
        this.setState({
          data: dataConfig,
          count, page,
        });
      })
    })();
    //.end
  }

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData(user) {
    let bundle = {}
    let query = Object.assign(this.state.query, { user: user.user_name})
    let all = [
      // @TODO:
      this._accountModel.getList(query)
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
  getData = (query = {}) => {
    this.setState({ isLoading: true });
    return this._accountModel.getList(query)
      .then(res => {
        let data = res.items;
        let newData = this.handleMergeDataCustomertype(data);
        let isLoading = false;
        let count = newData.length;
        let page = query['page'] - 1 || 0;
        this.setState({
          data: newData, isLoading,
          count, page, query
        })
      })
  }

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: '/account/detail/',
    }
    const route = routes[type]
    if (type.match(/detail/i)) {
      window._$g.rdr(`${route}${id}`)
    } else {
      window._$g.dialogs.prompt(
        'Bạn có chắc chắn muốn xóa dữ liệu đang chọn?',
        'Xóa',
        (confirm) => this.handleClose(confirm, id, rowIndex)
      )
    }
  }

  // handleClose(confirm, id, rowIndex) {
  //   const { data } = this.state
  //   if (confirm) {
  //     this._accountModel.delete(id)
  //       .then(() => {
  //         const cloneData = JSON.parse(JSON.stringify(data))
  //         cloneData.splice(rowIndex, 1)
  //         this.setState({
  //           data: cloneData,
  //         })
  //       })
  //       .catch(() => {
  //         window._$g.dialogs.alert(
  //           window._$g._('Bạn vui lòng chọn dòng dữ liệu cần thao tác!')
  //         )
  //       })
  //   }
  // }

  handleChangeRowsPerPage = (event) => {
    let query = { ...this.state.query };
    query.itemsPerPage = event.target.value;
    query.page = 1;
    this.getData(query);
  }

  handleChangePage = (event, newPage) => {
    let query = { ...this.state.query };
    query.page = newPage + 1;
    this.getData(query);
  }

  handleMergeDataCustomertype(data) {
    let newData = [];
    data.length > 1 ? data.reduce((value, nextValue) => {
      if (value.member_id === nextValue.member_id) {
        nextValue.customer_type_name += ", " + value.customer_type_name
        data.indexOf(nextValue) === data.length - 1 && newData.push(nextValue)
      } else {
        newData.push(value)
        if(data.indexOf(nextValue) === data.length - 1) {
          newData.push(nextValue)
        }
      }
      return nextValue
    }) : (newData = data)
    return newData
  }

  render() {
    const {
      data, count, page, query, careDataLeadsItems
    } = this.state;
    const options = configTableOptions(count, page, query);
    const columns = [
      configIDRowTable("member_id", "/account/detail/", this.state.query),
      {
        name: "status_data_leads_name",
        label: "Status",
        options: {
          display: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className={`color-overlay `}>
                {value}
              </div>
            )
          }
        }
      },
      {
        name: "customer_code",
        label: "Mã khách hàng",
        options: {
          filter: false,
          sort: true,
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
              <div className={`color-overlay `}>
                {value}
              </div>
            )
          }
        }
      },

      {
        name: "full_name",
        label: "Tên khách hàng",
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
              <div className={`color-overlay `}>
                {value}
              </div>
            )
          }
        }
      },
      {
        name: "email",
        label: "Email",
        options: {
          display: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className={`color-overlay `}>
                {value}
              </div>
            )
          }
        }
      },
      {
        name: "customer_type_name",
        label: "Loại khách hàng",
        options: {
          filter: true,
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
              <div className={`color-overlay `}>
                {value}
              </div>
            )
          }
        }
      },
      // {
      //   name: "customer_company_name",
      //   label: "Công ty khách hàng",
      //   options: {
      //     filter: true,
      //     sort: false,
      //     customHeadRender: (columnMeta, handleToggleColumn) => {
      //       return (
      //         <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
      //           <div className="text-center">
      //             {columnMeta.label}
      //           </div>
      //         </th>
      //       )
      //     },
      //     customBodyRender: (value, tableMeta, updateValue) => {
      //       return (
      //         <div className={`color-overlay`}>
      //           {value}
      //         </div>
      //       )
      //     }
      //   }
      // },
      {
        name: "gender",
        label: "Giới tính",
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
              <div className={`text-center color-overlay`}>
                {value === 1 ? "Nam" : value === 0 ? "Nữ" : "Khác"}
              </div>
            );
          }
        }
      },
      {
        name: "birth_day",
        label: "Ngày sinh",
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
              <div className={`color-overlay `}>
                {value}
              </div>
            )
          }
        }
      },
      {
        name: "phone_number",
        label: "Số điện thoại",
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
              <div className={`color-overlay `}>
                {value}
              </div>
            )
          }
        }
      },
      {
        name: "address_full",
        label: "Địa chỉ",
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
              <div className={`color-overlay`}>
                {value}
              </div>
            )
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
                {value? "Có": "Không"}
              </div>
            )
          }
        },
      },
      // {
      //   name: "Thao tác",
      //   options: {
      //     filter: false,
      //     sort: false,
      //     empty: true,
      //     customBodyRender: (value, tableMeta, updateValue) => {
      //       return (
      //         <div className={`text-center color-overlay `}>
      //           <Button color="warning" title="Chi tiết" className="mr-1" onClick={evt => this.handleActionItemClick('detail', this.state.data[tableMeta['rowIndex']].member_id, tableMeta['rowIndex'])}>
      //             <i className="fa fa-info" />
      //           </Button>
      //         </div>
      //       );
      //     }
      //   }
      // },
    ]

    return (
      <Row>
        <Col sm={12}>
          <Card className="animated fadeIn">
            <CardHeader className="d-flex">
              <div className="flex-fill font-weight-bold" style={{ textTransform: 'none' }}>
                Danh sách khách hàng
            </div>
            </CardHeader>
            <CardBody className="px-0 py-0">
              <div className="MuiPaper-root__custom">
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
        </Col>
      </Row>
    )
  }
}

export default Account
