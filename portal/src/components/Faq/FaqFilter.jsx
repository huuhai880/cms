import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
// Model(s)

class FaqFilter extends PureComponent {
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
      faqTypeOption: { label: "Tất cả", value: null },
      faqTypeOptions: [
        { name: "Tất cả", id: null },
        { name: "Góc tác giả", id: 1 },
        { name: "Góc nhà xuất bản", id: 2 },
      ],
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedOption });
  };
  handleChangeFaqType = (faqTypeOption) => {
    this.setState({ faqTypeOption });
  };

  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  onSubmit = () => {
    const { inputValue, selectedOption, faqTypeOption } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue,
      selectedOption ? selectedOption.value : 2,
      faqTypeOption ? faqTypeOption.value : null
    );
  };

  onClear = () => {
    const { inputValue, selectedOption } = this.state;
    if (inputValue || selectedOption) {
      this.setState(
        {
          inputValue: "",
          selectedOption: { label: "Có", value: 1 },
          faqTypeOption: { label: "Tất cả", value: null },
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
        <Row>
          <Col xs={12} sm={9}>
            <Form autoComplete="nope" className="zoom-scale-9">
              <Row>
                <Col xs={12} sm={5}>
                  <FormGroup className="mb-2 mb-sm-0">
                    <Label for="inputValue" className="mr-sm-2">
                      Từ khóa
                    </Label>
                    <Input
                      className="MuiPaper-filter__custom--input"
                      autoComplete="nope"
                      type="text"
                      name="inputValue"
                      placeholder="Nhập câu hỏi"
                      value={this.state.inputValue}
                      onChange={this.handleChange}
                      onKeyDown={this.handleKeyDown}
                      inputprops={{
                        name: "inputValue",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={5}>
                  <FormGroup className="mb-2 mb-sm-0">
                    <Label for="" className="mr-sm-2">
                      Phân loại
                    </Label>
                    <Select
                      className="MuiPaper-filter__custom--select"
                      id="faq_type"
                      name="faq_type"
                      onChange={this.handleChangeFaqType}
                      isSearchable={true}
                      placeholder={"-- Chọn --"}
                      value={this.state.faqTypeOption}
                      options={this.state.faqTypeOptions.map(
                        ({ name: label, id: value }) => ({ value, label })
                      )}
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

FaqFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default FaqFilter;
