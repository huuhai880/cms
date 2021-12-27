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
import { configTableOptions } from "../../utils/index";
import CustomPagination from "../../utils/CustomPagination";
import OrderModel from "../../models/OrderModel";
import moment from "moment";
import { CheckAccess } from "../../navigation/VerifyAccess";

layoutFullWidthHeight();

function Order() {
  const _orderModel = new OrderModel();
  const [dataOrder, setDataOrder] = useState([]);
  const [toggleSearch, settoggleSearch] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [query, setQuery] = useState({
    itemsPerPage: 25,
    page: 1,
    keyword: null,
    order_status: 1,
    is_deleted: 0,
    start_date: moment().startOf("month").format("DD/MM/YYYY"),
    end_date: moment().format("DD/MM/YYYY"),
    product_id: null,
    combo_id: null,
    from_price: 0,
    to_price: 0,
    order_type: 2,
    is_combo:false
  });

  useEffect(() => {
    _callAPI(query);
  }, []);

  const handleSubmitFillter = async (params) => {
    let searchQuery = {
      ...query,
      ...params,
      page: 1,
      itemsPerPage: 25,
    };
    setQuery(searchQuery);
    _callAPI(searchQuery);
  };

  const _callAPI = async (props) => {
    setisLoading(true);
    try {
      let data = await _orderModel.getList(props);
      setDataOrder(data);
    } catch (error) {
      window._$g.dialogs.alert(
        window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại")
      );
    } finally {
      setisLoading(false);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    let filter = { ...query };
    filter.itemsPerPage = event.target.value;
    filter.page = 1;
    setQuery(filter);
    _callAPI(filter);
  };

  const handleChangePage = (event, newPage) => {
    let filter = { ...query };
    filter.page = newPage + 1;
    setQuery(filter);
    _callAPI(filter);
  };

  const handleDelete = (id) => {
    window._$g.dialogs.prompt(
      "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
      "xóa",
      (confirm) => {
        if (confirm) {
          try {
            _orderModel.delete(id).then((data) => {
              window._$g.toastr.show("Xóa thành công", "success");
              _callAPI(query);
            });
          } catch (error) {
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

  const handleClickAdd = () => {
    window._$g.rdr("/order/add");
  };

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
              <Filter handleSubmitFillter={handleSubmitFillter} report={dataOrder.report}/>
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
        <CheckAccess permission="SL_ORDER_ADD">
          <FormGroup className="mb-2 mb-sm-0">
            <Button
              className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
              onClick={handleClickAdd}
              color="success"
              size="sm"
            >
              <i className="fa fa-plus mr-1" />
              Thêm mới
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
                    data={dataOrder.items}
                    columns={getColumTable(
                      dataOrder.items,
                      dataOrder.totalItems,
                      query,
                      handleDelete,
                      dataOrder.items.find(p => p.status == 0) ? false : true
                    )}
                    options={configTableOptions(
                      dataOrder.totalItems,
                      query.page,
                      {
                        itemsPerPage: query.itemsPerPage,
                      }
                    )}
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
