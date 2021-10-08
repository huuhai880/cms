import Model from "../Model";
export default class LetterModel extends Model {
  static API_LETTER_LIST = "letter";
  static API_LETTER_DETAIL = "letter/:letter_id";
  static API_LETTER_CHECK = "letter/check-letter";
  static API_LETTER_DELETE = "letter/:letter_id/delete";

  getListLetter(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_LETTER_LIST, data);
  }
  create(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_LETTER_LIST, data);
  }
  checkLetter(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_LETTER_CHECK, data);
  }
  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.put(_static.API_LETTER_DELETE.replace(":letter_id", id), data);
  }
  detail(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_LETTER_DETAIL.replace(":letter_id", id), data);
  }
}
const _static = LetterModel;
