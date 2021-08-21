module.exports = {
  // Procedure USER
  SYS_USER_FINDBYUSERNAME: 'SYS_USER_FindByUsername',
  SYS_USER_FINDBYEMAIL: 'SYS_USER_FindByEmail',
  SYS_USER_GETLIST: 'SYS_USER_GetList',
  SYS_USER_GETOPTIONS: 'SYS_USER_GetOptions',
  SYS_USER_GETBYFUNCTIONALIAS: 'SYS_USER_GetByFunctionAlias',
  SYS_USER_CREATEORUPDATE: 'SYS_USER_CreateOrUpdate',
  SYS_USER_GETUSERBYID: 'SYS_USER_GetUserById',
  SYS_USER_DELETE: 'SYS_USER_Delete',
  SYS_USER_CHANGEPASSWORD: 'SYS_USER_ChangePassword',
  SYS_USER_CHECKPASSWORD: 'SYS_USER_CheckPassword',
  SYS_USER_MAX: 'SYS_USER_MAX',
  SYS_USER_LOGIN_LOG_CREATE: 'SYS_USER_LOGIN_LOG_Create',

  // Procedure COMMON
  CBO_COMMON_GETALL: 'CBO_COMMON_GetAll',

  // Function Group
  SYS_FUNCTIONGROUP_GETLIST: 'SYS_FUNCTIONGROUP_GetList',
  SYS_FUNCTIONGROUP_CREATEORUPDATE: 'SYS_FUNCTIONGROUP_CreateOrUpdate',
  SYS_FUNCTIONGROUP_GETBYID: 'SYS_FUNCTIONGROUP_GetById',
  SYS_FUNCTIONGROUP_DELETE: 'SYS_FUNCTIONGROUP_Delete',
  SYS_FUNCTIONGROUP_UPDATESTATUS: 'SYS_FUNCTIONGROUP_UpdateStatus',
  SYS_FUNCTIONGROUP_CHECKNAME: 'SYS_FUNCTIONGROUP_CheckName',

  // Procedure USERGROUP
  SYS_USERGROUP_GETLIST: 'SYS_USERGROUP_GetList',
  SYS_USERGROUP_CREATEORUPDATE: 'SYS_USERGROUP_CreateOrUpdate',
  SYS_USERGROUP_GETBYID: 'SYS_USERGROUP_GetById',
  SYS_USERGROUP_DELETE: 'SYS_USERGROUP_Delete',
  SYS_USERGROUP_UPDATESTATUS: 'SYS_USERGROUP_UpdateStatus',
  SYS_USERGROUP_CHECKNAME: 'SYS_USERGROUP_CheckName',

  // Procedure FUNCTION
  SYS_FUNCTION_GETLIST: 'SYS_FUNCTION_GetList',
  SYS_FUNCTION_CREATEORUPDATE: 'SYS_FUNCTION_CreateOrUpdate',
  SYS_FUNCTION_GETBYID: 'SYS_FUNCTION_GetById',
  SYS_FUNCTION_DELETE: 'SYS_FUNCTION_Delete',
  SYS_FUNCTION_UPDATESTATUS: 'SYS_FUNCTION_UpdateStatus',
  SYS_FUNCTION_CHECKALIAS: 'SYS_FUNCTION_CheckAlias',
  SYS_FUNCTION_CHECKNAME: 'SYS_FUNCTION_CheckName',
  SYS_FUNCTION_GETLISTBYUSERGROUP: 'SYS_FUNCTION_GetListByUserGroup',

  // Procedure MENU
  SYS_MENU_GETLIST: 'SYS_MENU_GetList',
  SYS_MENU_CREATEORUPDATE: 'SYS_MENU_CreateOrUpdate',
  SYS_MENU_GETBYID: 'SYS_MENU_GetById',
  SYS_MENU_DELETE: 'SYS_MENU_Delete',
  SYS_MENU_UPDATESTATUS: 'SYS_MENU_UpdateStatus',
  SYS_MENU_GETBYUSERGROUP: 'SYS_MENU_GetByUserGroup',

  // Procedure USER_USERGROUP
  SYS_USER_USERGROUP_Delete: 'SYS_USER_USERGROUP_Delete',
  SYS_USER_USERGROUP_Create: 'SYS_USER_USERGROUP_Create',
  SYS_USER_GETPERMISSIONBYUSERGROUP: 'SYS_USER_GetPermissionByUserGroup',
  // Procedure SYS_USERGROUP_FUNCTION
  SYS_USERGROUP_FUNCTION_DELETE: 'SYS_USERGROUP_FUNCTION_Delete',
  SYS_USERGROUP_FUNCTION_DELETEBYFUCTIONGROUP:
    'SYS_USERGROUP_FUNCTION_DeleteByFunctionGroup',
  SYS_USERGROUP_FUNCTION_CREATE: 'SYS_USERGROUP_FUNCTION_Create',
  SYS_USERGROUP_FUNCTION_GETLISTBYFUNCTIONGROUP:
    'SYS_USERGROUP_FUNCTION_GetListByFunctionGroup ',
  SYS_FUNCTION_GETLISTBYFUNCTIONGROUP: 'SYS_FUNCTION_GetListByFunctionGroup',

  // Procedure SYS_ERROR
  SYS_ERROR_CREATE: 'SYS_ERROR_Create',

  // Procedure AM_COMPANY
  AM_COMPANY_GETLIST: 'AM_COMPANY_GetList',
  AM_COMPANY_CREATEORUPDATE: 'AM_COMPANY_CreateOrUpdate',
  AM_COMPANY_GETBYID: 'AM_COMPANY_GetById',
  AM_COMPANY_DELETE: 'AM_COMPANY_Delete',
  AM_COMPANY_UPDATESTATUS: 'AM_COMPANY_UpdateStatus',
  AM_COMPANY_CHECKUSED: 'AM_COMPANY_CheckUsed',
  AM_COMPANY_CHECKEXIST: 'AM_COMPANY_CheckExists',
  // Procedure AM_BUSINESSTYPE
  AM_BUSINESSTYPE_GETLIST: 'AM_BUSINESSTYPE_GetList',
  AM_BUSINESSTYPE_CHECKNAME: 'AM_BUSINESSTYPE_CheckName',
  AM_BUSINESSTYPE_CREATEORUPDATE: 'AM_BUSINESSTYPE_CreateOrUpdate',
  AM_BUSINESSTYPE_GETBYID: 'AM_BUSINESSTYPE_GetById',
  AM_BUSINESSTYPE_DELETE: 'AM_BUSINESSTYPE_Delete',
  AM_BUSINESSTYPE_UPDATESTATUS: 'AM_BUSINESSTYPE_UpdateStatus',

  // Procedure AM_BUSINESS
  AM_BUSINESS_GETLIST: 'AM_BUSINESS_GetList',
  AM_BUSINESS_CREATEORUPDATE: 'AM_BUSINESS_CreateOrUpdate',
  AM_BUSINESS_GETBYID: 'AM_BUSINESS_GetById',
  AM_BUSINESS_DELETE: 'AM_BUSINESS_Delete',
  AM_BUSINESS_UPDATESTATUS: 'AM_BUSINESS_UpdateStatus',
  AM_BUSINESS_GETOPTIONS: 'AM_BUSINESS_GetOptions',

  // Procedure CRM_CAMPAIGNSTATUS
  CRM_CAMPAIGNSTATUS_GETLIST: 'CRM_CAMPAIGNSTATUS_GetList',
  CRM_CAMPAIGNSTATUS_CREATEORUPDATE: 'CRM_CAMPAIGNSTATUS_CreateOrUpdate',
  CRM_CAMPAIGNSTATUS_CHECKNAME: 'CRM_CAMPAIGNSTATUS_CheckName',
  CRM_CAMPAIGNSTATUS_GETBYID: 'CRM_CAMPAIGNSTATUS_GetById',
  CRM_CAMPAIGNSTATUS_DELETE: 'CRM_CAMPAIGNSTATUS_Delete',
  CRM_CAMPAIGNSTATUS_UPDATESTATUS: 'CRM_CAMPAIGNSTATUS_UpdateStatus',
  CRM_CAMPAIGNSTATUS_CHECKUSED: 'CRM_CAMPAIGNSTATUS_CheckUsed',

  // Procedure CRM_CAMPAIGNTYPE
  CRM_CAMPAIGNTYPE_CREATEORUPDATE: 'CRM_CAMPAIGNTYPE_CreateOrUpdate',
  CRM_CAMPTYPE_RELEVEL_CREATE: 'CRM_CAMPTYPE_RELEVEL_Create',
  CRM_CAMPTYPE_RELEVEL_DELETE: 'CRM_CAMPTYPE_RELEVEL_Delete',
  CRM_CAMPAIGNTYPE_GETOPTIONS: 'CRM_CAMPAIGNTYPE_GetOptions',
  CRM_CAMPAIGN_RL_USER_GETBYCAMPAIGNTYPE:
    'CRM_CAMPAIGN_RL_USER_GetByCampaignType',
  CRM_CAMPAIGNTYPE_GETLIST: 'CRM_CAMPAIGNTYPE_GetList',
  CRM_CAMPAIGNTYPE_UPDATESTATUS: 'CRM_CAMPAIGNTYPE_UpdateStatus',
  CRM_CAMPAIGNTYPE_GETBYID: 'CRM_CAMPAIGNTYPE_GetById',
  CRM_CAMPAIGNTYPE_DELETE: 'CRM_CAMPAIGNTYPE_Delete',

  // Procedure CRM_CAMPAIGN
  CRM_CAMPAIGN_GETLIST: 'CRM_CAMPAIGN_GetList',
  CRM_CAMPAIGN_CREATEORUPDATE: 'CRM_CAMPAIGN_CreateOrUpdate',
  CRM_CAMPAIGN_GETBYID: 'CRM_CAMPAIGN_GetById',
  CRM_CAMPAIGN_DELETE: 'CRM_CAMPAIGN_Delete',
  CRM_CAMPAIGN_UPDATESTATUS: 'CRM_CAMPAIGN_UpdateStatus',
  CRM_CAMPAIGN_GETOPTIONS: 'CRM_CAMPAIGN_GetOptions',

  // Procedure CRM_CAMPAIGNREVIEWLIST
  CRM_CAMPAIGNREVIEWLIST_DELETE: 'CRM_CAMPAIGNREVIEWLIST_Delete',
  CRM_CAMPAIGNREVIEWLIST_CREATEORUPDATE:
    'CRM_CAMPAIGNREVIEWLIST_CreateOrUpdate',
  CRM_CAMPAIGNREVIEWLIST_ISAPPROVED: 'CRM_CAMPAIGNREVIEWLIST_IsApproved',
  CRM_CAMPAIGNREVIEWLIST_APPROVED: 'CRM_CAMPAIGNREVIEWLIST_Approved',

  // Procedure CRM_SEGMENT
  CRM_SEGMENT_GETLIST: 'CRM_SEGMENT_GetList',
  CRM_SEGMENT_CREATEORUPDATE: 'CRM_SEGMENT_CreateOrUpdate',
  CRM_SEGMENT_GETBYID: 'CRM_SEGMENT_GetById',
  CRM_SEGMENT_DELETE: 'CRM_SEGMENT_Delete',
  CRM_SEGMENT_UPDATESTATUS: 'CRM_SEGMENT_UpdateStatus',
  CRM_SEGMENT_CHECKUSED: 'CRM_SEGMENT_CheckUsed',
  CRM_SEGMENT_CHECKNAME: 'CRM_SEGMENT_CheckName',

  // Procedure CRM_SEGMENT
  CRM_STATUSDATALEADS_GETLIST: 'CRM_STATUSDATALEADS_GetList',
  CRM_STATUSDATALEADS_CREATEORUPDATE: 'CRM_STATUSDATALEADS_CreateOrUpdate',
  CRM_STATUSDATALEADS_GETBYID: 'CRM_STATUSDATALEADS_GetById',
  CRM_STATUSDATALEADS_DELETE: 'CRM_STATUSDATALEADS_Delete',
  CRM_STATUSDATALEADS_UPDATESTATUS: 'CRM_STATUSDATALEADS_UpdateStatus',
  CRM_STATUSDATALEADS_GETOPTIONS: 'CRM_STATUSDATALEADS_GetOptions',
  // Procedure CRM_CAMPAIGNTREVIEWRLVEL
  CRM_CAMPAIGNREVIEWLEVEL_GETLIST: 'CRM_CAMPAIGNREVIEWLEVEL_GetList',

  // Procedure MD_AREA
  MD_AREA_GETLIST: 'MD_AREA_GetList',
  MD_AREA_CREATEORUPDATE: 'MD_AREA_CreateOrUpdate',
  MD_AREA_GETBYID: 'MD_AREA_GetById',
  MD_AREA_DELETE: 'MD_AREA_Delete',
  MD_AREA_UPDATESTATUS: 'MD_AREA_UpdateStatus',
  MD_AREA_CHECKUSED: 'MD_AREA_CheckUsed',

  // Procedure MD_STORE
  MD_STORE_GETLIST: 'MD_STORE_GetList',
  MD_STORE_CREATEORUPDATE: 'MD_STORE_CreateOrUpdate',
  MD_STORE_GETBYID: 'MD_STORE_GetById',
  MD_STORE_DELETE: 'MD_STORE_Delete',
  MD_STORE_UPDATESTATUS: 'MD_STORE_UpdateStatus',
  MD_STORE_CHECKUSED: 'MD_STORE_CheckUsed',

  // Procedure MD_DEPARTMENT
  MD_DEPARTMENT_GETLIST: 'MD_DEPARTMENT_GetList',
  MD_DEPARTMENT_CREATEORUPDATE: 'MD_DEPARTMENT_CreateOrUpdate',
  MD_DEPARTMENT_GETBYID: 'MD_DEPARTMENT_GetById',
  MD_DEPARTMENT_DELETE: 'MD_DEPARTMENT_Delete',
  MD_DEPARTMENT_UPDATESTATUS: 'MD_DEPARTMENT_UpdateStatus',
  MD_DEPARTMENT_UPDATEPRIORITY: 'MD_DEPARTMENT_UpdatePriority',

  // Procedure MD_MANUFACTURER
  MD_MANUFACTURER_GETLIST: 'MD_MANUFACTURER_GetList',
  MD_MANUFACTURER_CREATEORUPDATE: 'MD_MANUFACTURER_CreateOrUpdate',
  MD_MANUFACTURER_GETBYID: 'MD_MANUFACTURER_GetById',
  MD_MANUFACTURER_DELETE: 'MD_MANUFACTURER_Delete',
  MD_MANUFACTURER_UPDATESTATUS: 'MD_MANUFACTURER_UpdateStatus',
  MD_MANUFACTURER_GETOPTIONS: 'MD_MANUFACTURER_GetOptions',
  MD_MANUFACTURER_CHECKNAME: 'MD_MANUFACTURER_CheckName',
  // Procedure CRM_TASK_WORK_FLOW
  CRM_TASKWORKFOLLOW_CREATEORUPDATE: 'CRM_TASKWORKFOLLOW_CreateOrUpdate',
  CRM_TASKWORKFOLLOW_GETBYID: 'CRM_TASKWORKFOLLOW_GetById',
  CRM_TASKWORKFOLLOW_GETOPTIONS: 'CRM_TASKWORKFOLLOW_GetOptions',
  CRM_TASKWORKFOLLOW_GETBYTYPE: 'CRM_TASKWORKFOLLOW_GetByType',

  // Procedure CRM_TASKTYPE
  CRM_TASKTYPE_GETLIST: 'CRM_TASKTYPE_GetList',
  CRM_TASKTYPE_CREATEORUPDATE: 'CRM_TASKTYPE_CreateOrUpdate',
  CRM_TASKTYPE_GETBYID: 'CRM_TASKTYPE_GetById',
  CRM_TASKTYPE_DELETE: 'CRM_TASKTYPE_Delete',
  CRM_TASKTYPE_UPDATESTATUS: 'CRM_TASKTYPE_UpdateStatus',
  CRM_TASKTYPE_CHECKUSED: 'CRM_TASKTYPE_CheckUsed',
  CRM_TASKTYPE_WFOLLOW_CREATE: 'CRM_TASKTYPE_WFOLLOW_Create',
  CRM_TASKTYPE_WFOLLOW_DELETE: 'CRM_TASKTYPE_WFOLLOW_Delete',
  CRM_TASKTYPE_GETOPTIONS: 'CRM_TASKTYPE_GetOptions',

  // Procedure SYS_BUSINESS_USER
  SYS_BUSINESS_USER_GETLIST: 'SYS_BUSINESS_USER_GetList',
  SYS_BUSINESS_USER_CREATEORUPDATE: 'SYS_BUSINESS_USER_CreateOrUpdate',
  SYS_BUSINESS_USER_DELETE: 'SYS_BUSINESS_USER_Delete',
  SYS_BUSINESS_USER_GETBYID: 'SYS_BUSINESS_USER_GetById',
  // Procedure CRM_TASKTYPE
  CRM_TASK_GETLIST: 'CRM_TASK_GetList',
  CRM_TASK_CREATEORUPDATE: 'CRM_TASK_CreateOrUpdate',
  CRM_TASK_GETBYID: 'CRM_TASK_GetById',
  CRM_TASK_DELETE: 'CRM_TASK_Delete',
  CRM_TASK_UPDATESTATUS: 'CRM_TASK_UpdateStatus',
  CRM_TASK_CHECKUSED: 'CRM_TASK_CheckUsed',
  CRM_TASKDATALEADS_CREATE: 'CRM_TASKDATALEADS_Create',
  CRM_TASKDATALEADS_DELETE: 'CRM_TASKDATALEADS_Delete',
  CRM_TASKDATALEADS_GETLIST: 'CRM_TASKDATALEADS_GetList',
  CRM_TASKDATALEADS_GETBYTASKID: 'CRM_TASKDATALEADS_GetByTaskID',
  CRM_TASKDATALEADS_GETNEXTPREVIOUS: 'CRM_TASKDATALEADS_GetNextPrevious',
  CRM_TASKDATALEADS_GETBYID: 'CRM_TASKDATALEADS_GetByID',
  CRM_TASKDATALEADS_UPDATESTATUS: 'CRM_TASKDATALEADS_UpdateStatus',
  CRM_TASKDATALEADS_UPDATEWORKFLOW: 'CRM_TASKDATALEADS_UpdateWorkFlow',

  // Procedure CRM_CUSTOMERDATALEADS
  CRM_CUSTOMERDATALEADS_GetList: 'CRM_CUSTOMERDATALEADS_GetList',
  CRM_CUSTOMERDATALEADS_CREATEORUPDATE: 'CRM_CUSTOMERDATALEADS_CreateOrUpdate',
  CRM_CUSTOMERDATALEADS_GETBYID: 'CRM_CUSTOMERDATALEADS_GetById',
  CRM_CUSTOMERDATALEADS_DELETE: 'CRM_CUSTOMERDATALEADS_Delete',
  CRM_CUSTOMERDATALEADS_UPDATESTATUS: 'CRM_CUSTOMERDATALEADS_UpdateStatus',
  CRM_CUSTOMERDATALEADS_CHECKIDCARD: 'CRM_CUSTOMERDATALEADS_CheckIdcard',
  CRM_CUSTOMERDATALEADS_CHECKPHONE: 'CRM_CUSTOMERDATALEADS_CheckPhone',
  CRM_CUSTOMERDATALEADS_CHECKEXISTS_ADMINWEB:
    'CRM_CUSTOMERDATALEADS_CheckExists_AdminWeb',
  CRM_CUSTOMERDATALEADS_CREATEORUPDATE_ADMINWEB:
    'CRM_CUSTOMERDATALEADS_CreateOrUpdate_AdminWeb',

  // Procedure CRM_DATALEADSCOMMENT
  CRM_DATALEADSCOMMENT_CREATEORUPDATE: 'CRM_DATALEADSCOMMENT_CreateOrUpdate',
  CRM_DATALEADSCOMMENT_GETLIST: 'CRM_DATALEADSCOMMENT_GetList',
  CRM_DATALEADSCOMMENT_GETBYID: 'CRM_DATALEADSCOMMENT_GetById',

  // Procedure CRM_DATALEADSCOMMENT
  CRM_FILEATTACHMENT_CREATEORUPDATE: 'CRM_FILEATTACHMENT_CreateOrUpdate',
  CRM_FILEATTACHMENT_GETLIST: 'CRM_FILEATTACHMENT_GetList',
  CRM_FILEATTACHMENT_DELETE: 'CRM_FILEATTACHMENT_Delete',

  // Procedure CRM_DATALEADSSMS
  CRM_DATALEADSSMS_CREATEORUPDATE: 'CRM_DATALEADSSMS_CreateOrUpdate',
  CRM_DATALEADSSMS_GETLIST: 'CRM_DATALEADSSMS_GetList',
  CRM_DATALEADSSMS_GETBYID: 'CRM_DATALEADSSMS_GetById',

  // Procedure CRM_DATALEADSCALL
  CRM_DATALEADSCALL_CREATEORUPDATE: 'CRM_DATALEADSCALL_CreateOrUpdate',
  CRM_DATALEADSCALL_GETLIST: 'CRM_DATALEADSCALL_GetList',
  CRM_DATALEADSCALL_GETBYID: 'CRM_DATALEADSCALL_GetById',

  // Procedure CRM_HISTORY_DATALEADS
  CRM_HISTORY_DATALEADS_CREATE: 'CRM_HISTORY_DATALEADS_Create',
  CRM_HISTORY_DATALEADS_GETLIST: 'CRM_HISTORY_DATALEADS_GetList',

  // Procedure CRM_DATALEADSMEETING
  CRM_DATALEADSMEETING_CREATEORUPDATE: 'CRM_DATALEADSMEETING_CreateOrUpdate',
  CRM_DATALEADSMEETING_GETLIST: 'CRM_DATALEADSMEETING_GetList',
  CRM_DATALEADSMEETING_GETBYID: 'CRM_DATALEADSMEETING_GetById',

  // Procedure CRM_DATALEADSMAIL
  CRM_DATALEADSMAIL_CREATEORUPDATE: 'CRM_DATALEADSMAIL_CreateOrUpdate',
  CRM_DATALEADSMAIL_GETLIST: 'CRM_DATALEADSMAIL_GetList',
  CRM_DATALEADSMAIL_GETBYID: 'CRM_DATALEADSMAIL_GetById',

  // Procedure CRM_CUSCAMPAIGN
  CRM_CUSCAMPAIGN_DELETEBYDATALEADSID: 'CRM_CUSCAMPAIGN_DeleteByDataLeadsID',
  CRM_CUSCAMPAIGN_CREATE: 'CRM_CUSCAMPAIGN_Create',

  // Procedure CRM_SEG_DATALEADS
  CRM_SEG_DATALEADS_DELETEBYDATALEADSID:
    'CRM_SEG_DATALEADS_DeleteByDataLeadsID',
  CRM_SEG_DATALEADS_CREATE: 'CRM_SEG_DATALEADS_Create',

  // Procedure MD_PRODUCT
  MD_PRODUCT_GETLIST: 'MD_PRODUCT_GetList',
  MD_PRODUCT_CREATEORUPDATE: 'MD_PRODUCT_CreateOrUpdate',
  MD_PRODUCT_GETBYID: 'MD_PRODUCT_GetById',
  MD_PRODUCT_DELETE: 'MD_PRODUCT_Delete',
  MD_PRODUCT_UPDATESTATUS: 'MD_PRODUCT_UpdateStatus',
  MD_PRODUCT_GETOPTIONS: 'MD_PRODUCT_GetOptions',
  MD_PRODUCT_CHECKNAME: 'MD_PRODUCT_CheckName',
  MD_SEOPRODUCT_CREATEORUPDATE: 'MD_SEOPRODUCT_CreateOrUpdate',
  MD_PRODUCT_GetInforContract: 'MD_PRODUCT_GetInforContract',
  MD_PRODUCT_GETLISTPRODUCTRELATED: 'MD_PRODUCT_GetListProductRelated',
  MD_PRODUCT_GETLISTPRODUCTRELATEDMODEL:
    'MD_PRODUCT_GetListProductRelatedModal_AdminWeb',
  MD_PRODUCT_CREATEPRODUCTRELATED: 'MD_PRODUCT_CreateProductRelated',
  MD_PRODUCT_DELETEPRODUCTRELATED: 'MD_PRODUCT_DeleteProductRelated',

  // Procedure MD_PRODUCT_BUSINESS
  MD_PRODUCT_BUSINESS_CREATE: 'MD_PRODUCT_BUSINESS_Create',
  MD_PRODUCT_BUSINESS_DELETEBYPRODUCTID:
    'MD_PRODUCT_BUSINESS_DeleteByProductID',
  MD_PRODUCT_BUSINESS_GETLISTBYPRODUCTID:
    'MD_PRODUCT_BUSINESS_GetListByProductID',

  // Procedure PRO_PRODUCTATTRIBUTEVALUES
  PRO_PRODUCTATTRIBUTEVALUES_CREATE: 'PRO_PRODUCTATTRIBUTEVALUES_Create',
  PRO_PRODUCTATTRIBUTEVALUES_DELETEBYPRODUCTID:
    'PRO_PRODUCTATTRIBUTEVALUES_DeleteByProductID',

  // Procedure PRO_PRODUCTIMAGES
  PRO_PRODUCTIMAGES_CREATE: 'PRO_PRODUCTIMAGES_Create',
  PRO_PRODUCTIMAGES_DELETEBYPRODUCTID: 'PRO_PRODUCTIMAGES_DeleteByProductID',

  // Procedure PRO_PRODUCTSERVICES
  PRO_PRODUCTSERVICES_CREATE: 'PRO_PRODUCTSERVICES_Create',
  PRO_PRODUCTSERVICES_DELETEBYPRODUCTID:
    'PRO_PRODUCTSERVICES_DeleteByProductID',
  PRO_PRODUCTSERVICES_GETTOTALMONTH: 'PRO_PRODUCTSERVICES_GetTotalMonth',

  // Procedure MD_PRODUCTCATEGORY
  MD_PRODUCTCATEGORY_GETLIST: 'MD_PRODUCTCATEGORY_GetList',
  MD_PRODUCTCATEGORY_CREATEORUPDATE: 'MD_PRODUCTCATEGORY_CreateOrUpdate',
  MD_PRODUCTCATEGORY_GETBYID: 'MD_PRODUCTCATEGORY_GetById',
  MD_PRODUCTCATEGORY_DELETE: 'MD_PRODUCTCATEGORY_Delete',
  MD_PRODUCTCATEGORY_UPDATESTATUS: 'MD_PRODUCTCATEGORY_UpdateStatus',
  MD_PRODUCTCATEGORY_GETOPTIONS: 'MD_PRODUCTCATEGORY_GetOptions',
  PRO_CATE_ATTRIBUTE_GETLISTBYCATEGORY: 'PRO_CATE_ATTRIBUTE_GetByCategory',
  MD_PRODUCTCATEGORY_CHECKUSED: 'MD_PRODUCTCATEGORY_CheckUsed',
  PRO_CATE_ATTRIBUTE_CREATE: 'PRO_CATE_ATTRIBUTE_Create',
  PRO_CATE_ATTRIBUTE_DELETE: 'PRO_CATE_ATTRIBUTE_Delete',

  //Procedure PRO_PRODUCTATTRIBUTE
  PRO_PRODUCTATTRIBUTE_GETLIST: 'PRO_PRODUCTATTRIBUTE_GetList',
  PRO_PRODUCTATTRIBUTE_CREATEORUPDATE: 'PRO_PRODUCTATTRIBUTE_CreateOrUpdate',
  PRO_PRODUCTATTRIBUTE_GETBYID: 'PRO_PRODUCTATTRIBUTE_GetById',
  PRO_PRODUCTATTRIBUTE_DELETE: 'PRO_PRODUCTATTRIBUTE_Delete',
  PRO_PRODUCTATTRIBUTE_UPDATESTATUS: 'PRO_PRODUCTATTRIBUTE_UpdateStatus',
  PRO_PRODUCTATTRIBUTE_OPTIONS: 'PRO_PRODUCTATTRIBUTE_Options',

  //Procedure PRO_ATTRIBUTEVALUES
  PRO_ATTRIBUTEVALUES_GETLIST: 'PRO_ATTRIBUTEVALUES_GetList',
  PRO_ATTRIBUTEVALUES_CREATEORUPDATE: 'PRO_ATTRIBUTEVALUES_CreateOrUpdate',
  PRO_ATTRIBUTEVALUES_DELETE: 'PRO_ATTRIBUTEVALUES_DELETE',
  PRO_ATTRIBUTEVALUES_DELETEBYPRODUCTATTRIBUTEID:
    'PRO_ATTRIBUTEVALUES_DeleteByProductAttributeID',

  // Procedure SL_PRICES
  SL_PRICES_GETLIST: 'SL_PRICES_GetList',
  SL_PRICES_CREATEORUPDATE: 'SL_PRICES_CreateOrUpdate',
  SL_PRICES_GETBYID: 'SL_PRICES_GetById',
  SL_PRICES_GETBYPRODUCTID: 'SL_PRICES_GetByProductId',
  SL_PRICES_DELETE: 'SL_PRICES_Delete',
  SL_PRICES_UPDATESTATUS: 'SL_PRICES_UpdateStatus',
  SL_PRICES_APPROVE: 'SL_PRICES_Approve',
  SL_PRICE_APPLY_AREA_GETLISTBYPRICEID: 'SL_PRICE_APPLY_AREA_GetListByPriceId',
  SL_PRICE_APPLY_BUSINESS_GETLISTBYPRICEID:
    'SL_PRICE_APPLY_BUSINESS_GetListByPriceId',
  SL_PRICE_APPLY_BUSINESS_OUTPUTTYPE_BUSINESS_DELETE:
    'SL_PRICE_APPLY_OUTPUTTYPE_BUSINESS_Delete',
  SL_PRICE_APPLY_OUTPUTTYPE_GETLISTBYPRICEID:
    'SL_PRICE_APPLY_OUTPUTTYPE_GetListByPriceId',
  SL_PRICE_APPLY_OUTPUTTYPE_REVIEWLEVEL_GETLISTBYPRICEID:
    'SL_PRICE_APPLY_OUTPUTTYPE_REVIEWLEVEL_GetListByPriceId',
  SL_PRICE_APPLY_REVIEWLEVEL_CREATEORUPDATE:
    'SL_PRICE_APPLY_REVIEWLEVEL_CreateOrUpdate',
  SL_PRICE_APPLY_REVIEWLEVEL_DELETE: 'SL_PRICE_APPLY_REVIEWLEVEL_Delete',
  SL_PRICES_APPLY_OUTPUTTYPE_CREATEORUPDATE:
    'SL_PRICES_APPLY_OUTPUTTYPE_CreateOrUpdate',
  SL_OUTPUT_AREA_GetListByOutputTypeID: 'SL_OUTPUT_AREA_GetListByOutputTypeID',
  AM_BUSSINESS_GetListByAreaID: 'AM_BUSSINESS_GetListByAreaID',
  SL_PRICE_GetListAreaByPriceID: 'SL_PRICE_GetListAreaByPriceID',
  SL_PRICE_GetListBusinessByPriceID: 'SL_PRICE_GetListBusinessByPriceID',
  SL_PRICES_CheckTrung: 'SL_PRICES_CheckTrung',

  // Procedure SM_PROMOTION
  SM_PROMOTION_GETLIST: 'SM_PROMOTION_GetList',
  SM_PROMOTION_CREATEORUPDATE: 'SM_PROMOTION_CreateOrUpdate',
  SM_PROMOTION_GETBYID: 'SM_PROMOTION_GetById',
  SM_PROMOTION_DELETE: 'SM_PROMOTION_Delete',
  SM_PROMOTION_UPDATESTATUS: 'SM_PROMOTION_UpdateStatus',
  SM_PROMOTION_APPROVE: 'SM_PROMOTION_Approve',
  SM_PROMOTION_CHECKUSED: 'SM_PROMOTION_CheckUsed',
  SM_PROMOTION_CUSTOMERTYPE_CREATE: 'SM_PROMOTION_CUSTOMERTYPE_Create',
  SM_PROMOTION_CUSTOMERTYPE_DELETEBYPROMOTIONID:
    'SM_PROMOTION_CUSTOMERTYPE_DeleteByPromotionId',
  SM_PROMOTION_CUSTOMERTYPE_GETBYPROMOTIONID:
    'SM_PROMOTION_CUSTOMERTYPE_GetByPromtionId',
  SM_PROMOTIONAPPLY_PRODUCT_CREATE: 'SM_PROMOTIONAPPLY_PRODUCT_Create',
  SM_PROMOTIONAPPLY_PRODUCT_DELETEBYPROMOTIONID:
    'SM_PROMOTIONAPPLY_PRODUCT_DeleteByPromotionId',
  SM_PROMOTIONAPPLY_PRODUCT_GETBYPROMOTIONID:
    'SM_PROMOTIONAPPLY_PRODUCT_GetByPromtionId',
  SM_PROMOTIONOFFER_APPLY_CREATE: 'SM_PROMOTIONOFFER_APPLY_Create',
  SM_PROMOTIONOFFER_APPLY_DELETEBYPROMOTIONID:
    'SM_PROMOTIONOFFER_APPLY_DeleteByPromotionId',
  SM_PROMOTIONOFFER_APPLY_GETBYPROMOTIONID:
    'SM_PROMOTIONOFFER_APPLY_GetByPromtionId',
  SM_PROMOTIONOFFER_GETLIST: 'SM_PROMOTIONOFFER_GetList',
  SM_PROMOTIONOFFER_GIFT_GETLIST: 'SM_PROMOTIONOFFER_GIFT_GetList',
  SM_PROMOTION_COMPANY_CREATE: 'SM_PROMOTION_COMPANY_Create',
  SM_PROMOTION_COMPANY_DELETEBYPROMOTIONID:
    'SM_PROMOTION_COMPANY_DeleteByPromotionId',
  SM_PROMOTION_COMPANY_GETBYPROMOTIONID: 'SM_PROMOTION_COMPANY_GetByPromtionId',

  // Procedure SM_PROMOTIONOFFER
  SM_PROMOTIONOFFER_CREATEORUPDATE: 'SM_PROMOTIONOFFER_CreateOrUpdate',
  SM_PROMOTIONOFFER_GETBYID: 'SM_PROMOTIONOFFER_GetById',
  SM_PROMOTIONOFFER_DELETE: 'SM_PROMOTIONOFFER_Delete',
  SM_PROMOTIONOFFER_UPDATESTATUS: 'SM_PROMOTIONOFFER_UpdateStatus',
  SM_PROMOTIONOFFER_GIFT_CREATE: 'SM_PROMOTIONOFFER_GIFT_Create',
  SM_PROMOTIONOFFER_GIFT_DELETEPROMOTIONOFFERID:
    'SM_PROMOTIONOFFER_GIFT_DeleteByPromotionOfferId',
  SM_PROMOTIONOFFER_CHECKUSED: 'SM_PROMOTIONOFFER_CheckUsed',

  // Procedure CRM_CUSTOMERTYPE
  CRM_CUSTOMERTYPE_GETLIST: 'CRM_CUSTOMERTYPE_GetList',
  CRM_CUSTOMERTYPE_CREATEORUPDATE: 'CRM_CUSTOMERTYPE_CreateOrUpdate',
  CRM_CUSTOMERTYPE_GETBYID: 'CRM_CUSTOMERTYPE_GetById',
  CRM_CUSTOMERTYPE_DELETE: 'CRM_CUSTOMERTYPE_Delete',
  CRM_CUSTOMERTYPE_UPDATESTATUS: 'CRM_CUSTOMERTYPE_UpdateStatus',
  CRM_CUSTOMERTYPE_CHECKUSED: 'CRM_CUSTOMERTYPE_CheckUsed',

  //SL_OUTPUTTYPE
  SL_OUTPUTTYPE_GETOPTIONS: 'SL_OUTPUTTYPE_GetOptions',
  SL_OUTPUTTYPE_GETLIST: 'SL_OUTPUTTYPE_GetList',
  SL_OUTPUTTYPE_CREATEORUPDATE: 'SL_OUTPUTTYPE_CreateOrUpdate',
  SL_OUTPUTTYPE_GETBYID: 'SL_OUTPUTTYPE_GetById',
  SL_OUTPUTTYPE_DELETE: 'SL_OUTPUTTYPE_Delete',
  SL_OUTPUTTYPE_UPDATESTATUS: 'SL_OUTPUTTYPE_UpdateStatus',

  // Procedure SL_PRICEREVIEWLEVEL
  SL_PRICEREVIEWLEVEL_GETOPTIONS: 'SL_PRICEREVIEWLEVEL_GetOptions',

  // Procedure SL_OUTPUT_AREA
  SL_OUTPUT_AREA_CREATE: 'SL_OUTPUT_AREA_Create',
  SL_OUTPUT_AREA_DELETEBYOUTPUTTYPEID: 'SL_OUTPUT_AREA_DeleteByOutputTypeId',
  SL_OUTPUT_AREA_GETBYOUTPUTTYPE: 'SL_OUTPUT_AREA_GetByOutputType',

  // Procedure SL_PRICE_REVIEW_LV_USER
  SL_PRICE_REVIEW_LV_USER_CREATE: 'SL_PRICE_REVIEW_LV_USER_Create',
  SL_PRICE_REVIEW_LV_USER_DELETEBYOUTPUTTYPEID:
    'SL_PRICE_REVIEW_LV_USER_DeleteByOutputTypeId',
  SL_PRICE_REVIEW_LV_USER_GETLIST: 'SL_PRICE_REVIEW_LV_USER_GetList',
  SL_PRICE_REVIEW_LV_USER_GETBYOUTPUTTYPE:
    'SL_PRICE_REVIEW_LV_USER_GetByOutputType',

  //CMS_STATICCONTENT
  CMS_STATICCONTENT_GETLIST_ADMINWEB: 'CMS_STATICCONTENT_GetList_AdminWeb',
  CMS_STATICCONTENT_CREATEORUPDATE_ADMINWEB:
    'CMS_STATICCONTENT_CreateOrUpdate_AdminWeb',
  CMS_STATICCONTENT_GETBYID_ADMINWEB: 'CMS_STATICCONTENT_GetById_AdminWeb',
  CMS_STATICCONTENT_DELETE_ADMINWEB: 'CMS_STATICCONTENT_Delete_AdminWeb',
  CMS_STATICCONTENT_UPDATESTATUS_ADMINWEB:
    'CMS_STATICCONTENT_UpdateStatus_AdminWeb',
  CMS_STATICCONTENT_CHECKUSED: 'CMS_STATICCONTENT_CheckUsed_AdminWeb',
  CMS_STATICCONTENT_CHECKSEONAME: 'CMS_STATICCONTENT_CheckSeoName_AdminWeb',
  CMS_STATICCONTENT_CHECKTITLE: 'CMS_STATICCONTENT_CheckTitle_AdminWeb',
  CMS_STATICCONTENT_CHECKSYSTEMNAME_ADMINWEB:
    'CMS_STATICCONTENT_CheckSystemName_AdminWeb',
  CMS_STATICCONTENT_GETLISTMETATITLE_ADMINWEB:
    'CMS_STATICCONTENT_GetListMetaTitle_AdminWeb',
  CMS_STATICCONTENT_GETLISTMETAKEYWORD_ADMINWEB:
    'CMS_STATICCONTENT_GetListMetaKeyword_AdminWeb',
  CMS_STATICCONTENT_CHECKMETATITLE_ADMINWEB:
    'CMS_STATICCONTENT_CheckMetaTitle_AdminWeb',
  CMS_STATICCONTENT_CHECKMETAKEYWORD_ADMINWEB:
    'CMS_STATICCONTENT_CheckMetaKeyword_AdminWeb',

  //NEWS_NEWSCATEGORY
  NEWS_NEWSCATEGORY_GETLIST_ADMINWEB: 'NEWS_NEWSCATEGORY_GetList_AdminWeb',
  NEWS_NEWSCATEGORY_GETBYID_ADMINWEB: 'NEWS_NEWSCATEGORY_GetById_AdminWeb',
  NEWS_NEWSCATEGORY_DELETE_ADMINWEB: 'NEWS_NEWSCATEGORY_Delete_AdminWeb',
  NEWS_NEWSCATEGORY_CREATEORUPDATE_ADMINWEB:
    'NEWS_NEWSCATEGORY_CreateOrUpdate_AdminWeb',
  NEWS_NEWSCATEGORY_CHECKNAME_ADMINWEB: 'NEWS_NEWSCATEGORY_CheckName_AdminWeb',
  NEWS_NEWSCATEGORY_UPDATESTATUS_ADMINWEB:
    'NEWS_NEWSCATEGORY_UpdateStatus_AdminWeb',
  NEWS_NEWSCATEGORY_GETLISTALL_ADMINWEB:
    'NEWS_NEWSCATEGORY_GetListAll_AdminWeb',
  NEWS_NEWSCATEGORY_CHECKORDERINDEX_ADMINWEB:
    'NEWS_NEWSCATEGORY_CheckOrderIndex_AdminWeb',
  NEWS_NEWSCATEGORY_CHECKPARENT_ADMINWEB:
    'NEWS_NEWSCATEGORY_CheckParent_AdminWeb',
  NEWS_NEWSCATEGORY_GETOPTIONS_ADMINWEB:
    'NEWS_NEWSCATEGORY_GetOptions_AdminWeb',

  //TOPIC
  CMS_TOPIC_CHECKTITLE_ADMINWEB: 'CMS_TOPIC_CheckTitle_AdminWeb',
  CMS_TOPIC_CREATEORUPDATE_ADMINWEB: 'CMS_TOPIC_CreateOrUpdate_AdminWeb',
  CMS_TOPIC_DELETE_ADMINWEB: 'CMS_TOPIC_Delete_AdminWeb',
  CMS_TOPIC_GETBYID_ADMINWEB: 'CMS_TOPIC_GetById_AdminWeb',
  CMS_TOPIC_GETLIST_ADMINWEB: 'CMS_TOPIC_GetList_AdminWeb',
  CMS_TOPIC_UPDATESTATUS_ADMINWEB: 'CMS_TOPIC_UpdateStatus_AdminWeb',

  //SUPPORT
  CMS_SUPPORT_DELETE_ADMINWEB: 'CMS_SUPPORT_Delete_AdminWeb',
  CMS_SUPPORT_GETBYID_ADMINWEB: 'CMS_SUPPORT_GetById_AdminWeb',
  CMS_SUPPORT_GETLIST_ADMINWEB: 'CMS_SUPPORT_GetList_AdminWeb',
  CMS_SUPPORT_GETLISTALL_ADMINWEB: 'CMS_SUPPORT_GetListAll_AdminWeb',
  CMS_SUPPORT_UPDATESTATUS_ADMINWEB: 'CMS_SUPPORT_UpdateStatus_AdminWeb',

  //CRM_ACCOUNT
  CRM_ACCOUNT_CHECKPHONENAME_ADMINWEB: 'CRM_ACCOUNT_CheckPhoneName_AdminWeb',
  CRM_ACCOUNT_CHECKUSERNAME_ADMINWEB: 'CRM_ACCOUNT_CheckUserName_AdminWeb',
  CRM_ACCOUNT_CREATEORUPDATE_ADMINWEB: 'CRM_ACCOUNT_CreateOrUpdate_AdminWeb',
  CRM_ACCOUNT_DELETE_ADMINWEB: 'CRM_ACCOUNT_Delete_AdminWeb',
  CRM_ACCOUNT_GETBYID_ADMINWEB: 'CRM_ACCOUNT_GetById_AdminWeb',
  CRM_ACCOUNT_GETLIST_ADMINWEB: 'CRM_ACCOUNT_GetList_AdminWeb',
  CRM_ACCOUNT_UPDATESTATUS_ADMINWEB: 'CRM_ACCOUNT_UpdateStatus_AdminWeb',
  CRM_ACCOUNT_GETBYID: 'CRM_ACCOUNT_GetById',
  CRM_ACCOUNT_CHANGEPASS_ADMINWEB: 'CRM_ACCOUNT_ChangePass_AdminWeb',
  CRM_ACCOUNT_GETBYDATALEADSID: 'CRM_ACCOUNT_GetByDataleadsId',

  //RECRUIT
  HR_RECRUIT_CREATEORUPDATE_ADMINWEB: 'HR_RECRUIT_CreateOrUpdate_AdminWeb',
  HR_RECRUIT_DELETE_ADMINWEB: 'HR_RECRUIT_Delete_AdminWeb',
  HR_RECRUIT_GETBYID_ADMINWEB: 'HR_RECRUIT_GetById_AdminWeb',
  HR_RECRUIT_GETLIST_ADMINWEB: 'HR_RECRUIT_GetList_AdminWeb',
  HR_RECRUIT_UPDATESTATUS_ADMINWEB: 'HR_RECRUIT_UpdateStatus_AdminWeb',

  //BANNERTYPE
  CMS_BANNERTYPE_CREATEORUPDATE_ADMINWEB:
    'CMS_BANNERTYPE_CreateOrUpdate_AdminWeb',
  CMS_BANNERTYPE_DELETE_ADMINWEB: 'CMS_BANNERTYPE_Delete_AdminWeb',
  CMS_BANNERTYPE_GETBYID_ADMINWEB: 'CMS_BANNERTYPE_GetById_AdminWeb',
  CMS_BANNERTYPE_GETLIST_ADMINWEB: 'CMS_BANNERTYPE_GetList_AdminWeb',
  CMS_BANNERTYPE_UPDATESTATUS_ADMINWEB: 'CMS_BANNERTYPE_UpdateStatus_AdminWeb',
  NEWS_NEWSSTATUS_CHECKORDERINDEX_ADMINWEB:
    'NEWS_NEWSSTATUS_CheckOrderIndex_AdminWeb',
  CMS_BANNERTYPE_CHECKPARENT_ADMINWEB: 'CMS_BANNERTYPE_CheckParent_AdminWeb',

  //BANNER
  CMS_BANNER_CREATEORUPDATE_ADMINWEB: 'CMS_BANNER_CreateOrUpdate_AdminWeb',
  CMS_BANNER_DELETE_ADMINWEB: 'CMS_BANNER_Delete_AdminWeb',
  CMS_BANNER_GETBYID_ADMINWEB: 'CMS_BANNER_GetById_AdminWeb',
  CMS_BANNER_GETLIST_ADMINWEB: 'CMS_BANNER_GetList_AdminWeb',
  CMS_BANNER_UPDATESTATUS_ADMINWEB: 'CMS_BANNER_UpdateStatus_AdminWeb',
  E_LOCATION_GETALL_ADMINWEB: 'E_LOCATION_GetAll_AdminWeb',

  //NEWS_NEWSSTATUS
  NEWS_NEWSSTATUS_GETLIST_ADMINWEB: 'NEWS_NEWSSTATUS_GetList_AdminWeb',
  NEWS_NEWSSTATUS_GETBYID_ADMINWEB: 'NEWS_NEWSSTATUS_GetById_AdminWeb',
  NEWS_NEWSSTATUS_DELETE_ADMINWEB: 'NEWS_NEWSSTATUS_Delete_AdminWeb',
  NEWS_NEWSSTATUS_CREATEORUPDATE_ADMINWEB:
    'NEWS_NEWSSTATUS_CreateOrUpdate_AdminWeb',
  NEWS_NEWSSTATUS_CHECKNAME_ADMINWEB: 'NEWS_NEWSSTATUS_CheckName_AdminWeb',
  NEWS_NEWSSTATUS_UPDATESTATUS_ADMINWEB:
    'NEWS_NEWSSTATUS_UpdateStatus_AdminWeb',
  NEWS_NEWSSTATUS_GETLISTALL_ADMINWEB: 'NEWS_NEWSSTATUS_GetListAll_AdminWeb',

  //NEWS_NEWS
  NEWS_NEWS_GETLIST_ADMINWEB: 'NEWS_NEWS_GetList_AdminWeb',
  NEWS_NEWS_GETBYID_ADMINWEB: 'NEWS_NEWS_GetById_AdminWeb',
  NEWS_NEWS_GETLASTITEM_ADMINWEB: 'NEWS_NEWS_GetLastItem_AdminWeb',
  NEWS_NEWS_CREATEORUPDATE_ADMINWEB: 'NEWS_NEWS_CreateOrUpdate_AdminWeb',
  NEWS_NEWS_DELETE_ADMINWEB: 'NEWS_NEWS_Delete_AdminWeb',
  NEWS_NEWS_CHECKNAME_ADMINWEB: 'NEWS_NEWS_CheckName_AdminWeb',
  NEWS_NEWS_UPDATESTATUS_ADMINWEB: 'NEWS_NEWS_UpdateStatus_AdminWeb',
  NEWS_NEWS_GETLISTTAG_ADMINWEB: 'NEWS_NEWS_GetListTag_AdminWeb',
  NEWS_NEWS_GETLISTMETAKEYWORD_ADMINWEB:
    'NEWS_NEWS_GetListMetaKeyword_AdminWeb',
  NEWS_NEWS_CHECKTAG_ADMINWEB: 'NEWS_NEWS_CheckTag_AdminWeb',
  NEWS_NEWS_CHECKMETAKEYWORD_ADMINWEB: 'NEWS_NEWS_CheckMetaKeyword_AdminWeb',

  //NEWS_NEWSRELATED
  NEWS_NEWSRELATED_DELETE_ADMINWEB: 'NEWS_NEWSRELATED_Delete_AdminWeb',
  NEWS_NEWSRELATED_DELETEBYNEWSID_ADMINWEB:
    'NEWS_NEWSRELATED_DeleteNewsId_AdminWeb',
  NEWS_NEWSRELATED_CREATE_ADMINWEB: 'NEWS_NEWSRELATED_Create_AdminWeb',

  //CMS_WEBSITECATEGORY
  CMS_WEBSITECATEGORY_CHECKNAME_ADMINWEB:
    'CMS_WEBSITECATEGORY_CheckName_AdminWeb',
  CMS_WEBSITECATEGORY_CREATEORUPDATE_ADMINWEB:
    'CMS_WEBSITECATEGORY_CreateOrUpdate_AdminWeb',
  CMS_WEBSITECATEGORY_DELETE_ADMINWEB: 'CMS_WEBSITECATEGORY_Delete_AdminWeb',
  CMS_WEBSITECATEGORY_GETBYID_ADMINWEB: 'CMS_WEBSITECATEGORY_GetById_AdminWeb',
  CMS_WEBSITECATEGORY_GETLIST_ADMINWEB: 'CMS_WEBSITECATEGORY_GetList_AdminWeb',
  CMS_WEBSITECATEGORY_UPDATESTATUS_ADMINWEB:
    'CMS_WEBSITECATEGORY_UpdateStatus_AdminWeb',
  CMS_WEBSITECATEGORY_GETLISTALL_ADMINWEB:
    'CMS_WEBSITECATEGORY_GetListAll_AdminWeb',
  CMS_WEBSITECATEGORY_PARENT_GETLISTALL_ADMINWEB:
    'CMS_WEBSITECATEGORY_PARENT_GetListAll_AdminWeb',
  CMS_WEBSITE_GETLISTALL_ADMINWEB: 'CMS_WEBSITE_GetListAll_AdminWeb',
  CMS_WEBSITE_GETBYID_ADMINWEB: 'CMS_WEBSITE_GetById_AdminWeb',
  CMS_WEBSITECATEGORY_CHECKPARENT_ADMINWEB:
    'CMS_WEBSITECATEGORY_CheckParent_AdminWeb',
  CMS_PRONEWSWEBCATEGORY_CREATEORUPDATE_ADMINWEB:
    'CMS_PRONEWSWEBCATEGORY_CreateOrUpdate_AdminWeb',

  //HR_CANDIDATE
  HR_CANDIDATE_CREATEORUPDATE_ADMINWEB: 'HR_CANDIDATE_CreateOrUpdate_AdminWeb',
  HR_CANDIDATE_ATTACHMENT_GETLIST_ADMINWEB:
    'HR_CANDIDATE_ATTACHMENT_GetList_AdminWeb',
  HR_CANDIDATE_DELETE_ADMINWEB: 'HR_CANDIDATE_Delete_AdminWeb',
  HR_CANDIDATE_GETBYID_ADMINWEB: 'HR_CANDIDATE_GetById_AdminWeb',
  HR_CANDIDATE_GETLIST_ADMINWEB: 'HR_CANDIDATE_GetList_AdminWeb',
  HR_CANDIDATE_UPDATESTATUS_ADMINWEB: 'HR_CANDIDATE_UpdateStatus_AdminWeb',

  //SL_BOOKING
  SL_BOOKING_CREATEORUPDATE_ADMINWEB: 'SL_BOOKING_CreateOrUpdate_AdminWeb',
  SL_BOOKINGDETAIL_GETLISTBYBOOKINGID_ADMINWEB:
    'SL_BOOKINGDETAIL_GetListByBookingId_AdminWeb',
  SL_BOOKING_DELETE_ADMINWEB: 'SL_BOOKING_Delete_AdminWeb',
  SL_BOOKING_GETBYID_ADMINWEB: 'SL_BOOKING_GetById_AdminWeb',
  SL_BOOKING_GETLIST_ADMINWEB: 'SL_BOOKING_GetList_AdminWeb',
  MD_PRODUCT_GETLIST_ADMINWEB: 'MD_PRODUCT_GetList_AdminWeb',
  SL_BOOKINGDETAIL_INSERTLIST_ADMINWEB: 'SL_BOOKINGDETAIL_InsertList_AdminWeb',
  SL_BOOKINGDETAIL_INSERTORUPDATE_ADMINWEB:
    'SL_BOOKINGDETAIL_InsertOrUpdate_AdminWeb',
  SL_CART_CREATE_ADMINWEB: 'SL_CART_Create_AdminWeb',
  SL_BOOKING_GETLISTALL_ADMINWEB: 'SL_BOOKING_GetListAll_AdminWeb',
  SL_BOOKINGDETAIL_DELETE_ADMINWEB: 'SL_BOOKINGDETAIL_Delete_AdminWeb',
  SL_BOOKING_CHANGESTATUS_ADMINWEB: 'SL_BOOKING_ChangeStatus_AdminWeb',
  SL_ORDER_CREATEORUPDATE_ADMINWEB: 'SL_ORDER_CreateOrUpdate_AdminWeb',
  SL_ORDERDETAIL_CREATEORUPDATE_ADMINWEB:
    'SL_ORDERDETAIL_CreateOrUpdate_AdminWeb',
  SM_ORDERPROMOTION_CREATEORUPDATE_ADMINWEB:
    'SM_ORDERPROMOTION_CreateOrUpdate_AdminWeb',

  //CRM_MEMBERSHIP
  CRM_MEMBERSHIPS_GETLIST: 'CRM_MEMBERSHIPS_GetList',
  CRM_MEMBERSHIPS_GETBYID: 'CRM_MEMBERSHIPS_GetById',
  CRM_MEMBERSHIPS_UPDATESTATUS: 'CRM_MEMBERSHIPS_UpdateStatus',
  CRM_MEMBERSHIPS_DELETE: 'CRM_MEMBERSHIPS_Delete',

  //CT_CONTRACT
  CT_CONTRACT_GETLISTBYMEMBERID: 'CT_CONTRACT_GetListByMemberId',
  CT_CONTRACT_GETLIST: 'CT_CONTRACT_GetList',
  CT_CONTRACT_CREATEORUPDATE: 'CT_CONTRACT_CreateOrUpdate',
  CT_CONTRACT_GETBYID: 'CT_CONTRACT_GetByID',
  CT_CONTRACT_DELETE: 'CT_CONTRACT_Delete',
  CT_CONTRACT_APPROVED: 'CT_CONTRACT_Approved',
  CT_CONTRACT_FREEZE: 'CT_CONTRACT_Freeze',
  CT_CONTRACT_TRANSFER: 'CT_CONTRACT_Transfer',

  //CRM_HISTORY_MEMBERSHIPS
  CRM_HISTORY_MEMBERSHIPS_GETLISTBYMEMBERID:
    'CRM_HISTORY_MEMBERSHIPS_GetListByMemberId',

  // HR_CUSTOMER_TIMEKEEPING
  HR_CUSTOMER_TIMEKEEPING_GETLIST: 'HR_CUSTOMER_TIMEKEEPING_GetList',

  //CMS_SETUPSERVICE_REGISTER
  CMS_SETUPSERVICE_GETLISTALL_ADMINWEB: 'CMS_SETUPSERVICE_GetListAll_AdminWeb',
  CMS_SETUPSERVICE_REGISTER_GETLIST_ADMINWEB:
    'CMS_SETUPSERVICE_REGISTER_GetList_AdminWeb',
  CMS_SETUPSERVICE_REGISTER_GETBYID_ADMINWE:
    'CMS_SETUPSERVICE_REGISTER_GetById_AdminWeb',
  CMS_SETUPSERVICE_REGISTER_DELETE_ADMINWEB:
    'CMS_SETUPSERVICE_REGISTER_Delete_AdminWeb',

  //PRO_COMMENT
  PRO_COMMENT_CREATEORUPDATE_ADMINWEB: 'PRO_COMMENT_CreateOrUpdate_AdminWeb',
  PRO_COMMENT_GETBYID_ADMINWEB: 'PRO_COMMENT_GetById_AdminWeb',
  PRO_COMMENT_GETLIST_ADMINWEB: 'PRO_COMMENT_GetList_AdminWeb',
  PRO_COMMENTREPLY_CREATEORUPDATE_ADMINWEB:
    'PRO_COMMENTREPLY_CreateOrUpdate_AdminWeb',
  PRO_COMMENTREPLY_GETBYID_ADMINWEB: 'PRO_COMMENTREPLY_GetById_AdminWeb',
  PRO_COMMENT_DELETE_ADMINWEB: 'PRO_COMMENT_Delete_AdminWeb',
  PRO_COMMENT_GETLISTPRODUCT_ADMINWEB: 'PRO_COMMENT_GetListProduct_AdminWeb',

  // Procedure MD_AREA
  MD_CONTRACTTYPE_GETLIST: 'MD_CONTRACTTYPE_GetList',
  MD_CONTRACTTYPE_CREATEORUPDATE: 'MD_CONTRACTTYPE_CreateOrUpdate',
  MD_CONTRACTTYPE_GETBYID: 'MD_CONTRACTTYPE_GetById',
  MD_CONTRACTTYPE_DELETE: 'MD_CONTRACTTYPE_Delete',
  MD_CONTRACTTYPE_UPDATESTATUS: 'MD_CONTRACTTYPE_UpdateStatus',

  // Procedure SL_ORDER
  SL_ORDER_CREATEORUPDATE: 'SL_ORDER_CreateOrUpdate',
  SL_ORDER_GETBYCONTRACTID: 'SL_ORDER_GetByContractId',
  SL_ORDERDETAIL_GETLISTBYORDERID: 'SL_ORDERDETAIL_GetListByOrderId',
  SL_ORDERDETAIL_CREATE: 'SL_ORDERDETAIL_Create',
  SL_ORDERDETAIL_DELETE: 'SL_ORDERDETAIL_Delete',
  SM_ORDERPROMOTION_GETLISTBYORDERID: 'SM_ORDERPROMOTION_GetListByOrderId',
  SM_ORDERPROMOTION_CREATE: 'SM_ORDERPROMOTION_Create',
  SM_ORDERPROMOTION_DELETE: 'SM_ORDERPROMOTION_Delete',

  // HR_USER_TIMEKEEPING
  HR_USER_TIMEKEEPING_GETLIST: 'HR_USER_TIMEKEEPING_GetList',
  HR_USER_TIMEKEEPING_APPROVED: 'HR_USER_TIMEKEEPING_Approved',

  //CRM_DOCFILEATTACHMENT
  CRM_DOCFILEATTACHMENT_GETLIST: 'CRM_DOCFILEATTACHMENT_GetList',
  CRM_DOCFILEATTACHMENT_CREATE: 'CRM_DOCFILEATTACHMENT_Create',
  CRM_DOCFILEATTACHMENTL_DELETE: 'CRM_DOCFILEATTACHMENT_Delete',

  //CMS_SETUPSERVICE
  CMS_SETUPSERVICE_DELETE_ADMINWEB: 'CMS_SETUPSERVICE_Delete_AdminWeb',
  CMS_SETUPSERVICE_GETBYID_ADMINWEB: 'CMS_SETUPSERVICE_GetById_AdminWeb',
  CMS_SETUPSERVICE_GETLIST_ADMINWEB: 'CMS_SETUPSERVICE_GetList_AdminWeb',
  CMS_SETUPSERVICE_CREATEORUPDATE_ADMINWEB:
    'CMS_SETUPSERVICE_CreateOrUpdate_AdminWeb',
  CMS_SETUPSERVICE_CHECKNAME_ADMINWEB: 'CMS_SETUPSERVICE_CheckName_AdminWeb',
  CMS_SETUPSERVICE_UPDATESTATUS_ADMINWEB:
    'CMS_SETUPSERVICE_UpdateStatus_AdminWeb',
  CMS_SETUPSERVICE_GETLISTMETATITLE_ADMINWEB:
    'CMS_SETUPSERVICE_GetListMetaTitle_AdminWeb',
  CMS_SETUPSERVICE_GETLISTMETAKEYWORD_ADMINWEB:
    'CMS_SETUPSERVICE_GetListMetaKeyword_AdminWeb',
  CMS_SETUPSERVICE_CHECKMETATITLE_ADMINWEB:
    'CMS_SETUPSERVICE_CheckMetaTitle_AdminWeb',
  CMS_SETUPSERVICE_CHECKMETAKEYWORD_ADMINWEB:
    'CMS_SETUPSERVICE_CheckMetaKeyword_AdminWeb',

  //CRM_AUTHOR
  CRM_AUTHOR_CHECKPHONENAME_ADMINWEB: 'CRM_AUTHOR_CheckPhoneName_AdminWeb',
  CRM_AUTHOR_CHECKUSERNAME_ADMINWEB: 'CRM_AUTHOR_CheckUserName_AdminWeb',
  CRM_AUTHOR_CREATEORUPDATE_ADMINWEB: 'CRM_AUTHOR_CreateOrUpdate',
  CRM_AUTHOR_DELETE_ADMINWEB: 'CRM_AUTHOR_Delete',
  CRM_AUTHOR_GETBYID_ADMINWEB: 'CRM_AUTHOR_GetById',
  CRM_AUTHOR_GETLIST_ADMINWEB: 'CRM_AUTHOR_GetList_AdminWeb',
  CRM_AUTHOR_UPDATESTATUS_ADMINWEB: 'CRM_AUTHOR_UpdateStatus_AdminWeb',
  CRM_AUTHOR_GETBYID: 'CRM_AUTHOR_GetById',
  CRM_AUTHOR_CHANGEPASS_ADMINWEB: 'CRM_AUTHOR_ChangePass_AdminWeb',
  CRM_AUTHOR_GETBYDATALEADSID: 'CRM_AUTHOR_GetByDataleadsId',
  CRM_AUTHOR_MAX: 'CRM_AUTHOR_MAX',
  CRM_AUTHOR_FINDBYAUTHORNAME_ADMINWEB: 'CRM_AUTHOR_FindByAuthorName_AdminWeb',
  CRM_AUTHOR_FINDBYEMAIL_ADMINWEB: 'CRM_AUTHOR_FindByEmail_AdminWeb',
  CRM_AUTHOR_FINDBYPHONENUMBER_ADMINWEB:
    'CRM_AUTHOR_FindByPhoneNumber_AdminWeb',

  //CRM_AUTHOR_CATEGORY
  CRM_AUTHOR_CATEGORY_DELETEBYAUTHORID_ADMINWEB: 'CRM_AUTHOR_CATEGORY_Delete',
  CRM_AUTHOR_CATEGORY_CREATE_ADMINWEB: 'CRM_AUTHOR_CATEGORY_Create',

  //CRM_ACCOTP
  CRM_ACCOTP_CREATE_ADMINWEB: 'CRM_ACCOTP_Create_AdminWeb',

  //MD_PLAN_CATEGORY
  MD_PLAN_CATEGORY_GETLIST_ADMINWEB: 'MD_PLAN_CATEGORY_GetList_AdminWeb',
  MD_PLAN_CATEGORY_DELETE_ADMINWEB: 'MD_PLAN_CATEGORY_Delete',
  MD_PLAN_CATEGORY_GETOPTIONS_ADMINWEB: 'MD_PLAN_CATEGORY_GetOptions_AdminWeb',
  MD_PLAN_CATEGORY_CREATEORUPDATE: 'MD_PLAN_CATEGORY_CreateOrUpdate',
  MD_PLAN_CATEGORY_GETBYID: 'MD_PLAN_CATEGORY_GetById',

  //MD_PLAN
  MD_PLAN_GETLIST: 'MD_PLAN_GetList',
  MD_PLAN_DELETE: 'MD_PLAN_Delete',
  MD_PLAN_CREATEORUPDATE: 'MD_PLAN_CreateOrUpdate',
  MD_PLAN_GETBYID: 'MD_PLAN_GetById',

  //CRM_CONTACT_CUSTOMER_CATEGORY
  CRM_CONTACT_CUSTOMER_GETLIST: 'CRM_CONTACTCUSTOMER_GetList',
  CRM_CONTACT_CUSTOMER_DELETE: 'CRM_CONTACTCUSTOMER_Delete',
  CRM_CONTACT_CUSTOMER_CREATEORUPDATE: 'CRM_CONTACTCUSTOMER_CreateOrUpdate',
  CRM_CONTACT_CUSTOMER_GETBYID: 'CRM_CONTACTCUSTOMER_GetById',

  //MD_SERVICE
  MD_SERVICE_GETLIST: 'MD_SERVICE_GetList',
  MD_SERVICE_DELETE: 'MD_SERVICE_Delete',
  MD_SERVICE_CREATEORUPDATE: 'MD_SERVICE_CreateOrUpdate',
  MD_SERVICE_GETBYID: 'MD_SERVICE_GetById',

  //CMS_FAQS
  CMS_FAQS_GETLIST: 'CMS_FAQS_GetList',
  CMS_FAQS_GETNEWESTINDEX: 'CMS_FAQS_GetNewestIndex',
  CMS_FAQS_DELETE: 'CMS_FAQS_Delete',
  CMS_FAQS_CREATEORUPDATE: 'CMS_FAQS_CreateOrUpdate',
  CMS_FAQS_GETBYID: 'CMS_FAQS_GetById',

  //SYS_APPCONFIG
  SYS_APPCONFIG_GETBYKEY_ADMINWEB: 'SYS_APPCONFIG_GetByKey_AdminWeb',
  SYS_APPCONFIG_GETBYPAGESETTING_ADMINWEB:
    'SYS_APPCONFIG_GetByPageSetting_AdminWeb',
  SYS_APPCONFIG_GETLIST_ADMINWEB: 'SYS_APPCONFIG_GetList_AdminWeb',
  SYS_APPCONFIG_UPDATEPAGESETTING_ADMINWEB:
    'SYS_APPCONFIG_UpdatePageSetting_AdminWeb',

  //MD_PARTNER
  MD_PARTNER_GETLIST_ADMINWEB: 'MD_PARTNER_GetList_AdminWeb',
  MD_PARTNER_CHANGEPASSWORD_ADMINWEB: 'MD_PARTNER_ChangePassword_AdminWeb',
  MD_PARTNER_CHECK_USERNAME: 'MD_PARTNER_Check_UserName',
  MD_PARTNER_GETBYID_ADMINWEB: 'MD_PARTNER_GetById_AdminWeb',
  MD_PARTNER_DELETE: 'MD_PARTNER_Delete',
  MD_PARTNER_CREATEORUPDATE_ADMINWEB: 'MD_PARTNER_CreateOrUpdate_AdminWeb',
  MD_PARTNER_CHECK_PARTNERNAME: 'MD_PARTNER_Check_PartnerName',
  MD_PARTNER_CHECK_PHONENUMBER: 'MD_PARTNER_Check_PhoneNumber',

  //MD_REVIEW
  CRM_REVIEW_CREATEORUPDATE_ADMINWEB: 'CRM_REVIEW_CreateOrUpdate_AdminWeb',
  CRM_REVIEW_GETLIST_ADMINWEB: 'CRM_REVIEW_GetList_AdminWeb',
  CRM_REVIEW_GETBYID_ADMINWEB: 'CRM_REVIEW_GetById_AdminWeb',
  CRM_REVIEW_DELETE: 'CRM_REVIEW_Delete',
};
