import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
// ...
// Model(s)
// ...

class ProductAttributesFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      selectedOption: 1,
      /** @var {Array} */
      isActives: [
        { label: "Tất cả", value: 2 },
        { label: "Có", value: 1 },
        { label: "Không", value: 0 },
      ],
      deleteOption: 0,
      isDeletes: [
        { label: "Tất cả", value: 2 },
        { label: "Đã xóa", value: 1 },
        { label: "Chưa xóa", value: 0 },
      ],
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
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
      selectedOption,
      deleteOption /*, from_date, to_date*/,
    } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue,
      selectedOption,
      deleteOption
      // from_date ? from_date.format('DD/MM/YYYY') : from_date,
      // to_date ? to_date.format('DD/MM/YYYY') : to_date
    );
  };

  onClear = () => {
    // const { inputValue, selectedOption, deleteOption, from_date, to_date } = this.state
    // if (inputValue || selectedOption || deleteOption || from_date || to_date) {
    this.setState(
      {
        inputValue: "",
        selectedOption: 1,
        deleteOption: 0,
        from_date: null,
        to_date: null,
      },
      () => {
        this.onSubmit();
      }
    );
    // }
  };

  render() {
    let { selectedOption, isActives, deleteOption, isDeletes } = this.state;
    let isActive = isActives.find(
      (item) => "" + item.value === "" + selectedOption
    );
    let isDelete = isDeletes.find(
      (item) => "" + item.value === "" + deleteOption
    );

    return (
      <div className="ml-3 mr-3 mb-3 mt-3">
        <Row>
          <Col xs={12} sm={9}>
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
                      placeholder="Nhập tên thuộc tính sản phẩm"
                      value={this.state.inputValue}
                      onChange={this.handleChange}
                      onKeyDown={this.handleKeyDown}
                      inputprops={{ name: "inputValue" }}
                    />
                  </FormGroup>
                </Col>

                <Col xs={12} sm={6}>
                  <FormGroup className="mb-2 mb-sm-0">
                    <Label for="" className="mr-sm-2">
                      Kích hoạt
                    </Label>
                    <Select
                      className="MuiPaper-filter__custom--select"
                      id="isActives"
                      name="isActives"
                      onChange={({ value: selectedOption }) =>
                        this.setState({ selectedOption })
                      }
                      isSearchable={true}
                      placeholder={"-- Chọn --"}
                      value={isActive}
                      options={this.state.isActives}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col
            xs={12}
            sm={3}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <div className="d-flex align-items-center mt-3">
              <div className="d-flex flex-fill justify-content-end">
                <FormGroup className="mb-2 ml-2 mb-sm-0">
                  <Button
                    className="col-12 MuiPaper-filter__custom--button"
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
                    className="mr-1 col-12 MuiPaper-filter__custom--button"
                    onClick={this.onClear}
                    size="sm"
                  >
                    <i className="fa fa-refresh" />
                    <span className="ml-1">Làm mới</span>
                  </Button>
                </FormGroup>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

ProductAttributesFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default ProductAttributesFilter;
