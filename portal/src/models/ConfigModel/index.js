
import Model from '../Model';

export default class ConfigModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = 'config';

  static API_CONFIG_LIST_PLACEMENT_BANNER = 'config/banner/placement';
  static API_CONFIG_LIST_PAGE_CONFIG = 'config/pages/:page';

  primaryKey = 'config_id';

  getListPlacementForBanner(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_CONFIG_LIST_PLACEMENT_BANNER, data);
  }

  getPageConfig(page){
    return this._api.get(_static.API_CONFIG_LIST_PAGE_CONFIG.replace(':page', page), {});
  }

  updatePageConfig(page, config = {}) {
    return this._api.put(_static.API_CONFIG_LIST_PAGE_CONFIG.replace(':page', page), config);
  }
  

}
// Make alias
const _static = ConfigModel;
