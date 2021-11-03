import React, { useEffect, useState, useRef } from "react";
import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Button,
    FormGroup,
    Label,
    Input,
    Form,

} from "reactstrap";
import { Table } from "antd";
import { CircularProgress } from "@material-ui/core";
import "./style.scss";
import { columns_child_page_select, columns_page_selected } from "./const_page";
import { useFormik } from "formik";
import MessageError from "./MessageError";

const PopUpChildConfig = ({ handleClose, detail_page, data_interpret, formik }) => {
    const [msgError, setMsgError] = useState(null);
    const [dataSelected, set_dataSelected] = useState([])
    const [keyword, setKeyword] = useState('');
    const [keywordSelect, setKeywordSelect] = useState('');
    const [isSelectedRowKeys, setSelectedRowKeys] = useState([]);
    const [data_select, set_data_select] = useState(data_interpret);
    const [isloading, setLoading] = useState(false);
    const [isloadingSelected, setLoadingSelected] = useState(false)
    const typingTimeOutRef = useRef(null); // even nhập
    const [saveDataSelected, setSaveDataSelected] = useState([]) // lưu interpert đã chọn


    useEffect(() => {
        let pageProduct = [...formik.values.product_page];

        const dataSelected = pageProduct[detail_page.index_parent].data_child[detail_page.index_child].data_selected;

        if (dataSelected != null) {
            const select_key = [];
            set_dataSelected(dataSelected);
            setSaveDataSelected(dataSelected);
            dataSelected.map((item) => {
                select_key.push(item.interpret_detail_id)

            });
            setSelectedRowKeys(select_key);
        }

    }, []);
    // event enter
    const handleKeyDown = (e) => {
        if (1 * e.keyCode === 13) {
            e.preventDefault();
            searchInterPertDetail(keyword);
        }
    };

    const handleKeyDownPage = (e) => {
        if (1 * e.keyCode === 13) {
            e.preventDefault();
            searchInterPretSelected(keywordSelect);
        }
    }

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
    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        },
        onSelect: (record, selected) => {
            const data_select = [...dataSelected]
            if (selected) {
                const set_data_selected = {
                    attributes_id: record.attributes_id,
                    attributes_name: record.attributes_name,
                    attributes_group_id: record.attributes_group_id,
                    interpret_id: record.interpret_id,
                    interpret_detail_id: record.interpret_detail_id,
                    interpret_detail_name: record.interpret_detail_name,
                    showIndex: 1,
                    isEdit: true,
                }
                data_select.map((item, index) => {
                    if (item.attributes_id === record.attributes_id) {
                        set_data_selected.showIndex = set_data_selected.showIndex + 1;
                        set_data_selected.isEdit = false;
                        data_select[index].isEdit = false;
                    }
                })
                data_select.push(set_data_selected);
                data_select.sort(function (a, b) {
                    return a.attributes_id - b.attributes_id
                });
            } else {
                const index_select = data_select.findIndex((item) => item.interpret_detail_id === record.interpret_detail_id);
                for (let i = 0; i < data_select.length; i++) {
                    if (data_select[index_select].showIndex < data_select[i].showIndex) {
                        data_select[i].showIndex = data_select[i].showIndex - 1;
                    }
                }
                data_select.splice(index_select, 1);
                const length_attributes = data_select.filter(item => item.attributes_id == record.attributes_id).length;
                if (length_attributes === 1) {
                    data_select.map((item, index) => {
                        if (item.attributes_id == record.attributes_id) {
                            data_select[index].isEdit = true;
                        }
                    })
                }
            }
            set_dataSelected(data_select);
            setSaveDataSelected(data_select);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            const data_select = []
            if (selected) {
                selectedRows.map((item) => {
                    const set_data_selected = {
                        id_product_page: null,
                        attributes_id: item.attributes_id,
                        attributes_name: item.attributes_name,
                        attributes_group_id: item.attributes_group_id,
                        interpret_id: item.interpret_id,
                        interpret_detail_id: item.interpret_detail_id,
                        interpret_detail_name: item.interpret_detail_name,
                        showIndex: 1,
                        isEdit: true,
                    }
                    data_select.map((item_select, index) => {
                        if (item_select.attributes_id === item.attributes_id) {
                            set_data_selected.showIndex = set_data_selected.showIndex + 1;
                            set_data_selected.isEdit = false;
                            data_select[index].isEdit = false;
                        }
                    })

                    data_select.push(set_data_selected);
                })
                data_select.sort(function (a, b) {
                    return a.attributes_id - b.attributes_id
                });

            }
            set_dataSelected(data_select);
            setSaveDataSelected(data_select);
        }


    };

    const un_rowSelection = (record) => {
        const newSelectedRowKeys = [...isSelectedRowKeys];
        const newdataSelected = [...dataSelected]
        const index = newSelectedRowKeys.findIndex((item) => item === record.interpret_detail_id);
        const index_selected = newdataSelected.findIndex((item) => item.interpret_detail_id === record.interpret_detail_id);
        if (index !== -1) {
            newSelectedRowKeys.splice(index, 1);
            setSelectedRowKeys(newSelectedRowKeys);
        }
        if (index_selected !== -1) {
            for (let i = 0; i < newdataSelected.length; i++) {
                if (newdataSelected[index_selected].attributes_id === newdataSelected[i].attributes_id) {
                    if (newdataSelected[index_selected].showIndex < newdataSelected[i].showIndex) {
                        newdataSelected[i].showIndex = newdataSelected[i].showIndex - 1
                    }
                }
            }
            newdataSelected.splice(index_selected, 1);
            const length_attributes = newdataSelected.filter(item => item.attributes_id == record.attributes_id).length;
            if (length_attributes === 1) {
                newdataSelected.map((item, index) => {
                    if (item.attributes_id == record.attributes_id) {
                        newdataSelected[index].isEdit = true;
                    }
                })
            }
            set_dataSelected(newdataSelected);
            setSaveDataSelected(newdataSelected);
        }
    }

    const change_setKeyWord = (value_filter) => {
        setKeyword(value_filter);
        if (typingTimeOutRef.current) {
            clearTimeout(typingTimeOutRef.current);
        };
        typingTimeOutRef.current = setTimeout(() => {
            if (value_filter == '' || value_filter.trim().length == 0) {
                set_data_select(data_interpret);
            }
        }, 700);

    }

    const change_setKeyWordSelected = (value_filter) => {
        setKeywordSelect(value_filter);
        if (typingTimeOutRef.current) {
            clearTimeout(typingTimeOutRef.current);
        };
        typingTimeOutRef.current = setTimeout(() => {
            if (value_filter == '' || value_filter.trim().length == 0) {
                set_dataSelected(saveDataSelected);
            }
        }, 700);

    }
    const searchInterPertDetail = (keyword) => {
        setLoading(true);
        let cl = [...data_interpret];
        const searchFilter = cl.filter(
            (interpert) =>
                changeAlias(interpert.attributes_name.toLocaleLowerCase()).indexOf(changeAlias(keyword.toLocaleLowerCase())) !== -1
                || changeAlias(interpert.interpret_detail_name.toLocaleLowerCase()).indexOf(changeAlias(keyword.toLocaleLowerCase())) !== -1
        );
        cl = searchFilter;
        set_data_select(cl);
        setInterval(() => {
            setLoading(false);
        }, 1000);
    }

    const searchInterPretSelected = (keywordSelect) => {
        setLoadingSelected(true)
        let cl = [...saveDataSelected];
        const searchFilter = cl.filter(
            (interpert) =>
                changeAlias(interpert.attributes_name.toLocaleLowerCase()).indexOf(changeAlias(keywordSelect.toLocaleLowerCase())) !== -1
                || changeAlias(interpert.interpret_detail_name.toLocaleLowerCase()).indexOf(changeAlias(keywordSelect.toLocaleLowerCase())) !== -1
        );
        cl = searchFilter;
        set_dataSelected(cl);
        setInterval(() => {
            setLoadingSelected(false);
        }, 1000);
    }

    const changeRowIndexSelect = (index, value_change) => {
        let new_dataSelected = [...dataSelected];
        new_dataSelected[index].showIndex = value_change;
        set_dataSelected(new_dataSelected);
    }

    const checkShowIndexSelected = () => {
        let alreadySeen = [];
        let alreadyIndex = [];
        let error_samekey = false;
        let error_mostkey = false;
        dataSelected.forEach(function (str) {
            if (alreadySeen[str.attributes_id]) {
                if (alreadyIndex[str.showIndex]) {
                    error_samekey = true;
                }
            } else {
                alreadySeen[str.attributes_id] = true;
                alreadyIndex[str.showIndex] = true;
            };
        });
        const counts = {};

        dataSelected.forEach(function (x) { counts[x.attributes_id] = (counts[x.attributes_id] || 0) + 1; });

        Object.keys(counts).map(function (objectKey, index) {
            let value = counts[objectKey];
            for (let i = 0; i < dataSelected.length; i++) {
                if (dataSelected[i].attributes_id == objectKey && dataSelected[i].showIndex > value) {
                    error_mostkey = true;
                }
            }
        });

        if (error_samekey === true) {
            formik.setFieldError("error_samekey", "Thứ tự không thể trùng lặp!");
        } else if (error_mostkey === true) {
            formik.setFieldError("error_samekey", "Thứ tự không lớn hơn số thuộc tính!");
        }else if(dataSelected.findIndex((item)=>item.showIndex==null||item.showIndex.length==0) !=-1){
            formik.setFieldError("error_samekey", "Thứ tự hiển thị là bắt buộc!");
        }
        else {
            _handleSubmitSelectPageProduct();
        }
    }

    const _handleSubmitSelectPageProduct = () => {
        let pageProduct = [...formik.values.product_page];
        pageProduct[detail_page.index_parent].data_child[detail_page.index_child].data_selected = dataSelected;
        formik.setFieldValue("product_page", pageProduct);
        handleClose();
    }

    return (
        <div >
            <Card className={`animated fadeIn z-index-222 mb-3 news-header-no-border`}>
                <CardHeader
                    className="d-flex"
                    style={{
                        padding: "0.55rem",
                        alignItems: "center",
                    }}
                >
                    <div className="flex-fill font-weight-bold">CHỌN LUẬN GIẢI CHI TIẾT PAGE {detail_page.name_page} </div>
                    <Button color="danger" size="md" onClick={handleClose}>
                        <i className={`fa fa-remove`} />
                    </Button>
                </CardHeader>
            </Card>
            <Col style={{ maxHeight: '80vh', overflow: 'scroll' }}>
                <CardBody style={{ padding: 8 }} className="px-0 py-0">
                    <div className="MuiPaper-filter__custom">
                        <div className="ml-2 mr-2 mb-2 mt-2">
                            <span className="title_detail_page">
                                Danh sách luận giải chi tiết
                            </span>
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
                                                    placeholder="Nhập tên thuộc tính, tên luận giải chi tiết"
                                                    value={keyword}
                                                    onChange={(e) => change_setKeyWord(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm={6} xs={12} className={`d-flex align-items-end justify-content-end`}>
                                        <FormGroup className="mb-2 mb-sm-0">
                                            <Button
                                                className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                                onClick={() => searchInterPertDetail(keyword)}
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
                                                onClick={() => {
                                                    searchInterPertDetail("");
                                                    setKeyword("")
                                                }}
                                                type="button"
                                                size="sm"
                                            >
                                                <i className="fa fa-refresh mr-1" />
                                                Làm mới
                                            </Button>
                                        </FormGroup>

                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </CardBody>

                <CardBody style={{ padding: 8 }}>
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
                                <Card className={`animated fadeIn mb-3 `}>
                                    <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                                        <CircularProgress />
                                    </div>
                                </Card>

                            ) : (
                                <div>
                                    <Table
                                        rowKey={record => record.interpret_detail_id}
                                        className="components-table-demo-nested"
                                        dataSource={data_select}
                                        bordered={true}
                                        rowSelection={{
                                            selectedRowKeys: isSelectedRowKeys,
                                            ...rowSelection
                                        }}
                                        columns={columns_child_page_select()}
                                        locale={{
                                            emptyText: 'Không có dữ liệu',
                                        }}
                                        pagination={false}
                                        scroll={{ y: 230 }}

                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                </CardBody>

                <CardBody style={{ padding: 8 }} className="px-0 py-0">
                    <div className="MuiPaper-filter__custom">
                        <div className="ml-2 mr-2 mb-3 mt-2">
                            <span className="title_detail_page">
                                Danh sách luận giải chi tiết theo Page
                            </span>
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

                                                    placeholder="Nhập tên thuộc tính, tên luận giải chi tiết"
                                                    value={keywordSelect}
                                                    onChange={(e) => change_setKeyWordSelected(e.target.value)}
                                                    onKeyDown={handleKeyDownPage}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    <Col sm={6} xs={12} className={`d-flex align-items-end justify-content-end`}>
                                        <FormGroup className="mb-2 mb-sm-0">
                                            <Button
                                                className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                                color="primary"
                                                type="button"
                                                size="sm"
                                                onClick={() => searchInterPretSelected(keywordSelect)}
                                            >
                                                <i className="fa fa-search mr-1" />
                                                Tìm kiếm
                                            </Button>
                                        </FormGroup>
                                        <FormGroup className="mb-2 ml-2 mb-sm-0">
                                            <Button
                                                className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                                                onClick={() => {
                                                    searchInterPretSelected("");
                                                    setKeywordSelect("");
                                                }}
                                                type="button"
                                                size="sm"
                                            >
                                                <i className="fa fa-refresh mr-1" />
                                                Làm mới
                                            </Button>
                                        </FormGroup>

                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </CardBody>
                <CardBody style={{ padding: 8 }}>
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
                            {isloadingSelected ? (
                                <Card className={`animated fadeIn mb-3 `}>
                                    <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                                        <CircularProgress />
                                    </div>
                                </Card>
                            ) : (
                                <div>
                                    <Table
                                        className="components-table-demo-nested"
                                        dataSource={dataSelected}
                                        bordered={true}
                                        locale={{
                                            emptyText: 'Không có dữ liệu',
                                        }}
                                        columns={columns_page_selected(
                                            un_rowSelection,
                                            changeRowIndexSelect
                                        )}
                                        pagination={false}
                                        scroll={{ y: 270 }}
                                        rowKey={"key"}
                                    />
                                    {formik.errors.error_samekey && (
                                        <div
                                            className="field-validation-error alert alert-danger fade show"
                                            role="alert"
                                        >
                                            {formik.errors.error_samekey}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Col>

                    </Row>

                </CardBody>

                <Col sm={12} xs={12} className={`d-flex align-items-end justify-content-end mb-2`}>
                    <FormGroup className="mb-2 mb-sm-0">
                        <Button

                            className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                            color="primary"
                            type="button"
                            size="sm"
                            disabled={
                                dataSelected.length == 0
                            }
                            onClick={() => checkShowIndexSelected()}
                        >
                            <i className="fa fa-save mr-1" />
                            Cập nhật
                        </Button>
                    </FormGroup>
                    <FormGroup className="mb-2 ml-2 mb-sm-0">
                        <Button
                            className="col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                            onClick={() => handleClose()}
                            type="button"
                            size="sm"
                        >

                            Đóng
                        </Button>
                    </FormGroup>

                </Col>
            </Col>
        </div>
    )




}
export default PopUpChildConfig;