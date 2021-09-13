import Model from "../Model";

export default class PriceModel extends Model {

    getList(_data = {}) {
        return this._api.get('/price', _data);
    }

    delete(id, _data = {}) {
        return this._api.delete(`/price/${id}`, _data);
    }

    create(_data = {}) {
        try {
            return this._api.post('/price', _data);
        } catch (error) {
            throw error;
        }

    }

    update(id, _data) {
        return this._api.put(`/price/${id}`, _data);
    }

    read(id) {
        return this._api.get(`/price/${id}`)
    }
}