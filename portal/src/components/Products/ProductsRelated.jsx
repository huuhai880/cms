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
class ProductsRelated extends Component {
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

  componentWillReceiveProps(nextProps) {
    const filterData = this.state.data
      .filter(
        (e) =>
          !nextProps.create_product_related.find(
            (item) => item.product_id === e.product_id
          )
      )
      .filter(
        (e) =>
          !nextProps.delete_product_related.find(
            (item) => item.product_id === e.product_id
          )
      );
    this.setState({
      data: [...filterData, ...nextProps.create_product_related],
      totalItems: filterData.length + nextProps.create_product_related.length,
    });
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
    return bundle;
  }

  // get data
  getData = (_query) => {
    this.setState({ isLoading: true });
    let { query } = this.state;
    query = Object.assign(_query || query, this.props.stateQuery);
    if (!this.props.product_id) {
      this.setState({
        isLoading: false,
        data: [...this.props.create_product_related],
        totalItems: 0,
        totalPages: 0,
        query: Object.assign(query),
      });
    }
    return this._productModel
      .getListProductRelated(this.props.product_id, { ...query })
      .then((res) => {
        let { items = [], totalItems, totalPages, ...rest } = res;
        let isLoading = false;
        this.setState({
          isLoading,
          data: [...items, ...this.props.create_product_related],
          totalItems:
            1 * totalItems + 1 * this.props.create_product_related.length,
          totalPages,
          query: Object.assign(query, rest),
        });
        this.props.setState({ products_related: items });
      });
  };

  handleActionItemClick(type, id, rowIndex) {
    const { data } = this.state;
    const cloneData = JSON.parse(JSON.stringify(data));
    cloneData.splice(rowIndex, 1);
    this.setState({
      data: cloneData,
    });
    this.props.setState({
      products_related: cloneData,
      delete_product_related: [
        ...this.props.delete_product_related,
        data.find((e) => e.product_id === id),
      ],
      create_product_related: this.props.create_product_related.filter(
        (e) => e.product_id !== id
      ),
    });
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

  handleChangePage = (_, newPage) => {
    let query = { ...this.state.query };
    query.page = newPage + 1;
    this.getData(query);
  };

  render() {
    const columns = [
      configIDRowTable(
        "product_id",
        "/products/detail/",
        this.state.query,
        null,
        "_blank"
      ),
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
            return (
              <div className="text-center">
                <CheckAccess permission="MD_PRODUCT_EDIT">
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
                    <i className="fa fa-minus-circle" />
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

export default ProductsRelated;
