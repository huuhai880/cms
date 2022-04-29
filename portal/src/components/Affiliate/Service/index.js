import Model from "models/Model";

export default class AffiliateService extends Model {
    getListAffiliate(_data = {}) {
        return this._api.get('/affiliate', _data);
    }

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

    getDataOfAffiliate(values) {
        return this._api.get(`/affiliate/data`, values);
    }

    getListAffRequest(values) {
        return this._api.get(`/affiliate/request`, values);
    }

    detailAffRequest(id) {
        return this._api.get(`/affiliate/request/${id}`);
    }

    rejectAffRequest(values) {
        return this._api.post(`/affiliate/request/reject`, values);
    }

    approveAffRequest(values) {
        return this._api.post(`/affiliate/request/approve`, values);
    }

    updateStatusAff(values, id) {
        return this._api.put(`/affiliate/${id}`, values);
    }

    updPolicyCommisionApply(values) {
        return this._api.post(`/affiliate/policy-commision`, values);
    }
}