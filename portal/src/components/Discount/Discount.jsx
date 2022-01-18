import React, {useState, useEffect} from 'react';
import {Card, CardBody, CardHeader, Col, FormGroup, Button} from 'reactstrap';
import {layoutFullWidthHeight} from '../../utils/html';
import MUIDataTable from 'mui-datatables';
import {configTableOptions} from '../../utils/index';
import CustomPagination from '../../utils/CustomPagination';
import {CircularProgress} from '@material-ui/core';
import DiscountModel from '../../models/DiscountModel';
import {getColumTable} from './colums';
import {CheckAccess} from '../../navigation/VerifyAccess';
import Filter from './Filter';

layoutFullWidthHeight();

function Discount() {
  const _discountModel = new DiscountModel();
  const [dataDiscount, setDataDiscount] = useState([]);
  const [toggleSearch, settoggleSearch] = useState(true);
  const [isLoading, setisLoading] = useState(true);

  const [query, setQuery] = useState({
    itemsPerPage: 25,
    page: 1,
    keyword: null,
    isActive: 1,
    status: 0,
    isDeleted: 0,
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    getDiscounts(query);
  }, []);

  const handleSubmitFillter = async value => {
    let searchQuery = Object.assign(query, value);
    getDiscounts(searchQuery);
  };

  const getDiscounts = async (filter) => {
    setisLoading(true);
    try {
      let data = await _discountModel.getListDiscount(filter);
      setDataDiscount(data);
    } catch (error) {
      window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vùi lòng F5 thử lại'));
    } finally {
      setisLoading(false);
    }
  };

  const handleDelete = id => {
    window._$g.dialogs.prompt('Bạn có chắc chắn muốn xóa dữ liệu đang chọn?', 'xóa', confirm => {
      if (confirm) {
        try {
          _discountModel.delete(id).then(data => {
            window._$g.toastr.show('Xóa thành công', 'success');
            getDiscounts(query);
          });
        } catch (error) {
          window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vùi lòng F5 thử lại'));
        } finally {
          setisLoading(false);
        }
      }
    });
  };

  const handleChangeRowsPerPage = event => {
    query.itemsPerPage = event.target.value;
    query.page = 1;
    getDiscounts(query);
  };

  const handleChangePage = (event, newPage) => {
    query.page = newPage + 1;
    getDiscounts(query);
  };

  return (
    <div>
      <Card className="animated fadeIn z-index-222 mb-3 ">
        <CardHeader className="d-flex">
          <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
          <div className="minimize-icon cur-pointer" onClick={() => settoggleSearch(!toggleSearch)}>
            <i className={`fa ${toggleSearch ? 'fa-minus' : 'fa-plus'}`} />
          </div>
        </CardHeader>
        {toggleSearch && (
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-filter__custom">
              <Filter handleSubmit={handleSubmitFillter} />
            </div>
          </CardBody>
        )}
      </Card>
      <Col xs={12} sm={4} className="d-flex align-items-end mb-3" style={{padding: 0}}>
        <CheckAccess permission="PRO_DISCOUNT_ADD">
          <FormGroup className="mb-2 mb-sm-0">
            <Button
              color="success"
              className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
              onClick={() => {
                window._$g.rdr('/discount/add');
              }}
              size="sm">
              <i className="fa fa-plus" />
              <span className="ml-1">Thêm mới</span>
            </Button>
          </FormGroup>
        </CheckAccess>
      </Col>
      <Card className={`animated fadeIn mb-3 `}>
        <CardBody className="px-0 py-0">
          <Col xs={12} style={{padding: 0}}>
            <div className="MuiPaper-root__custom">
              {isLoading ? (
                <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                  <CircularProgress />
                </div>
              ) : (
                <div>
                  <MUIDataTable
                    data={dataDiscount.items}
                    columns={getColumTable(
                      dataDiscount.items,
                      dataDiscount.totalItems,
                      query,
                      handleDelete,
                    )}
                    options={configTableOptions(dataDiscount.totalItems, query.page, {
                      itemsPerPage: query.itemsPerPage,
                    })}
                  />
                  <CustomPagination
                    count={dataDiscount.totalItems}
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

export default Discount;
