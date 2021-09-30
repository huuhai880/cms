import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
// Model(s)
import AttributesModel from "../../models/AttributesModel";

class AttributesFilter extends PureComponent {
  constructor(props) {
    super(props);

    this._attributesModel = new AttributesModel();

    this.state = {
      is_active: { label: "Có", value: 1 },
      isActives: [
        { name: "Tất cả", id: 2 },
        { name: "Có", id: 1 },
        { name: "Không", id: 0 },
      ],
      OptsPartner: [{ id: -1, name: "My success JSC" }],
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeIsActive = (is_active) => {
    this.setState({ is_active });
  };

  handleChangeGroup = (attributes_group_id) => {
    this.setState({ attributes_group_id });
  };

  handleChangeGroupPartner = (partner_id) => {
    this.setState({ partner_id });
  };

  componentDidMount() {
    (async () => {
      let OptsGroup = await this._attributesModel.getOptionGroup({
        is_active: 1,
      });
      let OptsPartner = await this._attributesModel.getOptionPartner({
        is_active: 1,
      });
      OptsPartner = this.state.OptsPartner.concat(OptsPartner);
      this.setState({ OptsGroup, OptsPartner });
    })();
    //.end
  }

  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  onSubmit = () => {
    const { inputValue, is_active, attributes_group_id, partner_id } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue ? inputValue.trim() : "",
      attributes_group_id ? attributes_group_id.value : "",
      is_active ? is_active.value : undefined,
      partner_id ? partner_id.value : null
    );
  };

  onClear = () => {
    if (this.state.inputValue || this.state.is_active || this.state.partner_id) {
      this.setState(
        {
          inputValue: "",
          attributes_group_id: "",
          is_active: { label: "Có", value: 1 },
          partner_id: "",
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
                  placeholder="Nhập tên thuộc tính, giá trị"
                  value={this.state.inputValue || ""}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  inputprops={{
                    name: "inputValue",
                  }}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
              <FormGroup className="mb-2 mb-sm-0 ">
                <Label for="" className="mr-sm-2">
                Chỉ số
                </Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="is_active"
                  name="is_active"
                  onChange={this.handleChangeGroup}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.attributes_group_id}
                  options={
                    this.state.OptsGroup &&
                    this.state.OptsGroup.map(({ name: label, id: value }) => ({
                      value,
                      label,
                    }))
                  }
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
              <FormGroup className="mb-2 mb-sm-0 ">
                <Label for="" className="mr-sm-2">
                  Đối tác
                </Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="is_active"
                  name="is_active"
                  onChange={this.handleChangeGroupPartner}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.partner_id}
                  options={
                    this.state.OptsPartner &&
                    this.state.OptsPartner.map(({ name: label, id: value }) => ({
                      value,
                      label,
                    }))
                  }
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
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
                  options={this.state.isActives.map(({ name: label, id: value }) => ({
                    value,
                    label,
                  }))}
                />
              </FormGroup>
            </Col>
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

AttributesFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default AttributesFilter;
