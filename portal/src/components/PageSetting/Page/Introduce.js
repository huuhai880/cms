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
    FormRichEditor,
    UploadImage
} from "@widget";

// Component(s)
import Loading from '../../Common/Loading';
import IntroduceFounder from './IntroduceFounder';
// Model(s)
import ConfigModel from '../../../models/ConfigModel';

/**
 * @class IntroducePage
 */
export default class IntroducePage extends PureComponent {

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
            visionImage: "",
            clearVisionImage: false,
            pureValueImage: "",
            clearPureValueImage: false,
            configEnt: null,
            founderSelected: null,
            indexFounderSelected: -1,
            isOpenModal: false
        };
    }

    componentDidMount() {
        (async () => {
            let {  visionImage= "", pureValueImage= "", configEnt} = this.state;
            let bundle = await this._getBundleData();
            if(bundle['INTRODUCE_VISION_IMAGE']) visionImage = bundle["INTRODUCE_VISION_IMAGE"] ? bundle["INTRODUCE_VISION_IMAGE"].value : null ;
            if(bundle['INTRODUCE_PUREVALUE_IMAGE']) pureValueImage = bundle["INTRODUCE_PUREVALUE_IMAGE"] ? bundle["INTRODUCE_PUREVALUE_IMAGE"].value : null;
            if(bundle) configEnt = bundle;
            this.setState({ ...bundle, configEnt, ready: true , visionImage, pureValueImage});
        })();
    }

    formikValidationSchema = Yup.object().shape({
        INTRODUCE_TITLE: Yup.object().shape({
            value: Yup.string().required("Tiêu đề là bắt buộc."),
        }),
        INTRODUCE_DESCRIPTION:  Yup.object().shape({
            value:  Yup.string().required("Mô tả ngắn là bắt buộc."),
        }),
        INTRODUCE_VISION_TITLE:  Yup.object().shape({
            value: Yup.string().required("Tiêu đề 'Tầm nhìn-Sứ mệnh' là bắt buộc."),
        }),
        INTRODUCE_VISION_IMAGE:  Yup.object().shape({
            value: Yup.string().required("Hình ảnh 'Tầm nhìn-Sứ mệnh' là bắt buộc."),
        }),
        INTRODUCE_VISION_DESCRIPTION:  Yup.object().shape({
            value: Yup.string().required("Nội dung 'Tầm nhìn-Sứ mệnh' là bắt buộc."),
        }),
        INTRODUCE_PUREVALUE_TITLE:  Yup.object().shape({
            value: Yup.string().required("Tiêu đề 'Giá trị cốt lõi' là bắt buộc."),
        }),
        INTRODUCE_PUREVALUE_IMAGE:  Yup.object().shape({
            value: Yup.string().required("Hình ảnh 'Giá trị cốt lõi' là bắt buộc."),
        }),
        INTRODUCE_PUREVALUE_DESCRIPTION:  Yup.object().shape({
            value: Yup.string().required("Nội dung 'Giá trị cốt lõi' là bắt buộc."),
        }),
        INTRODUCE_FOUNDING_TEAM_LIST: Yup.object().shape({
            value: Yup.string().required("Đội ngũ sáng lập là bắt buộc."),
        })
    });

    getInitialValues() {
        let values = Object.assign(
            {}, {
                INTRODUCE_TITLE: {
                    value: "BẢO TÀNG TRI THỨC DI ĐỘNG",
                    data_type: 'string'
                },
                INTRODUCE_DESCRIPTION: {
                    value: "Khi chết bạn không mang theo được tiền bạc, vật chất… Nhưng bạn lại mang theo thứ mà nên để lại, đó là tri thức! Thứ mà cả đời bạn lăn lộn để có được. Tri thức của bạn cần một nơi “quy hoạch”, “bảo tồn” để lan toả giá trị cho thế hệ sau, đó chính là “Bảo tàng Tri thức Di động”.",
                    data_type: 'string'
                },
                INTRODUCE_VISION_TITLE: {
                    value: "Tầm nhìn - Sứ mệnh",
                    data_type: 'string'
                },
                INTRODUCE_VISION_DESCRIPTION:{
                    value:  `<p>Trở thành người bạn đồng hàng đáng<b class="text-gray-200 font-bold"> tin cậy</b> , trên hành trình lan toả<b class="text-gray-200 font-bold"> tri thức Việt</b> của các<b class="text-gray-200 font-bold"> cá nhân, tổ chức.</b></p>`,
                    data_type: 'string'
                },
                INTRODUCE_VISION_IMAGE: {
                    value: "",
                    data_type: 'image'
                },
                INTRODUCE_PUREVALUE_TITLE: {
                    value: "Giá trị cốt lõi",
                    data_type: 'string'
                },
                INTRODUCE_PUREVALUE_DESCRIPTION: {
                    value:  `<p><b class="text-gray-300 font-bold"># Dũng cảm</b> để dám<b class="text-gray-300 font-bold"> nghĩ</b>, dám<b class="text-gray-300 font-bold"> làm</b>, dám<b class="text-gray-300 font-bold"> tiên phong</b>.</p>`,
                    data_type: 'string'
                },
                INTRODUCE_PUREVALUE_IMAGE: {
                    value: "",
                    data_type: 'image'
                },
                INTRODUCE_FOUNDING_TEAM_LIST: {
                    value: [
                        {
                            name: 'Mr. Lê Đọp',
                            image: '',
                            note: 'Nỗi đau lớn nhất của các bậc trí thức là không có nơi nào ghi nhận và công nhận họ cũng như cùng họ lan toả giá trị cho các thế hệ. Nơi này sẽ giải quyết nỗi đau đó.'
                        },
                        {
                            name: 'Mr. Mã Thanh Danh',
                            image: '',
                            note: 'Nỗi đau lớn nhất của các bậc trí thức là không có nơi nào ghi nhận và công nhận họ cũng như cùng họ lan toả giá trị cho các thế hệ. Nơi này sẽ giải quyết nỗi đau đó.'
                        },
                        {
                            name: 'Mrs. Võ Thị Phương Thảo',
                            image: '',
                            note: 'Nỗi đau lớn nhất của các bậc trí thức là không có nơi nào ghi nhận và công nhận họ cũng như cùng họ lan toả giá trị cho các thế hệ. Nơi này sẽ giải quyết nỗi đau đó.'
                        },
                    ],
                    data_type: 'json'
                },
            },
        );
        if(this.state.configEnt){
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
            this._configModel.getPageConfig('INTRODUCE')
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
        let apiCall = this._configModel.updatePageConfig('INTRODUCE', values);
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
            });
    }

    // Sap xep lai cac item trong 5W1H
    handleSortFDTeam = (type, item) => {
        let { values, handleChange } = this.formikProps;
        let { INTRODUCE_FOUNDING_TEAM_LIST: { value } } = values;
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
            handleChange({ target: { name: "INTRODUCE_FOUNDING_TEAM_LIST.value", value } });
        }
    }

    //Xoa item 
    handleRemoveItem = (index) => {
        window._$g.dialogs.prompt(
            "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
            "Xóa",
            (confirm) => this.handleDelete(confirm, index)
        );
    }

    handleDelete(confirm, index) {
        let { values, handleChange } = this.formikProps;
        let { INTRODUCE_FOUNDING_TEAM_LIST: { value } } = values;
        if(confirm){
            const cloneData = JSON.parse(JSON.stringify(value));
            cloneData.splice(index, 1);
            handleChange({ target: { name: "INTRODUCE_FOUNDING_TEAM_LIST", value: {value: cloneData, data_type: 'json'} } });
        }
      }

    handleAddItem = () => {
        this.setState({isOpenModal : true})
    }

    handleEditItem = (item, index) => {
        this.setState({
            founderSelected: item,
            indexFounderSelected: index
        }, () => {
            this.setState({isOpenModal: true})
        })
    }

    handleCreateOrUpdateItem = (item, index) => {
        this.setState({
            isOpenModal: false
        }, () => {
            let { values, handleChange } = this.formikProps;
            let { INTRODUCE_FOUNDING_TEAM_LIST: { value } } = values;
            let cloneData = JSON.parse(JSON.stringify(value));
            if(index >=0){
                cloneData[index] = item;
            }
            else{ 
                cloneData.push(item);
            }
            handleChange({ target: { name: "INTRODUCE_FOUNDING_TEAM_LIST", value: {value: cloneData, data_type: 'json'} } });
            this.setState({
                founderSelected: null,
                indexFounderSelected: -1
            })
        })
    }

    handleCloseIntroduceFounder = () => {
        this.setState({isOpenModal: false, founderSelected: null})
    }


    render() {
        let {
            _id,
            ready,
            alerts,
            visionImage,
            clearVisionImage,
            pureValueImage,
            clearPureValueImage,
            indexFounderSelected,
            founderSelected,
            isOpenModal
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
                                    values,
                                    errors,
                                    handleSubmit,
                                    handleReset,
                                    isSubmitting
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
                                                <Col xs={12}>
                                                    <Row>
                                                        <Col xs={8} className="mx-auto">
                                                            <Row>
                                                                <FormInput
                                                                    label="Tiêu đề"
                                                                    name="INTRODUCE_TITLE.value"
                                                                    labelSm={3}
                                                                    inputSm={9}
                                                                    isEdit={!noEdit}
                                                                />
                                                                <FormInput
                                                                    label="Mô tả ngắn gọn"
                                                                    type="textarea"
                                                                    name="INTRODUCE_DESCRIPTION.value"
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
                                                                    <b className="title_page_h1 text-primary underline">Độ ngũ sáng lập</b>
                                                                </Col>
                                                                <Col sm={6} xs={12} className="text-right">
                                                                    <Button
                                                                        className="btn-sm"
                                                                        onClick={e => this.handleAddItem(e)}
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
                                                                        <th style={{ width: 120 }}>Họ tên</th>
                                                                        <th style={{ width: 150 }}>Hình ảnh đại diện</th>
                                                                        <th>Trích dẫn</th>
                                                                        <th style={{ width: 80 }}>Thao tác</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        values.INTRODUCE_FOUNDING_TEAM_LIST &&
                                                                            values.INTRODUCE_FOUNDING_TEAM_LIST.value &&
                                                                            values.INTRODUCE_FOUNDING_TEAM_LIST.value.length ?
                                                                            values.INTRODUCE_FOUNDING_TEAM_LIST.value.map((item, index) => (
                                                                                <tr key={index}>
                                                                                    <td style={{ width: 100 }}>
                                                                                        <Button
                                                                                            size="sm"
                                                                                            color="primary"
                                                                                            className="mr-1"
                                                                                            disabled={(0 === index) || noEdit}
                                                                                            onClick={(evt) => this.handleSortFDTeam('up', item, evt)}
                                                                                        >
                                                                                            <i className="fa fa-arrow-up" />
                                                                                        </Button>
                                                                                        <Button
                                                                                            size="sm"
                                                                                            color="success"
                                                                                            disabled={((values.INTRODUCE_FOUNDING_TEAM_LIST.value.length - 1) === index) || noEdit}
                                                                                            onClick={(evt) => this.handleSortFDTeam('down', item, evt)}
                                                                                        >
                                                                                            <i className="fa fa-arrow-down" />
                                                                                        </Button>
                                                                                    </td>
                                                                                    <td className="text-center">{index + 1}</td>
                                                                                    <td className="text-left">{item.name}</td>
                                                                                    <td style={{ width: 100 }}>
                                                                                        {
                                                                                            item.image ? <img src={item.image} style={{ height: 150, objectFit: 'contain' }} /> : null
                                                                                        }
                                                                                    </td>
                                                                                    <td className="text-left">{item.note}</td>
                                                                                    <td className="text-center">
                                                                                        <Button
                                                                                            color="primary"
                                                                                            title="Chỉnh sửa"
                                                                                            style={{ width: 24, height: 24, padding: 0 }}
                                                                                            onClick={e => this.handleEditItem(item, index)}
                                                                                            className="mr-1">
                                                                                            <i className="fa fa-edit" />
                                                                                        </Button>
                                                                                        <Button
                                                                                            color="danger"
                                                                                            style={{ width: 24, height: 24, padding: 0 }}
                                                                                            onClick={e => this.handleRemoveItem(index)}
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
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">Tầm nhìn sứ mệnh</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="INTRODUCE_VISION_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                             <UploadImage
                                                                urlImageEdit={visionImage}
                                                                clearImage={clearVisionImage}
                                                                isEdit={!noEdit}
                                                                name="INTRODUCE_VISION_IMAGE.value"
                                                                title="Ảnh Tầm nhìn sứ mệnh"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 1500x1000 px '}
                                                            />
                                                            <FormRichEditor
                                                                label="Nội dung"
                                                                isEdit={!noEdit}
                                                                name="INTRODUCE_VISION_DESCRIPTION.value"
                                                                formikProps={formikProps}
                                                                content={values.INTRODUCE_VISION_DESCRIPTION.value}
                                                                isHorizontal={true}
                                                                inputSm={9}
                                                                labelSm={3}
                                                                textColor=""
                                                                />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                </Col>
                                                <Col xs={12}>
                                                <Row className="mb-4">
                                                    <Col xs={8} className="mx-auto">
                                                        <b className="title_page_h1 text-primary underline">Giá trị cốt lõi</b>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={8} className="mx-auto">
                                                        <Row>
                                                            <FormInput
                                                                label="Tiêu đề"
                                                                name="INTRODUCE_PUREVALUE_TITLE.value"
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isEdit={!noEdit}
                                                            />
                                                             <UploadImage
                                                                urlImageEdit={pureValueImage}
                                                                clearImage={clearPureValueImage}
                                                                isEdit={!noEdit}
                                                                name="INTRODUCE_PUREVALUE_IMAGE.value"
                                                                title="Ảnh Giá trị cốt lõi"
                                                                isHorizontal={true}
                                                                textColor=""
                                                                labelSm={3}
                                                                inputSm={9}
                                                                isBoldLabel={false}
                                                                dropzoneText={'Ưu tiên ảnh có kích thước 1500x1000 px '}
                                                            />
                                                            <FormRichEditor
                                                                label="Nội dung"
                                                                isEdit={!noEdit}
                                                                name="INTRODUCE_PUREVALUE_DESCRIPTION.value"
                                                                formikProps={formikProps}
                                                                content={values.INTRODUCE_PUREVALUE_DESCRIPTION.value}
                                                                inputSm={9}
                                                                labelSm={3}
                                                                textColor=""
                                                                />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                </Col>
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
                    isOpenModal && <IntroduceFounder 
                        item={founderSelected} 
                        index={indexFounderSelected}
                        handleCreateOrUpdateItem={this.handleCreateOrUpdateItem} 
                        handleCloseIntroduceFounder={this.handleCloseIntroduceFounder} />
                }
            </div>
        );
    }
}
