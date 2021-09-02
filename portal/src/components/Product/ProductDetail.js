import React from 'react';
import { useParams } from "react-router";
import ProductAdd from './ProductAdd';

function ProductDetail(props) {
    let { id } = useParams();
    return <ProductAdd productId={id} noEdit={true} />
}

export default ProductDetail;