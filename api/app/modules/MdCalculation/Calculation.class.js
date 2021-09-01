const Transform = require('../../common/helpers/transform.helper');
const template = {
  calculation_id: '{{#? CALCULATIONID}}',
  calculation: '{{#? CALCULATION}}',
  description: '{{#? DESCRIPTION}}',
  is_active: '{{ ISACTIVE? 1: 0}}',
};

let transform = new Transform(template);

const list = (Attibutes = []) => {
  return transform.transform(Attibutes, [
    'calculation_id',
    'calculation',
    'description',
    'is_active',
  ]);
};

const detail = (Attibutes = []) => {
  return transform.transform(Attibutes, [
    'calculation_id',
    'calculation',
    'description',
    'is_active',
  ]);
};

module.exports = {
  list,
  detail,
};
