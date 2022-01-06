import React, { useEffect, useState } from 'react';
import { Alert, Col, Row, Button, Form, FormGroup, Label } from "reactstrap";
import { useFormik } from "formik";
import Loading from "../../Common/Loading";
import ConfigModel from "../../../models/ConfigModel/index";
import CreatableSelect from 'react-select/creatable';
import uuid from 'uuid';

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: null,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handelInsertOrUpdate(values)
    },
  });


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
            <Col xs={8} className="mx-auto">
              <Col xs={12}>
                <FormGroup row>
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
                </FormGroup>
              </Col>
            </Col>
            <Col xs={12}>
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
            </Col>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Keyword;