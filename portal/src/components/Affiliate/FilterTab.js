import React from "react";
import {
    Col,
    Row,
    Button,
    FormGroup,
    Label
} from "reactstrap";
import { useState } from "react";
// import DatePicker from "../Common/DatePicker";
import { DatePicker, Space } from 'antd';
import moment from 'moment'

function FilterTab({ handleSubmitFilter, label = "Thời gian tạo" }) {
    const [filter, setFilter] = useState({
        month: moment()
    });

    const handleClear = () => {
        setFilter({
            month: null
        });

        handleSubmitFilter({
            month: null,
            page: 1,
        });
    }

    const handleSubmit = () => {
        let {
            month
        } = filter;

        handleSubmitFilter({
            month: month ? moment(month).format('DD/MM/YYYY') : null,
            page: 1
        });
    };

    const onChange = (date, dateString) => {
        setFilter((preState) => ({
            ...preState,
            month: date
        }));
    }

    return (
        <Row>
            <Col xs={5}>
                <FormGroup row className="align-items-center">
                    <Label sm={4}>
                        {label}
                    </Label>
                    <Col sm={8}>
                        <DatePicker onChange={onChange}
                            picker="month"
                            placeholder={"Chọn Tháng"}
                            className="form-control"
                            value={filter.month}
                            allowClear={false}
                        />
                    </Col>
                </FormGroup>
            </Col>
            <Col xs={5} className={`d-flex align-items-end`}>
                <FormGroup>
                    <Button
                        className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                        onClick={handleSubmit}
                        color="primary"
                        size="sm">
                        <i className="fa fa-search" />
                        <span className="ml-1">Tìm kiếm</span>
                    </Button>
                </FormGroup>
                <FormGroup className="ml-2">
                    <Button
                        className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                        onClick={handleClear}
                        size="sm">
                        <i className="fa fa-refresh" />
                        <span className="ml-1">Làm mới</span>
                    </Button>
                </FormGroup>
            </Col>
        </Row>
    );
}

export default FilterTab;