import React, { PureComponent } from 'react';

// Component(s)
import Loading from '../Common/Loading';
import ParamNameAdd from './ParamNameAdd';

// Model(s)
import ParamNameModel from "../../models/ParamNameModel";

/**
 * @class paramNameEnt
 */
export default class ParamNameEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._paramNameModel = new ParamNameModel();

    // Init state
    this.state = {
      /** @var {ParamNameEntity} */
      paramNameEnt: null
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let paramNameEnt = await this._paramNameModel.read(ID)
        .catch(() => {
          setTimeout(() => window._$g.rdr('/404'));
        })
      ;
      paramNameEnt && this.setState({ paramNameEnt });
    })();
    //.end
  }

  render() {
    let {
      paramNameEnt,
    } = this.state;

    // Ready?
    if (!paramNameEnt) {
      return <Loading />;
    }

    return <ParamNameAdd paramNameEnt={paramNameEnt} {...this.props} />
  }
}
