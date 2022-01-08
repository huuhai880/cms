SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<locnd>
-- Create date: <09/09/2021>
-- Description:	<Thêm hoặc thay đổi thành phần>
-- =============================================
ALTER PROCEDURE [dbo].[FOR_FORMULAINGREDIENTS_CreateOrupdate_AdminWeb]
    @INGREDIENTID AS BIGINT  = NULL,
    @PARAMDOBID AS BIGINT  = NULL,
    @ORTHERINGREDIENTID1 AS BIGINT  = NULL,
    @ORTHERINGREDIENTID2 AS BIGINT  = NULL,
    @PARAMNAMEID AS BIGINT  = NULL,
    @CALCULATIONID AS BIGINT  = NULL,
    @INGREDIENTNAME AS nvarchar(100) = NULL,
    @VALUEINGREDIENTS AS nvarchar(100) = NULL,
    @DESCRIPTION AS nvarchar(2000) = NULL,
    @ISACTIVE AS bit = NULL,
    @CREATEDUSER AS nvarchar(100) = NULL,
    @ISAPPLYDOB AS bit = NULL,
    @ISAPPLYNAME AS bit = NULL,
    @ISVOWELS AS bit = NULL,
    @ISONLYFIRSTVOWEL AS bit = NULL,
    @ISCONSONANT AS bit = NULL,
    @ISFIRSTLETTER AS bit = NULL,
    @ISLASTLETTER AS bit = NULL,
    @ISNUMSHOW3TIME AS bit = NULL,
    @ISNUMSHOW0TIME AS bit = NULL,
    @ISTOTALSHORTENED AS bit = NULL,
    @ISTOTALNOSHORTENED AS bit = NULL,
    @ISTOTAL2DIGIT AS bit = NULL,
    @ISCURRENTAGE AS bit = NULL,
    @ISCURRENTYEAR AS bit = NULL,
    @ISVALUEINGREDIENTS AS bit = NULL,
    @GETLAST2DIGITS AS bit = NULL,
    @ISGENDER AS bit = NULL,
    @ISCOUNTOFNUM AS bit = NULL,
    @ISNUMLETTERNOSHORTENED AS bit = NULL,
    @ISNUMLETTERS2DIGIT AS bit = NULL,
    @ISNUMLETTERS1DIGIT AS bit = NULL,
    @ISTOTALVALUES2DIGIT AS bit = NULL,
    @ISTOTALVALUES1DIGIT AS bit = NULL,
    @ISTOTALVALUENOSHORTENED as bit = null,
    @ISTOTALFIRSTLETTERNOSHORTENED as bit = null,
    @ISTOTALFIRSTLETTER2DIGIT AS bit = NULL,
    @ISTOTALFIRSTLETTER1DIGIT AS bit = NULL,
    @ISTOTALLETTERS2DIGIT AS bit = NULL,
    @ISTOTALLETTERSNOSHORTENED as bit= null,
    @ISTOTALLETTERS1DIGIT AS bit = NULL,
    @ISAPPLYOTHER BIT = 0,
    @PARAMOTHERID BIGINT = 0,
    @ISYEARVIEWING BIT = 0
AS
BEGIN

    IF NOT EXISTS ( SELECT 1 FROM dbo.FOR_FORMULAINGREDIENTS  WHERE INGREDIENTID = @INGREDIENTID) --insert
	BEGIN
            INSERT INTO [dbo].[FOR_FORMULAINGREDIENTS]
            (
                [INGREDIENTNAME]
                ,[DESCRIPTION]
                ,[PARAMDOBID]
                ,[PARAMNAMEID]
                ,[CALCULATIONID]
                ,[ORTHERINGREDIENTID1]
                ,[ORTHERINGREDIENTID2]
                ,[VALUEINGREDIENTS]
                ,[ISACTIVE]
                ,[ISGENDER]
                ,[CREATEDUSER]
                ,[CREATEDDATE]
                ,[ISAPPLYDOB]
                ,[ISAPPLYNAME]
                ,[ISDELETED]
                ,[ISVOWELS]
                ,[ISONLYFIRSTVOWEL]
                ,[ISCONSONANT]
                ,[ISFIRSTLETTER]
                ,[ISLASTLETTER]
                ,[ISNUMSHOW3TIME]
                ,[ISNUMSHOW0TIME]
                ,[ISTOTALSHORTENED]
                ,[ISTOTALNOSHORTENED]
                ,[ISTOTAL2DIGIT]
                ,[ISCURRENTAGE]
                ,[ISCURRENTYEAR]
                ,[ISVALUEINGREDIENTS]
                ,[GETLAST2DIGITS],
                ISCOUNTOFNUM ,
                ISNUMLETTERNOSHORTENED,
                ISNUMLETTERS2DIGIT,
                ISNUMLETTERS1DIGIT,
                ISTOTALVALUENOSHORTENED,
                ISTOTALVALUES2DIGIT,
                ISTOTALVALUES1DIGIT,
                ISTOTALFIRSTLETTERNOSHORTENED,
                ISTOTALFIRSTLETTER2DIGIT,
                ISTOTALFIRSTLETTER1DIGIT,
                ISTOTALLETTERSNOSHORTENED,
                ISTOTALLETTERS2DIGIT,
                ISTOTALLETTERS1DIGIT,
                ISAPPLYOTHER,
                PARAMOTHERID,
                ISYEARVIEWING
            )
            VALUES
            (
                @INGREDIENTNAME
                ,@DESCRIPTION
                ,@PARAMDOBID
                ,@PARAMNAMEID
                ,@CALCULATIONID
                ,@ORTHERINGREDIENTID1
                ,@ORTHERINGREDIENTID2
                ,@VALUEINGREDIENTS
                ,@ISACTIVE
                ,@ISGENDER
                ,@CREATEDUSER
                ,GETDATE()
                ,@ISAPPLYDOB
                ,@ISAPPLYNAME
                ,0
                ,@ISVOWELS
                ,@ISONLYFIRSTVOWEL
                ,@ISCONSONANT
                ,@ISFIRSTLETTER
                ,@ISLASTLETTER
                ,@ISNUMSHOW3TIME
                ,@ISNUMSHOW0TIME
                ,@ISTOTALSHORTENED
                ,@ISTOTALNOSHORTENED
                ,@ISTOTAL2DIGIT
                ,@ISCURRENTAGE
                ,@ISCURRENTYEAR
                ,@ISVALUEINGREDIENTS
                ,@GETLAST2DIGITS,
                @ISCOUNTOFNUM ,
                @ISNUMLETTERNOSHORTENED,
                @ISNUMLETTERS2DIGIT,
                @ISNUMLETTERS1DIGIT,
                @ISTOTALVALUENOSHORTENED,
                @ISTOTALVALUES2DIGIT,
                @ISTOTALVALUES1DIGIT,
                @ISTOTALFIRSTLETTERNOSHORTENED,
                @ISTOTALFIRSTLETTER2DIGIT,
                @ISTOTALFIRSTLETTER1DIGIT,
                @ISTOTALLETTERSNOSHORTENED,
                @ISTOTALLETTERS2DIGIT,
                @ISTOTALLETTERS1DIGIT,
                @ISAPPLYOTHER,
                @PARAMOTHERID,
                @ISYEARVIEWING
            )
            SELECT  SCOPE_IDENTITY() AS RESULT
	END
	ELSE
	BEGIN
            UPDATE [dbo].[FOR_FORMULAINGREDIENTS]
            SET 
                    [PARAMDOBID] = @PARAMDOBID
                    ,[CALCULATIONID] = @CALCULATIONID
                    ,[PARAMNAMEID] = @PARAMNAMEID
                    ,[INGREDIENTNAME] = @INGREDIENTNAME
                    ,[VALUEINGREDIENTS]=@VALUEINGREDIENTS
                    ,[ISAPPLYDOB] = @ISAPPLYDOB
                    ,[ISAPPLYNAME] = @ISAPPLYNAME
                    ,[ORTHERINGREDIENTID1] = @ORTHERINGREDIENTID1
                    ,[ORTHERINGREDIENTID2] = @ORTHERINGREDIENTID2
                    ,[ISGENDER] = @ISGENDER
                    ,[ISACTIVE] = @ISACTIVE
                    ,[DESCRIPTION] = @DESCRIPTION
                    ,[UPDATEDUSER] = @CREATEDUSER
                    ,[UPDATEDDATE] = GETDATE()
                    ,[ISVOWELS]= @ISVOWELS
                    ,[ISONLYFIRSTVOWEL] = @ISONLYFIRSTVOWEL
                    ,[ISCONSONANT] = @ISCONSONANT
                    ,[ISFIRSTLETTER] = @ISFIRSTLETTER
                    ,[ISLASTLETTER] = @ISLASTLETTER
                    ,[ISNUMSHOW3TIME] = @ISNUMSHOW3TIME
                    ,[ISNUMSHOW0TIME] = @ISNUMSHOW0TIME
                    ,[ISTOTALSHORTENED] = @ISTOTALSHORTENED
                    ,[ISTOTALNOSHORTENED] = @ISTOTALNOSHORTENED
                    ,[ISTOTAL2DIGIT] = @ISTOTAL2DIGIT
                    ,[ISCURRENTAGE] = @ISCURRENTAGE
                    ,[ISCURRENTYEAR] = @ISCURRENTYEAR
                    ,[ISVALUEINGREDIENTS] = @ISVALUEINGREDIENTS
                    ,[GETLAST2DIGITS] = @GETLAST2DIGITS
                    ,ISCOUNTOFNUM=@ISCOUNTOFNUM ,
                    ISNUMLETTERNOSHORTENED = @ISNUMLETTERNOSHORTENED,
                    ISNUMLETTERS2DIGIT=@ISNUMLETTERS2DIGIT,
                    ISNUMLETTERS1DIGIT=@ISNUMLETTERS1DIGIT,
                    ISTOTALVALUENOSHORTENED = @ISTOTALVALUENOSHORTENED,
                    ISTOTALVALUES2DIGIT=@ISTOTALVALUES2DIGIT,
                    ISTOTALVALUES1DIGIT=@ISTOTALVALUES1DIGIT,
                    ISTOTALFIRSTLETTERNOSHORTENED = @ISTOTALFIRSTLETTERNOSHORTENED,
                    ISTOTALFIRSTLETTER2DIGIT=@ISTOTALFIRSTLETTER2DIGIT,
                    ISTOTALFIRSTLETTER1DIGIT=@ISTOTALFIRSTLETTER1DIGIT,
                    ISTOTALLETTERSNOSHORTENED=@ISTOTALLETTERSNOSHORTENED,
                    ISTOTALLETTERS2DIGIT=@ISTOTALLETTERS2DIGIT,
                    ISTOTALLETTERS1DIGIT=@ISTOTALLETTERS1DIGIT,
                    ISAPPLYOTHER = @ISAPPLYOTHER,
                    PARAMOTHERID = @PARAMOTHERID,
                    ISYEARVIEWING = @ISYEARVIEWING
            WHERE   INGREDIENTID = @INGREDIENTID

            SELECT @INGREDIENTID AS RESULT
	END
END
GO
