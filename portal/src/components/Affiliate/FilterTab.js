import React from "react";
import {
    Col,
    Row,
    Button,
    FormGroup,
    Label
} from "reactstrap";
import { useState } from "react";
import DatePicker from "../Common/DatePicker";


function FilterTab({ handleSubmitFilter, label = "Thời gian tạo" }) {
    const [filter, setFilter] = useState({
        startDate: null,
        endDate: null,
    });

    const handleChangeDate = ({ startDate, endDate }) => {
        setFilter((preState) => ({
            ...preState,
            startDate,
            endDate,
        }));
    };

    const handleClear = () => {
        setFilter({
            startDate: null,
            endDate: null,
        });

        handleSubmitFilter({
            start_date: null,
            end_date: null,
            page: 1,
        });
    }

    const handleSubmit = () => {
        let {
            startDate,
            endDate,
        } = filter;

        handleSubmitFilter({
            start_date: startDate ? startDate.format("DD/MM/YYYY") : null,
            end_date: endDate ? endDate.format("DD/MM/YYYY") : null,
            page: 1,
        });
    };

    return (
        <Row>
            <Col xs={6}>
                <FormGroup row className="align-items-center">
                    <Label sm={3}>
                        {label}
                    </Label>
                    <Col sm={9}>
                        <DatePicker
                            startDate={filter.startDate}
                            startDateId="start_date_id"
                            endDate={filter.endDate}
                            endDateId="end_date_id"
                            onDatesChange={handleChangeDate}
                            isMultiple
                        />
                    </Col>
                </FormGroup>
            </Col>
            <Col xs={6} className={`d-flex align-items-end`}>
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