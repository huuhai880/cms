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
import AffPolicyCommisionService from "./Service/index";
import AffPolicyCommisionFilter from './AffPolicyCommisionFilter'

// Set layout full-wh
layoutFullWidthHeight();

const _affPolicyCommisionService = new AffPolicyCommisionService();
function AffPolicyCommision(props) {
    const [toggleSearch, setToggleSearch] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        list: [],
        total: 0,
    });

    const [query, setQuery] = useState({
        itemsPerPage: 25,
        page: 1,
        is_active: 1,
        is_deleted: 0,
        search: "",
        affiliate_type_id: null
    });


    useEffect(() => {
        getListPolicyCommision(query);
    }, [])


    const getListPolicyCommision = async (query) => {
        setIsLoading(true);
        try {
            let _data = await _affPolicyCommisionService.getList(query);
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
        let _query = {
            ...query,
            ...params,
            page: 1,
            itemsPerPage: 25,
        };
        setQuery(_query);
        getListPolicyCommision(_query);
    };


    const handleClickAdd = () => {
        window._$g.rdr("/policy-commision/add");
    };

    const handleActionItemClick = (type, id, rowIndex) => {
        let routes = {
            detail: "/policy-commision/detail/",
            edit: "/policy-commision/edit/"
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
        if (confirm) {
            _affPolicyCommisionService
                .delete(id)
                .then(() => {
                    getListPolicyCommision(query);
                })
                .catch((e) => {
                    window._$g.dialogs.alert(
                        window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
                    );
                });
        }
    };

    const handleChangePage = (event, newPage) => {
        let filter = { ...query };
        filter.page = newPage + 1;
        setQuery(filter);
        getListPolicyCommision(filter);
    };

    const handleChangeRowsPerPage = (event) => {
        let filter = { ...query };
        filter.itemsPerPage = event.target.value;
        filter.page = 1;
        setQuery(filter);
        getListPolicyCommision(filter);
    };

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
                            <AffPolicyCommisionFilter
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
                    <CheckAccess permission="AFF_POLICYCOMMISION_ADD">
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
                                        handleActionItemClick
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

export default AffPolicyCommision;