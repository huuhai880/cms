import React, {useEffect, useState} from 'react';
import {Input, Button, Form, FormGroup, Label, Col, Row} from 'reactstrap';
import Select from 'react-select';
import DatePicker from '../Common/DatePicker';
import SearchHistoryService from './Service/index';
import './style.scss';

const _searchHistoryService = new SearchHistoryService();

function SearchHistoryFillter({handleSubmitFilter}) {
    const [filter, setFilter] = useState({
        search: '',
        productSelected: null,
        startDate: null,
        endDate: null,
    });

    const [optionProduct, setOptionProduct] = useState([]);

    useEffect(() => {
        const getOptionProduct = async () => {
            try {
                let _optionProduct = await _searchHistoryService.getOptionProduct();
                setOptionProduct(_optionProduct);
            } catch (error) {
                window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vùi lòng F5 thử lại'));
            }
        };

        getOptionProduct();
    }, []);

    const handleChange = e => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value,
        });
    };

    const handleKeyDown = e => {
        if (1 * e.keyCode === 13) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleChangeSelect = (selected, name) => {
        setFilter(preState => ({
            ...preState,
            [name]: selected,
        }));
    };

    const handleSubmit = () => {
        let {search, productSelected, startDate, endDate} = filter;

        handleSubmitFilter({
            search: search ? search.trim() : null,
            product_id: productSelected ? productSelected.value : null,
            start_date: startDate ? startDate.format('DD/MM/YYYY') : null,
            end_date: endDate ? endDate.format('DD/MM/YYYY') : null,
            page: 1,
        });
    };

    const handleClear = () => {
        setFilter({
            search: '',
            productSelected: null,
            startDate: null,
            endDate: null,
        });

        handleSubmitFilter({
            search: '',
            product_id: null,
            start_date: null,
            end_date: null,
            page: 1,
        });
    };

    const handleChangeDate = ({startDate, endDate}) => {
        setFilter(preState => ({
            ...preState,
            startDate,
            endDate,
        }));
    };

    return (
        <div className="ml-3 mr-3 mb-3 mt-3">
            <Form autoComplete="nope" className="zoom-scale-9">
                <Row>
                    <Col xs={12} sm={4}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="inputValue" className="mr-sm-2">
                                Từ khóa
                            </Label>
                            <Input
                                className="MuiPaper-filter__custom--input"
                                autoComplete="nope"
                                type="text"
                                name="search"
                                placeholder="Nhập họ và tên"
                                value={filter.search}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                inputprops={{
                                    name: 'search',
                                }}
                            />
                        </FormGroup>
                    </Col>

                    <Col xs={12} sm={4}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="" className="mr-sm-2">
                                Ngày tạo từ
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
                    <Col xs={12} sm={4}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="" className="mr-sm-2">
                                Sản phẩm
                            </Label>
                            <Select
                                className="MuiPaper-filter__custom--select"
                                id="productSelected"
                                name="productSelected"
                                onChange={selected => handleChangeSelect(selected, 'productSelected')}
                                isSearchable={true}
                                placeholder={'-- Chọn --'}
                                value={filter.productSelected}
                                options={optionProduct}
                                isClearable={true}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12} className={`d-flex align-items-end mt-3 justify-content-end`}>
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

export default SearchHistoryFillter;
