import React, { useEffect, useState } from "react";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import DatePicker from "../Common/DatePicker";

export default function ProductComboFilter({ query = {}, handleSubmitFilter, handlePick = null }) {
  const [filter, setFilter] = useState({
    search: "",
    isActiveSelected: { label: "Có", value: 1 },
    isShowWebSelected: { label: "Có", value: 1 },
    startDate: null,
    endDate: null,
  });

  const [dataIsActive] = useState([
    { label: "Tất cả", value: 2 },
    { label: "Có", value: 1 },
    { label: "Không", value: 0 },
  ]);
  const [dataIsShowWeb] = useState([
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

  const handleChangeSelect = (selected, name) => {
    setFilter((preState) => ({
      ...preState,
      [name]: selected,
    }));
  };

  const handleSubmit = () => {
    let { search, isActiveSelected, isShowWebSelected, startDate, endDate } = filter;

    handleSubmitFilter({
      search: search ? search.trim() : null,
      is_active: isActiveSelected ? isActiveSelected.value : 1,
      is_web_view: isShowWebSelected ? isShowWebSelected.value : 1,
      start_date: startDate ? startDate.format("DD/MM/YYYY") : null,
      end_date: endDate ? endDate.format("DD/MM/YYYY") : null,
      page: 1,
    });
  };

  const handleClear = () => {
    setFilter({
      search: "",
      isActiveSelected: { label: "Có", value: 1 },
      isShowWebSelected: { label: "Có", value: 1 },

      startDate: null,
      endDate: null,
    });

    handleSubmitFilter({
      search: "",
      is_active: 1,
      is_web_view: 1,
      start_date: null,
      end_date: null,
      page: 1,
    });
  };

  const handleChangeDate = ({ startDate, endDate }) => {
    setFilter((preState) => ({
      ...preState,
      startDate,
      endDate,
    }));
  };

  return (
    <div className="ml-3 mr-3 mb-3 mt-3">
      <Form autoComplete="nope" className="zoom-scale-9">
        <Row>
          <Col xs={12} sm={handlePick ? 4 : 3}>
            <FormGroup className="mb-2 mb-sm-0">
              <Label for="inputValue" className="mr-sm-2">
                Từ khóa
              </Label>
              <Input
                className="MuiPaper-filter__custom--input"
                autoComplete="nope"
                type="text"
                name="search"
                placeholder="Nhập tên combo"
                value={filter.search}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                inputprops={{
                  name: "search",
                }}
              />
            </FormGroup>
          </Col>

          <Col xs={12} sm={handlePick ? 4 : 3}>
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
          <Col xs={12} sm={handlePick ? 4 : 3}>
            <FormGroup className="mb-2 mb-sm-0">
              <Label for="" className="mr-sm-2">
                Hiển thị web
              </Label>
              <Select
                className="MuiPaper-filter__custom--select"
                id="isShowWebSelected"
                name="isShowWebSelected"
                onChange={(selected) => handleChangeSelect(selected, "isShowWebSelected")}
                isSearchable={true}
                placeholder={"-- Chọn --"}
                value={filter.isShowWebSelected}
                options={dataIsShowWeb}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={handlePick ? 4 : 3}>
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
          
          <Col
            xs={12}
            className={`d-flex align-items-end mt-3 justify-content-end ${handlePick ? "mt-3" : ""}`}
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
            {handlePick ? (
              <FormGroup className="mb-2 ml-2 mb-sm-0">
                <Button
                  className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePick();
                  }}
                  color="success"
                  size="sm"
                >
                  <i className="fa fa-plus" />
                  <span className="ml-1"> Chọn </span>
                </Button>
              </FormGroup>
            ) : null}
          </Col>
        </Row>
      </Form>
    </div>
  );
}
