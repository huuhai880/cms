SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<locnd>
-- Create date: <27/09/2021>
-- Description:	<danh sách công thức>
-- =============================================
ALTER PROCEDURE [dbo].[FOR_FORMULA_GetList_AdminWeb]
    @KEYWORD nvarchar(1000) = NULL,
    @CREATEDDATEFROM nvarchar(10) = NULL, 
    @CREATEDDATETO nvarchar(10) = NULL,
    @PAGESIZE INT = 10,
    @PAGEINDEX INT = 1,
    @ISACTIVE INT = null,
    @ATTRIBUTESGROUPID BIGINT = 0,
    @TYPEFORMULA INT = 0 --0: Tat ca, 1: Cong thuc thong thuong, 2: Cong thuc dieu kien, 3: Cong thuc cap
AS
BEGIN
			IF @KEYWORD ='' SET @KEYWORD = NULL
			declare @dFROM datetime = null, @dTO datetime = null
			if isnull(@CREATEDDATEFROM,'') <> '' set @dFROM = try_convert(datetime,@CREATEDDATEFROM,103)
			if isnull(@CREATEDDATETO,'') <> '' set @dTO = try_convert(datetime,@CREATEDDATETO,103)
			IF @ISACTIVE =2 SET @ISACTIVE = NULL

			SELECT 
                    count(1) over() as TOTALITEMS,
                    FOR_FORMULA.FORMULAID,
                    FOR_FORMULA.FORMULANAME,
                    FOR_FORMULA.ISACTIVE,
                    FOR_FORMULA.ORDERINDEX,
                    FOR_ATTRIBUTESGROUP.GROUPNAME,
                    convert(nvarchar(10),FOR_FORMULA.CREATEDDATE,103) CREATEDDATE,
                    ISCOUPLEFORMULA,
                    ISCONDITIONFORMULA
			FROM    FOR_FORMULA

			JOIN    FOR_ATTRIBUTESGROUP 
            on      FOR_ATTRIBUTESGROUP.ATTRIBUTESGROUPID = FOR_FORMULA.ATTRIBUTESGROUPID

			WHERE   FOR_FORMULA.ISDELETED = 0
			AND     (@KEYWORD IS NULL OR ( FOR_FORMULA.FORMULANAME like '%'+ LTRIM(RTRIM(@KEYWORD)+'%' )))
			AND     (@ISACTIVE IS NULL OR FOR_FORMULA.ISACTIVE = @ISACTIVE )
			AND	    (@dFROM IS NULL OR FOR_FORMULA.CREATEDDATE >= @dFROM )
			AND     (@dTO IS NULL OR FOR_FORMULA.CREATEDDATE <= @dTO +1)
            AND     (@ATTRIBUTESGROUPID = 0 OR FOR_FORMULA.ATTRIBUTESGROUPID = @ATTRIBUTESGROUPID)
            AND     (
                        @TYPEFORMULA = 0
                        OR (@TYPEFORMULA = 1 AND ISNULL(ISCOUPLEFORMULA, 0) = 0 AND ISNULL(ISCONDITIONFORMULA, 0) = 0)
                        OR (@TYPEFORMULA = 2 AND ISCONDITIONFORMULA = 1)
                        OR (@TYPEFORMULA = 3 AND ISCOUPLEFORMULA = 1)
                    )
			ORDER BY CONVERT(DateTime, FOR_FORMULA.CREATEDDATE,101)  DESC
			OFFSET (@PAGEINDEX -1)* @PAGESIZE ROWS
			FETCH NEXT @PAGESIZE ROWS ONLY
END
GO
