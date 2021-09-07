import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";
import { FormSelectGroup } from "@widget";
import { mapDataOptions4Select } from "@utils/html";

// Component(s)
// Model(s)

class ProductFilter extends PureComponent {
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
      productOptions: "",
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedOption });
  };

  handleChangeCompany = (company) => {
    this.setState({ company });
  };

  handleChangeProductOptions = (productOptions) => {
    this.setState({ productOptions });
  };

  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  onSubmit = () => {
    const { inputValue, selectedOption, company, productOptions } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue ? inputValue.trim() : null,
      selectedOption ? selectedOption.value : 2,
      company ? company.value : undefined,
      productOptions ? productOptions.value : undefined
    );
  };

  onClear = () => {
    const { inputValue, selectedOption, company, productOptions } = this.state;
    if (inputValue || selectedOption || company || productOptions) {
      this.setState(
        {
          inputValue: "",
          selectedOption: { label: "Có", value: 1 },
          company: null,
          productOptions: "",
        },
        () => {
          this.onSubmit();
        }
      );
    }
  };

  render() {
    const { company, productOptions } = this.props;

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
                  placeholder="Nhập tên danh mục sản phẩm"
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
                  Thuộc danh mục sách
                </Label>
                <Col className="pl-0 pr-0">
                  <FormSelectGroup
                    list={mapDataOptions4Select(productOptions)}
                    selectOnly={true}
                    name="productOptions"
                    onChange={this.handleChangeProductOptions}
                    placeHolder={"-- Chọn --"}
                    value={this.state.productOptions}
                    isUseForm={false}
                    portalTarget={null}
                    isObject
                  />
                  
                </Col>
              </FormGroup>
            </Col>
            <Col xs={12} sm={4}>
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
              sm={12}
              className="d-flex align-items-end justify-content-end mt-3"
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

ProductFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default ProductFilter;
