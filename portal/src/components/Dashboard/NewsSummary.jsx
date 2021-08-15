import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Label,
  Row,
  FormGroup,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { CircularProgress } from "@material-ui/core";
import "./styles.scss";
// import "chartjs-plugin-datalabels";
// import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import NewsModel from "../../models/NewsModel";

class Summary extends Component {
  _orderModel;

  constructor(props) {
    super(props);
    this._newsModel = new NewsModel();
  }

  state = {
    isLoading: true,
    orders: {},
    business: [],
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    this._newsModel
      .getList()
      .then((data) => {
        data = data ? data.items : [];
        let dataNoIsReview = [];
        let dataIsReview = [];
        let dataNotReviewYet = [];
        if (data) {
          dataNoIsReview = data.filter((item) => {
            return item.is_review === 0;
          });
          dataIsReview = data.filter((item) => {
            return item.is_review === 1;
          });
          dataNotReviewYet = data.filter((item) => {
            return item.is_review === 2;
          });
        }

        this.setState({
          data,
          dataNoIsReview,
          dataIsReview,
          dataNotReviewYet,
        });
      })
      .catch((err) => {
        window._$g.dialogs.alert(
          window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`)
        );
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  changeNumberPrice = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  render() {
    const { isLoading, data, dataNoIsReview, dataIsReview, dataNotReviewYet } =
      this.state;

    return (
      <Row className="">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <Row className="page_title pb-0">
                <Col xs={12} sm={12} className="text-right flex-row">
                  <FormGroup className="mb-0" row>
                    <Col
                      sm={6}
                      className="d-flex align-items-center justify-content-start"
                    >
                      <span
                        style={{ fontWeight: "bold", textTransform: "none" }}
                      >
                        <Label className="mb-0 font-weight-bold">
                          Tổng bài viết:{" "}
                          {`${
                            (dataNotReviewYet ? dataNotReviewYet.length : 0) +
                            (dataIsReview ? dataIsReview.length : 0) +
                            (dataNoIsReview ? dataNoIsReview.length : 0)
                          }`}
                        </Label>
                      </span>
                    </Col>
                    <Col
                      sm={6}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Link to="/news" style={{ textDecoration: "none", fontWeight: "bold", }}>
                        Xem thêm{"  "}
                        <i class="fa fa-arrow-right" aria-hidden="true"></i>
                      </Link>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                  <CircularProgress />
                </div>
              ) : data ? (
                <Doughnut
                  data={{
                    labels: ["Chưa duyệt", "Đã duyệt", "Không duyệt"],
                    datasets: [
                      {
                        label: "# of Votes",
                        data: [
                          dataNotReviewYet ? dataNotReviewYet.length : 0,
                          dataIsReview ? dataIsReview.length : 0,
                          dataNoIsReview ? dataNoIsReview.length : 0,
                        ],
                        backgroundColor: ["rgb(255, 205, 86)", "#3cbdc9", "#716f6f"],
                        borderColor: ["rgb(255, 205, 86)", "#3cbdc9", "#716f6f"],
                        borderWidth: 1,
                        hoverOffset: 4,
                      },
                    ],
                  }}
                  width={100}
                  height={70}
                  options={{
                    legend: {
                      display: true,
                      position: "bottom",
                    },
                    plugins: {
                      datalabels: {
                        formatter: (value, ctx) => {
                          let datasets = ctx.chart.data.datasets;
                          if (
                            datasets.indexOf(ctx.dataset) ===
                            datasets.length - 1
                          ) {
                            let sum = datasets[0].data.reduce(
                              (a, b) => a + b,
                              0
                            );
                            let percentage =
                              Math.round((value / sum) * 100) + "%";
                            return `${
                              this.changeNumberPrice(value ? value : 0) +
                              " đơn" +
                              "\n" +
                              percentage
                            }`;
                          } else {
                            return "xxx";
                          }
                        },
                        color: "black",
                        font: {
                          //   weight: "bold",
                          size: 13,
                        },
                        textAlign: "center",
                      },
                    },
                    tooltips: {
                      callbacks: {
                        title: function (tooltipItem, data) {
                          return data["labels"][tooltipItem[0]["index"]];
                        },

                        label: function (tooltipItem, data) {
                          let items = [
                            "Tổng bài viết: " +
                              data["datasets"][0]["data"][tooltipItem["index"]]
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
                              " bài viết",
                          ];
                          return items;
                        },
                      },
                      // Disable the on-canvas tooltip
                      enabled: false,

                      custom: function (tooltipModel) {
                        // Tooltip Element
                        var tooltipEl =
                          document.getElementById("chartjs-tooltip");

                        // Create element on first render
                        if (!tooltipEl) {
                          tooltipEl = document.createElement("div");
                          tooltipEl.id = "chartjs-tooltip";
                          tooltipEl.innerHTML = "<table></table>";
                          document.body.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        if (tooltipModel.opacity === 0) {
                          tooltipEl.style.opacity = 0;
                          return;
                        }

                        // Set caret Position

                        if (tooltipModel.yAlign) {
                          tooltipEl.classList.add(tooltipModel.yAlign);
                        } else {
                          tooltipEl.classList.add("no-transform");
                        }

                        function getBody(bodyItem) {
                          return bodyItem.lines;
                        }

                        // Set Text
                        if (tooltipModel.body) {
                          var titleLines = tooltipModel.title || [];
                          var bodyLines = tooltipModel.body.map(getBody);

                          var style = "border-width: 2px";
                          style += ";box-shadow: 5px 10px #b9b6b6";
                          style += ";flex:1";
                          style += ";flexdirection: column";
                          style += ";border:1px solid";
                          style += ";color: #000";
                          style += ";text-align:left";
                          style += ";padding: 20px";
                          style += ";width:300px";
                          var innerHtml =
                            '<div class="div-class-charts" style="' +
                            style +
                            '">';
                          titleLines.forEach(function (title) {
                            var style = "width: 100%";
                            style = ";font-size:20px";
                            style = ";font-weight:bold";
                            innerHtml +=
                              '<div style="' + style + '">' + title + "</div>";
                          });
                          bodyLines[0].forEach(function (body, i) {
                            var colors = tooltipModel.labelColors[i];
                            var style = "width: 100%";
                            innerHtml +=
                              '<div style="' + style + '">' + body + " </div>";
                          });
                          innerHtml += "</div>";
                          var tableRoot = tooltipEl.querySelector("table");
                          tableRoot.innerHTML = innerHtml;
                        }

                        // `this` will be the overall tooltip
                        var position =
                          this._chart.canvas.getBoundingClientRect();

                        // Display, position, and set styles for font
                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.position = "absolute";
                        tooltipEl.style.left = "37%";
                        tooltipEl.style.top = "10%";
                        tooltipEl.style.fontFamily =
                          tooltipModel._bodyFontFamily;

                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                        tooltipEl.style.padding =
                          tooltipModel.yPadding +
                          "px " +
                          tooltipModel.xPadding +
                          "px";
                        tooltipEl.style.pointerEvents = "none";
                        tooltipEl.style.backgroundColor = "#fff";
                      },
                    },
                  }}
                />
              ) : (
                <span>Không có dữ liệu</span>
              )}
            </CardBody>
          </Card>
        </Col>
        {/* <Col xs={12} sm={8} lg={8} className="summary">
          {isLoading ? (
            <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
              <CircularProgress />
            </div>
          ) : business.length ? (
            <Row className="page_title">
              {(business || []).map((v) => (
                <Col xs={12} sm={6} lg={6} className="mb-2 order">
                  <Card>
                    <CardHeader>
                      <Row
                        className="total-title align-items-center"
                        style={{ textTransform: "none" }}
                      >
                        <Col sm={8}>
                          <Label className="font-weight-bold business mb-0">
                            {" "}
                            {v.business_name || ""}
                          </Label>
                        </Col>
                        <Col sm={4} className="text-right">
                          <i className="fa fa-file"></i>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Row className="box">
                        <Col>
                          <Row>
                            <Col xs={12} className="p-0 ">
                              <Label
                                sm={9}
                                className="title-sub pd-0 font-weight-bold"
                              >
                                Tổng số:
                              </Label>
                              <span
                                sm={3}
                                className="text-right pd-0 font-weight-bold"
                              >
                                {v.total || 0} đơn hàng
                              </span>
                              <Label sm={9} className="title-sub pd-0">
                                Hôm nay:
                              </Label>
                              <span sm={3} className="text-right pd-0">
                                {v.total_day || 0} đơn hàng
                              </span>
                              <Label sm={9} className="title-sub pd-0">
                                Tuần này:
                              </Label>
                              <span sm={3} className="text-right pd-0">
                                {v.total_week || 0} đơn hàng
                              </span>
                              <Label sm={9} className="title-sub pd-0">
                                Tháng này:
                              </Label>
                              <span sm={3} className="text-righ pd-0t">
                                {v.total_month || 0} đơn hàng
                              </span>
                            </Col>
                            <Col sm={12} className="text-right">
                              {" "}
                              <Link to="/order">{" Xem thêm ..."}</Link>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <span>Không có dữ liệu</span>
          )}
        </Col> */}
      </Row>
    );
  }
}

export default Summary;
