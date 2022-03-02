import React from 'react';
import { useParams } from "react-router";
import PageAdd from './PageAdd';

function PageEdit(props) {
    let { id } = useParams();
    return <PageAdd pageId={id} noEdit={false} />
}

export default PageEdit;