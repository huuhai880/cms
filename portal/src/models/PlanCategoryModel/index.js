
import Model from '../Model';
import PlanCategoryEntity from '../PlanCategoryEntity';

export default class PlanCategoryModel extends Model {
  static API_PLAN_CATEGORY_LIST = 'plan-category';
  static API_PLAN_CATEGORY_DELETE = 'plan-category/:id';
  static API_PLAN_CATEGORY_OPTS = 'plan-category/get-options'
  static API_PLAN_CATEGORY_READ = 'plan-category/detail/:id'

  fillable = () => ({
    "plan_category_id" :null,
    "category_name": null,
    "seo_name": null,
    "parent_id": null,
    "description": null,
    "is_active": 1,
    "meta_keywords": null
  });


  getList(_data = {}) {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_PLAN_CATEGORY_LIST, data);
  }

  delete(id, _data = {})
  {
    let data = Object.assign({}, _data);
    return this._api.delete(_static.API_PLAN_CATEGORY_DELETE.replace(':id', id), data);
  }
  getOptionParentList(_opts){
    let opts = Object.assign({}, _opts);
    return this._api.get(_static.API_PLAN_CATEGORY_OPTS, opts);
  }
  create(_data   = {}) {
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_PLAN_CATEGORY_LIST, data);
  }
  read(id, _data = {})
  {
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_PLAN_CATEGORY_READ.replace(':id', id), data)
      .then((data) => new PlanCategoryEntity(data))
    ;
  }
  update(id, _data = {})
  {
    let data = Object.assign({}, _data);
    return this._api.put(_static.API_PLAN_CATEGORY_DELETE.replace(':id', id), data)
    ;
  }
}
const _static = PlanCategoryModel;
