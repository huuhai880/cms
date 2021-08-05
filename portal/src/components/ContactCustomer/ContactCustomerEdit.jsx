import React, { PureComponent } from 'react';

// Component(s)
import Loading from '../Common/Loading';
import ContactCustomerAdd from './ContactCustomerAdd';

// Model(s)
import ContactCustomerModel from "../../models/ContactCustomerModel";

/**
 * @class AuthorEdit
 */
export default class AuthorEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._contactCustomerModel = new ContactCustomerModel();

    // Init state
    this.state = {
      /** @var {contactCustomerEntity} */
      contactCustomerEnt: null
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let contactCustomerEnt = await this._contactCustomerModel.read(ID)
        .catch(() => {
          setTimeout(() => window._$g.rdr('/404'));
        })
      ;
      contactCustomerEnt && this.setState({ contactCustomerEnt });
    })();
    //.end
  }

  render() {
    let {
      contactCustomerEnt,
    } = this.state;
    // Ready?
    if (!contactCustomerEnt) {
      return <Loading />;
    }

    return <ContactCustomerAdd contactCustomerEnt={contactCustomerEnt} {...this.props} />
  }
}
