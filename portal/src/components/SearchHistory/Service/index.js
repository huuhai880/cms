import Model from "models/Model";

export default class SearchHistoryService extends Model {
    getList(_data = {}) {
        return this._api.get('/search-history/free', _data);
    }

    getOptionProduct() {
        return this._api.get('/search-history/option-product');
    }
}