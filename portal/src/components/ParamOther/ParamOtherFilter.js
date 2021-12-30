import React, {useState } from "react";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

function ParamOtherFilter({ handleSubmitFilter }) {
    const [filter, setFilter] = useState({
        keyword: "",
        isActiveSelected: { label: "Có", value: 1 },
    });

    const [dataIsActive] = useState([
        { label: "Tất cả", value: 2 },
        { label: "Có", value: 1 },
        { label: "Không", value: 0 },
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


    const handleSubmit = () => {
        let { keyword, isActiveSelected } = filter;
        handleSubmitFilter({
            keyword: keyword ? keyword.trim() : null,
            is_active: isActiveSelected ? isActiveSelected.value : 1,
            page: 1
        });
    };

    const handleClear = () => {
        setFilter({
            keyword: "",
            isActiveSelected: { label: "Có", value: 1 }
        });

        handleSubmitFilter({
            keyword: "",
            is_active: 1,
            page: 1
        });
    };

    const handleChangeSelect = (selected, name) => {
        setFilter((preState) => ({
            ...preState,
            [name]: selected,
        }));
    };


    return (
        <div className="ml-3 mr-3 mb-3 mt-3">
            <Form autoComplete="nope" className="zoom-scale-9">
                <Row>
                    <Col xs={12} sm={6}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="inputValue" className="mr-sm-2">
                                Từ khóa
                            </Label>
                            <Input
                                className="MuiPaper-filter__custom--input"
                                autoComplete="nope"
                                type="text"
                                name="keyword"
                                placeholder="Nhập tên biến số"
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
                                Kích hoạt
                            </Label>
                            <Select
                                className="MuiPaper-filter__custom--select"
                                id="isActiveSelected"
                                name="isActiveSelected"
                                onChange={(selected) => handleChangeSelect(selected, "isActiveSelected")}
                                isSearchable={true}
                                placeholder={"-- Chọn --"}
                                value={filter.isActiveSelected}
                                options={dataIsActive}
                            />
                        </FormGroup>
                    </Col>

                    <Col xs={12}
                        sm={3}
                        className="d-flex align-items-end justify-content-end">
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

export default ParamOtherFilter;