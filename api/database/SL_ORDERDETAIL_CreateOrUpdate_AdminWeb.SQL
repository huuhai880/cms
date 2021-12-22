SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SL_ORDERDETAIL_CreateOrUpdate_AdminWeb]
    @MEMBERID BIGINT = 0,
    @ORDERID BIGINT = 0,
    @PRODUCTID BIGINT = NULL,
    @COMBOID BIGINT = NULL,
    @ISCOMBO BIT = 0,
    @QUANTITY INT = 0,
    @PRICE MONEY = NULL,
    @TOTALAMOUNT MONEY = NULL,
    @CREATEDUSER VARCHAR(100) = NULL
AS
BEGIN

    IF(EXISTS 
        (
            SELECT 1 FROM SL_ORDERDETAIL 
            WHERE ORDERID = @ORDERID 
            AND (
                    (
                        PRODUCTID = @PRODUCTID
                        AND @ISCOMBO = 0
                    )
                    OR (
                        COMBOID = @COMBOID
                        AND @ISCOMBO = 1
                    )
                )
        )
    )
    BEGIN
        UPDATE SL_ORDERDETAIL
        SET     ISDELETED = 0,
                DELETEDUSER = NULL,
                DELETEDDATE = NULL,
                UPDATEDUSER = @CREATEDUSER,
                UPDATEDDATE = GETDATE(),
                QUANTITY = @QUANTITY,
                PRICE = @PRICE,
                TOTALAMOUNT = @TOTALAMOUNT
        WHERE   ORDERID = @ORDERID 
        AND     (
                    (
                        PRODUCTID = @PRODUCTID
                        AND @ISCOMBO = 0
                    )
                    OR (
                        COMBOID = @COMBOID
                        AND @ISCOMBO = 1
                    )
                )   

    END
    ELSE
    BEGIN
        INSERT INTO SL_ORDERDETAIL
        (
            ORDERID,
            PRODUCTID,
            COMBOID,
            ISCOMBO,
            QUANTITY,
            PRICE,
            TOTALAMOUNT,
            VATAMOUNT,
            CREATEDUSER,
            CREATEDDATE
        )
        VALUES
        (
            @ORDERID,
            @PRODUCTID,
            @COMBOID,
            @ISCOMBO,
            @QUANTITY,
            @PRICE,
            @TOTALAMOUNT,
            NULL,
            @CREATEDUSER,
            GETDATE()
        )
    END
END
GO
