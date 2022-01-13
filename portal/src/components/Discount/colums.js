import React from "react";
import { CheckAccess } from "../../navigation/VerifyAccess";
import { Button } from "reactstrap";


export const columns_product = (handleDeleteProduct) => [
    {
        title: 'STT',
        dataIndex: '',
        key: '',
        width: 80,
        render: (value, record, index) => {
            return (
                <span>{index + 1}</span>
            )
        },
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'product_name',
        key: 'product_name',
        render: (value, record, index) => {
            return (
                <span>{value}</span>
            )
        },
    },
    {
        title: '',
        dataIndex: 'x',
        key: '',
        width: 80,
        render: (value, record) => {
            return (
                <div style={{ textAlign: "center" }}>
                    <CheckAccess permission="PRO_DISCOUNT_DEL">
                        <Button
                            color="danger"
                            title="Xóa"
                            className=""
                            onClick={(evt) =>
                                handleDeleteProduct(record)
                            }
                        >
                            <i className="fa fa-trash" />
                        </Button>
                    </CheckAccess>
                </div>
            )
        }
    },

];
export const columns_customer_type = (handleDeleteCustomerType) => [
    {
        title: 'STT',
        dataIndex: '',
        key: '',
        width: 80,
        render: (value, record, index) => {
            return (
                <span>{index + 1}</span>
            )
        },
    },
    {
        title: 'Loại khách hàng',
        dataIndex: 'customer_type_name',
        key: 'customer_type_name',
        render: (value, record, index) => {
            return (
                <span>{value}</span>
            )
        },
    },
    {
        title: '',
        dataIndex: 'x',
        key: '',
        width: 100,
        render: (value, record) => {
            return (
                <div style={{ textAlign: "center" }}>
                    <CheckAccess permission="PRO_DISCOUNT_DEL">
                        <Button
                            color="danger"
                            title="Xóa"
                            className=""
                            onClick={(evt) =>
                                handleDeleteCustomerType(record)
                            }
                        >
                            <i className="fa fa-trash" />
                        </Button>
                    </CheckAccess>
                </div>
            )
        }
    },

];