import React, { PureComponent } from 'react';

// Component(s)
import ServiceEdit from './ServiceEdit';

/**
 * @class ServiceDetail
 */
export default class ServiceDetail extends PureComponent {
  
  render() {
    return <ServiceEdit {...this.props} noEdit={true} />
  }
}
