import React from 'react';
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
} from 'reactstrap';
import TableAnt from 'antd/es/table';
import {PlusSquareOutlined, MinusSquareOutlined} from '@ant-design/icons'; // icon antd
import 'react-image-lightbox/style.css';
import {ActionButton} from '@widget';
import {useState} from 'react';
import Select from 'react-select';
import {Editor} from '@tinymce/tinymce-react';
import {convertValue, mapDataOptions4Select, readImageAsBase64} from '../../utils/html';
import AuthorModel from '../../models/AuthorModel/index';
import ProductImage from './ProductImage';
import SelectProductCategory from './SelectProductCategory';
import ProductCategoryModel from 'models/ProductCategoryModel/index';
import {useEffect} from 'react';
import {useFormik} from 'formik';
import {initialValues, validationSchema} from './ProductConstant';
import ProductModel from 'models/ProductModel/index';
import ProductPage from 'models/ProductPage/index'; // product page
import MessageError from './MessageError';
import Loading from '../Common/Loading';
import InterpertTable from './InterpertTable';
import './style.scss';
import {columns, columns_config, columns_config_child, columns_page_child, columns_product_page} from './const_page';
import PopUpChildPage from './PopUpChildPage';
import PopupInterpretSpecial from './PopupInterpretSpecial';

const _authorModel = new AuthorModel();
const _productCategoryModel = new ProductCategoryModel();
const _productModel = new ProductModel();
const _productPageModel = new ProductPage();

function ProductAdd({noEdit = false, productId = null}) {
    const [alerts, setAlerts] = useState([]);
    const [productCategories, setProductCategories] = useState([]);
    const [product, setProduct] = useState(initialValues);
    const [buttonType, setButtonType] = useState(null);
    const [attributesGroup, setAttributesGroup] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isShowConfig, setShowConfig] = useState(null);
    const [attributeGroupSelected, setAttributeGroupSelected] = useState(null);
    const [dataPage, setdataPage] = useState([]);
    const [expandedRowKeys, set_expandedRowKeys] = useState([]);
    const [isShowProductConfig, setShowProductConfig] = useState(false);
    const [dataProductPage, setDataProductPage] = useState([]);
    const [productPageAttributeGroup, setProductAttributeGroup] = useState([]);
    const [namePageProduct, setNamePageProduct] = useState({
        name_page: null,
        product_page_id: null,
        attributes_group_id: null,
        index_parent: null,
        index_child: null,
    });
    const [save_dateProductPage, setSaveDataProductPage] = useState([]);
    const [itemInterPertPage, setItemInterPertPage] = useState([]);
    const [interpretSpecial, setInterpretSpecial] = useState([]);
    const [isShowInterpretSpecial, setIsShowInterpretSpecial] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: product,
        validationSchema,
        validateOnBlur: false,
        validateOnChange: true,
        onSubmit: values => {
            handleSubmitProduct(values);
        },
    });

    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        setLoading(true);
        try {
            if (productId) {
                let product = await _productModel.read(productId);
                let value = {
                    ...initialValues,
                    ...product,
                };

                let data_productPage = [...product.product_page];

                for (let i = 0; i < data_productPage.length; i++) {
                    data_productPage[i].rowIndex = i;
                }
                setSaveDataProductPage(JSON.parse(JSON.stringify(product.product_page)));
                formik.setFieldValue('product_page', data_productPage);
                setProduct(value);
            }
            let data = await _productCategoryModel.getOptions({is_active: 1});
            let productCategoryOption = mapDataOptions4Select(data);

            productCategoryOption = productCategoryOption.map(item => {
                return {
                    ...item,
                    parent_id: item.parent_id ? item.parent_id : 0,
                };
            });
            setProductCategories(productCategoryOption);
            let listAttributesGroup = await _productModel.getListAttributesGroup();

            //   console.log({ listAttributesGroup });

            setAttributesGroup(listAttributesGroup);

            //Chỉ số dùng cho Nội dung Page
            let lstAttributesGroupPage = (listAttributesGroup || []).map(
                ({attributes_group_id, attributes_group_name}) => ({
                    attributes_group_id,
                    attributes_group_name,
                }),
            );
            //Thêm 1 chỉ số gọi là Chỉ Số: LUẬN GIẢI ĐẶC BIỆT áp dụng cho Vận số năm
            lstAttributesGroupPage.unshift({
                attributes_group_id: -1,
                attributes_group_name: 'LUẬN GIẢI ĐẶC BIỆT',
            });
            setProductAttributeGroup(lstAttributesGroupPage); // set attribute for page product

            // get list produt page
            const dataProductPage = await _productPageModel.getListProductPage();
            setDataProductPage(dataProductPage);

            //Lay danh sach Luan giai dac biet
            let _interpretSpecial = await _productPageModel.getListInterpretSpecial();
            setInterpretSpecial(_interpretSpecial);
        } catch (error) {
            window._$g.dialogs.alert(window._$g._('Đã có lỗi xảy ra. Vùi lòng F5 thử lại'));
        } finally {
            setLoading(false);
        }
    };

    const handleUploadImage = async (blobInfo, success, failure) => {
        readImageAsBase64(blobInfo.blob(), async imageUrl => {
            try {
                const imageUpload = await _authorModel.upload({
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

    const handleOnKeyDown = keyEvent => {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
        }
    };

    const handleSubmitForm = type => {
        setButtonType(type);
        formik.submitForm();
    };

    const handleSubmitProduct = async values => {
        try {
            let result = false;
            let {product_page = []} = values || {};
            for (let index = 0; index < product_page.length; index++) {
                let _pPage = product_page[index];
                let {data_child = []} = _pPage || {};
                for (let j = 0; j < data_child.length; j++) {
                    let _attributesGroup = data_child[j];
                    if (_attributesGroup.attributes_group_id == -1) { //Luan giai dac biet
                        _attributesGroup.data_interpret = (_attributesGroup.data_interpret || [])
                        .filter(
                            p => p.is_selected || 
                            (p.interpret_details || []).filter(k => k.is_selected).length > 0
                        );
                    }
                }
            }
            values.product_page = product_page;

            if (productId) {
                result = await _productModel.update(productId, values);
            } else {
                result = await _productModel.create(values);
            }
            window._$g.toastr.show('Lưu thành công!', 'success');
            if (buttonType == 'save_n_close') {
                return window._$g.rdr('/product');
            }

            if (buttonType == 'save' && !productId) {
                formik.resetForm();
            }
        } catch (error) {
            let {errors, statusText, message} = error;

            let msg = [`<b>${statusText || message}</b>`].concat(errors || []).join('<br/>');
            setAlerts([{color: 'danger', msg}]);
            window.scrollTo(0, 0);
        } finally {
            formik.setSubmitting(false);
        }
    };

    const handleAddAttributeProduct = () => {
        let attribute_add = {
            product_id: null,
            attributes_group_id: null,
            interprets: [],
        };
        let {product_attributes = []} = formik.values || {};
        let check_attribute = product_attributes.find(p => p.attributes_group_id == attribute_add);
        if (!check_attribute) {
            formik.setFieldValue('product_attributes', [...product_attributes, attribute_add]);
        }
    };

    const optionAttributesGroup = () => {
        let {product_attributes = []} = formik.values || {};
        if (attributesGroup && attributesGroup.length > 0) {
            return attributesGroup.map(({attributes_group_id: value, attributes_group_name: label}) => {
                return product_attributes.find(p => p.attributes_group_id == value)
                    ? {
                          value,
                          label,
                          isDisabled: true,
                      }
                    : {value, label};
            });
        }
        return [];
    };

    const callAPIInterPret = async query => {
        let attrProduct = [...formik.values.product_attributes];
        let interprets = await _productModel.interpretList({
            attributes_group_id: query.attributes_group_id,
        });

        attrProduct[query.index].interprets = interprets.listInterpret
            ? interprets.listInterpret.map(item => {
                  return {
                      ...item,
                      ...{
                          is_show_search_result: true,
                          text_url: '',
                          url: '',
                          is_selected: true,
                      },
                  };
              })
            : [];

        attrProduct[query.index].interprets = attrProduct[query.index].interprets.map((item, index) => {
            return {
                ...item,
                interpret_details: item.interpret_details.map(itemChild => {
                    return {
                        ...itemChild,
                        ...{
                            is_show_search_result: true,
                            text_url: '',
                            url: '',
                            is_selected: true,
                        },
                    };
                }),
            };
        });

        formik.setFieldValue('product_attributes', attrProduct);
    };
    const handleChangeAttributesGroup = (selected, index) => {
        let attrProduct = [...formik.values.product_attributes];
        attrProduct[index].attributes_group_id = selected ? selected.value : null;
        attrProduct[index].rowIndex = parseInt(index);
        formik.setFieldValue('product_attributes', attrProduct);

        let query = {
            index: index,
            attributes_group_id: selected ? selected.value : null,
        };
        callAPIInterPret(query);
    };

    const handleRemoveAttributeProduct = index => {
        let attrProduct = [...formik.values.product_attributes];
        attrProduct.splice(index, 1);
        formik.setFieldValue('product_attributes', attrProduct);
    };

    const changeAlias = val => {
        var str = val;
        str = str.trim();
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(
            /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
            ' ',
        );
        str = str.replace(/ + /g, '-');
        str = str.replace(/[ ]/g, '-');
        str = str.trim();
        return str;
    };

    const renderProductAttributes = () => {
        return (
            <Table size="sm" bordered striped hover className="tb-product-attributes mt-2">
                <thead>
                    <tr>
                        <th className="text-center" style={{width: 100}}>
                            STT
                        </th>
                        <th className="text-center">Chỉ số</th>
                        {/* <th className="text-center">Luận giải chi tiết</th> */}
                        <th className="text-center" style={{width: 100}}>
                            Cấu hình
                        </th>
                        <th className="text-center" style={{width: 100}}>
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {formik.values.product_attributes && formik.values.product_attributes.length ? (
                        formik.values.product_attributes.map((item, index) => (
                            <tr key={index}>
                                <td
                                    className="text-center"
                                    style={{
                                        verticalAlign: 'middle',
                                    }}>
                                    {index + 1}
                                </td>
                                <td>
                                    <Select
                                        className="MuiPaper-filter__custom--select"
                                        id={`attribute_group_id_${item.attributes_group_id}`}
                                        name={`attribute_group_id_${item.attributes_group_id}`}
                                        onChange={value => handleChangeAttributesGroup(value, index)}
                                        isSearchable={true}
                                        placeholder={'-- Chọn chỉ số--'}
                                        value={convertValue(item.attributes_group_id, optionAttributesGroup() || [])}
                                        options={optionAttributesGroup()}
                                        isDisabled={noEdit}
                                        styles={{
                                            menuPortal: base => ({...base, zIndex: 9999}),
                                        }}
                                        menuPortalTarget={document.querySelector('body')}
                                    />
                                </td>

                                <td
                                    style={{
                                        verticalAlign: 'middle',
                                    }}
                                    className="text-center">
                                    <Button
                                        color="primary"
                                        onClick={() => handleShowPopupConfig(item, index)}
                                        className="btn-sm"
                                        disabled={item.attributes_group_id == null}>
                                        {' '}
                                        <i className="fa fa-cog"></i>
                                    </Button>
                                </td>

                                <td
                                    style={{
                                        verticalAlign: 'middle',
                                    }}
                                    className="text-center">
                                    <Button
                                        color="danger"
                                        onClick={() => handleRemoveAttributeProduct(index)}
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

    const optionPageProductGroup = () => {
        let {product_page = []} = formik.values || {};
        if (dataProductPage && dataProductPage.length > 0) {
            return dataProductPage.map(({product_page_id: value, page_name: label, page_type}) => {
                return product_page.find(p => p.product_page_id == value)
                    ? {
                          value,
                          label,
                          isDisabled: true,
                          page_type,
                      }
                    : {value, label, page_type};
            });
        }
        return [];
    };

    const optionAttProductPage = parent_key => {
        let product_page = formik.values.product_page[parent_key] || {};
        if (productPageAttributeGroup && productPageAttributeGroup.length > 0) {
            return productPageAttributeGroup.map(({attributes_group_id: value, attributes_group_name: label}) => {
                return product_page.data_child.find(p => p.attributes_group_id == value)
                    ? {
                          value,
                          label,
                          isDisabled: true,
                      }
                    : {value, label};
            });
        }
        return [];
    };

    const handleChangeProductPageGroup = (selected, record, index) => {
        // change select page product
        let pageProduct = [...formik.values.product_page];
        pageProduct[index].product_page_id = selected ? selected.value : null;
        pageProduct[index].rowIndex = parseInt(index);
        pageProduct[index].name_page = selected ? selected.label : null;

        pageProduct[index].order_index_page = index + 1;
        pageProduct[index].page_type = selected ? selected.page_type : null;

        setNamePageProduct({
            name_page: record.name_page,
            product_page_id: record.product_page_id,
            attributes_group_id: null,
            index_parent: null,
            index_child: null,
        });
        formik.setFieldValue('product_page', pageProduct);

        if (pageProduct[index].data_child.length == 0) {
            pageProduct[index].data_child = [
                {
                    attributes_group_id: null,
                    show_index: null,
                    data_interpret: null,
                    data_selected: null,
                },
            ];
        }

        if (pageProduct[index].page_type == 2) {
            pageProduct[index].data_child = [];
        } else {
            onTableRowExpand(true, {rowIndex: pageProduct[index].rowIndex});
        }
    };

    const handleChangeAttributesPageProduct = (selected, record, index, parent_key) => {
        let pageProduct = [...formik.values.product_page];
        const save_data = [...save_dateProductPage];
        pageProduct[parent_key].data_child[index].attributes_group_id = selected ? selected.value : null;
        pageProduct[parent_key].data_child[index].show_index = parseInt(index + 1);

        if (save_data.length > 0) {
            if (save_data[parent_key] !== undefined) {
                const checkIndexKey = save_data[parent_key].data_child.findIndex(
                    item => item.attributes_group_id === selected.value,
                );
                if (checkIndexKey !== -1) {
                    pageProduct[parent_key].data_child[index].data_selected =
                        save_data[parent_key].data_child[checkIndexKey].data_selected;
                } else {
                    pageProduct[parent_key].data_child[index].data_selected = [];
                }
            } else {
                pageProduct[parent_key].data_child[index].data_selected = [];
            }
        } else {
            pageProduct[parent_key].data_child[index].data_selected = [];
        }

        formik.setFieldValue('product_page', pageProduct);
        setNamePageProduct({
            ...namePageProduct,
            attributes_group_id: pageProduct[parent_key].data_child[index].attributes_group_id,
        });

        //Call Api lay luan giai theo Chi so dang chon
        let query = {
            index_parent: parent_key,
            index_child: index,
            attributes_group_id: selected ? selected.value : null,
        };
        callAPIInterPretProductPage(query);
    };

    // thay đổi vị trí hiển thị
    const changeShowIndex = (value, parent_index, index) => {
        let pageProduct = [...formik.values.product_page];
        let show_index = pageProduct[parent_index].data_child.length == 1 ? 1 : value;
        pageProduct[parent_index].data_child[index].show_index = show_index;
        formik.setFieldValue('product_page', pageProduct);
    };

    // call api get interpret for product page
    const callAPIInterPretProductPage = async query => {
        let product_page = [...formik.values.product_page];
        let interprets = [];
        if (query.attributes_group_id == -1) {
            interprets = JSON.parse(JSON.stringify([...interpretSpecial]));
            if (!productId) {
                interprets = interprets.map(p => {
                    return {
                        ...p,
                        ...{is_selected: true},
                        interpret_details: (p.interpret_details || []).map(k => {
                            return {...k, ...{is_selected: true}};
                        }),
                    };
                });
            }
            //   console.log({interprets})
            //   console.log({query})
        } else {
            interprets = await _productPageModel.getListInterPertProductPage(query.attributes_group_id);
        }

        product_page[query.index_parent].data_child[query.index_child].data_interpret = interprets;
        formik.setFieldValue('product_page', product_page);
    };

    const setShowProductPage = async (data_interpret, index, parent_key, record = {}) => {
        // console.log({data_interpret})
        // show model product page
        await setItemInterPertPage(data_interpret);
        setNamePageProduct({
            ...namePageProduct,
            index_parent: parent_key,
            index_child: index,
        });

        let {attributes_group_id = -1} = record || {};
        if (attributes_group_id == -1) {
            setIsShowInterpretSpecial(true);
        } else {
            setShowProductConfig(true);
        }
    };

    const handleAddProductPage = () => {
        // add new apge

        let product_page_add = {
            id_product_page: null,
            product_page_id: null, // page_id
            name_page: null,
            data_child: [
                {
                    attributes_group_id: null,
                    show_index: null,
                    data_interpret: null,
                    data_selected: null,
                },
            ],
            order_index_page: null,
            page_type: null,
        };

        let {product_page = []} = formik.values || {};
        let check_product_page = dataProductPage.find(p => p.product_page_id == product_page_add.product_page_id);
        if (!check_product_page) {
            formik.setFieldValue('product_page', [...product_page, product_page_add]);
        }
    };

    const handleAddChildProductPage = index => {
        // add item child product page
        let pageProduct = [...formik.values.product_page];
        const new_child = [...pageProduct[index].data_child];
        new_child.push({
            attributes_group_id: null,
            show_index: null,
            data_interpret: null,
            data_selected: null,
        });
        pageProduct[index].data_child = new_child;
        formik.setFieldValue('product_page', pageProduct);
    };

    const deleteItemPage = index => {
        let pageProduct = [...formik.values.product_page];
        pageProduct.splice(index, 1);
        formik.setFieldValue('product_page', pageProduct);
    };

    const handleDeleteChildProductPage = (child_key, parent_key) => {
        // xoá child product page
        const pageProduct = [...formik.values.product_page];
        const index_parent = pageProduct.findIndex((item, index) => index === parent_key);
        const index_child = pageProduct[index_parent].data_child.findIndex((item, index) => index === child_key);
        const newPageProduct = [...pageProduct];
        newPageProduct[index_parent].data_child.map((item, index) => {
            if (newPageProduct[index_parent].data_child[index_child].show_index != null) {
                if (
                    newPageProduct[index_parent].data_child[index_child].show_index <
                    newPageProduct[index_parent].data_child[index].show_index
                ) {
                    newPageProduct[index_parent].data_child[index].show_index =
                        newPageProduct[index_parent].data_child[index].show_index - 1;
                }
            }
        });
        if (index_child !== -1) {
            pageProduct[index_parent].data_child.splice(index_child, 1);
        }
        formik.setFieldValue('product_page', pageProduct);
    };

    const _expandableProductPage = (parent_index, data_child) => {
        // children product page
        let new_data = [...data_child];

        return (
            <div style={{paddingLeft: 27, marginTop: -4}}>
                <TableAnt
                    rowKey="key"
                    className="custome_table custome_table_border"
                    columns={columns_page_child(
                        parent_index,
                        handleDeleteChildProductPage,
                        setShowProductPage,
                        noEdit,
                        optionAttProductPage(parent_index),
                        handleChangeAttributesPageProduct,
                        setNamePageProduct,
                        changeShowIndex,
                    )}
                    locale={{
                        emptyText: 'Không có dữ liệu',
                    }}
                    dataSource={new_data}
                    pagination={false}
                    bordered={true}
                    footer={() => {
                        return (
                            <Button
                                color="success"
                                className="btn-sm"
                                type="button"
                                disabled={noEdit}
                                onClick={() => {
                                    handleAddChildProductPage(parent_index);
                                }}>
                                <i className="fa fa-plus" />
                                Thêm dòng
                            </Button>
                        );
                    }}
                />
            </div>
        );
    };

    const onTableRowExpand = (expanded, record) => {
        let keys = [];
        if (expanded) {
            keys.push(record.rowIndex);
        }
        set_expandedRowKeys(keys);
    };
    const renderProductPage = () => {
        // product page
        return (
            <TableAnt
                className="custome_table"
                columns={columns_product_page(
                    noEdit,
                    deleteItemPage,
                    optionPageProductGroup,
                    handleChangeProductPageGroup,
                    handleChangeOrderIndexPage,
                )}
                rowKey={record => record.rowIndex}
                locale={{
                    emptyText: (
                        <tr className={'emty_data_table_ant'}>
                            <td className="text-center" colSpan={50}>
                                Không có dữ liệu
                            </td>
                        </tr>
                    ),
                }}
                bordered={true}
                expandedRowKeys={expandedRowKeys}
                onExpand={onTableRowExpand}
                expandable={{
                    expandedRowRender: (record, index) => _expandableProductPage(index, record.data_child),
                    rowExpandable: record => record.product_page_id !== null && record.page_type != 2,
                    expandIcon: ({expanded, onExpand, record}) =>
                        record.product_page_id !== null && record.page_type != 2 ? (
                            expanded ? (
                                <MinusSquareOutlined
                                    rotate={360}
                                    className={'custom_icon'}
                                    style={{fontSize: 16}}
                                    onClick={e => onExpand(record, e)}
                                />
                            ) : (
                                <PlusSquareOutlined
                                    rotate={360}
                                    className={'custom_icon'}
                                    style={{fontSize: 16}}
                                    onClick={e => onExpand(record, e)}
                                />
                            )
                        ) : null,
                }}
                dataSource={formik.values.product_page}
                pagination={false}
            />
        );
    };
    const handleShowPopupConfig = async (item, index) => {
        let itemCl = JSON.parse(JSON.stringify(item));
        setAttributeGroupSelected(itemCl);
        setShowConfig(true);
    };

    const handleClosePopupConfig = () => {
        setShowConfig(false);
        setAttributeGroupSelected(null);
    };

    const handleSubmitConfig = interpert => {
        let attrProducts = [...formik.values.product_attributes];
        attrProducts = attrProducts.map(item => {
            return item.attributes_group_id == interpert.attributes_group_id
                ? {...item, interprets: interpert.interprets}
                : item;
        });

        formik.setFieldValue('product_attributes', attrProducts);
        setShowConfig(false);
        setAttributeGroupSelected(null);
    };

    const handleClosePopup = () => {
        setNamePageProduct({
            name_page: null,
            product_page_id: null,
            attributes_group_id: null,
            index_parent: null,
            index_child: null,
        });
        setItemInterPertPage([]);
        setIsShowInterpretSpecial(false);
    };

    const handleChangeOrderIndexPage = (value, record, index) => {
        let pageProduct = [...formik.values.product_page];
        pageProduct[index].order_index_page = parseInt(value);
        formik.setFieldValue('product_page', pageProduct);
    };

    return loading ? (
        <Loading />
    ) : (
        <div key={`view-${productId || 0}`} className="animated fadeIn">
            <Row className="d-flex justify-content-center">
                <Col xs={12} md={12}>
                    <Card>
                        <CardHeader>
                            <b>
                                {productId ? (noEdit ? 'Chi tiết' : 'Chỉnh sửa') : 'Thêm mới'} sản phẩm{' '}
                                {productId ? product.product_name : ''}
                            </b>
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

                            <Form id="frmProduct" onSubmit={formik.handleSubmit} onKeyDown={handleOnKeyDown}>
                                <Row>
                                    <Col xs={12} sm={12} md={7} lg={7}>
                                        <Row className="mb-4">
                                            <Col xs={12}>
                                                <b className="title_page_h1 text-primary">Thông tin sản phẩm</b>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={12} sm={12}>
                                                <FormGroup row>
                                                    <Label className="col-sm-4 col-form-label">
                                                        Danh mục sản phẩm
                                                        <span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={8}>
                                                        <SelectProductCategory
                                                            name="product_category_id"
                                                            onChange={item => {
                                                                let product_category_id = item ? item.value : null;
                                                                formik.setFieldValue(
                                                                    'product_category_id',
                                                                    product_category_id,
                                                                );
                                                            }}
                                                            isSearchable={true}
                                                            defaultValue={(productCategories || []).find(
                                                                ({value}) =>
                                                                    1 * value == 1 * formik.values.product_category_id,
                                                            )}
                                                            listOption={productCategories}
                                                            isDisabled={noEdit}
                                                            isClearable={true}
                                                            id={productId ? product.product_category_id : null}
                                                        />
                                                        <MessageError formik={formik} name="product_category_id" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={12} sm={12}>
                                                <FormGroup row>
                                                    <Label className="col-sm-4 col-form-label">
                                                        Tên sản phẩm
                                                        <span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            type="text"
                                                            placeholder="Tên sản phẩm"
                                                            disabled={noEdit}
                                                            name="product_name"
                                                            value={formik.values.product_name}
                                                            onChange={({target}) => {
                                                                formik.setFieldValue('product_name', target.value);
                                                                formik.setFieldValue(
                                                                    'product_name_show_web',
                                                                    target.value,
                                                                );
                                                                formik.setFieldValue(
                                                                    'url_product',
                                                                    changeAlias(target.value),
                                                                );
                                                            }}
                                                            // {...formik.getFieldProps("product_name")}
                                                        />
                                                        <MessageError formik={formik} name="product_name" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={12} sm={12}>
                                                <FormGroup row>
                                                    <Label className="col-sm-4 col-form-label">
                                                        Tên hiển thị web
                                                        <span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            type="text"
                                                            placeholder="Tên hiển thị Web"
                                                            disabled={noEdit}
                                                            name="product_name_show_web"
                                                            value={formik.values.product_name_show_web}
                                                            onChange={({target}) => {
                                                                formik.setFieldValue(
                                                                    'product_name_show_web',
                                                                    target.value,
                                                                );
                                                                formik.setFieldValue(
                                                                    'url_product',
                                                                    changeAlias(target.value),
                                                                );
                                                            }}
                                                            // {...formik.getFieldProps("product_name_show_web")}
                                                        />
                                                        <MessageError formik={formik} name="product_name_show_web" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={12} sm={12}>
                                                <FormGroup row>
                                                    <Label className="col-sm-4 col-form-label">
                                                        Url sản phẩm
                                                        {/* <span className="font-weight-bold red-text">*</span> */}
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            type="text"
                                                            placeholder="Url sản phẩm"
                                                            disabled={true}
                                                            name="url_product"
                                                            // readOnly={true}
                                                            // value={changeAlias(formik.values.product_name)}
                                                            {...formik.getFieldProps('url_product')}
                                                        />
                                                        {/* <MessageError formik={formik} name="url_product" /> */}
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={12} sm={12}>
                                                <FormGroup row>
                                                    <Label className="col-sm-4 col-form-label">
                                                        Mô tả ngắn
                                                        <span className="font-weight-bold red-text">*</span>
                                                    </Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            type="textarea"
                                                            placeholder="Mô tả ngắn"
                                                            disabled={noEdit}
                                                            rows={4}
                                                            name="short_description"
                                                            {...formik.getFieldProps('short_description')}
                                                        />
                                                        <MessageError formik={formik} name="short_description" />
                                                    </Col>
                                                </FormGroup>
                                            </Col>

                                            <Col xs={12} sm={12}>
                                                <FormGroup row>
                                                    <Label className="col-sm-4 col-form-label">Link Landing Page</Label>
                                                    <Col sm={8}>
                                                        <Input
                                                            type="text"
                                                            placeholder="Link Landing Page"
                                                            disabled={noEdit}
                                                            name="link_landing_page"
                                                            value={formik.values.link_landing_page}
                                                            onChange={({target}) => {
                                                                formik.setFieldValue('link_landing_page', target.value);
                                                            }}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col xs={12} sm={12} md={5} lg={5}>
                                        <ProductImage
                                            title="Ảnh sản phẩm"
                                            canEdit={!noEdit}
                                            name="product_images"
                                            formik={formik}
                                        />
                                        <Label style={{paddingTop: 10}}>Ưu tiên up ảnh kích thước 1190x1680px</Label>
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col xs={12}>
                                        <b className="title_page_h1 text-primary">Nội dung </b>
                                        <span className="font-weight-bold red-text"> * </span>
                                    </Col>

                                    <Col sm={12}>
                                        {renderProductAttributes()}
                                        <MessageError formik={formik} name="product_attributes" />
                                    </Col>

                                    <Col xs={12}>
                                        {!noEdit && (
                                            <Button
                                                className="btn-sm mt-1"
                                                color="secondary"
                                                onClick={handleAddAttributeProduct}
                                                disabled={
                                                    (formik.values.product_attributes || []).length ==
                                                    attributesGroup.length
                                                }>
                                                <i className="fa fa-plus mr-2" />
                                                Thêm dòng
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col xs={12}>
                                        <b className="title_page_h1 text-primary">Nội dung Page </b>
                                    </Col>
                                    <Col style={{marginTop: 8}} sm={12}>
                                        {renderProductPage()}
                                        <MessageError formik={formik} name="product_page" />
                                    </Col>

                                    <Col style={{marginTop: 8}} xs={12}>
                                        {!noEdit && (
                                            <Button
                                                className="btn-sm mt-1"
                                                color="secondary"
                                                onClick={handleAddProductPage}
                                                disabled={
                                                    (formik.values.product_page || []).length == dataProductPage.length
                                                }>
                                                <i className="fa fa-plus mr-2" />
                                                Thêm dòng
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col xs={12}>
                                        <b className="title_page_h1 text-primary">Mô tả chi tiết </b>
                                        <span className="font-weight-bold red-text"> * </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <FormGroup row>
                                            <Col sm={12} xs={12}>
                                                <Editor
                                                    apiKey={'3dx8ac4fg9km3bt155plm3k8bndvml7o1n4uqzpssh9owdku'}
                                                    scriptLoading={{
                                                        delay: 500,
                                                    }}
                                                    value={formik.values.product_content_detail}
                                                    disabled={noEdit}
                                                    init={{
                                                        height: '300px',
                                                        width: '100%',
                                                        menubar: false,
                                                        branding: false,
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
                                                            'undo redo | fullscreen | formatselect | bold italic backcolor | \n' +
                                                            'alignleft aligncenter alignright alignjustify',
                                                        toolbar2:
                                                            'bullist numlist outdent indent | removeformat | help | image | toc',
                                                        file_picker_types: 'image',
                                                        images_dataimg_filter: function (img) {
                                                            return img.hasAttribute('internal-blob');
                                                        },
                                                        images_upload_handler: handleUploadImage,
                                                    }}
                                                    onEditorChange={newValue => {
                                                        formik.setFieldValue('product_content_detail', newValue);
                                                    }}
                                                />
                                                <MessageError formik={formik} name="product_content_detail" />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} className="m-t-10 mb-2 mt-2">
                                        <FormGroup row>
                                            <Col sm={2} xs={12}>
                                                <CustomInput
                                                    className="pull-left"
                                                    onBlur={null}
                                                    checked={formik.values.is_active}
                                                    type="checkbox"
                                                    id="is_active"
                                                    onChange={e => {
                                                        formik.setFieldValue('is_active', e.target.checked);
                                                    }}
                                                    label="Kích hoạt"
                                                    disabled={noEdit}
                                                />
                                            </Col>
                                            <Col sm={2} xs={12} className="offset-xs-0">
                                                <CustomInput
                                                    className="pull-left"
                                                    onBlur={null}
                                                    checked={formik.values.is_show_web}
                                                    type="checkbox"
                                                    id="is_show_web"
                                                    onChange={e => {
                                                        formik.setFieldValue('is_show_web', e.target.checked);
                                                    }}
                                                    label="Hiển thị Web"
                                                    disabled={noEdit}
                                                />
                                            </Col>
                                            <Col sm={3} xs={12} className="offset-xs-0">
                                                <CustomInput
                                                    className="pull-left"
                                                    onBlur={null}
                                                    checked={formik.values.is_web_view}
                                                    type="checkbox"
                                                    id="is_web_view"
                                                    onChange={e => {
                                                        formik.setFieldValue('is_web_view', e.target.checked);
                                                    }}
                                                    label="Hiển thị luận giải trên Web"
                                                    disabled={noEdit}
                                                />
                                            </Col>
                                            <Col sm={2} xs={12} className="offset-xs-0">
                                                <CustomInput
                                                    className="pull-left"
                                                    onBlur={null}
                                                    checked={formik.values.is_show_menu}
                                                    type="checkbox"
                                                    id="is_show_menu"
                                                    onChange={e => {
                                                        formik.setFieldValue('is_show_menu', e.target.checked);
                                                    }}
                                                    label="Hiển thị trên Menu"
                                                    disabled={noEdit}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row className="mt-2">
                                    <Col xs={12} sm={12} style={{padding: '0px'}}>
                                        <ActionButton
                                            isSubmitting={formik.isSubmitting}
                                            buttonList={[
                                                {
                                                    title: 'Chỉnh sửa',
                                                    color: 'primary',
                                                    isShow: noEdit,
                                                    icon: 'edit',
                                                    permission: 'MD_PRODUCT_EDIT',
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr(`/product/edit/${productId}`),
                                                },
                                                {
                                                    title: 'Lưu',
                                                    color: 'primary',
                                                    isShow: !noEdit,
                                                    notSubmit: true,
                                                    icon: 'save',
                                                    permission: ['MD_PRODUCT_EDIT', 'MD_PRODUCT_ADD'],
                                                    onClick: () => handleSubmitForm('save'),
                                                },
                                                {
                                                    title: 'Lưu và đóng',
                                                    color: 'success',
                                                    isShow: !noEdit,
                                                    notSubmit: true,
                                                    permission: ['MD_PRODUCT_EDIT', 'MD_PRODUCT_ADD'],
                                                    icon: 'save',
                                                    onClick: () => handleSubmitForm('save_n_close'),
                                                },
                                                {
                                                    title: 'Đóng',
                                                    icon: 'times-circle',
                                                    isShow: true,
                                                    notSubmit: true,
                                                    onClick: () => window._$g.rdr('/product'),
                                                },
                                            ]}
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {isShowConfig ? (
                <Modal isOpen={true} size={'lg'} style={{maxWidth: '80rem'}}>
                    <ModalBody className="p-0">
                        <InterpertTable
                            noEdit={noEdit}
                            handleClose={handleClosePopupConfig}
                            attributeGroup={attributeGroupSelected}
                            handleSubmit={handleSubmitConfig}
                            callAPIInterPret={callAPIInterPret}
                        />
                    </ModalBody>
                </Modal>
            ) : null}
            {isShowProductConfig ? (
                <Modal isOpen={true} size={'lg'} style={{maxWidth: '80rem'}}>
                    <ModalBody className="p-0">
                        <PopUpChildPage
                            handleClose={() => setShowProductConfig(false)}
                            detail_page={namePageProduct}
                            data_interpret={itemInterPertPage}
                            formik={formik}
                            noEdit={noEdit}
                        />
                    </ModalBody>
                </Modal>
            ) : null}

            {isShowInterpretSpecial ? (
                <Modal isOpen={true} size={'lg'} style={{maxWidth: '80rem'}}>
                    <ModalBody className="p-0">
                        <PopupInterpretSpecial
                            interpretSpecial={itemInterPertPage}
                            handleClosePopup={handleClosePopup}
                            formik={formik}
                            noEdit={noEdit}
                            detailRow={namePageProduct}
                        />
                    </ModalBody>
                </Modal>
            ) : null}
        </div>
    );
}

export default ProductAdd;
