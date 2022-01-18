import React, { useState, useEffect } from "react";

import {
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  Col,
  Row,
  CardHeader,
  Card,
  CardBody,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import Select from "react-select";
import DatePicker from "../Common/DatePicker";
import moment from "moment";
import "./style.scss";
import { formatPrice } from "utils/index";
import NumberFormat from "../Common/NumberFormat";
import OrderModel from "models/OrderModel/index";
import { mapDataOptions4Select } from "utils/html";

function Filter({ handleSubmitFillter, report = {} }) {
  const [checkStartDate, setCheckStartDate] = useState(true);
  const [checkEndDate, setCheckEndDate] = useState(true);
  const [dateToDate, setDateToDate] = useState("");
  const [dateFromDate, setDateFromDate] = useState("");
  const [productOption, setProductOption] = useState([]);
  //   const [ nameTag, setNameTag] = useState('Chọn ngày')

  const [orderStatusOption] = useState([
    { label: "Tất cả", value: 2 },
    { label: "Chưa thanh toán", value: 0 },
    { label: "Đã thanh toán", value: 1 },
  ]);

  const [isDeletedOption] = useState([
    { label: "Tất cả", value: 2 },
    { label: "Không", value: 0 },
    { label: "Có", value: 1 },
  ]);

  const [orderTypeOption] = useState([
    { label: "Tất cả", value: 2 },
    { label: "Website", value: 0 },
    { label: "Portal", value: 1 },
  ]);

  const [searchValue, setSearchValue] = useState({
    keyword: "",
    isDeletedSelected: { value: "0", label: "Không" },
    orderStatusSelected: { label: "Đã thanh toán", value: 1 },
    startDate: null,
    endDate: null,
    productSelected: null,
    fromPrice: 0,
    toPrice: 0,
    orderTypeSelected: { label: "Tất cả", value: 2 },
    nameTag: "Tháng này",
  });

  let { total_quantity = 0, total_order = 0, total_amount = 0 } = report || {};

  useEffect(() => {
    let pickerLeft = document.querySelector("#your_unique_start_date_id");
    pickerLeft.addEventListener("keyup", (e) => {
      if (e.target.value) {
        var checkStartDate =
          /^(?:0?[1-9]?|[12]\d|3[01])(?:\/(?:0?[1-9]|1[012])?)\/\d{0,4}$|^\d{4}?$/.test(
            e.target.value
          );
      }

      setCheckStartDate(checkStartDate);
      setDateFromDate(e.target.value);
    });

    let pickerRight = document.querySelector("#your_unique_end_date_id");
    pickerRight.addEventListener("keyup", (e) => {
      if (e.target.value) {
        var checkEndDate =
          /^(?:0?[1-9]?|[12]\d|3[01])(?:\/(?:0?[1-9]|1[012])?)\/\d{0,4}$|^\d{4}?$/.test(
            e.target.value
          );
      }
      setCheckEndDate(checkEndDate);
      setDateToDate(e.target.value);
    });

    setSearchValue({
      ...searchValue,
      startDate: moment().startOf("month"),
      endDate: moment(),
    });

    getOptionProduct();
  }, []);

  const getOptionProduct = async () => {
    try {
      const _orderModel = new OrderModel();
      let data = await _orderModel.getOptionProduct();
      let _productOption = mapDataOptions4Select(
        data,
        "temp_id",
        "product_name"
      );
      setProductOption(_productOption);
    } catch (error) {
      window._$g.dialogs.alert(
        window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
      );
    }
  };

  const _handleSubmitFillter = () => {
    let {
      keyword,
      orderStatusSelected,
      isDeletedSelected,
      startDate,
      endDate,
      fromPrice,
      toPrice,
      orderTypeSelected,
      productSelected,
    } = searchValue;
    var mydate = moment(dateToDate, "DD/MM/YYYY");
    var myStartDate = startDate ? startDate.format("DD/MM/YYYY") : "";
    if (myStartDate) {
      myStartDate = moment(myStartDate, "DD/MM/YYYY");
    }
    if (
      checkStartDate == false ||
      checkEndDate == false ||
      (checkStartDate == false && checkEndDate == false)
    ) {
      window._$g.dialogs.alert(
        window._$g._(`Vui lòng nhập đúng định dạng ngày tạo.`),
        () => {
          window.location.reload();
        }
      );
    }

    let value = {
      keyword: keyword ? keyword.trim() : null,
      order_status: orderStatusSelected ? orderStatusSelected.value : 2,
      is_deleted: isDeletedSelected ? isDeletedSelected.value : 0,
      start_date: startDate ? startDate.format("DD/MM/YYYY") : null,
      end_date: endDate ? endDate.format("DD/MM/YYYY") : null,
      product_id: productSelected ? productSelected.product_id : null,
      combo_id: productSelected ? productSelected.combo_id : null,
      from_price: fromPrice,
      to_price: toPrice,
      order_type: orderTypeSelected ? orderTypeSelected.value : 2,
      is_combo: productSelected ? productSelected.is_combo : false,
    };

    handleSubmitFillter(value);
  };

  const handleClear = () => {
    setSearchValue({
      keyword: "",
      orderStatusSelected: { value: "2", label: "Tất cả" },
      isDeletedSelected: { value: "0", label: "Không" },
      startDate: moment().startOf("month"),
      endDate: moment(),
      productSelected: null,
      fromPrice: 0,
      toPrice: 0,
      orderTypeSelected: { label: "Tất cả", value: 2 },
      nameTag: "Tháng này",
    });

    let value = {
      keyword: null,
      order_status: 2,
      is_deleted: 0,
      start_date: moment().startOf("month").format("DD/MM/YYYY"),
      end_date: moment().format("DD/MM/YYYY"),
      product_id: null,
      combo_id: null,
      from_price: 0,
      to_price: 0,
      order_type: 2,
      is_combo: false,
    };
    handleSubmitFillter(value);
  };

  const handleKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      _handleSubmitFillter();
    }
  };

  const handleChange = (e) => {
    setSearchValue({
      ...searchValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeSelect = (selected, name) => {
    setSearchValue((preState) => ({
      ...preState,
      [name]: selected,
    }));
  };

  const handleChangeDate = ({ startDate, endDate }) => {
    setSearchValue((preState) => ({
      ...preState,
      startDate,
      endDate,
    }));
  };

  const handleChangePrice = (price, name) => {
    setSearchValue((pre) => ({
      ...pre,
      [name]: price,
    }));
  };

  const isAllowed = (values) => {
    const { floatValue = 0 } = values;
    return floatValue >= 0 && floatValue <= 999999999;
  };

  const renderCalendarInfo = () => {
    let data = [
      "Hôm nay",
      "Hôm qua",
      "Tuần này",
      "Tuần trước",
      "Tháng này",
      "Tháng trước",
      "Chọn ngày",
    ];
    return (
      <Col style={{ width: "150px" }} sm={12} className="pl-0 pr-0 bl">
        {data.map((item) => {
          return (
            <Col
              sm={12}
              onClick={() => {
                calendar(item);
              }}
              className={`pt-3 pb-1 hover cursor-pointer ${
                searchValue.nameTag == item ? "focus" : ""
              }`}
            >
              <Label className="cursor-pointer">{item}</Label>
            </Col>
          );
        })}
      </Col>
    );
  };

  const calendar = (key) => {
    switch (key) {
      case "Hôm nay": {
        setSearchValue((pre) => ({
          ...searchValue,
          startDate: moment(),
          endDate: moment(),
          nameTag: "Hôm nay",
        }));
        break;
      }

      case "Hôm qua": {
        setSearchValue((pre) => ({
          ...searchValue,
          startDate: moment().subtract(1, "days"),
          endDate: moment().subtract(1, "days"),
          nameTag: "Hôm qua",
        }));
        break;
      }

      case "Tuần này": {
        setSearchValue((pre) => ({
          ...searchValue,
          startDate: moment().startOf("week").add(1, "days"),
          endDate: moment(),
          nameTag: "Tuần này",
        }));
        break;
      }

      case "Tuần trước": {
        setSearchValue((pre) => ({
          ...searchValue,
          startDate: moment()
            .subtract(1, "week")
            .startOf("week")
            .add(1, "days"),
          endDate: moment().subtract(1, "week").endOf("week").add(1, "days"),
          nameTag: "Tuần trước",
        }));

        break;
      }

      case "Tháng này": {
        setSearchValue((pre) => ({
          ...searchValue,
          startDate: moment().startOf("month"),
          endDate: moment(),
          nameTag: "Tháng này",
        }));
        break;
      }

      case "Tháng trước": {
        setSearchValue((pre) => ({
          ...searchValue,
          startDate: moment().subtract(1, "month").startOf("month"),
          endDate: moment().subtract(1, "month").endOf("month"),
          nameTag: "Tháng trước",
        }));
        break;
      }

      case "Chọn ngày": {
        setSearchValue((pre) => ({
          ...searchValue,
          startDate: moment(),
          endDate: moment(),
          nameTag: "Chọn ngày",
        }));
        break;
      }
    }
  };

  return (
    <div className="ml-3 mr-3 mb-3 mt-3">
      <Form autoComplete="nope" className="zoom-scale-9">
        <Row>
          <Col sm={3} xs={12}>
            <Card style={{ height: "100%" }}>
              <CardHeader className="d-flex">
                <div className="flex-fill font-weight-bold">
                  Báo cáo, Thống kê
                </div>
              </CardHeader>
              <CardBody style={{ padding: 10 }} className="rp-body">
                <Row className="mb-2" style={{ alignItems: "center" }}>
                  <Col xs={6}>
                    <span className="font-weight-bold">Tổng đơn hàng</span>
                  </Col>
                  <Col xs={6}>
                    <div className="rp-number-order">
                      {total_order ? total_order : 0}
                    </div>
                  </Col>
                </Row>
                <Row className="mb-2" style={{ alignItems: "center" }}>
                  <Col xs={6}>
                    <span className="font-weight-bold">Tổng sản phẩm</span>
                  </Col>
                  <Col xs={6}>
                    <div className="rp-number-order">
                      {total_quantity ? total_quantity : 0}
                    </div>
                  </Col>
                </Row>
                <Row className="mb-2" style={{ alignItems: "center" }}>
                  <Col xs={6}>
                    <span className="font-weight-bold">Tổng doanh thu</span>
                  </Col>
                  <Col xs={6}>
                    <div className="rp-number-order">
                      {formatPrice(total_amount)} đ
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm={9} xs={12}>
            <Row style={{ marginBottom: 5 }}>
              <Col sm={8} xs={12} style={{ padding: 0 }}>
                <Col
                  xs={12}
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Label for="inputValue" className="mr-sm-2">
                    Từ khóa
                  </Label>
                  <Col className="pl-0 pr-0">
                    <Input
                      className="MuiPaper-filter__custom--input pr-0"
                      autoComplete="nope"
                      type="text"
                      name="keyword"
                      placeholder="Nhập mã đơn hàng, tên khách hàng, mã khuyến mãi"
                      onKeyDown={handleKeyDown}
                      value={searchValue.keyword}
                      onChange={handleChange}
                    />
                  </Col>
                </Col>
              </Col>

              <Col sm={4} xs={12} style={{ padding: 0 }}>
                <Col
                  xs={12}
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Label for="" className="mr-sm-2">
                    Sản phẩm
                  </Label>
                  <Col className="pl-0 pr-0">
                    <Select
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      placeholder={"-- Chọn --"}
                      onChange={(e) => handleChangeSelect(e, "productSelected")}
                      value={searchValue.productSelected}
                      options={productOption}
                      isClearable={true}
                      isSearchable={true}
                    />
                  </Col>
                </Col>
              </Col>
            </Row>

            <Row style={{ marginBottom: 5 }}>
              <Col sm={4} xs={12} style={{ padding: 0 }}>
                <Col
                  xs={12}
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Label for="" className="mr-sm-2">
                    Thời gian
                  </Label>
                  <Col className="pl-0 pr-0">
                    <DatePicker
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      startDate={searchValue.startDate}
                      startDateId="your_unique_start_date_id"
                      endDate={searchValue.endDate}
                      endDateId="your_unique_end_date_id"
                      onDatesChange={handleChangeDate}
                      isMultiple
                      calendarInfoPosition="before"
                      renderCalendarInfo={renderCalendarInfo}
                    />
                  </Col>
                </Col>
              </Col>

              <Col sm={4} xs={12} style={{ padding: 0 }}>
                <Col
                  xs={12}
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Label for="inputValue" className="mr-sm-2">
                    Mức thanh toán
                  </Label>
                  <Col className="pl-0 pr-0">
                    <InputGroup>
                      <NumberFormat
                        type="text"
                        name="fromPrice"
                        disabled={false}
                        allowNegative={false}
                        thousandSeparator=","
                        decimalSeparator="."
                        value={
                          searchValue.fromPrice ? searchValue.fromPrice : ""
                        }
                        onValueChange={({ value }) => {
                          let price = 1 * value.replace(/,/g, "");
                          handleChangePrice(price, "fromPrice");
                        }}
                        isAllowed={isAllowed}
                      />

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <svg
                          className="DateRangePickerInput_arrow_svg DateRangePickerInput_arrow_svg_1"
                          focusable="false"
                          viewBox="0 0 1000 1000"
                        >
                          <path d="M694 242l249 250c12 11 12 21 1 32L694 773c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210-210H68c-13 0-23-10-23-23s10-23 23-23h806L662 275c-21-22 11-54 32-33z"></path>
                        </svg>
                      </div>
                      <NumberFormat
                        type="text"
                        name="toPrice"
                        disabled={false}
                        allowNegative={false}
                        thousandSeparator=","
                        decimalSeparator="."
                        value={searchValue.toPrice ? searchValue.toPrice : ""}
                        onValueChange={({ value }) => {
                          let price = 1 * value.replace(/,/g, "");
                          handleChangePrice(price, "toPrice");
                        }}
                        isAllowed={isAllowed}
                      />
                      <InputGroupAddon addonType="append">
                        <InputGroupText>VNĐ</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </Col>
              </Col>

              <Col sm={4} xs={12} style={{ padding: 0 }}>
                <Col
                  xs={12}
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Label for="" className="mr-sm-2">
                    Trạng thái thanh toán
                  </Label>
                  <Col className="pl-0 pr-0">
                    <Select
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      placeholder={"-- Chọn --"}
                      onChange={(selected) =>
                        handleChangeSelect(selected, "orderStatusSelected")
                      }
                      value={searchValue.orderStatusSelected}
                      options={orderStatusOption}
                    />
                  </Col>
                </Col>
              </Col>
            </Row>

            <Row style={{ marginBottom: 5 }}>
              <Col sm={4} xs={12} style={{ padding: 0 }}>
                <Col
                  xs={12}
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Label for="" className="mr-sm-2">
                    Nguồn đơn hàng
                  </Label>
                  <Col className="pl-0 pr-0">
                    <Select
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      placeholder={"-- Chọn --"}
                      onChange={(e) =>
                        handleChangeSelect(e, "orderTypeSelected")
                      }
                      value={searchValue.orderTypeSelected}
                      options={orderTypeOption}
                    />
                  </Col>
                </Col>
              </Col>
              <Col sm={4} xs={12} style={{ padding: 0 }}>
                <Col
                  xs={12}
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Label for="" className="mr-sm-2">
                    Đã xóa
                  </Label>
                  <Col className="pl-0 pr-0">
                    <Select
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      placeholder={"-- Chọn --"}
                      onChange={(e) =>
                        handleChangeSelect(e, "isDeletedSelected")
                      }
                      value={searchValue.isDeletedSelected}
                      options={isDeletedOption}
                    />
                  </Col>
                </Col>
              </Col>
              <Col
                xs={12}
                sm={4}
                className="d-flex align-items-end justify-content-end"
              >
                <FormGroup className="mb-2 mb-sm-0">
                  <Button
                    className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                    onClick={_handleSubmitFillter}
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
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Filter;
