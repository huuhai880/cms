import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

import { FormSelectGroup } from "../../containers/Common/widget";
import { mapDataOptions4Select } from "../../utils/html";
// Component(s)
// Model(s)

class NewsCategoryFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: { label: "Có", value: 1 },
      /** @var {Array} */
      isActives: [
        { name: "Tất cả", id: 2 },
        { name: "Có", id: 1 },
        { name: "Không", id: 0 },
      ],
      // newsCategory: {label: '-- Chọn --', value: ""}
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedOption });
  };

  handleChangeNewsOptions = (newsCategory) => {
    this.setState({ newsCategory });
  };

  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  onSubmit = () => {
    const { inputValue, selectedOption, newsCategory } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue ? inputValue.trim() : "",
      selectedOption ? selectedOption.value : 2,
      newsCategory ? newsCategory.value : undefined
    );
  };

  onClear = () => {
    const { inputValue, selectedOption, newsCategory } = this.state;
    if (inputValue || selectedOption || newsCategory) {
      this.setState(
        {
          inputValue: "",
          selectedOption: { label: "Có", value: 1 },
          newsCategory: { label: "", value: "" },
        },
        () => {
          this.onSubmit();
        }
      );
    }
  };

  render() {
    const { newsOptions } = this.props;
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
                  placeholder="Nhập tên chuyên mục"
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
                  Thuộc chuyên mục
                </Label>
                <Col className="pl-0 pr-0">
                  <FormSelectGroup
                    list={mapDataOptions4Select(newsOptions)}
                    selectOnly={true}
                    name="parent_id"
                    onChange={this.handleChangeNewsOptions}
                    placeHolder={"-- Chọn --"}
                    value={this.state.newsCategory}
                    isUseForm={false}
                    portalTarget={null}
                    isObject
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
                  onChange={this.handleChangeSelect}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.selectedOption}
                  options={this.state.isActives.map(
                    ({ name: label, id: value }) => ({ value, label })
                  )}
                />
              </FormGroup>
            </Col>
            <Col
              xs={12}
              sm={3}
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
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

NewsCategoryFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default NewsCategoryFilter;
