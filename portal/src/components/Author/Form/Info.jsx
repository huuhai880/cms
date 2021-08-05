import React from 'react';
import { Field, ErrorMessage } from 'formik';
import {
  Alert,
  Col,
  Row,
  Button,
  FormGroup,
  Label,
  Input,
  Media,
  InputGroup,
  InputGroupAddon,
  // InputGroupText,
  Table
} from "reactstrap";
import moment from "moment";

// Component(s)
import DatePicker from '../Common/DatePicker';


export default class AuthorInfo extends React.PureComponent {
    render() {
        return (
            <>
                <Row>
                    <Col xs={12} sm={6}>
                        <FormGroup row>
                            <Label for="author_name" sm={4}>
                                ID tác giả<span className="font-weight-bold red-text">*</span>
                            </Label>
                            <Col sm={8}>
                                <Field
                                    name="author_name"
                                    render={({ field /* _form */ }) => <Input
                                        {...field}
                                        readOnly={true}
                                        onBlur={null}
                                        type="text"
                                        name="author_name"
                                        id="author_name"
                                        placeholder="ASCC00001"
                                        disabled={noEdit}
                                    />}
                                />
                                <ErrorMessage name="author_name" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={6}>
                        <FormGroup row hidden={!!authorEnt} className={`${authorEnt ? 'hidden' : ''}`}>
                            <Label for="Password" sm={4}>
                                Mật khẩu<span className="font-weight-bold red-text">*</span>
                            </Label>
                            <Col sm={8}>
                                <InputGroup>
                                    <Field
                                        name="password"
                                        render={({ field /* _form */ }) => <Input
                                            {...field}
                                            onBlur={null}
                                            type={`${this.state.passwordVisible ? 'text' : 'password'}`}
                                            name="password"
                                            id="password"
                                            placeholder="******"
                                            disabled={noEdit}
                                        />}
                                    />
                                    <InputGroupAddon addonType="append">
                                        <Button block onClick={() => {
                                            let { passwordVisible } = this.state;
                                            this.setState({ passwordVisible: !passwordVisible });
                                        }}>
                                            <i className={`fa ${this.state.passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                                <ErrorMessage name="password" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6}>
                        <FormGroup row>
                            <Label for="first_name" sm={4}>
                                Họ<span className="font-weight-bold red-text">*</span>
                            </Label>
                            <Col sm={8}>
                                <Field
                                    name="first_name"
                                    render={({ field /* _form */ }) => <Input
                                        {...field}
                                        onBlur={null}
                                        type="text"
                                        name="first_name"
                                        id="first_name"
                                        placeholder=""
                                        disabled={noEdit}
                                    />}
                                />
                                <ErrorMessage name="first_name" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={6}>
                        <FormGroup row>
                            <Label for="last_name" sm={4}>
                                Tên<span className="font-weight-bold red-text">*</span>
                            </Label>
                            <Col sm={8}>
                                <Field
                                    name="last_name"
                                    render={({ field /* _form */ }) => <Input
                                        {...field}
                                        onBlur={null}
                                        type="text"
                                        name="last_name"
                                        id="last_name"
                                        placeholder=""
                                        disabled={noEdit}
                                    />}
                                />
                                <ErrorMessage name="last_name" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6}>
                        <FormGroup row>
                            <Label for="gender_1" sm={4}>
                                Giới tính<span className="font-weight-bold red-text">*</span>
                            </Label>
                            <Col sm={8}>
                                <Row>
                                    {genders.map(({ name, id }, idx) => {
                                        return (
                                            <Col xs={4} key={`gender-${idx}`}>
                                                <FormGroup check>
                                                    <Label check>
                                                        <Field
                                                            name="gender"
                                                            render={({ field /* _form */ }) => <Input
                                                                {...field}
                                                                onBlur={null}
                                                                value={id}
                                                                type="radio"
                                                                checked={(1 * values.gender) === (1 * id)}
                                                                id={`gender_${id}`}
                                                                disabled={noEdit}
                                                            />}
                                                        /> {name}
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                        );
                                    })}
                                    <ErrorMessage name="gender" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                                </Row>
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={6}>
                        <FormGroup row>
                            <Label for="email" sm={4}>
                                Email<span className="font-weight-bold red-text">*</span>
                            </Label>
                            <Col sm={8}>
                                <Field
                                    name="email"
                                    render={({ field /* _form */ }) => <Input
                                        {...field}
                                        onBlur={null}
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="employee.0001@company.com"
                                        disabled={noEdit}
                                    />}
                                />
                                <ErrorMessage name="email" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6}>
                        <FormGroup row>
                            <Label for="birthday" sm={4}>
                                Ngày sinh<span className="font-weight-bold red-text">*</span>
                            </Label>
                            <Col sm={8}>
                                <Field
                                    name="birthday"
                                    render={({
                                        date,
                                        form: { setFieldValue, setFieldTouched, values },
                                        field,
                                        ...props
                                    }) => {
                                        return (
                                            <DatePicker
                                                id="birthday"
                                                date={values.birthday ? moment(values.birthday) : null}
                                                onDateChange={date => {
                                                    setFieldValue('birthday', date)
                                                }}
                                                renderMonthElement
                                                disabled={noEdit}
                                                maxToday
                                            />
                                        )
                                    }}
                                />
                                <ErrorMessage name="birthday" component={({ children }) => {
                                    return < Alert color="danger" className="field-validation-error" > {children}</Alert>
                                }} />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={6}>
                        <FormGroup row>
                            <Label for="phone_number" sm={4}>
                                Điện thoại<span className="font-weight-bold red-text">*</span>
                            </Label>
                            <Col sm={8}>
                                <Field
                                    name="phone_number"
                                    render={({ field /* _form */ }) => <Input
                                        {...field}
                                        onBlur={null}
                                        type="text"
                                        name="phone_number"
                                        id="phone_number"
                                        min={0}
                                        minLength={10}
                                        maxLength={11}
                                        placeholder="0777777777"
                                        disabled={noEdit}
                                    />}
                                />
                                <ErrorMessage name="phone_number" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <FormGroup row>
                            <Label for="about_me" sm={2}>
                                Giới thiệu sơ lược
                                </Label>
                            <Col sm={10}>
                                <Field
                                    name="about_me"
                                    render={({ field /* _form */ }) => <Input
                                        {...field}
                                        onBlur={null}
                                        type="textarea"
                                        name="about_me"
                                        id="about_me"
                                        disabled={noEdit}
                                    />}
                                />
                                <ErrorMessage name="about_me" component={({ children }) => <Alert color="danger" className="field-validation-error">{children}</Alert>} />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
            </>
        )
    }
}