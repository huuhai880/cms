//
import Model from "../Model";
import ParamNameEntity from "../ParamNameEntity";
//

/**
 * @class ParamNumberModel
 */
export default class ParamNumberModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "param-name";

  /** @var {String} */
  static API_PARAMNAME_GET_LIST = "param-name";
  static API_PARAMNAME_DETAIL = "param-name/:id";

  /**
   * @var {String} Primary Key
   */
  primaryKey = "param_name_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @return {Object}
   */
  fillable = () => ({
    param_name_id: "",
    name_type: "",
    is_last_name: null,
    is_first_name: "",
    is_full_name: "",
    is_first_middle_name: "",
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
    return this._api.get(_static.API_PARAMNAME_GET_LIST, opts);
  }

  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.delete(
      _static.API_PARAMNAME_DETAIL.replace(":id", id),
      data
    );
  }

  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_PARAMNAME_GET_LIST, data);
  }

  update(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_PARAMNAME_DETAIL.replace(":id", id), data);
  }

  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api
      .get(_static.API_PARAMNAME_DETAIL.replace(":id", id), data)
      .then((data) => new ParamNameEntity(data));
  }
}
// Make alias
const _static = ParamNumberModel;
