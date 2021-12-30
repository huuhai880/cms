import Model from "../Model";

export default class ParamOtherModel extends Model {
    getList(_data = {}) {
        return this._api.get('/param-other', _data);
    }

    delete(id) {
        return this._api.delete(`/param-other/${id}`);
    }

    createOrUpdate(_data = {}) {
        return this._api.post('/param-other', _data);
    }

    read(id) {
        return this._api.get(`/param-other/${id}`)
    }

    option() {
        return this._api.get(`/param-other/option`)
    }
}