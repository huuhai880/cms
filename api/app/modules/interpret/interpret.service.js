const InterpretClass = require('./interpret.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
///////get listInterpret
const getInterpretsList = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
      .input(
        'ISACTIVE',
        apiHelper.getFilterBoolean(queryParams, 'selectdActive')
      )
      .execute('FOR_INTERPRET_GetList_AdminWeb');
    const result = data.recordset;

    let interprets = InterpretClass.listInterpret(result)
    if (interprets && interprets.length > 0) {
      let interPretIds = interprets.map(item => item.interpret_id).join(',');
      const resDetail = await pool.request()
        .input('INTERPRETIDS', interPretIds)
        .execute('FOR_INTERPRETDETAIL_GetListByIds_AdminWeb')

      let listInterPretDetail = InterpretClass.listInterpretDetail(resDetail.recordset) || [];

      for (let index = 0; index < interprets.length; index++) {
        let interpret = interprets[index];
        let interpret_details = listInterPretDetail.filter(x =>  x.interpret_id == interpret.interpret_id);
        interpret.interpret_details = interpret_details || []
      }
    }

    return new ServiceResponse(true, '', {
      data: interprets,
      page: currentPage,
      limit: itemsPerPage,
      total: result.length,
    });
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.getInterpretsList',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////get listInterpret detail
const getDetailListByInterpret = async (queryParams = {}) => {
  try {
    const currentPage = apiHelper.getCurrentPage(queryParams);
    const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('PageSize', itemsPerPage)
      .input('PageIndex', currentPage)
      .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'keyword'))
      .input(
        'INTERPRETID',
        apiHelper.getValueFromObject(queryParams, 'interpret_id')
      )
      .input(
        'ISACTIVE',
        apiHelper.getFilterBoolean(queryParams, 'selectdActive')
      )
      .execute('FOR_INTERPRET_Detail_GetList_AdminWeb');
    const result = data.recordset;
    // console.log(apiHelper.getTotalData(result));

    return new ServiceResponse(true, '', {
      data: InterpretClass.listInterpretDetail(result),
      page: currentPage,
      limit: itemsPerPage,
      total: result.length,
    });
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.getDetailListByInterpret ',
    });

    return new ServiceResponse(true, '', {});
  }
};
/// add or update letter
const addIntergretDetail = async (body = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  // console.log(body)
  try {
    await transaction.begin();
    /////create or update number
    const requestIntergret = new sql.Request(transaction);
    const resultIntergret = await requestIntergret
      .input(
        'INTERPRETDETAILID',
        apiHelper.getValueFromObject(body, 'interpret_detail_id')
      )
      .input('INTERPRETID', apiHelper.getValueFromObject(body, 'interpret_id'))
      .input(
        'INTERPRETDETAILNAME',
        apiHelper.getValueFromObject(body, 'interpret_detail_name')
      )
      .input(
        'PARENTID',
        apiHelper.getValueFromObject(body, 'interpret_detail_parent_id')
      )
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(body, 'order_index'))
      .input(
        'FULLCONTENT',
        apiHelper.getValueFromObject(body, 'interpret_detail_full_content')
      )
      .input(
        'SHORTCONTENT',
        apiHelper.getValueFromObject(body, 'interpret_detail_short_content')
      )
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('FOR_INTERPRET_Detail_CreateOrUpdate_AdminWeb');
    const interpret_id = resultIntergret.recordset[0].RESULT;

    if (interpret_id > 0) {
      // removeCacheOptions();
      await transaction.commit();
    }
    return new ServiceResponse(true, '', interpret_id);
  } catch (error) {
    logger.error(error, {
      function: 'InterpretService.addIntergretDetail',
    });
    console.error('InterpretService.addIntergretDetail', error);
    return new ServiceResponse(false, e.message);
  }
};
///////get list parent interpret
const getDetailInterpretParent = async (interpret_id) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('INTERPRETID', interpret_id)
      .execute('FOR_INTERPRET_Detail_Listparent_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: InterpretClass.listInterpretParent(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.getDetailInterpretParent ',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////get list attribute
const getAttributesList = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_INTERPRET_getAttributesList_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: InterpretClass.listAttribute(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.getAttributesList',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////get list relationship
const getRelationshipsList = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_INTERPRET_getRelationshipsList_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: InterpretClass.listRelationship(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.getRelationshipsList',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////get list mainnumber
const getMainNumberList = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_INTERPRET_getMainNumberList_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: InterpretClass.listMainnumber(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.getMainNumberList',
    });

    return new ServiceResponse(true, '', {});
  }
};
/// add or update letter
const addIntergret = async (body = {}) => {
  // console.log(body);

  // console.log(body)
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  try {
    await transaction.begin();

    /////create or update number
    const requestIntergret = new sql.Request(transaction);
    const resultIntergret = await requestIntergret
      .input('INTERPRETID', apiHelper.getValueFromObject(body, 'interpret_id'))
      .input('ATTRIBUTEID', apiHelper.getValueFromObject(body, 'attribute_id'))
      .input(
        'MAINNUMBERID',
        apiHelper.getValueFromObject(body, 'mainnumber_id')
      )
      .input(
        'RELATIONSHIPID',
        apiHelper.getValueFromObject(body, 'relationship_id')
      )
      .input(
        'COMPARENUM',
        apiHelper.getValueFromObject(body, 'compare_mainnumber_id')
      )
      .input('ISMASTER', apiHelper.getValueFromObject(body, 'is_master'))
      .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
      .input('ORDERINDEX', apiHelper.getValueFromObject(body, 'order_index'))
      .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'decs'))
      .input(
        'BRIEFDESCRIPTION',
        apiHelper.getValueFromObject(body, 'brief_decs')
      )
      .input('NOTE', apiHelper.getValueFromObject(body, 'note'))
      .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('FOR_INTERPRET_CreateOrUpdate_AdminWeb');
    const interpret_id = resultIntergret.recordset[0].RESULT;

    if (interpret_id > 0) {
      // removeCacheOptions();
      await transaction.commit();
    }
    return new ServiceResponse(true, '', interpret_id);
  } catch (error) {
    logger.error(error, {
      function: 'InterpretService.addIntergret',
    });
    console.error('InterpretService.addIntergret', error);
    return new ServiceResponse(false, e.message);
  }
};
///////detail Intergret
const detaiIntergret = async (interpret_id) => {
  // console.log(interpret_id)
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('INTERPRETID', interpret_id)
      .execute('FOR_INTERPRET_GetById_AdminWeb');
    const Intergret = data.recordset[0];
    // console.log(InterpretClass.detailInterpret(Intergret))
    if (Intergret) {
      return new ServiceResponse(
        true,
        '',
        InterpretClass.detailInterpret(Intergret)
      );
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.detaiIntergret',
    });

    return new ServiceResponse(false, e.message);
  }
};
///////detail Intergret
const detaiDetailInterpret = async (interpret_detail_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('INTERPRETDETAILID', interpret_detail_id)
      .execute('FOR_INTERPRETDETAIL_GetById_AdminWeb');
    const Intergret = data.recordset[0];
    // console.log(Intergret)
    if (Intergret) {
      return new ServiceResponse(
        true,
        '',
        InterpretClass.detailInterpretDetail(Intergret)
      );
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.detaiIntergret',
    });

    return new ServiceResponse(false, e.message);
  }
};
//////delete interpret
const deleteInterpret = async (interpret_id, body) => {
  const pool = await mssql.pool;
  try {
    await pool
      .request()
      .input('INTERPRETID', interpret_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('FOR_INTERPRET_Delete_AdminWeb');
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.deleteInterpret',
    });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};
//////delete interpret detail
const deleteDetailInterpret = async (interpret_detail_id, body) => {
  const pool = await mssql.pool;
  try {
    await pool
      .request()
      .input('INTERPRETDETAILID', interpret_detail_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('FOR_INTERPRET_Detail_Delete_AdminWeb');
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.deleteDetailInterpret',
    });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};
/////check letter
const CheckDetailInterpret = async (interpret_detail_name) => {
  // console.log(email)
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('INTERPRETDETAILNAME', interpret_detail_name)
      .execute('FOR_INTERPRET_Detail_CheckInterpretName_AdminWeb');
    const res = data.recordset[0];
    if (res) {
      return new ServiceResponse(true, '', res);
    }
    return new ServiceResponse(true, '', '');
  } catch (error) {
    return new ServiceResponse(false, error.message);
  }
};
module.exports = {
  getRelationshipsList,
  getAttributesList,
  getMainNumberList,
  addIntergret,
  detaiIntergret,
  getInterpretsList,
  deleteInterpret,
  getDetailListByInterpret,
  deleteDetailInterpret,
  getDetailInterpretParent,
  addIntergretDetail,
  CheckDetailInterpret,
  detaiDetailInterpret,
};
