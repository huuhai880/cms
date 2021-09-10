import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import FormulaByDobAdd from "./FormulaByDobAdd";

// Model(s)
import FormulaByDobModel from "../../models/FormulaByDobModel";

/**
 * @class FormulaByDobEdit
 */
export default class FormulaByDobEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._formulaByDobModel = new FormulaByDobModel();

    // Init state
    this.state = {
      /** @var {ReviewEntity} */
      FormulaByDobEnt: null,
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let FormulaByDobEnt = await this._formulaByDobModel.read(ID).catch(() => {
        setTimeout(() => window._$g.rdr("/404"));
      });
      FormulaByDobEnt = Object.assign(
        {},
        {
          ...FormulaByDobEnt,
          attribute_id: {
            value: FormulaByDobEnt.attribute_id,
            label: FormulaByDobEnt.attribute_name,
          },
          param_id: {
            value: FormulaByDobEnt.param_id,
            label: FormulaByDobEnt.dob_type,
          },
          calculation_id: FormulaByDobEnt.calculation_id
            ? {
                value: FormulaByDobEnt.calculation_id,
                label: FormulaByDobEnt.calculation,
              }
            : "",
          parent_formula_id: FormulaByDobEnt.parent_formula_id
            ? {
                value: FormulaByDobEnt.parent_formula_id,
                label: FormulaByDobEnt.parent_formula_name,
              }
            : "",
          parent_calculation_id: FormulaByDobEnt.parent_calculation_id
            ? {
                value: FormulaByDobEnt.parent_calculation_id,
                label: FormulaByDobEnt.parent_calculation_name,
              }
            : "",
        }
      );
      FormulaByDobEnt && this.setState({ FormulaByDobEnt });
    })();
    //.end
  }

  render() {
    let { FormulaByDobEnt } = this.state;

    // Ready?
    if (!FormulaByDobEnt) {
      return <Loading />;
    }

    return (
      <FormulaByDobAdd FormulaByDobEnt={FormulaByDobEnt} {...this.props} />
    );
  }
}
