import React, { useState, useEffect } from "react";
import { layoutFullWidthHeight } from "../../utils/html";
import Filter from "./Filter";
import { Alert, Card, CardBody, CardHeader, Col, Input, FormGroup, Button } from "reactstrap";
import { CircularProgress } from "@material-ui/core";
import { column, getColumTable } from "./const";
import MUIDataTable from "mui-datatables";
import { configTableOptions, splitString } from "../../utils/index";
import CustomPagination from "../../utils/CustomPagination";
import InterpretModel from "../../models/InterpretModel";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { useParams } from "react-router";

import { Table, Badge, Menu, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import TableInterPretChild from "./TableInterPretChild.jsx";

layoutFullWidthHeight();

const regex = /(<([^>]+)>)/gi;
const _interpretModel = new InterpretModel();

function InterPret() {
  let { id } = useParams();
  const [dataInterpret, setDataInterpret] = useState([]);
  const [toggleSearch, settoggleSearch] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [query, setQuery] = useState({
    itemsPerPage: 25,
    page: 1,
    selectdActive: 1,
    selectdSpectial: 2,
  });

  const [expandedRowKey, setExpandedRowKey] = useState([]);
  useEffect(() => {
    if (id) {
      setExpandedRowKey([Number(id)]);
      // console.log(id)
    }
  }, [id]);
  useEffect(() => {
    _callAPI(query);
  }, []);

  const handleSubmitFillter = async (value) => {
    let searchQuery = Object.assign(query, value);
    _callAPI(searchQuery);
  };

  const _callAPI = async (props) => {
    try {
      let data = await _interpretModel.getListInterpret(props);
      setDataInterpret(data);
    } catch (error) {
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
    } finally {
      setisLoading(false);
    }
  };

  const handleDelete = (id) => {
    window._$g.dialogs.prompt("Bạn có chắc chắn muốn xóa dữ liệu đang chọn?", "xóa", (confirm) => {
      if (confirm) {
        try {
          _interpretModel.deleteInterpret(id).then((data) => {
            window._$g.toastr.show("Xóa thành công", "success");
            _callAPI(query);
          });
        } catch (error) {
          // console.log(error);
          window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
        } finally {
          setisLoading(false);
        }
      }
    });
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

  const handleDelInterpretDetail = (id) => {
    window._$g.dialogs.prompt("Bạn có chắc chắn muốn xóa dữ liệu đang chọn?", "xóa", (confirm) => {
      if (confirm) {
        try {
          _interpretModel.deleteInterpretDetail(id).then((data) => {
            window._$g.toastr.show("Xóa thành công", "success");
            _callAPI(query);
          });
        } catch (error) {
          window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
        } finally {
          setisLoading(false);
        }
      }
    });
  };
// console.log(dataInterpret.items)
  return (
    <div>
      <Card className="animated fadeIn z-index-222 mb-3 ">
        <CardHeader className="d-flex">
          <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
          <div className="minimize-icon cur-pointer" onClick={() => settoggleSearch(!toggleSearch)}>
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
      <Col xs={12} sm={4} className="d-flex align-items-end mb-3" style={{ padding: 0 }}>
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
            <div>
              {isLoading ? (
                <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                  <CircularProgress />
                </div>
              ) : (
                <div>
                  <Table
                    className="components-table-demo-nested"
                    columns={column(handleDelete)}
                    dataSource={dataInterpret.items}
                    bordered={true}
                    pagination={false}
                    rowKey={"interpret_id"}
                    expandable={{
                      expandedRowRender: (record, index) => (
                        <TableInterPretChild
                          data={record.interpret_details}
                          indexParent={index + 1}
                          handleDelInterpretDetail={handleDelInterpretDetail}
                        />
                      ),
                      rowExpandable: (record) => record.interpret_details.length > 0,
                      onExpand: (expanded, record) => {
                        // console.log(expanded)
                        !expanded
                          ? setExpandedRowKey([])
                          : setExpandedRowKey([record.interpret_id]);
                      },
                      expandedRowKeys: expandedRowKey,
                      expandRowByClick: true,
                    }}
                  />

                  <CustomPagination
                    count={dataInterpret.totalItems}
                    rowsPerPage={query.itemsPerPage}
                    page={query.page - 1 || 0}
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
