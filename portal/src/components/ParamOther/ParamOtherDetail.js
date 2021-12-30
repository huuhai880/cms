import React from 'react';
import { useParams } from "react-router";
import ParamOtherAdd from './ParamOtherAdd';

function ParamOtherDetail(props) {
    let { id } = useParams();
    return <ParamOtherAdd paramOtherId={id} noEdit={true} />
}

export default ParamOtherDetail;