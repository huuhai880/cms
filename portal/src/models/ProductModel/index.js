//
import Model from "../Model";
import ProductEntity from "../ProductEntity";

// Util(s)

/**
 * @class ProductModel
 */
export default class ProductModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = "product";

  /**
   * @var {Ref}
   */
  _entity = ProductEntity;

  /** @var {String} */
  static API_PRODUCT_LIST = "product";
  /** @var {String} */
  static API_PRODUCT_OPTS = "product/get-options";
  /** @var {String} */
  static API_PRODUCT_DETAIL = "product/:id"; //GET
  /** @var {String} */
  static API_PRODUCT_INTERPRET_BY_ATTRIBUTEGRUOPS = "product/interpret"; //GET
  /** @var {String} */
  static API_PRODUCT_DELETE = "product/:id"; //DELETE
  /** @var {String} */
  static API_PRODUCT_CHANGE_STATUS = "product/:id/change-status"; //PUT
  /** @var {String} */
  static API_PRODUCT_EXPORT_EXCEL = "product/export-excel";
  /** @var {String} */
  static API_PRODUCT_GET_PRODUCTRELATED = "product/product-related/:id";
  /** @var {String} */
  static API_PRODUCT_GET_PRODUCTRELATEDMODAL = "product/product-related-modal";
  /**
   * @var {String} Primary Key
   */
  static primaryKey = ProductEntity.primaryKey;

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = "";

  /**
   * @var {Object}
   */
  fillableProduct = () => ({
    product_category_id: "",
    product_code: "",
    product_name: "",
    product_name_show_web: "",
    note: "",
    descriptions: "",
    product_content_detail: "",
    short_description: "",
    is_show_web: 0,
    is_service: 0,
    is_active: 1,
    is_sell_well: 0,
    is_high_light: 0,
    product_imei: "",
    manufacturer_id: "",
    lot_number: "",
    model_id: "",
    origin_id: "",
    businesses: [],
    attribute_values: [],
    pictures: [],
    status_product_id: null,
  });

  /**
   * @var {Object}
   */
  fillableService = () => ({
    product_category_id: "",
    product_code: "",
    product_name: "",
    product_name_show_web: "",
    note: "",
    descriptions: "",
    product_content_detail: "",
    short_description: "",
    is_show_web: 0,
    is_service: 1,
    is_active: 1,
    product_imei: "",
    manufacturer_id: "",
    lot_number: "",
    model_id: "",
    origin_id: "",
    businesses: [],
    attribute_values: [],
    pictures: [],
    pt_level_id: "",
    values_in: "",
    is_amount_days: null,
    is_session: null,
    is_freeze: 0,
    is_tranfer: 0,
    is_sell_well: 0,
    is_high_light: 0,
    time_limit: "",
    time_per_session: "",
    is_product_off_peak: 0,
    is_apply_mon: 0,
    is_apply_tu: 0,
    is_apply_we: 0,
    is_apply_th: 0,
    is_apply_fr: 0,
    is_apply_sa: 0,
    is_apply_sun: 0,
  });

  getList(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_PRODUCT_LIST, data);
  }

  create(_data = {}) {
    return this._api.post(_static.API_PRODUCT_LIST, _data);
  }

  update(id, _data) {
    return this._api.put(_static.API_PRODUCT_DETAIL.replace(":id", id), _data);
  }

  delete(id, _data = {}) {
    return this._api.delete(_static.API_PRODUCT_DELETE.replace(":id", id), _data);
  }

  read(id) {
    return this._api.get(_static.API_PRODUCT_DETAIL.replace(":id", id));
  }
  interpretList( _data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_PRODUCT_INTERPRET_BY_ATTRIBUTEGRUOPS, data);
  }
  // getListProductRelated(id, _data = {}) {
  //   let data = Object.assign({}, _data);
  //   return this._api.get(
  //     _static.API_PRODUCT_GET_PRODUCTRELATED.replace(":id", id),
  //     data
  //   );
  // }
  // getListProductRelatedModal(_data = {}) {
  //   let data = Object.assign({}, _data);
  //   return this._api.get(_static.API_PRODUCT_GET_PRODUCTRELATEDMODAL, data);
  // }

  getListAttributesGroup() {
    return this._api.get("/product/attributes-group");
  }
}

// Make alias
const _static = ProductModel;
