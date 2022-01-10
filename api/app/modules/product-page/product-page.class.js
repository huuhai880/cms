const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
    product_page_id: '{{#? PAGEID}}',
    page_name: '{{#? PAGENAME}}',
    interpret_detail_id: '{{#? INTERPRETDETAILID}}',
    attributes_group_id: '{{#? ATTRIBUTESGROUPID}}',
    interpret_id: '{{#? INTERPRETID}}',
    attributes_id: '{{#? ATTRIBUTEID}}',
    attributes_name: '{{#? ATTRIBUTENAME}}',
    interpret_detail_name: '{{#? INTERPRETDETAILNAME}}',

    is_condition_or: '{{ISCONDITIONOR ? 1 : 0}}',
    is_interpret_special: '{{ISINTERPRETSPECIAL ? 1 : 0}}',
    brief_description: '{{#? BRIEFDESCRIPTION}}',
    description: '{{#? DESCRIPTION}}',
    order_index: '{{#? ORDERINDEX}}',
    full_content: '{{#? FULLCONTENT}}',
    short_content: '{{#? SHORTCONTENT}}',
    main_number: '{{#? MAINNUMBER}}',
    main_number_id: '{{#? MAINNUMBERID}}',
    is_selected: '{{ISSELECTED ? 1 : 0}}'

};

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'product_page_id',
        'page_name',
    ]);
};

const list_interpretdetail = (list = []) => {
    return transform.transform(list, [
        'interpret_detail_id',
        'interpret_id',
        'attributes_group_id',
        'attributes_id',
        'attributes_name',
        'interpret_detail_name',
    ]);
};

const listInterpretSpecial = (list = []) => {
    return transform.transform(list, [
        'interpret_id',
        'brief_description',
        'description',
        'order_index',
        'is_condition_or',
        'is_interpret_special',
    ]);
};

const listInterpretSpecialDetail = (list = []) => {
    return transform.transform(list, [
        'interpret_id',
        'interpret_detail_id',
        'interpret_detail_name',
        'full_content',
        'order_index',
        'short_content',
    ]);
};

const listInterpretSpecialAttributes = (list = []) => {
    return transform.transform(list, [
        'interpret_id',
        'interpret_detail_id',
        'attributes_id',
        'attributes_name',
        
    ]);
};




module.exports = {
    list,
    list_interpretdetail,
    listInterpretSpecial,
    listInterpretSpecialDetail,
    listInterpretSpecialAttributes
};
