import React, { PureComponent } from 'react';

// Component(s)
import ContactCustomerEdit from './ContactCustomerEdit';


export default class ContactCustomerDetail extends PureComponent {
  render() {
    return <ContactCustomerEdit {...this.props} noEdit={true} />
  }
}
