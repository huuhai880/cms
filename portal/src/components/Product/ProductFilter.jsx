import React from "react";
import { Input, Button, Form, FormGroup, Label, Col, Row } from "reactstrap";
import Select from "react-select";

// Component(s)
import DatePicker from "../Common/DatePicker";
import { useState } from "react";
import ProductCategoryModel from "models/ProductCategoryModel/index";
import { useEffect } from "react";

const _productCategoryModel = new ProductCategoryModel();

function ProductFilter({ query = {}, handleSubmitFilter }) {
  const [filter, setFilter] = useState({
    search: "",
    isActiveSelected: { label: "Tất cả", value: 2 },
    productCategorySelected: null,
    startDate: null,
    endDate: null,
  });

  const [productCategory, setProductCategory] = useState([]);

  const [dataIsActive] = useState([
    { label: "Tất cả", value: 2 },
    { label: "Có", value: 1 },
    { label: "Không", value: 0 },
  ]);

  useEffect(() => {
    getProductCategoryOption();
  }, []);

  const getProductCategoryOption = async () => {
    try {
      let data = await _productCategoryModel.getOptions({ is_active: 1 });
      setProductCategory(data);
    } catch (error) {
      window._$g.dialogs.alert(
        window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại")
      );
    }
  };

  const handleChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (e) => {
    if (1 * e.keyCode === 13) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChangeSelect = (selected, name) => {
    setFilter((preState) => ({
      ...preState,
      [name]: selected,
    }));
  };

  const handleSubmit = () => {
    let {
      search,
      isActiveSelected,
      productCategorySelected,
      startDate,
      endDate,
    } = filter;

    handleSubmitFilter({
      search,
      is_active: isActiveSelected ? isActiveSelected.value : 2,
      product_category_id: productCategorySelected
        ? productCategorySelected.value
        : null,
      start_date: startDate ? startDate.format("DD/MM/YYYY") : null,
      end_date: endDate ? endDate.format("DD/MM/YYYY") : null,
      page: 1,
    });
  };

  const handleClear = () => {
    setFilter({
      search: "",
      isActiveSelected: { label: "Tất cả", value: 2 },
      productCategorySelected: null,
      startDate: null,
      endDate: null,
    });

    handleSubmitFilter({
      search: "",
      is_active: 2,
      product_category_id: null,
      start_date: null,
      end_date: null,
      page: 1,
    });
  };

  const handleChangeDate = ({ startDate, endDate }) => {
    setFilter((preState) => ({
      ...preState,
      startDate,
      endDate,
    }));
  };

  return (
    <div className="ml-3 mr-3 mb-3 mt-3">
      <Form
        autoComplete="nope"
        //   className="zoom-scale-9"
      >
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
                name="search"
                placeholder="Nhập mã sản phẩm, tên sản phẩm"
                value={filter.search}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                inputprops={{
                  name: "search",
                }}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={3}>
            <FormGroup className="mb-2 mb-sm-0">
              <Label for="" className="mr-sm-2">
                Danh mục sản phẩm
              </Label>
              <Select
                className="MuiPaper-filter__custom--select"
                id="productCategorySelected"
                name="productCategorySelected"
                onChange={(selected) =>
                  handleChangeSelect(selected, "productCategorySelected")
                }
                isSearchable={true}
                placeholder={"-- Chọn --"}
                value={filter.productCategorySelected}
                options={productCategory.map(({ id: value, name: label }) => ({
                  value,
                  label,
                }))}
                isClearable={true}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={3}>
            <FormGroup className="mb-2 mb-sm-0">
              <Label for="" className="mr-sm-2">
                Ngày tạo từ
              </Label>
              <Col className="pl-0 pr-0">
                <DatePicker
                  startDate={filter.startDate}
                  startDateId="start_date_id"
                  endDate={filter.endDate}
                  endDateId="end_date_id"
                  onDatesChange={handleChangeDate}
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
                id="isActiveSelected"
                name="isActiveSelected"
                onChange={(selected) =>
                  handleChangeSelect(selected, "isActiveSelected")
                }
                isSearchable={true}
                placeholder={"-- Chọn --"}
                value={filter.isActiveSelected}
                options={dataIsActive}
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
                onClick={handleSubmit}
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
                onClick={handleClear}
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

export default ProductFilter;
