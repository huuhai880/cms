const InterpretClass = require('./interpret.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');

const getInterpretsList = async (queryParams = {}) => {
   try {
      const currentPage = apiHelper.getCurrentPage(queryParams);
      const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
      let keyword = apiHelper.getValueFromObject(queryParams, 'keyword', null)
      const pool = await mssql.pool;
      const data = await pool
         .request()
         .input('PageSize', itemsPerPage)
         .input('PageIndex', currentPage)
         .input('KEYWORD', keyword)
         .input('ISACTIVE', apiHelper.getFilterBoolean(queryParams, 'selectdActive'))
         .execute('FOR_INTERPRET_GetList_AdminWeb');

      const result = data.recordset;

      let interprets = InterpretClass.listInterpret(result)
      if (interprets && interprets.length > 0) {
         let interPretIds = interprets.map(item => item.interpret_id).join(',');
         const resDetail = await pool.request()
            .input('INTERPRETIDS', interPretIds)
            .input('KEYWORD', keyword)
            .execute('FOR_INTERPRETDETAIL_GetListByIds_AdminWeb')

         let listInterPretDetail = InterpretClass.listInterpretDetail(resDetail.recordset) || [];

         for (let index = 0; index < interprets.length; index++) {
            let interpret = interprets[index];
            let interpret_details = listInterPretDetail.filter(x => x.interpret_id == interpret.interpret_id);
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
         function: 'interpret.service.getInterpretsList',
      });

      return new ServiceResponse(true, '', {});
   }
};

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

      return new ServiceResponse(true, '', {
         data: InterpretClass.listInterpretDetail(result),
         page: currentPage,
         limit: itemsPerPage,
         total: result.length,
      });
   } catch (e) {
      logger.error(e, {
         function: 'interpret.service.getDetailListByInterpret ',
      });

      return new ServiceResponse(true, '', {});
   }
};

const addIntergretDetail = async (body = {}) => {
   try {
      const pool = await mssql.pool;

      const resultIntergret = await pool.request()
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

      return new ServiceResponse(true, '', interpret_id);
   } catch (error) {
      logger.error(error, {
         function: 'interpret.service.addIntergretDetail',
      });
      console.error('interpret.service.addIntergretDetail', error);
      return new ServiceResponse(false, e.message);
   }
};

const getListInterpretParent = async (interpret_id, interpret_detail_id) => {
   try {
      const pool = await mssql.pool;
      const data = await pool
         .request()
         .input('INTERPRETID', interpret_id)
         .input('INTERPRETDETAILID', interpret_detail_id)
         .execute('FOR_INTERPRETDETAIL_ListParent_AdminWeb');

      const result = data.recordset;

      return new ServiceResponse(true, '', {
         data: InterpretClass.listInterpretParent(result),
      });
   } catch (e) {
      logger.error(e, {
         function: 'interpret.service.getListInterpretParent ',
      });

      return new ServiceResponse(true, '', {});
   }
};

const getAttributesList = async (queryParams = {}) => {
   try {
      const pool = await mssql.pool;
      const data = await pool
         .request()
         .execute('FOR_INTERPRET_getAttributesList_AdminWeb');
      const result = data.recordset;

      return new ServiceResponse(true, '', {
         data: InterpretClass.listAttribute(result),
      });
   } catch (e) {
      logger.error(e, {
         function: 'interpret.service.getAttributesList',
      });

      return new ServiceResponse(true, '', {});
   }
};

const getRelationshipsList = async (queryParams = {}) => {
   try {
      const pool = await mssql.pool;
      const data = await pool
         .request()
         .execute('FOR_INTERPRET_getRelationshipsList_AdminWeb');
      const result = data.recordset;

      return new ServiceResponse(true, '', {
         data: InterpretClass.listRelationship(result),
      });
   } catch (e) {
      logger.error(e, {
         function: 'interpret.service.getRelationshipsList',
      });

      return new ServiceResponse(true, '', {});
   }
};

const getMainNumberList = async (queryParams = {}) => {
   try {
      const pool = await mssql.pool;
      const data = await pool
         .request()
         .execute('FOR_INTERPRET_getMainNumberList_AdminWeb');
      const result = data.recordset;

      return new ServiceResponse(true, '', {
         data: InterpretClass.listMainnumber(result),
      });
   } catch (e) {
      logger.error(e, {
         function: 'interpret.service.getMainNumberList',
      });

      return new ServiceResponse(true, '', {});
   }
};

const addIntergret = async (body = {}) => {
   try {
      const pool = await mssql.pool;
      const resultIntergret = await pool.request()
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
         .input('ISFORPOWERDIAGRAM', apiHelper.getValueFromObject(body, 'is_for_power_diagram'))
         .input('COMPAREATTRIBUTEID', apiHelper.getValueFromObject(body, 'compare_attribute_id', null))
         .execute('FOR_INTERPRET_CreateOrUpdate_AdminWeb');

      const interpret_id = resultIntergret.recordset[0].RESULT;
      return new ServiceResponse(true, '', interpret_id);

   } catch (error) {
      logger.error(error, {
         function: 'Interpret.Service.addIntergret',
      });
      console.error('Interpret.Service.addIntergret', error);
      return new ServiceResponse(false, e.message);
   }
};

const detaiIntergret = async (interpret_id) => {
   try {
      const pool = await mssql.pool;

      const data = await pool
         .request()
         .input('INTERPRETID', interpret_id)
         .execute('FOR_INTERPRET_GetById_AdminWeb');
      const Intergret = data.recordset[0];
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
         function: 'interpret.service.detaiIntergret',
      });

      return new ServiceResponse(false, e.message);
   }
};

const detaiDetailInterpret = async (interpret_detail_id) => {
   try {
      const pool = await mssql.pool;

      const data = await pool
         .request()
         .input('INTERPRETDETAILID', interpret_detail_id)
         .execute('FOR_INTERPRETDETAIL_GetById_AdminWeb');
      const Intergret = data.recordset[0];
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
         function: 'interpret.service.detaiIntergret',
      });

      return new ServiceResponse(false, e.message);
   }
};

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
         function: 'interpret.service.deleteInterpret',
      });
      return new ServiceResponse(false, e.message);
   }
};

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
         function: 'interpret.service.deleteDetailInterpret',
      });
      return new ServiceResponse(false, e.message);
   }
};

const CheckDetailInterpret = async (interpret_detail_name) => {
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

const getListAttributeExcludeById = async (attribute_id, interpret_id) => {
   try {
      const pool = await mssql.pool;
      const res = await pool.request()
         .input('ATTRIBUTEID', attribute_id)
         .input('INTERPRETID', interpret_id)
         .execute('FOR_ATTRIBUTES_GetListExcludeById_AdminWeb')

      return new ServiceResponse(true, "", InterpretClass.listAttribute(res.recordset))
   } catch (e) {
      logger.error(e, {
         function: 'interpret.service.getListAttributeExcludeById',
      });
      return new ServiceResponse(false, e.message);
   }
}


const copyIntergret = async (body = {}) => {
   try {
      const pool = await mssql.pool;
      const resultIntergret = await pool.request()
         .input('INTERPRETIDCOPY', apiHelper.getValueFromObject(body, 'interpret_id'))
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
         .input('ISFORPOWERDIAGRAM', apiHelper.getValueFromObject(body, 'is_for_power_diagram'))
         .input('COMPAREATTRIBUTEID', apiHelper.getValueFromObject(body, 'compare_attribute_id', null))
         .execute('FOR_INTERPRET_Copy_AdminWeb');

      const { interpret_id } = resultIntergret.recordset[0];
      return new ServiceResponse(true, '', interpret_id);
   } catch (error) {
      logger.error(error, {
         function: 'Interpret.Service.copyIntergret',
      });
      console.error('Interpret.Service.copyIntergret', error);
      return new ServiceResponse(false, e.message);
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
   getListInterpretParent,
   addIntergretDetail,
   CheckDetailInterpret,
   detaiDetailInterpret,
   getListAttributeExcludeById,
   copyIntergret
};
