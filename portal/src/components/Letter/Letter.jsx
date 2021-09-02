import React, { useState, useEffect } from "react";
import { layoutFullWidthHeight } from "../../utils/html";
import Filter from "./Filter";
import { Alert, Card, CardBody, CardHeader, Col, Input, FormGroup, Button } from "reactstrap";
import { CircularProgress } from "@material-ui/core";
import { getColumTable } from "./const";
import MUIDataTable from "mui-datatables";
import { configTableOptions } from "../../utils/index";
import CustomPagination from "../../utils/CustomPagination";
import LetterModel from "../../models/LetterModel";
layoutFullWidthHeight();

function Letter() {
  const _letterModel = new LetterModel();
  const [dataLetter, setDataLetter] = useState([]);
  const [toggleSearch, settoggleSearch] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [query, setQuery] = useState({
    itemsPerPage: 10,
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
      await _letterModel.getListLetter(props).then((data) => {
        setDataLetter(data);
        console.log(data);
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
          _letterModel.delete(id).then((data) => {
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
              window._$g.rdr("/letter/add");
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
                    data={dataLetter.items}
                    columns={getColumTable(
                      dataLetter.items,
                      dataLetter.totalItems,
                      query,
                      handleDelete
                      // handleReply,
                      // handleReview
                    )}
                    options={configTableOptions(dataLetter.totalItems, query.page, {
                      itemsPerPage: query.itemsPerPage,
                    })}
                  />
                  <CustomPagination
                    count={dataLetter.totalItems}
                    rowsPerPage={query.itemsPerPage}
                    page={query.page - 1 || 0}
                    rowsPerPageOptions={[10, 25, 50]}
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

export default Letter;
