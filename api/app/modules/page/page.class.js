const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');

const template = {
    page_id: "{{#? PAGEID}}",
    page_name: "{{#? PAGENAME}}",
    short_description: "{{#? SHORTDESCRIPTION}}",
    description: "{{#? DESCRIPTION}}",
    background_url: [
        {
            '{{#if BACKGROUNDURL}}': `${config.domain_cdn}{{BACKGROUNDURL}}`,
        },
        {
            '{{#else}}': undefined,
        },
    ],
    background: "{{#? BACKGROUND}}",
    is_active: "{{ISACTIVE ? 1 : 0}}",
    created_date: "{{#? CREATEDDATEVIEW}}",
    created_user: "{{#? CREATEDUSER}}",
    created_full_name: "{{#? FULLNAME}}",
    page_type: "{{PAGETYPE ? PAGETYPE : 0}}",
    title_page: "{{#? TITLEPAGE}}"
}

let transform = new Transform(template);

const list = (list = []) => {
    return transform.transform(list, [
        'page_id',
        'page_name',
        'desciption',
        'is_active',
        'created_user',
        'created_date',
        'created_full_name',
        'short_description',
        'background_url',
        'background',
        'page_type',
        'title_page'
    ]);
};

const detail = (data = {}) => {
    return Object.keys(data).length > 0 ? transform.transform(data, [
        'page_id',
        'page_name',
        'short_description',
        'description',
        'background_url',
        'is_active',
        'page_type',
    ]) : null;
}


module.exports = {
    list,
    detail
};

