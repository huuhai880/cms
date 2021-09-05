import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
import DatePicker from "../Common/DatePicker";
import { mapDataOptions4Select } from "../../utils/html";
// Model(s)
import BusinessModel from "../../models/BusinessModel";

class CustomerTypeFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this._businessModel = new BusinessModel();

    this.state = {
      inputValue: "",
      selectedActive: 1,
      selectedDefault: 2,
      businessArr: [{ label: "-- Chọn --", value: "" }],
      /** @var {Array} */
      isActives: [
        { label: "Tất cả", value: 2 },
        { label: "Có", value: 1 },
        { label: "Không", value: 0 },
      ],
      isDefault: [
        { label: "Tất cả", value: 2 },
        { label: "Có", value: 1 },
        { label: "Không", value: 0 },
      ],
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeSelectActive = ({ value: selectedActive }) => {
    this.setState({ selectedActive });
  };

  handleChangeSelectDefault = ({ value: selectedDefault }) => {
    this.setState({ selectedDefault });
  };


  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };
  handleChangeCompany = ({ value: company_id }) => {
    this.setState({ company_id });
    this._businessModel
      .getOptions({ parent_id: company_id || -1 })
      .then((data) => {
        // console.log(data)
        let { businessArr } = this.state;
        // console.log(businessArr);
        businessArr = [businessArr[0]].concat(mapDataOptions4Select(data));
        this.setState({ businessArr, company_id });
      });
  };

  handleChangeBusiness = ({ value: business_id }) => {
    this.setState({ business_id });
  };
  onSubmit() {
    // console.log(this.state);
    const { inputValue, selectedDefault, selectedActive } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit({
      search: inputValue ? inputValue.trim() : "",
      is_default: selectedDefault,
      is_active: selectedActive,
    });
  }

  onClear = () => {
    const { inputValue, selectedDefault, selectedActive } = this.state;
    if (inputValue || selectedDefault || selectedActive) {
      this.setState(
        {
          inputValue: "",
          selectedDefault: 2,
          selectedActive: 1,
        },
        () => {
          this.onSubmit(true);
        }
      );
    }
  };

  render() {
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
                  placeholder="Nhập tên loại khách hàng"
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
                  Mặc định
                </Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="isDefaut"
                  name="isDefaut"
                  onChange={this.handleChangeSelectDefault}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.isDefault.find(
                    (item) => "" + item.value === "" + this.state.selectedDefault
                  )}
                  options={this.state.isDefault}
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
                  value={this.state.isActives.find(
                    (item) => "" + item.value === "" + this.state.selectedActive
                  )}
                  options={this.state.isActives}
                />
              </FormGroup>
            </Col>
            <Col
              xs={12}
              sm={3}
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

CustomerTypeFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default CustomerTypeFilter;
