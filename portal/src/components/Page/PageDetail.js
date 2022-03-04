import React from 'react';
import { useParams } from "react-router";
import PageAdd from './PageAdd';

function PageDetail(props) {
    let { id } = useParams();
    return <PageAdd pageId={id} noEdit={true} />
}

export default PageDetail;