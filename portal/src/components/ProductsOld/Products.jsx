import React, { Component } from "react";
import { Card, CardBody, CardHeader, Button } from "reactstrap";
import fileDownload from "js-file-download";
import moment from "moment";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress, Checkbox } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Assets
import "./styles.scss";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import ProductFilter from "./ProductFilter";
import ProductImport from "./ProductImport";

// Util(s)
import { configTableOptions, configIDRowTable } from "../../utils/index";

// Model(s)
import ProductModel from "../../models/ProductModel";
import ProductCategoryModel from "../../models/ProductCategoryModel";
import StatusProductModel from "../../models/StatusProductModel";
import ManufaturerModel from "../../models/ManufacturerModel";

/**
 * @class Products
 */
class Products extends Component {
  constructor(props) {
    super(props);

    // Init model(s)
    this._productModel = new ProductModel();
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
      productCategoryOptions: [],
      /** @var {Array} */
      statusProducts: [{ name: "-- Chọn --", id: "" }],
      /** @var {Array} */
      manufacturerOptions: [{ name: "-- Chọn --", id: "" }],
    };
  }

  componentDidMount() {
    this.getData();
    // Get bundle data
    (async () => {
      let bundle = await this._getBundleData();
      let {
        statusProducts = [],
        productCategoryOptions = [],
        manufacturerOptions = [],
      } = this.state;
      //
      statusProducts = statusProducts.concat(bundle.statusProducts || []);
      productCategoryOptions = productCategoryOptions.concat(
        bundle.productCategoryOptions || []
      );
      manufacturerOptions = manufacturerOptions.concat(
        bundle.manufacturerOptions || []
      );
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
    let bundle = {};
    let all = [
      // @TODO:
      this._statusProductModel
        .getOptions({ is_active: 1 })
        .then((data) => (bundle["statusProducts"] = data)),
      this._productCategoryModel
        .getOptions({ id_active: 1 })
        .then((data) => (bundle["productCategoryOptions"] = data)),
    ];
    await Promise.all(all).catch((err) => {
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => {
          window.location.reload();
        }
      );
    });
    //  console.log('bundle: ', bundle);
    return bundle;
  }

  // get data
  getData = (_query) => {
    this.setState({ isLoading: true });
    const queryPrams = new URLSearchParams(this.props.history.location.search);
    const author_id = queryPrams.get("author_id") || "";
    let { query } = this.state;
    query = Object.assign(_query || query, this.props.stateQuery);
    return this._productModel.getList({ ...query, author_id }).then((res) => {
      let { items = [], totalItems, totalPages, ...rest } = res;
      let isLoading = false;
      this.setState({
        isLoading,
        data: items,
        totalItems,
        totalPages,
        query: Object.assign(query, rest),
      });
    });
  };

  handleClickAdd = () => {
    window._$g.rdr("/products/add");
  };

  handleChangeStatus = (status, id, rowIndex) => {
    window._$g.dialogs.prompt(
      "Bạn có chắc chắn muốn thay đổi trạng thái dữ liệu đang chọn?",
      "Cập nhật",
      (confirm) => this.onChangeStatus(confirm, status, id, rowIndex)
    );
  };

  onChangeStatus = (confirm, status, id, idx) => {
    if (confirm) {
      let postData = { is_active: status ? 1 : 0 };
      this._productModel
        .changeStatus(id, postData)
        .then(() => {
          const cloneData = [...this.state.data];
          cloneData[idx].is_active = status;
          this.setState(
            {
              data: cloneData,
            },
            () => {
              window._$g.toastr.show(
                "Cập nhật trạng thái thành công.",
                "success"
              );
            }
          );
        })
        .catch(() => {
          window._$g.toastr.show(
            "Cập nhật trạng thái không thành công.",
            "error"
          );
        });
    }
  };

  handleToggleImportExcel = () => {
    this.setState((prevState) => ({
      willShowImportExcel: !prevState.willShowImportExcel,
    }));
  };

  handleDownloadSampleFile = (isService) => {};

  handleExport = () => {
    this._productModel
      .exportExcel()
      .then((response) => {
        const configDate = moment().format("DDMMYYYY");
        fileDownload(response, `Product_${configDate}.csv`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: "/products/detail/",
      comment: "/products/comments/",
      delete: "/products/delete/",
      edit: "/products/edit/",
    };
    const route = routes[type];
    if (type.match(/detail|comment|edit/i)) {
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
      this._productModel
        .delete(id)
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

  handleSubmitFilter = (
    search,
    product_category_id,
    status_product_id,
    manufacturer_id,
    created_date_from,
    created_date_to,
    is_service,
    is_active,
    is_show_web
  ) => {
    let query = { ...this.state.query };
    query.page = 1;
    query = Object.assign(query, {
      search,
      product_category_id,
      status_product_id,
      manufacturer_id,
      created_date_from,
      created_date_to,
      is_service,
      is_active,
      is_show_web,
    });
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
    let { handlePick } = this.props;

    const columns = [
      configIDRowTable("product_id", "/products/detail/", this.state.query),
      {
        name: "product_code",
        label: "Mã sản phẩm",
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
        },
      },
      {
        name: "category_name",
        label: "Danh mục sản phẩm",
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
        name: "product_name_show_web",
        label: "Tên hiển thị web",
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
                <CheckAccess permission="MD_PRODUCT_EDIT">
                  <Button
                    color="primary"
                    title="Chỉnh sửa"
                    className="mr-1"
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "edit",
                        this.state.data[tableMeta["rowIndex"]].product_id,
                        tableMeta["rowIndex"]
                      )
                    }
                    disabled={this.state.data[tableMeta["rowIndex"]].edit === 0}
                  >
                    <i className="fa fa-edit" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="MD_PRODUCT_DEL">
                  <Button
                    color="danger"
                    title="Xóa"
                    className=""
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "delete",
                        this.state.data[tableMeta["rowIndex"]].product_id,
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

    const { totalItems, query, willShowImportExcel } = this.state;
    const options = configTableOptions(totalItems, 0, query);

    return (
      <div className="animated fadeIn">
        {/* start#ProductImport */}
        {willShowImportExcel ? (
          <div className="product-import-excel">
            <div className="product-import-excel-box p-3">
              <ProductImport
                handleDownloadSampleFile={this.handleDownloadSampleFile}
                handleActionClose={this.handleToggleImportExcel}
              />
            </div>
          </div>
        ) : null}
        {/* end#ProductImport */}
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
                <ProductFilter
                  productCategoryOptions={this.state.productCategoryOptions}
                  statusProducts={this.state.statusProducts}
                  manufacturerOptions={this.state.manufacturerOptions}
                  handleSubmit={this.handleSubmitFilter}
                  {...this.props.filterProps}
                />
              </div>
            </CardBody>
          )}
        </Card>
        {handlePick ? (
          <div className="text-right mb-1">
            <Button
              color="success"
              size="sm"
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
            <CheckAccess permission="MD_PRODUCT_ADD">
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
            {/* <CheckAccess permission="MD_PRODUCT_IMPORT">
              <Button
                className="col-12 max-w-110 mb-2 mr-2 mobile-reset-width"
                onClick={() => this.handleToggleImportExcel()}
                color="excel"
                size="sm"
              >
                <i className="fa fa-upload mr-1" />
                Nhập excel
              </Button>
            </CheckAccess>
            <CheckAccess permission="MD_PRODUCT_EXPORT">
              <Button
                className="col-12 max-w-110 mb-2  mr-2  mobile-reset-width"
                onClick={() => this.handleExport()}
                color="excel"
                size="sm"
              >
                <i className="fa fa-download mr-1" />
                Xuất excel
              </Button>
            </CheckAccess> */}
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

export default Products;
