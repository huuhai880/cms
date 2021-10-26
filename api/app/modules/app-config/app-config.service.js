const configClass = require('./app-config.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const stringHelper = require('../../common/helpers/string.helper');
const _ = require('lodash');
const fileHelper = require('../../common/helpers/file.helper');
const folderName = 'config';
const config = require('../../../config/config');
const BANNER = require('../../common/const/banner.const');
const { log } = require('../../common/classes/logger.class');


const getListPlacementForBanner = async () => {
  try {
    return new ServiceResponse(true, 'ok', BANNER.PLACEMENT)
  } catch (e) {
    logger.error(e, {'function': 'AppConfig.getListPlacementForBanner'});
    return new ServiceResponse(false, e.message);
  }
};

const getListPageConfig = async () => {
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('KEYCONFIG', 'SETTING_WEBSITE')
      .execute(PROCEDURE_NAME.SYS_APPCONFIG_GETBYKEY_ADMINWEB);
    const configs = data && data.recordset && data.recordset.length ? configClass.list(data.recordset) : []
    return new ServiceResponse(true, '', configs);
  } catch (e) {
    logger.error(e, {'function': 'AppConfig.getListPageConfig'});
    return new ServiceResponse(false, e.message);
  }
}

const getPageConfig = async (page = '') => {
  // console.log(page)
  try {
    const pool = await mssql.pool;
    const data = await pool.request()
      .input('PAGECONFIG', page)
      .execute(PROCEDURE_NAME.SYS_APPCONFIG_GETBYPAGESETTING_ADMINWEB);
    const configs = data && data.recordset && data.recordset.length ? configClass.list(data.recordset) : []
    // console.log(configs)

    let configObject =  (configs||[]).reduce((obj, config) => {
      obj[config.config_key] = {
        value: config.data_type == 'json' ? JSON.parse(config.config_value) : config.config_value,
        data_type: config.data_type
      }
      return obj;
    }, {});
    // Check item in object has image 
    (Object.keys(configObject) ||[]).forEach((k) => {
      const value = configObject[k].value;
      if(Array.isArray(value)){
        for(let i = 0; i < value.length; i ++){
            if(typeof value[i] === 'object'){
              (Object.keys(value[i])||[]).forEach((ki) => {
                if(ki.includes('image')){
                  configObject[k].value[i][ki] =`${config.domain_cdn}${value[i][ki]}` 
                }
              })
            }
        }
      }
    })
    return new ServiceResponse(true, '', configObject);
  } catch (e) {
    logger.error(e, {'function': 'AppConfig.getPageConfig'});
    return new ServiceResponse(false, e.message);
  }
}

const updatePageConfig = async (bodyParams = {}) => {
  try {
    let { page, configs = {} } = bodyParams;
  // console.log(page,configs)
   
    delete configs.auth_id;
    delete configs.auth_name;
    delete configs.data;

    if(Object.keys(configs).length){
      const pool = await mssql.pool;
      (Object.keys(configs)||[]).forEach( async (key) => {
        if(key && configs[key]){
          let config = configs[key];
          let { value, data_type  = 'string'} = config;
          if(typeof value === 'string'){
            if(key.includes('_IMAGE') || data_type == 'image'){
              // upload image 
              if (value) {
                const path_image = await saveFile(value, folderName);
                if (path_image) {
                  value = path_image;
                  data_type = 'image';
                }
              }
            }
          }
          else if(Array.isArray(value)){
            // CHAY O DAY
            for(let i = 0; i < value.length; i ++){
              for( let k in value[i]){
                if(k.includes('image')){
                  if (value[i][k]) {
                    const path_image = await saveFile(value[i][k], folderName);
                    if (path_image) {
                      value[i][k] = path_image;
                    }
                  }
                }
              }
            }
            value = JSON.stringify(value);
          }
         
          await pool.request()
            .input('PAGECONFIG', page)
            .input('KEYCONFIG', key)
            .input('VALUECONFIG', value)
            .input('DATATYPE', data_type)
            .execute(PROCEDURE_NAME.SYS_APPCONFIG_UPDATEPAGESETTING_ADMINWEB);
        }
      })
    }
    return new ServiceResponse(true, '', 'ok');
  } catch (e) {
    logger.error(e, {'function': 'AppConfig.updatePageConfig'});
    return new ServiceResponse(false, e.message);
  }
}

const saveFile = async (base64, folderName) => {
  let url = null;

  try {
    if (fileHelper.isBase64(base64)) {
      const extension = fileHelper.getExtensionFromBase64(base64);
      const guid = createGuid();
      url = await fileHelper.saveBase64(folderName, base64, `${guid}.${extension}`);
    } else {
      url = base64.split(config.domain_cdn)[1];
    }
  } catch (e) {
    logger.error(e, {
      'function': 'AuthorService.saveFile',
    });
  }
  return url;
};
const createGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

module.exports = {
    getListPlacementForBanner,
    getListPageConfig,
    getPageConfig,
    updatePageConfig
};
