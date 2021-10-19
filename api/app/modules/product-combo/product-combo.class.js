const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');


const template = {
    combo_id: "{{#? COMBOID}}",
    combo_name: "{{#? COMBONAME}}",
    description: "{{#? DESCRIPTION}}",
    combo_image_url: [
        {
            '{{#if COMBOIMAGEURL}}': `${config.domain_cdn}{{COMBOIMAGEURL}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    is_active: "{{ISACTIVE ? 1 : 0}}",
    created_date: "{{#? CREATEDDATEVIEW}}",
    created_user: "{{#? CREATEDUSER}}",
    created_user_full_name: "{{#? CREATEDUSERFULLNAME}}",
    product_id: '{{#? PRODUCTID}}',
    product_name: "{{#? PRODUCTNAME}}",
    number_search: "{{#? NUMBERSEARCH}}",
    is_time_limit: "{{ISTIMELIMIT ? 1 : 0}}",
    time_limit: '{{#? TIMELIMIT}}',
    is_web_view: "{{ISSHOWWEB ? 1 : 0}}",
    is_show_menu: "{{ISSHOWMENU ? 1 : 0}}",
    content_detail: "{{#? COMBOCONTENTDETAIL}}",

}

let transform = new Transform(template);

const listCombo = (list = []) => {
    return transform.transform(list, [
        'combo_id',
        'combo_name',
        'desciption',
        'is_active',
        'created_user',
        'created_date',
        'created_user_full_name'
    ]);
};

const detailCombo = (combo = {}) => {
    return Object.keys(combo).length > 0 ? transform.transform(combo, [
        'combo_id',
        'combo_name',
        'description',
        'is_active',
        'combo_image_url',
        'is_web_view',
        'is_show_menu',
        'content_detail',
    ]) : null;
}

const listComboProduct = (list = []) => {
    return transform.transform(list, [
        'combo_id',
        'product_id',
        'product_name',
        'number_search',
        'is_time_limit',
        'time_limit',
    ]);
};

module.exports = {
    listCombo,
    detailCombo,
    listComboProduct
};


