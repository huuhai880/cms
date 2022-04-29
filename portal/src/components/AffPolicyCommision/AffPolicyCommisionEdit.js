import React from 'react';
import { useParams } from "react-router";
import AffPolicyCommisionAdd from './AffPolicyCommisionAdd';

function AffPolicyCommisionEdit(props) {
    let { id } = useParams();
    return <AffPolicyCommisionAdd policyCommisionId={id} noEdit={false} />
}

export default AffPolicyCommisionEdit;