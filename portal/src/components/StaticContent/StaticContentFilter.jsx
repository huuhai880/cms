import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
import DatePicker from "../Common/DatePicker";
// Model(s)

class StaticContentFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      selectedIsActive: { label: "Có", value: 1 },
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

  handleChangeActive = (selectedIsActive) => {
    this.setState({ selectedIsActive });
  };

  handleChangeStaticContentOptions = (StaticContentOptions) => {
    this.setState({ StaticContentOptions });
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
      StaticContentOptions,
      create_date_from,
      create_date_to,
      selectedIsActive,
    } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue,
      StaticContentOptions ? StaticContentOptions.value : undefined,
      create_date_from
        ? create_date_from.format("DD/MM/YYYY")
        : create_date_from,
      create_date_to ? create_date_to.format("DD/MM/YYYY") : create_date_to,
      selectedIsActive ? selectedIsActive.value : 2
    );
  };

  onClear = () => {
    const {
      inputValue,
      StaticContentOptions,
      create_date_from,
      create_date_to,
      selectedIsActive,
    } = this.state;
    if (
      inputValue ||
      StaticContentOptions ||
      create_date_from ||
      create_date_to ||
      selectedIsActive
    ) {
      this.setState(
        {
          inputValue: "",
          StaticContentOptions: null,
          create_date_from: null,
          create_date_to: null,
          selectedIsActive: { label: "Có", value: 1 },
        },
        () => {
          this.onSubmit();
        }
      );
    }
  };

  render() {
    const { StaticContentOptions } = this.props;

    return (
      <div className="ml-3 mr-3 mb-3 mt-3">
        <Form autoComplete="nope" className="zoom-scale-9">
          <Row>
            <Col xs={12} sm={3}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">
                  Danh mục website
                </Label>
                <Col className="pl-0 pr-0">
                  <Select
                    className="MuiPaper-filter__custom--select"
                    id="StaticContentOptions"
                    name="StaticContentOptions"
                    onChange={this.handleChangeStaticContentOptions}
                    isSearchable={true}
                    placeholder={"-- Chọn --"}
                    value={this.state.StaticContentOptions}
                    options={StaticContentOptions.map(
                      ({ name: label, id: value }) => ({ value, label })
                    )}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">
                  Ngày tạo
                </Label>
                <Col className="pl-0 pr-0">
                  <DatePicker
                    startDate={this.state.create_date_from}
                    startDateId="your_unique_start_date_id"
                    endDate={this.state.create_date_to}
                    endDateId="your_unique_end_date_id"
                    onDatesChange={({ startDate, endDate }) =>
                      this.setState({
                        create_date_from: startDate,
                        create_date_to: endDate,
                      })
                    } // PropTypes.func.isRequired,
                    isMultiple
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
                  onChange={this.handleChangeActive}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.selectedIsActive}
                  options={this.state.isActives.map(
                    ({ name: label, id: value }) => ({ value, label })
                  )}
                  {...this.props.controlIsActiveProps}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={3} className="mt-md-3">
              <div className="d-flex align-items-center mt-2" style={{height: "100%"}}>
                <div className="d-flex flex-fill justify-content-end">
                  <FormGroup className="mb-2 ml-2 mb-sm-0">
                    <Button
                      className="col-12 MuiPaper-filter__custom--button"
                      onClick={this.onSubmit}
                      color="primary"
                    >
                      <i className="fa fa-search" />
                      <span className="ml-1">Tìm kiếm</span>
                    </Button>
                  </FormGroup>
                  <FormGroup className="mb-2 ml-2 mb-sm-0">
                    <Button
                      className="mr-1 col-12 MuiPaper-filter__custom--button"
                      onClick={this.onClear}
                    >
                      <i className="fa fa-refresh" />
                      <span className="ml-1">Làm mới</span>
                    </Button>
                  </FormGroup>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

StaticContentFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default StaticContentFilter;
