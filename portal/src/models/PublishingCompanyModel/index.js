//
import Model from '../Model';
import PublishingCompanyEntity from '../PublishingCompanyEntity';

// Util(s)

/**
 * @class PublishingCompanyModel
 */
export default class PublishingCompanyModel extends Model
{
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = 'publishing_company';

  /**
   * @var {Ref}
   */
  _entity = PublishingCompanyEntity;

  /**
   * @var {String}
   */
  static API_PUBLISHING_COMPANY_LIST = 'publishing-company';
  /** @var {String} */
  static API_PUBLISHING_COMPANY_DETAIL = 'publishing-company/:id';
  /** @var {String} */
  static API_PUBLISHING_COMPANY_OPTS = 'publishing-company/get-options';
  /** @var {String} */
  static API_PUBLISHING_COMPANY_CHANGE_STATUS = 'publishing-company/:id/change-status';
  /**
   * @var {String} Primary Key
   */
  primaryKey = 'publishing_company_id';

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = '';

  /**
   * @var {Object}
   */
  fillable = () => ({});

  /**
   *
   */
  getList(_data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_PUBLISHING_COMPANY_LIST, data);
  }

  /**
   * Get options (list opiton)
   * @param {Object} _opts
   * @returns Promise
   */
  getOptions(_opts)
  {
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_PUBLISHING_COMPANY_OPTS, opts);
  }

  /**
   *
   */
  create(_data = {})
  {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_PUBLISHING_COMPANY_LIST, data);
  }

  /**
   *
   */
  edit(id, _data)
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_PUBLISHING_COMPANY_DETAIL.replace(':id', id), data);
  }
  /**
   *
   */
  changeStatus(id, _data)
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_PUBLISHING_COMPANY_CHANGE_STATUS.replace(':id', id), data);
  }
  /**
   * @return {Promise}
   */
  delete(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.delete(_static.API_PUBLISHING_COMPANY_DETAIL.replace(':id', id), data);
  }

  /**
   *
   */
  read(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_PUBLISHING_COMPANY_DETAIL.replace(':id', id), data)
      .then((data) => new PublishingCompanyEntity(data))
    ;
  }
}
// Make alias
const _static = PublishingCompanyModel;
