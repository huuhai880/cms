SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SL_ORDER_Init_AdminWeb]
    @ORDERID BIGINT = 0
AS
BEGIN

    DECLARE @ORDERNO AS VARCHAR(50) = NULL;
    DECLARE @ORDERNO_MAX BIGINT = NULL;

    SELECT   @ORDERNO_MAX = MAX(CAST(RIGHT(ORDERNO,3) AS BIGINT))
    FROM    SL_ORDER
    WHERE   ORDERDATE >= CAST(GETDATE() AS DATE)
    AND     ORDERDATE < CAST(GETDATE() + 1 AS DATE)

    IF(@ORDERNO_MAX IS NULL OR @ORDERNO_MAX = 0)
        SET @ORDERNO_MAX = 1
    ELSE 
        SET @ORDERNO_MAX = @ORDERNO_MAX + 1;

    SET @ORDERNO = CONCAT('DH', FORMAT(GETDATE(), 'yyyyMMdd'), RIGHT(CONCAT('00', @ORDERNO_MAX),8))

    --MA DON HANG
    SELECT @ORDERNO order_no;

    --DANH SACH KHACH HANG
    SELECT 

                CRM_ACCOUNT.MEMBERID,
                CRM_ACCOUNT.CUSTOMERCODE,
                CRM_ACCOUNT.FULLNAME,
                CRM_ACCOUNT.EMAIL,
                CRM_ACCOUNT.PHONENUMBER,
                CONCAT(CRM_ACCOUNT.CUSTOMERCODE, ' - ', CRM_ACCOUNT.FULLNAME) CUSTOMERNAME,
                STUFF(
                    case when ISNULL(CRM_ACCOUNT.ADDRESS,'') = '' then '' else ', '  + CRM_ACCOUNT.ADDRESS end
                    + case when ISNULL(MD_WARD.WARDNAME,'') = '' then '' else ', '  + MD_WARD.WARDNAME end
                    + case when ISNULL(MD_DISTRICT.DISTRICTNAME,'') = '' then '' else ', '  + MD_DISTRICT.DISTRICTNAME end
                    + case when ISNULL(MD_PROVINCE.PROVINCENAME,'') = '' then '' else ', '  + MD_PROVINCE.PROVINCENAME end
                    
                    ,1,2,'') as ADDRESS
    FROM        CRM_ACCOUNT

    LEFT JOIN   MD_PROVINCE
    ON          MD_PROVINCE.PROVINCEID = CRM_ACCOUNT.PROVINCEID
    AND         MD_PROVINCE.ISDELETED = 0
    AND         MD_PROVINCE.ISACTIVE = 1

    LEFT JOIN   MD_DISTRICT
    ON          MD_DISTRICT.DISTRICTID = CRM_ACCOUNT.DISTRICTID
    AND         MD_DISTRICT.ISACTIVE = 1
    AND         MD_DISTRICT.ISDELETED = 0

    LEFT JOIN   MD_WARD
    ON          MD_WARD.WARDID = CRM_ACCOUNT.WARDID
    AND         MD_WARD.ISACTIVE = 1
    AND         MD_WARD.ISDELETED = 0


    WHERE    CRM_ACCOUNT.ISACTIVE = 1
    AND      CRM_ACCOUNT.ISDELETED = 0

    ORDER BY   CRM_ACCOUNT.FULLNAME;


    --DANH SACH SAN PHAM
    SELECT 
                MD_PRODUCT.PRODUCTID,
                MD_PRODUCT.PRODUCTNAME,
                NULL COMBOID,
                0 ISCOMBO,
                CONCAT(MD_PRODUCT.PRODUCTID, '_', '0') TEMPID,

                CASE 
                    WHEN    PRICE_PRO.FROMDATE IS NOT NULL 
                            AND PRICE_PRO.ISAPPLYPROMOTION = 1
                            AND GETDATE() >= CAST(PRICE_PRO.FROMDATE AS DATE) 
                            AND
                            (
                                PRICE_PRO.TODATE IS NULL 
                                OR PRICE_PRO.TODATE >= CAST(GETDATE() AS DATE)
                            )
                    THEN    PRICE_PRO.DISCOUNTVALUE
                ELSE  PRICE_PRO.PRICE END PRICE

    FROM        MD_PRODUCT
    JOIN        SL_PRICE AS PRICE_PRO
    ON          PRICE_PRO.PRODUCTID = MD_PRODUCT.PRODUCTID
    AND         PRICE_PRO.ISDELETED = 0
    AND         PRICE_PRO.ISACTIVE = 1

    WHERE       MD_PRODUCT.ISACTIVE = 1
    AND         MD_PRODUCT.ISDELETED = 0
    UNION
    SELECT 
                NULL PRODUCTID,
                PRO_COMBOS.COMBONAME AS PRODUCTNAME,
                PRO_COMBOS.COMBOID,
                1 ISCOMBO,
                CONCAT(PRO_COMBOS.COMBOID, '_', '1') TEMPID,
                CASE 
                        WHEN    PRICE_COMBO.FROMDATE IS NOT NULL 
                                AND PRICE_COMBO.ISAPPLYPROMOTION = 1
                                AND GETDATE() >= CAST(PRICE_COMBO.FROMDATE AS DATE) 
                                AND
                                (
                                    PRICE_COMBO.TODATE IS NULL 
                                    OR PRICE_COMBO.TODATE >= CAST(GETDATE() AS DATE)
                                )
                        THEN    PRICE_COMBO.DISCOUNTVALUE
                ELSE  PRICE_COMBO.PRICE END PRICE

    FROM        PRO_COMBOS
    JOIN        SL_PRICE AS PRICE_COMBO
    ON          PRICE_COMBO.COMBOID = PRO_COMBOS.COMBOID
    AND         PRICE_COMBO.ISDELETED = 0
    AND         PRICE_COMBO.ISACTIVE = 1
    WHERE       PRO_COMBOS.ISACTIVE = 1
    AND         PRO_COMBOS.ISDELETED = 0

    --DANH SACH SAN PHAM CUA DON HANG NEU CO
    SELECT
                SL_ORDERDETAIL.ORDERDETAILID,
                SL_ORDERDETAIL.ORDERID,
                SL_ORDERDETAIL.PRODUCTID,
                SL_ORDERDETAIL.COMBOID,
                SL_ORDERDETAIL.ISCOMBO,
                SL_ORDERDETAIL.PRICE,
                IIF(SL_ORDERDETAIL.PRODUCTID IS NOT NULL AND SL_ORDERDETAIL.PRODUCTID <> 0 ,
                    CONCAT(SL_ORDERDETAIL.PRODUCTID,'_0'),
                    CONCAT(SL_ORDERDETAIL.COMBOID,'_1')
                ) TEMPID

    FROM        SL_ORDERDETAIL

    LEFT JOIN   MD_PRODUCT
    ON          MD_PRODUCT.PRODUCTID = SL_ORDERDETAIL.PRODUCTID
    AND         MD_PRODUCT.ISACTIVE = 1
    AND         MD_PRODUCT.ISDELETED = 0
    AND         SL_ORDERDETAIL.ISCOMBO = 0

    LEFT JOIN   PRO_COMBOS
    ON          PRO_COMBOS.COMBOID = SL_ORDERDETAIL.COMBOID
    AND         PRO_COMBOS.ISDELETED = 0
    AND         PRO_COMBOS.ISACTIVE = 1
    AND         SL_ORDERDETAIL.ISCOMBO = 1

    WHERE       SL_ORDERDETAIL.ISDELETED = 0
    AND         SL_ORDERDETAIL.ORDERID = @ORDERID


END
GO
