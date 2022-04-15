SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[CRM_ACCOUNT_GetByID_AdminWeb]
	@MEMBERID AS NVARCHAR(200) = NULL
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    SELECT 
            MEMBERID,
            USERNAME,
            PASSWORD,
            CUSTOMERTYPEID,
            BIRTHDAY,
            CUSTOMERCODE,
            convert(nvarchar(20), REGISTERDATE,103) REGISTERDATE,
            GENDER,
            FULLNAME,
            NICKNAME,
            IMAGEAVATAR,
            PHONENUMBER,
            EMAIL,
            MARITALSTATUS,
            IDCARD,
            convert(nvarchar(20), IDCARDDATE,103) IDCARDDATE,
            IDCARDPLACE,
            IDCARDFRONTSIDE,
            IDCARDBACKSIDE,
            LIVEIMAGE,
            ADDRESS,
            PROVINCEID,
            DISTRICTID,
            COUNTRYID,
            WARDID,
            ISACTIVE,
            TWITTERURL,
            FACEBOOKURL,
            REFERRALCODE
	FROM    CRM_ACCOUNT
	WHERE   ISDELETED = 0
	AND     MEMBERID = @MEMBERID 

END
GO
