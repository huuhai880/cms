SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<locnd>
-- Create date: <28/08/2021>
-- Description:	<chi tiết luận giải>
-- =============================================
ALTER PROCEDURE [dbo].[FOR_INTERPRET_GetById_AdminWeb]
    @INTERPRETID bigint 
AS
BEGIN
	SELECT
                FOR_INTERPRET.INTERPRETID,	
                FOR_INTERPRET.MAINNUMBERID,
                FOR_INTERPRET.ATTRIBUTEID,
                FOR_INTERPRET.COMPARENUM,
                FOR_INTERPRET.RELATIONSHIPID,
                FOR_INTERPRET.ORDERINDEX,
                FOR_INTERPRET.ISACTIVE,
                FOR_INTERPRET.ISMASTER,
                FOR_INTERPRET.DESCRIPTION,
                FOR_INTERPRET.BRIEFDESCRIPTION,
                FOR_INTERPRET.NOTICE,
                FOR_ATTRIBUTES.ATTRIBUTENAME,
                FOR_MAINNUMBER.MAINNUMBER,
                FOR_ATTRIBUTESGROUP.GROUPNAME,
				FOR_ATTRIBUTESGROUP.DESCRIPTION as DESCRIPTIONATTRIBUTESGRUOP,
			    FOR_INTERPRET.ISINTERPRETSPECIAL,
                FOR_INTERPRET.COMPAREATTRIBUTEID,
                FOR_INTERPRET.ISCONDITIONOR
                
	FROM        FOR_INTERPRET

	LEFT JOIN   FOR_ATTRIBUTES 
    ON          FOR_ATTRIBUTES.ATTRIBUTEID = FOR_INTERPRET.ATTRIBUTEID

	LEFT JOIN   FOR_MAINNUMBER 
    ON          FOR_MAINNUMBER.MAINNUMBERID = FOR_INTERPRET.MAINNUMBERID

    LEFT JOIN   FOR_ATTRIBUTESGROUP
    ON          FOR_ATTRIBUTESGROUP.ATTRIBUTESGROUPID = FOR_ATTRIBUTES.ATTRIBUTESGROUPID
    AND         FOR_ATTRIBUTESGROUP.ISDELETED = 0
    AND         FOR_ATTRIBUTESGROUP.ISACTIVE = 1

	WHERE       FOR_INTERPRET.INTERPRETID= @INTERPRETID
	AND         FOR_INTERPRET.ISDELETED = 0
END
GO