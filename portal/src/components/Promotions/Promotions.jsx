import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Button, Row, Col, Label, Input } from 'reactstrap'

// Material
import MUIDataTable from 'mui-datatables'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { CircularProgress, Checkbox } from '@material-ui/core'
import CustomPagination from '../../utils/CustomPagination'

// Assets
import './styles.scss'

// Component(s)
import { CheckAccess } from '../../navigation/VerifyAccess'
import PromotionFilter from './PromotionFilter'
// Util(s)
// import {} from '../../utils/html'
import { configTableOptions, configIDRowTable } from '../../utils/index';
// Model(s)
import PromotionModel from '../../models/PromotionModel';
import CompanyModel from '../../models/CompanyModel';

/** @var {Object} */
const userAuth = window._$g.userAuth;

/**
 * @class Promotions
 */
class Promotions extends Component {
  /**
   * @var {PromotionModel}
   */
  _promotionModel

  constructor(props) {
    super(props)

    // Init model(s)
    this._promotionModel = new PromotionModel()
    this._companyModel = window._companyModel = new CompanyModel()

    // Bind method(s)
    this.handleApprove = this.handleApprove.bind(this);

    // Init state
    this.state = {
      toggleSearch: true,
      isLoading: false,
      page: 0,
      count: 1,
      data: [],
      query: {
        itemsPerPage: 25,
        page: 1,
        is_active: 1,
        begin_date: null,
        end_date: null,
      },
      /** @var {Array} */
      company: [
        { name: "-- Chọn --", id: "" },
      ],
    }
    //if binding bussiness selected
    if (this.props.handleActionSelect) {
      this.state['promotionSelected'] = {}
    }
  }

  componentDidMount() {
    // Get bundle data
    this.getData();
  }

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let bundle = {}
    let all = [
      this._promotionModel.list()
        .then(data => (bundle['data'] = data)),
      this._companyModel.getOptions({ is_active: 1 })
        .then(data => (bundle['company'] = data)),
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
    // console.log('bundle: ', bundle);
    return bundle
  }

  // get data
  getData = ( _query ) => {
    this.setState({ isLoading: true });
    let { query } = this.state;
    query = Object.assign(_query || query, this.props.stateQuery);
    return this._promotionModel.list(query)
      .then(res => {
        let {
          items = [],
          totalItems,
          totalPages,
          ...rest
        } = res;
        let isLoading = false;
        let page = query['page'] - 1 || 0;
        this.setState({
          isLoading,
          data: items,
          count: totalItems,
          page,
          query: Object.assign(query, rest)
        })
      });
  }

  handleClickAdd = () => {
    window._$g.rdr('/promotions/add')
  }

  handleChangeStatus = (status, id, rowIndex) => {
    window._$g.dialogs.prompt(
      'Bạn có chắc chắn muốn thay đổi trạng thái dữ liệu đang chọn?',
      'Cập nhật',
      (confirm) => this.onChangeStatus(confirm, status, id, rowIndex)
    )
  }

  onChangeStatus = (confirm, status, id, idx) => {
    if (confirm) {
      let postData = {is_active: status ? 1 : 0};
      this._promotionModel.changeStatus(id, postData)
      .then(() => {
        const cloneData = [...this.state.data]
        cloneData[idx].is_active = status
        this.setState({
          data: cloneData,
        }, () => {
          window._$g.toastr.show('Cập nhật trạng thái thành công.', 'success');
        });
      })
      .catch(() => {
        window._$g.toastr.show('Cập nhật trạng thái không thành công.', 'error');
      });
    }
  }

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: '/promotions/detail/',
      delete: '/promotions/delete/',
      edit: '/promotions/edit/',
      changePassword: '/promotions/change-password/',
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
      this._promotionModel.delete(id)
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

  handleSubmitFilter = (data) => {
    let query = {...this.state.query}
    query = Object.assign(query, {...data});
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

  handleApprove(item) {
    //
    let data = { note_review: "" };
    //
    let approve = ((is_review) => {
      this._promotionModel.approve(item.promotion_id, Object.assign(data, {
        is_review, user_review: userAuth.user_name
      }))
        .then(() => {
          // Notify + refresh list
          window._$g.toastr.show(`Thao tác thành công.`, 'success');
          this._refPromotionFilter.onSubmit();
        })
        .catch(err => {
          console.warn(err);
          window._$g.toastr.show(`Thao tác không thành công. Bạn vui lòng thử lại.`, 'error');
        });
    });

    let title = 'Duyệt chương trình khuyến mại';
    let content = (<div>
      <p>{`Bạn muốn duyệt chương trình khuyến mại "${item.promotion_name}"?`}</p>
      <Row>
        <Label for="note_review" sm={3} xs={12}>Ghi chú</Label>
        <Col sm={9} xs={12}>
          <Input
            name="note_review"
            type="textarea"
            maxLength={256}
            onChange={({ target }) => (data.note_review = target.value)}
          />
        </Col>
      </Row>
    </div>);
    let cbFunc = (result) => {
      if (false === result) { return; }
      return approve(1 * result);
    };

    window._$g.dialogs.prompt(content, title, cbFunc, {
      btnYesLabel: "Đồng ý duyệt",
      btnComponents: (btnComps, { handleClose }) => {
        btnComps.splice(btnComps.length - 1, 0, [
          <Button key="btn-approve_no" color="success" onClick={() => handleClose(0 /* KHONG DUYET */)}>
            Không duyệt
          </Button>
        ]);
      }
    });
  }

  render() {
    let columns = [
      configIDRowTable("promotion_id", "/promotions/detail/", this.state.query),
      {
        name: "promotion_name",
        label: "Tên chương trình khuyến mại",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "company_name",
        label: "Công ty áp dụng",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "business_name",
        label: "Cơ sở áp dụng",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "begin_date",
        label: "Ngày áp dụng từ",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "end_date",
        label: "Ngày áp dụng đến",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "is_review",
        label: "Trạng thái duyệt",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="text-center">{this._promotionModel._entity.reviewTextStatic(value)}</div>
            );
          }
        }
      },
      {
        name: "create_date",
        label: "Ngày tạo",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="text-center">{value}</div>
            );
          }
        }
      },
      {
        name: "is_review",
        label: "Duyệt",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            let item = this.state.data[tableMeta['rowIndex']];
            let isNotYetReviewed = this._promotionModel._entity.isNotYetReviewedStatic(value);
            return (
              <div className="text-center">
                <CheckAccess permission="SM_PROMOTION_REVIEW">
                  {(isNotYetReviewed && (item.user_review === userAuth.user_name)) ? (
                    <Button onClick={() => this.handleApprove(item)}>Duyệt</Button>
                  ) : null}
                </CheckAccess>
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
                <CheckAccess permission="SM_PROMOTION_EDIT">
                  <FormControlLabel
                    label={value ? "Có" : "Không"}
                    value={value ? "Có" : "Không"}
                    control={
                    <Switch
                      color="primary"
                      checked={value === 1}
                      value={value}
                    />
                    }
                    onChange={event => {
                      let checked = ((1 * event.target.value) === 1 ? 0 : 1)
                      this.handleChangeStatus(checked, this.state.data[tableMeta['rowIndex']].promotion_id, tableMeta['rowIndex'])
                    }}
                    disabled={!(userAuth._isAdministrator() || this.state.data[tableMeta['rowIndex']].is_system === 0)}
                  />
                </CheckAccess>
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
                <Button color="warning" title="Chi tiết" className="mr-1" onClick={evt => this.handleActionItemClick('detail', this.state.data[tableMeta['rowIndex']].promotion_id, tableMeta['rowIndex'])}>
                  <i className="fa fa-info" />
                </Button>
                <CheckAccess permission="SM_PROMOTION_EDIT">
                  <Button color="primary" title="Chỉnh sửa" className="mr-1" onClick={evt => this.handleActionItemClick('edit', this.state.data[tableMeta['rowIndex']].promotion_id, tableMeta['rowIndex'])}
                    disabled={!(userAuth._isAdministrator() || this.state.data[tableMeta['rowIndex']].is_system === 0)}
                  >
                    <i className="fa fa-edit" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="SM_PROMOTION_DEL">
                  <Button color="danger" title="Xóa" className="" onClick={evt => this.handleActionItemClick('delete', this.state.data[tableMeta['rowIndex']].promotion_id, tableMeta['rowIndex'])}
                    disabled={!(userAuth._isAdministrator() || this.state.data[tableMeta['rowIndex']].is_system === 0)}
                  >
                    <i className="fa fa-trash" />
                  </Button>
                </CheckAccess>
              </div>
            );
          }
        }
      },
    ]

    const { count, page, query, data, promotionSelected } = this.state;
    let options = configTableOptions(count, page, query)
    const { handleActionSelect } = this.props;
    if (handleActionSelect) {
      //config columns for modal select promotion
      //get columns: name, type, phone and address
      columns = columns.filter((col, idx) => [1, 2, 5, 6].indexOf(idx) > -1);
      columns.unshift({
          name: "promotion_id",
          label: "#",
          options: {
            filter: false,
            sort: false,
            customHeadRender: (columnMeta, handleToggleColumn) => {
              let checked = Object.keys(promotionSelected).length === (data || []).length;
              return (
                <th key={`head-th-${columnMeta.label}`} className="MuiTableCell-root MuiTableCell-head">
                  <div className="text-center">
                    <Checkbox
                      checked={checked}
                      onChange={({ target }) => {
                        let { promotionSelected } = this.state;
                        if (target.checked) {
                          (data || []).forEach((item) => (promotionSelected[item.promotion_id] = {promotion_id: item.promotion_id, promotion_name: item.promotion_name}));
                          promotionSelected = { ...promotionSelected };
                        } else {
                          promotionSelected = {};
                        }
                        this.setState({ promotionSelected });
                      }}
                    />
                  </div>
                </th>
              )
            },
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <div className={`text-center color-overlay`}>
                  <Checkbox
                    name="promotion_id_selected"
                    checked={!!promotionSelected[value]}
                    className="checkbox-click"
                    value={value}
                    onChange={(evt) => {
                      let { promotionSelected } = this.state;
                      if (promotionSelected[value]) {
                        delete promotionSelected[value];
                      } else {
                        let item = (data || []).find((item) => (('' + item.promotion_id) === ('' + value)));
                        item && (promotionSelected[value] = {promotion_id: item.promotion_id, promotion_name: item.promotion_name});
                      }
                      promotionSelected = { ...promotionSelected };
                      this.setState({ promotionSelected });
                    }}
                  />
                </div>
              );
            }
          }
        })
    }

    return (
      <div>
        <Card className={`animated fadeIn z-index-222 ${handleActionSelect ? 'rounded-0 mb-0' : 'mb-3 '}`}>
          <CardHeader className="d-flex text-uppercase">
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
                <PromotionFilter
                  ref={ref => { this._refPromotionFilter = ref; }}
                  company={this.state.company}
                  handleSubmit={this.handleSubmitFilter}
                />
              </div>
            </CardBody>
          )}
        </Card>
        {!handleActionSelect ?
        <div>
          <CheckAccess permission="SM_PROMOTION_ADD">
            <Button className="col-12 max-w-110 mb-2 mobile-reset-width mr-2" onClick={() => this.handleClickAdd()} color="success" size="sm">
              <i className="fa fa-plus mr-1" />Thêm mới
            </Button>
          </CheckAccess>
          <CheckAccess permission="SM_PROMOTION_EXPORT">
            <Button className="col-12 max-w-110 mb-2 mobile-reset-width" color="excel" size="sm">
              <i className="fa fa-download mr-1" />Xuất excel
            </Button>
          </CheckAccess>
        </div> : null }
        <Card className={`animated fadeIn ${(false === handleActionSelect) ? '' : 'rounded-0'}`}>
          <CardBody className="px-0 py-0">
            <div className={`MuiPaper-root__custom ${handleActionSelect ? 'modal-select-promotion' : ''}`}>
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
                    { handleActionSelect ? <div className="position-absolute control-select">
                        <Button onClick={() => handleActionSelect(promotionSelected)} className="btn-block-sm btn-success mt-md-0 mt-sm-2 mr-2">
                          <i className="fa fa-check-circle mr-1" />Chọn
                        </Button>
                        <Button onClick={() => handleActionSelect()} className="btn-block-sm mt-md-0 mt-sm-2 mr-2">
                          <i className="fa fa-times-circle mr-1" />Đóng
                        </Button>
                      </div> : null}
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

export default Promotions
