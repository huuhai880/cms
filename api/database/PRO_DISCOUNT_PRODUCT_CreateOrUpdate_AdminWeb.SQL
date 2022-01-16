SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[PRO_DISCOUNT_PRODUCT_CreateOrUpdate_AdminWeb]
    @DISCOUNTID INT = NULL,
    @PRODUCTID INT = NULL,
    @COMBOID BIGINT = NULL,
    @ISCOMBO BIT = 0,
    @CREATEDUSER VARCHAR(20) = NULL
AS
BEGIN
		IF EXISTS(
				SELECT  1 
				FROM    PRO_DISCOUNT_PRODUCT 
				WHERE   DISCOUNTID = @DISCOUNTID
				AND     (
                            (PRODUCTID = @PRODUCTID AND @ISCOMBO = 0)
                            OR (COMBOID = @COMBOID AND @ISCOMBO = 1)
                        )
		)
		BEGIN
			UPDATE  PRO_DISCOUNT_PRODUCT 
            SET 
				    ISDELETED = 0,
				    UPDATEDDATE= GETDATE(),
				    UPDATEDUSER = @CREATEDUSER,
                    DELETEDDATE = NULL,
                    DELETEDUSER = NULL

			WHERE   DISCOUNTID = @DISCOUNTID
            AND     (
                        (PRODUCTID = @PRODUCTID AND @ISCOMBO = 0)
                        OR (COMBOID = @COMBOID AND @ISCOMBO = 1)
                    )
		END
		ELSE
		BEGIN
			INSERT INTO PRO_DISCOUNT_PRODUCT(
				DISCOUNTID,
				PRODUCTID,
				ISACTIVE,
				CREATEDUSER,
				CREATEDDATE,
                COMBOID
			) VALUES(
				@DISCOUNTID,
				@PRODUCTID,
				1,
				@CREATEDUSER,
				GETDATE(),
                @COMBOID
			)
		END
END
GO
