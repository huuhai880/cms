import React, { PureComponent } from 'react';

// Component(s)
import FormulaByNameEdit from './FormulaByNameEdit';

/**
 * @class FormulaByNameDetail
 */
export default class FormulaByNameDetail extends PureComponent {
  render() {
    return <FormulaByNameEdit {...this.props} noEdit={true} />
  }
}
