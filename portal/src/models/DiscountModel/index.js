import Model from "../Model";
export default class DiscountModel extends Model {
  static API_DISCOUNT_LIST = "discount";
  static API_DISCOUNT_DETAIL = "discount/:discount_id";
  static API_DISCOUNT_CHECK = "discount/check-DISCOUNT";
  static API_DISCOUNT_DELETE = "discount/:discount_id/delete";
  static API_DISCOUNT_OPTION = "discount/getOption";


  getListDiscount(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_DISCOUNT_LIST, data);
  }
  create(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_DISCOUNT_LIST, data);
  }
  checkDisCount(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_DISCOUNT_CHECK, data);
  }
  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.put(_static.API_DISCOUNT_DELETE.replace(":discount_id", id), data);
  }
  detail(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_DISCOUNT_DETAIL.replace(":discount_id", id), data);
  }

  getOptions( _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_DISCOUNT_OPTION, data);
  }


}
const _static = DiscountModel;
