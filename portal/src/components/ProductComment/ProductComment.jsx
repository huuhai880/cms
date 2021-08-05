import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Button } from 'reactstrap'
import fileDownload from 'js-file-download';
import moment from 'moment';

// Material
import MUIDataTable from 'mui-datatables'
import { CircularProgress, Checkbox } from '@material-ui/core'
import CustomPagination from '../../utils/CustomPagination'
import FormControlLabel from "@material-ui/core/FormControlLabel";

// Component(s)
import { CheckAccess } from '../../navigation/VerifyAccess';
import Switch from "@material-ui/core/Switch";
import ProductCommentFilter from './ProductCommentFilter';
// Util(s)
import { configTableOptions, configIDRowTable } from '../../utils/index';
// Model(s)
import ProductCommentModel from '../../models/ProductCommentModel' 
import ProductCategoryModel from "../../models/ProductCategoryModel";
import StatusProductModel from '../../models/StatusProductModel';
import ManufaturerModel from '../../models/ManufacturerModel';

/**
 * @class ProductListComment
 */
class ProductComment extends Component {
  constructor(props) {
    super(props)

    // Init model(s)
    this._productCommentModel = new ProductCommentModel();
    this._productCategoryModel = new ProductCategoryModel();
    this._statusProductModel = new StatusProductModel();
    this._manufacturerModel = new ManufaturerModel();

    // Bind method(s)

    
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
      },

      /** @var {Array} */
      productCategoryOptions: [
        { name: "-- Chọn --", id: "" },
      ],
      /** @var {Array} */
      statusProducts: [
        { name: "-- Chọn --", id: "" },
      ],
      /** @var {Array} */
      manufacturerOptions: [
        { name: "-- Chọn --", id: "" },
      ],
    };
  }

  componentDidMount() {
    this.getData();
    // Get bundle data
    (async () => {
      let ID = this.props.match.params.id;
     
     
     
      let bundle = await this._getBundleData();
      let {
        statusProducts = [],
        productCategoryOptions = [],
        manufacturerOptions = [],
      } = this.state;
      //
      statusProducts = statusProducts.concat(bundle.statusProducts || []);
      productCategoryOptions = productCategoryOptions.concat(bundle.productCategoryOptions || []);
      manufacturerOptions = manufacturerOptions.concat(bundle.manufacturerOptions || []);
      //
      this.setState({
        statusProducts,
        productCategoryOptions,
        manufacturerOptions,
      });
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
      this._statusProductModel.getOptions({ is_active: 1 })
        .then(data => (bundle['statusProducts'] = data)),
      this._productCategoryModel.getOptionsForList({ is_active: 1 })
        .then(data => (bundle['productCategoryOptions'] = data)),
      this._manufacturerModel.getOptions({ is_active: 1 })
        .then(data => (bundle['manufacturerOptions'] = data)),
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
    //  console.log('bundle: ', bundle);
    return bundle
  }

  // get data
  getData = ( _query ) => {
    this.setState({ isLoading: true });
    let { query } = this.state;
    query = Object.assign(_query || query, this.props.stateQuery);
    let ID = this.props.match.params.id;

    return this._productCommentModel.getProductCommentList(ID,query)
      .then(res => {
        let {
          items = [],
          totalItems,
          totalPages,
          ...rest
        } = res;
        let isLoading = false;
        this.setState({
          isLoading,
          data: items,
          totalItems,
          totalPages,
          query: Object.assign(query, rest)
        });
      });
  }

  handleClickAdd = () => {
    window._$g.rdr('/products/add')
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
      this._productCommentModel.changeStatus(id, postData)
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

  handleToggleImportExcel = () => {
    this.setState(prevState => ({
      willShowImportExcel: !prevState.willShowImportExcel
    }))
  }

  handleDownloadSampleFile = (isService) => {

  }


  handleExport = () => {
    this._productCommentModel.exportExcel()
    .then(response => {
      const configDate = moment().format("DDMMYYYY");
      fileDownload(response, `Product_${configDate}.csv`);
    })
    .catch((error) => {
      console.log(error)
    });
  }

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: '/products/detail/',
      comment: '/products/comments/',
      delete: '/products/delete/',
      edit: '/products/edit/',
    }
    const route = routes[type]
    if (type.match(/detail|comment|edit/i)) {
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
      this._productCommentModel.delete(id)
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

  handleSubmitFilter = (search, product_category_id, status_product_id, manufacturer_id, created_date_from, created_date_to, is_service, is_active, is_show_web) => {
    let query = {...this.state.query}
    query.page = 1
    query = Object.assign(query, {search, product_category_id, status_product_id, manufacturer_id, created_date_from, created_date_to, is_service, is_active, is_show_web})
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
    let { handlePick } = this.props;

    const columns = [
      configIDRowTable("product_id", "/products/detail/", this.state.query),
      {
        name: "user_comment",
        label: "Họ và tên",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "phone_number",
        label: "Số điện thoại",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            return <span>{value || ""}</span>;
          }
        }
      },
      {
        name: "email",
        label: "Email",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "content_comment",
        label: "Nội dung bình luận",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "ratting_values",
        label: "Đánh giá",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            return <span>{value || 0}</span>;
          }
        }
      },
      {
        name: "create_date",
        label: "Ngày bình luận",
        options: {
          filter: false,
          sort: false,
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
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
              >
                <div className="text-center">{columnMeta.label}</div>
              </th>
            );
          },
          customBodyRender: (value, tableMeta, updateValue) => {
            let { controlIsActiveProps = {} } = this.props;
            return (
              <div className="text-center">
                <CheckAccess permission="CRM_CUSTOMERTYPE_EDIT">
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
                      let checked = 1 * event.target.value === 1 ? 0 : 1;
                      this.handleChangeStatus(
                        checked,
                        this.state.data[tableMeta["rowIndex"]].web_category_id,
                        tableMeta["rowIndex"]
                      );
                    }}
                    {...controlIsActiveProps}
                  />
                </CheckAccess>
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
          customBodyRender: (value, tableMeta, updateValue) => {
            if (handlePick) {
              return (
                <div className="text-center mb-1">
                  <Checkbox
                    onChange={({ target }) => {
                      let item = this.state.data[tableMeta['rowIndex']];
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
                <CheckAccess permission="PRO_COMMENT_VIEW">
                  <Button color="warning" title="Bình luận" className="mr-1 disabled cur-default-important"
                   onClick={evt => this.handleActionItemClick('edit', this.state.data[tableMeta['rowIndex']].product_id, tableMeta['rowIndex'])}
                   >
                    <i className="fa fa-comment" />
                  </Button>
                </CheckAccess> 
              </div>
            );
          }
        }
      },
    ]

    const {totalItems, query, willShowImportExcel} = this.state;
    const options = configTableOptions(totalItems, 0, query)

    return (
      <div className="animated fadeIn">

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
                <ProductCommentFilter 
                  handleSubmit={this.handleSubmitFilter}
                  {...this.props.filterProps}
                />
              </div>
            </CardBody>
          )}
        </Card>
        {handlePick ? (<div className="text-right mb-1">
          <Button
            color="success" size="sm"
            className="col-12 max-w-110 ml-2 mobile-reset-width"
            onClick={() => {
              let { _pickDataItems } = this;
              handlePick(_pickDataItems);
            }}
          >
            <i className="fa fa-plus mr-1" />Chọn
          </Button>
        </div>) : null}
       
        <Card className="animated fadeIn">
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
                      count={1 * totalItems}
                      rowsPerPage={1 * query.itemsPerPage}
                      page={(1 * query.page) - 1}
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

export default ProductComment
