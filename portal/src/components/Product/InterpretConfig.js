import React, { useEffect, useState } from 'react';
import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Button,
    Table,
    CustomInput,
    FormGroup,
    Label,
    Input,
    Form,
    Modal,
    ModalBody,
} from "reactstrap";
import { Checkbox } from 'antd';

function InterpretConfig({ handleClose, attributeGroup = null, handleSubmit }) {
    const [attributeGroupConfig, setAttributeGroupConfig] = useState(attributeGroup)
    const [msgError, setMsgError] = useState(null);

    const handleChangeInterpretConfig = (name, value, index) => {
        let attributeGroupConfigCL = { ...attributeGroupConfig };
        attributeGroupConfigCL.interprets[index][name] = value;
        if(name == 'is_show_search_result' && value){
            attributeGroupConfigCL.interprets[index]['text_url'] = null;
            attributeGroupConfigCL.interprets[index]['url'] = null;
        }
        setAttributeGroupConfig(attributeGroupConfigCL)
        setMsgError(null)
    }

    const handleSubmitConfig = () => {
        let { interprets } = attributeGroupConfig;
        let checkInvalid = interprets.filter(p => !p.is_show_search_result && (!p.text_url || !p.url))
        if (checkInvalid && checkInvalid.length > 0) {
            setMsgError('Vui lòng nhập thông tin Text Url/Url cho luận giải')
        }
        else handleSubmit(attributeGroupConfig)
    }

    return (
        <div>
            <Card
                className={`animated fadeIn z-index-222 mb-3 news-header-no-border`}>
                <CardHeader className="d-flex"
                    style={{
                        padding: '0.55rem',
                        alignItems: 'center'
                    }}>
                    <div className="flex-fill font-weight-bold">
                        Cấu hình Luận giải
                    </div>
                    <Button color="danger" size="md" onClick={handleClose}>
                        <i className={`fa fa-remove`} />
                    </Button>
                </CardHeader>
            </Card>
            <Card
                className="animated fadeIn"
                style={{ marginBottom: 0, border: "none" }}>
                <CardBody>
                    {
                        msgError && <Alert
                            key={`alert-config`}
                            style={{ marginTop: -20, marginBottom: 0 }}
                            color='danger'
                            isOpen={true}
                            toggle={() => setMsgError(null)}>
                            <span dangerouslySetInnerHTML={{ __html: msgError }} />
                        </Alert>
                    }

                    <div className="MuiPaper-root__custom MuiPaper-user">
                        <Row>
                            <Col xs={12} sm={12}>
                                <Table
                                    size="sm"
                                    bordered
                                    striped
                                    hover
                                    className="tb-product-attributes mt-2">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ width: 50 }}>STT</th>
                                            <th className="text-center">Luận giải</th>
                                            <th className="text-center" style={{ width: '15%' }}>Hiển thị tra cứu</th>
                                            <th className="text-center" style={{ width: '25%' }}>Text Link</th>
                                            <th className="text-center" style={{ width: '25%' }}>Link</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            attributeGroupConfig && attributeGroupConfig.interprets.length > 0 ?
                                                attributeGroupConfig.interprets.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center" style={{ verticalAlign: 'middle' }}>
                                                            {index + 1}
                                                        </td>
                                                        <td style={{ verticalAlign: 'middle' }}>
                                                            {item.interpret_detail_name}
                                                        </td>
                                                        <td className="text-center" style={{ verticalAlign: 'middle' }}>
                                                            <Checkbox
                                                                checked={item.is_show_search_result || false}
                                                                onChange={({ target }) => handleChangeInterpretConfig('is_show_search_result', target.checked, index)} />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                placeholder="Text Link"
                                                                name="text_url"
                                                                value={item.text_url || ''}
                                                                disabled={item.is_show_search_result}
                                                                onChange={({ target }) => {
                                                                    handleChangeInterpretConfig('text_url', target.value, index)
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Input
                                                                type="text"
                                                                placeholder="Link"
                                                                name="url"
                                                                value={item.url || ''}
                                                                disabled={item.is_show_search_result}
                                                                onChange={({ target }) => {
                                                                    handleChangeInterpretConfig('url', target.value, index)
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>

                                                )) : <tr>
                                                    <td className="text-center" colSpan={50}>
                                                        Không có dữ liệu
                                                    </td>
                                                </tr>
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} style={{ textAlign: 'right' }}>
                                <Button
                                    color='primary'
                                    onClick={handleSubmitConfig}
                                    className="mr-2 btn-block-sm"
                                    type="button">
                                    <i className={`fa fa-save mr-2`} />
                                    Cập nhật
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    className="btn-block-sm"
                                    type="button">
                                    <i className={`fa fa-times-circle mr-2`} />
                                    Đóng
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default InterpretConfig;