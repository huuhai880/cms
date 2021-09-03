import React, { PureComponent } from "react";

// Component(s)
import AttributesGroupEdit from "./AttributesGroupEdit";

/**
 * @class CalculatiAttributesGroupDetailonDetail
 */
export default class AttributesGroupDetail extends PureComponent {
  render() {
    return <AttributesGroupEdit {...this.props} noEdit={true} />;
  }
}
