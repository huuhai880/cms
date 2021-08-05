import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  Col,
  Row,
 } from 'reactstrap'
 import Select from 'react-select'

// Component(s)
// Model(s)

class AuthorFilter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      statusOpts: [
        { name: "Tất cả", id: 2 },
        { name: "Có", id: 1 },
        { name: "Không", id: 0 },
      ],
      status: { label: "Tất cả", value: 2 }
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeStatus = status => {
    this.setState({ status })
  }

  handleChangePlanCategory = planCategory => {
    this.setState({ planCategory })
  }

  handleKeyDown = event => {
    if ((1 * event.keyCode) === 13) {
      event.preventDefault()
      this.onSubmit()
    }
  }

  onSubmit = () => {
    const { inputValue, status, planCategory } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue,
      status ? status.value : 2,
      planCategory ? planCategory.value : undefined
    )
  }

  onClear = () => {
    const { inputValue, status, planCategory } = this.state;
    if (inputValue || status || planCategory ) {
      this.setState({
        inputValue: "",
        status: { label: "Tất cả", value: 2 },
        planCategory: null
      }, () => {
        this.onSubmit()
      })
    }
  }

  render() {
    const { planCategoryOptions = [] } = this.props
    const { statusOpts } = this.state;
    return (
      <div  className="ml-3 mr-3 mb-3 mt-3">
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
                  placeholder="Tên dự án"
                  value={this.state.inputValue}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  inputprops={{
                    name: 'inputValue',
                  }}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={4}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">Danh mục</Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="planCategoryOptions"
                  name="planCategoryOptions"
                  onChange={this.handleChangePlanCategory}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.planCategory}
                  options={planCategoryOptions}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">Kích hoạt</Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="status"
                  name="status"
                  onChange={this.handleChangeStatus}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.status}
                  options={statusOpts.map(({ name: label, id: value }) => ({ value, label }))}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <div className="d-flex align-items-center mt-3">
          <div className="d-flex flex-fill justify-content-end">
            <FormGroup className="mb-2 ml-2 mb-sm-0">
              <Button className="col-12 MuiPaper-filter__custom--button" onClick={this.onSubmit} color="primary" size="sm">
                <i className="fa fa-search" />
                <span className="ml-1">Tìm kiếm</span>
              </Button>
            </FormGroup>
            <FormGroup className="mb-2 ml-2 mb-sm-0">
              <Button className="mr-1 col-12 MuiPaper-filter__custom--button" onClick={this.onClear} size="sm">
                <i className="fa fa-refresh" />
                <span className="ml-1">Làm mới</span>
              </Button>
            </FormGroup>
          </div>
        </div>
      </div>
    )
  }
}

AuthorFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default AuthorFilter

