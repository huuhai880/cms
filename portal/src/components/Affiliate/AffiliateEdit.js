import React from 'react';
import { useParams } from "react-router";
import AffiliateAdd from './AffiliateAdd';

function AffiliateEdit(props) {
    let { id } = useParams();
    return <AffiliateAdd memberId={id} noEdit={false} />
}

export default AffiliateEdit;