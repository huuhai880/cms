//
import Model from '../Model';
import ContractEntity from '../ContractEntity';

// Util(s)

/**
 * @class ContractModel
 */
export default class ContractModel extends Model
{
  /** @var {String} redux store::state key */
  _stateKeyName = 'contracts';

  /** @var {Ref} */
  _entity = ContractEntity;

  /** @var {String} */
  static API_LIST = 'contract';
  /** @var {String} */
  static API_OPTS = 'contract/get-options';
  /** @var {String} */
  static API_CREATE = 'contract';
  /** @var {String} */
  static API_UPDATE = 'contract/:id'; // PUT
  /** @var {String} */
  static API_READ = 'contract/:id'; // GET
  /** @var {String} */
  static API_DELETE = 'contract/:id'; // DELETE
  /** @var {String} */
  static API_CHANGE_STATUS = 'contract/:id/change-status';
  /** @var {String} */
  static API_EXPORT_EXCEL = 'contract/export-excel';
  /** @var {String} */
  static API_PRODUCT_INFO = 'contract/product-info'; // POST
  /** @var {String} */
  static API_APPROVED = 'contract/:id/approved'; // PUT
  /** @var {String} */
  static API_TRANSFER = 'contract/:id/transfer'; // PUT
  /** @var {String} */
  static API_FREEZE = 'contract/:id/freeze'; // PUT

  /**
   * @var {String} Primary Key
   */
  static primaryKey = ContractEntity.primaryKey;

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = '';

  /**
   * @return {Object}
   */
  fillable = () => new ContractEntity();

  /**
   * @return {Object}
   */
  fillableForTransfer = () => ({
    // @var {Number|String}
    member_transfer: "",
    // @var {Number|String}
    member_receive: "",
    // @var {String|Number}
    transfer_note: "",
  });

  /**
   * @return {Object}
   */
  fillableForFreeze = () => ({
    // @var {String}
    start_date_freeze: "",
    // @var {String}
    end_date_freeze: "",
    // @var {String|Number}
    document_id: "",
    // @var {Array}
    documents: [
      // {
      //   // @var {String}
      //   attachment_name: "",
      //   // @var {String}
      //   attachment_path: ""
      // }
    ],
  });

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
   * Get options (list opiton)
   * @returns Promise
   */
  getOptionsFull(_opts)
  {
    // Format options
    let opts = _opts || {};
    let apiOpts = Object.assign({
      itemsPerPage: _static._MAX_ITEMS_PER_PAGE,
      exclude_id: []
    }, opts['_api']);
    delete opts['_api'];

    //
    return this.getList(apiOpts)
      .then(({ items }) => {
        let excludeIdStr = "|" + apiOpts.exclude_id.join('|') + "|";
        let ret = (items || []).map(
          ({ contract_id: id, contract_name: name, description }) => {
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
   * @return {Promise}
   */
  create(_data = {})
  {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    // console.log('Contract#create: ', data);
    //
    return this._api.post(_static.API_CREATE, data);
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
  read(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_READ.replace(':id', id), data)
      .then((data) => new ContractEntity(data))
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
    return this._api.put(_static.API_UPDATE.replace(':id', id), data);
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
   * @return {Promise}
   */
  approve(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_APPROVED.replace(':id', id), data);
  }

  /**
   * @return {Promise}
   */
  transfer(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_TRANSFER.replace(':id', id), data);
  }

  /**
   * @return {Promise}
   */
  freeze(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_FREEZE.replace(':id', id), data);
  }

  /**
   * @return {Promise}
   */
  productInfo(list_product = [])
  {
    // Validate data?!
    // ...
    //
    return this._api.post(_static.API_PRODUCT_INFO, { list_product });
  }

  /**
   * @return {Promise}
   */
  exportExcel(_data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.file(_static.API_EXPORT_EXCEL, data);
  }
}
// Make alias
const _static = ContractModel;
