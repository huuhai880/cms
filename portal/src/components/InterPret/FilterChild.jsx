import React, { useState, useEffect } from "react";

import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import DatePicker from "../Common/DatePicker";
import moment from "moment";

function FilterChild({ handleSubmitFillter }) {
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
  });

  const _handleSubmitFillter = () => {
    let { keyword, selectdActive, startDate, endDate } = searchValue;
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
    let value = {
      keyword: keyword ? keyword : null,
      selectdActive: selectdActive ? selectdActive.value : null,
      startDate: startDate ? startDate.format("DD/MM/YYYY") : null,
      endDate: endDate ? endDate.format("DD/MM/YYYY") : null,
    };

    handleSubmitFillter(value);
  };
  const handleClear = () => {
    setSearchValue({
      keyword: "",
      selectdActive: { value: "1", label: "Có" },
      startDate: null,
      endDate: null,
    });
    let value = {
      keyword: null,
      selectdActive: 1,
      startDate: null,
      endDate: null,
    };

    handleSubmitFillter(value);
  };
  return (
    <div className="ml-3 mr-3 mb-3 mt-3">
      <Form autoComplete="nope" className="zoom-scale-9">
        <Row>
          <Col xs={6} style={{ padding: 0 }}>
            <Col
              xs={12}
              style={{
                alignItems: "center",
              }}
            >
              <Label for="inputValue" className="mr-sm-2">
                Từ khóa
              </Label>
              <Col className="pl-0 pr-0">
                <Input
                  className="MuiPaper-filter__custom--input pr-0"
                  autoComplete="nope"
                  type="text"
                  name="keyword"
                  placeholder="Nhập tên luận giải"
                  value={searchValue.keyword}
                  onChange={(e) => {
                    setSearchValue({
                      ...searchValue,
                      keyword: e.target.value,
                    });
                  }}
                />
              </Col>
            </Col>
          </Col>

          <Col xs={4} style={{ padding: 0 }}>
            <Col
              xs={12}
              style={{
                alignItems: "center",
              }}
            >
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
            </Col>
          </Col>
          <Col xs={2} style={{ padding: 0 }}>
            <Col
              xs={12}
              style={{
                alignItems: "center",
              }}
            >
              <Label for="" className="mr-sm-2">
                {/* Kích hoạt */}
              </Label>
              <Col className="pl-0 pr-0 mt-2">
                <div className="d-flex align-items-center">
                  <div className="d-flex flex-fill">
                    <FormGroup className="mb-2 mb-sm-0">
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
              </Col>
            </Col>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default FilterChild;