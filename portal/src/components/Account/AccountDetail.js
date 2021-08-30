import React, { PureComponent } from 'react';

// Component(s)
import AccountAdd from './AccountAdd';

/**
 * @class AccountDetail
 */
export default class AccountDetail extends PureComponent {
  render() {
    return <AccountAdd {...this.props} noEdit={true} />
  }
}
