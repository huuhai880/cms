//
import Model from "../Model";
import FormulaByNameEntity from "../FormulaByNameEntity";
//

/**
 * @class FormulaByNameModel
 */
export default class FormulaByNameModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "formula-by-name";

  /** @var {String} */
  static API_FOR_FOMULABYNAME_GET_LIST = "formula-by-name";
  static API_FOR_FOMULABYNAME_DETAIL = "formula-by-name/:id";
  static API_FOR_FOMULABYNAME_OPTS_LETTER =
    "formula-by-name/get-options-letter";
  static API_FOR_FOMULABYNAME_OPTS_ATTRIBUTES =
    "formula-by-name/get-options-attributes";
  static API_FOR_FOMULABYNAME_OPTS_FORMULA =
    "formula-by-name/get-options-formula";
  static API_FOR_FOMULABYNAME_OPTS_CALCULATION =
    "formula-by-name/get-options-calculation";

  /**
   * @var {String} Primary Key
   */
  primaryKey = "formula_by_name_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @return {Object}
   */
  fillable = () => ({
    formula_name_id: "",
    formula_name: "",
    attribute_id: "",
    description: "",
    is_total_shortened: null,
    is_2_digit: "",
    is_1_digit: "",
    first_letter: "",
    last_letter: "",
    only_first_vowel: "",
    total_vowels: "",
    total_values: "",
    count_of_num: "",
    total_consonant: "",
    total_letters: "",
    num_show_3_time: "",
    total_first_letter: "",
    num_of_letters: "",
    num_show_0_time: "",
    param_name_id: "",
    is_expression: "",
    calculation_id: "",
    parent_formula_id: "",
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
    return this._api.get(_static.API_FOR_FOMULABYNAME_GET_LIST, opts);
  }

  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.delete(
      _static.API_FOR_FOMULABYNAME_DETAIL.replace(":id", id),
      data
    );
  }

  getOptionLetter(opts) {
    return this._api.get(_static.API_FOR_FOMULABYNAME_OPTS_LETTER, opts);
  }

  getOptionAttributes(opts) {
    return this._api.get(_static.API_FOR_FOMULABYNAME_OPTS_ATTRIBUTES, opts);
  }

  getOptionFormula(opts) {
    return this._api.get(_static.API_FOR_FOMULABYNAME_OPTS_FORMULA, opts);
  }

  getOptionMainCalculaion(opts) {
    return this._api.get(_static.API_FOR_FOMULABYNAME_OPTS_CALCULATION, opts);
  }

  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_FOR_FOMULABYNAME_GET_LIST, data);
  }

  update(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_FOR_FOMULABYNAME_DETAIL.replace(":id", id),
      data
    );
  }

  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api
      .get(_static.API_FOR_FOMULABYNAME_DETAIL.replace(":id", id), data)
      .then((data) => new FormulaByNameEntity(data));
  }
}
// Make alias
const _static = FormulaByNameModel;
