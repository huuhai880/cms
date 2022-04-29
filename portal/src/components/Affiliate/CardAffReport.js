import React from "react";
import {
    Col,
    Row,
    FormGroup,
    Label
} from "reactstrap";
import { useState } from "react";
import { useEffect } from "react";
import "./style.scss";
import AffiliateService from "./Service/index";
import { numberFormat } from "utils/index";
// import DatePicker from "../Common/DatePicker";
import moment from 'moment'
import { DatePicker, Space } from 'antd';

const _affiliateService = new AffiliateService();
function AffiliateReport({ member_id }) {
    // const [searchValue, setSearchValue] = useState({
    //     startDate: moment().startOf("month"),
    //     endDate: moment(),
    //     nameTag: "Tháng này",
    // });

    const [report, setReport] = useState({
        total_revenue: 0,
        total_order: 0,
        total_commision: 0
    })

    const [filter, setFilter] = useState({
        month: moment()
    });


    // useEffect(() => {
    //     getReport();
    // }, [searchValue])


    useEffect(() => {
        getReport();
    }, [filter])


    const getReport = async () => {
        try {
            let values = {
                member_id,
                month: filter.month ? moment(filter.month).format('DD/MM/YYYY') : null,
            }
            let _data = await _affiliateService.reportOfAff(values);
            setReport(_data)
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
            );
        }
    }

    // const renderCalendarInfo = () => {
    //     let data = [
    //         "Hôm nay",
    //         "Hôm qua",
    //         "Tuần này",
    //         "Tuần trước",
    //         "Tháng này",
    //         "Tháng trước",
    //         "Chọn ngày",
    //     ];
    //     return (
    //         <Col style={{ width: "150px" }} sm={12} className="pl-0 pr-0 bl">
    //             {data.map((item) => {
    //                 return (
    //                     <Col
    //                         sm={12}
    //                         onClick={() => {
    //                             calendar(item);
    //                         }}
    //                         className={`pt-3 pb-1 hover cursor-pointer ${searchValue.nameTag == item ? "focus" : ""
    //                             }`}
    //                     >
    //                         <Label className="cursor-pointer">{item}</Label>
    //                     </Col>
    //                 );
    //             })}
    //         </Col>
    //     );
    // };

    // const calendar = (key) => {
    //     switch (key) {
    //         case "Hôm nay": {
    //             setSearchValue((pre) => ({
    //                 ...searchValue,
    //                 startDate: moment(),
    //                 endDate: moment(),
    //                 nameTag: "Hôm nay",
    //             }));
    //             break;
    //         }

    //         case "Hôm qua": {
    //             setSearchValue((pre) => ({
    //                 ...searchValue,
    //                 startDate: moment().subtract(1, "days"),
    //                 endDate: moment().subtract(1, "days"),
    //                 nameTag: "Hôm qua",
    //             }));
    //             break;
    //         }

    //         case "Tuần này": {
    //             setSearchValue((pre) => ({
    //                 ...searchValue,
    //                 startDate: moment().startOf("week").add(1, "days"),
    //                 endDate: moment(),
    //                 nameTag: "Tuần này",
    //             }));
    //             break;
    //         }

    //         case "Tuần trước": {
    //             setSearchValue((pre) => ({
    //                 ...searchValue,
    //                 startDate: moment()
    //                     .subtract(1, "week")
    //                     .startOf("week")
    //                     .add(1, "days"),
    //                 endDate: moment().subtract(1, "week").endOf("week").add(1, "days"),
    //                 nameTag: "Tuần trước",
    //             }));

    //             break;
    //         }

    //         case "Tháng này": {
    //             setSearchValue((pre) => ({
    //                 ...searchValue,
    //                 startDate: moment().startOf("month"),
    //                 endDate: moment(),
    //                 nameTag: "Tháng này",
    //             }));
    //             break;
    //         }

    //         case "Tháng trước": {
    //             setSearchValue((pre) => ({
    //                 ...searchValue,
    //                 startDate: moment().subtract(1, "month").startOf("month"),
    //                 endDate: moment().subtract(1, "month").endOf("month"),
    //                 nameTag: "Tháng trước",
    //             }));
    //             break;
    //         }

    //         case "Chọn ngày": {
    //             setSearchValue((pre) => ({
    //                 ...searchValue,
    //                 startDate: moment(),
    //                 endDate: moment(),
    //                 nameTag: "Chọn ngày",
    //             }));
    //             break;
    //         }
    //     }
    // };


    // const handleChangeDate = ({ startDate, endDate }) => {
    //     setSearchValue((preState) => ({
    //         ...preState,
    //         startDate,
    //         endDate,
    //     }));
    // };

    const onChange = (date, dateString) => {
        setFilter((preState) => ({
            ...preState,
            month: date
        }));
    }


    return (
        <>
            <Row>
                <Col xs={12} sm={5}>
                    <FormGroup className="mb-2 mb-sm-0">
                        <Label for="" className="mr-sm-2">
                            Chọn thời gian
                        </Label>
                        {/* <DatePicker
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
                        /> */}
                        <DatePicker onChange={onChange}
                            picker="month"
                            placeholder={"Chọn Tháng"}
                            className="form-control"
                            value={filter.month}
                            allowClear={false}
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={4}>
                    <FormGroup className="mb-2 mb-sm-0">
                        <Label for="" className="mr-sm-2">
                            &nbsp;
                        </Label>
                        <div className="d-flex align-items-center justity-content-center">
                            <span className="bg-success bw-statistic-item">
                                <i class="fa fa-money" aria-hidden="true"></i>
                            </span>
                            <div class="d-flex flex-column ml-1">
                                <span><b>{numberFormat(report.total_revenue)}</b></span>
                                <span>Doanh thu</span>
                            </div>
                        </div>
                    </FormGroup>
                </Col>
                <Col xs={12} sm={4}>
                    <FormGroup className="mb-2 mb-sm-0">
                        <Label for="" className="mr-sm-2">
                            &nbsp;
                        </Label>
                        <div className="d-flex align-items-center justity-content-center">
                            <span className="bg-primary bw-statistic-item">
                                <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                            </span>
                            <div class="d-flex flex-column ml-1">
                                <span><b>{report.total_order ? report.total_order : 0}</b></span>
                                <span>Đơn hàng</span>
                            </div>
                        </div>
                    </FormGroup>
                </Col>
                <Col xs={12} sm={4}>
                    <FormGroup className="mb-2 mb-sm-0">
                        <Label for="" className="mr-sm-2">
                            &nbsp;
                        </Label>
                        <div className="d-flex align-items-center justity-content-center">
                            <span className="bg-success bw-statistic-item">
                                <i class="fa fa-usd" aria-hidden="true"></i>
                            </span>
                            <div class="d-flex flex-column ml-1">
                                <span><b>{numberFormat(report.total_commision)}</b></span>
                                <span>Hoa hồng</span>
                            </div>
                        </div>
                    </FormGroup>
                </Col>
            </Row>
        </>
    );
}

export default AffiliateReport;