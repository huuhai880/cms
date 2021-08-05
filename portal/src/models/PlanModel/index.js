
import Model from '../Model';
import PlanEntity from '../PlanEntity';

export default class PlanModel extends Model {
  static API_PLAN_LIST = 'plan';
  static API_PLAN_DETAIL = 'plan/detail/:id';
  static API_PLAN_UPDATE = 'plan/:id';
  static API_PLAN_UPLOAD = 'upload-file'
 
  fillable = () => ({
    "plan_id": null,
    "plan_category_id": null,
    "plan_title": null,
    "description": null,
    "image_url": null,
    "attribute_content": null,
    "content" : null,
    "is_active": 1,
    "seo_name": null,
    "meta_keywords": null
  });

  getList(_data = {}){
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_PLAN_LIST, data);
  }

  create(_data = {}){
    let data = Object.assign({}, this.fillable, _data);
    return this._api.post(_static.API_PLAN_LIST, data);
  }

  read(id){
    return this._api.get(_static.API_PLAN_DETAIL.replace(':id', id)).then(data => {
      return new PlanEntity(data)
    })
  }

  update(id, _data){
    let data = Object.assign({}, _data)
    return this._api.put(_static.API_PLAN_UPDATE.replace(':id', id), data)
  }
  
  delete(id){
    return this._api.delete(_static.API_PLAN_UPDATE.replace(':id', id))
  }

  upload(_data = {}) {
    return this._api.post(_static.API_PLAN_UPLOAD, _data);
  }

}
const _static = PlanModel;
