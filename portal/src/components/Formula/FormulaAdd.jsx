import React, {useState, useEffect} from 'react';
import {Card, CardBody, CardHeader, Col, Row, Form, FormGroup, Label, Input, Table, Button, Alert} from 'reactstrap';
import {useParams} from 'react-router';
import {layoutFullWidthHeight} from '../../utils/html';
import {useFormik} from 'formik';
import {initialValues, validationSchema} from './const';
import FormulaModel from '../../models/FormulaModel';
import NumberFormat from '../Common/NumberFormat';
import {CheckAccess} from '../../navigation/VerifyAccess';
import {Checkbox} from 'antd';
import InterpretModel from '../../models/InterpretModel';
import Select from 'react-select';
import {CircularProgress} from '@material-ui/core';
import Loading from '../Common/Loading';
import {convertValueSelect} from 'utils/index';

layoutFullWidthHeight();

function FormulaAdd({noEdit}) {
  const _formulaModel = new FormulaModel();
  const _interpretModel = new InterpretModel();
  const [isLoading, setisLoading] = useState(true);

  const [dataFormula, setDataFormula] = useState(initialValues);
  const [dataIngredient, setDataIngredient] = useState([]);
  const [dataAttribute, setDataAttribute] = useState([]);
  const [dataCalculation, setDataCalculation] = useState([]);
  const [dataFormulaParent, setDataFormulaParent] = useState([]);
  let {id} = useParams();

  const [btnType, setbtnType] = useState('');
  const [isType1] = useState([
    {name: 'Công thức', id: '1'},
    {name: 'Thành phần', id: '0'},
  ]);

  const [isType2] = useState([
    {name: 'Công thức', id: '1'},
    {name: 'Thành phần', id: '0'},
  ]);

  const [optionTypeConditionFormula] = useState([
    {label: 'CT', value: 1},
    {label: 'TP', value: 0},
  ]);

  const [optionAttributesGroup, setOptionAttributesGroup] = useState([]);
  const [optionFormula, setOptionFormula] = useState([]);
  const [optionIngredient, setOptionIngredient] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [optionCalculation, setOptionCalculation] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: dataFormula,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: values => {
      handleCreateOrUpdate(values);
    },
  });

  const _callAPI = async () => {
    try {
      //Chỉ số
      let dataAttributesGroup = await _formulaModel.getAttributeGruop();
      let {items: itemsAttributesGroup = []} = dataAttributesGroup || {};
      setDataAttribute(itemsAttributesGroup);
      let optionAttrGroup = itemsAttributesGroup.map(({attribute_gruop_id: value, gruop_name: label}) => ({
        value,
        label,
      }));
      setOptionAttributesGroup(optionAttrGroup);

      //Phép tính
      let dataCalculation = await _formulaModel.getListCalculation();
      let {items: itemsCalulation = []} = dataCalculation || {};
      setDataCalculation(itemsCalulation);
      let optionCal = itemsCalulation.map(({calculation_id: value, calculation: label}) => ({value, label}));
      setOptionCalculation(optionCal);

      //Công thức
      let dataFormular = await _formulaModel.getListFormulaParent();
      let {items: itemsFormula = []} = dataFormular || {};
      setDataFormulaParent(itemsFormula);
      let optionFormula = itemsFormula.map(({formula_id: value, formula_name: label}) => ({value, label}));
      setOptionFormula(optionFormula);

      //Thành phần
      let dataIngredient = await _formulaModel.getListIngredient();
      let {items: itemsIngredient = []} = dataIngredient || {};
      setDataIngredient(itemsIngredient);
      let optionIngredient = itemsIngredient.map(({ingredient_id: value, ingredient_name: label}) => ({
        value,
        label,
      }));
      setOptionIngredient(optionIngredient);
    } catch (error) {
      window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vùi lòng F5 thử lại'));
    }
  };

  useEffect(() => {
    setTimeout(() => setisLoading(false), 500);
    _callAPI();
  }, []);

  const handleCreateOrUpdate = async values => {
    try {
      _formulaModel.create(values).then(data => {
        if (btnType == 'save') {
          if (id) {
            _initDataDetail();
          } else {
            formik.resetForm();
            _callAPI();
            setisLoading(true);
            setTimeout(() => setisLoading(false), 500);
          }
          window._$g.toastr.show('Lưu thành công!', 'success');
        } else if (btnType == 'save&quit') {
          window._$g.toastr.show('Lưu thành công!', 'success');
          return window._$g.rdr('/formula');
        }
      });
    } catch (error) {
      let {errors, statusText, message} = error;
      let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join('<br/>');
      setAlerts([{color: 'danger', msg}]);
      window.scrollTo(0, 0);
    } finally {
      formik.setSubmitting(false);
      // window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (id) {
      _initDataDetail();
    }
  }, [id]);

  const _initDataDetail = async () => {
    try {
      _formulaModel.detail(id).then(data => {
        setDataFormula(data);
      });
    } catch (error) {
      window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vui lòng F5 thử lại'));
    }
  };

  const convertValue = (value, options) => {
    if (!(typeof value === 'object') && options && options.length) {
      value = (_val => {
        return options.find(item => '' + item.value === '' + _val);
      })(value);
    } else if (Array.isArray(value) && options && options.length) {
      return options.filter(item => {
        return value.find(e => e == item.value);
      });
    }
    if (!value) {
      value = '';
    }
    return value;
  };

  const getOptionAttribute = () => {
    if (dataAttribute && dataAttribute.length) {
      return dataAttribute.map(item => {
        return formik.values.attribute_gruop_id == item.attribute_gruop_id
          ? {
              value: item.attribute_gruop_id,
              label: item.gruop_name,
            }
          : {
              value: item.attribute_gruop_id,
              label: item.gruop_name,
            };
      });
    }
    return [];
  };

  const getOptionFormula = () => {
    if (dataFormulaParent && dataFormulaParent.length) {
      return dataFormulaParent.map(item => {
        return formik.values.orderid_1 == item.formula_id || formik.values.orderid_2 == item.formula_id
          ? {
              value: item.formula_id,
              label: item.formula_name,
              isDisabled: true,
            }
          : {
              value: item.formula_id,
              label: item.formula_name,
            };
      });
    }
    return [];
  };

  const getOptionIngdient = () => {
    if (dataIngredient && dataIngredient.length) {
      return dataIngredient.map(item => {
        return formik.values.orderid_1 == item.ingredient_id || formik.values.orderid_2 == item.ingredient_id
          ? {
              value: item.ingredient_id,
              label: item.ingredient_name,
              isDisabled: true,
            }
          : {
              value: item.ingredient_id,
              label: item.ingredient_name,
            };
      });
    }
    return [];
  };

  const getOptionType1 = () => {
    if (isType1 && isType1.length) {
      return isType1.map(item => {
        return formik.values.type1 == item.id
          ? {
              value: item.id,
              label: item.name,
              isDisabled: true,
            }
          : {
              value: item.id,
              label: item.name,
            };
      });
    }
    return [];
  };

  const getOptionType2 = () => {
    if (isType2 && isType2.length) {
      return isType2.map(item => {
        return formik.values.type2 == item.id
          ? {
              value: item.id,
              label: item.name,
              isDisabled: true,
            }
          : {
              value: item.id,
              label: item.name,
            };
      });
    }
    return [];
  };

  const getOptionCalculation = () => {
    if (dataCalculation && dataCalculation.length) {
      return dataCalculation.map(item => {
        return formik.values.calculation_id == item.calculation_id
          ? {
              value: item.calculation_id,
              label: item.calculation,
            }
          : {
              value: item.calculation_id,
              label: item.calculation,
            };
      });
    }
    return [];
  };

  const getOptionCTTP = type => {
    if (type == null) return [];
    else if (type == true) return optionFormula;
    else if (type == false) return optionIngredient;
  };

  const getPlaceholderCTTP = (type, index) => {
    if (type == null) return '';
    else if (type == true) return 'CT' + index;
    else if (type == false) return 'TP' + index;
  };

  const renderTableConditionFormular = () => {
    return (
      <Table size="sm" bordered striped hover className="tb-product-attributes mt-2" style={{marginBottom: 0}}>
        <thead>
          <tr>
            <th className="text-center">Chỉ số</th>
            <th className="text-center" style={{width: '13%'}}>
              Giá trị
            </th>
            <th className="text-center" style={{width: '11%'}}>
              Loại CT1/TP1
            </th>
            <th className="text-center" style={{width: '15%'}}>
              CT1/TP1
            </th>
            <th className="text-center" style={{width: '12%'}}>
              Phép tính
            </th>
            <th className="text-center" style={{width: '11%'}}>
              Loại CT2/TP2
            </th>
            <th className="text-center" style={{width: '15%'}}>
              CT2/TP2
            </th>
            <th className="text-center" style={{width: '5%'}}></th>
          </tr>
        </thead>
        <tbody>
          {formik.values.list_condition_formula && formik.values.list_condition_formula.length > 0 ? (
            formik.values.list_condition_formula.map((item, index) => (
              <tr key={index}>
                <td>
                  <Select
                    className="MuiPaper-filter__custom--select"
                    id={`attributes_group_id_${index}`}
                    name={`attributes_group_id_${index}`}
                    onChange={e => handleChangeRowConditionFormula('attributes_group_id', index, e ? e.value : null)}
                    isSearchable={true}
                    placeholder={'-- Chọn --'}
                    value={convertValueSelect(item.attributes_group_id, optionAttributesGroup)}
                    options={optionAttributesGroup}
                    isClearable={true}
                    styles={{
                      menuPortal: base => ({...base, zIndex: 9999}),
                    }}
                    menuPortalTarget={document.querySelector('body')}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.value}
                    id={`value_${index}`}
                    name={`value_${index}`}
                    className="form-control"
                    placeholder="Giá trị"
                    onChange={({target}) => handleChangeRowConditionFormula('value', index, target.value)}
                  />
                </td>
                <td>
                  <Select
                    className="MuiPaper-filter__custom--select"
                    id={`is_formula_orther_id_1_${index}`}
                    name={`is_formula_orther_id_1_${index}`}
                    onChange={e => handleChangeRowConditionFormula('is_formula_orther_id_1', index, e ? e.value : null)}
                    isSearchable={true}
                    placeholder={'-- Chọn --'}
                    value={convertValueSelect(item.is_formula_orther_id_1, optionTypeConditionFormula)}
                    options={optionTypeConditionFormula}
                    isClearable={true}
                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                    menuPortalTarget={document.querySelector('body')}
                  />
                </td>
                <td>
                  <Select
                    className="MuiPaper-filter__custom--select"
                    id={`orther_id_1_${index}`}
                    name={`orther_id_1_${index}`}
                    onChange={e => handleChangeRowConditionFormula('orther_id_1', index, e ? e.value : null)}
                    isSearchable={true}
                    placeholder={`-- Chọn ${getPlaceholderCTTP(item.is_formula_orther_id_1, 1)} --`}
                    value={convertValueSelect(
                      item.orther_id_1,
                      item.is_formula_orther_id_1 ? optionFormula : optionIngredient,
                    )}
                    options={getOptionCTTP(item.is_formula_orther_id_1)}
                    isClearable={true}
                    styles={{
                      menuPortal: base => ({...base, zIndex: 9999}),
                    }}
                    menuPortalTarget={document.querySelector('body')}
                  />
                </td>
                <td>
                  <Select
                    className="MuiPaper-filter__custom--select"
                    id={`calculation_id_${index}`}
                    name={`calculation_id_${index}`}
                    onChange={e => handleChangeRowConditionFormula('calculation_id', index, e ? e.value : null)}
                    isSearchable={true}
                    placeholder={'Phép tính'}
                    value={convertValueSelect(item.calculation_id, optionCalculation)}
                    options={optionCalculation}
                    isClearable={true}
                    styles={{
                      menuPortal: base => ({...base, zIndex: 9999}),
                    }}
                    menuPortalTarget={document.querySelector('body')}
                  />
                </td>

                <td>
                  <Select
                    className="MuiPaper-filter__custom--select"
                    id={`is_formula_orther_id_2_${index}`}
                    name={`is_formula_orther_id_2_${index}`}
                    onChange={e => handleChangeRowConditionFormula('is_formula_orther_id_2', index, e ? e.value : null)}
                    isSearchable={true}
                    placeholder={'-- Chọn --'}
                    value={convertValueSelect(item.is_formula_orther_id_2, optionTypeConditionFormula)}
                    options={optionTypeConditionFormula}
                    isClearable={true}
                    styles={{
                      menuPortal: base => ({...base, zIndex: 9999}),
                    }}
                    menuPortalTarget={document.querySelector('body')}
                  />
                </td>
                <td>
                  <Select
                    className="MuiPaper-filter__custom--select"
                    id={`orther_id_2_${index}`}
                    name={`orther_id_2_${index}`}
                    onChange={e => handleChangeRowConditionFormula('orther_id_2', index, e ? e.value : null)}
                    isSearchable={true}
                    placeholder={`-- Chọn ${getPlaceholderCTTP(item.is_formula_orther_id_2, 2)} --`}
                    value={convertValueSelect(
                      item.orther_id_2,
                      item.is_formula_orther_id_2 ? optionFormula : optionIngredient,
                    )}
                    options={getOptionCTTP(item.is_formula_orther_id_2)}
                    isClearable={true}
                    styles={{
                      menuPortal: base => ({...base, zIndex: 9999}),
                    }}
                    menuPortalTarget={document.querySelector('body')}
                  />
                </td>

                <td style={{verticalAlign: 'middle'}} className="text-center">
                  <Button
                    color="danger"
                    onClick={() => handleRemoveConditionFormula(index)}
                    className="btn-sm"
                    disabled={noEdit}>
                    {' '}
                    <i className="fa fa-trash" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={50}>
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  const handleRemoveConditionFormula = index => {
    let _list_condition_formula = [...formik.values.list_condition_formula];
    _list_condition_formula.splice(index, 1);
    formik.setFieldValue('list_condition_formula', _list_condition_formula);
  };

  const handleChangeRowConditionFormula = (name, index, value) => {
    let _list_condition_formula = [...formik.values.list_condition_formula];
    _list_condition_formula[index][name] = value;

    if (name == 'is_formula_orther_id_1') {
      _list_condition_formula[index].orther_id_1 = null;
    }
    if (name == 'is_formula_orther_id_2') {
      _list_condition_formula[index].orther_id_2 = null;
    }
    formik.setFieldValue('list_condition_formula', _list_condition_formula);
  };

  const handleAddConditionFormula = () => {
    let conditionFormula = {
      formula_id: null,
      attributes_group_id: null,
      value: '',
      is_formula_orther_id_1: null,
      orther_id_1: null,
      is_formula_orther_id_2: null,
      orther_id_2: null,
      calculation_id: null,
    };

    let __list_condition_formula = [...formik.values.list_condition_formula] || [];
    __list_condition_formula.push(conditionFormula);
    formik.setFieldValue('list_condition_formula', __list_condition_formula);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div key={`view`} className="animated fadeIn news">
      <Row className="d-flex justify-content-center">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <b>{id ? (noEdit ? 'Chi tiết' : 'Chỉnh sửa') : 'Thêm mới'} công thức </b>
            </CardHeader>
            <CardBody>
              {alerts.map(({color, msg}, idx) => {
                return (
                  <Alert key={`alert-${idx}`} color={color} isOpen={true} toggle={() => setAlerts([])}>
                    <span dangerouslySetInnerHTML={{__html: msg}} />
                  </Alert>
                );
              })}
              <Form id="formInfo" onSubmit={formik.handleSubmit}>
                <Row>
                  <Col xs={6} sm={12}>
                    <FormGroup row>
                      <Label sm={2} className="text-right"></Label>
                      <Col sm={10} xs={12}>
                        <Checkbox
                          disabled={id ? true : false}
                          onChange={e => {
                            formik.setFieldValue(`is_condition_formula`, e.target.checked);
                            if (e.target.checked) {
                              formik.setFieldValue(`is_couple_formula`, false);
                            }
                          }}
                          checked={formik.values.is_condition_formula}>
                          Công thức điều kiện
                        </Checkbox>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} sm={12}>
                    <FormGroup row>
                      <Label sm={2} className="text-right"></Label>
                      <Col sm={10} xs={12}>
                        <Checkbox
                          disabled={id ? true : false}
                          onChange={e => {
                            formik.setFieldValue(`is_couple_formula`, e.target.checked);
                            if (e.target.checked) {
                              formik.setFieldValue(`is_condition_formula`, false);
                            }
                          }}
                          checked={formik.values.is_couple_formula}>
                          Công thức cặp
                        </Checkbox>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col xs={6}>
                    <FormGroup row>
                      <Label for="formula_name" sm={4} className="">
                        Tên công thức <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={8}>
                        <Input
                          name="formula_name"
                          id="formula_name"
                          type="text"
                          placeholder="Tên công thức"
                          disabled={noEdit}
                          value={formik.values.formula_name}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.formula_name && formik.touched.formula_name ? (
                          <div className="field-validation-error alert alert-danger fade show" role="alert">
                            {formik.errors.formula_name}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col xs={6}>
                    <FormGroup row>
                      <Label for="attribute_gruop_id" sm={4} className="text-right">
                        Chỉ số <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={8}>
                        <Select
                          className="MuiPaper-filter__custom--select"
                          id={`attribute_gruop_id`}
                          name={`attribute_gruop_id`}
                          styles={{
                            menuPortal: base => ({...base, zIndex: 9999}),
                          }}
                          menuPortalTarget={document.querySelector('body')}
                          isDisabled={noEdit}
                          isClearable={true}
                          placeholder={'-- Chọn --'}
                          value={convertValue(formik.values.attribute_gruop_id, getOptionAttribute())}
                          options={getOptionAttribute(formik.values.attribute_gruop_id, true)}
                          onChange={value => {
                            if (!value) {
                              formik.setFieldValue('attribute_gruop_id', '');
                            } else {
                              formik.setFieldValue('attribute_gruop_id', value.value);
                            }
                          }}
                        />

                        {formik.errors.attribute_gruop_id && formik.touched.attribute_gruop_id ? (
                          <div className="field-validation-error alert alert-danger fade show" role="alert">
                            {formik.errors.attribute_gruop_id}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup row>
                      <Label for="formula_name" sm={2} className="">
                        Mô tả <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={10}>
                        <Input
                          name="desc"
                          id="desc"
                          type="textarea"
                          placeholder="Mô tả"
                          disabled={noEdit}
                          value={formik.values.desc}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.desc && formik.touched.desc ? (
                          <div className="field-validation-error alert alert-danger fade show" role="alert">
                            {formik.errors.desc}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                {formik.values.is_couple_formula ? null : (
                  <Row>
                    <Col xs={12}>
                      <FormGroup row style={{alignItems: 'center'}}>
                        <Label for="ingredient_name" sm={2} className="">
                          Kết quả cuối cùng
                        </Label>
                        <Col sm={2}>
                          <Checkbox
                            disabled={noEdit}
                            onChange={e => {
                              formik.setFieldValue(`is_total_no_shortened`, e.target.checked);
                              if (e.target.checked) {
                                formik.setFieldValue(`is_total_shortened`, false);
                                formik.setFieldValue(`is_total_2digit`, false);
                              }
                            }}
                            checked={formik.values.is_total_no_shortened}>
                            Tổng không rút gọn
                          </Checkbox>
                        </Col>
                        <Col sm={2}>
                          <Checkbox
                            disabled={noEdit}
                            onChange={e => {
                              formik.setFieldValue(`is_total_shortened`, e.target.checked);
                              if (e.target.checked) {
                                formik.setFieldValue(`is_total_no_shortened`, false);
                                formik.setFieldValue(`is_total_2digit`, false);
                              }
                            }}
                            checked={formik.values.is_total_shortened}>
                            Tổng 1 chữ số
                          </Checkbox>
                        </Col>
                        <Col sm={2}>
                          <Checkbox
                            disabled={noEdit}
                            onChange={e => {
                              formik.setFieldValue(`is_total_2digit`, e.target.checked);
                              if (e.target.checked) {
                                formik.setFieldValue(`is_total_no_shortened`, false);
                                formik.setFieldValue(`is_total_shortened`, false);
                              }
                            }}
                            checked={formik.values.is_total_2digit}>
                            Tổng 2 chữ số
                          </Checkbox>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col xs={6}>
                    <FormGroup row>
                      <Label for="order_index" sm={4} className="">
                        Thứ tự sắp xếp <span className="font-weight-bold red-text">*</span>
                      </Label>
                      <Col sm={8}>
                        <NumberFormat
                          name="order_index"
                          id="order_index"
                          disabled={noEdit}
                          onChange={value => {
                            formik.setFieldValue('order_index', value.target.value);
                          }}
                          value={formik.values.order_index}
                        />
                        {formik.errors.order_index && formik.touched.order_index ? (
                          <div className="field-validation-error alert alert-danger fade show" role="alert">
                            {formik.errors.order_index}
                          </div>
                        ) : null}
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                {formik.values.is_condition_formula || formik.values.is_couple_formula ? null : (
                  <Row>
                    <Col xs={12}>
                      <FormGroup row>
                        <Label for="formula_name" sm={2} className="">
                          Công thức
                        </Label>
                        <Col sm={2}>
                          <Select
                            className="MuiPaper-filter__custom--select"
                            id={`type1`}
                            name={`type1`}
                            styles={{
                              menuPortal: base => ({...base, zIndex: 9999}),
                            }}
                            menuPortalTarget={document.querySelector('body')}
                            isDisabled={noEdit}
                            isClearable={true}
                            placeholder={'Chọn CT/TP 1'}
                            value={convertValue(formik.values.type1, getOptionType1())}
                            options={getOptionType1(formik.values.type1, true)}
                            onChange={value => {
                              if (!value) {
                                formik.setFieldValue('type1', '');
                                formik.setFieldValue('orderid_1', '');
                              } else {
                                formik.setFieldValue('type1', value.value);
                              }
                            }}
                          />
                        </Col>
                        <Col sm={2}>
                          {formik.values.type1 !== '' ? (
                            formik.values.type1 == 0 ? (
                              <Select
                                className="MuiPaper-filter__custom--select"
                                id={`orderid_1`}
                                isClearable={true}
                                name={`orderid_1`}
                                styles={{
                                  menuPortal: base => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                                menuPortalTarget={document.querySelector('body')}
                                isDisabled={noEdit}
                                placeholder={'Chọn thành phần'}
                                value={convertValue(formik.values.orderid_1, getOptionIngdient())}
                                options={getOptionIngdient(formik.values.orderid_1, true)}
                                onChange={value => {
                                  if (!value) {
                                    formik.setFieldValue('orderid_1', '');
                                  } else {
                                    formik.setFieldValue('orderid_1', value.value);
                                  }
                                }}
                              />
                            ) : (
                              <Select
                                className="MuiPaper-filter__custom--select"
                                id={`orderid_1`}
                                isClearable={true}
                                name={`orderid_1`}
                                styles={{
                                  menuPortal: base => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                                menuPortalTarget={document.querySelector('body')}
                                isDisabled={noEdit}
                                placeholder={'Chọn công thức'}
                                value={convertValue(formik.values.orderid_1, getOptionFormula())}
                                options={getOptionFormula(formik.values.orderid_1, true)}
                                onChange={value => {
                                  if (!value) {
                                    formik.setFieldValue('orderid_1', '');
                                  } else {
                                    formik.setFieldValue('orderid_1', value.value);
                                  }
                                }}
                              />
                            )
                          ) : (
                            <Select
                              className="MuiPaper-filter__custom--select"
                              value={convertValue(formik.values.orderid_1, getOptionFormula())}
                              menuPortalTarget={document.querySelector('body')}
                              isDisabled={noEdit}
                              placeholder={'Chọn'}
                            />
                          )}
                        </Col>
                        <Col sm={2}>
                          <Select
                            className="MuiPaper-filter__custom--select"
                            id={`calculation_id`}
                            isClearable={true}
                            name={`calculation_id`}
                            styles={{
                              menuPortal: base => ({...base, zIndex: 9999}),
                            }}
                            menuPortalTarget={document.querySelector('body')}
                            isDisabled={noEdit}
                            placeholder={'Chọn phép tính'}
                            value={convertValue(formik.values.calculation_id, getOptionCalculation())}
                            options={getOptionCalculation(formik.values.calculation_id, true)}
                            onChange={value => {
                              if (!value) {
                                formik.setFieldValue('calculation_id', '');
                              } else {
                                formik.setFieldValue('calculation_id', value.value);
                              }
                            }}
                          />
                        </Col>
                        <Col sm={2}>
                          <Select
                            className="MuiPaper-filter__custom--select"
                            id={`orderid_1`}
                            isClearable={true}
                            name={`orderid_2`}
                            styles={{
                              menuPortal: base => ({...base, zIndex: 9999}),
                            }}
                            menuPortalTarget={document.querySelector('body')}
                            isDisabled={noEdit}
                            placeholder={'Chọn CT/TP 2'}
                            value={convertValue(formik.values.type2, getOptionType2())}
                            options={getOptionType2(formik.values.type2, true)}
                            onChange={value => {
                              if (!value) {
                                formik.setFieldValue('type2', '');
                                formik.setFieldValue('orderid_2', '');
                              } else {
                                formik.setFieldValue('type2', value.value);
                              }
                            }}
                          />
                        </Col>
                        <Col sm={2}>
                          {formik.values.type2 !== '' ? (
                            formik.values.type2 == 0 ? (
                              <Select
                                className="MuiPaper-filter__custom--select"
                                id={`orderid_2`}
                                isClearable={true}
                                name={`orderid_2`}
                                styles={{
                                  menuPortal: base => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                                menuPortalTarget={document.querySelector('body')}
                                isDisabled={noEdit}
                                placeholder={'Chọn thành phần'}
                                value={convertValue(formik.values.orderid_2, getOptionIngdient())}
                                options={getOptionIngdient(formik.values.orderid_2, true)}
                                onChange={value => {
                                  if (!value) {
                                    formik.setFieldValue('orderid_2', '');
                                  } else {
                                    formik.setFieldValue('orderid_2', value.value);
                                  }
                                }}
                              />
                            ) : (
                              <Select
                                className="MuiPaper-filter__custom--select"
                                isClearable={true}
                                id={`orderid_2`}
                                name={`orderid_2`}
                                styles={{
                                  menuPortal: base => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                                menuPortalTarget={document.querySelector('body')}
                                isDisabled={noEdit}
                                placeholder={'Chọn công thức'}
                                value={convertValue(formik.values.orderid_2, getOptionFormula())}
                                options={getOptionFormula(formik.values.orderid_2, true)}
                                onChange={value => {
                                  if (!value) {
                                    formik.setFieldValue('orderid_2', '');
                                  } else {
                                    formik.setFieldValue('orderid_2', value.value);
                                  }
                                }}
                              />
                            )
                          ) : (
                            <Select
                              className="MuiPaper-filter__custom--select"
                              value={convertValue(formik.values.orderid_2, getOptionFormula())}
                              menuPortalTarget={document.querySelector('body')}
                              isDisabled={noEdit}
                              placeholder={'Chọn'}
                            />
                          )}
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                )}

                {formik.values.is_couple_formula ? (
                  <>
                    <Row>
                      <Col sm={6} xs={12}>
                        <FormGroup row>
                          <Label for="attribute_gruop_id" sm={4} className="">
                            Công thức tham chiếu{' '}
                          </Label>
                          <Col sm={8}>
                            <Select
                              className="MuiPaper-filter__custom--select"
                              id={`ref_formula_id`}
                              name={`ref_formula_id`}
                              styles={{
                                menuPortal: base => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              menuPortalTarget={document.querySelector('body')}
                              isDisabled={noEdit}
                              isClearable={true}
                              placeholder={'-- Chọn --'}
                              value={convertValueSelect(formik.values.ref_formula_id, optionFormula)}
                              options={optionFormula}
                              onChange={e => {
                                formik.setFieldValue('ref_formula_id', e ? e.value : null);
                              }}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col sm={6} xs={12}>
                        <FormGroup row>
                          <Label for="ref_condition_id" sm={4} className="text-right">
                            Điều kiện tham chiếu{' '}
                          </Label>
                          <Col sm={8}>
                            <Select
                              className="MuiPaper-filter__custom--select"
                              id={`ref_condition_id`}
                              name={`ref_condition_id`}
                              styles={{
                                menuPortal: base => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              menuPortalTarget={document.querySelector('body')}
                              isDisabled={noEdit}
                              isClearable={true}
                              placeholder={'-- Chọn --'}
                              value={convertValueSelect(formik.values.ref_condition_id, optionAttributesGroup)}
                              options={optionAttributesGroup}
                              onChange={e => {
                                formik.setFieldValue('ref_condition_id', e ? e.value : null);
                              }}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm={6} xs={12}>
                        <FormGroup row>
                          <Label for="interpret_formula_id" sm={4} className="">
                            Công thức lấy luận giải{' '}
                          </Label>
                          <Col sm={8}>
                            <Select
                              className="MuiPaper-filter__custom--select"
                              id={`interpret_formula_id`}
                              name={`interpret_formula_id`}
                              styles={{
                                menuPortal: base => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              menuPortalTarget={document.querySelector('body')}
                              isDisabled={noEdit}
                              isClearable={true}
                              placeholder={'-- Chọn --'}
                              value={convertValueSelect(formik.values.interpret_formula_id, optionFormula)}
                              options={optionFormula}
                              onChange={e => {
                                formik.setFieldValue('interpret_formula_id', e ? e.value : null);
                              }}
                            />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </>
                ) : null}

                {formik.values.is_condition_formula ? (
                  <>
                    <Row>
                      <Col xs={12}>
                        <b className="underline text-primary">Danh sách điều kiện của công thức</b>
                      </Col>

                      <Col xs={12} sm={12}>
                        {/* <Row>
                          <Label for="condition_formula" sm={2} className="">
                            Điều kiện
                          </Label>
                          <Col sm={10} xs={12}>
                            {renderTableConditionFormular()}
                          </Col>
                        </Row> */}
                        {renderTableConditionFormular()}
                      </Col>

                      <Col xs={12}>
                        <FormGroup row style={{marginBottom: '2rem'}}>
                          {/* <Label
                            for="condition_formula"
                            sm={2}
                            className="text-right"
                          ></Label> */}
                          <Col sm={12} xs={12}>
                            {!noEdit && (
                              <Button className="btn-sm mt-1" color="success" onClick={handleAddConditionFormula}>
                                <i className="fa fa-plus mr-2" />
                                Thêm dòng
                              </Button>
                            )}
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>
                  </>
                ) : null}

                <Row>
                  <Col xs={12}>
                    <FormGroup row>
                      {!formik.values.is_condition_formula ? (
                        <Label for="formula_name" sm={2} className="text-right"></Label>
                      ) : null}

                      {!formik.values.is_condition_formula && !formik.values.is_couple_formula ? (
                        <Col xs={2}>
                          <Checkbox
                            disabled={noEdit}
                            onChange={e => {
                              formik.setFieldValue(`is_default`, e.target.checked ? 1 : 0);
                            }}
                            checked={formik.values.is_default}>
                            Ưu tiên
                          </Checkbox>
                        </Col>
                      ) : null}

                      <Col xs={2}>
                        <Checkbox
                          disabled={noEdit}
                          onChange={e => {
                            formik.setFieldValue(`is_active`, e.target.checked ? 1 : 0);
                          }}
                          checked={formik.values.is_active}>
                          Kích hoạt
                        </Checkbox>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <div className="text-right mb-2">
                  <div>
                    {noEdit ? (
                      <CheckAccess permission="FOR_FORMULA_VIEW">
                        <button
                          color="primary"
                          className="mr-2 btn-block-sm btn btn-primary"
                          onClick={() => window._$g.rdr(`/formula/edit/${id}`)}>
                          <i className="fa fa-edit mr-1" />
                          Chỉnh sửa
                        </button>
                      </CheckAccess>
                    ) : (
                      <>
                        <CheckAccess permission={id ? `FOR_FORMULA_EDIT` : `FOR_FORMULA_ADD`}>
                          <button
                            className="mr-2 btn-block-sm btn btn-primary"
                            onClick={() => {
                              setbtnType('save');
                            }}
                            type="submit">
                            <i className="fa fa-save mr-1" />
                            Lưu
                          </button>
                        </CheckAccess>
                        <CheckAccess permission={id ? `FOR_FORMULA_EDIT` : `FOR_FORMULA_ADD`}>
                          <button
                            className="mr-2 btn-block-sm btn btn-success"
                            onClick={() => {
                              setbtnType('save&quit');
                            }}
                            type="submit">
                            <i className="fa fa-save mr-1" />
                            Lưu và đóng
                          </button>
                        </CheckAccess>
                      </>
                    )}
                    <button
                      className=" btn-block-sm btn btn-secondary"
                      type="button"
                      onClick={() => window._$g.rdr(`/formula`)}>
                      <i className="fa fa-times-circle mr-1" />
                      Đóng
                    </button>
                  </div>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default FormulaAdd;
