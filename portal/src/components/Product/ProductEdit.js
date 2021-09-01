import React from 'react';
import { useParams } from "react-router";
import ProductAdd from './ProductAdd';

function ProductEdit(props) {
    let { id } = useParams();
    return <ProductAdd productId={id} noEdit={false} />
}

export default ProductEdit;