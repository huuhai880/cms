import React from 'react';
import { useParams } from "react-router";
import ProductComboAdd from './ProductComboAdd';

function ProductComboEdit(props) {
    let { id } = useParams();
    return <ProductComboAdd comboId={id} noEdit={false} />
}

export default ProductComboEdit;