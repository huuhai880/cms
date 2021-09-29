import React, { useState, useEffect } from "react";
import { layoutFullWidthHeight } from "../../utils/html";
import Filter from "./Filter";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  FormGroup,
  Button,
} from "reactstrap";
import { CircularProgress } from "@material-ui/core";
import { getColumTable } from "./const";
import MUIDataTable from "mui-datatables";
import { configTableOptions, splitString } from "../../utils/index";
import CustomPagination from "../../utils/CustomPagination";
import InterpretModel from "../../models/InterpretModel";
import { CheckAccess } from "../../navigation/VerifyAccess";

import { Table, Badge, Menu, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import TableInterPretChild from "./TableInterPretChild";

layoutFullWidthHeight();

const regex = /(<([^>]+)>)/gi;

function InterPret() {
  const _interpretModel = new InterpretModel();
  const [dataInterpret, setDataInterpret] = useState([]);
  const [toggleSearch, settoggleSearch] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [query, setQuery] = useState({
    itemsPerPage: 25,
    page: 1,
    selectdActive: 1,
  });
  //// init data
  useEffect(() => {
    _callAPI(query);
  }, []);
  ////search
  const handleSubmitFillter = async (value) => {
    let searchQuery = Object.assign(query, value);
    // console.log(searchQuery);
    _callAPI(searchQuery);
  };
  ////call API
  const _callAPI = async (props) => {
    try {
      await _interpretModel.getListInterpret(props).then((data) => {
        setDataInterpret(data);
        console.log(data);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(
        window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại")
      );
    } finally {
      setisLoading(false);
    }
  };
  ///// delete Interpret
  const handleDelete = (id) => {
    window._$g.dialogs.prompt(
      "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
      "xóa",
      (confirm) => {
        if (confirm) {
          try {
            _interpretModel.deleteInterpret(id).then((data) => {
              window._$g.toastr.show("Xóa thành công", "success");
              _callAPI(query);
            });
          } catch (error) {
            console.log(error);
            window._$g.dialogs.alert(
              window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại")
            );
          } finally {
            setisLoading(false);
          }
        }
      }
    );
  };
  const handleChangeRowsPerPage = (event) => {
    query.itemsPerPage = event.target.value;
    query.page = 1;
    _callAPI(query);
  };

  const handleChangePage = (event, newPage) => {
    query.page = newPage + 1;
    _callAPI(query);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "name",
      responsive: ["md"],
      render: (text, record, index) => {
        return <div className="text-center">{index + 1}</div>;
      },
      width: "4%",
    },
    {
      title: "Tên thuộc tính",
      dataIndex: "attribute_name",
      key: "attribute_name",
      responsive: ["md"],
      width: "20%",
    },
    {
      title: "Vị trí hiển thị",
      dataIndex: "order_index",
      key: "order_index",
      responsive: ["md"],
      width: "8%",
      render: (text, record, index) => {
        return <div className="text-center">{text}</div>;
      },
    },
    {
      title: "Tóm tắt",
      dataIndex: "brief_decs",
      key: "brief_decs",
      responsive: ["md"],
      render: (text, record, index) => {
        let value = text.replace(regex, "");
        value = splitString(value, 80);
        return value;
      },
    },
    {
      title: "Kich hoạt",
      dataIndex: "is_active",
      width: "8%",
      key: "is_active",
      responsive: ["md"],
      render: (text, record, index) => (
        <div className="text-center">{record.is_active ? "Có" : "Không"}</div>
      ),
    },

    {
      title: "Thao tác",
      key: "x",
      dataIndex: "",
      width: "15%",
      render: (text, record, index) => {
        return (
          <div className="text-center">
            <CheckAccess permission="FOR_INTERPRET_DETAIL_VIEW">
              <Button
                // color="warning"
                title="Danh sách luận giải chi tiết"
                className="mr-1"
                onClick={(evt) => {
                  window._$g.rdr(
                    `/interpret/interpret-detail/${record["interpret_id"]}`
                  );
                }}
              >
                <i className="fa fa-copy" />
              </Button>
            </CheckAccess>

            <CheckAccess permission="FOR_INTERPRET_DETAIL_ADD">
              <Button
                color="warning"
                title="Thêm mới luận giải chi tiết"
                className="mr-1"
                onClick={(evt) => {
                  window._$g.rdr(
                    `/interpret/interpret-detail/add/${record["interpret_id"]}`
                  );
                }}
              >
                <i className="fa fa-plus" />
              </Button>
            </CheckAccess>

            <CheckAccess permission="FOR_INTERPRET_DETAIL_VIEW">
              <Button
                color="info"
                title="Chi tiết luận giải trên web"
                className="mr-1"
                onClick={(evt) => {
                  // window._$g.rdr(`/interpret/detail-web/${data[tableMeta["rowIndex"]].interpret_id}`);
                  window.open(
                    `/portal/interpret/detail-web/${record["interpret_id"]}`,
                    "_blank"
                  );
                  // window._$g.rdr(
                  //   `/interpret/detail-web/${data[tableMeta["rowIndex"]].interpret_id}`, '_blank'
                  // );
                }}
              >
                <i className="fa fa-eye" />
              </Button>
            </CheckAccess>
            <CheckAccess permission="FOR_INTERPRET_EDIT">
              <Button
                color={"primary"}
                title="Duyệt"
                className="mr-1"
                onClick={(evt) => {
                  window._$g.rdr(`/interpret/edit/${record["interpret_id"]}`);
                }}
              >
                <i className="fa fa-edit" />
              </Button>
            </CheckAccess>

            <CheckAccess permission="FOR_INTERPRET_DEL">
              <Button
                color="danger"
                title="Xóa"
                className=""
                onClick={(evt) => handleDelete(record["interpret_id"])}
              >
                <i className="fa fa-trash" />
              </Button>
            </CheckAccess>
          </div>
        );
      },
      responsive: ["md"],
    },
  ];

  const data = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i,
      name: "Screem",
      platform: "iOS",
      version: "10.3.4.5654",
      upgradeNum: 500,
      creator: "Jack",
      createdAt: "2014-12-24 23:12:00",
    });
  }

  return (
    <div>
      <Card className="animated fadeIn z-index-222 mb-3 ">
        <CardHeader className="d-flex">
          <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
          <div
            className="minimize-icon cur-pointer"
            onClick={() => settoggleSearch(!toggleSearch)}
          >
            <i className={`fa ${toggleSearch ? "fa-minus" : "fa-plus"}`} />
          </div>
        </CardHeader>
        {toggleSearch && (
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-filter__custom">
              <Filter handleSubmitFillter={handleSubmitFillter} />
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
        <FormGroup className="mb-2 mb-sm-0">
          <CheckAccess permission={"FOR_INTERPRET_ADD"}>
            <Button
              color="success"
              className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
              onClick={() => {
                window._$g.rdr("/interpret/add");
              }}
              size="sm"
            >
              <i className="fa fa-plus" />
              <span className="ml-1">Thêm mới</span>
            </Button>
          </CheckAccess>
        </FormGroup>
      </Col>
      <Card className={`animated fadeIn mb-3 `}>
        <CardBody className="px-0 py-0">
          <Col xs={12} style={{ padding: 0 }}>
            <div
            // className="MuiPaper-root__custom"
            >
              {isLoading ? (
                <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                  <CircularProgress />
                </div>
              ) : (
                <div>
                  {/* <MUIDataTable
                    data={dataInterpret.items}
                    columns={getColumTable(
                      dataInterpret.items,
                      dataInterpret.totalItems,
                      query,
                      handleDelete
                      // handleReply,
                      // handleReview
                    )}
                    options={configTableOptions(dataInterpret.totalItems, query.page, {
                      itemsPerPage: query.itemsPerPage,
                    })}
                  /> */}

                  <Table
                    className="components-table-demo-nested"
                    columns={columns}
                    // expandable={{ expandedRowRender }}
                    dataSource={dataInterpret.items}
                    bordered={true}
                    pagination={false}
                    rowKey={"interpret_id"}
                    expandable={{
                      expandedRowRender: (record, index) => (
                        <TableInterPretChild data={record.interpret_details}  indexParent={index + 1}/>
                      ),
                      rowExpandable: (record) =>
                        record.interpret_details.length > 0,
                    }}
                  />

                  <CustomPagination
                    count={dataInterpret.totalItems}
                    rowsPerPage={query.itemsPerPage}
                    page={query.page - 1 || 0}
                    // rowsPerPageOptions={[10, 25, 50]}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </div>
              )}
            </div>
          </Col>
        </CardBody>
      </Card>
    </div>
  );
}

export default InterPret;
