SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SL_ORDER_CreateOrUpdate_AdminWeb]
    @ORDERID BIGINT = 0,
    @ORDERNO VARCHAR(100) = NULL,
    @STATUS INT = 0,
    @MEMBERID BIGINT = 0,
    @EMAIL NVARCHAR(100) = NULL,
    @PHONENUMBER VARCHAR(20) = NULL,
    @ADDRESS NVARCHAR(1000) = NULL,
    @TOTALMONEY MONEY = NULL,
    @TOTALDISCOUNT MONEY = NULL,
    @SUBTOTAL MONEY = NULL,
    @TOTALSHIPFEE MONEY = NULL,
    @ISGROWREVENUE BIT = 0,
    @CREATEDUSER NVARCHAR(100) = NULL,
    @REFERRALCODE BIGINT = NULL
AS
BEGIN

    IF(EXISTS (SELECT 1 FROM SL_ORDER WHERE ORDERID = @ORDERID AND ISDELETED = 0 AND ISACTIVE = 1))
    BEGIN
        UPDATE  SL_ORDER
        SET     UPDATEDDATE = GETDATE(),
                UPDATEDUSER  = @CREATEDUSER,
                MEMBERID = @MEMBERID,
                EMAIL = @EMAIL,
                SUBTOTAL = @SUBTOTAL,
                TOTALMONEY = @TOTALMONEY,
                TOTALDISCOUNT = @TOTALDISCOUNT,
                TOTALSHIPFEE = @TOTALSHIPFEE,
                ISGROWREVENUE = @ISGROWREVENUE,
                [STATUS] = @STATUS,
                REFERRALCODE = @REFERRALCODE
        WHERE   ORDERID = @ORDERID
        SELECT @ORDERID order_id,
               NULL order_no;
    END
    ELSE 
    BEGIN

        DECLARE @ORDERNO_TEMP AS VARCHAR(50) = NULL;
        DECLARE @ORDERNO_MAX BIGINT = NULL;
        DECLARE @BUSINESSID BIGINT = 0;
        SELECT   @ORDERNO_MAX = MAX(CAST(RIGHT(ORDERNO,3) AS BIGINT))
        FROM    SL_ORDER
        WHERE   ORDERDATE >= CAST(GETDATE() AS DATE)
        AND     ORDERDATE < CAST(GETDATE() + 1 AS DATE)

        IF(@ORDERNO_MAX IS NULL OR @ORDERNO_MAX = 0)
            SET @ORDERNO_MAX = 1
        ELSE 
            SET @ORDERNO_MAX = @ORDERNO_MAX + 1;

        SET @ORDERNO_TEMP = CONCAT('DH', FORMAT(GETDATE(), 'yyyyMMdd'), RIGHT(CONCAT('00', @ORDERNO_MAX),8))
        SET @BUSINESSID = (SELECT TOP 1 BUSINESSID FROM AM_BUSINESS WHERE ISDELETED = 0);
         
        IF(@ORDERNO <> @ORDERNO_TEMP)
            SET @ORDERNO = @ORDERNO_TEMP;

        INSERT INTO SL_ORDER
        (
            BUSINESSID,
            ORDERNO,
            BOOKINGID,
            CONTRACTID,
            TOTALMONEY,
            TOTALDISCOUNT,
            SUBTOTAL,
            TOTALVAT,
            TOTALSHIPFEE,
            ORDERNOTE,
            ORDERDATE,
            ISACTIVE,
            CREATEDDATE,
            CREATEDUSER,
            ISDELETED,
            MEMBERID,
            [STATUS],
            EMAIL,
            PAYMENTMETHODID,
            BANKID,
            BANKCODE,
            ORDERTYPE,
            ISGROWREVENUE,
            REFERRALCODE
        )
        VALUES
        (
            @BUSINESSID,
            @ORDERNO,
            0,
            0,
            @TOTALMONEY,
            @TOTALDISCOUNT,
            @SUBTOTAL,
            NULL,
            @TOTALSHIPFEE,
            N'Thêm đơn hàng từ Portal',
            GETDATE(),
            1,
            GETDATE(),
            @CREATEDUSER,
            0,
            @MEMBERID,
            @STATUS,
            @EMAIL,
            2, -- THANH TOAN TREN PORTAL
            NULL,
            NULL,
            2, --1. WEB, 2. PORTAL
            @ISGROWREVENUE,
            @REFERRALCODE
        )
        SELECT SCOPE_IDENTITY() AS order_id,
               @ORDERNO order_no;

    END
END
GO
