import Model from "models/Model";

export default class PageService extends Model {
    getList(_data = {}) {
        return this._api.get('/page', _data);
    }

    delete(id, _data = {}) {
        return this._api.delete(`/page/${id}`, _data);
    }

    createOrUpdate(_data = {}) {
        return this._api.post('/page', _data);
    }

    read(id) {
        return this._api.get(`/page/${id}`)
    }
}