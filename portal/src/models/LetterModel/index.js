import Model from "../Model";
export default class LetterModel extends Model {
  static API_LETTER_LIST = "letter";
  //   static API_MAINNUMBER_IMAGES_LIST = "main-number/:mainNumber_id/image-by-numerid";
  //   static API_MAINNUMBER_PARTNER_LIST = "main-number/partner";
  static API_LETTER_DETAIL = "letter/:letter_id";
  static API_LETTER_CHECK = "letter/check-letter";
  static API_LETTER_DELETE = "letter/:letter_id/delete";
  //   listNumImg(id, _data = {}) {
  //     // Validate data?!
  //     let data = Object.assign({}, _data);
  //     //
  //     return this._api.get(_static.API_MAINNUMBER_IMAGES_LIST.replace(":mainNumber_id", id), data);
  //   }
  getListLetter(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_LETTER_LIST, data);
  }
  //   getListPartner(_data = {}) {
  //     let data = Object.assign({}, _data);
  //     return this._api.get(_static.API_MAINNUMBER_PARTNER_LIST, data);
  //   }
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_LETTER_LIST, data);
  }
  checkLetter(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    // console.log(id, data)
    return this._api.get(_static.API_LETTER_CHECK, data);
  }
  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    //   return this._api.post(_static.API_MAINNUMBER_DELETE, data);
    return this._api.put(_static.API_LETTER_DELETE.replace(":letter_id", id), data);
  }
  detail(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_LETTER_DETAIL.replace(":letter_id", id), data);
  }
}
const _static = LetterModel;
