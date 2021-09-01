import React, { PureComponent } from "react";

// Component(s)
import CalculationEdit from "./CalculationEdit";

/**
 * @class CalculationDetail
 */
export default class CalculationDetail extends PureComponent {
  render() {
    return <CalculationEdit {...this.props} noEdit={true} />;
  }
}
