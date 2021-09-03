import React, { PureComponent } from 'react';

// Component(s)
import ParamNameEdit from './ParamNameEdit';

/**
 * @class ParamNameDetail
 */
export default class ParamNameDetail extends PureComponent {
  render() {
    return <ParamNameEdit {...this.props} noEdit={true} />
  }
}
