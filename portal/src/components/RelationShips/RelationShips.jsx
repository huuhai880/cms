import React, { useState, useEffect } from "react";
import { layoutFullWidthHeight } from "../../utils/html";
import Filter from "./Filter";
import { Alert, Card, CardBody, CardHeader, Col, Input, FormGroup, Button } from "reactstrap";
import { CircularProgress } from "@material-ui/core";
import { getColumTable } from "./const.js";
import MUIDataTable from "mui-datatables";
import { configTableOptions } from "../../utils/index";
import CustomPagination from "../../utils/CustomPagination";
import RelationshipsModel from "../../models/RelationshipsModel";
layoutFullWidthHeight();

function RelationShips() {
    const _relationshipsModel = new RelationshipsModel();
  const [dataRelationShips, setDataRelationShips] = useState([]);
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
      await _relationshipsModel.getList(props).then((data) => {
        setDataRelationShips(data);
        // console.log(data);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
    } finally {
      setisLoading(false);
    }
  };
  ///// delete letter
  const handleDelete = (id) => {
    window._$g.dialogs.prompt("Bạn có chắc chắn muốn xóa dữ liệu đang chọn?", "xóa", (confirm) => {
      if (confirm) {
        try {
          _relationshipsModel.delete(id).then((data) => {
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
  const handleChangeRowsPerPage = (event) => {
    query.itemsPerPage = event.target.value;
    query.page = 1;
    _callAPI(query);
  };

  const handleChangePage = (event, newPage) => {
    query.page = newPage + 1;
    _callAPI(query);
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
              window._$g.rdr("/RelationShips/add");
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
                    data={dataRelationShips.items}
                    columns={getColumTable(
                      dataRelationShips.items,
                      dataRelationShips.totalItems,
                      query,
                      handleDelete
                      // handleReply,
                      // handleReview
                    )}
                    options={configTableOptions(dataRelationShips.totalItems, query.page, {
                      itemsPerPage: query.itemsPerPage,
                    })}
                  />
                  <CustomPagination
                    count={dataRelationShips.totalItems}
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

export default RelationShips;
