import Model from "../Model";
export default class FarmousModel extends Model {
  static API_FARMOUS_LIST = "farmous";
  static API_FARMOUS_DETAIL = "farmous/:farmous_id";
  static API_FARMOUS_CHECK = "farmous/check-farmous";
  static API_FARMOUS_DELETE = "farmous/:farmous_id/delete";
  static API_FARMOUS_UPLOAD = "upload-file";
  static API_FARMOUS_CHECK = "farmous/check-farmous";

  getListFarmous(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_FARMOUS_LIST, data);
  }
  create(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_FARMOUS_LIST, data);
  }
  checkFarmous(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_FARMOUS_CHECK, data);
  }
  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.put(_static.API_FARMOUS_DELETE.replace(":farmous_id", id), data);
  }
  detail(id, _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_FARMOUS_DETAIL.replace(":farmous_id", id), data);
  }
  checkFarmous(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_FARMOUS_CHECK, data);
  }
  upload(_data = {}) {
    return this._api.post(_static.API_FARMOUS_UPLOAD, _data);
  }
}
const _static = FarmousModel;
