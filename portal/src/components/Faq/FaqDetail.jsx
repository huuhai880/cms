import React, { PureComponent } from 'react';

// Component(s)
import ServiceEdit from './FaqEdit';

/**
 * @class FaqDetail
 */
export default class FaqDetail extends PureComponent {
  
  render() {
    return <ServiceEdit {...this.props} noEdit={true} />
  }
}
