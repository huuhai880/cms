import React, {useState, useEffect} from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Alert,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from 'reactstrap';
import {useParams} from 'react-router';
import {layoutFullWidthHeight} from '../../utils/html';
import {useFormik} from 'formik';
import {initialValues, validationSchema} from './const';
import InterpretModel from '../../models/InterpretModel';
import NumberFormat from '../Common/NumberFormat';
import {CheckAccess} from '../../navigation/VerifyAccess';
import {Checkbox} from 'antd';
import {Editor} from '@tinymce/tinymce-react';
import Select from 'react-select';
import {readImageAsBase64} from '../../utils/html';
import {CircularProgress} from '@material-ui/core';
import Loading from '../Common/Loading';

layoutFullWidthHeight();
const _interpretModel = new InterpretModel();

function InterPretAdd({noEdit}) {
    const [dataInterpret, setDataInterpret] = useState(initialValues);
    const [dataAttribute, setDataAttribute] = useState([]);
    const [dataMainnumber, setDataMainnumber] = useState([]);
    const [dataRelationship, setDataRelationship] = useState([]);
    let {id = null} = useParams();
    const [btnType, setbtnType] = useState('');
    const [isForPowerDiagram, setIsForPowerDiagram] = useState(false);
    const [isinterpretspectial, setIsinterpretspectial] = useState(false);
    const [disableSpectial, setDisableSpectial] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [attributeExclude, setAttribuExclude] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: dataInterpret,
        validationSchema: validationSchema(isForPowerDiagram, isinterpretspectial),
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: values => {
            handleCreateOrUpdate(values);
        },
    });

    useEffect(() => {
        const _callAPI = async () => {
            setisLoading(true);
            try {
                let attribute = await _interpretModel.getListAttribute();
                setDataAttribute(attribute.items);

                let mainnumber = await _interpretModel.getListMainnumber();
                setDataMainnumber(mainnumber.items);

                let relationship = await _interpretModel.getListRelationship();
                setDataRelationship(relationship.items);

                if (id) {
                    let interpretDetail = await _interpretModel.detail(id);
                    setDataInterpret(interpretDetail);
                    if (interpretDetail.is_interpretspectial) {
                        setDisableSpectial(true);
                    }
                    let {is_for_power_diagram = false} = interpretDetail || {};
                    setIsForPowerDiagram(is_for_power_diagram);
                }
            } catch (error) {
                window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vui lòng F5 thử lại'));
            } finally {
                setisLoading(false);
            }
        };

        _callAPI();

        if (document.body.classList.contains('tox-fullscreen')) {
            document.body.classList.remove('tox-fullscreen');
        }
    }, []);

    useEffect(() => {
        if (!formik.isSubmitting) return;
        if (Object.keys(formik.errors).length > 0) {
            document
                .getElementById(Object.keys(formik.errors)[0])
                .scrollIntoView({behavior: 'smooth', block: 'end', inline: 'start'});
        }
    }, [formik]);

    const handleCreateOrUpdate = async values => {
        try {
            let interpret_id = await _interpretModel.create(values);
            window._$g.toastr.show('Lưu thành công!', 'success');
            if (btnType == 'save_n_close') {
                return window._$g.rdr(`/interpret/show-list-child/${interpret_id}`);
            }
            if (btnType == 'save' && !id) {
                formik.resetForm();
                // setisLoading(true);
                // setTimeout(() => setisLoading(false), 500);
            }
        } catch (error) {
            let {errors, statusText, message} = error;
            let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join('<br/>');

            setAlerts([{color: 'danger', msg}]);
            window.scrollTo(0, 0);
        } finally {
            formik.setSubmitting(false);
            window.scrollTo(0, 0);
        }
    };

    //   useEffect(() => {
    //     if (id) {
    //       _initDataDetail();
    //     }
    //   }, [id]);

    useEffect(() => {
        if (id && formik.values.is_interpretspectial) {
            setIsinterpretspectial(true);
            try {
                _interpretModel.getListAttributeDetail({interpret_id: id}).then(data => {
                    formik.setFieldValue('attribute_list', data.items);
                });
            } catch (error) {
                window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vui lòng F5 thử lại'));
            }
        }
    }, [formik.values.is_interpretspectial]);

    // useEffect(() => {
    //     if (formik.values.attribute_id > 0) {
    //         getAttributeExclude(formik.values.attribute_id);
    //     }
    // }, [formik.values.attribute_id]);

    // const getAttributeExclude = async attribute_id => {
    //     try {
    //         let attributeExclude = await _interpretModel.getAttributeExclude(attribute_id, id ? id : 0);
    //         setAttribuExclude(attributeExclude);
    //         //Nếu thuộc tính so sánh đã có và nằm trong thuộc tính đang chọn bị exclude thi reset
    //         let find = (attributeExclude || []).find(p => p.attribute_id == formik.values.compare_attribute_id);
    //         if (find) {
    //             formik.setFieldValue('compare_attribute_id', null);
    //         }
    //     } catch (error) {
    //         window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vui lòng F5 thử lại'));
    //     }
    // };

    //   const _initDataDetail = async () => {
    //     try {
    //       let interpretDetail = await _interpretModel.detail(id);

    //       setDataInterpret(interpretDetail);
    //       if (interpretDetail.is_interpretspectial) {
    //         setDisableSpectial(true);
    //       }
    //       let { is_for_power_diagram = false } = interpretDetail || {};
    //       setIsForPowerDiagram(is_for_power_diagram);
    //     } catch (error) {
    //       window._$g.dialogs.alert(
    //         window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
    //       );
    //     }
    //   };

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

    const getOptionRelationship = () => {
        if (dataRelationship && dataRelationship.length) {
            return dataRelationship.map(item => {
                return formik.values.relationship_id == item.relationship_id
                    ? {
                          value: item.relationship_id,
                          label: item.relationship,
                      }
                    : {
                          value: item.relationship_id,
                          label: item.relationship,
                      };
            });
        }
        return [];
    };

    const getOptionAttributes = (is_exclude = false) => {
        if (dataAttribute && dataAttribute.length) {
            return dataAttribute.map(item => {
                let isDisabled = false;
                if (formik.values.attribute_list && formik.values.attribute_list.length) {
                    formik.values.attribute_list.map(itemAttribute => {
                        if (itemAttribute.attribute_id == item.attribute_id) {
                            isDisabled = true;
                        }
                    });
                }

                return {
                    interpret_attribute_id: item.interpret_attribute_id,
                    value: item.attribute_id,
                    label: item.attribute_name,
                    attribute_id: item.attribute_id,
                    attribute_name: item.attribute_name,
                    mainnumber_id: item.mainnumber_id,
                    mainnumber: item.mainnumber,
                    isDisabled,
                };
            });
        }

        return [];
    };

    const getOptionAttribute = (is_exclude = false) => {
        if (dataAttribute && dataAttribute.length) {
            return dataAttribute.map(item => {
                let isDisabled = false;
                if (is_exclude) {
                    let find = attributeExclude.find(p => p.attribute_id == item.attribute_id);
                    if (find) {
                        isDisabled = true;
                    }
                }
                return {
                    value: item.attribute_id,
                    label: item.attribute_name,
                    mainnumber_id: item.mainnumber_id,
                    isDisabled,
                };
            });
        }
        return [];
    };

    const getMainNumBer = mainnumber_id => {
        if (dataMainnumber && dataMainnumber.length) {
            return dataMainnumber.map(item => {
                return mainnumber_id == item.mainnumber_id ? item.mainnumber : null;
            });
        }
        return [];
    };

    const getOptionMainNumBer = () => {
        if (dataMainnumber && dataMainnumber.length) {
            return dataMainnumber.map(item => {
                return formik.values.mainnumber_id == item.mainnumber_id
                    ? {
                          value: item.mainnumber_id,
                          label: item.mainnumber,
                          isDisabled: true,
                      }
                    : {
                          value: item.mainnumber_id,
                          label: item.mainnumber,
                      };
            });
        }
        return [];
    };

    const handleUploadImageDesc = async (blobInfo, success, failure) => {
        readImageAsBase64(blobInfo.blob(), async imageUrl => {
            try {
                const imageUpload = await _interpretModel.upload({
                    base64: imageUrl,
                    folder: 'files',
                    includeCdn: true,
                });
                success(imageUpload);
            } catch (error) {
                failure(error);
            }
        });
    };

    const handleUploadImageShortDesc = async (blobInfo, success, failure) => {
        readImageAsBase64(blobInfo.blob(), async imageUrl => {
            try {
                const imageUpload = await _interpretModel.upload({
                    base64: imageUrl,
                    folder: 'files',
                    includeCdn: true,
                });
                success(imageUpload);
            } catch (error) {
                failure(error);
            }
        });
    };

    const isAllowed = values => {
        const {floatValue = 0} = values;
        return floatValue >= 0 && floatValue <= 100;
    };

    return isLoading ? (
        <Loading />
    ) : (
        <div key={`view`} className="animated fadeIn news">
            <Row className="d-flex justify-content-center">
                <Col xs={12}>
                    <Card>
                        <CardHeader>
                            <b>{id ? (noEdit ? 'Chi tiết' : 'Chỉnh sửa') : 'Thêm mới'} luận giải </b>
                        </CardHeader>
                        <CardBody>
                            {alerts.map(({color, msg}, idx) => {
                                return (
                                    <Alert
                                        key={`alert-${idx}`}
                                        color={color}
                                        isOpen={true}
                                        toggle={() => setAlerts([])}>
                                        <span dangerouslySetInnerHTML={{__html: msg}} />
                                    </Alert>
                                );
                            })}
                            <Form id="formInfo" onSubmit={formik.handleSubmit}>
                                <Row>
                                    <Col sm={6} xs={12}>
                                        <FormGroup row>
                                            <Label for="is_for_power_diagram" sm={4}></Label>
                                            <Col sm={8}>
                                                <Checkbox
                                                    disabled={noEdit || disableSpectial}
                                                    onChange={e => {
                                                        formik.setFieldValue(`is_interpretspectial`, e.target.checked);
                                                        formik.setFieldValue(`attribute_id`, '');
                                                        setIsinterpretspectial(e.target.checked);
                                                        if (e.target.checked == 0) {
                                                            formik.setFieldValue(`attribute_id`, null);
                                                            formik.setFieldValue(`attribute_list`, []);
                                                            formik.setFieldValue(`is_condition_or`, false);
                                                        }
                                                    }}
                                                    checked={formik.values.is_interpretspectial}>
                                                    Là luận giải đặc biệt
                                                </Checkbox>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={6} xs={12}>
                                        <FormGroup row>
                                            <Label for="attribute_id" sm={4}>
                                                Tên thuộc tính{' '}
                                                {!formik.values.is_for_power_diagram ? (
                                                    <span className="font-weight-bold red-text">*</span>
                                                ) : null}
                                            </Label>
                                            <Col sm={8}>
                                                {formik.values.is_interpretspectial ? (
                                                    <>
                                                        <Select
                                                            className="MuiPaper-filter__custom--select"
                                                            id={`attribute_id`}
                                                            name={`attribute_id`}
                                                            isClearable={true}
                                                            styles={{
                                                                menuPortal: base => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                }),
                                                            }}
                                                            menuPortalTarget={document.querySelector('body')}
                                                            isDisabled={noEdit || formik.values.is_for_power_diagram}
                                                            placeholder={'-- Chọn --'}
                                                            value={null}
                                                            options={getOptionAttributes()}
                                                            // isMulti
                                                            onChange={value => {
                                                                // console.log(value);
                                                                formik.setFieldValue('attribute_list', [
                                                                    ...formik.values.attribute_list,
                                                                    value,
                                                                ]);
                                                            }}
                                                        />
                                                        {/* )} */}

                                                        {formik.errors.attribute_id && formik.touched.attribute_id ? (
                                                            <div
                                                                className="field-validation-error alert alert-danger fade show"
                                                                role="alert">
                                                                {formik.errors.attribute_id}
                                                            </div>
                                                        ) : null}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Select
                                                            className="MuiPaper-filter__custom--select"
                                                            id={`attribute_id`}
                                                            name={`attribute_id`}
                                                            isClearable={true}
                                                            styles={{
                                                                menuPortal: base => ({
                                                                    ...base,
                                                                    zIndex: 9999,
                                                                }),
                                                            }}
                                                            menuPortalTarget={document.querySelector('body')}
                                                            isDisabled={noEdit || formik.values.is_for_power_diagram}
                                                            placeholder={'-- Chọn --'}
                                                            value={convertValue(
                                                                formik.values.attribute_id,
                                                                getOptionAttribute(),
                                                            )}
                                                            options={getOptionAttribute()}
                                                            // isMulti
                                                            onChange={value => {
                                                                if (!value) {
                                                                    formik.setFieldValue('attribute_id', '');
                                                                    formik.setFieldValue('mainnumber_id', '');
                                                                } else {
                                                                    formik.setFieldValue('attribute_id', value.value);
                                                                    formik.setFieldValue(
                                                                        'mainnumber_id',
                                                                        value.mainnumber_id,
                                                                    );
                                                                }
                                                            }}
                                                        />

                                                        {formik.errors.attribute_id && formik.touched.attribute_id ? (
                                                            <div
                                                                className="field-validation-error alert alert-danger fade show"
                                                                role="alert">
                                                                {formik.errors.attribute_id}
                                                            </div>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col sm={6} xs={12}>
                                        {!formik.values.is_interpretspectial ? (
                                            <FormGroup row>
                                                <Label for="relationship_id" sm={4}>
                                                    Mối quan hệ{' '}
                                                </Label>
                                                <Col sm={8}>
                                                    <Select
                                                        className="MuiPaper-filter__custom--select"
                                                        id={`relationship_id`}
                                                        name={`relationship_id`}
                                                        isClearable={true}
                                                        styles={{
                                                            menuPortal: base => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                            }),
                                                        }}
                                                        menuPortalTarget={document.querySelector('body')}
                                                        isDisabled={noEdit || formik.values.is_for_power_diagram}
                                                        placeholder={'-- Chọn --'}
                                                        value={convertValue(
                                                            formik.values.relationship_id,
                                                            getOptionRelationship(),
                                                        )}
                                                        options={getOptionRelationship(
                                                            formik.values.relationship_id,
                                                            true,
                                                        )}
                                                        onChange={value => {
                                                            if (!value) {
                                                                formik.setFieldValue('relationship_id', '');
                                                                formik.setFieldValue('compare_attribute_id', '');
                                                            } else {
                                                                formik.setFieldValue('relationship_id', value.value);
                                                            }
                                                        }}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        ) : (
                                            <FormGroup row>
                                                <Label for="is_condition_or" sm={4}></Label>
                                                <Col sm={8}>
                                                    <Checkbox
                                                        disabled={noEdit}
                                                        onChange={e => {
                                                            formik.setFieldValue(`is_condition_or`, e.target.checked);
                                                        }}
                                                        checked={formik.values.is_condition_or}>
                                                        Điều kiện hoặc
                                                    </Checkbox>
                                                </Col>
                                            </FormGroup>
                                        )}
                                    </Col>
                                </Row>
                                {formik.values.is_interpretspectial == 1 ? (
                                    <Row className="mb15">
                                        <Label for="relationship_id" sm={2}>
                                            {/* Mối quan hệ{" "} */}
                                        </Label>
                                        <Col
                                            xs={10}
                                            // style={{ maxHeight: 351, overflowY: "auto" }}
                                            className="border-secondary align-middle">
                                            <div
                                                className="col-xs-12 col-sm-12 col-md-12 col-lg-12 border align-middle"
                                                style={{padding: 5}}>
                                                <table className="table table-bordered table-hover ">
                                                    <thead className="bg-light">
                                                        <td className="align-middle text-center" width="10%">
                                                            <b>STT</b>
                                                        </td>

                                                        <td className=" align-middle text-center" width="50%">
                                                            <b>Thuộc tính</b>
                                                        </td>
                                                        <td className=" align-middle text-center" width="30%">
                                                            <b>Giá trị</b>
                                                        </td>
                                                        <td className=" align-middle text-center" width="10%">
                                                            <b>Thao tác</b>
                                                        </td>
                                                    </thead>

                                                    {formik.values.attribute_list &&
                                                        formik.values.attribute_list.map((item, index) => {
                                                            // console.log(formik.values.attribute_list);
                                                            return (
                                                                <tbody>
                                                                    <tr key={index}>
                                                                        <td
                                                                            className="align-middle text-center"
                                                                            width="10%">
                                                                            {index + 1}
                                                                        </td>
                                                                        <td className=" align-middle" width="50%">
                                                                            {item.attribute_name}
                                                                        </td>
                                                                        <td
                                                                            className=" align-middle text-center"
                                                                            width="30%">
                                                                            {getMainNumBer(item.mainnumber_id)}
                                                                        </td>
                                                                        <td
                                                                            className=" align-middle text-center"
                                                                            width="10%">
                                                                            <Button
                                                                                color="danger"
                                                                                title="Xóa"
                                                                                className=""
                                                                                disabled={noEdit}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    let clone = [
                                                                                        ...formik.values.attribute_list,
                                                                                    ];
                                                                                    clone.splice(index, 1);
                                                                                    formik.setFieldValue(
                                                                                        'attribute_list',
                                                                                        clone,
                                                                                    );
                                                                                }}>
                                                                                <i className="fa fa-trash" />
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            );
                                                        })}
                                                </table>
                                                {formik.values.attribute_list === 1 &&
                                                formik.values.attribute_list.length == 0 ? (
                                                    <>
                                                        {/* <tr key={index}></tr> */}
                                                        <div className=" align-middle text-center" width="100%">
                                                            <p>Không có dữ liệu</p>
                                                        </div>
                                                    </>
                                                ) : null}
                                                {formik.errors.attribute_list && formik.touched.attribute_list ? (
                                                    <div
                                                        className="col-xs-12 col-sm-12 col-md-12 col-lg-12 field-validation-error alert alert-danger fade show"
                                                        role="alert">
                                                        {formik.errors.attribute_list}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </Col>
                                    </Row>
                                ) : null}
                                <Row>
                                    <Col sm={6} xs={12}>
                                        {!formik.values.is_interpretspectial ? (
                                            <FormGroup row>
                                                <Label for="mainnumber_id" sm={4}>
                                                    Giá trị{' '}
                                                    {!formik.values.is_for_power_diagram ? (
                                                        <span className="font-weight-bold red-text">*</span>
                                                    ) : null}
                                                </Label>
                                                <Col sm={8}>
                                                    <Select
                                                        className="MuiPaper-filter__custom--select"
                                                        id={`mainnumber_id`}
                                                        name={`mainnumber_id`}
                                                        styles={{
                                                            menuPortal: base => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                            }),
                                                        }}
                                                        menuPortalTarget={document.querySelector('body')}
                                                        isDisabled={true}
                                                        placeholder={'-- Chọn --'}
                                                        value={convertValue(
                                                            formik.values.mainnumber_id,
                                                            getOptionMainNumBer(),
                                                        )}
                                                        options={getOptionMainNumBer(formik.values.mainnumber_id, true)}
                                                        onChange={value => {
                                                            formik.setFieldValue('mainnumber_id', value.value);
                                                        }}
                                                    />

                                                    {formik.errors.mainnumber_id && formik.touched.mainnumber_id ? (
                                                        <div
                                                            className="field-validation-error alert alert-danger fade show"
                                                            role="alert">
                                                            {formik.errors.mainnumber_id}
                                                        </div>
                                                    ) : null}
                                                </Col>
                                            </FormGroup>
                                        ) : null}
                                    </Col>

                                    <Col sm={6} xs={12}>
                                        {!formik.values.is_interpretspectial ? (
                                            <FormGroup row>
                                                <Label for="attribute_id" sm={4}>
                                                    Thuộc tính so sánh{' '}
                                                </Label>
                                                <Col sm={8}>
                                                    <Select
                                                        id={`compare_attribute_id`}
                                                        name={`compare_attribute_id`}
                                                        styles={{
                                                            menuPortal: base => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                            }),
                                                        }}
                                                        menuPortalTarget={document.querySelector('body')}
                                                        isDisabled={
                                                            noEdit ||
                                                            !formik.values.relationship_id ||
                                                            formik.values.is_for_power_diagram
                                                        }
                                                        isClearable={true}
                                                        placeholder={'-- Chọn --'}
                                                        value={convertValue(
                                                            formik.values.compare_attribute_id,
                                                            getOptionAttribute(),
                                                        )}
                                                        options={getOptionAttribute()}
                                                        onChange={value => {
                                                            if (!value) {
                                                                formik.setFieldValue('compare_attribute_id', '');
                                                            } else {
                                                                formik.setFieldValue(
                                                                    'compare_attribute_id',
                                                                    value.value,
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        ) : null}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={6} xs={12}>
                                        <FormGroup row>
                                            <Label for="order_index" sm={4}>
                                                Vị trí hiển thị <span className="font-weight-bold red-text">*</span>
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
                                                    <div
                                                        className="field-validation-error alert alert-danger fade show"
                                                        role="alert">
                                                        {formik.errors.order_index}
                                                    </div>
                                                ) : null}
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    {!formik.values.is_interpretspectial ? (
                                        <Col sm={6} xs={12}>
                                            <FormGroup row>
                                                <Label for="order_index" sm={4}>
                                                    % Mối quan hệ
                                                </Label>
                                                <Col sm={8}>
                                                    <InputGroup>
                                                        <NumberFormat
                                                            type="text"
                                                            name="match_percent"
                                                            decimalSeparator="."
                                                            decimalScale={1}
                                                            isNumericString
                                                            value={
                                                                formik.values.match_percent
                                                                    ? formik.values.match_percent
                                                                    : ''
                                                            }
                                                            onValueChange={({value}) => {
                                                                formik.setFieldValue('match_percent', value);
                                                            }}
                                                            isAllowed={values => isAllowed(values)}
                                                            disabled={noEdit || !formik.values.relationship_id}
                                                        />
                                                        <InputGroupAddon addonType="append">
                                                            <InputGroupText>%</InputGroupText>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    ) : null}
                                    
                                    <Col sm={6} xs={12}>
                                        <FormGroup row>
                                            <Label for="is_master" sm={4}></Label>
                                            <Col sm={4}>
                                                <Checkbox
                                                    disabled={noEdit || formik.values.is_for_power_diagram}
                                                    onChange={e => {
                                                        formik.setFieldValue(`is_master`, e.target.checked);
                                                    }}
                                                    checked={formik.values.is_master}>
                                                    Chỉ số đặc biệt
                                                </Checkbox>
                                            </Col>
                                            <Col sm={4}>
                                                <Checkbox
                                                    disabled={noEdit}
                                                    onChange={e => {
                                                        formik.setFieldValue(`is_active`, e.target.checked);
                                                    }}
                                                    checked={formik.values.is_active}>
                                                    Kích hoạt
                                                </Checkbox>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} sm={12}>
                                        <FormGroup row>
                                            <Label for="brief_decs" sm={2}>
                                                Tóm tắt
                                                <span className="font-weight-bold red-text">*</span>
                                            </Label>
                                            <Col sm={10}>
                                                <Editor
                                                    apiKey={'3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku'}
                                                    scriptLoading={{
                                                        delay: 0,
                                                    }}
                                                    value={formik.values.brief_decs}
                                                    disabled={noEdit}
                                                    id="brief_decs"
                                                    init={{
                                                        height: '500px',
                                                        width: '100%',
                                                        menubar: false,
                                                        branding: false,
                                                        statusbar: false,
                                                        entity_encoding: 'raw',
                                                        plugins: [
                                                            'advlist autolink fullscreen lists link image charmap print preview anchor',
                                                            'searchreplace visualblocks code fullscreen ',
                                                            'insertdatetime media table paste code help',
                                                            'image imagetools ',
                                                            'toc',
                                                        ],
                                                        menubar: 'file edit view insert format tools table tc help',
                                                        toolbar1:
                                                            'undo redo | fullscreen | formatselect | bold italic underline strikethrough forecolor backcolor |fontselect |  fontsizeselect| \n' +
                                                            'alignleft aligncenter alignright alignjustify',
                                                        toolbar2:
                                                            'bullist numlist outdent indent | removeformat | help | image | toc',
                                                        file_picker_types: 'image',
                                                        relative_urls: false,
                                                        remove_script_host: false,
                                                        convert_urls: true,
                                                        images_dataimg_filter: function (img) {
                                                            return img.hasAttribute('internal-blob');
                                                        },
                                                        images_upload_handler: handleUploadImageShortDesc,
                                                    }}
                                                    onEditorChange={newValue => {
                                                        formik.setFieldValue('brief_decs', newValue);
                                                    }}
                                                />

                                                {formik.errors.brief_decs && formik.touched.brief_decs ? (
                                                    <div
                                                        className="field-validation-error alert alert-danger fade show"
                                                        role="alert">
                                                        {formik.errors.brief_decs}
                                                    </div>
                                                ) : null}
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} sm={12}>
                                        <FormGroup row>
                                            <Label for="decs" sm={2}>
                                                Mô tả
                                                <span className="font-weight-bold red-text">*</span>
                                            </Label>
                                            <Col sm={10}>
                                                <Editor
                                                    apiKey={'3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku'}
                                                    scriptLoading={{
                                                        delay: 0,
                                                    }}
                                                    id="decs"
                                                    value={formik.values.decs}
                                                    disabled={noEdit}
                                                    init={{
                                                        height: '600px',
                                                        width: '100%',
                                                        menubar: false,
                                                        branding: false,
                                                        entity_encoding: 'raw',
                                                        statusbar: false,
                                                        plugins: [
                                                            'advlist autolink fullscreen lists link image charmap print preview anchor',
                                                            'searchreplace visualblocks code fullscreen ',
                                                            'insertdatetime media table paste code help',
                                                            'image imagetools ',
                                                            'toc',
                                                        ],
                                                        menubar: 'file edit view insert format tools table tc help',
                                                        toolbar1:
                                                            'undo redo | fullscreen | formatselect | bold italic underline strikethrough forecolor backcolor |fontselect |  fontsizeselect| \n' +
                                                            'alignleft aligncenter alignright alignjustify',
                                                        toolbar2:
                                                            'bullist numlist outdent indent | removeformat | help | image | toc',
                                                        file_picker_types: 'image',
                                                        relative_urls: false,
                                                        remove_script_host: false,
                                                        convert_urls: true,
                                                        images_dataimg_filter: function (img) {
                                                            return img.hasAttribute('internal-blob');
                                                        },
                                                        images_upload_handler: handleUploadImageDesc,
                                                    }}
                                                    onEditorChange={newValue => {
                                                        formik.setFieldValue('decs', newValue);
                                                    }}
                                                />
                                                {formik.errors.decs && formik.touched.decs ? (
                                                    <div
                                                        className="field-validation-error alert alert-danger fade show"
                                                        role="alert">
                                                        {formik.errors.decs}
                                                    </div>
                                                ) : null}
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={12}>
                                        <FormGroup row>
                                            <Label for="note" sm={2}>
                                                Ghi chú
                                            </Label>
                                            <Col sm={10}>
                                                <Input
                                                    name="note"
                                                    id="note"
                                                    type="textarea"
                                                    placeholder="Ghi chú"
                                                    disabled={noEdit}
                                                    value={formik.values.note}
                                                    onChange={formik.handleChange}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} sm={12} className="text-right mb-2">
                                        {noEdit ? (
                                            <CheckAccess permission="FOR_INTERPRET_VIEW">
                                                <Button
                                                    color="primary"
                                                    className="mr-2 btn-block-sm"
                                                    onClick={() =>
                                                        window._$g.rdr(`/interpret/edit/${dataInterpret.interpret_id}`)
                                                    }>
                                                    <i className="fa fa-edit mr-1" />
                                                    Chỉnh sửa
                                                </Button>
                                            </CheckAccess>
                                        ) : (
                                            <>
                                                <CheckAccess
                                                    permission={id ? `FOR_INTERPRET_EDIT` : `FOR_INTERPRET_ADD`}>
                                                    <button
                                                        className="mr-2 btn-block-sm btn btn-primary"
                                                        onClick={() => {
                                                            setbtnType('save');
                                                        }}
                                                        type="submit"
                                                        disabled={formik.isSubmitting}>
                                                        <i className="fa fa-save mr-1" />
                                                        Lưu
                                                    </button>
                                                </CheckAccess>
                                                <CheckAccess
                                                    permission={id ? `FOR_INTERPRET_EDIT` : `FOR_INTERPRET_ADD`}>
                                                    <button
                                                        className="mr-2 btn-block-sm btn btn-success"
                                                        onClick={() => {
                                                            setbtnType('save_n_close');
                                                        }}
                                                        type="submit"
                                                        disabled={formik.isSubmitting}>
                                                        <i className="fa fa-save mr-1" />
                                                        Lưu và đóng
                                                    </button>
                                                </CheckAccess>
                                            </>
                                        )}
                                        <button
                                            className=" btn-block-sm btn btn-secondary"
                                            type="button"
                                            onClick={() => window._$g.rdr(`/interpret`)}>
                                            <i className="fa fa-times-circle mr-1" />
                                            Đóng
                                        </button>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default InterPretAdd;
