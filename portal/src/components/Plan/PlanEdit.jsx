import React, { PureComponent } from 'react';

// Component(s)
import Loading from '../Common/Loading';
import PlanAdd from './PlanAdd';

// Model(s)
import PlanModel from "../../models/PlanModel";

/**
 * @class AuthorEdit
 */
export default class AuthorEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._planModel = new PlanModel();

    // Init state
    this.state = {
      /** @var {planEntity} */
      planEnt: null
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let planEnt = await this._planModel.read(ID)
        .catch(() => {
          setTimeout(() => window._$g.rdr('/404'));
        })
      ;
      planEnt && this.setState({ planEnt });
    })();
    //.end
  }

  render() {
    let {
      planEnt,
    } = this.state;

    // Ready?
    if (!planEnt) {
      return <Loading />;
    }

    return <PlanAdd planEnt={planEnt} {...this.props} />
  }
}
