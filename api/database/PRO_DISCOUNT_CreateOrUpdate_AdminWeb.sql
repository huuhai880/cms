SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[PRO_DISCOUNT_CreateOrUpdate_AdminWeb]
    @DISCOUNTID INT = NULL,
    @DISCOUNTCODE VARCHAR(250) = NULL,
    @ISPERCENTDISCOUNT BIT = NULL,
    @ISMONEYDISCOUNT BIT = NULL,
    @DISCOUNTVALUE MONEY = NULL,
    @ISALLPRODUCT INT = NULL,
    @ISAPPOINTPRODUCT INT = NULL,
    @ISALLCUSTOMERTYPE INT = NULL,
    @ISAPPOINTCUSTOMERTYPE INT = NULL,
    @ISAPPLYOTHERDISCOUNT INT = NULL,
    @ISNONEREQUIREMENT INT = NULL,
    @ISMINTOTALMONEY INT = NULL,
    @VALUEMINTOTALMONEY MONEY = NULL,
    @ISMINNUMPRODUCT INT = NULL,
    @VALUEMINNUMPRODUCT INT = NULL,
    @NOTE NVARCHAR(max) = NULL,
    @STARTDATE VARCHAR(250) = NULL,
    @ENDDATE VARCHAR(250) = NULL,
    @DISCOUNTSTATUS INT = NULL,
    @CREATEDUSER VARCHAR(250) = NULL,
    @ISACTIVE  INT = NULL
AS
BEGIN
		Declare @dSTARTDATE datetime = NULL 
		Declare @dENDDATE datetime = NULL

	    IF	@STARTDATE IS NOT NULL AND @STARTDATE <> ''
		    set @dSTARTDATE = TRY_CONVERT(datetime,@STARTDATE,103)

		IF	@ENDDATE IS NOT NULL AND @ENDDATE <> ''
		    set @dENDDATE = TRY_CONVERT(datetime,@ENDDATE,103)
		
		IF EXISTS (
			SELECT 1 FROM PRO_DISCOUNT
			WHERE ISDELETED = 0 AND ISACTIVE = 1
			AND DISCOUNTID = @DISCOUNTID
		)
		BEGIN
			UPDATE PRO_DISCOUNT 
            SET
                    DISCOUNTCODE= @DISCOUNTCODE,
                    ISPERCENTDISCOUNT = @ISPERCENTDISCOUNT,
                    ISMONEYDISCOUNT= @ISMONEYDISCOUNT,
                    DISCOUNTVALUE = @DISCOUNTVALUE,
                    ISALLPRODUCT= @ISALLPRODUCT,
                    ISAPPOINTPRODUCT = @ISAPPOINTPRODUCT,
                    ISALLCUSTOMERTYPE = @ISALLCUSTOMERTYPE,
                    ISAPPOINTCUSTOMERTYPE = @ISAPPOINTCUSTOMERTYPE,
                    ISAPPLYOTHERDISCOUNT = @ISAPPLYOTHERDISCOUNT,
                    ISNONEREQUIREMENT = @ISNONEREQUIREMENT,
                    ISMINTOTALMONEY = @ISMINTOTALMONEY,
                    VALUEMINTOTALMONEY = @VALUEMINTOTALMONEY,
                    ISMINNUMPRODUCT = @ISMINNUMPRODUCT,
                    VALUEMINNUMPRODUCT = @VALUEMINNUMPRODUCT,
                    NOTE= @NOTE,
                    STARTDATE = @dSTARTDATE,
                    ENDDATE = @dENDDATE,
                    DISCOUNTSTATUS = @DISCOUNTSTATUS,
                    ISACTIVE= @ISACTIVE,
                    UPDATEDUSER = @CREATEDUSER,
                    UPDATEDDATE = GETDATE()
			WHERE DISCOUNTID = @DISCOUNTID
			SELECT @DISCOUNTID AS RESULT
		END
		ELSE
		BEGIN
			INSERT INTO PRO_DISCOUNT
            (
				DISCOUNTCODE,
				ISPERCENTDISCOUNT,
				ISMONEYDISCOUNT,
				DISCOUNTVALUE,
				ISALLPRODUCT,
				ISAPPOINTPRODUCT,
				ISALLCUSTOMERTYPE,
				ISAPPOINTCUSTOMERTYPE,
				ISAPPLYOTHERDISCOUNT,
				ISNONEREQUIREMENT,
				ISMINTOTALMONEY,
                VALUEMINTOTALMONEY,
				ISMINNUMPRODUCT,
				VALUEMINNUMPRODUCT,
				NOTE,
				STARTDATE,
				ENDDATE,
				DISCOUNTSTATUS,
				ISACTIVE,
				CREATEDUSER,
				CREATEDDATE
			)VALUES(
				@DISCOUNTCODE,
                @ISPERCENTDISCOUNT,
                @ISMONEYDISCOUNT,
                @DISCOUNTVALUE,
                @ISALLPRODUCT,
                @ISAPPOINTPRODUCT,
                @ISALLCUSTOMERTYPE,
                @ISAPPOINTCUSTOMERTYPE,
                @ISAPPLYOTHERDISCOUNT,
                @ISNONEREQUIREMENT,
                @ISMINTOTALMONEY,
                @VALUEMINTOTALMONEY,
                @ISMINNUMPRODUCT,
                @VALUEMINNUMPRODUCT,
                @NOTE,
                @dSTARTDATE,
                @dENDDATE,
                @DISCOUNTSTATUS,
                1,
                @CREATEDUSER,
                GETDATE()
			)
			SET @DISCOUNTID=SCOPE_IDENTITY()
			SELECT @DISCOUNTID AS RESULT
			
		END
END
GO