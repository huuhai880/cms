import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
// Model(s)

class DepartMentFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      selectedOption: { label: "Có", value: 1 },
      deleteOption: { label: "Không", value: 0 },
      /** @var {Array} */
      isActives: [
        { name: "Tất cả", id: 2 },
        { name: "Có", id: 1 },
        { name: "Không", id: 0 },
      ],
      isDelete: [
        { name: "Tất cả", id: 2 },
        { name: "Có", id: 1 },
        { name: "Không", id: 0 },
      ],
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedOption });
  };

  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  handleChangeDelete = (deleteOption) => {
    this.setState({ deleteOption });
  };

  onSubmit = () => {
    const { inputValue, selectedOption, deleteOption, company } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue,
      selectedOption ? selectedOption.value : 2,
      deleteOption ? deleteOption.value : 2,
      company ? company.value : undefined
    );
  };

  onClear = () => {
    const { inputValue, selectedOption, deleteOption, company } = this.state;
    if (inputValue || selectedOption || deleteOption || company) {
      this.setState(
        {
          inputValue: "",
          selectedOption: { label: "Có", value: 1 },
          deleteOption: { label: "Không", value: 0 },
          company: null,
        },
        () => {
          this.onSubmit();
        }
      );
    }
  };

  handleChangeCompany = (company) => {
    this.setState({ company });
  };

  render() {
    const { companyArr } = this.props;
    return (
      <div className="ml-3 mr-3 mb-3 mt-3">
        <Form autoComplete="nope" className="zoom-scale-9">
          <Row>
            <Col xs={12} sm={4}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="inputValue" className="mr-sm-2">
                  Từ khóa
                </Label>
                <Input
                  className="MuiPaper-filter__custom--input"
                  autoComplete="nope"
                  type="text"
                  name="inputValue"
                  placeholder="nhập tên phòng ban"
                  value={this.state.inputValue}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  inputprops={{
                    name: "inputValue",
                  }}
                />
              </FormGroup>
            </Col>

            <Col xs={12} sm={4}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">
                  Trực thuộc công ty
                </Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="company"
                  name="company"
                  onChange={this.handleChangeCompany}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.company}
                  options={companyArr.map(({ name: label, id: value }) => ({
                    value,
                    label,
                  }))}
                />
              </FormGroup>
            </Col>

            <Col xs={12} sm={2}>
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

            <Col xs={12} sm={2}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">
                  Đã xóa
                </Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="isDelete"
                  name="isDeletes"
                  onChange={this.handleChangeDelete}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.deleteOption}
                  options={this.state.isActives.map(
                    ({ name: label, id: value }) => ({ value, label })
                  )}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <div>
          <Col
            xs={12}
            sm={12}
            className="d-flex align-items-end justify-content-end mt-3 pl-0 pr-0"
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
        </div>
      </div>
    );
  }
}

DepartMentFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default DepartMentFilter;
