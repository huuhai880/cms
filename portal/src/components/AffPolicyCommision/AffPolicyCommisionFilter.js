import React, { useEffect, useState } from "react";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import DatePicker from "../Common/DatePicker";
import AffiliateService from "components/Affiliate/Service/index";
const _affiliateService = new AffiliateService();

function AffPolicyCommisionFilter({ handleSubmitFilter }) {

    const [filter, setFilter] = useState({
        search: "",
        isActiveSelected: { label: "Có", value: 1 },
        isDeletedSelected: { label: "Không", value: 0 },
        affiliateTypeSelected: null
    });

    const [dataSelect] = useState([
        { label: "Tất cả", value: 2 },
        { label: "Có", value: 1 },
        { label: "Không", value: 0 }
    ])

    const [optionAffType, setOptionAffType] = useState([]);

    useEffect(() => {
        const initDataSelect = async () => {
            try {
                let { affiliate_type } = await _affiliateService.getOption();
                setOptionAffType(affiliate_type);
            } catch (error) {
                window._$g.dialogs.alert(
                    window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
                );
            }
        }

        initDataSelect();
    }, [])

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
            isActiveSelected,
            isDeletedSelected,
            affiliateTypeSelected
        } = filter;

        handleSubmitFilter({
            search: search ? search.trim() : null,
            is_active: isActiveSelected ? isActiveSelected.value : 1,
            is_deleted: isDeletedSelected ? isDeletedSelected.value : 0,
            affiliate_type_id: affiliateTypeSelected ? affiliateTypeSelected.value : null,
            page: 1
        });
    };


    const handleClear = () => {
        setFilter({
            search: "",
            isActiveSelected: { label: "Có", value: 1 },
            isDeletedSelected: { label: "Không", value: 0 },
            affiliateTypeSelected: null
        });

        handleSubmitFilter({
            search: '',
            is_active: 1,
            is_deleted: 0,
            affiliate_type_id: null,
            page: 1
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
                                name="search"
                                placeholder="Nhập tên chính sách"
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
                                Loại
                            </Label>
                            <Select
                                className="MuiPaper-filter__custom--select"
                                id="affiliateTypeSelected"
                                name="affiliateTypeSelected"
                                onChange={(selected) => handleChangeSelect(selected, "affiliateTypeSelected")}
                                isSearchable={true}
                                placeholder={"-- Chọn --"}
                                value={filter.affiliateTypeSelected}
                                options={optionAffType}
                                isClearable={true}
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
                                options={dataSelect}
                            />
                        </FormGroup>
                    </Col>

                    <Col xs={12} sm={3}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="" className="mr-sm-2">
                                Đã xoá
                            </Label>
                            <Select
                                className="MuiPaper-filter__custom--select"
                                id="isDeletedSelected"
                                name="isDeletedSelected"
                                onChange={(selected) => handleChangeSelect(selected, "isDeletedSelected")}
                                isSearchable={true}
                                placeholder={"-- Chọn --"}
                                value={filter.isDeletedSelected}
                                options={dataSelect}
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

export default AffPolicyCommisionFilter;