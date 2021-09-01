import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import CalculationAdd from "./CalculationAdd";

// Model(s)
import CalculationModel from "../../models/CalculationModel";

/**
 * @class CalculationEdit
 */
export default class CalculationEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._calculationModel = new CalculationModel();

    // Init state
    this.state = {
      /** @var {ReviewEntity} */
      calculationEnt: null,
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let calculationEnt = await this._calculationModel.read(ID).catch(() => {
        setTimeout(() => window._$g.rdr("/404"));
      });
        calculationEnt && this.setState({ calculationEnt });
    })();
    //.end
  }

  render() {
    let { calculationEnt } = this.state;

    // Ready?
    if (!calculationEnt) {
      return <Loading />;
    }

    return <CalculationAdd calculationEnt={calculationEnt} {...this.props} />;
  }
}
