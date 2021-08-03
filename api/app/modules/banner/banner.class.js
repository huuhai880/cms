const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'banner_id': '{{#? BANNERID}}',
  'picture_alias': '{{#? PICTUREALIAS}}',
  'picture_url': `${config.domain_cdn}{{PICTUREURL}}`,
  'created_date': '{{#? CREATEDDATE}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'placement': '{{#? SYSTEMNAME}}'
};


let transform = new Transform(template);

const detail = (banner) => {
  return transform.transform(banner, [
    'banner_id','picture_alias','picture_url','is_active', 'placement'
  ]);
};

const list = (banner = []) => {
  return transform.transform(banner, [
    'banner_id','picture_url','is_active','created_date', 'placement'
  ]);
};



module.exports = {
  list,
  detail
};
