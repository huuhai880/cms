const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  author_id: '{{#? AUTHORID}}',
  author_name: '{{#? AUTHORNAME}}',
  password: '{{#? PASSWORD}}',
  nickname: '{{#? NICKNAME}}',
  full_name: '{{#? FULLNAME}}',
  first_name: '{{#? FIRSTNAME}}',
  last_name: '{{#? LASTNAME}}',
  avatar_image: [
    {
      '{{#if AVATARIMAGE}}': `${config.domain_cdn}{{AVATARIMAGE}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  banner_image: [
    {
      '{{#if BANNERIMAGE}}': `${config.domain_cdn}{{BANNERIMAGE}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  birthday: '{{#? BIRTHDAY}}',
  gender: '{{GENDER ? 1 : 0}}',
  phone_number: '{{#? PHONENUMBER}}',
  email: '{{#? EMAIL}}',
  introduce: '{{#? INTRODUCE}}',
  about_me: '{{#? ABOUTME}}',
  description: '{{#? DESCRIPTION}}',
  education_career: '{{#? EDUCATIONCAREER}}',
  identity_number: '{{#? IDENTITYNUMBER}}',
  identity_date: '{{#? IDENTITYDATE}}',
  identity_place: '{{#? IDENTITYPLACE}}',
  identity_front_image: [
    {
      '{{#if IDENTITYFRONTIMAGE}}': `${config.domain_cdn}{{IDENTITYFRONTIMAGE}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  identity_back_image: [
    {
      '{{#if IDENTITYBACKIMAGE}}': `${config.domain_cdn}{{IDENTITYBACKIMAGE}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  address: '{{#? ADDRESS}}',
  address_full: '{{#? ADDRESSFULL}}',
  province_id: '{{#? PROVINCEID}}',
  province_name: '{{#? PROVINCENAME}}',
  district_id: '{{#? DISTRICTID}}',
  district_name: '{{#? DISTRICTNAME}}',
  country_id: '{{#? COUNTRYID}}',
  country_name: '{{#? COUNTRYNAME}}',
  ward_id: '{{#? WARDID}}',
  ward_name: '{{#? WARDNAME}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
  deleted_user: '{{#? DELETEDUSER}}',
  deleted_date: '{{#? DELETEDDATE}}',
  is_review_news: '{{#? ISREVIEWNEWS}}',
  author_degree: '{{#? AUTHORDEGREE}}',
  author_quote: '{{#? AUTHORQUOTE}}',
  banner_image_mobile: [
    {
      '{{#if BANNERIMAGEMOBILE}}': `${config.domain_cdn}{{BANNERIMAGEMOBILE}}`,
    },
    {
      '{{#else}}': undefined,
    },
  ],
  order_index: '{{#? ORDERINDEX}}',
};

const templateNewsCategory = {
  author_category_id: '{{#? AUTHORCATEGORYID}}',
  author_id: '{{#? AUTHORID}}',
  news_category_id: '{{#? NEWSCATEGORYID}}',
  value: '{{#? NEWSCATEGORYID}}',
  is_active: '{{ISACTIVE ? 1 : 0}}',
  created_user: '{{#? CREATEDUSER}}',
  created_date: '{{#? CREATEDDATE}}',
  updated_user: '{{#? UPDATEDUSER}}',
  updated_date: '{{#? UPDATEDDATE}}',
  is_deleted: '{{#? ISDELETED}}',
};

let transform = new Transform(template);

const detail = (author) => {
  return transform.transform(author, [
    'author_id',
    'author_name',
    'password',
    'nickname',
    'first_name',
    'last_name',
    'avatar_image',
    'full_name',
    'birthday',
    'gender',
    'phone_number',
    'email',
    'identity_number',
    'identity_date',
    'identity_front_image',
    'identity_place',
    'address',
    'province_id',
    'province_name',
    'district_id',
    'identity_back_image',
    'district_name',
    'country_id',
    'country_name',
    'ward_id',
    'ward_name',
    'about_me',
    'description',
    'is_review_news',
    'is_active',
    'introduce',
    'education_career',
    'banner_image',
    'author_degree',
    'author_quote',
    'banner_image_mobile',
    'order_index'
  ]);
};

const list = (authors = []) => {
  return transform.transform(authors, [
    'author_id',
    'nickname',
    'full_name',
    'birthday',
    'phone_number',
    'address_full',
    'is_active',
    'author_name',
    'email',
  ]);
};

const listNewsCategory = (categories) => {
  let transform = new Transform(templateNewsCategory);
  return transform.transform(categories, [
    'author_id',
    'news_category_id',
    'value',
  ]);
};

const generateAuthorName = (author) => {
  return transform.transform(author, ['author_name']);
};

module.exports = {
  detail,
  list,
  listNewsCategory,
  generateAuthorName,
};
