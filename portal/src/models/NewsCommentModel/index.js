import Model from "../Model";
export default class NewsCommentModel extends Model {
  static API_NEWS_COMMENT_LIST = "news-comment";
  static API_NEWS_COMMENT_REVIEW = "news-comment/review";
  static API_NEWS_COMMENT_DELETE = "news-comment/delete";
  getListComment(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_NEWS_COMMENT_LIST, data);
  }
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_NEWS_COMMENT_LIST, data);
  }
  review(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_NEWS_COMMENT_REVIEW, data);
  }
  delete(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_NEWS_COMMENT_DELETE, data);
  }
}
const _static = NewsCommentModel;
