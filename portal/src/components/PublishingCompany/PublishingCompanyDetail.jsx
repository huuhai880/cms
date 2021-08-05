import React, { PureComponent } from "react";

// Component(s)
import PublishingCompanyEdit from "./PublishingCompanyEdit";

/**
 * @class ProductCategoryDetail
 */
export default class PublishingCompanyDetail extends PureComponent {
  render() {
    return <PublishingCompanyEdit {...this.props} noEdit={true} />;
  }
}
