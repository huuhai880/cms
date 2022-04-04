import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Col, FormGroup, Row, Label } from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";

// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions } from "../../utils/index";

import { getColumnTable } from "./const";
import AffiliateService from "./Service/index";
import AffiliateFilter from "./AffiliateFilter";

// Set layout full-wh
layoutFullWidthHeight();

const _affiliateService = new AffiliateService();
function Affiliate(props) {
    const [toggleSearch, setToggleSearch] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        list: [],
        total: 0,
    });

    const [memberUpLevel, setMemberUpLevel] = useState({})

    const [query, setQuery] = useState({
        itemsPerPage: 25,
        page: 1,
        is_active: 1,
        search: "",
        start_date: null,
        end_date: null,
        affiliate_type: null,
        status: 0
    });

    useEffect(() => {
        getListAffiliate(query);
    }, [])

    const getListAffiliate = async (query) => {
        setIsLoading(true);
        try {
            let _data = await _affiliateService.getListAffiliate(query);
            setData(_data);
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
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
        getListAffiliate(query_params);
    };


    const handleClickAdd = () => {
        window._$g.rdr("/affiliate/add");
    };

    const handleActionItemClick = (type, id, rowIndex) => {
        let routes = {
            detail: "/affiliate/detail/",
            edit: "/affiliate/edit/",
        };
        const route = routes[type];

        if (type.match(/detail|edit/i)) {
            window._$g.rdr(`${route}${id}`);
        } 
    };

    const handleChangePage = (event, newPage) => {
        let filter = { ...query };
        filter.page = newPage + 1;
        setQuery(filter);
        getListAffiliate(filter);
    };

    const handleChangeRowsPerPage = (event) => {
        let filter = { ...query };
        filter.itemsPerPage = event.target.value;
        filter.page = 1;
        setQuery(filter);
        getListAffiliate(filter);
    };

    const handleUpLevel = async () => {
        try {
            if(!memberUpLevel || Object.keys(memberUpLevel).length == 0){
                window._$g.dialogs.alert(
                    window._$g._("Vui lòng chọn thành viên cần nâng hạng")
                );
                return;
            }
            else{
                let member_up_level = Object.keys(memberUpLevel).map(p => p);
                await _affiliateService.upLevelAff({member_up_level});
                window._$g.toastr.show("Nâng hạng thành viên thành công!", "success");
                setMemberUpLevel({})
                getListAffiliate(query);
            }
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
            );
        }
    }

    

    return (
        <div>
            <Card className={`animated fadeIn z-index-222 mb-3`}>
                <CardHeader className="d-flex">
                    <div className="flex-fill font-weight-bold">
                        Thông tin tìm kiếm
                    </div>
                    <div
                        className="minimize-icon cur-pointer "
                        onClick={() => setToggleSearch((p) => !p)}>
                        <i className={`fa ${toggleSearch ? "fa-minus" : "fa-plus"}`} />
                    </div>

                </CardHeader>
                {toggleSearch && (
                    <CardBody className="px-0 py-0">
                        <div className="MuiPaper-filter__custom z-index-2">
                            <AffiliateFilter
                                handleSubmitFilter={handleSubmitFilter}
                            />
                        </div>
                    </CardBody>
                )}
            </Card>

            <Row>
                <Col
                    xs={12}
                    sm={4}
                    className="mb-3 d-flex"
                    style={{ alignItems: 'center' }}>
                    <CheckAccess permission="AFF_AFFILIATE_ADD">
                        <FormGroup className="mb-2 mb-sm-0">
                            <Button
                                className="mr-2 pt-2 pb-2 MuiPaper-filter__custom--button"
                                onClick={handleClickAdd}
                                color="success"
                                size="sm">
                                <i className="fa fa-plus mr-1" />
                                Thêm mới
                            </Button>
                        </FormGroup>
                    </CheckAccess>

                    <CheckAccess permission="AFF_AFFILIATE_ADD">
                        <FormGroup className="mb-2 mb-sm-0">
                            <Button
                                className="pt-2 pb-2 MuiPaper-filter__custom--button"
                                onClick={handleUpLevel}
                                color="primary"
                                size="sm">
                                <i className="fa fa-arrow-up mr-1" />
                                Nâng hạng
                            </Button>
                        </FormGroup>
                    </CheckAccess>

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
                                    columns={getColumnTable(
                                        data.list,
                                        query,
                                        handleActionItemClick,
                                        setMemberUpLevel,
                                        { ...memberUpLevel }
                                    )}
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

export default Affiliate;