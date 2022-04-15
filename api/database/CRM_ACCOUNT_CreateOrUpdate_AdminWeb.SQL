SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[CRM_ACCOUNT_CreateOrUpdate_AdminWeb]
        @MEMBERID AS BIGINT  = NULL,
        @USERNAME AS nvarchar(100) = NULL,
        @PASSWORD AS nvarchar(100) = NULL,
        @BIRTHDAY AS nvarchar(max) = NULL,
        @CUSTOMERCODE AS nvarchar(50) = NULL,
        @GENDER AS smallint = NULL,
        @FULLNAME AS nvarchar(200) = NULL,
        @NICKNAME AS nvarchar(200) = NULL,
        @IMAGEAVATAR AS nvarchar(500) = NULL,
        @IDCARDFRONTSIDE AS nvarchar(500) = NULL,
        @IDCARDBACKSIDE AS nvarchar(500) = NULL,
        @LIVEIMAGE AS nvarchar(500) = NULL,
        @PHONENUMBER AS nvarchar(20) = NULL,
        @EMAIL AS nvarchar(200) = NULL,
        @MARITALSTATUS AS int = NULL,
        @IDCARD AS nvarchar(20) = NULL,
        @IDCARDDATE AS nvarchar(max) = NULL,
        @IDCARDPLACE AS nvarchar(150) = NULL,
        @FACEBOOKURL AS nvarchar(150) = NULL,
        @TWITTERURL AS nvarchar(150) = NULL,
        @ADDRESS AS nvarchar(550) = NULL,
        @PROVINCEID AS int = NULL,
        @DISTRICTID AS int = NULL,
        @CUSTOMERTYPEID AS BIGINT = NULL,
        @WARDID AS int = NULL,
        @ISACTIVE AS bit = NULL,
        @CREATEDUSER AS nvarchar(100) = NULL,
        @REFERRALCODE BIGINT = NULL
AS
BEGIN
	IF NOT EXISTS (SELECT 1 FROM CRM_ACCOUNT WHERE MEMBERID = @MEMBERID)
	BEGIN
	        INSERT INTO CRM_ACCOUNT
            (
                USERNAME,
                PASSWORD,
                CUSTOMERTYPEID,
                BIRTHDAY,
                CUSTOMERCODE,
                REGISTERDATE,
                GENDER,
                FULLNAME,
                NICKNAME,
                IMAGEAVATAR,
                PHONENUMBER,
                EMAIL,
                MARITALSTATUS,
                IDCARD,
                IDCARDDATE,
                IDCARDPLACE,
                IDCARDFRONTSIDE,
                IDCARDBACKSIDE,
                LIVEIMAGE,
                ADDRESS,
                PROVINCEID,
                DISTRICTID,
                WARDID,
                FACEBOOKURL,
                TWITTERURL,
                ISACTIVE,
                ISSYSTEM,
                CREATEDUSER,
                CREATEDDATE,
                ISDELETED,
                REFERRALCODE
            )
			VALUES
            (
                @USERNAME,
                @PASSWORD,
                @CUSTOMERTYPEID,
                @BIRTHDAY,
                @CUSTOMERCODE,
                GETDATE(),
                @GENDER,
                @FULLNAME,
                @NICKNAME,
                @IMAGEAVATAR,
                @PHONENUMBER,
                @EMAIL,
                @MARITALSTATUS,
                @IDCARD,
                @IDCARDDATE,
                @IDCARDPLACE,
                @IDCARDFRONTSIDE,
                @IDCARDBACKSIDE,
                @LIVEIMAGE,
                @ADDRESS,
                @PROVINCEID,
                @DISTRICTID,
                @WARDID,
                @FACEBOOKURL,  
                @TWITTERURL, 
                @ISACTIVE,
                1,
                @CREATEDUSER,
                GETDATE(),
                0,
                @REFERRALCODE
            )
		    SELECT  SCOPE_IDENTITY() AS RESULT
	END
	ELSE
	BEGIN
            UPDATE  CRM_ACCOUNT
            SET 
                    USERNAME = @USERNAME,
                    BIRTHDAY = @BIRTHDAY,
                    GENDER = @GENDER,
                    CUSTOMERTYPEID =@CUSTOMERTYPEID,
                    FULLNAME = @FULLNAME,
                    NICKNAME = @NICKNAME,
                    IMAGEAVATAR = @IMAGEAVATAR,
                    PHONENUMBER = @PHONENUMBER,
                    EMAIL = @EMAIL,
                    MARITALSTATUS = @MARITALSTATUS,
                    IDCARD = @IDCARD,
                    IDCARDDATE =  @IDCARDDATE,
                    IDCARDPLACE = @IDCARDPLACE,
                    IDCARDFRONTSIDE = @IDCARDFRONTSIDE,
                    IDCARDBACKSIDE = @IDCARDBACKSIDE,
                    LIVEIMAGE = @LIVEIMAGE,
                    ADDRESS = @ADDRESS,
                    PROVINCEID = @PROVINCEID,
                    DISTRICTID = @DISTRICTID,
                    WARDID = @WARDID,
                    FACEBOOKURL= @FACEBOOKURL,
                    TWITTERURL= @TWITTERURL,
                    ISACTIVE = @ISACTIVE,
                    UPDATEDUSER = @CREATEDUSER,
                    UPDATEDDATE = GETDATE(),
                    REFERRALCODE = @REFERRALCODE
            WHERE   MEMBERID = @MEMBERID

            SELECT @MEMBERID AS RESULT
	END
	 
END
GO
