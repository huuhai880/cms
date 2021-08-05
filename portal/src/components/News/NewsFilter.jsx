import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
import DatePicker from "../Common/DatePicker";
import { FormSelectGroup } from "../../containers/Common/widget";
import { mapDataOptions4Select } from "../../utils/html";

//import BusinessModel from '../../models/ ';
class NewsFilter extends PureComponent {
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
    const {
      inputValue,
      newsCategory,
      selectedActive,
      startDate,
      endDate,
      startDateCreateDate,
      endDateCreateDate,
    } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      isReset,
      inputValue,
      selectedActive ? selectedActive.value : 2,
      newsCategory ? newsCategory.value : null,
      startDate ? startDate.format("DD/MM/YYYY") : startDate,
      endDate ? endDate.format("DD/MM/YYYY") : endDate,
      startDateCreateDate
        ? startDateCreateDate.format("DD/MM/YYYY")
        : startDateCreateDate,
      endDateCreateDate
        ? endDateCreateDate.format("DD/MM/YYYY")
        : endDateCreateDate
    );
  };

  onClear = () => {
    const {
      inputValue,
      startDate,
      endDate,
      selectedActive,
      newsCategory,
      startDateCreateDate,
      endDateCreateDate,
    } = this.state;
    if (
      inputValue ||
      startDate ||
      endDate ||
      selectedActive ||
      newsCategory ||
      startDateCreateDate ||
      endDateCreateDate
    ) {
      this.setState(
        {
          inputValue: "",
          startDate: null,
          endDate: null,
          selectedActive: { label: "Có", value: 1 },
          newsCategory: { label: "Tất cả", value: "" },
          startDateCreateDate: null,
          endDateCreateDate: null,
        },
        () => {
          this.onSubmit(true);
        }
      );
    }
  };

  render() {
    const { newsCategoryArr, handlePick } = this.props;
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
                  placeholder="Nhập từ khoá tiêu đề"
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
                  Chuyên mục
                </Label>
                <FormSelectGroup
                  list={mapDataOptions4Select(newsCategoryArr)}
                  selectOnly={true}
                  name="newsCategory"
                  onChange={this.handleChangeSelectCategory}
                  placeHolder={"-- Chọn --"}
                  value={this.state.newsCategory}
                  isUseForm={false}
                  portalTarget={null}
                  isObject
                  isClearable={false}
                />
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
                  onChange={this.handleChangeSelectActive}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.selectedActive}
                  options={this.state.isActives.map(
                    ({ name: label, id: value }) => ({ value, label })
                  )}
                />
              </FormGroup>
            </Col>

            <Col xs={12} sm={3}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">
                  Ngày đăng
                </Label>
                <Col className="pl-0 pr-0">
                  <DatePicker
                    startDate={this.state.startDate}
                    startDateId="your_unique_start_date_id"
                    endDate={this.state.endDate}
                    endDateId="your_unique_end_date_id"
                    onDatesChange={({ startDate, endDate }) =>
                      this.setState({ startDate, endDate })
                    }
                    isMultiple
                  />
                </Col>
              </FormGroup>
            </Col>

            <Col xs={12} sm={3} className="mt-md-3">
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">
                  Ngày tạo
                </Label>
                <Col className="pl-0 pr-0">
                  <DatePicker
                    startDate={this.state.startDateCreateDate}
                    startDateId="your_unique_start_date_id"
                    endDate={this.state.endDateCreateDate}
                    endDateId="your_unique_end_date_id"
                    onDatesChange={({ startDate, endDate }) =>
                      this.setState({
                        startDateCreateDate: startDate,
                        endDateCreateDate: endDate,
                      })
                    }
                    isMultiple
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col
              xs={12}
              sm={9}
              className="d-flex align-items-end justify-content-end"
            >
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
              {
                handlePick ?
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
              </FormGroup> : null 
              }
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

NewsFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default NewsFilter;
