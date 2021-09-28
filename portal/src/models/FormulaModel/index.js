import Model from "../Model";
export default class FormulaModel extends Model {
  static API_FORMULA_LIST = "formula";
  static FOR_FORMULA_CALCULATION_LIST = "formula/calculation";
  static FOR_FORMULA_FORMULA_PARENT_LIST = "formula/formula-parent";
  static FOR_FORMULA_INGREDIENT_LIST = "formula/ingredients";
  static FOR_FORMULA_ATTRIBUTE_GRUOP_LIST = "formula/attribute-gruop";

  //   static API_MAINNUMBER_IMAGES_LIST = "main-number/:mainNumber_id/image-by-numerid";
  //   static API_MAINNUMBER_PARTNER_LIST = "main-number/partner";
    static API_FORMULA_DETAIL = "formula/:formula_id";
  //   static API_FORMULA_CHECK = "formula/check-formula";
    static API_FORMULA_DELETE = "formula/:formula_id/delete";
  //   listNumImg(id, _data = {}) {
  //     // Validate data?!
  //     let data = Object.assign({}, _data);
  //     //
  //     return this._api.get(_static.API_MAINNUMBER_IMAGES_LIST.replace(":mainNumber_id", id), data);
  //   }
  getListFormula(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_FORMULA_LIST, data);
  }
  getListCalculation(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.FOR_FORMULA_CALCULATION_LIST, data);
  }
  getAttributeGruop(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.FOR_FORMULA_ATTRIBUTE_GRUOP_LIST, data);
  }
  getListFormulaParent(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.FOR_FORMULA_FORMULA_PARENT_LIST, data);
  }
  getListIngredient(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.FOR_FORMULA_INGREDIENT_LIST, data);
  }

  //   getListPartner(_data = {}) {
  //     let data = Object.assign({}, _data);
  //     return this._api.get(_static.API_MAINNUMBER_PARTNER_LIST, data);
  //   }
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.post(_static.API_FORMULA_LIST, data);
  }
  //   checkFormula(_data = {}) {
  //     // Validate data?!
  //     let data = Object.assign({}, _data);
  //     // console.log(id, data)
  //     return this._api.get(_static.API_FORMULA_CHECK, data);
  //   }
  delete(id, _data = {}) {
    let data = Object.assign({}, _data);
    //   return this._api.post(_static.API_MAINNUMBER_DELETE, data);
    return this._api.put(_static.API_FORMULA_DELETE.replace(":formula_id", id), data);
  }
  detail(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.get(_static.API_FORMULA_DETAIL.replace(":formula_id", id), data);
  }
}
const _static = FormulaModel;
