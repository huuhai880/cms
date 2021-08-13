import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Media,
  Col,
  Label,
  FormGroup,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./styles.scss";
import NewsModel from "../../models/NewsModel";
import NewsCategoryModel from "../../models/NewsCategoryModel";

class News extends Component {
  _orderModel;

  constructor(props) {
    super(props);

    this._newsModel = new NewsModel();
    this._newsCategoryModel = new NewsCategoryModel();

    this.state = {
      isLoading: true,
      business: [],
    };
  }

  componentDidMount() {
    (async () => {
      let lastItem = await this._newsModel.getLastItem().catch(() => {});
      let newsCategoryOpts = await this._newsCategoryModel.getOptionsForCreate({
        is_active: 1,
      });
      lastItem && this.setState({ lastItem, newsCategoryOpts });
    })();
  }

  render() {
    const { isLoading, lastItem, newsCategoryOpts } = this.state;
    let valueCategory =
      newsCategoryOpts &&
      newsCategoryOpts.filter((item) => {
        return item.id === lastItem.news_category_id;
      });
    return (
      <Row>
        <Col sm={12}>
          <Card style={{ height: "100%", overflow: "hidden" }}>
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
                          Bài viết mới nhất
                        </Label>
                      </span>
                    </Col>
                    <Col
                      sm={6}
                      className="d-flex align-items-center justify-content-end"
                    >
                      <Link
                        to={`/news/edit/${lastItem && lastItem.news_id}`}
                        style={{ fontWeight: "bold", textDecoration: "none" }}
                      >
                        Xem thêm{"  "}
                        <i class="fa fa-arrow-right" aria-hidden="true"></i>
                      </Link>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </CardHeader>
            <CardBody style={{ padding: "0 10px" }}>
              <div className="body-news">
                <div className="card-news">
                  {lastItem && lastItem.image_url && (
                    <div class="circle-news">
                      <div class="imgBx">
                        <Media
                          className="img-news"
                          src={lastItem ? lastItem.image_url : ""}
                        />
                      </div>
                    </div>
                  )}
                  <div class="content-news">
                    <h3
                      class="text-review mb-2"
                      style={{
                        backgroundColor: lastItem
                          ? lastItem.is_review === 1
                            ? "#3cbdc9"
                            : lastItem.is_review === 2
                            ? "#ffcd56"
                            : "#3d3d3d"
                          : "",
                      }}
                    >
                      {lastItem
                        ? lastItem.is_review === 1
                          ? "Đã duyệt"
                          : lastItem.is_review === 2
                          ? "Chưa duyệt"
                          : "Không duyệt"
                        : ""}
                    </h3>
                    <div className="textIcon mt-1">
                      <span>Tiêu đề: </span>
                      <span>{lastItem && lastItem.news_title}</span>
                    </div>
                    <div className="textIcon mt-1">
                      <span>Chuyên mục bài viết: </span>
                      <span>{valueCategory && valueCategory[0].name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default News;
