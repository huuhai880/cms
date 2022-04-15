import React, { useEffect } from "react";
import {
    Col,
    Row
} from "reactstrap";
import { useState } from "react";
import { columnsCustomer } from "./const";
import "./style.scss";
import FilterTab from "./FilterTab";
import TableTab from "./TableTab";
import AffiliateService from "./Service/index";

const _affiliateService = new AffiliateService();
function TabCustomer({ member_id }) {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        list: [],
        total: 0,
    });

    const [query, setQuery] = useState({
        itemsPerPage: 25,
        page: 1,
        month: null
    });

    useEffect(() => {
        getListCustomerAff(query)
    }, [])

    const handleChangePage = (event, newPage) => {
        let filter = { ...query };
        filter.page = newPage + 1;
        setQuery(filter);
        getListCustomerAff(filter)
    };

    const handleChangeRowsPerPage = (event) => {
        let filter = { ...query };
        filter.itemsPerPage = event.target.value;
        filter.page = 1;
        setQuery(filter);
        getListCustomerAff(filter)
    };

    const handleSubmitFilter = (params) => {
        let _query = {
            ...query,
            ...params,
            page: 1,
            itemsPerPage: 25,
        };
        setQuery(_query);
        getListCustomerAff(_query)
    };

    const getListCustomerAff = async (query) => {
        setIsLoading(true)
        try {
            query.member_id = member_id;
            query.type = 'customer';
            let _data = await _affiliateService.getDataOfAffiliate(query);
            setData(_data)
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
            );
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <Row>
            <Col xs={12}>
                <FilterTab handleSubmitFilter={handleSubmitFilter}
                    label="Tháng giới thiệu"
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