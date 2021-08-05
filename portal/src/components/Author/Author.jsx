import React, { PureComponent } from 'react'
import { Card, CardBody, CardHeader, Button } from 'reactstrap'

// Material
import MUIDataTable from 'mui-datatables'
import { CircularProgress } from '@material-ui/core'
import CustomPagination from '../../utils/CustomPagination';

// Component(s)
import { CheckAccess } from '../../navigation/VerifyAccess';
import AuthorFilter from './AuthorFilter'

// Util(s)
// import { layoutFullWidthHeight } from '../../utils/html'
import { configTableOptions, configIDRowTable } from '../../utils/index'
// Model(s)
import AuthorModel from '../../models/AuthorModel'
import NewsCategoryModel from '../../models/NewsCategoryModel';
import { mapDataOptions4Select } from '../../utils/html';

// Set layout full-wh
// layoutFullWidthHeight()

import './styles.scss'
/**
 * @class Author
 */
class Author extends PureComponent {
  /**
   * @var {AuthorModel}
   */
  _authorModel

  constructor(props) {
    super(props)

    // Init model(s)
    this._authorModel = new AuthorModel()
    this._newsCategoryModel = new NewsCategoryModel();
    // Bind method(s)
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
    isOpenSnackbar: false,
    snackbarMsg: '',
    snackBarClss: 'info',
    newsCategoryOpts: [],
  }

  componentDidMount() {
    // Get bundle data
    this.setState({ isLoading: true });
    (async () => {
      let bundle = await this._getBundleData();
      let { data = {} } = bundle;   
      let authors = data.items || [];
      let isLoading = false;
      let count = data.totalItems;
      let page = 0
      this.setState({
        isLoading
      }, () => {
        this.setState({
          ...bundle,
          data: authors,
          count, page
        });
      })
    })();
    //.end
  }

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let bundle = {}
    let all = [
      // @TODO:
      this._authorModel.getList()
        .then(data => (bundle['data'] = data)),
      this._newsCategoryModel.getOptionsForAuthorPost({is_author_post: 1, is_active: 1})
        .then(data => (bundle['newsCategoryOpts'] = mapDataOptions4Select(data)))
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
    return this._authorModel.getList(query)
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
    window._$g.rdr('/author/add')
  }

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: '/author/detail/',
      delete: '/author/delete/',
      edit: '/author/edit/',
      changePassword: '/author/change-password/',
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
      this._authorModel.delete(id)
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

  handleSubmitFilter = (search, is_active, news_category_id) => {
    let query = {...this.state.query}
    query.page = 1
    query = Object.assign(query, {search, is_active, news_category_id})
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
      configIDRowTable("author_id", "/author/detail/", this.state.query),
      {
        name: "author_name",
        label: "ID tác giả",
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
        name: "full_name",
        label: "Họ và tên",
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
        name: "nickname",
        label: " Biệt danh",
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
        name: "phone_number",
        label: "Điện thoại",
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
        name: "email",
        label: "Email",
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
                {/* <Button color="warning" title="Chi tiết" className="mr-1" onClick={evt => this.handleActionItemClick('detail', this.state.data[tableMeta['rowIndex']].author_id, tableMeta['rowIndex'])}>
                  <i className="fa fa-info" />
                </Button> */}
                <CheckAccess permission="CRM_AUTHOR_EDIT">
                  <Button color="primary" title="Chỉnh sửa" className="mr-1" onClick={evt => this.handleActionItemClick('edit', this.state.data[tableMeta['rowIndex']].author_id, tableMeta['rowIndex'])}>
                    <i className="fa fa-edit" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="CRM_AUTHOR_PASSWORD">
                  <Button color="success" title="Thay đổi mật khẩu" className="mr-1" onClick={evt => this.handleActionItemClick('changePassword', this.state.data[tableMeta['rowIndex']].author_id, tableMeta['rowIndex'])}>
                  <i className="fa fa-lock"></i>
                  </Button>
                </CheckAccess>
                <CheckAccess permission="CRM_AUTHOR_DEL">
                  <Button color="danger" title="Xóa" className="" onClick={evt => this.handleActionItemClick('delete', this.state.data[tableMeta['rowIndex']].author_id, tableMeta['rowIndex'])}>
                    <i className="fa fa-trash" />
                  </Button>
                </CheckAccess>
              </div>
            );
          }
        }
      },
    ]

    const {count, page, query, newsCategoryOpts} = this.state;
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
                <AuthorFilter
                  newsCategoryOpts={newsCategoryOpts}
                  handleSubmit={this.handleSubmitFilter}
                />
              </div>
            </CardBody>
          )}
        </Card>
        <CheckAccess permission="CRM_AUTHOR_ADD">
          <Button className="col-12 max-w-110 mb-3 mobile-reset-width" onClick={() => this.handleClickAdd()} color="success" size="sm">
            <i className="fa fa-plus" />
            <span className="ml-1">Thêm mới</span>
          </Button>
        </CheckAccess>
        <Card className="animated fadeIn">
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-root__custom MuiPaper-author">
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

export default Author
