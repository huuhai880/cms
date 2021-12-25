import React, { useState } from 'react';
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import DatePicker from "../Common/DatePicker";


function ProductCommentFilter({ handleSubmitFilter }) {
    const [filter, setFilter] = useState({
        keyword: "",
        isReviewSelected: { label: "Chưa duyệt", value: "3" },
        startDate: null,
        endDate: null,
    });

    const [isReviewOption] = useState([
        { label: "Chưa duyệt", value: "3" },
        { label: "Đã duyệt", value: "1" },
        { label: "Không duyệt", value: "0" },
        { label: "Tất cả", value: "2" },
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

    const handleChangeDate = ({ startDate, endDate }) => {
        setFilter((preState) => ({
            ...preState,
            startDate,
            endDate,
        }));
    };

    const handleChangeSelect = (selected, name) => {
        setFilter((preState) => ({
            ...preState,
            [name]: selected,
        }));
    };

    const handleSubmit = () => {
        let {
            keyword,
            isReviewSelected,
            startDate,
            endDate,
        } = filter;

        handleSubmitFilter({
            keyword: keyword ? keyword.trim() : null,
            is_review: isReviewSelected ? isReviewSelected.value : 1,
            start_date: startDate ? startDate.format("DD/MM/YYYY") : null,
            end_date: endDate ? endDate.format("DD/MM/YYYY") : null
        });
    }

    const handleClear = () => {
        setFilter({
            keyword: "",
            isReviewSelected: { label: "Tất cả", value: 2 },
            startDate: null,
            endDate: null,
        });

        handleSubmitFilter({
            keyword: "",
            is_review: 3,
            start_date: null,
            end_date: null
        });
    }


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
                                name="keyword"
                                placeholder="Nhập nội dung bình luận, tên người bình luận"
                                value={filter.keyword}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                inputprops={{
                                    name: "keyword",
                                }}
                            />
                        </FormGroup>
                    </Col>

                    <Col xs={12} sm={3}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="" className="mr-sm-2">
                                Ngày bình luận
                            </Label>
                            <Col className="pl-0 pr-0">
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


                    <Col xs={12} sm={3}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="" className="mr-sm-2">
                                Trạng thái
                            </Label>
                            <Select
                                className="MuiPaper-filter__custom--select"
                                id="isReviewSelected"
                                name="isReviewSelected"
                                onChange={(selected) =>
                                    handleChangeSelect(selected, "isReviewSelected")
                                }
                                isSearchable={true}
                                placeholder={"-- Chọn --"}
                                value={filter.isReviewSelected}
                                options={isReviewOption}
                            />
                        </FormGroup>
                    </Col>

                    <Col
                        xs={12}
                        sm={3}
                        className="d-flex align-items-end justify-content-end"
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

export default ProductCommentFilter;