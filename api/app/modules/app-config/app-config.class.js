const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'config_id': '{{#? IDCONFIG}}',
  'config_key': '{{#? KEYCONFIG}}',
  'config_value': [
    {
      "{{#if DATATYPE == 'image' && VALUECONFIG}}": `${config.domain_cdn}{{VALUECONFIG}}`,
    },
    {
      "{{#elseif VALUECONFIG}}": '{{VALUECONFIG}}',
    },
    {
        "{{#else}}": null
    }
  ],
  'data_type': '{{#? DATATYPE}}',
};

let transform = new Transform(template);

const detail = (area) => {
  return transform.transform(area, [
    'config_id','config_key','config_value','data_type'
  ]);
};

const list = (areas = []) => {
  return transform.transform(areas, [
    'config_id','config_key','config_value','data_type'
  ]);
};



module.exports = {
  list,
  detail,
};
