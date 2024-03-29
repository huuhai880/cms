import React, { useState, useEffect } from "react";

import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import DatePicker from "../Common/DatePicker";
import moment from "moment";

function Filter({ handleSubmitFillter }) {
  const [checkStartDate, setCheckStartDate] = useState(true);
  const [checkEndDate, setCheckEndDate] = useState(true);
  const [dateToDate, setDateToDate] = useState("");
  const [dateFromDate, setDateFromDate] = useState("");
  const [isActive, setIsActive] = useState([
    { name: "Không", id: "0" },
    { name: "Có", id: "1" },
    { name: "Tất cả", id: "2" },
  ]);
  const [isSpectial, setIsSpectial] = useState([
    { name: "Không", id: "0" },
    { name: "Có", id: "1" },
    { name: "Tất cả", id: "2" },
  ]);
  const [searchValue, setSearchValue] = useState({
    keyword: "",
    selectdActive: { value: "1", label: "Có" },
    selectdSpectial: { value: "2", label: "Tất cả" },
    startDate: null,
    endDate: null,
  });
  useEffect(() => {
    if (localStorage.getItem("keywordInterpret")) {
      setSearchValue({
        ...searchValue,
        keyword: localStorage.getItem("keywordInterpret"),
      });
      let value = {
        keyword: localStorage.getItem("keywordInterpret")
          ? localStorage.getItem("keywordInterpret")
          : null,
      };

      handleSubmitFillter(value);
    }
  }, []);
  const _handleSubmitFillter = () => {
    let { keyword, selectdActive, selectdSpectial, startDate, endDate } = searchValue;
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
      window._$g.dialogs.alert(window._$g._(`Vui lòng nhập đúng định dạng ngày tạo.`), () => {
        window.location.reload();
      });
    }
    localStorage.setItem("keywordInterpret", keyword);
    let value = {
      keyword: keyword ? keyword : null,
      selectdActive: selectdActive ? selectdActive.value : null,
      selectdSpectial: selectdSpectial ? selectdSpectial.value : null,
      startDate: startDate ? startDate.format("DD/MM/YYYY") : null,
      endDate: endDate ? endDate.format("DD/MM/YYYY") : null,
    };

    handleSubmitFillter(value);
  };

  const handleClear = () => {
    localStorage.removeItem("keywordInterpret");
    setSearchValue({
      keyword: "",
      selectdActive: { value: "1", label: "Có" },
      selectdSpectial: { value: "2", label: "Tất cả" },
      startDate: null,
      endDate: null,
    });
    let value = {
      keyword: null,
      selectdActive: 1,
      selectdSpectial: 2,
      startDate: null,
      endDate: null,
    };

    handleSubmitFillter(value);
  };

  const handleKeyDown = (e) => {
    if (1 * e.keyCode === 13) {
      e.preventDefault();
      _handleSubmitFillter();
    }
  };

  return (
    <div className="ml-3 mr-3 mb-3 mt-3">
      <Form autoComplete="nope" className="zoom-scale-9">
        <Row>
          <Col sm={4} xs={12}>
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
                  placeholder="Nhập tên thuộc tính, tên luận giải chi tiết"
                  value={searchValue.keyword}
                  onChange={(e) => {
                    setSearchValue({
                      ...searchValue,
                      keyword: e.target.value,
                    });
                  }}
                  onKeyDown={handleKeyDown}
                />
              </Col>
            </FormGroup>
          </Col>

          <Col sm={3} xs={12}>
            <FormGroup className="mb-2 mb-sm-0">
              <Label for="" className="mr-sm-2">
                Luận giải đặc biệt
              </Label>
              <Col className="pl-0 pr-0">
                <Select
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  placeholder={"-- Chọn --"}
                  onChange={(e) => {
                    setSearchValue({
                      ...searchValue,
                      selectdSpectial: e,
                    });
                  }}
                  value={searchValue.selectdSpectial}
                  options={isSpectial.map(({ name: label, id: value }) => ({
                    value,
                    label,
                  }))}
                />
              </Col>
            </FormGroup>
          </Col>
          <Col sm={3} xs={12}>
            <FormGroup className="mb-2 mb-sm-0">
              <Label for="" className="mr-sm-2">
                Kích hoạt
              </Label>
              <Col className="pl-0 pr-0">
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
              </Col>
            </FormGroup>
          </Col>
          <Col sm={2} xs={12} className={`d-flex align-items-end justify-content-end`}>
            <FormGroup className="mb-2 mb-sm-0">
              <Button
                className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
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
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Filter;
