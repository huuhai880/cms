import { splitString } from "../../utils/index";

import React from "react";
import { Checkbox } from "antd";
import { Link } from "react-router-dom";
import { Button, Input } from "reactstrap";
const regex = /(<([^>]+)>)/gi;
export const column = (handleChangeInterpretConfig, handleChangeInterpretChildByInterpert, noEdit) => {
    return [
        {
            title: "STT",
            dataIndex: "STT",
            key: "name",
            responsive: ["md"],
            render: (text, record, index) => {
                return (
                    <Link to={`/interpret/detail/${record["interpret_id"]}`} target={"_self"}>
                        <div className="text-center">{index + 1}</div>
                    </Link>
                );
            },
            width: "4%",
        },
        {
            title: "Tên thuộc tính",
            dataIndex: "attribute_name",
            key: "attribute_name",
            responsive: ["md"],
            width: "15%",
            render: (text, record, index) => {
                // console.log(record)
                return (
                    <div className="text-left">
                        <a target="_blank" href={`/portal/interpret/detail/${record.interpret_id}`}>
                            {record.is_interpretspectial == 1 ? record.attributes_name : record.attribute_name}
                        </a>
                    </div>
                );
            },
        },
        {
            title: "Vị trí hiển thị",
            dataIndex: "order_index",
            key: "order_index",
            responsive: ["md"],
            width: "8%",
            render: (text, record, index) => {
                return <div className="text-center">{text}</div>;
            },
        },
        {
            title: "Tóm tắt",
            dataIndex: "brief_desc",
            key: "brief_desc",
            responsive: ["md"],
            render: (text, record, index) => {
                let value = text ? text.replace(regex, "") : "";
                value = splitString(value, 80);
                return value;
            },
        },

        {
            title: "Hiển thị tra cứu",
            dataIndex: "is_show_search_result",
            width: "10%",
            key: "is_show_search_result",
            responsive: ["md"],
            render: (text, record, index) => (
                <div className="text-center">
                    <Checkbox
                        checked={record.is_show_search_result || false}
                        disabled={noEdit}
                        onChange={({ target }) =>
                            handleChangeInterpretConfig("is_show_search_result", target.checked, index)
                        }
                    />
                </div>
            ),
        },
        {
            title: "Text Link",
            dataIndex: "text_url",
            width: "20%",
            key: "text_url",
            responsive: ["md"],
            render: (text, record, index) => (
                <div className="text-left">
                    <Input
                        type="textarea"
                        placeholder="Text Link"
                        name="text_url"
                        value={record.text_url || ""}
                        disabled={record.is_show_search_result}
                        onChange={({ target }) => {
                            handleChangeInterpretConfig("text_url", target.value, index);
                        }}
                    />
                </div>
            ),
        },
        {
            title: "Link",
            dataIndex: "url",
            width: "10%",
            key: "url",
            responsive: ["md"],
            render: (text, record, index) => (
                <div className="text-left">
                    <Input
                        type="text"
                        placeholder="Link"
                        name="url"
                        value={record.url || ""}
                        disabled={record.is_show_search_result}
                        onChange={({ target }) => {
                            handleChangeInterpretConfig("url", target.value, index);
                        }}
                    />
                </div>
            ),
        },
        // {
        //   title: "Thao tác",
        //   dataIndex: "is_selected",
        //   key: "is_selected",
        //   width: "8%",
        //   responsive: ["md"],
        //   render: (text, record, index) => (
        //     <div className="text-center">
        //       <Checkbox
        //         checked={record.is_selected || false}
        //         onChange={({ target }) => {
        //           handleChangeInterpretConfig("is_selected", target.checked, index);
        //           handleChangeInterpretChildByInterpert(target.checked, index);
        //           // console.log()
        //         }}
        //       />
        //     </div>
        //   ),
        // },
    ];
};

export const getAttributesOfProduct = (attributesGroupOfProduct) => {
    //Chỉ số của Sản phẩm
    let attributes_group_product = [];
    for (let k = 0; k < attributesGroupOfProduct.length; k++) {
        let { attributes_group_id, interprets = [] } = attributesGroupOfProduct[k] || {};
        interprets = interprets.filter(p => p.is_selected);

        //Danh sách luận giải của Chỉ số
        if (interprets && interprets.length > 0) {
            for (let j = 0; j < interprets.length; j++) {
                let {
                    interpret_id = 0,
                    is_show_search_result = false,
                    text_url = null,
                    url = null,
                    interpret_details = [],
                } = interprets[j] || {};

                //Luận giải Cha
                attributes_group_product.push({
                    product_id: null,
                    attributes_group_id,
                    interpret_id,
                    interpret_detail_id: 0,
                    is_show_search_result,
                    text_url,
                    url,
                    order_index: k,
                });

                //Danh sách luận giải Con
                interpret_details = interpret_details.filter(p => p.is_selected) || [];
                for (let l = 0; l < interpret_details.length; l++) {
                    let {
                        interpret_detail_id = 0,
                        is_show_search_result = false,
                        text_url = null,
                        url = null,
                    } = interpret_details[l] || {};
                    attributes_group_product.push({
                        product_id: null,
                        attributes_group_id,
                        interpret_id: interpret_id,
                        interpret_detail_id,
                        is_show_search_result,
                        text_url,
                        url,
                        order_index: k,
                    });
                }
            }
        }
        else {
            attributes_group_product.push({
                product_id: null,
                attributes_group_id,
                interpret_id: 0,
                interpret_detail_id: 0,
                is_show_search_result: false,
                text_url: null,
                url: null,
                order_index: k,
            });
        }

    }
    return attributes_group_product;
}

export const getPageOfProduct = (pageOfProduct) => {
    let page_product = [];
    for (let i = 0; i < pageOfProduct.length; i++) {
        const _page = pageOfProduct[i];
        console.log({ _page })
        let {
            page_type = null,
            product_page_id,
            order_index_page,
            data_child = []
        } = _page || {};

        //Neu la Page Tinh
        if (page_type == 2) {
            page_product.push({
                product_id: null,
                product_page_id,
                attributes_group_id: -2,
                attributes_id: -2,
                interpret_id: null,
                interpret_detail_id: null,
                order_index: 0,
                order_index_interpret: 0,
                is_interpret_special: false,
                order_index_page,
            });
        } else {
            //Page động
            //Duyet DS Chi so Cua Page
            for (let h = 0; h < data_child.length; h++) {
                const _child = data_child[h];
                let {
                    attributes_group_id = -1,
                    data_selected_special = {},
                    show_index,
                    data_selected = [],
                } = _child || {};

                //Nếu là luận giải đặc biệt
                if (attributes_group_id == -1) {
                    Object.keys(data_selected_special).forEach(key => {
                        let {
                            order_index = null,
                            is_selected = false,
                            interpret_details = {},
                        } = data_selected_special[key] || {};

                        //Luận giải cha
                        if (is_selected) {
                            page_product.push({
                                product_id: null,
                                product_page_id,
                                attributes_group_id: -1,
                                attributes_id: -1,
                                interpret_id: key,
                                interpret_detail_id: null,
                                order_index: show_index,
                                order_index_interpret: order_index,
                                is_interpret_special: true,
                                order_index_page,
                            });
                        }

                        //Luận giải con
                        Object.keys(interpret_details).forEach(keyChild => {
                            let { order_index: order_index_child = null, is_selected = false } =
                                interpret_details[keyChild] || {};
                            if (is_selected) {
                                page_product.push({
                                    product_id: null,
                                    product_page_id,
                                    attributes_group_id: -1,
                                    attributes_id: -1,
                                    interpret_id: key,
                                    interpret_detail_id: keyChild,
                                    order_index: show_index,
                                    order_index_interpret: order_index_child,
                                    is_interpret_special: true,
                                    order_index_page,
                                });
                            }
                        });
                    });
                } else {
                    //Chỉ số
                    for (let n = 0; n < data_selected.length; n++) {
                        let {
                            attributes_group_id,
                            attributes_id,
                            interpret_id,
                            interpret_detail_id,
                            showIndex,
                        } = data_selected[n] || {};

                        page_product.push({
                            product_id: null,
                            product_page_id,
                            attributes_group_id,
                            attributes_id,
                            interpret_id,
                            interpret_detail_id,
                            order_index: show_index,
                            order_index_interpret: showIndex,
                            is_interpret_special: false,
                            order_index_page,
                        });
                    }
                }
            }
        }
    }
    return page_product;
}
