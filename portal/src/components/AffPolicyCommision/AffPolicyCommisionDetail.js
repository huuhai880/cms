import React from 'react';
import { useParams } from "react-router";
import AffPolicyCommisionAdd from './AffPolicyCommisionAdd';

function AffPolicyCommisionDetail(props) {
    let { id } = useParams();
    return <AffPolicyCommisionAdd policyCommisionId={id} noEdit={true} />
}

export default AffPolicyCommisionDetail;