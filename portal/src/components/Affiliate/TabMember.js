import React from "react";
import {
    Col,
    Row
} from "reactstrap";
import { useState } from "react";
import { columnsMember } from "./const";
import "./style.scss";
import FilterTab from "./FilterTab";
import TableTab from "./TableTab";
import AffiliateService from "./Service/index";

const _affiliateService = new AffiliateService();

function TabMember({member_id}) {
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
        getListMemberAff(filter)
    };

    const handleChangeRowsPerPage = (event) => {
        let filter = { ...query };
        filter.itemsPerPage = event.target.value;
        filter.page = 1;
        setQuery(filter);
        getListMemberAff(filter)
    };

    const handleSubmitFilter = (params) => {
        let _query = {
            ...query,
            ...params,
            page: 1,
            itemsPerPage: 25,
        };
        setQuery(_query);
        getListMemberAff(_query)
    };

    const getListMemberAff = async (query) => {
        setIsLoading(true)
        try {
            query.member_id = member_id;
            query.type = 'member';
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
                    label="Ngày đăng ký" />
            </Col>
            <Col xs={12}>
                <TableTab
                    columns={columnsMember(query)}
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

export default TabMember;