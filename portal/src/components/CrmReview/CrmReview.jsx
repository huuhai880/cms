import React, { Component } from "react";
import { Card, CardBody, CardHeader, Button, Col, FormGroup } from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";
import CrmReviewFilter from "./CrmReviewFilter";
// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions, configIDRowTable } from "../../utils/index";
// Model(s)
import CrmReviewModel from "../../models/CrmReviewModel";

import avatarDefault from '../../assets/img/ava_default.jpg'

// Set layout full-wh
layoutFullWidthHeight();

/**
 * @class Review
 */
class CrmReview extends Component {
  /**
   * @var {Partner}
   */
  _crmReviewModel;

  constructor(props) {
    super(props);

    // Init model(s)
    this._crmReviewModel = new CrmReviewModel();

    // Bind method(s)
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
      is_active: 1,
    },
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
      this.setState(
        {
          isLoading,
        },
        () => {
          this.setState({
            data: dataConfig,
            count,
            page,
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
      this._crmReviewModel
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
    return this._crmReviewModel.getList(query).then((res) => {
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
    window._$g.rdr("/review/add");
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
      this._crmReviewModel
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

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: "/review/detail/",
      delete: "/review/delete/",
      edit: "/review/edit/",
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
      this._crmReviewModel
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

  handleSubmitFilter = (search, from_date, to_date, is_active) => {
    let query = { ...this.state.query };
    query.page = 1;
    query = Object.assign(query, {
      search,
      from_date,
      to_date,
      is_active,
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
    let { data } = this.state;
    const columns = [
      configIDRowTable("review_id", "/review/detail/", this.state.query),
      {
        name: "review_name",
        label: "Người đánh giá",
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
              <div className="d-flex flex-fill, align-items-center justify-content-start">
                <img
                  className="mr-2"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                  src={data[tableMeta["rowIndex"]].review_avatar ? data[tableMeta["rowIndex"]].review_avatar : avatarDefault}
                  onError={(e)=>{e.target.onerror = null; e.target.src=avatarDefault}}
                />
                <div className="text-left">{value}</div>
              </div>
            );
          },
        },
      },
      {
        name: "review_content",
        label: "Nội dung",
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

            return <p className="text-left mb-0" dangerouslySetInnerHTML={{ __html: value.replace(/(<([^>]+)>)/ig, '').split(" ").slice(0, 15).join(" ") + "..." }} />;
          },
        },
      },
      {
        name: "review_date",
        label: "Ngày đánh giá",
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
            return <div className="text-center">{value}</div>;
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
            return (
              <div className="text-center">
                <CheckAccess permission="CRM_REVIEW_EDIT">
                  <Button
                    color="primary"
                    title="Chỉnh sửa"
                    className="mr-1"
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "edit",
                        this.state.data[tableMeta["rowIndex"]].review_id,
                        tableMeta["rowIndex"]
                      )
                    }
                  >
                    <i className="fa fa-edit" />
                  </Button>
                </CheckAccess>
                <CheckAccess permission="CRM_REVIEW_DEL">
                  <Button
                    color="danger"
                    title="Xóa"
                    className=""
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "delete",
                        this.state.data[tableMeta["rowIndex"]].review_id,
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
                <CrmReviewFilter handleSubmit={this.handleSubmitFilter} />
              </div>
            </CardBody>
          )}
        </Card>
        <Col
          xs={12}
          sm={4}
          className="d-flex align-items-end mb-3"
          style={{ padding: 0 }}
        >
          <CheckAccess permission="CRM_REVIEW_ADD">
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

export default CrmReview;
