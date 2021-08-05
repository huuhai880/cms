import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
// Model(s)

class ContactCustomerFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      keyContact: null,
      keyContactOptions: [
        { label: "Tất cả", value: "" },
        { label: "Trang liên hệ", value: "contact" },
        { label: "Trang góc tác giả", value: "author" },
        { label: "Trang góc nhà xuất bản", value: "publisingcompany" },
        { label: "Trang dịch vụ", value: "service" },
        { label: "Trang dự án", value: "plan" },
      ],
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangePlanCategory = (keyContact) => {
    this.setState({ keyContact });
  };

  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  onSubmit = () => {
    const { inputValue, keyContact } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(inputValue, keyContact ? keyContact.value : undefined);
  };

  onClear = () => {
    const { inputValue, status, keyContact } = this.state;
    if (inputValue || status || keyContact) {
      this.setState(
        {
          inputValue: "",
          keyContact: null,
        },
        () => {
          this.onSubmit();
        }
      );
    }
  };

  render() {
    const { keyContactOptions = [] } = this.state;
    const { statusOpts } = this.state;
    return (
      <div className="ml-3 mr-3 mb-3 mt-3">
        <Row>
          <Col sm={9}>
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
                      placeholder="Nhập tên người liên hệ, SĐT, email"
                      value={this.state.inputValue}
                      onChange={this.handleChange}
                      onKeyDown={this.handleKeyDown}
                      inputprops={{
                        name: "inputValue",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup className="mb-2 mb-sm-0">
                    <Label for="" className="mr-sm-2">
                      Trang liên hệ
                    </Label>
                    <Select
                      className="MuiPaper-filter__custom--select"
                      id="keyContactOptions"
                      name="keyContactOptions"
                      onChange={this.handleChangePlanCategory}
                      isSearchable={true}
                      placeholder={"-- Chọn --"}
                      value={this.state.keyContact}
                      options={keyContactOptions}
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

ContactCustomerFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default ContactCustomerFilter;
