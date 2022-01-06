SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<locnd>
-- Create date: <28/08/2021>
-- Description:	<chi tiết công thức>
-- =============================================
ALTER PROCEDURE [dbo].[FOR_FORMULA_GetById_AdminWeb]
@FORMULAID bigint
AS
BEGIN
	SELECT  FORMULAID,FORMULANAME,
            ATTRIBUTESGROUPID,
            DESCRIPTION,
            ORDERINDEX,
            ISFOMULAORTHERID1,
            ISFOMULAORTHERID2,
            ORTHERID1,
            ORTHERID2,
            CALCULATIONID,
            ISDEFAULT,
            ISACTIVE,

            ISTOTALNOSHORTENED,
            ISTOTALSHORTENED,
            ISTOTAL2DIGIT,
            ISCOUPLEFORMULA,
            ISCONDITIONFORMULA,
            REFCONDITIONID,
            REFFORMULAID,
            INTERPRETFORMULAID

    FROM    FOR_FORMULA
	WHERE   FOR_FORMULA.FORMULAID= @FORMULAID
	AND     ISDELETED = 0
END
GO
