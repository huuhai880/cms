SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<locnd>
-- Create date: <09/09/2021>
-- Description:	<danh sách mối quan hệ>
-- =============================================
ALTER PROCEDURE [dbo].[FOR_INTERPRET_getRelationshipsList_AdminWeb]
AS
BEGIN
	SELECT  RELATIONSHIPID,
            RELATIONSHIP,
            ISLOVE,
            ISFARTHERCHILD,
            ISMOTHERCHILD 
    FROM    MD_RELATIONSHIPS 
    WHERE   ISDELETED = 0 
    AND     ISACTIVE=1
END
GO
