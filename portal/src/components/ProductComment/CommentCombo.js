import React from 'react';
import { useParams } from "react-router";
import ProductComment from './ProductComment';

function CommentCombo(props) {
    let { id } = useParams();
    return <ProductComment product_id={id} is_combo={true} />
}

export default CommentCombo;