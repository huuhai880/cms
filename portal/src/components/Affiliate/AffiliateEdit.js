import React from 'react';
import { useParams } from "react-router";
import AffiliateAdd from './AffiliateAdd';

function AffiliateEdit(props) {
    let { id } = useParams();
    return <AffiliateAdd affiliateId={id} noEdit={false} />
}

export default AffiliateEdit;