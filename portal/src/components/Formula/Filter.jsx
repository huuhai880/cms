import React, { useState, useEffect } from "react";

import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import DatePicker from "../Common/DatePicker";
import moment from "moment";
import FormulaModel from "../../models/FormulaModel";

function Filter({ handleSubmitFillter }) {
  const _formulaModel = new FormulaModel();
  const [checkStartDate, setCheckStartDate] = useState(true);
  const [checkEndDate, setCheckEndDate] = useState(true);
  const [dateToDate, setDateToDate] = useState("");
  const [dateFromDate, setDateFromDate] = useState("");
  const [isActive, setIsActive] = useState([
    { name: "Không", id: "0" },
    { name: "Có", id: "1" },
    { name: "Tất cả", id: "2" },
  ]);
  const [searchValue, setSearchValue] = useState({
    keyword: "",
    selectdActive: { value: "1", label: "Có" },
    startDate: null,
    endDate: null,
    attributesGroupSelected: null,
    typeFormulaSelected: null,
  });

  const [optionAttributesGroup, setOptionAttributesGroup] = useState([]);

  const [optionTypeFormular] = useState([
    { label: "Tất cả", value: 0 },
    { label: "Công thức thông thường", value: 1 },
    { label: "Công thức điều kiện", value: 2 },
    { label: "Công thức cặp", value: 3 },
  ]);

  useEffect(() => {
    document
      .getElementById("your_unique_start_date_id")
      .setAttribute("readonly", "readonly");
    document
      .getElementById("your_unique_end_date_id")
      .setAttribute("readonly", "readonly");

    let pickerLeft = document.querySelector("#your_unique_start_date_id");
    pickerLeft.addEventListener("keyup", (e) => {
      if (e.target.value) {
        var checkStartDate =
          /^(?:0?[1-9]?|[12]\d|3[01])(?:\/(?:0?[1-9]|1[012])?)\/\d{0,4}$|^\d{4}?$/.test(
            e.target.value
          );
      }

      setCheckStartDate(checkStartDate);
      setDateFromDate(e.target.value);
    });

    let pickerRight = document.querySelector("#your_unique_end_date_id");
    pickerRight.addEventListener("keyup", (e) => {
      if (e.target.value) {
        var checkEndDate =
          /^(?:0?[1-9]?|[12]\d|3[01])(?:\/(?:0?[1-9]|1[012])?)\/\d{0,4}$|^\d{4}?$/.test(
            e.target.value
          );
      }
      setCheckEndDate(checkEndDate);
      setDateToDate(e.target.value);
    });
    loadAttributesGroup();
  }, []);

  const loadAttributesGroup = async () => {
    try {
      let { items = [] } = await _formulaModel.getAttributeGruop();
      let optionAttributesGroup = items.map((p) => {
        return {
          value: p.attribute_gruop_id,
          label: p.gruop_name,
        };
      });
      setOptionAttributesGroup(optionAttributesGroup);
    } catch (error) {
      window._$g.dialogs.alert(
        window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
      );
    }
  };

  const _handleSubmitFillter = () => {
    let {
      keyword,
      selectdActive,
      startDate,
      endDate,
      attributesGroupSelected,
      typeFormulaSelected,
    } = searchValue;
    var mydate = moment(dateToDate, "DD/MM/YYYY");
    var myStartDate = startDate ? startDate.format("DD/MM/YYYY") : "";
    if (myStartDate) {
      myStartDate = moment(myStartDate, "DD/MM/YYYY");
    }
    if (
      checkStartDate == false ||
      checkEndDate == false ||
      (checkStartDate == false && checkEndDate == false)
    ) {
      window._$g.dialogs.alert(
        window._$g._(`Vui lòng nhập đúng định dạng ngày tạo.`),
        () => {
          window.location.reload();
        }
      );
    }
    let value = {
      keyword: keyword ? keyword : null,
      selectdActive: selectdActive ? selectdActive.value : null,
      startDate: startDate ? startDate.format("DD/MM/YYYY") : null,
      endDate: endDate ? endDate.format("DD/MM/YYYY") : null,
      attributes_group_id: attributesGroupSelected
        ? attributesGroupSelected.value
        : null,
      type_formula: typeFormulaSelected ? typeFormulaSelected.value : 0,
    };

    handleSubmitFillter(value);
  };

  const handleClear = () => {
    setSearchValue({
      keyword: "",
      selectdActive: { value: "1", label: "Có" },
      startDate: null,
      endDate: null,
      attributesGroupSelected: null,
      typeFormulaSelected: { label: "Tất cả", value: 0 },
    });
    let value = {
      keyword: null,
      selectdActive: 1,
      startDate: null,
      endDate: null,
      attributes_group_id: null,
      type_formula: 0,
    };

    handleSubmitFillter(value);
  };

  const handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      _handleSubmitFillter();
    }
  };

  return (
    <div className="ml-3 mr-3 mb-3 mt-3">
      <Form autoComplete="nope" className="zoom-scale-9">
        <Row>
          <Col xs={12} sm={3}>
            <FormGroup>
              <Label for="inputValue" className="mr-sm-2">
                Từ khóa
              </Label>
              <Input
                className="MuiPaper-filter__custom--input pr-0"
                autoComplete="nope"
                type="text"
                name="keyword"
                placeholder="Nhập tên công thức"
                value={searchValue.keyword}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setSearchValue({
                    ...searchValue,
                    keyword: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </Col>

          <Col xs={12} sm={2}>
            <FormGroup>
              <Label for="inputValue" className="mr-sm-2">
                Chỉ số
              </Label>
              <Select
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                className="MuiPaper-filter__custom--select"
                id={`attribute_gruop_id`}
                name={`attribute_gruop_id`}
                isClearable={true}
                placeholder={"-- Chọn --"}
                value={searchValue.attributesGroupSelected}
                options={optionAttributesGroup}
                onChange={(value) => {
                  setSearchValue((t) => ({
                    ...t,
                    attributesGroupSelected: value,
                  }));
                }}
              />
            </FormGroup>
          </Col>

          <Col xs={12} sm={3}>
            <FormGroup>
              <Label for="inputValue" className="mr-sm-2">
                Ngày tạo
              </Label>
              <DatePicker
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                startDate={searchValue.startDate}
                startDateId="your_unique_start_date_id"
                endDate={searchValue.endDate}
                endDateId="your_unique_end_date_id"
                onDatesChange={({ startDate, endDate }) => {
                  setSearchValue({
                    ...searchValue,
                    startDate,
                    endDate,
                  });
                }}
                isMultiple
              />
            </FormGroup>
          </Col>

          <Col xs={12} sm={2}>
            <FormGroup>
              <Label for="inputValue" className="mr-sm-2">
                Loại công thức
              </Label>
              <Select
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                placeholder={"-- Chọn --"}
                onChange={(value) => {
                  setSearchValue((t) => ({
                    ...t,
                    typeFormulaSelected: value,
                  }));
                }}
                value={searchValue.typeFormulaSelected}
                options={optionTypeFormular}
              />
            </FormGroup>
          </Col>

          <Col xs={12} sm={2}>
            <FormGroup>
              <Label for="inputValue" className="mr-sm-2">
                Kích hoạt
              </Label>
              <Select
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                placeholder={"-- Chọn --"}
                onChange={(e) => {
                  setSearchValue({
                    ...searchValue,
                    selectdActive: e,
                  });
                }}
                value={searchValue.selectdActive}
                options={isActive.map(({ name: label, id: value }) => ({
                  value,
                  label,
                }))}
              />
            </FormGroup>
          </Col>
        </Row>

        <div className="d-flex align-items-center">
          <div className="d-flex flex-fill justify-content-end">
            <FormGroup className="mb-2 ml-2 mb-sm-0">
              <Button
                className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                onClick={_handleSubmitFillter}
                color="primary"
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
                size="sm"
              >
                <i className="fa fa-refresh mr-1" />
                Làm mới
              </Button>
            </FormGroup>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default Filter;
