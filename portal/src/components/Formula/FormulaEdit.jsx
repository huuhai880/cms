import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import FormulaAdd from "./FormulaAdd";

// Model(s)
import FormulaModel from "../../models/FormulaModel";
import { mapDataOptions4Select } from "../../utils/html";

/**
 * @class FormulaEdit
 */
export default class FormulaEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._formulaModel = new FormulaModel();

    // Init state
    this.state = {
      /** @var {ReviewEntity} */
      crmReviewEnt: null,
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let FormulaEnt = await this._formulaModel.read(ID).catch(() => {
        setTimeout(() => window._$g.rdr("/404"));
      });

      FormulaEnt && this.setState({ FormulaEnt });
    })();
    //.end
  }

  render() {
    let { FormulaEnt } = this.state;

    // Ready?
    if (!FormulaEnt) {
      return <Loading />;
    }

    return <FormulaAdd AttributesEnt={FormulaEnt} {...this.props} />;
  }
}
