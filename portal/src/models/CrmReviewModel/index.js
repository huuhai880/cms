//
import Model from "../Model";
import CrmReviewEntity from "../CrmReviewEntity";
import moment from "moment";
//

/**
 * @class CrmReviewModel
 */
export default class CrmReviewModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "review";

  /** @var {String} */
  static API_REVIEW_GET_LIST = "review";
  static API_REVIEW_DETAIL = "review/:id";
  static API_REVIEW_OPTS_ACCOUNT = "review/get-options-account";
  static API_REVIEW_OPTS_AUTHOR = "review/get-options-author";
  /**
   * @var {String} Primary Key
   */
  primaryKey = "review_id";

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @return {Object}
   */
  fillable = () => ({
    review_id: "",
    member_id: "",
    author_id: "",
    order_index: 1,
    review_content: "",
    review_date: String(
      moment().subtract(1, "minutes").format("DD/MM/YYYY HH:mm:ss")
    ).toString(),
    is_active: 1,
    check_member: true,
    check_author: null,
    image_url: null
  });

  /**
   *
   * @param {object} data
   */

  /**
   * @param {Object} _opts
   */
  getList(_opts = {}) {
    // Get, format options
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_REVIEW_GET_LIST, opts);
  }

  getOptionsAcount(opts) {
    return this._api.get(_static.API_REVIEW_OPTS_ACCOUNT, opts);
  }

  getOptionsAuthor(opts) {
    return this._api.get(_static.API_REVIEW_OPTS_AUTHOR, opts);
  }

  delete(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.delete(_static.API_REVIEW_DETAIL.replace(":id", id), data);
  }

  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_REVIEW_GET_LIST, data);
  }

  update(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_REVIEW_DETAIL.replace(":id", id), data);
  }

  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api
      .get(_static.API_REVIEW_DETAIL.replace(":id", id), data)
      .then((data) => new CrmReviewEntity(data));
  }
}
// Make alias
const _static = CrmReviewModel;
