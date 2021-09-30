import Model from "../Model";
export default class InterpretModel extends Model {
  static API_INTERPRET_LIST = "interpret";
  static API_INTERPRET_ATTRIBUTE_LIST = "interpret/attribute";
  static API_INTERPRET_ATTRIBUTE_EXCLUDE = "interpret/attribute/:id/exclude";

  static API_INTERPRET_MAINNUMBER_LIST = "interpret/mainnumber";
  static API_INTERPRET_RELATIONSHIP_LIST = "interpret/relationship";
  static API_INTERPRET_INTERPRETPARENT_LIST = "interpret/interpretParent/:interpret_id";
  static API_INTERPRET_UPLOAD = "upload-file";
  static API_INTERPRET_DETAIL = "interpret/:interpret_id";
  static API_INTERPRET_DELETE = "interpret/:interpret_id/delete";

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
    return this._api.put(
      _static.API_INTERPRETDETAIL_DELETE.replace(":interpret_detail_id", id),
      data
    );
  }

  deleteInterpret(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.put(_static.API_INTERPRET_DELETE.replace(":interpret_id", id), data);
  }

  getListInterpret(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INTERPRET_LIST, data);
  }

  getListInterpretParent(interpretId, interpretDetailId) {
    return this._api.get(`/interpret/parent/${interpretId}/${interpretDetailId}`);
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

  upload(_data = {}) {
    return this._api.post(_static.API_INTERPRET_UPLOAD, _data);
  }

  create(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_INTERPRET_LIST, data);
  }

  createInterpretDetail(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_INTERPRETDETAIL_LIST, data);
  }

  detail(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INTERPRET_DETAIL.replace(":interpret_id", id), data);
  }

  detailInterPretDetail(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INTERPRETDETAIL_DETAIL.replace(":interpret_detail_id", id), data);
  }


  checkInterpretname(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INTERPRETDETAIL_CHECK, data);
  }

  getAttributeExclude(attribute_id, interpret_id) {
    return this._api.get(`/interpret/attribute/${interpret_id}/exclude/${attribute_id}`)
  }

  copyInterpret(values) {
    return this._api.post('/interpret/copy', values)
  }

}
const _static = InterpretModel;
