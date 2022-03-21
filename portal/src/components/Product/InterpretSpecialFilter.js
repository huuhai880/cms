import React, {useState } from "react";
import {
    Col,
    Row,
    Button,
    FormGroup,
    Label,
    Input,
    Form,
} from "reactstrap";
import Select from "react-select";

function InterpretSpecialFilter({ handleSubmitFilter, handleSubmitSpecial, noEdit }) {

    const [dataCondition] = useState([
        { label: 'Tất cả', value: 2 },
        { label: 'Họặc', value: 1 },
        { label: 'Và', value: 0 },
    ])

    const [query, setQuery] = useState({
        keyword: '',
        conditionSelected: { label: 'Tất cả', value: 2 },
    })

    const handleChangeQuery = (name, val) => {
        setQuery({
            ...query,
            [name]: val
        })
    }

    const handleSubmit = () => {
        let {
            keyword,
            conditionSelected
        } = query;

        handleSubmitFilter({
            search: keyword ? keyword.trim() : null,
            is_condition_or: conditionSelected ? conditionSelected.value : 2,
            isSubmit: true
        });
    };

    const handleClear = () => {
        setQuery({
            keyword: '',
            conditionSelected: { label: 'Tất cả', value: 2 }
        })
        handleSubmitFilter({
            search: '',
            is_condition_or: 2,
            isSubmit: false
        });
    }

    const handleKeyDown = (e) => {
        if (1 * e.keyCode === 13) {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <div className="ml-3 mr-3 mb-3 mt-3">
            <Form autoComplete="nope" className="zoom-scale-9">
                <Row>
                    <Col sm={6} xs={12}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label for="inputValue" className="mr-sm-2">
                                Từ khóa
                            </Label>
                            <Col className="pl-0 pr-0">
                                <Input
                                    className="MuiPaper-filter__custom--input pr-0"
                                    autoComplete="nope"
                                    type="text"
                                    name="keyword"
                                    placeholder="Nhập tên thuộc tính, tên luận giải con, tóm tắt"
                                    value={query.keyword}
                                    onChange={(e) => handleChangeQuery('keyword', e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm={3} xs={12}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Label className="mr-sm-2">
                                Điều kiện
                            </Label>
                            <Col className="pl-0 pr-0">
                                <Select
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                    placeholder={"-- Chọn --"}
                                    onChange={(e) => handleChangeQuery('conditionSelected', e)}
                                    value={query.conditionSelected}
                                    options={dataCondition}
                                />
                            </Col>
                        </FormGroup>
                    </Col>

                    <Col sm={3} xs={12} className={`d-flex align-items-end justify-content-end`}>
                        <FormGroup className="mb-2 mb-sm-0">
                            <Button
                                className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                onClick={handleSubmit}
                                color="primary"
                                type="button"
                                size="sm"
                            >
                                <i className="fa fa-search mr-1" />
                                Tìm kiếm
                            </Button>
                        </FormGroup>
                        <FormGroup className="mb-2 ml-2 mb-sm-0">
                            <Button
                                className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                onClick={handleClear}
                                type="button"
                                size="sm"
                            >
                                <i className="fa fa-refresh mr-1" />
                                Làm mới
                            </Button>
                        </FormGroup>
                        {
                            !noEdit ?
                                <FormGroup className="mb-2 ml-2 mb-sm-0">
                                    <Button
                                        className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                        onClick={handleSubmitSpecial}
                                        color="success"
                                        type="button"
                                        size="sm"
                                    >
                                        <i className="fa fa-plus mr-1" />
                                        Chọn
                                    </Button>
                                </FormGroup> : null
                        }
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default InterpretSpecialFilter;