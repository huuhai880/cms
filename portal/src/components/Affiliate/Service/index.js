import Model from "models/Model";

export default class AffiliateService extends Model {
    getList(_data = {}) {
        return this._api.get('/affiliate', _data);
    }

    // read(id) {
    //     return this._api.get(`/withdraw-request/${id}`)
    // }

    // upload(_data = {}) {
    //     return this._api.post('/upload-file', _data);
    // }

    // accept(value) {
    //     return this._api.post(`/withdraw-request/accept`, value)
    // }

    // reject(value) {
    //     return this._api.post(`/withdraw-request/reject`, value)
    // }
}