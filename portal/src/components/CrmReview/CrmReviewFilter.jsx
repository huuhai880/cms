import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import moment from "moment";

// Component(s)
import DatePicker from "../Common/DatePicker";
import { FormSelectGroup } from "../../containers/Common/widget";
import { mapDataOptions4Select } from "../../utils/html";
import "./styles.scss";

function CrmReviewFilter(props) {
  const [state, setState] = useState({
    inputValue: "",
    selectedActive: { label: "Có", value: 1 },
    /** @var {Array} */
    isActives: [
      { name: "Tất cả", id: 2 },
      { name: "Có", id: 1 },
      { name: "Không", id: 0 },
    ],
    nameTag: "Chọn ngày",
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleChangeSelectActive = (selectedActive) => {
    setState({ ...state, selectedActive });
  };

  const handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  const renderCalendarInfo = () => {
    let data = [
      "Hôm nay",
      "Hôm qua",
      "Tuần này",
      "Tuần trước",
      "Tháng này",
      "Tháng trước",
      "Chọn ngày",
    ];
    return (
      <Col style={{ width: "150px" }} sm={12} className="pl-0 pr-0 bl">
        {data.map((item) => {
          return (
            <Col
              sm={12}
              onClick={() => calendar(item)}
              className={`pt-3 pb-1 hover cursor-pointer ${
                state.nameTag === item ? "focus" : ""
              }`}
            >
              <Label className="cursor-pointer">{item}</Label>
            </Col>
          );
        })}
      </Col>
    );
  };

  const calendar = (key) => {
    switch (key) {
      case "Hôm nay":
        setState({
          ...state,
          startDate: moment(),
          endDate: moment(),
          nameTag: "Hôm nay",
        });
        break;
      case "Hôm qua":
        setState({
          ...state,
          startDate: moment().subtract(1, "days"),
          endDate: moment().subtract(1, "days"),
          nameTag: "Hôm qua",
        });
        break;
      case "Tuần này":
        setState({
          ...state,
          startDate: moment().startOf("week").add(1, "days"),
          endDate: moment(),
          nameTag: "Tuần này",
        });
        break;
      case "Tuần trước":
        setState({
          ...state,
          startDate: moment()
            .subtract(1, "week")
            .startOf("week")
            .add(1, "days"),
          endDate: moment().subtract(1, "week").endOf("week").add(1, "days"),
          nameTag: "Tuần trước",
        });
        break;
      case "Tháng này":
        setState({
          ...state,
          startDate: moment().startOf("month"),
          endDate: moment(),
          nameTag: "Tháng này",
        });
        break;
      case "Tháng trước":
        setState({
          ...state,
          startDate: moment().subtract(1, "month").startOf("month"),
          endDate: moment().subtract(1, "month").endOf("month"),
          nameTag: "Tháng trước",
        });
        break;
    }
  };

  const onSubmit = (isReset = false) => {
    const { inputValue, startDate, endDate, selectedActive } = state;
    const { handleSubmit } = props;
    if (isReset == true) {
      handleSubmit();
    } else {
      handleSubmit(
        inputValue ? inputValue.trim() : null,
        startDate ? startDate.format("DD/MM/YYYY") : "",
        endDate ? endDate.format("DD/MM/YYYY") : "",
        selectedActive ? selectedActive.value : 2
      );
    }
  };

  const onClear = () => {
    const { inputValue, startDate, endDate, selectedActive } = state;
    if (inputValue || startDate || endDate || selectedActive) {
      setState({
        ...state,
        inputValue: "",
        startDate: null,
        endDate: null,
        selectedActive: { label: "Có", value: 1 },
      });
      onSubmit(true);
    }
  };

  const { handlePick } = props;
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
                name="inputValue"
                placeholder="Nhập tên khách hàng, tên chuyên gia"
                value={state.inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                inputprops={{
                  name: "inputValue",
                }}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={3}>
            <FormGroup className="mb-2 mb-sm-0">
              <Label for="" className="mr-sm-2">
                Ngày đánh giá
              </Label>
              <Col className="pl-0 pr-0">
                <DatePicker
                  startDate={state.startDate}
                  startDateId="your_unique_start_date_id"
                  endDate={state.endDate}
                  endDateId="your_unique_end_date_id"
                  onDatesChange={({ startDate, endDate }) =>
                    setState({
                      ...state,
                      startDate,
                      endDate,
                      nameTag: "Chọn ngày",
                    })
                  }
                  isMultiple
                  calendarInfoPosition="after"
                  renderCalendarInfo={() => renderCalendarInfo()}
                />
              </Col>
            </FormGroup>
          </Col>
          <Col xs={12} sm={3}>
            <FormGroup className="mb-2 mb-sm-0">
              <Label for="" className="mr-sm-2">
                Kích hoạt
              </Label>
              <Select
                className="MuiPaper-filter__custom--select"
                id="isActives"
                name="isActives"
                onChange={handleChangeSelectActive}
                isSearchable={true}
                placeholder={"-- Chọn --"}
                value={state.selectedActive}
                options={state.isActives.map(({ name: label, id: value }) => ({
                  value,
                  label,
                }))}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={3} className="mt-md-3">
            <div
              className="d-flex align-items-center mt-2"
              style={{ height: "100%" }}
            >
              <div className="d-flex flex-fill justify-content-end">
                <FormGroup className="mb-2 ml-2 mb-sm-0">
                  <Button
                    className="col-12 MuiPaper-filter__custom--button"
                    onClick={onSubmit}
                    color="primary"
                  >
                    <i className="fa fa-search" />
                    <span className="ml-1">Tìm kiếm</span>
                  </Button>
                </FormGroup>
                <FormGroup className="mb-2 ml-2 mb-sm-0">
                  <Button
                    className="mr-1 col-12 MuiPaper-filter__custom--button"
                    onClick={() => onClear()}
                  >
                    <i className="fa fa-refresh" />
                    <span className="ml-1">Làm mới</span>
                  </Button>
                </FormGroup>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

CrmReviewFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default CrmReviewFilter;
