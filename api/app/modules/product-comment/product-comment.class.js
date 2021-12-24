const Transform = require("../../common/helpers/transform.helper");
const config = require("../../../config/config");

const template = {
    product_id: "{{#? PRODUCTID}}",
    is_combo: '{{ISCOMBO ? 1 : 0}}',
    product_comment_id: '{{#? PRODUCTCOMMENTID}}',
    phone_number: '{{#? PHONENUMBER}}',
    email: '{{#? EMAIL}}',
    user_comment: '{{#? USERCOMMENT}}',
    comment_reply_id:'{{#? COMMENTREPLYID}}',
    content_comment: '{{#? CONTENTCOMMENT}}',
    full_name: '{{#? FULLNAME}}',
    gender: '{{#? GENDER}}',
    image_avatar: [
        {
            "{{#if IMAGEAVATAR}}": `${config.domain_cdn}{{IMAGEAVATAR}}`,
        },
        {
            "{{#else}}": undefined,
        },
    ],
    member_id: '{{#? MEMBERID}}',
    comment_date: '{{#? COMMENTDATEVIEW}}',
    is_staff: '{{ISSTAFF ? 1 : 0}}',
    is_review: '{{ISREVIEW ? 1: 0}}',
    review_user: '{{#? REVIEWUSER}}'
}

let transform = new Transform(template);

const listComment = (list = []) => {
    return transform.transform(list, [
        "product_comment_id",
        "phone_number",
        'email',
        "user_comment",
        "comment_reply_id",
        "content_comment",
        "product_id",
        "combo_id",
        "is_combo",
        "full_name",
        "gender",
        "image_avatar",
        "member_id",
        "comment_date",
        "is_staff",
        "is_review",
        "review_user"
    ]);
};

module.exports = {
    listComment
}