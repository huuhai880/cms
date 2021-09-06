import Model from "../Model";
export default class RelationshipsModel extends Model {
  static API_RELATIONSHIPS_LIST = "relationships";
  //   static API_MAINNUMBER_IMAGES_LIST = "main-number/:mainNumber_id/image-by-numerid";
  //   static API_MAINNUMBER_PARTNER_LIST = "main-number/partner";
  static API_RELATIONSHIPS_DETAIL = "relationships/:relationships_id";
  static API_RELATIONSHIPS_CHECK = "relationships/check-relationships";
  static API_RELATIONSHIPS_DELETE = "relationships/:relationships_id/delete";
  //   listNumImg(id, _data = {}) {
  //     // Validate data?!
  //     let data = Object.assign({}, _data);
  //     //
  //     return this._api.get(_static.API_MAINNUMBER_IMAGES_LIST.replace(":mainNumber_id", id), data);
  //   }
  getList(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_RELATIONSHIPS_LIST, data);
  }
  //   getListPartner(_data = {}) {
  //     let data = Object.assign({}, _data);
  //     return this._api.get(_static.API_MAINNUMBER_PARTNER_LIST, data);
  //   }
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_RELATIONSHIPS_LIST, data);
  }
  checkRelationship(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    // console.log(id, data)
    return this._api.get(_static.API_RELATIONSHIPS_CHECK, data);
  }
  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    //   return this._api.post(_static.API_MAINNUMBER_DELETE, data);
    return this._api.put(_static.API_RELATIONSHIPS_DELETE.replace(":relationships_id", id), data);
  }
  detail(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_RELATIONSHIPS_DETAIL.replace(":relationships_id", id), data);
  }
}
const _static = RelationshipsModel;
