import React, { PureComponent } from 'react';

// Component(s)
import PlanCategoryEdit from './PlanCategoryEdit';

export default class NewsCategoryDetail extends PureComponent {
  render() {
    return <PlanCategoryEdit {...this.props} noEdit={true} />
  }
}
