import Model from "../Model";
export default class IngredientModel extends Model {
  static API_INGREDIENT_LIST = "formula-ingredients";
  //   static API_MAINNUMBER_IMAGES_LIST = "main-number/:mainNumber_id/image-by-numerid";
  //   static API_MAINNUMBER_PARTNER_LIST = "main-number/partner";
  static API_INGREDIENT_DETAIL = "formula-ingredients/:ingredient_id";
//   static API_INGREDIENT_CHECK = "formula-ingredients/check-formula-ingredients";
  static API_INGREDIENT_DELETE = "formula-ingredients/:ingredient_id/delete";
  static API_INGREDIENT_CALCULATION_LIST = "formula-ingredients/calculation";
  static API_INGREDIENT_PARAMDOB_LIST = "formula-ingredients/param-dob";
  static API_INGREDIENT_PARAMNAME_LIST = "formula-ingredients/param-name";
  static API_INGREDIENT_INGREDIENT_LIST = "formula-ingredients/ingredients";

  getListIngredient(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INGREDIENT_LIST, data);
  }
  getListCalculation(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INGREDIENT_CALCULATION_LIST, data);
  }
  getListParamDob(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INGREDIENT_PARAMDOB_LIST, data);
  }
  getListParamName(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INGREDIENT_PARAMNAME_LIST, data);
  }
  getListIngredientChild(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_INGREDIENT_INGREDIENT_LIST, data);
  }
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    // console.log(data)
    return this._api.post(_static.API_INGREDIENT_LIST, data);
  }
//   checkLetter(_data = {}) {
//     // Validate data?!
//     let data = Object.assign({}, _data);
//     // console.log(id, data)
//     return this._api.get(_static.API_INGREDIENT_CHECK, data);
//   }
  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    //   return this._api.post(_static.API_MAINNUMBER_DELETE, data);
    return this._api.put(_static.API_INGREDIENT_DELETE.replace(":ingredient_id", id), data);
  }
  detail(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_INGREDIENT_DETAIL.replace(":ingredient_id", id), data);
  }
}
const _static = IngredientModel;
