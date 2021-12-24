import React from 'react';
import { useParams } from "react-router";
import ProductComment from './ProductComment';

function CommentProduct(props) {
    let { id } = useParams();
    return <ProductComment product_id={id} is_combo={false}/>
}

export default CommentProduct;