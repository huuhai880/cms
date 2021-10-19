import React from "react";
import { DatePicker } from "antd";
// import "antd/dist/antd.css";
import "moment/locale/vi";
import moment from "moment";
import "./style.css";

const RangeTimePicker = (props) => {
  const { RangePicker } = DatePicker;
  moment.locale("en_GB");
  moment.updateLocale("en", {
    weekdaysMin: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    months:
      "Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12".split(
        "_"
      ),
    monthsShort:
      "Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12".split(
        "_"
      ),
  });

  let {
    startDateValue = null, // giá trị state ngày từ
    endDateValue = null, // giá trị state ngày đến
    handleDateValue, // trả ra 2 giá trị setState : startDate, endDate
    setId = "CustomId", // gán id với nhiều hơn 1 range picker
  } = props;

  let allowedDateFormats = [
    "DD/MM/YYYY",
    "DDMMYYYY",
    "DD-MM-YYYY",
    "D/MM/YYYY",
    "DD/M/YYYY",
    "D/M/YYYY",
    "DD-M-YYYY",
    "D-MM-YYYY",
    "D-M-YYYY",
  ];

  function onClose(open) {
    let startDate = null;
    let endDate = null;
    let typeLeft = document.querySelector(
      `#${setId} > .ant-picker-range > .ant-picker-input:nth-child(1) > input `
    );
    let typeRight = document.querySelector(
      `#${setId} .ant-picker-range > .ant-picker-input:nth-child(3) > input `
    );
    if (!open) {
      if (
        moment(typeLeft.value, allowedDateFormats, true).isValid() &&
        typeRight !== "Invalid date"
      ) {
        startDate = moment(typeLeft.value, allowedDateFormats);
        endDate = moment(typeRight.value, allowedDateFormats, true).isValid()
          ? moment(typeRight.value, allowedDateFormats)
          : typeRight.value === ""
          ? startDate
          : null;
        handleDateValue(startDate, endDate);
        return;
      }
      startDate = null;
      endDate = null;
      handleDateValue(startDate, endDate);
    }
  }

  return (
    <div id={setId}>
      <RangePicker
        size="default"
        format={allowedDateFormats}
        dropdownClassName="dp-drop-down"
        placeholder={["dd/mm/yyyy", "dd/mm/yyyy"]}
        allowClear={false}
        style={{
          textAlign: "center",
          display: "flex",
          height: "38px",
          width: "100%",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          margin: "0px",
        }}
        bordered={true}
        value={[startDateValue || null, endDateValue || null]}
        onOpenChange={(open) => onClose(open)}
      />
    </div>
  );
};

export default RangeTimePicker;
