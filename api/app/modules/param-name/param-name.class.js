const Transform = require('../../common/helpers/transform.helper');
const template = {
  param_name_id: '{{#? PARAMNAMEID}}',
  name_type: '{{#? NAMETYPE}}',
  is_full_name: '{{#? ISFULLNAME}}',
  is_last_name: '{{#? ISLASTNAME}}',
  is_first_name: '{{#? ISFIRSTNAME}}',
  is_first_middle_name: '{{#? ISFIRSTMIDDLENAME}}',
  is_active: '{{ ISACTIVE? 1: 0}}',
};

let transform = new Transform(template);

const list = (ParamName = []) => {
  return transform.transform(ParamName, [
    'param_name_id',
    'name_type',
    'is_full_name',
    'is_last_name',
    'is_first_name',
    'is_first_middle_name',,
    'is_active',
  ]);
};

const detail = (ParamName = []) => {
  return transform.transform(ParamName, [
    'param_name_id',
    'name_type',
    'is_full_name',
    'is_last_name',
    'is_first_name',
    'is_first_middle_name',,
    'is_active',
  ]);
};

module.exports = {
  list,
  detail,
};
