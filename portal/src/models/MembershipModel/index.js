import Model from "../Model";

export default class MembershipModel extends Model {
    getList(_data = {}) {
        return this._api.get('/membership', _data);
    }
}