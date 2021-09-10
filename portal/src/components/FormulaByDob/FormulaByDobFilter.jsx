import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
// Model(s)


class FormulaByDobFilter extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      is_active: { label: "Có", value: 1 },
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

  handleChangeIsActive = (is_active) => {
    this.setState({ is_active });
  };

  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  onSubmit = () => {
    const { inputValue, is_active, attributes_group_id} = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue ? inputValue.trim() : "",
      attributes_group_id? attributes_group_id.value: "",
      is_active ? is_active.value : undefined
    );
  };

  onClear = () => {
    if (this.state.inputValue || this.state.is_active) {
      this.setState(
        {
          inputValue: "",
          attributes_group_id: "",
          is_active: { label: "Có", value: 1 },
        },
        () => {
          this.onSubmit();
        }
      );
    }
  };

  render() {
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
                  placeholder="Nhập tên công thức, tên thuộc tính"
                  value={this.state.inputValue || ""}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  inputprops={{
                    name: "inputValue",
                  }}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={4}>
              <FormGroup className="mb-2 mb-sm-0 ">
                <Label for="" className="mr-sm-2">
                  Kích hoạt
                </Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="is_active"
                  name="is_active"
                  onChange={this.handleChangeIsActive}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.is_active}
                  options={this.state.isActives.map(
                    ({ name: label, id: value }) => ({ value, label })
                  )}
                />
              </FormGroup>
            </Col>
            <Col
              xs={12}
              sm={4}
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
              <FormGroup className="mb-2 ml-2 mb-sm-0 mr-3">
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

FormulaByDobFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default FormulaByDobFilter;
