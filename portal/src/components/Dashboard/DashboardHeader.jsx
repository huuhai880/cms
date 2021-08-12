import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Label,
  Row,
} from "reactstrap";

import "./styles.scss";

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
    const { isLoading } = this.state;

    return (
      <Row sm={12}>
        <Col xs={6} lg={7} sm={7} style={{ paddingRight: 0}}>
          <Card>
            <CardBody className="cardBody-wrap">
              <div className="wrap-routing">
              <div class="section">
                <div class="earth"></div>
                <div class="circle">
                  {this.renderSpanTag("Chào-Mừng", 0, 20)}
                  {this.renderSpanTag("Chào-Mừng", 10, 20)}
                  {this.renderSpanTag("Chào-Mừng", 20, 20)}
                </div>
              </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xs={6} lg={5} sm={5}>
          <Card>
            <CardHeader>
              <b style={{ textTransform: "none" }}>Bài viết mới</b>
            </CardHeader>
            <CardBody>
              {isLoading && (
                <div className="d-flex flex-fill justify-content-center mt-5 mb-5"></div>
              )}
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default DashboardHeader;
