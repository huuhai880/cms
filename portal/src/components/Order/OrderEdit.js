import React from 'react';
import { useParams } from "react-router";
import OrderAdd from './OrderAdd';

function OrderEdit(props) {
    let { id } = useParams();
    return <OrderAdd order_id={id} noEdit={false} />
}

export default OrderEdit;