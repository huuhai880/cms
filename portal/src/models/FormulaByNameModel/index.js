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
  static API_FOR_FOMULABYNAME_OPTS_PARAMNAME =
    "formula-by-name/get-options-param-name";
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
    formula_id: "",
    formula_name: "",
    attribute_id: "",
    description: "",
    is_not_shortened: "",
    is_2_digit: "",
    is_1_digit: "",
    is_first_letter: "",
    is_last_letter: "",
    is_only_first_vowel: "",
    check_format: "", // kiểm tra hình thức
    is_total_vowels: "",
    is_total_values: "",
    is_count_of_num: "",
    is_total_consonant: "",
    is_total_letters: "",
    is_num_show_3_time: "",
    is_total_first_letter: "",
    is_num_of_letters: "",
    is_num_show_0_time: "",
    check_calculation: "", // kiểm tra cách tính
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

  getOptionParamName(opts) {
    return this._api.get(_static.API_FOR_FOMULABYNAME_OPTS_PARAMNAME, opts);
  }

  getOptionAttributeGroup(opts) {
    return this._api.get(_static.API_FOR_FOMULABYNAME_OPTS_ATTRIBUTES, opts);
  }

  getOptionFormulaByName(opts) {
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
