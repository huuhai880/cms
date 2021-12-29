SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<locnd>
-- Create date: <09/09/2021>
-- Description:	<danh sách luận giải>
-- =============================================
ALTER PROCEDURE [dbo].[FOR_INTERPRET_GetList_AdminWeb]
    @KEYWORD NVARCHAR(1000) = NULL,
    @PAGESIZE INT = 10,
    @PAGEINDEX INT = 1,
    @ISACTIVE INT = 2,
	@ISINTERPRETSPECIAL INT = 2
AS
BEGIN
            IF(@KEYWORD = '') SET @KEYWORD = NULL

			SELECT 
			            count(1) over() as TOTALITEMS,
                        FOR_ATTRIBUTES.ATTRIBUTEID,
                        FOR_ATTRIBUTES.ATTRIBUTENAME,
                        FOR_INTERPRET.INTERPRETID,
                        FOR_INTERPRET.BRIEFDESCRIPTION,
                        FOR_INTERPRET.ISACTIVE,
						FOR_INTERPRET.ISINTERPRETSPECIAL,
                        
						(SUBSTRING(( SELECT '; '+ CONVERT(nVarchar(2000),FOR_ATTRIBUTES.ATTRIBUTENAME ,0)
                            FROM dbo.FOR_ATTRIBUTES 
                            LEFT JOIN dbo.FOR_INTERPRET_ATTRIBUTE on FOR_ATTRIBUTES.ATTRIBUTEID = FOR_INTERPRET_ATTRIBUTE.ATTRIBUTEID AND FOR_ATTRIBUTES.ISDELETED = 0
                            WHERE FOR_INTERPRET_ATTRIBUTE.INTERPRETID = FOR_INTERPRET.INTERPRETID AND FOR_INTERPRET_ATTRIBUTE.ISDELETED = 0
                            FOR XML PATH ('')), 2, 100)
                        ) AS ATTRIBUTESNAME,
                        FOR_INTERPRET.ORDERINDEX,
                        ISNULL(FOR_INTERPRET.ISCONDITIONOR,0) ISCONDITIONOR

			FROM        FOR_INTERPRET

			left JOIN   FOR_ATTRIBUTES 
            ON          FOR_INTERPRET.ATTRIBUTEID = FOR_ATTRIBUTES.ATTRIBUTEID 
            AND         FOR_ATTRIBUTES.ISACTIVE = 1
            AND         FOR_ATTRIBUTES.ISDELETED = 0

            WHERE       FOR_INTERPRET.ISDELETED = 0		
			AND         (
                            @ISACTIVE = 2 
                            OR FOR_INTERPRET.ISACTIVE = @ISACTIVE
                        )
												AND         (
                            @ISINTERPRETSPECIAL = 2 
                            OR FOR_INTERPRET.ISINTERPRETSPECIAL = @ISINTERPRETSPECIAL
                        )

            AND         (
                            @KEYWORD IS NULL 
                            OR (FOR_ATTRIBUTES.ATTRIBUTENAME like '%'+ LTRIM(RTRIM(@KEYWORD))+'%' collate Latin1_General_CI_AI_WS)
                            OR EXISTS 
                            (
                                SELECT  1
                                FROM    FOR_INTERPRETDETAIL
                                WHERE   FOR_INTERPRETDETAIL.INTERPRETID = FOR_INTERPRET.INTERPRETID
                                AND     FOR_INTERPRETDETAIL.ISDELETED = 0
                                AND     FOR_INTERPRETDETAIL.ISACTIVE = @ISACTIVE
                                AND     (FOR_INTERPRETDETAIL.INTERPRETDETAILNAME like '%'+ LTRIM(RTRIM(@KEYWORD))+'%' collate Latin1_General_CI_AI_WS)
                            )
                        )
            ORDER BY    FOR_INTERPRET.CREATEDDATE  DESC

			OFFSET      (@PAGEINDEX -1)* @PAGESIZE ROWS
			FETCH NEXT  @PAGESIZE ROWS ONLY
END
GO
