import React, { useEffect, useState } from 'react';
import { Alert, Col, Row, Button, Form, FormGroup, Label, Table } from "reactstrap";
import { useFormik } from "formik";
import Loading from "../../Common/Loading";
import ConfigModel from "../../../models/ConfigModel/index";
import CreatableSelect from 'react-select/creatable';
import uuid from 'uuid';
import * as yup from "yup";

let initValue = {
  KEYWORD_SEARCH: {
    value: [],
    data_type: "json",
  },
}

function Keyword(props) {
  const [data, setData] = useState(initValue);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [inputValue, setInputValue] = useState('')

  // const validationSchema = yup.object().shape({
  //   KEYWORD_SEARCH: yup.object().shape({
  //     value: yup.array().nullable()
  //       .test("KEYWORD_SEARCH.value", null, (arr) => {
  //         const check = arr.findIndex((item, index) => {
  //           return item.keyword == null || item.keyword == '' || (item.keyword && item.keyword.trim() == '');
  //         });
  //         if (check !== -1) {
  //           return new yup.ValidationError("Từ khoá tìm kiếm là bắt buộc.", null, "KEYWORD_SEARCH.value");
  //         }
  //         return true
  //       }),
  //   }),
  // });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: null,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: (values) => {
      handelInsertOrUpdate(values)
    },
  });

  console.log(formik.errors)


  useEffect(() => {
    initData();
  }, [])

  const initData = async () => {
    setLoading(true)
    try {
      const _configModel = new ConfigModel();
      let _data = await _configModel.getPageConfig("KEYWORD_SEARCH");
      let value = {
        ...initValue,
        ..._data
      }
      setData(value)
    } catch (error) {
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${error.message}).`)
      )
    }
    finally {
      setLoading(false)
    }
  }

  const handelInsertOrUpdate = async (values) => {
    try {
      const _configModel = new ConfigModel();
      let { KEYWORD_SEARCH } = values;
      KEYWORD_SEARCH.value = KEYWORD_SEARCH.value.filter(p => p.keyword != '' && (p.keyword && p.keyword.trim() != '')) || []
      
      await _configModel.updatePageConfig('KEYWORD_SEARCH', values);
      window._$g.toastr.show('Cập nhật thành công!', 'success');

    } catch (error) {
      let { errors, statusText, message } = error;
      let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join("<br/>");
      setAlerts([{ color: "danger", msg }]);
      window.scrollTo(0, 0);
    }
    finally {
      formik.setSubmitting(false);
    }
  }

  const handleChange = (value, actionMeta) => {
    // console.group('Value Changed');
    // console.log(value);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd(); 
    // setValue(value)

    setData({
      ...data,
      KEYWORD_SEARCH: {
        ...data.KEYWORD_SEARCH,
        value: value ? value : []
      }
    })
  }

  const handleInputChange = (inputValue) => {
    setInputValue(inputValue)
  }

  const createOption = (label) => ({
    label,
    value: uuid.v1(),
  });

  const handleKeyDown = (event) => {
    if (!inputValue) return;

    switch (event.key) {
      case 'Enter':
      case 'Tab':
        // console.group('Value Added');
        // console.log(value);
        // console.groupEnd();
        // setValue(t => ([...t, createOption(inputValue)]))
        // setInputValue('');

        setData({
          ...data,
          KEYWORD_SEARCH: {
            ...data.KEYWORD_SEARCH,
            value: [...data.KEYWORD_SEARCH.value, createOption(inputValue)]
          }
        })
        event.preventDefault();
    }
  }

  useEffect(() => {
    setInputValue('');
  }, [data.KEYWORD_SEARCH.value])

  const handleOnKeyDown = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
    }
  }

  const handleAddRow = () => {
    let KEYWORD_SEARCH = { ...formik.values.KEYWORD_SEARCH };
    let row = {
      id: uuid.v1(),
      keyword: ''
    }
    KEYWORD_SEARCH.value.push(row);
    formik.setFieldValue('KEYWORD_SEARCH', KEYWORD_SEARCH)
  }

  const handleSort = (type, item) => {
    let KEYWORD_SEARCH = { ...formik.values.KEYWORD_SEARCH };
    let nextIdx = null;
    let foundIdx = KEYWORD_SEARCH.value.findIndex((_item) => _item === item);
    if (foundIdx < 0) {
      return;
    }
    if ("up" === type) {
      nextIdx = Math.max(0, foundIdx - 1);
    }
    if ("down" === type) {
      nextIdx = Math.min(KEYWORD_SEARCH.value.length - 1, foundIdx + 1);
    }

    if (foundIdx !== nextIdx && null !== nextIdx) {
      let _tempItem = KEYWORD_SEARCH.value[foundIdx];
      KEYWORD_SEARCH.value[foundIdx] = KEYWORD_SEARCH.value[nextIdx];
      KEYWORD_SEARCH.value[nextIdx] = _tempItem;
      formik.setFieldValue('KEYWORD_SEARCH', KEYWORD_SEARCH)
    }
  }

  const handleRemoveItem = (index) => {
    window._$g.dialogs.prompt("Bạn có chắc chắn muốn xóa dữ liệu đang chọn?", "Xóa", (confirm) =>
      handleDelete(confirm, index)
    );
  }

  const handleDelete = (confirm, index) => {
    let KEYWORD_SEARCH = { ...formik.values.KEYWORD_SEARCH }
    if (confirm) {
      KEYWORD_SEARCH.value.splice(index, 1);
      formik.setFieldValue('KEYWORD_SEARCH', KEYWORD_SEARCH)
    }
  }

  const handleChangeRow = (name, index, value) => {
    let KEYWORD_SEARCH = { ...formik.values.KEYWORD_SEARCH }
    KEYWORD_SEARCH.value[index][name] = value;
    formik.setFieldValue('KEYWORD_SEARCH', KEYWORD_SEARCH);
  }

  if (loading) return <Loading />

  return (
    <div className="animated fadeIn">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          {alerts.map(({ color, msg }, idx) => {
            return (
              <Alert
                key={`alert-${idx}`}
                color={color}
                isOpen={true}
                toggle={() => setAlerts([])}
              >
                <span dangerouslySetInnerHTML={{ __html: msg }} />
              </Alert>
            );
          })}
          <Form id="formInfo" onSubmit={formik.handleSubmit} onKeyDown={handleOnKeyDown}>
            <Row>
              <Col xs={8} className="mx-auto">
                <Col xs={12}>
                  {/* <FormGroup row>
                  <Label for="limit_result" sm={2}>Nhập từ khoá</Label>
                  <Col sm={10}>
                    <CreatableSelect
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                        Menu: () => null
                      }}
                      inputValue={inputValue}
                      isClearable
                      isMulti
                      menuIsOpen={false}
                      onChange={handleChange}
                      onInputChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập từ khoá và nhấn Enter..."
                      value={data.KEYWORD_SEARCH.value}
                    />
                  </Col>
                </FormGroup> */}
                  <div className="text-right mb-3 pull-left pr-0 mr-0">
                    <Button
                      className="btn-sm"
                      onClick={handleAddRow}
                      color="secondary">
                      <i className="fa fa-plus mr-2" />
                      Thêm Từ khoá tìm kiếm
                    </Button>
                  </div>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th style={{ width: 100 }} className="text-center">
                          <i className="fa fa-list" />
                        </th>
                        <th style={{ width: 100 }} className="text-center">
                          Thứ tự
                        </th>
                        <th className="text-center">
                          Từ khoá tìm kiếm
                        </th>

                        <th
                          style={{
                            width: 100,
                          }}
                          className="text-center"
                        >
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        formik.values.KEYWORD_SEARCH && formik.values.KEYWORD_SEARCH.value &&
                          formik.values.KEYWORD_SEARCH.value.length > 0 ?
                          formik.values.KEYWORD_SEARCH.value.map((item, index) => (
                            <tr key={index}>
                              <td
                                style={{
                                  verticalAlign: "middle",
                                  textAlign: "center",
                                }}
                              >
                                <Button
                                  size="sm"
                                  color="primary"
                                  className="mr-1"
                                  disabled={0 === index}
                                  onClick={(evt) =>
                                    handleSort("up", item, evt)
                                  }
                                >
                                  <i className="fa fa-arrow-up" />
                                </Button>
                                <Button
                                  size="sm"
                                  color="success"
                                  disabled={formik.values.KEYWORD_SEARCH.value.length - 1 === index}
                                  onClick={(evt) =>
                                    handleSort("down", item, evt)
                                  }
                                >
                                  <i className="fa fa-arrow-down" />
                                </Button>
                              </td>
                              <td
                                className="text-center"
                                style={{ verticalAlign: "middle" }}>
                                {index + 1}
                              </td>
                              <td
                                style={{
                                  verticalAlign: "middle",
                                  textAlign: "center",
                                }}>
                                <input
                                  type="text"
                                  value={item.keyword}
                                  id={`keyword_${index}`}
                                  name={`keyword_${index}`}
                                  className="form-control"
                                  onChange={({ target }) => handleChangeRow('keyword', index, target.value)}
                                />

                              </td>

                              <td
                                className="text-center"
                                style={{ verticalAlign: "middle" }}>
                                <Button
                                  color="danger"
                                  style={{
                                    width: 24,
                                    height: 24,
                                    padding: 0,
                                  }}
                                  onClick={(e) => handleRemoveItem(index)}
                                  title="Xóa"
                                >
                                  <i className="fa fa-minus-circle" />
                                </Button>
                              </td>
                            </tr>
                          )) :
                          <tr>
                            <td colSpan={50} className='text-center'>Không có dữ liệu</td>
                          </tr>
                      }
                    </tbody>
                  </Table>
                  {/* {formik.errors.KEYWORD_SEARCH && formik.touched.KEYWORD_SEARCH ? (
                    <div
                      className="field-validation-error alert alert-danger fade show"
                      role="alert"
                    >
                      {formik.errors.KEYWORD_SEARCH.value}
                    </div>
                  ) : null} */}
                </Col>
              </Col>
            </Row>

            <Row>
              <Col xs={8} className="mx-auto">
                <FormGroup row>
                  <Col sm={12} className="text-right">
                    <Button
                      key="buttonSave"
                      type="submit"
                      color="primary"
                      disabled={formik.isSubmitting}
                      className="mr-2 btn-block-sm"
                    >
                      <i className="fa fa-save mr-2" />
                      Cập nhật
                    </Button>
                  </Col>
                </FormGroup>
              </Col>
            </Row>

          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Keyword;