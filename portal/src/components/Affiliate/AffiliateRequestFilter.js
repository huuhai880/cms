import React, { useEffect, useState } from "react";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import DatePicker from "../Common/DatePicker";


function AffiliateRequestFilter({ handleSubmitFilter }) {

    const [filter, setFilter] = useState({
        search: "",
        startDateRegister: null,
        endDateRegister: null,
        startDateApprove: null,
        endDateApprove: null,
        statusSelected: { label: "Tất cả", value: 0 },
    });

    const [dataStatus] = useState([
        { label: "Tất cả", value: 0 },
        { label: "Yêu cầu đăng ký mới", value: 1 },
        { label: "Thành công", value: 2 },
        // { label: "KH Huỷ yêu cầu", value: 3 },
        { label: "Huỷ yêu cầu", value: 4 }
    ])


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
        let {
            search,
            startDateRegister,
            endDateRegister,
            startDateApprove,
            endDateApprove,
            statusSelected
        } = filter;

        handleSubmitFilter({
            search: search ? search.trim() : null,
            start_date_register: startDateRegister ? startDateRegister.format("DD/MM/YYYY") : null,
            end_date_register: endDateRegister ? endDateRegister.format("DD/MM/YYYY") : null,
            start_date_approve: startDateApprove ? startDateApprove.format("DD/MM/YYYY") : null,
            end_date_approve: endDateApprove ? endDateApprove.format("DD/MM/YYYY") : null,
            status: statusSelected ? statusSelected.value : 0,
            page: 1
        });
    };


    const handleClear = () => {
        setFilter({
            search: "",
            startDateRegister: null,
            endDateRegister: null,
            startDateApprove: null,
            endDateApproveL: null,
            statusSelected: { label: "Tất cả", value: 0 }
        });

        handleSubmitFilter({
            search: "",
            start_date_register: null,
            end_date_register: null,
            start_date_approve: null,
            end_date_approve: null,
            status: 0,
            page: 1
        });
    }

    const handleChangeDateRegister = ({ startDate, endDate }) => {
        setFilter((preState) => ({
            ...preState,
            startDateRegister: startDate,
            endDateRegister: endDate,
        }));
    };

    const handleChangeDateApprove = ({ startDate, endDate }) => {
        setFilter((preState) => ({
            ...preState,
            startDateApprove: startDate,
            endDateApprove: endDate,
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
                                placeholder="Nhập mã đối tác, tên đối tác, số điện thoại"
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
                                Ngày đăng ký
                            </Label>
                            <Col className="pl-0 pr-0">
                                <DatePicker
                                    startDate={filter.startDateRegister}
                                    startDateId="start_date_id_rg"
                                    endDate={filter.endDateRegister}
                                    endDateId="end_date_id_rg"
                                    onDatesChange={handleChangeDateRegister}
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
                                    startDate={filter.startDateApprove}
                                    startDateId="start_date_id_app"
                                    endDate={filter.endDateApprove}
                                    endDateId="end_date_id_app"
                                    onDatesChange={handleChangeDateApprove}
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

                </Row>
                <Row className="mt-3">                    
                    <Col
                        xs={12}
                        className={`d-flex align-items-end mt-3 justify-content-end`}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Button
                                className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                onClick={handleSubmit}
                                color="primary"
                                size="sm">
                                <i className="fa fa-search" />
                                <span className="ml-1">Tìm kiếm</span>
                            </Button>
                        </FormGroup>
                        <FormGroup className="mb-2 ml-2 mb-sm-0">
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
            </Form>
        </div>
    );
}

export default AffiliateRequestFilter;