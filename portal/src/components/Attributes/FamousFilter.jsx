import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
// import DatePicker from "../Common/DatePicker";
// import { DatePicker } from "antd";
import RangePicker from "../../containers/Common/widget/RangeTimePicker";
// import "antd/dist/antd.css";
import "moment/locale/vi";
import { FormSelectGroup } from "../../containers/Common/widget";
import { mapDataOptions4Select } from "../../utils/html";
import moment from "moment";

//import BusinessModel from '../../models/ ';
class NewsFilter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
    };
  }

  handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      this.onSubmit();
    }
  };

  onSubmit = (isReset = false) => {
    let { keyword } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(isReset, keyword ? keyword.trim() : null);
  };

  onClear = () => {
    const { keyword } = this.state;
    if (keyword) {
      this.setState(
        {
          keyword: "",
        },
        () => {
          this.onSubmit(true);
        }
      );
    }
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { newsCategoryArr, handlePick } = this.props;
    return (
      <div className="ml-3 mr-3 mb-3 mt-3">
        <Form autoComplete="nope" className="zoom-scale-9">
          <Row>
            <Col xs={12} sm={8}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="keyword" className="mr-sm-2">
                  Từ khóa
                </Label>
                <Input
                  className="MuiPaper-filter__custom--input"
                  autoComplete="nope"
                  type="text"
                  name="keyword"
                  placeholder="Nhập từ tên người nổi tiếng, chức danh"
                  value={this.state.keyword}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  inputprops={{
                    name: "keyword",
                  }}
                />
              </FormGroup>
            </Col>
            
            <Col xs={12} sm={4} className="d-flex align-items-end justify-content-end">
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
              {handlePick ? (
                <FormGroup className="mb-2 ml-2 mb-sm-0">
                  <Button
                    className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePick();
                    }}
                    color="success"
                    size="sm"
                  >
                    <i className="fa fa-plus" />
                    <span className="ml-1"> Chọn </span>
                  </Button>
                </FormGroup>
              ) : null}
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

NewsFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default NewsFilter;
