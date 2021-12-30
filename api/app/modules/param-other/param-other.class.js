const Transform = require('../../common/helpers/transform.helper');
const template = {
    param_other_id: '{{#? PARAMOTHERID}}',
    name_type: '{{#? NAMETYPE}}',
    is_house_number: '{{ISHOUSENUMBER ? 1 : 0}}',
    is_phone_number: '{{ISPHONENUMBER ? 1 : 0}}',
    is_license_plate: '{{ISLICENSEPLATE ? 1 :0}}',
    is_active: '{{ ISACTIVE? 1: 0}}',
    label: '{{#? LABEL}}',
    value: '{{#? VALUE}}'
};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'param_other_id',
        'name_type',
        'is_house_number',
        'is_phone_number',
        'is_license_plate', ,
        'is_active'
    ]);
};

const detail = (data = []) => {
    return transform.transform(data, [
        'param_other_id',
        'name_type',
        'is_house_number',
        'is_phone_number',
        'is_license_plate', ,
        'is_active'
    ]);
};

const option = (list = []) => {
    return transform.transform(list, [
        'value',
        'label',
    ]);
};


module.exports = {
    list,
    detail,
    option
};


