//
import Model from "../Model";
import FormulaByDobEntity from "../FormulaByDobEntity";
//

/**
 * @class FormulaByDobModel
 */
export default class FormulaByDobModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "formula-by-dob";

  /** @var {String} */
  static API_FOR_FOMULA_GET_LIST = "formula-by-dob";
  static API_FOR_FOMULA_DETAIL = "formula-by-dob/:id";
  static API_FOR_FOMULA_OPTS_PARAMDOB = "formula-by-dob/get-options-paramdob";
  static API_FOR_FOMULA_OPTS_ATTRIBUTES = "formula-by-dob/get-options-attributes";
  static API_FOR_FOMULA_OPTS_FORMULADOB = "formula-by-dob/get-options-formuladob";
  static API_FOR_FOMULA_OPTS_CALCULATION = "formula-by-dob/get-options-calculation";
  
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
    param_id: "",
    is_total_shortened: "",
    last_2_digits: "",
    check_short: "", // kiểm tra dạng
    parent_formula_id: "",
    parent_calculation_id: "",
    calculation_id: "",
    index_1: "",
    index_2: "",
    key_milestones: "",
    second_milestones: "",
    challenging_milestones: "",
    check_milestones: "", // kiểm tra Mốc phát triển
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

  getOptionParamdob(opts) {
    return this._api.get(_static.API_FOR_FOMULA_OPTS_PARAMDOB, opts);
  }

  getOptionAttributesGroup(opts) {
    return this._api.get(_static.API_FOR_FOMULA_OPTS_ATTRIBUTES, opts);
  }

  getOptionFormulaDob(opts) {
    return this._api.get(_static.API_FOR_FOMULA_OPTS_FORMULADOB, opts);
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
      .then((data) => new FormulaByDobEntity(data));
  }
}
// Make alias
const _static = FormulaByDobModel;
