import Model from "../Model";
export default class InterpretModel extends Model {
  /////////////interpret
  static API_INTERPRET_LIST = "interpret";
  static API_INTERPRET_ATTRIBUTE_LIST = "interpret/attribute";
  static API_INTERPRET_MAINNUMBER_LIST = "interpret/mainnumber";
  static API_INTERPRET_RELATIONSHIP_LIST = "interpret/relationship";
  static API_INTERPRET_INTERPRETPARENT_LIST = "interpret/interpretParent/:interpret_id";
  static API_INTERPRET_UPLOAD = "upload-file";
  static API_INTERPRET_DETAIL = "interpret/:interpret_id";
  static API_INTERPRET_DELETE = "interpret/:interpret_id/delete";

  ///////////interpret detail
  static API_INTERPRETDETAIL_LIST = "interpret/interpret-detail";
  static API_INTERPRETDETAIL_DELETE = "interpret/interpret-detail/:interpret_detail_id/delete";
  static API_INTERPRETDETAIL_CHECK = "interpret/interpret-detail/check-interpret";
  static API_INTERPRETDETAIL_DETAIL = "interpret/interpret-detail/:interpret_detail_id";

  getListInterpretDetail(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INTERPRETDETAIL_LIST, data);
  }
  deleteInterpretDetail(id, _data = {}) {
    let data = Object.assign({}, _data);
    //   return this._api.post(_static.API_MAINNUMBER_DELETE, data);
    return this._api.put(
      _static.API_INTERPRETDETAIL_DELETE.replace(":interpret_detail_id", id),
      data
    );
  }
  deleteInterpret(id, _data = {}) {
    let data = Object.assign({}, _data);
    //   return this._api.post(_static.API_MAINNUMBER_DELETE, data);
    return this._api.put(_static.API_INTERPRET_DELETE.replace(":interpret_id", id), data);
  }
  getListInterpret(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INTERPRET_LIST, data);
  }
  /////get list option interpret
  getListInterpretParent(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(
      _static.API_INTERPRET_INTERPRETPARENT_LIST.replace(":interpret_id", id),
      data
    );
  }
  getListAttribute(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INTERPRET_ATTRIBUTE_LIST, data);
  }
  getListMainnumber(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INTERPRET_MAINNUMBER_LIST, data);
  }
  getListRelationship(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INTERPRET_RELATIONSHIP_LIST, data);
  }
  //upload images
  upload(_data = {}) {
    return this._api.post(_static.API_INTERPRET_UPLOAD, _data);
  }
  //create or update  interpret
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_INTERPRET_LIST, data);
  }
  //create or update  interpret detail
  createInterpretDetail(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    // console.log(data)
    return this._api.post(_static.API_INTERPRETDETAIL_LIST, data);
  }
  //detail interpret
  detail(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_INTERPRET_DETAIL.replace(":interpret_id", id), data);
  }
  //detail interpret detail
  detailInterPretDetail(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_INTERPRETDETAIL_DETAIL.replace(":interpret_detail_id", id), data);
  }
  checkInterpretname(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    // console.log(id, data)
    return this._api.get(_static.API_INTERPRETDETAIL_CHECK, data);
  }
}
const _static = InterpretModel;
