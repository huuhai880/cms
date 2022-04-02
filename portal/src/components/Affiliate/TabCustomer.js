import React from "react";
import {
    Col,
    Row
} from "reactstrap";
import { useState } from "react";
import { columnsCustomer } from "./const";
import "./style.scss";
import FilterTab from "./FilterTab";
import TableTab from "./TableTab";

function TabCustomer(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        list: [],
        total: 0,
    });

    const [query, setQuery] = useState({
        itemsPerPage: 25,
        page: 1,
        start_date: null,
        end_date: null,
    });

    const handleChangePage = (event, newPage) => {
        let filter = { ...query };
        filter.page = newPage + 1;
        setQuery(filter);
    };

    const handleChangeRowsPerPage = (event) => {
        let filter = { ...query };
        filter.itemsPerPage = event.target.value;
        filter.page = 1;
        setQuery(filter);
    };

    const handleSubmitFilter = (params) => {
        let query_params = {
            ...query,
            ...params,
            page: 1,
            itemsPerPage: 25,
        };
        setQuery(query_params);
    };

    return (
        <Row>
            <Col xs={12}>
                <FilterTab handleSubmitFilter={handleSubmitFilter}
                 label="Ngày đăng ký"
                />
            </Col>
            <Col xs={12}>
                <TableTab
                    columns={columnsCustomer(query)}
                    data={data}
                    query={query}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    isLoading={isLoading}
                />
            </Col>
        </Row>
    );

}

export default TabCustomer;