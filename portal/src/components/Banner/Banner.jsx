import React, { Component } from "react";
import { Card, CardBody, CardHeader, Button } from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import BannerFilter from "./BannerFilter";
// Util(s)
import { layoutFullWidthHeight, mapDataOptions4Select } from "../../utils/html";
import { configTableOptions, configIDRowTable} from "../../utils/index";
// Model(s)
import BannerModel from "../../models/BannerModel";
import ConfigModel from '../../models/ConfigModel';

// Set layout full-wh
layoutFullWidthHeight();

/**
 * @class Banner
 */
class Banner extends Component {
  /**
   * @var {Banner}
   */
  _BannerModel;

  constructor(props) {
    super(props);

    // Init model(s)
    this._BannerModel = new BannerModel();
    this._configModel = new ConfigModel();
    // Bind method(s)
  }

  state = {
    toggleSearch: true,
    isLoading: false,
    page: 0,
    count: 1,
    data: [],
    placementOpts: [{value: '', label: 'Tất cả'}],
    query: {
      itemsPerPage: 25,
      page: 1,
      is_active: 1
    },
  };

  componentDidMount() {
    // Get bundle data
    this.setState({ isLoading: true });
    (async () => {
      let bundle = await this._getBundleData();
      let { data, placementOpts } = bundle;
      let dataConfig = data ? data.items : [];
      let isLoading = false;
      let count = data ? data.totalItems : 0;
      let page = 0;

      this.setState(
        {
          isLoading,
        },
        () => {
          this.setState({
            data: dataConfig,
            count,
            page,
            placementOpts
          });
        }
      );
    })();
    //.end
  }

  /**
   * Goi API, lay toan bo data lien quan
   */
  async _getBundleData() {
    let bundle = {};
    let all = [
      // @TODO:
      this._BannerModel
        .getList(this.state.query)
        .then((data) => (bundle["data"] = data)),
      this._configModel
        .getListPlacementForBanner()
        .then(data => (bundle['placementOpts'] = mapDataOptions4Select(data)))
    ];
    await Promise.all(all).catch((err) => {
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`)
      );
    });
    return bundle;
  }

  // get data
  getData = (query = {}) => {
    this.setState({ isLoading: true });
    return this._BannerModel.getList(query).then((res) => {
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
    window._$g.rdr("/banner/add");
  };

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: "/banner/detail/",
      delete: "/banner/delete/",
      edit: "/banner/edit/",
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
      this._BannerModel
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

  handleSubmitFilter = (create_date_from, create_date_to, is_active, placement) => {
    let query = { ...this.state.query };
    query.page = 1;
    query = Object.assign(query, {
      create_date_from,
      create_date_to,
      is_active,
      placement
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
    const columns = [
      configIDRowTable("banner_id", "/banner/detail/", this.state.query),
      {
        name: "placement",
        label: "Vị trí đặt banner",
        options: {
          filter: false,
          sort: false,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
                style={{maxWidth: 200}}
              >
                <div className="text-center">{columnMeta.label}</div>
              </th>
            ); 
          },
          customBodyRender: (value) => {
            return (
              <div class="text-left" style={{width: 200}}>
                {value?value.name:''}
              </div>
            );
          },
        },
      },
      // {
      //   name: "picture_url",
      //   label: "Ảnh banner",
      //   options: {
      //     filter: false,
      //     sort: false,
      //     customHeadRender: (columnMeta, handleToggleColumn) => {
      //       return (
      //         <th
      //           key={`head-th-${columnMeta.label}`}
      //           className="MuiTableCell-root MuiTableCell-head"
      //         >
      //           <div className="text-center">{columnMeta.label}</div>
      //         </th>
      //       );
      //     },
      //     customBodyRender: (value) => {
      //       return (
      //         <div class="text-left">
      //           <img src={value} alt="" height="100" style={{objectFit: 'scale-down'}} />
      //         </div>
      //       );
      //     },
      //   },
      // },
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
            return (
              <div class="text-center" >
                {value}
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
            return (
              <div className="text-center">
                <CheckAccess permission="CMS_BANNER_EDIT">
                  {value ? "Có" : "Không"}
                </CheckAccess>
              </div>
            );
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
            return (
              <div className="text-center">
                <CheckAccess permission="CMS_BANNER_EDIT">
                  <Button
                    color="primary"
                    title="Chỉnh sửa"
                    className="mr-1"
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "edit",
                        this.state.data[tableMeta["rowIndex"]].banner_id,
                        tableMeta["rowIndex"]
                      )
                    }
                  >
                    <i className="fa fa-edit" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="CMS_BANNER_DEL">
                  <Button
                    color="danger"
                    title="Xóa"
                    className=""
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "delete",
                        this.state.data[tableMeta["rowIndex"]].banner_id,
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
    const { count, page, query, placementOpts } = this.state;
    const options = configTableOptions(count, page, query);

    return (
      <div>
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
                <BannerFilter handleSubmit={this.handleSubmitFilter} placementOpts={placementOpts} />
              </div>
            </CardBody>
          )}
        </Card>
        <div>
          <CheckAccess permission="CMS_BANNER_ADD">
            <Button
              className="col-12 max-w-110 mb-2 mobile-reset-width mr-2"
              onClick={() => this.handleClickAdd()}
              style={{ paddingTop: "6px", paddingBot: "6px" }}
              color="success"
              size="sm"
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

export default Banner;
