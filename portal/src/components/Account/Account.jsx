import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, FormGroup, Button } from "reactstrap";
import AccountFilter from "./AccountFilter";
import { layoutFullWidthHeight } from "../../utils/html";
import MUIDataTable from "mui-datatables";
import { configTableOptions } from "../../utils/index";
import CustomPagination from "../../utils/CustomPagination";
import { CircularProgress } from "@material-ui/core";
import { CheckAccess } from '../../navigation/VerifyAccess'
import AccountModel from "../../models/AccountModel";
import { getColumTable } from "./const";

layoutFullWidthHeight();
function Account() {
  const _accountModel = new AccountModel();
  const [toggleSearch, settoggleSearch] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [dataAccount, setDataAccount] = useState([]);
  const [query, setQuery] = useState({
    itemsPerPage: 25,
    page: 1,
    is_active: 1,
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
      await _accountModel.getList(props).then((data) => {
        setDataAccount(data);
        // console.log(data);
      });
    } catch (error) {
      // console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
    } finally {
      setisLoading(false);
    }
  };
  ///// delete acccount
  const handleDelete = (id) => {
    window._$g.dialogs.prompt("Bạn có chắc chắn muốn xóa dữ liệu đang chọn?", "xóa", (confirm) => {
      if (confirm) {
        try {

          _accountModel.delete(id).then((data) => {
            window._$g.toastr.show("Xóa thành công", "success");
            _callAPI(query);
          });
        } catch (error) {
          // console.log(error);
          window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại"));
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
              <AccountFilter handleSubmit={handleSubmitFillter} />
            </div>
          </CardBody>
        )}
      </Card>
      <Col xs={12} sm={4} className="d-flex align-items-end mb-3" style={{ padding: 0 }}>
      <CheckAccess permission="CRM_ACCOUNT_ADD">
        <FormGroup className="mb-2 mb-sm-0">
          <Button
            color="success"
            className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
            onClick={() => {
              window._$g.rdr("/account/add");
            }}
            size="sm"
          >
            <i className="fa fa-plus" />
            <span className="ml-1">Thêm mới</span>
          </Button>
        </FormGroup>
        </CheckAccess>
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
                    data={dataAccount.items}
                    columns={getColumTable(
                      dataAccount.items,
                      dataAccount.totalItems,
                      query,
                      handleDelete
                      // handleReply,
                      // handleReview
                    )}
                    options={configTableOptions(dataAccount.totalItems, query.page, {
                      itemsPerPage: query.itemsPerPage,
                    })}
                  />
                  <CustomPagination
                    count={dataAccount.totalItems}
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

export default Account;
