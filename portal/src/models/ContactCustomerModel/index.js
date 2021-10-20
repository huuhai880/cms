
import Model from '../Model';
import ContactCustomerEntity from '../ContactCustomerEntity';

export default class ContactCustomerModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = 'author';

  static API_CONTACT_CUSTOMER_LIST = 'contact-customer';
  static API_CONTACT_CUSTOMER_DETAIL = 'contact-customer/detail/:id';
  static API_CONTACT_CUSTOMER_OPTS = 'contact-customer/get-options';
  static API_CONTACT_CUSTOMER_UPDATE = 'contact-customer/:id';

  primaryKey = 'contact_customer_id';

  fillable = () => ({

    "full_name": null,
    "phone_number": null,
    "full_name": null,
    "email": null,
    "content": null,
    "contact_status": null,
    "note": null,
    "contact_id": null
  
  });


  getList(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_CONTACT_CUSTOMER_LIST, data);
  }

  getOptions(opts) {
    return this._api.get(_static.API_CONTACT_CUSTOMER_OPTS, opts);
  }

  // create(_data = {}) {
  //   let data = Object.assign({}, this.fillable(), _data);
  //   return this._api.post(_static.API_CONTACT_CUSTOMER_LIST, data);
  // }

  update(id, _data) {
    let data = Object.assign({}, _data);
    return this._api.put(_static.API_CONTACT_CUSTOMER_UPDATE.replace(':id', id), data);
  }


  delete(id, _data = {}) {
    return this._api.delete(_static.API_CONTACT_CUSTOMER_UPDATE.replace(':id', id));
  }

  read(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_CONTACT_CUSTOMER_DETAIL.replace(':id', id), data)
      .then((data) => new ContactCustomerEntity(data))
      ;
  }

}
// Make alias
const _static = ContactCustomerModel;
