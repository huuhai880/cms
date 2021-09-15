import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader} from "reactstrap";

import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions } from "../../utils/index";
import MembershipFilter from "components/Membership/MembershipFilter";
import { getColumnTable } from "./_constant";

import MembershipModel from "../../models/MembershipModel/index";

// Set layout full-wh
layoutFullWidthHeight();

const _membershipModel = new MembershipModel();

function Membership(props) {
    const [toggleSearch, setToggleSearch] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        list: [],
        total: 0,
    });
    const [query, setQuery] = useState({
        itemsPerPage: 25,
        page: 1,
        search: "",
        start_date: null,
        end_date: null,
    });
    

    useEffect(() => {
        getListMembership(query);
    }, []);


    const getListMembership = async (query) => {
        setIsLoading(true);
        try {
            let data = await _membershipModel.getList(query);
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
        getListMembership(query_params);
    };

    const handleChangePage = (event, newPage) => {
        let filter = { ...query };
        filter.page = newPage + 1;
        setQuery(filter);
        getListMembership(filter);
    };

    const handleChangeRowsPerPage = (event) => {
        let filter = { ...query };
        filter.itemsPerPage = event.target.value;
        filter.page = 1;
        setQuery(filter);
        getListMembership(filter);
    };

   return (
        <div>
            <Card className={`animated fadeIn z-index-222 mb-3`}>
                <CardHeader className="d-flex">
                    <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
                    <div
                        className="minimize-icon cur-pointer "
                        onClick={() => setToggleSearch((p) => !p)}
                    >
                        <i className={`fa ${toggleSearch ? "fa-minus" : "fa-plus"}`} />
                    </div>
                </CardHeader>
                {toggleSearch && (
                    <CardBody className="px-0 py-0">
                        <div className="MuiPaper-filter__custom z-index-2">
                            <MembershipFilter handleSubmitFilter={handleSubmitFilter} />
                        </div>
                    </CardBody>
                )}
            </Card>

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
                                        query
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

export default Membership;