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

// Model(s)
import AreaModel from "../../models/AreaModel";


class PriceFilter extends PureComponent {
  _areaModel

  constructor(props) {
    super(props)

    // Init model(s)
    this._areaModel = new AreaModel()

    this.state = {
      selectedOption: {label: "Có", value: 1},
      /** @var {Array} */
      isActives: [
        { name: "Tất cả", id: 2 },
        { name: "Có", id: 1 },
        { name: "Không", id: 0 },
      ],
      isServiceArray: [
        { name: "Tất cả", id: 2 },
        { name: "Có", id: 1 },
        { name: "Không", id: 0 },
      ]
    }
  }

  componentDidMount(){
  }

  handleChangeSelect = selectedOption => {
    this.setState({ selectedOption })
  }

  handleKeyDown = event => {
    if ((1 * event.keyCode) === 13) {
      event.preventDefault()
      this.onSubmit()
    }
  }

  onSubmit = () => {
    const { inputValue, selectedOption, productCategory, isService } = this.state;
    const { handleSubmit } = this.props;
    handleSubmit(
      inputValue,
      selectedOption ? selectedOption.value : 2,
      isService ? isService.value : 2,
      productCategory ? productCategory.value : undefined,
    )
  }

  onClear = () => {
    const { inputValue, selectedOption, productCategory, isService } = this.state
    if (inputValue || selectedOption || productCategory || isService) {
      this.setState({
        inputValue: null,
        selectedOption: { label: "Có", value: 1 },
        isService: null,
        productCategory: {},
      }, () => {
        this.onSubmit()
      })
    }
  }

  render() {
    const { isServiceArray } = this.state;
    const { productCategoryArray } = this.props;
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
                  placeholder="Nhập mã sản phẩm, tên sản phẩm"
                  value={this.state.inputValue}
                  onChange={(event) => this.setState({ inputValue: event.target.value }) }
                  onKeyDown={this.handleKeyDown}
                  inputprops={{
                    name: 'inputValue',
                  }}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">Sản phẩm dịch vụ</Label>
                <Col className="pl-0 pr-0">
                  <Select
                    className="MuiPaper-filter__custom--select"
                    name="is_service"
                    onChange={(value) => this.setState({isService: value})}
                    isSearchable={true}
                    placeholder={"-- Chọn --"}
                    value={this.state.isService}
                    options={isServiceArray.map(({ name: label, id: value }) => ({ value, label }))}
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">Danh mục sản phẩm</Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="isActives"
                  name="isActives"
                  onChange={(value) => this.setState({productCategory: value})}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.productCategory}
                  // options={productCategoryArray.map(({ name: label, id: value }) => ({ value, label }))}
                  options={[]}
                />
              </FormGroup>
            </Col>
            <Col xs={12} sm={3}>
              <FormGroup className="mb-2 mb-sm-0">
                <Label for="" className="mr-sm-2">Kích hoạt</Label>
                <Select
                  className="MuiPaper-filter__custom--select"
                  id="isActives"
                  name="isActives"
                  onChange={this.handleChangeSelect}
                  isSearchable={true}
                  placeholder={"-- Chọn --"}
                  value={this.state.selectedOption}
                  options={this.state.isActives.map(({ name: label, id: value }) => ({ value, label }))}
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

PriceFilter.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default PriceFilter
