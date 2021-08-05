//
import Model from '../Model';
import DocumentEntity from '../DocumentEntity';

// Util(s)

/**
 * @class DocumentModel
 */
export default class DocumentModel extends Model
{
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = 'document';

  /**
   * @var {Ref}
   */
  _entity = DocumentEntity;

  /** @var {String} */
  static API_LIST = 'document';
  /** @var {String} */
  static API_OPTS = 'document/get-options';
  /** @var {String} */
  static API_DETAIL = 'document/:id'; //GET
  /** @var {String} */
  static API_DELETE = 'document/:id'; //DELETE
  /** @var {String} */
  static API_CHANGE_STATUS = 'document/:id/change-status'; //PUT
  /**
   * @var {String} Primary Key
   */
  static primaryKey = DocumentEntity.primaryKey;

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = '';

  /**
   * @var {Object}
   */
  fillable = () => new DocumentEntity();

  /**
   *
   */
  getList(_data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_LIST, data);
  }

  /**
   * Get options (list opiton)
   * @param {Object} _opts
   * @returns Promise
   */
  getOptions(_opts)
  {
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_OPTS, opts);
  }

  /**
   *
   */
  create(_data = {}, isCheckService)
  {
    // Validate data?!
    let data = Object.assign({}, !isCheckService ? this.fillableDocument() : this.fillableService(), _data);
    return this._api.post(_static.API_LIST, this.formatData(data));
  }

  /**
   *
   */
  update(id, _data)
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_DETAIL.replace(':id', id), this.formatData(data));
  }

  /**
   *
   */
  changeStatus(id, _data)
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_CHANGE_STATUS.replace(':id', id), data);
  }

  /**
   * @return {Promise}
   */
  delete(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.delete(_static.API_DELETE.replace(':id', id), data);
  }

  /**
   *
   */
  read(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_DETAIL.replace(':id', id), data)
      .then((data) => new DocumentEntity(data))
    ;
  }
}
// Make alias
const _static = DocumentModel;
