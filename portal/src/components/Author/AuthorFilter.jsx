import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

import FormSelectGroup from "../../containers/Common/widget/FormSelectGroup";
// Component(s)
// Model(s)

class AuthorFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      /** @var {Array} */
      statusOpts: [
        { name: "Tất cả", id: 2 },
        { name: "Có", id: 1 },
        { name: "Không", id: 0 },
      ],
      status: { label: "Có", value: 1 },
      newsCategory: { label: "Tất cả", value: "" },
    };
    this.defaultOpts = [
      { label: "Tất cả", value: "", id: "", name: "Tất cả", parent_id: null },
    ];
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeStatus = (status) => {
    this.setState({ status });
  };

  handleChangeNewsCategory = (newsCategory) => {
    this.setState({ newsCategory });
  };

  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  onSubmit = () => {
    const { inputValue, status, newsCategory } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue ? inputValue.trim() : "",
      status ? status.value : undefined,
      newsCategory ? newsCategory.value : undefined
    );
  };

  onClear = () => {
    const { inputValue, status, newsCategory } = this.state;
    if (inputValue || status || newsCategory) {
      this.setState(
        {
          inputValue: "",
          status: { label: "Tất cả", value: 2 },
          newsCategory: { label: "Tất cả", value: "" },
        },
        () => {
          this.onSubmit();
        }
      );
    }
  };

  render() {
    const { newsCategoryOpts = [] } = this.props;
    const { statusOpts } = this.state;
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
                  placeholder="Tên tác giả, SĐT, Email"
                  value={this.state.inputValue}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  inputprops={{
                    name: "inputValue",
                  }}
                />
              </FormGroup>
            </Col>
            {/* <Col xs={12} sm={3}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">
                  Danh mục bài viết
                </Label>
                <FormSelectGroup
                  list={this.defaultOpts.concat(newsCategoryOpts)}
                  selectOnly={true}
                  name="newsCategoryOpts"
                  onChange={this.handleChangeNewsCategory}
                  placeHolder={"-- Chọn --"}
                  value={this.state.newsCategory}
                  isUseForm={false}
                  portalTarget={null}
                  isObject
                />
              </FormGroup>
            </Col> */}
            <Col xs={12} sm={4}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">
                  Kích hoạt
                </Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="status"
                  name="status"
                  onChange={this.handleChangeStatus}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.status}
                  options={statusOpts.map(({ name: label, id: value }) => ({
                    value,
                    label,
                  }))}
                />
              </FormGroup>
            </Col>
            <Col
              xs={12}
              sm={4}
              className="d-flex align-items-end justify-content-end"
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

AuthorFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default AuthorFilter;
