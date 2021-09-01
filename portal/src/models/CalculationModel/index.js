//
import Model from "../Model";
import CalculationEntity from "../CalculationEntity";
//

/**
 * @class CalculationModel
 */
export default class CalculationModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "calculation";

  /** @var {String} */
  static API_CALCULATION_GET_LIST = "calculation";
  static API_CALCULATION__DETAIL = "calculation/:id";

  /**
   * @var {String} Primary Key
   */
  primaryKey = "calculation_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @return {Object}
   */
  fillable = () => ({
    calculation_id: "",
    calculation: "",
    description: "",
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
    return this._api.get(_static.API_CALCULATION_GET_LIST, opts);
  }

  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.delete(
      _static.API_CALCULATION__DETAIL.replace(":id", id),
      data
    );
  }

  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_CALCULATION_GET_LIST, data);
  }

  update(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_CALCULATION__DETAIL.replace(":id", id),
      data
    );
  }

  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api
      .get(_static.API_CALCULATION__DETAIL.replace(":id", id), data)
      .then((data) => new CalculationEntity(data));
  }
}
// Make alias
const _static = CalculationModel;
