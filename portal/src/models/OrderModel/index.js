import Model from "../Model";
export default class OrderModel extends Model {
  static API_ORDER_LIST = "order";
  static API_ORDER_DETAIL = "order/:order_id";
  static API_ORDER_DETAIL_LIST_PRODUCT = "order/:order_id/product";
  static API_ORDER_DELETE = "order/:order_id/delete";
  getList(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_ORDER_LIST, data);
  }
  detail(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_ORDER_DETAIL.replace(":order_id", id), data);
  }
  listProduct(id, _data = {}) {
    // console.log(id)
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_ORDER_DETAIL_LIST_PRODUCT.replace(":order_id", id), data);
  }
  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    //   return this._api.post(_static.API_MAINNUMBER_DELETE, data);
    return this._api.put(_static.API_ORDER_DELETE.replace(":order_id", id), data);
  }
}
const _static = OrderModel;
