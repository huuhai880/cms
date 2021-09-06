import React from 'react';
import { useParams } from "react-router";
import ProductComboAdd from './ProductComboAdd';

function ProductComboDetail(props) {
    let { id } = useParams();
    return <ProductComboAdd comboId={id} noEdit={true} />
}

export default ProductComboDetail;