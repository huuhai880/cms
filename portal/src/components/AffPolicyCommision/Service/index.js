import Model from "models/Model";

export default class AffPolicyCommisionService extends Model {
    getList(_data = {}) {
        return this._api.get('/policy-commision', _data);
    }

    delete(id) {
        return this._api.delete(`/policy-commision/${id}`);
    }

    initDataSelect() {
        return this._api.get('/policy-commision/data-select');
    }

    createOrUpdPolicy(values) {
        return this._api.post(`/policy-commision`, values);
    }

    detail(id) {
        return this._api.get(`/policy-commision/${id}`);
    }
}