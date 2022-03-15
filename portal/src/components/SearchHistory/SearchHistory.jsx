import React, {useState, useEffect} from 'react';
import {Card, CardBody, CardHeader, Button, Col, FormGroup, Row} from 'reactstrap';

// Material
import MUIDataTable from 'mui-datatables';
import {CircularProgress} from '@material-ui/core';
import CustomPagination from '../../utils/CustomPagination';

// Component(s)
import {CheckAccess} from '../../navigation/VerifyAccess';

// Util(s)
import {layoutFullWidthHeight} from '../../utils/html';
import {configTableOptions} from '../../utils/index';

import {getColumnTable, numberWithCommas} from './const';
import SearchHistoryService from '../SearchHistory/Service/index';
import SearchHistoryFillter from './SearchHistoryFillter';
import './style.scss';

// Set layout full-wh
layoutFullWidthHeight();

const _searchHistory = new SearchHistoryService();

function SearchHistory(props) {
    const [toggleSearch, setToggleSearch] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        list: [],
        total: 0,
    });
    const [query, setQuery] = useState({
        itemsPerPage: 25,
        page: 1,
        product_id: null,
        search: '',
        start_date: null,
        end_date: null,
    });

    useEffect(() => {
        getListSearchHistory();
    }, []);

    const getListSearchHistory = async query => {
        setIsLoading(true);
        try {
            let data = await _searchHistory.getList(query);
            setData(data);
        } catch (error) {
            window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vui lòng F5 thử lại'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitFilter = params => {
        let query_params = {
            ...query,
            ...params,
            page: 1,
            itemsPerPage: 25,
        };
        setQuery(query_params);
        getListSearchHistory(query_params);
    };

    const handleChangePage = (event, newPage) => {
        let filter = {...query};
        filter.page = newPage + 1;
        setQuery(filter);
        getListSearchHistory(filter);
    };

    const handleChangeRowsPerPage = event => {
        let filter = {...query};
        filter.itemsPerPage = event.target.value;
        filter.page = 1;
        setQuery(filter);
        getListSearchHistory(filter);
    };

    return (
        <div>
            <Card className={`animated fadeIn z-index-222 mb-3`}>
                <CardHeader className="d-flex">
                    <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
                    <div className="minimize-icon cur-pointer " onClick={() => setToggleSearch(p => !p)}>
                        <i className={`fa ${toggleSearch ? 'fa-minus' : 'fa-plus'}`} />
                    </div>
                </CardHeader>
                {toggleSearch && (
                    <CardBody className="px-0 py-0">
                        <div className="MuiPaper-filter__custom z-index-2">
                            <SearchHistoryFillter handleSubmitFilter={handleSubmitFilter} total={data.total} />
                        </div>
                    </CardBody>
                )}
            </Card>

            <Row className="d-flex mb-3">
                <Col xs={12} sm={4} className="d-flex align-items-center">
                    <span className="total-search-title">Tổng số lượt tra cứu</span>
                    <div className="total-search-value">{numberWithCommas(data.total)}</div>
                </Col>
            </Row>

            <Card className="animated fadeIn">
                <CardBody className={`py-0 px-0`}>
                    <div className="MuiPaper-root__custom MuiPaper-user">
                        {isLoading ? (
                            <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                                <CircularProgress />
                            </div>
                        ) : (
                            <div>
                                <MUIDataTable
                                    data={data.list}
                                    columns={getColumnTable(data.list, query)}
                                    options={configTableOptions(data.total, 0, query)}
                                />
                                <CustomPagination
                                    count={data.total}
                                    rowsPerPage={query.itemsPerPage}
                                    page={query.page - 1 || 0}
                                    rowsPerPageOptions={[25, 50, 75, 100]}
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

export default SearchHistory;
