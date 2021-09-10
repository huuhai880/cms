import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import FormulaByNameAdd from "./FormulaByNameAdd";

// Model(s)
import FormulaByNameModel from "../../models/FormulaByNameModel";
import { mapDataOptions4Select } from "../../utils/html";

/**
 * @class FormulaByNameEdit
 */
export default class FormulaByNameEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._formulaByNameModel = new FormulaByNameModel();

    // Init state
    this.state = {
      /** @var {ReviewEntity} */
      FormulaByNameEnt: null,
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let FormulaByNameEnt = await this._formulaByNameModel
        .read(ID)
        .catch(() => {
          setTimeout(() => window._$g.rdr("/404"));
        });
      FormulaByNameEnt = Object.assign(
        {},
        {
          ...FormulaByNameEnt,
          attribute_id: {
            value: FormulaByNameEnt.attribute_id,
            label: FormulaByNameEnt.attribute_name,
          },
          param_name_id: {
            value: FormulaByNameEnt.param_name_id,
            label: FormulaByNameEnt.name_type,
          },
          calculation_id: FormulaByNameEnt.calculation_id
            ? {
                value: FormulaByNameEnt.calculation_id,
                label: FormulaByNameEnt.calculation,
              }
            : "",
          parent_formula_id: FormulaByNameEnt.parent_formula_id
            ? {
                value: FormulaByNameEnt.parent_formula_id,
                label: FormulaByNameEnt.parent_formula_name,
              }
            : "",
        }
      );
      FormulaByNameEnt && this.setState({ FormulaByNameEnt });
    })();
    //.end
  }

  render() {
    let { FormulaByNameEnt } = this.state;

    // Ready?
    if (!FormulaByNameEnt) {
      return <Loading />;
    }

    return (
      <FormulaByNameAdd FormulaByNameEnt={FormulaByNameEnt} {...this.props} />
    );
  }
}
