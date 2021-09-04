//
import Model from "../Model";
import CustomerTypeEntity from "../CustomerTypeEntity";

// Util(s)

/**
 * @class CustomerDataLeadModel
 */
export default class CustomerTypeModel extends Model {
  /** @var {String} redux store::state key */
  _stateKeyName = "customer-type";

  /** @var {Ref} */
  _entity = CustomerTypeEntity;

  /**
   * @var {String}
   */
  static API_CUSTOMER_TYPE_LIST = "customer-type";
  /** @var {String} */
  static API_CUSTOMER_TYPE_DETAIL = "customer-type/:id";

  /** @var {String} Primary Key */
  primaryKey = "customer_type_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @return {Object}
   */
  fillable = () => ({
    customer_type_id: "",
    customer_type_name: "",
    description: "",
    is_default: 1,
    is_active: 1,
    order_index: 1,
  });

  /**
   *
   */
  getList(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_CUSTOMER_TYPE_LIST, data);
  }

  /**
   *
   */
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_CUSTOMER_TYPE_LIST, data);
  }

  /**
   *
   */
  update(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.put(
      _static.API_CUSTOMER_TYPE_DETAIL.replace(":id", id),
      data
    );
  }

  /**
   * @return {Promise}
   */
  delete(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.delete(
      _static.API_CUSTOMER_TYPE_DETAIL.replace(":id", id),
      data
    );
  }

  /**
   *
   */
  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api
      .get(_static.API_CUSTOMER_TYPE_DETAIL.replace(":id", id), data)
      .then((data) => new CustomerTypeEntity(data));
  }
}
// Make alias
const _static = CustomerTypeModel;
