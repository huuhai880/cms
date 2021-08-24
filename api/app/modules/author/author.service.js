const authorClass = require('./author.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const stringHelper = require('../../common/helpers/string.helper');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'author';
const config = require('../../../config/config');

const getListAuthor = async (queryParams = {}) => {
// console.log("🚀 ~ file: author.service.js ~ line 16 ~ getListAuthor ~ queryParams", queryParams)
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const keyword = apiHelper.getSearch(queryParams);

    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PAGESIZE', itemsPerPage)
      .input('PAGEINDEX', currentPage)
      .input('KEYWORD', keyword)
      .input(
        'NEWSCATEGORYID',
        apiHelper.getValueFromObject(queryParams, 'news_category_id')
      )
      .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'is_active'))
      .execute(PROCEDURE_NAME.CRM_AUTHOR_GETLIST_ADMINWEB);

    const Author = data.recordset;
    return new ServiceResponse(true, '', {
      data: authorClass.list(Author),
      page: currentPage,
      limit: itemsPerPage,
      total: apiHelper.getTotalData(Author),
    });
  } catch (e) {
    logger.error(e, {
      function: 'AuthorService.getListAuthor',
    });

    return new ServiceResponse(true, '', {});
  }
};

const createAuthor = async (body = {}) => {
  return await createAuthorOrUpdate(body);
};

const updateAuthor = async (body = {}, author_id) => {
  body.author_id = author_id;
  return await createAuthorOrUpdate(body);
};

const createAuthorOrUpdate = async (body = {}) => {
  let avatar_image = apiHelper.getValueFromObject(body, 'avatar_image');
  if (avatar_image) {
    const path_avatar_image = await saveFile(avatar_image, folderName);
    if (path_avatar_image) {
      avatar_image = path_avatar_image;
    }
  }
  let banner_image = apiHelper.getValueFromObject(body, 'banner_image');
  if (banner_image) {
    const path_banner_image = await saveFile(banner_image, folderName);
    if (path_banner_image) {
      banner_image = path_banner_image;
    }
  }
  let identity_front_image = apiHelper.getValueFromObject(
    body,
    'identity_front_image'
  );
  if (identity_front_image) {
    const path_identity_front_image = await saveFile(
      identity_front_image,
      folderName
    );
    if (path_identity_front_image) {
      identity_front_image = path_identity_front_image;
    }
  }
  let identity_back_image = apiHelper.getValueFromObject(
    body,
    'identity_back_image'
  );
  if (identity_back_image) {
    const path_identity_back_image = await saveFile(
      identity_back_image,
      folderName
    );
    if (path_identity_back_image) {
      identity_back_image = path_identity_back_image;
    }
  }
  let banner_image_mobile = apiHelper.getValueFromObject(
    body,
    'banner_image_mobile'
  );
  if (banner_image_mobile) {
    const path_banner_image_mobile = await saveFile(
      banner_image_mobile,
      folderName
    );
    if (path_banner_image_mobile) {
      banner_image_mobile = path_banner_image_mobile;
    }
  }
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  const id = apiHelper.getValueFromObject(body, 'author_id');
  try {
    await transaction.begin();
    let password = apiHelper.getValueFromObject(body, 'password');
    if (!id) password = stringHelper.hashPassword(password);
    // Save CRM_AUTHOR
    const requestAuthor = new sql.Request(transaction);
    const resultAuthor = await requestAuthor
      .input('AUTHORID', apiHelper.getValueFromObject(body, 'author_id'))
      .input('AUTHORNAME', apiHelper.getValueFromObject(body, 'author_name'))
      .input('NICKNAME', apiHelper.getValueFromObject(body, 'nickname'))
      .input('PASSWORD', password)
      .input('AVATARIMAGE', avatar_image)
      .input('BANNERIMAGE', banner_image)
      .input('FULLNAME', apiHelper.getValueFromObject(body, 'full_name'))
      .input('FIRSTNAME', apiHelper.getValueFromObject(body, 'first_name'))
      .input('LASTNAME', apiHelper.getValueFromObject(body, 'last_name'))
      .input('BIRTHDAY', apiHelper.getValueFromObject(body, 'birthday'))
      .input('GENDER', apiHelper.getValueFromObject(body, 'gender'))
      .input('PHONENUMBER', apiHelper.getValueFromObject(body, 'phone_number'))
      .input('EMAIL', apiHelper.getValueFromObject(body, 'email'))
      .input(
        'IDENTITYNUMBER',
        apiHelper.getValueFromObject(body, 'identity_number')
      )
      .input(
        'IDENTITYDATE',
        apiHelper.getValueFromObject(body, 'identity_date')
      )
      .input(
        'IDENTITYPLACE',
        apiHelper.getValueFromObject(body, 'identity_place')
      )
      .input('IDENTITYFRONTIMAGE', identity_front_image)
      .input('IDENTITYBACKIMAGE', identity_back_image)
      .input('ADDRESS', apiHelper.getValueFromObject(body, 'address'))
      .input('PROVINCEID', apiHelper.getValueFromObject(body, 'province_id'))
      .input('DISTRICTID', apiHelper.getValueFromObject(body, 'district_id'))
      .input('COUNTRYID', apiHelper.getValueFromObject(body, 'country_id'))
      .input('WARDID', apiHelper.getValueFromObject(body, 'ward_id'))
      .input(
        'ISREVIEWNEWS',
        apiHelper.getValueFromObject(body, 'is_review_news')
      )
      .input('ABOUTME', apiHelper.getValueFromObject(body, 'about_me'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'description'))
      .input('INTRODUCE', apiHelper.getValueFromObject(body, 'introduce'))
      .input(
        'EDUCATIONCAREER',
        apiHelper.getValueFromObject(body, 'education_career')
      )
      .input(
        'AUTHORDEGREE',
        apiHelper.getValueFromObject(body, 'author_degree')
      )
      .input('AUTHORQUOTE', apiHelper.getValueFromObject(body, 'author_quote'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(body, 'order_index'))
      .input('BANNERIMAGEMOBILE', banner_image_mobile)
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_AUTHOR_CREATEORUPDATE_ADMINWEB);
    const author_id = resultAuthor.recordset[0].RESULT;
    if (author_id <= 0) {
      await transaction.rollback();
      return new ServiceResponse(false, RESPONSE_MSG.AUTHOR.CREATE_FAILED);
    }

    //Delete author category
    const requestAuthorCategoryDel = new sql.Request(transaction);
    const resultAuthorCategoryDel = await requestAuthorCategoryDel
      .input('AUTHORID', author_id)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_AUTHOR_CATEGORY_DELETEBYAUTHORID_ADMINWEB);
    if (resultAuthorCategoryDel.recordset[0].RESULT <= 0) {
      await transaction.rollback();
      return new ServiceResponse(false, RESPONSE_MSG.AUTHOR.CREATE_FAILED);
    }
    const categories = apiHelper.getValueFromObject(body, 'news_category');
    if (categories && categories.length > 0) {
      for (let i = 0; i < categories.length; i++) {
        const item = categories[i];
        const requestChild = new sql.Request(transaction);
        const resultChild = await requestChild
          .input('AUTHORID', author_id)
          .input('NEWSCATEGORYID', apiHelper.getValueFromObject(item, 'value'))
          .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
          .execute(PROCEDURE_NAME.CRM_AUTHOR_CATEGORY_CREATE_ADMINWEB);
        const child_id = resultChild.recordset[0].RESULT;
        if (child_id <= 0) {
          await transaction.rollback();
          return new ServiceResponse(false, RESPONSE_MSG.AUTHOR.CREATE_FAILED);
        }
      }
    }
    await transaction.commit();
    return new ServiceResponse(true, '', author_id);
  } catch (error) {
    logger.error(error, {
      function: 'AuthorService.createAuthorOrUpdate',
    });
    console.error('AuthorService.createAuthorOrUpdate', error);
    return new ServiceResponse(false, e.message);
  }
};

const detailAuthor = async (author_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('AUTHORID', author_id)
      .execute(PROCEDURE_NAME.CRM_AUTHOR_GETBYID_ADMINWEB);
    const Author = data.recordset[0];
    if (Author) {
      let author = authorClass.detail(Author);
      author.news_category = authorClass.listNewsCategory(data.recordsets[1]);
      return new ServiceResponse(true, '', author);
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'AuthorService.detailAuthor',
    });

    return new ServiceResponse(false, e.message);
  }
};

const deleteAuthor = async (author_id, auth_name) => {
  const pool = await mssql.pool;
  try {
    // Delete AUTHOR
    await pool
      .request()
      .input('AUTHORID', author_id)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.CRM_AUTHOR_DELETE_ADMINWEB);

    // Return ok
    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'AuthorService.deleteAuthor',
    });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};

const changeStatusAuthor = async (author_id, auth_name, is_active) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('AUTHORID', author_id)
      .input('ISACTIVE', is_active)
      .input('UPDATEDUSER', auth_name)
      .execute(PROCEDURE_NAME.CRM_AUTHOR_UPDATESTATUS_ADMINWEB);

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'AuthorService.changeStatusAuthor',
    });

    return new ServiceResponse(false);
  }
};
const saveFile = async (base64, folderName) => {
  let url = null;

  try {
    if (fileHelper.isBase64(base64)) {
      const extension = fileHelper.getExtensionFromBase64(base64);
      const guid = createGuid();
      url = await fileHelper.saveBase64(
        folderName,
        base64,
        `${guid}.${extension}`
      );
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      function: 'AuthorService.saveFile',
    });
  }
  return url;
};
const createGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const changePassAuthor = async (author_id, body = {}) => {
  try {
    const pool = await mssql.pool;
    let password = apiHelper.getValueFromObject(body, 'password');
    password = stringHelper.hashPassword(password);
    await pool
      .request()
      .input('AUTHORID', author_id)
      .input('PASSWORD', password)
      .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute(PROCEDURE_NAME.CRM_AUTHOR_CHANGEPASS_ADMINWEB);

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'AuthorService.changePassAuthor',
    });

    return new ServiceResponse(false);
  }
};

const generateAuthorName = async () => {
  try {
    const pool = await mssql.pool;
    const author = await pool.request().execute(PROCEDURE_NAME.CRM_AUTHOR_MAX);

    let data = authorClass.generateAuthorName(author.recordset[0]);
    return data;
  } catch (error) {
    console.error('AuthorService.generateAuthorName', error);
    return true;
  }
};

const findByAuthorName = async (authorName) => {
  try {
    const pool = await mssql.pool;
    const res = await pool
      .request()
      .input('AUTHORNAME', authorName)
      .execute(PROCEDURE_NAME.CRM_AUTHOR_FINDBYAUTHORNAME_ADMINWEB);
    const author = res.recordset;
    if (author.length) {
      return true;
    }
    return null;
  } catch (error) {
    console.error('authorService.findByAuthorName', error);
    return null;
  }
};

const findByEmail = async (email, author_id = null) => {
  try {
    const pool = await mssql.pool;
    const res = await pool
      .request()
      .input('EMAIL', email)
      .input('AUTHORID', author_id)
      .execute(PROCEDURE_NAME.CRM_AUTHOR_FINDBYEMAIL_ADMINWEB);
    const author = res.recordset;

    if (author.length) {
      return true;
    }

    return null;
  } catch (error) {
    console.error('authorService.findByEmail', error);
    return null;
  }
};

const findByPhone = async (phone_number, author_id = null) => {
  try {
    const pool = await mssql.pool;
    const res = await pool
      .request()
      .input('PHONENUMBER', phone_number)
      .input('AUTHORID', author_id)
      .execute(PROCEDURE_NAME.CRM_AUTHOR_FINDBYPHONENUMBER_ADMINWEB);
    const author = res.recordset;

    if (author.length) {
      return true;
    }

    return null;
  } catch (error) {
    console.error('authorService.findByPhone', error);
    return null;
  }
};

module.exports = {
  getListAuthor,
  createAuthor,
  updateAuthor,
  detailAuthor,
  deleteAuthor,
  changeStatusAuthor,
  changePassAuthor,
  generateAuthorName,
  findByAuthorName,
  findByEmail,
  findByPhone,
};
