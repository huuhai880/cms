import React, { PureComponent } from "react";

// Component(s)
import AttributesEdit from "./AttributesEdit";

/**
 * @class AttributesDetail
 */
export default class AttributesDetail extends PureComponent {
  render() {
    return <AttributesEdit {...this.props} noEdit={true} />;
  }
}
