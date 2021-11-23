//
import Model from "../Model";
import AttributesGroupEntity from "../AttributesGroupEntity";
//

/**
 * @class AttributesGroupModel
 */
export default class AttributesGroupModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "attributes-group";

  /** @var {String} */
  static API_ATTRIBUTESGROUP_GET_LIST = "attributes-group";
  static API_ATTRIBUTESGROUP_DETAIL = "attributes-group/:id";

  /**
   * @var {String} Primary Key
   */
  primaryKey = "attributes_group_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @return {Object}
   */
  fillable = () => ({
    attributes_group_id: "",
    group_name: "",
    description: "",
    instruction:"",
    is_active: 1,
    is_powerditagram: 0,
    is_emptyditagram: 0,
    symbol: '',
    icon_image: null
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
    return this._api.get(_static.API_ATTRIBUTESGROUP_GET_LIST, opts);
  }

  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.delete(
      _static.API_ATTRIBUTESGROUP_DETAIL.replace(":id", id),
      data
    );
  }

  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_ATTRIBUTESGROUP_GET_LIST, data);
  }

  update(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_ATTRIBUTESGROUP_DETAIL.replace(":id", id),
      data
    );
  }

  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api
      .get(_static.API_ATTRIBUTESGROUP_DETAIL.replace(":id", id), data)
      .then((data) => new AttributesGroupEntity(data));
  }
}
// Make alias
const _static = AttributesGroupModel;
