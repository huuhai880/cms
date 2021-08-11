import React, { PureComponent } from 'react';

// Component(s)
import Loading from '../Common/Loading';
import PartnerAdd from './PartnerAdd';

// Model(s)
import PartnerModel from "../../models/PartnerModel";

/**
 * @class partnerEdit
 */
export default class partnerEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._partnerModel = new PartnerModel();

    // Init state
    this.state = {
      /** @var {PartnerEntity} */
      partnerEnt: null
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let partnerEnt = await this._partnerModel.read(ID)
        .catch(() => {
          setTimeout(() => window._$g.rdr('/404'));
        })
      ;
      partnerEnt.password = ""
      partnerEnt && this.setState({ partnerEnt });
    })();
    //.end
  }

  render() {
    let {
      partnerEnt,
    } = this.state;

    // Ready?
    if (!partnerEnt) {
      return <Loading />;
    }

    return <PartnerAdd partnerEnt={partnerEnt} {...this.props} />
  }
}
