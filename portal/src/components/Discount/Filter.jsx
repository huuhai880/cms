import React, { useState, useEffect } from "react";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import DatePicker from "../Common/DatePicker";
import moment from "moment";

function Filter({ handleSubmit }) {
  const [checkStartDate, setCheckStartDate] = useState(true);
  const [checkEndDate, setCheckEndDate] = useState(true);
  const [dateToDate, setDateToDate] = useState("");
  const [dateFromDate, setDateFromDate] = useState("");
  const [isActive, setIsActive] = useState([
    { name: "Không", id: "0" },
    { name: "Có", id: "1" },
    { name: "Tất cả", id: "2" },
  ]);
  const [discountStatus, setDiscountStatus] = useState([
    { name: "Tất cả", id: "0" },
    { name: "Chưa áp dụng", id: "1" },
    { name: "Đang áp dụng", id: "2" },
    { name: "Hết thời gian áp dụng", id: "3" },

  ])
  const [searchValue, setSearchValue] = useState({
    keyword: "",
    selectdActive: { value: "1", label: "Có" },
    selectdStaus: { label: "Tất cả", value: "0" },
    selectdDelete: { label: "Không", value: "0" },
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
    let { keyword, selectdActive, startDate, endDate, selectdStaus, selectdDelete } = searchValue;
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
      selectdStaus: selectdStaus ? selectdStaus.value : null,
      selectdDelete: selectdDelete ? selectdDelete.value : null,
      startDate: startDate ? startDate.format("DD/MM/YYYY") : null,
      endDate: endDate ? endDate.format("DD/MM/YYYY") : null,
    };

    handleSubmit(value);
  };
  const handleClear = () => {
    setSearchValue({
      keyword: "",
      selectdActive: { value: "1", label: "Có" },
      selectdStaus: { label: "Tất cả", value: "0" },
      selectdDelete: { label: "Tất cả", value: "2" },
      startDate: null,
      endDate: null,
    });
    let value = {
      keyword: null,
      selectdActive: 1,
      selectdStaus: 0,
      selectdDelete: 2,
      startDate: null,
      endDate: null,
    };

    handleSubmit(value);
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
                  placeholder="Nhập mã code"
                  value={searchValue.keyword}
                  onKeyDown={handleKeyDown}

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
              <Label for="" className="mr-sm-2">
                Ngày tạo
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
        </Row>
        <Row>


          <Col xs={3} style={{ padding: 0 }}>
            <Col
              xs={12}
              style={{
                alignItems: "center",
              }}
            >
              <Label for="" className="mr-sm-2">
                Đã xoá
              </Label>
              <Col className="pl-0 pr-0">
                <Select
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  placeholder={"-- Chọn --"}
                  onChange={(e) => {
                    setSearchValue({
                      ...searchValue,
                      selectdDelete: e,
                    });
                  }}
                  value={searchValue.selectdDelete}
                  options={isActive.map(({ name: label, id: value }) => ({
                    value,
                    label,
                  }))}
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
              <Label for="" className="mr-sm-2">
                Trạng thái mã code
              </Label>
              <Col className="pl-0 pr-0">
                <Select
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  placeholder={"-- Chọn --"}
                  onChange={(e) => {
                    setSearchValue({
                      ...searchValue,
                      selectdStaus: e,
                    });
                  }}
                  value={searchValue.selectdStaus}
                  options={discountStatus.map(({ name: label, id: value }) => ({
                    value,
                    label,
                  }))}
                />
              </Col>
            </Col>
          </Col>
          <Col xs={6} className="d-flex flex-fill justify-content-end" style={{ padding: 0 }}>
            <Col
              xs={12}
              style={{
                alignItems: "flex-end",
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
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

            </Col>
          </Col>
        </Row>

      </Form>
    </div>
  );
}

export default Filter;
