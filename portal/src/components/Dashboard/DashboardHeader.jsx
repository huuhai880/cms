import React, { Component } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

import "./styles.scss";
import Background from "./images/bg.jpg";
import ImageEarth from "./images/image.jpg";

import News from "./News";
import NewsSummary from "./NewsSummary";
import Account from "./Account"

class DashboardHeader extends Component {
  _orderModel;

  constructor(props) {
    super(props);

    this.renderSpanTag = this.renderSpanTag.bind(this);

    this.state = {
      isLoading: true,
      business: [],
    };
  }

  renderSpanTag(string, numberIndex, numberLength) {
    let array = string.split("");
    for (let i = array.length; i < 10; i++) {
      array.push("");
    }
    return array.map((item, index) => {
      return (
        <span
          style={{
            "--i": `${index + 1 + numberIndex}`,
            "--a": `${array.length + numberLength}`,
          }}
        >
          {item}
        </span>
      );
    });
  }

  render() {
    return (
      <Row sm={12}>
        <Col xs={6} lg={8} sm={8} style={{ paddingRight: 0 }}>
          <Card>
            <CardBody className="cardBody-wrap">
              <div
                className="wrap-routing"
                style={{ backgroundImage: `url(${Background})` }}
              >
                <div class="section">
                  <div
                    class="earth"
                    style={{ backgroundImage: `url(${ImageEarth})` }}
                  ></div>
                  <div class="circle">
                    {this.renderSpanTag("Chào-Mừng", 0, 20)}
                    {this.renderSpanTag("Chào-Mừng", 10, 20)}
                    {this.renderSpanTag("Chào-Mừng", 20, 20)}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          <Account/>
        </Col>
        <Col xs={6} lg={4} sm={4}>
          <NewsSummary/>
          <News />
        </Col>
      </Row>
    );
  }
}

export default DashboardHeader;
