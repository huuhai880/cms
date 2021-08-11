import React, { PureComponent } from 'react';

// Component(s)
import PartnerEdit from './PartnerEdit';

/**
 * @class OutputTypeDetail
 */
export default class PartnerDetail extends PureComponent {
  render() {
    return <PartnerEdit {...this.props} noEdit={true} />
  }
}
