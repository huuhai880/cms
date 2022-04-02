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

    getOption() {
        return this._api.get('/affiliate/option');
    }

    init() {
        return this._api.get('/affiliate/init');
    }

    createAff(values) {
        return this._api.post('/affiliate', values);
    }

    getDetailAff(id) {
        return this._api.get(`/affiliate/${id}`);
    }

    reviewAff(values) {
        return this._api.post('/affiliate/review', values);
    }

    upLevelAff(values) {
        return this._api.post('/affiliate/up-level', values);
    }

    infoAff(id) {
        return this._api.get(`/affiliate/detail/${id}`);
    }

    reportOfAff(values) {
        return this._api.get(`/affiliate/report`, values);
    }

    getListOrderAff(values) {
        return this._api.get(`/affiliate/order`, values);
    }

    getListCustomerAff(values) {
        return this._api.get(`/affiliate/customer`, values);
    }

    getListMemberAff(values) {
        return this._api.get(`/affiliate/member`, values);
    }

    getListAffRequest(values) {
        return this._api.get(`/affiliate/request`, values);
    }

    detailAffRequest(id){
        return this._api.get(`/affiliate/request/${id}`);
    }

    rejectAffRequest(values){
        return this._api.post(`/affiliate/request/reject`, values);
    }

    approveAffRequest(values){
        return this._api.post(`/affiliate/request/approve`, values);
    }
}