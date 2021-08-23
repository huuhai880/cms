import React, { useState, useEffect } from "react";
import { Alert, Card, CardBody, CardHeader, Col, Input, Button, FormGroup } from "reactstrap";
import Filter from "./Filter";
import { layoutFullWidthHeight } from "../../utils/html";
import MUIDataTable from "mui-datatables";
import { configTableOptions } from "../../utils/index";
import CustomPagination from "../../utils/CustomPagination";
import { CircularProgress, Checkbox } from "@material-ui/core";
import PositionModel from "models/PositionModel";
import { useParams } from "react-router";
import { getColumTable } from "./const";
layoutFullWidthHeight();

function Position() {
  const _positionModel = new PositionModel();
  const [dataPosition, setDataPosition] = useState([]);

  const [query, setQuery] = useState({
    pageSize: 25,
    pageIndex: 1,
    selectdActive: 1,
  });
  const [isLoading, setisLoading] = useState(true);
  const [toggleSearch, settoggleSearch] = useState(true);
  ////search
  const handleSubmitFillter = async (value) => {
    let searchQuery = Object.assign(query, value);
    // console.log(searchQuery)
    _callAPI(searchQuery);
  };
  ////call API
  const _callAPI = async (props) => {
        // console.log("ủa em");

    try {
      await _positionModel.getList(props).then((data) => {
        setDataPosition(data);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
    } finally {
      setisLoading(false);
    }
  };
  //// init data
  useEffect(() => {
    _callAPI(query);
  }, []);
  //// delete
  const handleDelete = (comment_id) => {
    window._$g.dialogs.prompt("Bạn có chắc chắn muốn xóa dữ liệu đang chọn?", "xóa", (confirm) => {
      if (confirm) {
        try {
          _positionModel.delete(comment_id).then((data) => {
            window._$g.toastr.show("Xóa thành công", "success");
            _callAPI(query);
          });
        } catch (error) {
          console.log(error);
          window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
        } finally {
          setisLoading(false);
        }
      }
    });
  };
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
          <Button
            color="success"
            className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
            onClick={() => {
              window._$g.rdr("/position/add");
            }}
            size="sm"
          >
            <i className="fa fa-plus" />
            <span className="ml-1">Thêm mới</span>
          </Button>
        </FormGroup>
      </Col>
      <Card className={`animated fadeIn mb-3 `}>
        <CardBody className="px-0 py-0">
          <Col xs={12} style={{ padding: 0 }}>
            <div className="MuiPaper-root__custom">
              {isLoading ? (
                <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                  <CircularProgress />
                </div>
              ) : (
                <div>
                  <MUIDataTable
                    data={dataPosition.items}
                    columns={getColumTable(
                      dataPosition.items,
                      dataPosition.totalItems,
                      query,
                      handleDelete
                    )}
                    options={configTableOptions(dataPosition.totalItems, query.pageIndex, {
                      itemsPerPage: query.pageSize,
                    })}
                  />
                  <CustomPagination
                    count={dataPosition.totalItems}
                    rowsPerPage={query.pageSize}
                    page={query.pageIndex - 1 || 0}
                    // onChangePage={handleChangePage}
                    // onChangeRowsPerPage={handleChangeRowsPerPage}
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

export default Position;
