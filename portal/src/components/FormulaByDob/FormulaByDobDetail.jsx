import React, { PureComponent } from 'react';

// Component(s)
import FormulaByDobEdit from './FormulaByDobEdit';

/**
 * @class FormulaByDobDetail
 */
export default class FormulaByDobDetail extends PureComponent {
  render() {
    return <FormulaByDobEdit {...this.props} noEdit={true} />
  }
}
