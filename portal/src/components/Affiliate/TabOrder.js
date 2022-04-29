import React, { useEffect } from "react";
import {
    Col,
    Row
} from "reactstrap";
import { useState } from "react";
import { columnsOrder } from "./const";
import "./style.scss";
import FilterTab from "./FilterTab";
import TableTab from "./TableTab";
import AffiliateService from "./Service/index";

const _affiliateService = new AffiliateService()
function TabOrder({ member_id }) {
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
        getListOrderAff(query);
    }, [])

    const handleChangePage = (event, newPage) => {
        let filter = { ...query };
        filter.page = newPage + 1;
        setQuery(filter);
        getListOrderAff(filter);
    };

    const handleChangeRowsPerPage = (event) => {
        let filter = { ...query };
        filter.itemsPerPage = event.target.value;
        filter.page = 1;
        setQuery(filter);
        getListOrderAff(filter);
    };

    const handleSubmitFilter = (params) => {
        let filter = {
            ...query,
            ...params,
            page: 1,
            itemsPerPage: 25,
        };
        setQuery(filter);
        getListOrderAff(filter);
    };

    const getListOrderAff = async (query) => {
        setIsLoading(true)
        try {
            query.member_id = member_id;
            query.type = 'order';
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
                    label="Tháng ghi nhận"
                />
            </Col>
            <Col xs={12}>
                <TableTab
                    columns={columnsOrder(query)}
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

export default TabOrder;