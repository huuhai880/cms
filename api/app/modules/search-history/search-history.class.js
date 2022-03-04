const Transform = require('../../common/helpers/transform.helper');

const template = {
    search_result_free_id: '{{#? SEARCHRESULTFREEID}}',
    full_name: '{{#? FULLNAME}}',
    birth_day: '{{#? BIRTHDAY}}',
    gender: '{{#? GENDER}}',
    search_date: '{{#? SEARCHDATEVIEW}}',
    product_name: '{{#? PRODUCTNAME}}',
    product_id: '{{#? PRODUCTID}}'
};

let transform = new Transform(template);

const listFree = (list = []) => {
    return transform.transform(list, [
        'search_result_free_id',
        'full_name',
        'birth_day',
        'gender',
        'search_date',
        'product_name',
        'product_id',
    ]);
};

module.exports = {
    listFree
};
