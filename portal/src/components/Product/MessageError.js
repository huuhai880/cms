import React from 'react';
import {
    Alert
} from "reactstrap";

function MessageError({ formik, name }) {
    
    return formik.touched[name] &&
        formik.errors[name] ? (
        <Alert
            color="danger"
            className="field-validation-error">
            {formik.errors[name]}
        </Alert>
    ) : null;
}

export default MessageError;