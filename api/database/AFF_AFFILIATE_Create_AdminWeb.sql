CREATE PROCEDURE AFF_AFFILIATE_Create_AdminWeb
    @AFFILIATEREQUESTID BIGINT = 0,
    @CREATEDUSER VARCHAR(20) = NULL 
AS 
BEGIN
    
    INSERT INTO AFF_AFFILIATE
    (
            MEMBERID,
            ISAGREE,
            REGISTRATIONDATE,
            LIVEIMAGE,
            IDCARDFRONTSIDE,
            IDCARDBACKSIDE,
            PHONENUMBER,
            AFFILIATETYPEID,
            AFFILIATEREQUESTID,
            ISACTIVE,
            ISDELETED,
            CREATEDUSER,
            CREATEDDATE,
            REGISTRATIONSOURCE,
            IDCARD,
            IDCARDDATE,
            IDCARDPLACE,
            COUNTRYID,
            PROVINCEID,
            DISTRICTID,
            WARDID,
            ADDRESS,
            APPROVEDDATE
    )
    SELECT  
            MEMBERID,
            ISAGREE,
            REGISTRATIONDATE,
            LIVEIMAGE,
            IDCARDFRONTSIDE,
            IDCARDBACKSIDE,
            PHONENUMBER,
            AFFILIATETYPEID,
            AFFILIATEREQUESTID,
            1,
            0,
            @CREATEDUSER,
            GETDATE(),
            2, --1. PORTAL, 2. WEB
            IDCARD,
            IDCARDDATE,
            IDCARDPLACE,
            6,
            PROVINCEID,
            DISTRICTID,
            WARDID,
            ADDRESS,
            APPROVEDDATE
    FROM    AFF_AFFILIATEREQUEST
    WHERE   AFF_AFFILIATEREQUEST.AFFILIATEREQUESTID = 2
    AND     AFF_AFFILIATEREQUEST.REQUESTSTATUS = 2

    SELECT SCOPE_IDENTITY() AS affiliate_id

END