SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[PRO_DISCOUNT_Getlist_AdminWeb]
    @KEYWORD VARCHAR(250) = NULL,
    @ISACTIVE INT = NULL,
    @ISDELETED INT = NULL,
    @CREATEDDATEFROM VARCHAR(250) = NULL,
    @CREATEDDATETO VARCHAR(250) = NULL,
    @DISCOUNTSTATUS INT = NULL, --0: TAT CA, 1: CHUA AP DUNG, 2: DANG AP DUNG, 3: HET THOI GIAN AP DUNG
    @PAGESIZE INT = 25,
    @PAGEINDEX INT = 1
AS
BEGIN
		SET NOCOUNT ON;
		SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

		IF @KEYWORD ='' SET @KEYWORD = NULL
		IF @ISACTIVE = 2 SET @ISACTIVE = NULL
		IF @ISDELETED = 2 SET @ISDELETED = NULL
		IF @DISCOUNTSTATUS = 0 SET @DISCOUNTSTATUS = NULL
		
		
		DECLARE @dBEGINDATE DATETIME, @dENDDATE DATETIME = null
		IF ISNULL(@CREATEDDATEFROM,'')='' SET @dBEGINDATE = NULL
		ELSE SET @dBEGINDATE = CONVERT(datetime,@CREATEDDATEFROM,103)
		IF ISNULL(@CREATEDDATETO,'')='' SET @dENDDATE = NULL
		ELSE SET @dENDDATE = DATEADD(DAY,1,try_CONVERT(datetime,@CREATEDDATETO,103))

        DECLARE @DATE_CURRENT AS DATETIME = CAST(CAST(GETDATE() AS DATE) AS DATETIME);

		SELECT
                    PDS.DISCOUNTID,
                    PDS.DISCOUNTCODE,
                    PDS.ISPERCENTDISCOUNT,
                    PDS.ISMONEYDISCOUNT,
                    PDS.DISCOUNTVALUE,
                    PDS.ISALLPRODUCT,
                    PDS.ISAPPOINTPRODUCT,
                    PDS.ISALLCUSTOMERTYPE,
                    PDS.ISAPPOINTCUSTOMERTYPE,
                    PDS.ISAPPLYOTHERDISCOUNT,
                    PDS.ISNONEREQUIREMENT,
                    PDS.ISMINTOTALMONEY,
                    PDS.VALUEMINTOTALMONEY,
                    PDS.ISMINNUMPRODUCT,
                    PDS.VALUEMINNUMPRODUCT,
                    PDS.DISCOUNTSTATUS,
                    FORMAT(PDS.STARTDATE, 'dd/MM/yyyy') AS STARTDATE,
                    FORMAT(PDS.ENDDATE, 'dd/MM/yyyy') AS ENDDATE,
                    FORMAT(PDS.CREATEDDATE, 'dd/MM/yyyy hh:mm') AS CREATEDDATEVIEW,
                    PDS.ISACTIVE,

                    CASE 
                        WHEN @DATE_CURRENT < PDS.STARTDATE THEN N'Chưa áp dụng' --CHUA AP DUNG
                        WHEN @DATE_CURRENT > PDS.ENDDATE  THEN N'Hết thời gian áp dụng' --DA HET HAN
                        WHEN (
                                @DATE_CURRENT >= PDS.STARTDATE
                                AND (
                                        @DATE_CURRENT <= PDS.ENDDATE
                                        OR PDS.ENDDATE IS NULL
                                    )
                            ) THEN N'Đang áp dụng' --DANG AP DUNG
                        ELSE ''
                    END DISCOUNTSTATUSNAME,

                    COUNT(1) OVER() AS TOTALITEMS
				
        FROM        PRO_DISCOUNT PDS
        WHERE       (@ISDELETED IS NULL OR PDS.ISDELETED = @ISDELETED)
        AND         (@ISACTIVE IS NULL OR PDS.ISACTIVE = @ISACTIVE)
        AND         (@dBEGINDATE IS NULL OR PDS.CREATEDDATE >= @dBEGINDATE)
        AND         (@dENDDATE IS NULL OR PDS.CREATEDDATE < @dENDDATE)
        AND         (@KEYWORD IS NULL OR PDS.DISCOUNTCODE LIKE '%'+LTRIM(RTRIM(@KEYWORD))+'%')
        AND         (
                        @DISCOUNTSTATUS IS NULL 
                        OR (@DISCOUNTSTATUS = 1 AND PDS.STARTDATE > @DATE_CURRENT)
                        OR (
                            @DISCOUNTSTATUS = 2 
                            AND 
                            (
                              @DATE_CURRENT >= PDS.STARTDATE
                              AND @DATE_CURRENT <= PDS.ENDDATE OR PDS.ENDDATE IS NULL
                            )
                        )
                        OR (@DISCOUNTSTATUS = 3 AND @DATE_CURRENT > PDS.ENDDATE)
                    )
        ORDER BY    PDS.CREATEDDATE  DESC
        OFFSET (@PAGEINDEX -1)* @PAGESIZE ROWS
        FETCH NEXT @PAGESIZE ROWS ONLY
					
END
GO
