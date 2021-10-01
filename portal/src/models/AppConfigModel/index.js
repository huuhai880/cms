//
import Model from "../Model";
import AppConfigEntity from "../AppConfigEntity";

// Util(s)

/**
 * @class AppConfigModel
 */
export default class AppConfigModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "app_config";

  /**
   * @var {Ref}
   */
  _entity = AppConfigEntity;

  /**
   * @var {String}
   */
  static API_APPCONFIG_DETAIL_PAGE = "config/pages/:page";
  /** @var {String} */

  primaryKey = "config_id";

  /**
   * @var {Object}
   */
  fillable = () => ({});

  getPageConfig(page, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_APPCONFIG_DETAIL_PAGE.replace(":page", page), data);
  }
  updatePageConfig(page, _data = {}) {
    let data = Object.assign({}, _data);
    console.log(page, data);
    return this._api.put(_static.API_APPCONFIG_DETAIL_PAGE.replace(":page", page), data);
  }
}
// Make alias
const _static = AppConfigModel;
