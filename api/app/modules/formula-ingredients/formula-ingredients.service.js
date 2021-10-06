const IngredientClass = require('./formula-ingredients.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const sql = require('mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const _ = require('lodash');
// const fileHelper = require('../../common/helpers/file.helper');
// const folderName = 'mainNumber';
// const config = require('../../../config/config');
///////get list main number
const getIngredientsList = async (queryParams = {}) => {
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
        'CREATEDDATEFROM',
        apiHelper.getValueFromObject(queryParams, 'startDate')
      )
      .input(
        'CREATEDDATETO',
        apiHelper.getValueFromObject(queryParams, 'endDate')
      )
      .input('ISTYPE', apiHelper.getFilterBoolean(queryParams, 'selectdType'))
      .input(
        'ISACTIVE',
        apiHelper.getFilterBoolean(queryParams, 'selectdActive')
      )
      .execute('FOR_FORMULAINGREDIENTS_GetList_AdminWeb');
    const result = data.recordset;
    // console.log(apiHelper.getTotalData(result));

    return new ServiceResponse(true, '', {
      data: IngredientClass.list(result),
      page: currentPage,
      limit: itemsPerPage,
      total: result.length,
    });
  } catch (e) {
    logger.error(e, {
      function: 'IngredientService.getIngredientsList',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////delete Ingredient
const deleteIngredient = async (ingredient_id, body) => {
  // console.log(ingredient_id)
  const pool = await mssql.pool;
  try {
    await pool
      .request()
      .input('INGREDIENTID', ingredient_id)
      .input('DELETEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
      .execute('FOR_FORMULAINGREDIENTS_delete_AdminWeb');
    return new ServiceResponse(true, '');
  } catch (e) {
    logger.error(e, {
      function: 'IngredientService.deleteIngredient',
    });

    // Return failed
    return new ServiceResponse(false, e.message);
  }
};
/////check ingredient
const CheckIngredient = async (ingredient_name) => {
  // console.log(ingredient_name)
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .input('INGREDIENTNAME', ingredient_name)
      .execute('FOR_FORMULAINGREDIENT_CheckIngredient_AdminWeb');
    const res = data.recordset[0];
    if (res) {
      return new ServiceResponse(true, '', res);
    }
    return new ServiceResponse(true, '', '');
  } catch (error) {
    return new ServiceResponse(false, error.message);
  }
};
/// add or update letter
const addIngredient = async (body = {}) => {
  const pool = await mssql.pool;
  const transaction = await new sql.Transaction(pool);
  // console.log(body)
  try {
    await transaction.begin();
    /////create or update number
    const requestIngredient = new sql.Request(transaction);
    // console.log(apiHelper.getValueFromObject(body, 'is_total_shortened') == 1)
    if (
      apiHelper.getValueFromObject(body, 'is_total_shortened') == 1 ||
      apiHelper.getValueFromObject(body, 'is_no_total_shortened') == 1 ||
      (apiHelper.getValueFromObject(body, 'is_total_shortened') == '' &&
        apiHelper.getValueFromObject(body, 'is_no_total_shortened') == '' &&
        apiHelper.getValueFromObject(body, 'is_total_2_digit') == '')
    ) {
      const resultIngredient = await requestIngredient
        .input(
          'INGREDIENTID',
          apiHelper.getValueFromObject(body, 'ingredient_id')
        )
        .input(
          'INGREDIENTNAME',
          apiHelper.getValueFromObject(body, 'ingredient_name')
        )
        .input(
          'PARAMNAMEID',
          apiHelper.getValueFromObject(body, 'param_name_id')
        )
        .input(
          'CALCULATIONID',
          apiHelper.getValueFromObject(body, 'calculation_id')
        )
        .input(
          'ISGENDER',
          apiHelper.getValueFromObject(body, 'is_gender')
        )
        .input('PARAMDOBID', apiHelper.getValueFromObject(body, 'param_dob_id'))
        .input('ISVOWELs', apiHelper.getValueFromObject(body, 'is_vowel'))
        .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
        .input('ISAPPLYDOB', apiHelper.getValueFromObject(body, 'is_apply_dob'))
        .input(
          'VALUEINGREDIENTS',
          apiHelper.getValueFromObject(body, 'ingredient_value')
        )
        .input(
          'ISAPPLYNAME',
          apiHelper.getValueFromObject(body, 'is_apply_name')
        )
        .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'desc'))
        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
        .input(
          'ISONLYFIRSTVOWEL',
          apiHelper.getValueFromObject(body, 'is_onlyfirst_vowel')
        )
        .input(
          'ISCONSONANT',
          apiHelper.getValueFromObject(body, 'is_consonant')
        )
        .input(
          'ISFIRSTLETTER',
          apiHelper.getValueFromObject(body, 'is_first_letter')
        )
        .input(
          'ORTHERINGREDIENTID1',
          apiHelper.getValueFromObject(body, 'ingredient__child_1_id')
        )
        .input(
          'ORTHERINGREDIENTID2',
          apiHelper.getValueFromObject(body, 'ingredient__child_2_id')
        )
        .input(
          'ISLASTLETTER',
          apiHelper.getValueFromObject(body, 'is_last_letter')
        )
        .input(
          'ISNUMSHOW3TIME',
          apiHelper.getValueFromObject(body, 'is_show_3_time')
        )
        .input(
          'ISNUMSHOW0TIME',
          apiHelper.getValueFromObject(body, 'is_show_0_time')
        )
        .input(
          'ISTOTALSHORTENED',
          apiHelper.getValueFromObject(body, 'is_total_shortened')
        )
        .input(
          'ISTOTALNOSHORTENED',
          apiHelper.getValueFromObject(body, 'is_no_total_shortened')
        )
        .input(
          'ISTOTAL2DIGIT',
          apiHelper.getValueFromObject(body, 'is_total_2_digit')
        )
        .input(
          'ISCURRENTAGE',
          apiHelper.getValueFromObject(body, 'is_crrent_age')
        )
        .input(
          'ISCURRENTYEAR',
          apiHelper.getValueFromObject(body, 'is_crrent_year')
        )
        .input(
          'ISVALUEINGREDIENTS',
          apiHelper.getValueFromObject(body, 'is_value')
        )
        .input(
          'GETLAST2DIGITS',
          apiHelper.getValueFromObject(body, 'is_get_last_2_digit')
        )

        .input(
          'ISNUMLETTERS1DIGIT',
          apiHelper.getValueFromObject(body, 'is_numletter_digit')
        )
        .input(
          'ISTOTALVALUES1DIGIT',
          apiHelper.getValueFromObject(body, 'is_total_value_digit')
        )
        .input(
          'ISTOTALFIRSTLETTER1DIGIT',
          apiHelper.getValueFromObject(body, 'is_total_letter_first_digit')
        )
        .input(
          'ISTOTALLETTERS1DIGIT',
          apiHelper.getValueFromObject(body, 'is_total_letter_digit')
        )
        .input(
          'ISCOUNTOFNUM',
          apiHelper.getValueFromObject(body, 'is_count_tofnum')
        )
        .execute('FOR_FORMULAINGREDIENTS_CreateOrupdate_AdminWeb');
      const letter_id = resultIngredient.recordset[0].RESULT;

      if (letter_id > 0) {
        // removeCacheOptions();
        await transaction.commit();
      }
      return new ServiceResponse(true, '', letter_id);
    } else if (apiHelper.getValueFromObject(body, 'is_total_2_digit') == 1) {
      const resultIngredient = await requestIngredient
        .input(
          'INGREDIENTID',
          apiHelper.getValueFromObject(body, 'ingredient_id')
        )
        .input(
          'INGREDIENTNAME',
          apiHelper.getValueFromObject(body, 'ingredient_name')
        )
        .input(
          'PARAMNAMEID',
          apiHelper.getValueFromObject(body, 'param_name_id')
        )
        .input(
          'CALCULATIONID',
          apiHelper.getValueFromObject(body, 'calculation_id')
        )
        .input(
          'ISGENDER',
          apiHelper.getValueFromObject(body, 'is_gender')
        )
        .input('PARAMDOBID', apiHelper.getValueFromObject(body, 'param_dob_id'))
        .input('ISVOWELs', apiHelper.getValueFromObject(body, 'is_vowel'))
        .input('ISACTIVE', apiHelper.getValueFromObject(body, 'is_active'))
        .input('ISAPPLYDOB', apiHelper.getValueFromObject(body, 'is_apply_dob'))
        .input(
          'VALUEINGREDIENTS',
          apiHelper.getValueFromObject(body, 'ingredient_value')
        )
        .input(
          'ISAPPLYNAME',
          apiHelper.getValueFromObject(body, 'is_apply_name')
        )
        .input('DESCRIPTION', apiHelper.getValueFromObject(body, 'desc'))
        .input('CREATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
        .input(
          'ISONLYFIRSTVOWEL',
          apiHelper.getValueFromObject(body, 'is_onlyfirst_vowel')
        )
        .input(
          'ISCONSONANT',
          apiHelper.getValueFromObject(body, 'is_consonant')
        )
        .input(
          'ISFIRSTLETTER',
          apiHelper.getValueFromObject(body, 'is_first_letter')
        )
        .input(
          'ORTHERINGREDIENTID1',
          apiHelper.getValueFromObject(body, 'ingredient__child_1_id')
        )
        .input(
          'ORTHERINGREDIENTID2',
          apiHelper.getValueFromObject(body, 'ingredient__child_2_id')
        )
        .input(
          'ISLASTLETTER',
          apiHelper.getValueFromObject(body, 'is_last_letter')
        )
        .input(
          'ISNUMSHOW3TIME',
          apiHelper.getValueFromObject(body, 'is_show_3_time')
        )
        .input(
          'ISNUMSHOW0TIME',
          apiHelper.getValueFromObject(body, 'is_show_0_time')
        )
        .input(
          'ISTOTALSHORTENED',
          apiHelper.getValueFromObject(body, 'is_total_shortened')
        )
        .input(
          'ISTOTALNOSHORTENED',
          apiHelper.getValueFromObject(body, 'is_no_total_shortened')
        )
        .input(
          'ISTOTAL2DIGIT',
          apiHelper.getValueFromObject(body, 'is_total_2_digit')
        )
        .input(
          'ISCURRENTAGE',
          apiHelper.getValueFromObject(body, 'is_crrent_age')
        )
        .input(
          'ISCURRENTYEAR',
          apiHelper.getValueFromObject(body, 'is_crrent_year')
        )
        .input(
          'ISVALUEINGREDIENTS',
          apiHelper.getValueFromObject(body, 'is_value')
        )
        .input(
          'GETLAST2DIGITS',
          apiHelper.getValueFromObject(body, 'is_get_last_2_digit')
        )

        .input(
          'ISNUMLETTERS2DIGIT',
          apiHelper.getValueFromObject(body, 'is_numletter_digit')
        )
        .input(
          'ISTOTALVALUES2DIGIT',
          apiHelper.getValueFromObject(body, 'is_total_value_digit')
        )
        .input(
          'ISTOTALFIRSTLETTER2DIGIT',
          apiHelper.getValueFromObject(body, 'is_total_letter_first_digit')
        )
        .input(
          'ISTOTALLETTERS2DIGIT',
          apiHelper.getValueFromObject(body, 'is_total_letter_digit')
        )
        .input(
          'ISCOUNTOFNUM',
          apiHelper.getValueFromObject(body, 'is_count_tofnum')
        )
        .execute('FOR_FORMULAINGREDIENTS_CreateOrupdate_AdminWeb');
      const letter_id = resultIngredient.recordset[0].RESULT;

      if (letter_id > 0) {
        // removeCacheOptions();
        await transaction.commit();
      }
      return new ServiceResponse(true, '', letter_id);
    }
  } catch (error) {
    logger.error(error, {
      function: 'IngredientService.addIngredient',
    });
    console.error('IngredientService.addIngredient', error);
    return new ServiceResponse(false, e.message);
  }
};
///////detail list letter
const detailIngredient = async (ingredient_id) => {
  try {
    const pool = await mssql.pool;

    const data = await pool
      .request()
      .input('INGREDIENTID', ingredient_id)
      .execute('FOR_FORMULAINGREDIENTS_GetById_AdminWeb');
    const Letter = data.recordset[0];
    // console.log(Letter)
    if (Letter) {
      return new ServiceResponse(true, '', IngredientClass.detail(Letter));
    }
    return new ServiceResponse(false, '', null);
  } catch (e) {
    logger.error(e, {
      function: 'IngredientService.detailIngredient',
    });

    return new ServiceResponse(false, e.message);
  }
};
///////get list paramname
const getParamName = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_FORMULAINGREDIENTS_GetListParamName_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: IngredientClass.listParamName(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'IngredientService.getParamName',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////get list paramname
const getIngredientList = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_FORMULAINGREDIENTS_GetListIngredient_AdminWeb');
    const result = data.recordset;
    console.log(result);

    return new ServiceResponse(true, '', {
      data: IngredientClass.listIngredient(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'IngredientService.getParamName',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////get list relationship
const GetListCalculation = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_FORMULAINGREDIENTS_GetListCalculation_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: IngredientClass.listCalculation(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.getRelationshipsList',
    });

    return new ServiceResponse(true, '', {});
  }
};
///////get list mainnumber
const GetListParamDob = async (queryParams = {}) => {
  try {
    const pool = await mssql.pool;
    const data = await pool
      .request()
      .execute('FOR_FORMULAINGREDIENTS_GetListParamDob_AdminWeb');
    const result = data.recordset;
    // console.log(result);

    return new ServiceResponse(true, '', {
      data: IngredientClass.listParamDob(result),
    });
  } catch (e) {
    logger.error(e, {
      function: 'InterpretService.getMainNumberList',
    });

    return new ServiceResponse(true, '', {});
  }
};
module.exports = {
  getIngredientsList,
  GetListCalculation,
  getParamName,
  GetListParamDob,
  deleteIngredient,
  addIngredient,
  detailIngredient,
  getIngredientList,
  CheckIngredient,
};
