import Model from "../Model";
export default class ParamTypeModel extends Model {
  static API_PARAMTYPE_LIST = "param-type";
  static API_PARAMTYPE_DETAIL = "param-type/:param_id";
//   static API_LETTER_CHECK = "param-type/check-letter";
  static API_PARAMTYPE_DELETE = "param-type/:param_id/delete";
  static API_PARAMTYPE_CHECK = "param-type/check-param";
  getList(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_PARAMTYPE_LIST, data);
  }
  //   getListPartner(_data = {}) {
  //     let data = Object.assign({}, _data);
  //     return this._api.get(_static.API_MAINNUMBER_PARTNER_LIST, data);
  //   }
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_PARAMTYPE_LIST, data);
  }
//   checkLetter(_data = {}) {
//     // Validate data?!
//     let data = Object.assign({}, _data);
//     // console.log(id, data)
//     return this._api.get(_static.API_LETTER_CHECK, data);
//   }
  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    //   return this._api.post(_static.API_MAINNUMBER_DELETE, data);
    return this._api.put(_static.API_PARAMTYPE_DELETE.replace(":param_id", id), data);
  }
  detail(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_PARAMTYPE_DETAIL.replace(":param_id", id), data);
  }
  checkparam(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    // console.log( data)
    return this._api.get(_static.API_PARAMTYPE_CHECK, data);
  }
}
const _static = ParamTypeModel;
