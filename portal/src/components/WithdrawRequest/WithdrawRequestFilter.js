import React, { useEffect, useState } from "react";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import DatePicker from "../Common/DatePicker";

function WithdrawRequestFilter({ handleSubmitFilter }) {

    const [filter, setFilter] = useState({
        search: "",
        statusSelected: { label: "Tất cả", value: 0 },
        startDateRequest: null,
        endDateRequest: null,
        startDateConfirm: null,
        endDateConfirm: null,
    });

    const [dataStatus] = useState([
        { label: "Tất cả", value: 0 },
        { label: "Đã hoàn thành", value: 2 },
        { label: "Yêu cầu rút tiền mới", value: 1 },
        { label: "Không duyệt", value: 4 },
        { label: "KH Huỷ yêu cầu", value: 3 }
    ]);


    const handleChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value,
        });
    };

    const handleKeyDown = (e) => {
        if (1 * e.keyCode === 13) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleChangeSelect = (selected, name) => {
        setFilter((preState) => ({
            ...preState,
            [name]: selected,
        }));
    };

    const handleSubmit = () => {
        let { search, statusSelected, startDateRequest, endDateRequest, startDateConfirm, endDateConfirm } = filter;

        handleSubmitFilter({
            search: search ? search.trim() : null,
            status: statusSelected ? statusSelected.value : 0,
            start_date_request: startDateRequest ? startDateRequest.format("DD/MM/YYYY") : null,
            end_date_request: endDateRequest ? endDateRequest.format("DD/MM/YYYY") : null,
            start_date_confirm: startDateConfirm ? startDateConfirm.format("DD/MM/YYYY") : null,
            end_date_confirm: endDateConfirm ? endDateConfirm.format("DD/MM/YYYY") : null,
            page: 1,
        });
    };

    const handleClear = () => {
        setFilter({
            search: "",
            statusSelected: { label: "Tất cả", value: 0 },
            startDateRequest: null,
            endDateRequest: null,
            startDateConfirm: null,
            endDateConfirm: null,
        });

        handleSubmitFilter({
            search: '',
            status: 0,
            start_date_request: null,
            end_date_request: null,
            start_date_confirm: null,
            end_date_confirm: null,
            page: 1,
        });
    }

    const handleChangeDateRequest = ({ startDate, endDate }) => {
        setFilter((preState) => ({
            ...preState,
            startDateRequest: startDate,
            endDateRequest: endDate,
        }));
    };

    const handleChangeDateConfirm = ({ startDate, endDate }) => {
        setFilter((preState) => ({
            ...preState,
            startDateConfirm: startDate,
            endDateConfirm: endDate,
        }));
    };

    return (
        <div className="ml-3 mr-3 mb-3 mt-3">
            <Form autoComplete="nope" className="zoom-scale-9">
                <Row>
                    <Col xs={12} sm={3}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="inputValue" className="mr-sm-2">
                                Từ khóa
                            </Label>
                            <Input
                                className="MuiPaper-filter__custom--input"
                                autoComplete="nope"
                                type="text"
                                name="search"
                                placeholder="Nhập mã đối tác, tên đối tác"
                                value={filter.search}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                inputprops={{
                                    name: "search",
                                }}
                            />
                        </FormGroup>
                    </Col>

                    <Col xs={12} sm={3}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="" className="mr-sm-2">
                                Ngày yêu cầu
                            </Label>
                            <Col className="pl-0 pr-0">
                                <DatePicker
                                    startDate={filter.startDateRequest}
                                    startDateId="start_date_id_rq"
                                    endDate={filter.endDateRequest}
                                    endDateId="end_date_id_rq"
                                    onDatesChange={handleChangeDateRequest}
                                    isMultiple
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={3}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="" className="mr-sm-2">
                                Ngày xác nhận
                            </Label>
                            <Col className="pl-0 pr-0">
                                <DatePicker
                                    startDate={filter.startDateConfirm}
                                    startDateId="start_date_id_cf"
                                    endDate={filter.endDateConfirm}
                                    endDateId="end_date_id_cf"
                                    onDatesChange={handleChangeDateConfirm}
                                    isMultiple
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={3}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="" className="mr-sm-2">
                                Trạng thái
                            </Label>
                            <Select
                                className="MuiPaper-filter__custom--select"
                                id="statusSelected"
                                name="statusSelected"
                                onChange={(selected) => handleChangeSelect(selected, "statusSelected")}
                                isSearchable={true}
                                placeholder={"-- Chọn --"}
                                value={filter.statusSelected}
                                options={dataStatus}
                            />
                        </FormGroup>
                    </Col>

                    <Col
                        xs={12}
                        className={`d-flex align-items-end mt-3 justify-content-end`}
                    >
                        <FormGroup className="mb-2 mb-sm-0">
                            <Button
                                className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                onClick={handleSubmit}
                                color="primary"
                                size="sm"
                            >
                                <i className="fa fa-search" />
                                <span className="ml-1">Tìm kiếm</span>
                            </Button>
                        </FormGroup>
                        <FormGroup className="mb-2 ml-2 mb-sm-0">
                            <Button
                                className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                onClick={handleClear}
                                size="sm"
                            >
                                <i className="fa fa-refresh" />
                                <span className="ml-1">Làm mới</span>
                            </Button>
                        </FormGroup>
                        
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default WithdrawRequestFilter;