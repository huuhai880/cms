//
import Model from '../Model';
import CampaignTypeEntity from '../CampaignTypeEntity';

// Util(s)

/**
 * @class CampaignTypeModel
 */
export default class CampaignTypeModel extends Model
{
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = 'campaign_types';

  /**
   * @var {Ref}
   */
  _entity = CampaignTypeEntity;

  /**
   * @var {String}
   */
  static API_CAMPAIGN_TYPE_LIST = 'campaign-type';
  /** @var {String} */
  static API_CAMPAIGN_TYPE_DETAIL = 'campaign-type/:id';
  /** @var {String} */
  static API_CAMPAIGN_TYPE_OPTS = 'campaign-type/get-options';
  /** @var {String} */
  static API_CAMPAIGN_TYPE_OPTS_4LIST = 'campaign-type/get-options-for-list';
  /** @var {String} */
  static API_CAMPAIGN_TYPE_OPTS_4CREATE = 'campaign-type/get-options-for-create';
  /** @var {String} */
  static API_CAMPAIGN_TYPE_LIST_CAMPAIGN_RL_USER = 'campaign-type/get-list-campaign-rl-user';
  /** @var {String} */
  static API_CAMPAIGN_TYPE_CHANGE_STATUS = 'campaign-type/:id/change-status';
  /**
   * @var {String} Primary Key
   */
  primaryKey = 'campaign_type_id';

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = '';

  /**
   * @var {Object}
   */
  fillable = () => ({
    "campaign_type_name": "",
    "description": "",
    "order_index": 0,
    "is_active": 1,
    "is_auto_review": 1,
    "add_function_id": "",
    "edit_function_id": "",
    "delete_function_id": "",
    "campaign_type_relevels": []
  });

  /**
   *
   */
  getList(_data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_CAMPAIGN_TYPE_LIST, data);
  }

  /**
   * Get options (list opiton)
   * @param {Object} _opts
   * @returns Promise
   */
  getOptions(_opts)
  {
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_CAMPAIGN_TYPE_OPTS, opts);
  }

  /**
   * Get options for list
   * @param {Object} _opts
   * @returns Promise
   */
  getOptions4List(_opts)
  {
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_CAMPAIGN_TYPE_OPTS_4LIST, opts);
  }

  /**
   * Get options for create
   * @param {Object} _opts
   * @returns Promise
   */
  getOptions4Create(_opts)
  {
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_CAMPAIGN_TYPE_OPTS_4CREATE, opts);
  }

  /**
   * Get options (list opiton)
   * @returns Promise
   */
  getOptionsFull(_opts)
  {
    // Format options
    let opts = _opts || {};
    let apiOpts = Object.assign({
      itemsPerPage: 256, // Number.MAX_SAFE_INTEGER // @TODO: get all records
      exclude_id: []
    }, opts['_api']);
    delete opts['_api'];

    //
    return this.getList(apiOpts)
      .then(({ items }) => {
        let excludeIdStr = "|" + apiOpts.exclude_id.join('|') + "|";
        let ret = (items || []).map(
          ({ campaign_type_id: id, campaign_type_name: name, description }) => {
              // Nam trong list exclude --> set null
              if (excludeIdStr.indexOf("|" + id + "|") >= 0) {
                return null;
              }
              return ({ name, id, description });
            }
        );
        // Filter null items
        return ret.filter(item => item);
      });
  }

  /**
   * 
   * @returns Promise
   */
  getListCampaignRLUser(campaign_type_id, _opts)
  {
    let opts = Object.assign({
      campaign_type_id
    }, _opts);
    return this._api.get(_static.API_CAMPAIGN_TYPE_LIST_CAMPAIGN_RL_USER, opts)
      .then(({ items }) => (items));
  }

  /**
   *
   */
  create(_data = {})
  {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_CAMPAIGN_TYPE_LIST, data);
  }

  /**
   *
   */
  edit(id, _data)
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_CAMPAIGN_TYPE_DETAIL.replace(':id', id), data);
  }
  /**
   *
   */
  changeStatus(id, _data)
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_CAMPAIGN_TYPE_CHANGE_STATUS.replace(':id', id), data);
  }
  /**
   * @return {Promise}
   */
  delete(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.delete(_static.API_CAMPAIGN_TYPE_DETAIL.replace(':id', id), data);
  }

  /**
   *
   */
  read(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_CAMPAIGN_TYPE_DETAIL.replace(':id', id), data)
      .then((data) => new CampaignTypeEntity(data))
    ;
  }

  /**
   * @return {Promise}
   */
  update(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_CAMPAIGN_TYPE_DETAIL.replace(':id', id), data);
  }
}
// Make alias
const _static = CampaignTypeModel;
