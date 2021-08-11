//
import Model from "../Model";
import PartnerEntity from '../PartnerEntity';
//

/**
 * @class PartnerModel
 */
export default class PartnerModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "partner";

  /** @var {String} */
  static API_PARTNER_GET_LIST = "partner";
  static API_PARTNER_DETAIL = "partner/:id";

  /**
   * @var {String} Primary Key
   */
  primaryKey = "partner_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @return {Object}
   */
  fillable = () => ({
    partner_id: "",
    partner_name: "",
    address: "",
    bank_account_id: "",
    bank_account_name: "",
    bank_name: "",
    bank_routing: "",
    country_id: null,
    district_id: null,
    email: "",
    fax: "",
    is_active: 1,
    open_date: "",
    phone_number: "",
    province_id: null,
    tax_id: "",
    ward_id: null,
    zip_code: "",
    ower_name: "",
    ower_email: "",
    user_name: "",
    password: "",
    ower_phone_1: "",
    ower_phone_2: "",
  });

  /**
   *
   * @param {object} data
   */
  // constructor(data) { super(data); }

  /**
   * @param {Object} _opts
   */
  getList(_opts = {}) {
    // Get, format options
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_PARTNER_GET_LIST, opts);
  }

  delete(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.delete(
      _static.API_PARTNER_DETAIL.replace(":id", id),
      data
    );
  }

  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_PARTNER_GET_LIST, data);
  }

  update(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(
      _static.API_PARTNER_DETAIL.replace(":id", id),
      data
    );
  }

  read(id, _data = {})
  {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_PARTNER_DETAIL.replace(':id', id), data)
      .then((data) => new PartnerEntity(data))
    ;
  }
}
// Make alias
const _static = PartnerModel;
