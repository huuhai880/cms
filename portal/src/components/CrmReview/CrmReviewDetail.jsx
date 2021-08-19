import React, { PureComponent } from "react";

// Component(s)
import CrmReviewEdit from "./CrmReviewEdit";

/**
 * @class CrmReviewDetail
 */
export default class CrmReviewDetail extends PureComponent {
  render() {
    return <CrmReviewEdit {...this.props} noEdit={true} />;
  }
}
