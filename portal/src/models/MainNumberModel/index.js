import Model from "../Model";
export default class NewsCommentModel extends Model {
  static API_MAINNUMBER_LIST = "main-number";
  static API_MAINNUMBER_IMAGES_LIST = "main-number/:mainNumber_id/image-by-numerid";
  static API_MAINNUMBER_PARTNER_LIST = "main-number/partner";
  static API_MAINNUMBER_PARTNER_DETAIL = "main-number/:mainNumber_id";

  static API_MAINNUMBER_DELETE = "main-number/:mainNumber_id/delete";
  listNumImg(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_MAINNUMBER_IMAGES_LIST.replace(":mainNumber_id", id), data);
  }
  getListNumber(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_MAINNUMBER_LIST, data);
  }
  getListPartner(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_MAINNUMBER_PARTNER_LIST, data);
  }
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_MAINNUMBER_LIST, data);
  }
  // review(_data = {}) {
  //   // Validate data?!
  //   let data = Object.assign({}, _data);
  //   return this._api.post(_static.API_NEWS_COMMENT_REVIEW, data);
  // }
  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    //   return this._api.post(_static.API_MAINNUMBER_DELETE, data);
    return this._api.put(_static.API_MAINNUMBER_DELETE.replace(":mainNumber_id", id), data);
  }
  detail(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_MAINNUMBER_PARTNER_DETAIL.replace(":mainNumber_id", id), data);
  }
}
const _static = NewsCommentModel;
