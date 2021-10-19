import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
// import DatePicker from "../Common/DatePicker";
// import { DatePicker } from "antd";
import RangePicker from "../../containers/Common/widget/RangeTimePicker";
import "antd/dist/antd.css";
import "moment/locale/vi";
import { FormSelectGroup } from "../../containers/Common/widget";
import { mapDataOptions4Select } from "../../utils/html";
import moment from "moment";

class SearchHistoryFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      selectedActive: { label: "Có", value: 1 },
      newsCategory: { label: "Tất cả", value: "" },
      /** @var {Array} */
      isActives: [
        { name: "Tất cả", id: 2 },
        { name: "Có", id: 1 },
        { name: "Không", id: 0 },
      ],
      startDate: moment().startOf('month'),
      endDate: moment(),

    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeSelectActive = (selectedActive) => {
    this.setState({ selectedActive });
  };

  handleChangeSelectCategory = (selectedCategory) => {
    this.setState({ newsCategory: selectedCategory });
  };

  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  onSubmit = (isReset = false) => {
    let { inputValue, selectedActive, startDate, endDate } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue ? inputValue.trim() : null,
      selectedActive ? selectedActive.value : 2,
      moment(startDate).isValid() ? moment(startDate, "DD/MM/YYYY").format("DD/MM/YYYY") : null,
      moment(endDate).isValid() ? moment(endDate, "DD/MM/YYYY").format("DD/MM/YYYY") : null
    );
  };

  onClear = () => {
    const { inputValue, startDate, endDate, selectedActive } = this.state;
    if (inputValue || startDate || endDate || selectedActive) {
      this.setState(
        {
          inputValue: "",
          startDate:  moment().startOf('month'),
          endDate:  moment(),
          selectedActive: { label: "Có", value: 2 },
        },
        () => {
          this.onSubmit(true);
        }
      );
    }
  };

  render() {
    const { handlePick } = this.props;
    return (
      <div className="ml-3 mr-3 mb-3 mt-3">
        <Form autoComplete="nope" className="zoom-scale-9">
          <Row>
            <Col xs={12} sm={6}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="inputValue" className="mr-sm-2">
                  Từ khóa
                </Label>
                <Input
                  className="MuiPaper-filter__custom--input"
                  autoComplete="nope"
                  type="text"
                  name="inputValue"
                  placeholder="Nhập tên khách hàng, tên sản phẩm"
                  value={this.state.inputValue}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  inputprops={{
                    name: "inputValue",
                  }}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">
                  Ngày tạo
                </Label>
                <Col className="pl-0 pr-0">
                  <RangePicker
                    setId="date1"
                    startDateValue={this.state.startDate}
                    endDateValue={this.state.endDate}
                    handleDateValue={(startDate, endDate) => this.setState({ startDate, endDate })}
                  />
                </Col>
              </FormGroup>
            </Col>

            <Col xs={12} sm={3} className="d-flex align-items-end justify-content-end">
              <FormGroup className="mb-2 mb-sm-0">
                <Button
                  className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                  onClick={this.onSubmit}
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
                  onClick={this.onClear}
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
}

SearchHistoryFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default SearchHistoryFilter;
