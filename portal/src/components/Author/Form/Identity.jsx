import React from "react";
import { Field } from 'formik';
import {
    Col,
    Row,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import moment from "moment";

// Component(s)
import DatePicker from '../Common/DatePicker';

// Util(s)
import { readFileAsBase64 } from '../../utils/html';
// Model(s)
import AuthorModel from "../../models/AuthorModel";
import NewsCategoryModel from '../../models/NewsCategoryModel';
import { DropzoneArea } from 'material-ui-dropzone'



export default class AuthorIdentity extends React.PureComponent {


    handleRemoveBackPicture = (idx = 0) => {
        let { values, setValues } = this.props;
        let identity_back_image = null;
        setValues(Object.assign(values, { "identity_back_image": identity_back_image }));
        this.setState({ urlImageBackEdit: identity_back_image })
    }

    handleRemoveFrontPicture = (idx = 0) => {
        let { values, setValues } = this.props;
        let identity_front_image = null;
        setValues(Object.assign(values, { "identity_front_image": identity_front_image }));
        this.setState({ urlImageFrontEdit: identity_front_image })
    }

    onDropImage(files, field) {
        const reader = new FileReader();
        reader.readAsDataURL(files);
        reader.onload = (event) => {
            field.onChange({
                target: { type: "text", name: field.name, value: event.target.result }
            })
        };
    }

    render() {
        return (
            <>
                <Row className="mb15">
                    <Col xs={12}>
                        <b className="underline">Chứng minh nhân dân/ Thẻ căn cước</b>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6}>
                        <FormGroup row>
                            <Label for="identity_number" sm={4}>
                                Số CMND/ Thẻ căn cước
                                </Label>
                            <Col sm={8}>
                                <Field
                                    name="identity_number"
                                    render={({ field /* _form */ }) => <Input
                                        {...field}
                                        onBlur={null}
                                        type="text"
                                        name="identity_number"
                                        id="identity_number"
                                        placeholder=""
                                        disabled={noEdit}
                                    />}
                                />
                                {/* <ErrorMessage name="identity_number" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} /> */}
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={6}>
                        <FormGroup row>
                            <Label for="identity_date" sm={4}>
                                Ngày cấp
                                </Label>
                            <Col sm={8}>
                                <Field
                                    name="identity_date"
                                    render={({
                                        date,
                                        form: { setFieldValue, setFieldTouched, values },
                                        field,
                                        ...props
                                    }) => {
                                        return (
                                            <DatePicker
                                                id="identity_date"
                                                date={values.identity_date ? moment(values.identity_date) : null}
                                                onDateChange={date => {
                                                    setFieldValue('identity_date', date)
                                                }}
                                                renderMonthElement
                                                disabled={noEdit}
                                                autoUpdateInput
                                            // maxToday
                                            />
                                        )
                                    }}
                                />
                                {/* <ErrorMessage name="identity_date" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} /> */}
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12}>
                        <FormGroup row>
                            <Label for="identity_place" sm={2}>
                                Nơi cấp
                                </Label>
                            <Col sm={10}>
                                <Field
                                    name="identity_place"
                                    render={({ field /* _form */ }) => <Input
                                        {...field}
                                        onBlur={null}
                                        type="text"
                                        name="identity_place"
                                        id="identity_place"
                                        placeholder=""
                                        disabled={noEdit}
                                    />}
                                />
                                {/* <ErrorMessage name="identity_place" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} /> */}
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={2}>
                        <FormGroup row>
                            <Label sm={12}> Ảnh CMND / Thẻ căn cước</Label>
                        </FormGroup>
                    </Col>

                    <Col xs={12} sm={10}>
                        <FormGroup row>
                            <Col xs={12} sm={6}>
                                <FormGroup row>
                                    {/* <Label sm={4}></Label> */}
                                    <Col xs={12} sm={12}>
                                        <Col xs={12} sm={12}>
                                            <FormGroup row>
                                                <Label sm={12} className="text-center" htmlFor="identity_front_image"> Ảnh mặt trước</Label>
                                            </FormGroup>
                                        </Col>
                                        {
                                            !this.state.clearImageFront &&
                                            <Field
                                                name="identity_front_image"
                                                render={({ field }) => {
                                                    // render image edit
                                                    if (this.state.urlImageFrontEdit) {
                                                        return <div className="tl-render-image">
                                                            <img src={this.state.urlImageFrontEdit} alt="images" />
                                                            {
                                                                !noEdit ?
                                                                    <button
                                                                        // onClick={() => this.setState({ urlImageFrontEdit: "" })} 
                                                                        onClick={() => this.handleRemoveFrontPicture()}
                                                                    >
                                                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                                                    </button> : null
                                                            }
                                                        </div>
                                                    }

                                                    return <div className="tl-drop-image">
                                                        <DropzoneArea
                                                            {...field}
                                                            id="identity_front_image"
                                                            acceptedFiles={['image/*']}
                                                            filesLimit={1}
                                                            dropzoneText=""
                                                            disabled={noEdit}
                                                            onDrop={(files) => this.onDropImage(files, field)}
                                                            onDelete={() => field.onChange({
                                                                target: { type: "text", name: field.name, value: "" }
                                                            })}
                                                        >
                                                        </DropzoneArea>
                                                    </div>
                                                }}
                                            />
                                        }
                                        {/* <ErrorMessage name="identity_front_image" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} /> */}
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col xs={12} sm={6}>
                                <FormGroup row>
                                    <Col xs={12} sm={12}>
                                        <Col xs={12} sm={12}>
                                            <FormGroup row>
                                                <Label sm={12} className="text-center" htmlFor="identity_front_image"> Ảnh mặt sau</Label>
                                            </FormGroup>
                                        </Col>
                                        {
                                            !this.state.clearImageBack &&
                                            <Field
                                                name="identity_front_image"
                                                render={({ field }) => {
                                                    // render image edit
                                                    if (this.state.urlImageBackEdit) {
                                                        return <div className="tl-render-image">
                                                            <img src={this.state.urlImageBackEdit} alt="images" />
                                                            {
                                                                // !noEdit ?
                                                                <button
                                                                    // onClick={() => this.setState({ urlImageBackEdit: '' })} 
                                                                    onClick={() => this.handleRemoveBackPicture()}
                                                                >
                                                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                                                </button>
                                                                // : null
                                                            }
                                                        </div>
                                                    }

                                                    return <div className="tl-drop-image">
                                                        <DropzoneArea
                                                            {...field}
                                                            id="identity_front_image"
                                                            acceptedFiles={['image/*']}
                                                            filesLimit={1}
                                                            dropzoneText=""
                                                            disabled={noEdit}
                                                            onDrop={(files) => this.onDropImage(files, field)}
                                                            onDelete={() => field.onChange({
                                                                target: { type: "text", name: field.name, value: "" }
                                                            })}
                                                        >
                                                        </DropzoneArea>
                                                    </div>
                                                }}
                                            />
                                        }
                                        {/* <ErrorMessage name="identity_back_image" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} /> */}
                                    </Col>
                                </FormGroup>
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
            </>
        )
    }
}