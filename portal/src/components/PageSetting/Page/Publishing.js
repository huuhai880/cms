import React, { PureComponent } from "react";
import { Formik } from 'formik';
import * as Yup from "yup";
import {
    Alert,
    Col,
    Row,
    Button,
    Form,
    FormGroup,
    Table
} from "reactstrap";
import {
    FormInput,
} from "@widget";

// Component(s)
import Loading from '../../Common/Loading';
import Publishing5W1H from './Publishing5W1H';
// Model(s)
import ConfigModel from '../../../models/ConfigModel';

/**
 * @class PublshingPage
 */
export default class PublshingPage extends PureComponent {

    /** @var {Object} */
    formikProps = null;

    constructor(props) {
        super(props);

        // Init model(s)
        this._configModel = new ConfigModel();

        // Bind method(s)
        this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
        this.handleFormikValidate = this.handleFormikValidate.bind(this);

        this.state = {
            _id: 0,
            alerts: [],
            ready: false,
            configEnt: null,
            item5W1HSelected: null,
            indexItem5W1HSelected: -1,
            isOpenModal: false
        };
    }

    componentDidMount() {
        (async () => {
            let {  configEnt } = this.state;
            let bundle = await this._getBundleData();
            if (bundle) configEnt = bundle;
            this.setState({ ...bundle, configEnt, ready: true});
        })();
    }

    formikValidationSchema = Yup.object().shape({
        PUBLISHING_TITLE: Yup.object().shape({
            value: Yup.string().required("Tiêu đề 'Nhà thiết kế sách thuê ngoài cho các đơn vị Xuất bản' là bắt buộc."),
        }),
        PUBLISHING_DESCRIPTION: Yup.object().shape({
            value: Yup.string().required("Mô tả 'Nhà thiết kế sách thuê ngoài cho các đơn vị Xuất bản' là bắt buộc."),
        }),
        PUBLISHING_SCC_TITLE: Yup.object().shape({
            value: Yup.string().required("Tiêu đề 'Các đơn vị Xuất bản đã đồng hành cùng SCC' là bắt buộc."),
        }),
        PUBLISHING_SCC_DESCRIPTION: Yup.object().shape({
            value: Yup.string().required("Mô tả 'Các đơn vị Xuất bản đã đồng hành cùng SCC' là bắt buộc."),
        }),
        PUBLISHING_5W1H_TITLE: Yup.object().shape({
            value: Yup.string().required("Tiêu đề '5W - 1H' là bắt buộc."),
        }),
        PUBLISHING_5W1H_LIST: Yup.object().shape({
            value: Yup.string().required("Nội dung '5W - 1H' là bắt buộc."),
        })
    });

    getInitialValues() {
        let values = Object.assign(
            {}, {
                PUBLISHING_TITLE: {
                value: "Nhà thiết kế sách thuê ngoài cho các đơn vị Xuất bản",
                data_type: 'string'
            },
            PUBLISHING_DESCRIPTION: {
                value: "Với giải pháp thuê ngoài, phòng thiết kế sách của chúng tôi giúp các đơn vị Xuất bản, những đơn vị đang kinh doanh sách bằng cách giải phóng phòng thiết kế của bạn. Đồng nghĩa với việc giảm tối đa chi phí và đảm bảo tối đa chất lượng.",
                data_type: 'string'
            },
            PUBLISHING_SCC_TITLE: {
                value: "Các đơn vị Xuất bản đã đồng hành cùng SCC",
                data_type: 'string'
            },
            PUBLISHING_SCC_DESCRIPTION: {
                value: "Giải pháp tự xuất bản sách của SCC giúp các trung tâm đào tạo (kinh doanh, Marketing, Anh ngữ, STEM...)",
                data_type: 'string'
            },
            PUBLISHING_5W1H_TITLE: {
                value: "5W - 1H",
                data_type: 'string'
            },
            PUBLISHING_5W1H_LIST: {
                value: [
                    {
                        title: 'What?',
                        image: '',
                        description: 'Chúng tôi tin tưởng vào các giá trị của sự đa dạng, công bằng và hòa nhập. Chúng tôi nhận ra rằng việc nắm giữ những niềm tin này là chưa đủ, do đó chúng tôi cam kết thực hiện hành động có chủ ý và hữu hình.'
                    },
                    {
                        title: 'Who?',
                        image: '',
                        description: 'Chúng tôi tin tưởng vào các giá trị của sự đa dạng, công bằng và hòa nhập. Chúng tôi nhận ra rằng việc nắm giữ những niềm tin này là chưa đủ, do đó chúng tôi cam kết thực hiện hành động có chủ ý và hữu hình.'
                    },
                    {
                        title: 'When?',
                        image: '',
                        description: 'Chúng tôi tin tưởng vào các giá trị của sự đa dạng, công bằng và hòa nhập. Chúng tôi nhận ra rằng việc nắm giữ những niềm tin này là chưa đủ, do đó chúng tôi cam kết thực hiện hành động có chủ ý và hữu hình.'
                    },
                    {
                        title: 'Why?',
                        image: '',
                        description: 'Chúng tôi tin tưởng vào các giá trị của sự đa dạng, công bằng và hòa nhập. Chúng tôi nhận ra rằng việc nắm giữ những niềm tin này là chưa đủ, do đó chúng tôi cam kết thực hiện hành động có chủ ý và hữu hình.'
                    },
                    {
                        title: 'Where?',
                        image: '',
                        description: 'Chúng tôi tin tưởng vào các giá trị của sự đa dạng, công bằng và hòa nhập. Chúng tôi nhận ra rằng việc nắm giữ những niềm tin này là chưa đủ, do đó chúng tôi cam kết thực hiện hành động có chủ ý và hữu hình.'
                    },
                    {
                        title: 'How?',
                        image: '',
                        description: 'Chúng tôi tin tưởng vào các giá trị của sự đa dạng, công bằng và hòa nhập. Chúng tôi nhận ra rằng việc nắm giữ những niềm tin này là chưa đủ, do đó chúng tôi cam kết thực hiện hành động có chủ ý và hữu hình.'
                    },
                ],
                data_type: 'json'
            },
        },
        );
        if (this.state.configEnt) {
            values = Object.assign(values, this.state.configEnt)
        }
        Object.keys(values).forEach(key => {
            if (null === values[key]) {
                values[key] = "";
            }
        });
        return values;
    }

    async _getBundleData() {
        let bundle = {};
        let all = [
            this._configModel.getPageConfig('PUBLISHING')
                .then(data => bundle = data)
        ];

        await Promise.all(all)
            .catch(err => window._$g.dialogs.alert(
                window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`)
            ));
        Object.keys(bundle).forEach((key) => {
            let data = bundle[key];
            let stateValue = this.state[key];
            if (data instanceof Array && stateValue instanceof Array) {
                data = [stateValue[0]].concat(data);
            }
            bundle[key] = data;
        });
        return bundle;
    }

    handleSubmit() {
        let { submitForm } = this.formikProps;
        return submitForm();
    }

    handleFormikValidate(values) {
        // Trim string values,...
        Object.keys(values).forEach(prop => {
            (typeof values[prop] === "string") && (values[prop] = values[prop].trim());
        });
        //.end
    }
    handleFormikSubmit(values, formProps) {
        let { setSubmitting } = formProps;
        let alerts = [];
        let apiCall = this._configModel.updatePageConfig('PUBLISHING', values);
        apiCall
            .then(data => { // OK
                window._$g.toastr.show('Cập nhật thành công!', 'success');
                return data;
            })
            .catch(apiData => { // NG
                let { errors, statusText, message } = apiData;
                let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join('<br/>');
                alerts.push({ color: "danger", msg });
            })
            .finally(() => {
                setSubmitting(false);
                this.setState(() => ({ alerts }), () => { window.scrollTo(0, 0); });
            })
            ;
    }

    // Sap xep lai cac item trong 5W1H
    handleSort5W1H = (type, item) => {
        let { values, handleChange } = this.formikProps;
        let { PUBLISHING_5W1H_LIST: { value } } = values;
        let nextIdx = null;
        let foundIdx = value.findIndex(_item => _item === item);
        if (foundIdx < 0) {
            return;
        }
        if ('up' === type) {
            nextIdx = Math.max(0, foundIdx - 1);
        }
        if ('down' === type) {
            nextIdx = Math.min(value.length - 1, foundIdx + 1);
        }
        if ((foundIdx !== nextIdx) && (null !== nextIdx)) {
            let _tempItem = value[foundIdx];
            value[foundIdx] = value[nextIdx];
            value[nextIdx] = _tempItem;
            handleChange({ target: { name: "PUBLISHING_5W1H_LIST.value", value } });
        }
    }

    //Xoa item 5W1H
    handleRemoveItem5W1H = (index) => {
        window._$g.dialogs.prompt(
            "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
            "Xóa",
            (confirm) => this.handleDelete(confirm, index)
        );
    }

    handleDelete(confirm, index) {
        let { values, handleChange } = this.formikProps;
        let { PUBLISHING_5W1H_LIST: { value } } = values;
        if(confirm){
            const cloneData = JSON.parse(JSON.stringify(value));
            cloneData.splice(index, 1);
            handleChange({ target: { name: "PUBLISHING_5W1H_LIST", value: {value: cloneData, data_type: 'json'} } });
        }
      }

    handleAddItem5W1H = () => {
        this.setState({isOpenModal : true})
    }

    handleEditItem5W1H = (item, index) => {
        this.setState({
            item5W1HSelected: item,
            indexItem5W1HSelected: index
        }, () => {
            this.setState({isOpenModal: true})
        })
    }

    handleCreateOrUpdateItem = (item, index) => {
        this.setState({
            isOpenModal: false
        }, () => {
            let { values, handleChange } = this.formikProps;
            let { PUBLISHING_5W1H_LIST: { value } } = values;
            let cloneData = JSON.parse(JSON.stringify(value));
            if(index >=0){
                cloneData[index] = item;
            }
            else{ 
                cloneData.push(item);
            }
            handleChange({ target: { name: "PUBLISHING_5W1H_LIST", value: {value: cloneData, data_type: 'json'} } });
            this.setState({
                item5W1HSelected: null,
                indexItem5W1HSelected: -1
            })
        })
    }

    handleClosePublishing5W1H = () => {
        this.setState({isOpenModal: false, item5W1HSelected: null})
    }

    render() {
        let {
            _id,
            ready,
            alerts,
            isOpenModal,
            item5W1HSelected,
            indexItem5W1HSelected
        } = this.state;
        let { noEdit } = this.props;
        let initialValues = this.getInitialValues();

        // Ready?
        if (!ready) {
            return <Loading />;
        }

        return (
            <div key={`view-${_id}`} className="animated fadeIn">
                <Row className="d-flex justify-content-center">
                    <Col xs={12}>
                        {alerts.map(({ color, msg }, idx) => {
                            return (
                                <Alert
                                    key={`alert-${idx}`}
                                    color={color}
                                    isOpen={true}
                                    toggle={() => this.setState({ alerts: [] })}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: msg }} />
                                </Alert>
                            );
                        })}
                        <Formik
                            initialValues={initialValues}
                            validationSchema={this.formikValidationSchema}
                            validate={this.handleFormikValidate}
                            onSubmit={this.handleFormikSubmit}
                        >
                            {formikProps => {

                                let {
                                    handleSubmit,
                                    handleReset,
                                    isSubmitting,
                                    values
                                } = (this.formikProps = window._formikProps = formikProps);
                                // Render
                                return (
                                    <Form
                                        id="form1st"
                                        onSubmit={handleSubmit}
                                        onReset={handleReset}
                                    >
                                        <Row className="d-flex justify-content-center">
                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">Nhà thiết kế sách thuê ngoài cho các đơn vị Xuất bản</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="PUBLISHING_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="PUBLISHING_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">Các đơn vị Xuất bản đã đồng hành cùng SCC</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="PUBLISHING_SCC_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                            <FormInput
                                                                label="Mô tả ngắn gọn"
                                                                type="textarea"
                                                                name="PUBLISHING_SCC_DESCRIPTION.value"
                                                                isEdit={!noEdit}
                                                                labelSm={3}
                                                                inputSm={9}
                                                                inputClassName="home-page_textarea"
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <Col sm={6} xs={12}>
                                                                <b className="title_page_h1 text-primary underline">5W-1H</b>
                                                            </Col>
                                                            <Col sm={6} xs={12} className="text-right">
                                                                <Button
                                                                    className="btn-sm"
                                                                    onClick={e => this.handleAddItem5W1H(e)}
                                                                    color="secondary">
                                                                    <i className="fa fa-plus mr-2" />
                                                                    Thêm
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Table bordered>
                                                            <thead >
                                                                <tr>
                                                                    <th style={{ width: '100px', minWidth: '100px' }}><i className="fa fa-list" /></th>
                                                                    <th style={{ width: '85px', minWidth: '75px' }}>Thứ tự</th>
                                                                    <th style={{ width: 120 }}>Hình ảnh/Icon</th>
                                                                    <th style={{ width: 120 }}>Tiêu đề</th>
                                                                    <th>Mô tả ngắn</th>
                                                                    <th style={{ width: 80 }}>Thao tác</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    values.PUBLISHING_5W1H_LIST &&
                                                                        values.PUBLISHING_5W1H_LIST.value &&
                                                                        values.PUBLISHING_5W1H_LIST.value.length ?
                                                                        values.PUBLISHING_5W1H_LIST.value.map((item, index) => (
                                                                            <tr key={index}>
                                                                                <td style={{ width: 100 }}>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        color="primary"
                                                                                        className="mr-1"
                                                                                        disabled={(0 === index) || noEdit}
                                                                                        onClick={(evt) => this.handleSort5W1H('up', item, evt)}
                                                                                    >
                                                                                        <i className="fa fa-arrow-up" />
                                                                                    </Button>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        color="success"
                                                                                        disabled={((values.PUBLISHING_5W1H_LIST.value.length - 1) === index) || noEdit}
                                                                                        onClick={(evt) => this.handleSort5W1H('down', item, evt)}
                                                                                    >
                                                                                        <i className="fa fa-arrow-down" />
                                                                                    </Button>
                                                                                </td>
                                                                                <td className="text-center">{index + 1}</td>
                                                                                <td style={{ width: 100 }}>
                                                                                    {
                                                                                        item.image ? <img src={item.image} style={{ height: 50, objectFit: 'contain' }} /> : null
                                                                                    }
                                                                                </td>
                                                                                <td>{item.title || ''}</td>
                                                                                <td>{item.description || ''}</td>
                                                                                <td className="text-center">
                                                                                    <Button
                                                                                        color="primary"
                                                                                        title="Chỉnh sửa"
                                                                                        style={{ width: 24, height: 24, padding: 0 }}
                                                                                        onClick={e => this.handleEditItem5W1H(item, index)}
                                                                                        className="mr-1">
                                                                                        <i className="fa fa-edit" />
                                                                                    </Button>
                                                                                    <Button
                                                                                        color="danger"
                                                                                        style={{ width: 24, height: 24, padding: 0 }}
                                                                                        onClick={e => this.handleRemoveItem5W1H(index)}
                                                                                        title="Xóa">
                                                                                        <i className="fa fa-minus-circle" />
                                                                                    </Button>
                                                                                </td>
                                                                            </tr>
                                                                        )) : null
                                                                }
                                                            </tbody>
                                                        </Table>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12}>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <FormGroup row>
                                                            <Col sm={12} className="text-right">
                                                                <Button key="buttonSave" type="submit" color="primary" disabled={isSubmitting} onClick={() => this.handleSubmit('save')} className="mr-2 btn-block-sm">
                                                                    <i className="fa fa-save mr-2" />Cập nhật
                                                                </Button>
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Form>
                                );
                            }}</Formik>
                    </Col>
                </Row>
                {
                    isOpenModal && <Publishing5W1H 
                        item={item5W1HSelected} 
                        index={indexItem5W1HSelected}
                        handleCreateOrUpdateItem={this.handleCreateOrUpdateItem} 
                        handleClosePublishing5W1H={this.handleClosePublishing5W1H} />
                }
            </div>
        );
    }
}
