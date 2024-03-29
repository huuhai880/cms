SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[CRM_ACCOUNT_GetList_AdminWeb] 
	@KEYWORD nvarchar(1000) = NULL,
	@COUNTRYID INT = NULL, 
	@PROVINCEID INT = NULL, 
	@DISTRICTID INT = NULL, 
	@WARDID INT = NULL, 
	@GENDER INT = NULL, 
	@FROMBIRTHDAY nvarchar(20) = NULL,
	@TOBIRTHDAY nvarchar(20) = NULL,
	@TYPEREGISTER nvarchar(50) = NULL,
	@ISACTIVE INT = 2, -- 1: ACTIVE, 0: NOT ACTIVE, 2 ALL
	@PAGESIZE INT = 25,
	@PAGEINDEX INT = 1
AS
BEGIN

SET NOCOUNT ON;
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
	IF @KEYWORD ='' SET @KEYWORD = NULL
	IF @COUNTRYID = 0 SET @COUNTRYID = NULL
	IF @PROVINCEID = 0 SET @PROVINCEID = NULL
	IF @DISTRICTID = 0 SET @DISTRICTID = NULL
	IF @WARDID = 0 SET @WARDID = NULL
	IF @GENDER = 2 SET @GENDER = NULL
	Declare @dFROMBIRTHDAY datetime = null 
	Declare @dTOBIRTHDAY datetime = null
	if @FROMBIRTHDAY <> '' and @FROMBIRTHDAY is not null
		set @dFROMBIRTHDAY = TRY_CONVERT(datetime,@FROMBIRTHDAY,103)
	if @TOBIRTHDAY <> '' and @TOBIRTHDAY is not null
		set @dTOBIRTHDAY = DATEADD(day,1,TRY_CONVERT(datetime,@TOBIRTHDAY,103))
	declare @bISACTIVE bit = null
	IF @ISACTIVE <>2 SET @bISACTIVE = TRY_CAST(@ISACTIVE AS BIT)
	IF @TYPEREGISTER = '' SET @TYPEREGISTER = NULL
	
	;with temp as (
	SELECT 
			ac.MEMBERID,
			count(1) over() as TOTALITEMS
		FROM dbo.CRM_ACCOUNT ac
		WHERE ac.ISDELETED = 0
		AND (@KEYWORD IS NULL OR ( ac.FULLNAME like '%'+ RTRIM(LTRIM(@KEYWORD))+'%'  collate Latin1_General_CI_AI_WS)
							 OR ( ac.PHONENUMBER like '%'+ RTRIM(LTRIM(@KEYWORD))+'%' collate Latin1_General_CI_AI_WS)
							 OR ( ac.EMAIL like '%'+ RTRIM(LTRIM(@KEYWORD))+'%'  collate Latin1_General_CI_AI_WS)
							 OR ( ac.IDCARD like '%'+ RTRIM(LTRIM(@KEYWORD))+'%'  collate Latin1_General_CI_AI_WS)
                             OR ( ac.CUSTOMERCODE like '%'+ RTRIM(LTRIM(@KEYWORD))+'%'  collate Latin1_General_CI_AI_WS)
			)
		AND (@COUNTRYID IS NULL OR ac.COUNTRYID = @COUNTRYID)
		AND (@PROVINCEID IS NULL OR ac.PROVINCEID=@PROVINCEID)
		AND (@DISTRICTID IS NULL OR ac.DISTRICTID=@DISTRICTID)
		AND (@WARDID IS NULL OR ac.WARDID=@WARDID)
		AND (@GENDER IS NULL OR ac.GENDER=@GENDER)
		AND (@TYPEREGISTER IS NULL OR ac.TYPEREGISTER LIKE @TYPEREGISTER)
		AND (@bISACTIVE IS NULL OR @bISACTIVE  = ac.ISACTIVE)
		AND (@dFROMBIRTHDAY IS NULL OR @dFROMBIRTHDAY <= ac.BIRTHDAY)
		AND (@dTOBIRTHDAY IS NULL OR @dTOBIRTHDAY > ac.BIRTHDAY)
		
			
		)
		select 	
			ac.MEMBERID,
		    ac.CUSTOMERCODE,
			ac.FULLNAME,
			ac.GENDER,
			convert(nvarchar(10),ac.BIRTHDAY,103) as BIRTHDAY,
			ac.PHONENUMBER, 
			 CASE  WHEN ac.TYPEREGISTER LIKE '1' THEN N'Trực tiếp'
				WHEN ac.TYPEREGISTER LIKE '2' THEN N'Website'
				ELSE N'Ứng dụng mobile' END TYPEREGISTER  ,
			STUFF(
			case when ISNULL(ac.ADDRESS,'') = '' then '' else ', '  + ac.ADDRESS end
			+ case when ISNULL(wa.WARDNAME,'') = '' then '' else ', '  + wa.WARDNAME end
			+ case when ISNULL(dis.DISTRICTNAME,'') = '' then '' else ', '  + dis.DISTRICTNAME end
			+ case when ISNULL(pro.PROVINCENAME,'') = '' then '' else ', '  + pro.PROVINCENAME end
			+ case when ISNULL(con.COUNTRYNAME,'') = '' then '' else ', '  + con.COUNTRYNAME end
			,1,2,'') as ADDRESSFULL,
			ac.ISACTIVE,		
			@PAGEINDEX as PAGEINDEX,
			t.TOTALITEMS,
            ac.REFERRALCODE,
            aff.AFFILIATEID,
            IIF(ac.REFERRALCODE IS NOT NULL, CONCAT(referral.CUSTOMERCODE, ' - ', referral.FULLNAME), '') REFERRALMEMBER
		from temp t
		
		inner join dbo.CRM_ACCOUNT ac on t.MEMBERID = ac.MEMBERID
        left join dbo.CRM_ACCOUNT referral on referral.MEMBERID  =  ac.REFERRALCODE
		left join dbo.MD_COUNTRY con on con.COUNTRYID = ac.COUNTRYID
		left join dbo.MD_PROVINCE pro on pro.PROVINCEID = ac.PROVINCEID
		left join dbo.MD_DISTRICT dis on dis.DISTRICTID = ac.DISTRICTID
		left join dbo.MD_WARD wa on wa.WARDID = ac.WARDID
        left join AFF_AFFILIATE aff on aff.MEMBERID = ac.REFERRALCODE

        ORDER BY CONVERT(DateTime,ac.REGISTERDATE,103)  DESC
        OFFSET (@PAGEINDEX -1)* @PAGESIZE ROWS
		FETCH NEXT @PAGESIZE ROWS ONLY
END
GO
