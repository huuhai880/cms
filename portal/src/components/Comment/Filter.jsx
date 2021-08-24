import React, { useState, useEffect } from "react";

import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import DatePicker from "../Common/DatePicker";
import moment from "moment";

function Filter({ handleSubmitFillter }) {
  const [isReview, setIsReview] = useState([
    { name: "Chưa duyệt", id: "3" },
    { name: "Đã duyệt", id: "1" },
    { name: "Không duyệt", id: "0" },
    { name: "Tất cả", id: "2" },
  ]);
  const [checkStartDate, setCheckStartDate] = useState(true);
  const [checkEndDate, setCheckEndDate] = useState(true);
  const [dateToDate, setDateToDate] = useState("");
  const [dateFromDate, setDateFromDate] = useState("");

  const [searchValue, setSearchValue] = useState({
    keyword: "",
    selectdReview: null,
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
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
  }, []);
  const _handleSubmitFillter = () => {
    let { keyword, selectdReview, startDate, endDate } = searchValue;
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
      selectdReview: selectdReview ? selectdReview.value : null,
      startDate: startDate ? startDate.format("DD/MM/YYYY") : null,
      endDate: endDate ? endDate.format("DD/MM/YYYY") : null,
    };

    handleSubmitFillter(value);
  };
  const handleClear = () => {
    setSearchValue({
      keyword: "",
      selectdReview: null,
      startDate: null,
      endDate: null,
    });
    let value = {
      keyword: null,
      selectdReview: null,
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
              <Label for="inputValue" className="mr-sm-2 font-weight-bold">
                Từ khóa
              </Label>
              <Col className="pl-0 pr-0">
                <Input
                  className="MuiPaper-filter__custom--input pr-0"
                  autoComplete="nope"
                  type="text"
                  name="keyword"
                  placeholder="Nhập tên nội dung bình luận, tên người bình luận"
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

          <Col xs={3} style={{ padding: 0 }}>
            <Col
              xs={12}
              style={{
                alignItems: "center",
              }}
            >
              <Label for="" className="mr-sm-2 font-weight-bold">
                Ngày bình luận
              </Label>
              <Col className="pl-0 pr-0">
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
              </Col>
            </Col>
          </Col>
          <Col xs={3} style={{ padding: 0 }}>
            <Col
              xs={12}
              style={{
                alignItems: "center",
              }}
            >
              <Label for="" className="mr-sm-2  font-weight-bold">
                Trạng thái
              </Label>
              <Col className="pl-0 pr-0">
                <Select
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  placeholder={"-- Chọn --"}
                  onChange={(e) => {
                    setSearchValue({
                      ...searchValue,
                      selectdReview: e,
                    });
                  }}
                  value={searchValue.selectdReview}
                  options={isReview.map(({ name: label, id: value }) => ({
                    value,
                    label,
                  }))}
                />
              </Col>
            </Col>
          </Col>
        </Row>
        <div className="d-flex align-items-center mt-3">
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