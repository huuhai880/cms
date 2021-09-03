import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
// Model(s)

class ParamNumberFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      wards: [],
      districts: [],
      provinces: [],
      countries: [],
      is_full_name: { label: "Tất cả", value: 2 },
      is_last_name: { label: "Tất cả", value: 2 },
      is_first_middle_name: { label: "Tất cả", value: 2 },
      is_active: { label: "Có", value: 1 },
      isActives: [
        { name: "Tất cả", id: 2 },
        { name: "Có", id: 1 },
        { name: "Không", id: 0 },
      ],
      Opts: [
        { label: "Tất cả", value: 2 },
        { label: "Có", value: 1 },
        { label: "Không", value: 0 },
      ],
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeName = (key, value) => {
    this.setState({ [key]: value });
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
    const {
      inputValue,
      is_full_name,
      is_last_name,
      is_first_middle_name,
      is_active,
    } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue ? inputValue.trim() : "",
      is_full_name ? is_full_name.value : undefined,
      is_last_name ? is_last_name.value : undefined,
      is_first_middle_name ? is_first_middle_name.value : undefined,
      is_active ? is_active.value : undefined
    );
  };

  onClear = () => {
    if (
      this.state.inputValue ||
      this.state.is_full_name ||
      this.state.is_last_name ||
      this.state.is_first_middle_name ||
      this.state.is_active
    ) {
      this.setState(
        {
          inputValue: "",
          is_full_name: { label: "Tất cả", value: 2 },
          is_last_name: { label: "Tất cả", value: 2 },
          is_first_middle_name: { label: "Tất cả", value: 2 },
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
            <Col xs={12} sm={4} className="mb-3">
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="inputValue" className="mr-sm-2">
                  Từ khóa
                </Label>
                <Input
                  className="MuiPaper-filter__custom--input"
                  autoComplete="nope"
                  type="text"
                  name="inputValue"
                  placeholder="Nhập loại biến số tên"
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
                  Tên
                </Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="is_last_name"
                  name="is_last_name"
                  onChange={(item) =>
                    this.handleChangeName("is_last_name", item)
                  }
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.is_last_name}
                  options={this.state.Opts}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={4}>
              <FormGroup className="mb-2 mb-sm-0 ">
                <Label for="" className="mr-sm-2">
                  Họ và tên đầy đủ
                </Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="is_full_name"
                  name="is_full_name"
                  onChange={(item) =>
                    this.handleChangeName("is_full_name", item)
                  }
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.is_full_name}
                  options={this.state.Opts}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={4}>
              <FormGroup className="mb-2 mb-sm-0 ">
                <Label for="" className="mr-sm-2">
                  Họ và tên đệm
                </Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="is_first_middle_name"
                  name="is_first_middle_name"
                  onChange={(item) =>
                    this.handleChangeName("is_first_middle_name", item)
                  }
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.is_first_middle_name}
                  options={this.state.Opts}
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

ParamNumberFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default ParamNumberFilter;
