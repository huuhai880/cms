import React, { PureComponent } from 'react';

// Component(s)
import AuthorEdit from './AuthorEdit';

/**
 * @class AuthorDetail
 */
export default class AuthorDetail extends PureComponent {
  render() {
    return <AuthorEdit {...this.props} noEdit={true} />
  }
}
