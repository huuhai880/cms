import React, { useEffect, useState } from "react";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  CustomInput,
  FormGroup,
  Label,
  Input,
  Form,
  Modal,
  ModalBody,
} from "reactstrap";
import { Table } from "antd";
import { Checkbox } from "antd";
import { column } from "./const";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";
import InterpretTableChild from "./InterpretTableChild";
import "./style.scss";

function InterpertTable({ handleClose, attributeGroup, handleSubmit, callAPIInterPret }) {
  const [interpert, setInterpert] = useState(attributeGroup);
  const [expandedRowKey, setExpandedRowKey] = useState([]);
  const [isloading, setLoading] = useState(false);
  const [msgError, setMsgError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const handleChangeInterpretConfig = (name, value, index) => {
    let interprets = interpert.interprets;
    interprets[index][name] = value;
    if (name == "is_show_search_result" && value) {
      interprets[index]["text_url"] = null;
      interprets[index]["url"] = null;
    }
    setInterpert({ ...interpert, interprets });
    setMsgError(null);
  };
  const handleChangeInterpretChildConfig = (name, value, index, indexInterPret) => {
    let interprets = interpert.interprets;
    interprets[indexInterPret].interpret_details[index][name] = value;
    if (name == "is_show_search_result" && value) {
      interprets[indexInterPret].interpret_details[index]["text_url"] = null;
      interprets[indexInterPret].interpret_details[index]["url"] = null;
    }
    setInterpert({ ...interpert, interprets });
    setMsgError(null);
  };
  const handleChangeInterpretChildByInterpert = (value, indexInterPret) => {
    let interprets = interpert.interprets;
    interprets[indexInterPret].interpret_details.map((item) => {
      item.is_selected = value;
    });
    setInterpert({ ...interpert, interprets });
    setMsgError(null);
  };
  const handleSubmitConfig = () => {
    let checkInvalid = interpert.interprets.filter(
      (p) => !p.is_show_search_result && (!p.text_url || !p.url)
    );
    if (checkInvalid && checkInvalid.length > 0) {
      setMsgError("Vui lòng nhập thông tin Text Url/Url cho luận giải");
    } else handleSubmit(interpert);
  };
  const changeAlias = (val) => {
    var str = val;
    str = str.trim();
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );
    str = str.replace(/ + /g, "-");
    str = str.replace(/[ ]/g, "-");
    str = str.trim();
    return str;
  };
  const handleKeyDown = (e) => {
    if (1 * e.keyCode === 13) {
      e.preventDefault();
      _handleSubmitFillter(keyword);
    }
  };
  const handleClear = () => {
    setKeyword("");
    _handleSubmitFillter("");
  };
  const handleSubmitFillter = () => {
    _handleSubmitFillter(keyword.trim());
  };
  const _handleSubmitFillter = (keyword) => {
    setLoading(true);
    let cl = { ...attributeGroup };

    const searchFilter = cl.interprets.filter(
      (interpert) => interpert.attribute_name.indexOf(changeAlias(keyword)) !== -1
    );
    cl.interprets = searchFilter;
    setInterpert(cl);

    setInterval(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <Card className={`animated fadeIn z-index-222 mb-3 news-header-no-border`}>
        <CardHeader
          className="d-flex"
          style={{
            padding: "0.55rem",
            alignItems: "center",
          }}
        >
          <div className="flex-fill font-weight-bold">Cấu hình Luận giải</div>
          <Button color="danger" size="md" onClick={handleClose}>
            <i className={`fa fa-remove`} />
          </Button>
        </CardHeader>
      </Card>
      <Col>
        <Card className="animated fadeIn z-index-222 mb-3 ">
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-filter__custom">
              <div className="ml-3 mr-3 mb-3 mt-3">
                <Form autoComplete="nope" className="zoom-scale-9">
                  <Row>
                    <Col sm={6} xs={12}>
                      <FormGroup className="mb-2 mb-sm-0">
                        <Label for="inputValue" className="mr-sm-2">
                          Từ khóa
                        </Label>
                        <Col className="pl-0 pr-0">
                          <Input
                            className="MuiPaper-filter__custom--input pr-0"
                            autoComplete="nope"
                            type="text"
                            name="keyword"
                            placeholder="Nhập tên thuộc tính  "
                            value={keyword}
                            onChange={(e) => {
                              setKeyword(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                          />
                        </Col>
                      </FormGroup>
                    </Col>

                    <Col sm={6} xs={12} className={`d-flex align-items-end justify-content-end`}>
                      <FormGroup className="mb-2 mb-sm-0">
                        <Button
                          className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                          onClick={handleSubmitFillter}
                          color="primary"
                          type="button"
                          size="sm"
                        >
                          <i className="fa fa-search mr-1" />
                          Tìm kiếm
                        </Button>
                      </FormGroup>
                      <FormGroup className="mb-2 ml-2 mb-sm-0">
                        <Button
                          className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                          onClick={handleClear}
                          type="button"
                          size="sm"
                        >
                          <i className="fa fa-refresh mr-1" />
                          Làm mới
                        </Button>
                      </FormGroup>
                      <FormGroup className="mb-2 ml-2 mb-sm-0">
                        <Button
                          className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                          onClick={handleSubmitConfig}
                          color="success"
                          type="button"
                          size="sm"
                        >
                          <i className="fa fa-plus mr-1" />
                          Chọn
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className={`animated fadeIn mb-3 `}>
          <CardBody className="px-0 py-0">
            {msgError && (
              <Alert
                key={`alert-config`}
                style={{ marginTop: -20, marginBottom: 0 }}
                color="danger"
                isOpen={true}
                toggle={() => setMsgError(null)}
              >
                <span dangerouslySetInnerHTML={{ __html: msgError }} />
              </Alert>
            )}
            <Row>
              <Col xs={12} sm={12}>
                {isloading ? (
                  <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                    <CircularProgress />
                  </div>
                ) : (
                  <div>
                    <Table
                      className="components-table-demo-nested"
                      columns={column(
                        handleChangeInterpretConfig,
                        handleChangeInterpretChildByInterpert
                      )}
                      dataSource={interpert.interprets}
                      bordered={true}
                      pagination={false}
                      scroll={{ y: 370 }}
                      rowKey={"interpret_id"}
                      expandable={{
                        expandedRowRender: (record, index) => (
                          <InterpretTableChild
                            data={record.interpret_details}
                            indexParent={index + 1}
                            handleChangeInterpretChildConfig={handleChangeInterpretChildConfig}
                            indexInterPret={index}
                          />
                        ),
                        rowExpandable: (record) => record.interpret_details.length > 0,
                        onExpand: (expanded, record) => {
                          !expanded
                            ? setExpandedRowKey([])
                            : setExpandedRowKey([record.interpret_id]);
                        },
                        expandedRowKeys: expandedRowKey,
                        // expandRowByClick: true,
                      }}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
export default InterpertTable;
