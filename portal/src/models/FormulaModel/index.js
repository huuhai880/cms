//
import Model from "../Model";
import FormulaEntity from "../FormulaEntity";
//

/**
 * @class FormulaModel
 */
export default class FormulaModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "formula";

  /** @var {String} */
  static API_FOR_FOMULA_GET_LIST = "formula";
  static API_FOR_FOMULA_DETAIL = "formula/:id";
  static API_FOR_FOMULA_OPTS_ATTRIBUTES = "formula/get-options-attributes";
  static API_FOR_FOMULA_OPTS_FORMULA = "formula/get-options-formula";
  static API_FOR_FOMULA_OPTS_CALCULATION = "formula/get-options-calculation";

  /**
   * @var {String} Primary Key
   */
  primaryKey = "formula_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @return {Object}
   */
  fillable = () => ({
    formula_id: "",
    formula_name: "",
    attribute_id: "",
    description: "",
    is_day: "",
    is_month: "",
    is_year: "",
    is_total_shortened: "",
    last_2_digits: "",
    parent_formula_id: "",
    parent_calculation_id: "",
    calculation_id: "",
    index_1: "",
    index_2: "",
    key_milestones: "",
    second_milestones: "",
    challenging_milestones: "",
    age_milestones: "",
    year_milestones: "",
    values: "",
    is_active: 1,
  });

  /**
   *
   * @param {object} data
   */

  /**
   * @param {Object} _opts
   */
  getList(_opts = {}) {
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_FOR_FOMULA_GET_LIST, opts);
  }

  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.delete(
      _static.API_FOR_FOMULA_DETAIL.replace(":id", id),
      data
    );
  }

  getOptionAttributes(opts) {
    return this._api.get(_static.API_FOR_FOMULA_OPTS_ATTRIBUTES, opts);
  }

  getOptionFormula(opts) {
    return this._api.get(_static.API_FOR_FOMULA_OPTS_FORMULA, opts);
  }

  getOptionMainCalculaion(opts) {
    return this._api.get(_static.API_FOR_FOMULA_OPTS_CALCULATION, opts);
  }

  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_FOR_FOMULA_GET_LIST, data);
  }

  update(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_FOR_FOMULA_DETAIL.replace(":id", id),
      data
    );
  }

  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api
      .get(_static.API_FOR_FOMULA_DETAIL.replace(":id", id), data)
      .then((data) => new FormulaEntity(data));
  }
}
// Make alias
const _static = FormulaModel;
