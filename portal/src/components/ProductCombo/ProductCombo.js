import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Col, FormGroup } from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)
import { CheckAccess } from "../../navigation/VerifyAccess";

// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions } from "../../utils/index";

import ProductComboFilter from "./ProductComboFilter";
import { getColumnTable } from "./_constant";

import ProductComboModel from "../../models/ProductComboModel/index";
import './style.scss'

// Set layout full-wh
layoutFullWidthHeight();

const _productComboModel = new ProductComboModel();

export default function ProductCombo({ handlePick = null, isOpenModal = false, combos = [] }) {

    const [toggleSearch, setToggleSearch] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        list: [],
        total: 0,
    });
    const [query, setQuery] = useState({
        itemsPerPage: handlePick ? 10 : 25,
        page: 1,
        is_active: 1,
        is_web_view:1,
        search: "",
        start_date: null,
        end_date: null,
    });

    const [pickItems, setPickItems] = useState({})


    useEffect(() => {
        getListProductCombo(query);

        const _pickItems = combos ? (combos || []).reduce((obj, item) => {
            obj[item.combo_id] = item;
            return obj;
        }, {}) : {};
        setPickItems(_pickItems)

    }, []);


    const getListProductCombo = async (query) => {
        setIsLoading(true);
        try {
            let data = await _productComboModel.getList(query);
            setData(data);
        } catch (error) {
            window._$g.dialogs.alert(
                window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitFilter = (params) => {
        let query_params = {
            ...query,
            ...params,
            page: 1,
            itemsPerPage: 25,
        };
        setQuery(query_params);
        getListProductCombo(query_params);
    };

    const handleClickAdd = () => {
        window._$g.rdr("/product-combo/add");
    };

    const handleActionItemClick = (type, id, rowIndex) => {
        let routes = {
            detail: "/product-combo/detail/",
            delete: "/product-combo/delete/",
            edit: "/product-combo/edit/",
            comment: "/product-combo/comment/",
        };
        const route = routes[type];

        if (type.match(/detail|edit|comment/i)) {
            window._$g.rdr(`${route}${id}`);
        } else {
            window._$g.dialogs.prompt(
                "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
                "Xóa",
                (confirm) => handleClose(confirm, id, rowIndex)
            );
        }
    };

    const handleClose = (confirm, id, rowIndex) => {
        const { list } = data;
        if (confirm) {
            _productComboModel
                .delete(id)
                .then(() => {
                    const cloneData = JSON.parse(JSON.stringify(list));
                    cloneData.splice(rowIndex, 1);
                    setData({ list: cloneData, total: data.total - 1 });
                })
                .catch((e) => {
                    window._$g.dialogs.alert(
                        window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
                    );
                });
        }
    };


    const handleChangePage = (event, newPage) => {
        let filter = { ...query };
        filter.page = newPage + 1;
        setQuery(filter);
        getListProductCombo(filter);
    };

    const handleChangeRowsPerPage = (event) => {
        let filter = { ...query };
        filter.itemsPerPage = event.target.value;
        filter.page = 1;
        setQuery(filter);
        getListProductCombo(filter);
    };

    const handleAddCombo = () => {
        if (handlePick) {
            handlePick(pickItems)
            setPickItems({})
        }
    };

    return (
        <div>
            <Card className={`animated fadeIn z-index-222 mb-3 ${handlePick ? "news-header-no-border" : ""
                }`}>
                <CardHeader className="d-flex"
                    style={{
                        padding: handlePick ? '0.55rem' : '0.55rem 1.25rem',
                        alignItems: handlePick ? 'center' : 'unset'
                    }}>
                    <div className="flex-fill font-weight-bold">
                        {handlePick ? "Thêm Combo" : "Thông tin tìm kiếm"}
                    </div>
                    {handlePick ? (
                        <Button color="danger" size="md" onClick={() => handlePick({})}>
                            <i className={`fa fa-remove`} />
                        </Button>
                    ) :
                        <div
                            className="minimize-icon cur-pointer "
                            onClick={() => setToggleSearch((p) => !p)}
                        >
                            <i className={`fa ${toggleSearch ? "fa-minus" : "fa-plus"}`} />
                        </div>
                    }
                </CardHeader>
                {toggleSearch && (
                    <CardBody className="px-0 py-0">
                        <div className="MuiPaper-filter__custom z-index-2">
                            <ProductComboFilter
                                handleSubmitFilter={handleSubmitFilter}
                                handlePick={handlePick ? handleAddCombo : null}
                            />
                        </div>
                    </CardBody>
                )}
            </Card>

            {!handlePick && <Col
                xs={12}
                sm={4}
                className="d-flex align-items-end mb-3"
                style={{ padding: 0 }}
            >
                <CheckAccess permission="PRO_COMBOS_ADD">
                    <FormGroup className="mb-2 mb-sm-0">
                        <Button
                            className="mr-1 col-12 pt-2 pb-2 MuiPaper-filter__custom--button"
                            onClick={handleClickAdd}
                            color="success"
                            size="sm"
                        >
                            <i className="fa fa-plus mr-1" />
                            Thêm mới
                        </Button>
                    </FormGroup>
                </CheckAccess>
            </Col>
            }

            <Card className="animated fadeIn"
                style={{ marginBottom: handlePick ? 0 : "1.5rem", border: "none" }}>
                <CardBody className={`py-0 ${!isOpenModal ? "px-0" : ""}`}>
                    <div className="MuiPaper-root__custom MuiPaper-user">
                        {isLoading ? (
                            <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                                <CircularProgress />
                            </div>
                        ) : (
                            <div>
                                <MUIDataTable
                                    data={data.list}
                                    columns={getColumnTable(
                                        data.list,
                                        query,
                                        handleActionItemClick,
                                        handlePick,
                                        { ...pickItems },
                                        setPickItems
                                    )}
                                    options={configTableOptions(data.total, 0, query)}
                                />
                                <CustomPagination
                                    count={data.total}
                                    rowsPerPage={query.itemsPerPage}
                                    page={query.page - 1 || 0}
                                    rowsPerPageOptions={
                                        handlePick ? [10, 25, 50, 75, 100] : [25, 50, 75, 100]
                                    }
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
