import React from 'react';
import { useParams } from "react-router";
import ParamOtherAdd from './ParamOtherAdd';

function ParamOtherEdit(props) {
    let { id } = useParams();
    return <ParamOtherAdd paramOtherId={id} noEdit={false} />
}

export default ParamOtherEdit;