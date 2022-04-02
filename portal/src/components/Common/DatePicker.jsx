import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { SingleDatePicker, DateRangePicker } from "react-dates";
import moment from "moment";

const propTypes = {
  isMultiple: PropTypes.bool,
};

const defaultProps = {
  isMultiple: false,
};

/**
 * @class DatePicker
 */
class DatePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => {
    let i;
    let years = [];
    for (i = moment().year() + 10; i >= moment().year() - 100; i--) {
      years.push(
        <option value={i} key={`year-${i}`}>
          {i}
        </option>
      );
    }
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 200, display: "flex", justifyContent: "center" }}>
          <div className="mx-1">
            <select
              className="form-control"
              style={{ marginTop: "-5px" }}
              value={month.month()}
              onChange={(e) => onMonthSelect(month, e.target.value)}
            >
              {moment.months().map((label, value) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="mx-1" style={{ width: "50%" }}>
            <select
              className="form-control"
              style={{ marginTop: "-5px" }}
              value={month.year()}
              onChange={(e) => onYearSelect(month, e.target.value)}
            >
              {years}
            </select>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { isMultiple, minToday, maxToday, ...other } = this.props;
    const now = moment().startOf("day");
    if (other.renderMonthElement) {
      other.renderMonthElement = this.renderMonthElement;
    }
    if (other.autoUpdateInput) delete other.autoUpdateInput;
    if (isMultiple) {
      return (
        <DateRangePicker
          {...other}
          focusedInput={this.state.focusedInput}
          onFocusChange={(focusedInput) => this.setState({ focusedInput })}
          isOutsideRange={(day) => {
            let result = false;
            minToday && (result = day.isBefore(now));
            maxToday && (result = day.isAfter(now));
            return result;
          }}
          displayFormat="DD/MM/YYYY"
          startDatePlaceholderText="dd/mm/yyyy"
          endDatePlaceholderText="dd/mm/yyyy"
          showDefaultInputIcon
          minimumNights={0}
          block
          hideKeyboardShortcutsPanel
          minDate={moment().toDate()}
        />
      );
    }

    return (
      <SingleDatePicker
        {...other}
        style={{ zIndex: 9999}}
        focused={this.state.focused}
        onFocusChange={({ focused }) => this.setState({ focused })}
        displayFormat="DD/MM/YYYY"
        placeholder="dd/mm/yyyy"
        numberOfMonths={1}
        isOutsideRange={(day) => {
          let result = false;
          minToday && (result = day.isBefore(now));
          maxToday && (result = day.isAfter(now));
          return result;
        }}
        showDefaultInputIcon
        block
        hideKeyboardShortcutsPanel
      />
    );
  }
}

DatePicker.propTypes = propTypes;
DatePicker.defaultProps = defaultProps;

export default DatePicker;
