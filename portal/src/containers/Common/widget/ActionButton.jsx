import React from "react";
import { Row, Col, Button } from "reactstrap";

import { CheckAccess } from "@navigation/VerifyAccess";

export default function ActionButton(props) {
  const {
    editUrl,
    isSubmitting,
    editPermissions = "",
    savePermissions = "",
    saveAndClosePermissions = "",
    isEdit = true,
    buttonList = [],
    handleSubmit,
  } = props;

  return (
    <Row>
      <Col sm={12} className="text-right">
        {buttonList.map((e, i) =>
          e.isShow ? (
            e.permission ? (
              <CheckAccess permission={e.permission} key={`aciton-button-${i}`}>
                <Button
                  color={e.color}
                  onClick={e.onClick}
                  className="mr-2 btn-block-sm"
                  disabled={isSubmitting}
                  type={e.notSubmit ? "button" : "submit"}
                >
                  <i className={`fa fa-${e.icon} mr-2`} />
                  {e.title}
                </Button>
              </CheckAccess>
            ) : (
              <Button
                key={`aciton-button-${i}`}
                color={e.color}
                onClick={e.onClick}
                className="mr-2 btn-block-sm"
                disabled={isSubmitting}
                type={e.notSubmit ? "button" : "submit"}
              >
                <i className={`fa fa-${e.icon} mr-2`} />
                {e.title}
              </Button>
            )
          ) : null
        )}
      </Col>
    </Row>
  );
}
