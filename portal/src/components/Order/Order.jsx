import React, { useState, useEffect } from "react";
import { layoutFullWidthHeight } from "../../utils/html";
import Filter from "./Filter";
import { Alert, Card, CardBody, CardHeader, Col, Input, FormGroup, Button } from "reactstrap";
import { CircularProgress } from "@material-ui/core";
import { getColumTable } from "./const";
import MUIDataTable from "mui-datatables";
import { configTableOptions } from "../../utils/index";
import CustomPagination from "../../utils/CustomPagination";
import OrderModel from "../../models/OrderModel";
layoutFullWidthHeight();
function Order() {
  const _orderModel = new OrderModel();

  const [dataOrder, setDataOrder] = useState([]);
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
      await _orderModel.getList(props).then((data) => {
        setDataOrder(data);
        // console.log(data);
      });
    } catch (error) {
      console.log(error);
      window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
    } finally {
      setisLoading(false);
    }
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
                    data={dataOrder.items}
                    columns={getColumTable(
                      dataOrder.items,
                      dataOrder.totalItems,
                      query
                    )}
                    options={configTableOptions(dataOrder.totalItems, query.page, {
                      itemsPerPage: query.itemsPerPage,
                    })}
                  />
                  <CustomPagination
                    count={dataOrder.totalItems}
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

export default Order;
