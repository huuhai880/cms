SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CRM_MEMBERSHIPS_Create_AdminWeb]
    @ORDERID BIGINT = 0,
    @CREATEDUSER VARCHAR(100) = NULL
AS
BEGIN

    INSERT INTO CRM_MEMBERSHIPS
    (
            MEMBERID,
            BUSINESSID,
            MEMBERSHIPGROUPID,
            STARTDATE,
            ENDDATE,
            TOTALVALUES,
            [DESCRIPTION],
            NOTE,
            ISACTIVE,
            ISDELETED,
            CREATEDDATE,
            CREATEDUSER,
            NUMBERREQUEST,
            ISNUMBERREQUEST,
            PRODUCTID,
            COMBOID
    )
    SELECT 
            SL_ORDER.MEMBERID,
            1,
            1,
            GETDATE(),
            GETDATE(),
            1,
            N'Thêm từ Portal',
            N'Được thêm khi thanh toán đơn hàng trên Portal',
            1,
            0,
            GETDATE(),
            @CREATEDUSER,
            1,
            1,
            SL_ORDERDETAIL.PRODUCTID,
            SL_ORDERDETAIL.COMBOID
    FROM    SL_ORDERDETAIL
    JOIN    SL_ORDER
    ON      SL_ORDERDETAIL.ORDERID = SL_ORDER.ORDERID
    WHERE   SL_ORDERDETAIL.ORDERID = @ORDERID
    AND     SL_ORDERDETAIL.ISDELETED = 0
    AND     SL_ORDER.ISDELETED = 0;
    
END
GO
