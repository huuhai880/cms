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
        let data = Object.assign({}, _data);
        return this._api.get(_static.API_ORDER_DETAIL.replace(":order_id", id), data);
    }

    delete(id, _data = {}) {
        let data = Object.assign({}, _data);
        return this._api.put(_static.API_ORDER_DELETE.replace(":order_id", id), data);
    }

    init(order_id) {
        return this._api.get(`/order/init/${order_id}`)
    }

    createOrUpdateOrder(values) {
        return this._api.post('/order', values)
    }

    getOptionProduct() {
        return this._api.get('/order/option')
    }

    getListDiscountApply(values) {
        return this._api.post('/order/discount-apply', values)
    }
}
const _static = OrderModel;
