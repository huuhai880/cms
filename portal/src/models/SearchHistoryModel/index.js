//
import Model from "../Model";
import SearchHistoryEntity from "../SearchHistoryEntity";
//

/**
 * @class SearchHistoryModel
 */
export default class SearchHistoryModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "search-history";

  /** @var {String} */
  static API_SEARCHHISTORY_GET_LIST = "search-history";
  static API_SEARCHHISTORY_DETAIL = "search-history/:id";
  static API_SEARCHHISTORY_PRODUCT_DETAIL = "search-history/product/:id";

  /**
   * @var {String} Primary Key
   */
  primaryKey = "search_history_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @return {Object}
   */
  fillable = () => ({
    member_id: "",
    full_name: "",  
    search_date: null,
    is_active: "",
    list_product: [
      {
        product_id: "",
        product_name: "",
        search_count: "",
      },
    ],
  });

  /**
   *
   * @param {object} data
   */

  /**
   * @param {Object} _opts
   */
  getList(_opts = {}) {
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_SEARCHHISTORY_GET_LIST, opts);
  }

  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.delete(
      _static.API_SEARCHHISTORY_DETAIL.replace(":id", id),
      data
    );
  }

  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api
      .get(_static.API_SEARCHHISTORY_DETAIL.replace(":id", id), data)
  }

  getListProduct(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api
      .get(_static.API_SEARCHHISTORY_PRODUCT_DETAIL.replace(":id", id), data)
  }
}
// Make alias
const _static = SearchHistoryModel;
