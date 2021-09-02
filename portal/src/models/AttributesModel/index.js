//
import Model from "../Model";
import AttributesEntity from "../AttributesEntity";
//

/**
 * @class AttributesModel
 */
export default class AttributesModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "attributes";

  /** @var {String} */
  static API_ATTRIBUTES_GET_LIST = "attributes";
  static API_ATTRIBUTES_DETAIL = "attributes/:id";
  static API_ATTRIBUTES_OPTS_PARTNER = "attributes/get-options-partner";
  static API_ATTRIBUTES_OPTS_GROUP = "attributes/get-options-group";
  static API_ATTRIBUTES_OPTS_MAINNUMBER = "attributes/get-options-main-number";

  
  /**
   * @var {String} Primary Key
   */
  primaryKey = "attribute_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @return {Object}
   */
  fillable = () => ({
    attribute_id: "",
    attribute_name: "",
    attributes_group_id: "",
    main_number_id: null,
    description: "",
    is_active: 1,
    list_attributes_image: [
      {
        images_id: "",
        partner_id: null,
        url_images: "",
        is_default: 1,
        is_active_image: "",
      },
    ],
    check_is_default: "",
    check_image: "",
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
    return this._api.get(_static.API_ATTRIBUTES_GET_LIST, opts);
  }

  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.delete(
      _static.API_ATTRIBUTES_DETAIL.replace(":id", id),
      data
    );
  }

  getOptionPartner(opts) {
    return this._api.get(_static.API_ATTRIBUTES_OPTS_PARTNER, opts);
  }

  getOptionGroup(opts) {
    return this._api.get(_static.API_ATTRIBUTES_OPTS_GROUP, opts);
  }

  getOptionMainNumber(opts) {
    return this._api.get(_static.API_ATTRIBUTES_OPTS_MAINNUMBER, opts);
  }

  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_ATTRIBUTES_GET_LIST, data);
  }

  update(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_ATTRIBUTES_DETAIL.replace(":id", id),
      data
    );
  }

  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api
      .get(_static.API_ATTRIBUTES_DETAIL.replace(":id", id), data)
      .then((data) => new AttributesEntity(data));
  }
}
// Make alias
const _static = AttributesModel;
