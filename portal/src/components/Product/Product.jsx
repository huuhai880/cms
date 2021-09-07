import React from "react";
import { Card, CardBody, CardHeader, Button, Col, FormGroup } from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress, Checkbox} from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";

// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions } from "../../utils/index";

import { useState } from "react";
import ProductFilter from "./ProductFilter";
import { getColumnTable } from "./ProductConstant";

import ProductModel from "../../models/ProductModel/index";
import { useEffect } from "react";

// Set layout full-wh
layoutFullWidthHeight();

const _productModel = new ProductModel();

function Product({ handlePick = null, isOpenModal = false, products = [] }) {
  const [toggleSearch, setToggleSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    list: [],
    total: 0,
  });
  const [query, setQuery] = useState({
    itemsPerPage: handlePick ? 10 : 25,
    page: 1,
    is_active: 1,
    search: "",
    product_category_id: null,
    start_date: null,
    end_date: null,
  });

  const [pickItems, setPickItems] = useState({})

  useEffect(() => {
    getListProduct(query);

    const _pickItems = products ? (products||[]).reduce((obj, item) => {
      obj[item.product_id] = item;
      return obj;
    }, {}) : {};
    setPickItems(_pickItems)

  }, []);

  const getListProduct = async (query) => {
    setIsLoading(true);
    try {
      let data = await _productModel.getList(query);
      setData(data);
    } catch (error) {
      window._$g.dialogs.alert(
        window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFilter = (params) => {
    let query_params = {
      ...query,
      ...params,
      page: 1,
      itemsPerPage: 25,
    };
    setQuery(query_params);
    getListProduct(query_params);
  };

  const handleClickAdd = () => {
    window._$g.rdr("/product/add");
  };

  const handleActionItemClick = (type, id, rowIndex) => {
    let routes = {
      detail: "/product/detail/",
      delete: "/product/delete/",
      edit: "/product/edit/",
    };
    const route = routes[type];

    if (type.match(/detail|edit/i)) {
      window._$g.rdr(`${route}${id}`);
    } else {
      window._$g.dialogs.prompt(
        "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
        "Xóa",
        (confirm) => handleClose(confirm, id, rowIndex)
      );
    }
  };

  const handleClose = (confirm, id, rowIndex) => {
    const { list } = data;
    if (confirm) {
      _productModel
        .delete(id)
        .then(() => {
          const cloneData = JSON.parse(JSON.stringify(list));
          cloneData.splice(rowIndex, 1);
          setData({ list: cloneData, total: data.total - 1 });
        })
        .catch((e) => {
          window._$g.dialogs.alert(
            window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
          );
        });
    }
  };

  const handleChangePage = (event, newPage) => {
    let filter = { ...query };
    filter.page = newPage + 1;
    setQuery(filter);
    getListProduct(filter);
  };

  const handleChangeRowsPerPage = (event) => {
    let filter = { ...query };
    filter.itemsPerPage = event.target.value;
    filter.page = 1;
    setQuery(filter);
    getListProduct(filter);
  };

  const handleAddProduct = () => {
    if(handlePick){
      handlePick(pickItems)
      setPickItems({})
    }
  };

  return (
    <div>
      <Card
        className={`animated fadeIn z-index-222 mb-3 ${
          handlePick ? "news-header-no-border" : ""
        }`}
      >
        <CardHeader className="d-flex"
        style={{
          padding: handlePick? '0.55rem' : '0.55rem 1.25rem',
          alignItems: handlePick ? 'center' : 'unset'
        }}>
          <div className="flex-fill font-weight-bold">
            {handlePick ? "Thêm sản phẩm" : "Thông tin tìm kiếm"}
          </div>
          {handlePick ? (
            <Button color="danger" size="md" onClick={() => handlePick({})}>
              <i className={`fa fa-remove`} />
            </Button>
          ) : (
            <div
              className="minimize-icon cur-pointer "
              onClick={() => setToggleSearch((p) => !p)}
            >
              <i className={`fa ${toggleSearch ? "fa-minus" : "fa-plus"}`} />
            </div>
          )}
        </CardHeader>
        {toggleSearch && (
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-filter__custom z-index-2">
              <ProductFilter
                handleSubmitFilter={handleSubmitFilter}
                handlePick={handlePick ? handleAddProduct : null}
              />
            </div>
          </CardBody>
        )}
      </Card>

      {!handlePick && (
        <Col
          xs={12}
          sm={4}
          className="d-flex align-items-end mb-3"
          style={{ padding: 0 }}
        >
          <CheckAccess permission="MD_PRODUCT_ADD">
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
      )}

      <Card
        className="animated fadeIn"
        style={{ marginBottom: handlePick ? 0 : "1.5rem", border: "none" }}
      >
        <CardBody className={`py-0 ${!isOpenModal ? "px-0" : ""}`}>
          <div className="MuiPaper-root__custom MuiPaper-user">
            {isLoading ? (
              <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                <CircularProgress />
              </div>
            ) : (
              <div>
                <MUIDataTable
                  data={data.list}
                  columns={getColumnTable(
                    data.list,
                    query,
                    handleActionItemClick,
                    handlePick,
                    {...pickItems},
                    setPickItems
                  )}
                  options={configTableOptions(data.total, 0, query)}
                />
                <CustomPagination
                  count={data.total}
                  rowsPerPage={query.itemsPerPage}
                  page={query.page - 1 || 0}
                  rowsPerPageOptions={
                    handlePick ? [10, 25, 50, 75, 100] : [25, 50, 75, 100]
                  }
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Product;
