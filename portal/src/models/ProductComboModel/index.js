import Model from "../Model";
import ProductEntity from "../ProductEntity";

export default class ProductComboModel extends Model {
    getList(_data = {}) {
        return this._api.get('/product-combo', _data);
    }

    delete(id, _data = {}) {
        return this._api.delete(`/product-combo/${id}`, _data);
    }

    create(_data = {}) {
        return this._api.post('/product-combo', _data);
    }


    update(id, _data) {
        return this._api.put(`/product-combo/${id}`, _data);
    }

    read(id) {
        return this._api.get(`/product-combo/${id}`)
    }
}