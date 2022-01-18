SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SL_ORDER_GetList_AdminWeb]
    @KEYWORD NVARCHAR(1000) = NULL,
    @PRODUCTID BIGINT = NULL,
    @COMBOID BIGINT = NULL,
    @ISCOMBO BIT = 0,
    @STARTDATE VARCHAR(20) = NULL,
    @ENDDATE VARCHAR(20) = NULL,
    @FROMPRICE MONEY = 0,
    @TOPRICE MONEY = 0,
    @ORDERSTATUS INT = 2,
    @ORDERTYPE INT = 2,
    @ISDELETED INT = 0,
    @PAGESIZE INT = 10,
	@PAGEINDEX INT = 1
AS
BEGIN

        DECLARE @FROMDATE AS DATETIME = NULL;
        DECLARE @TOTDATE AS DATETIME = NULL;

        IF(@STARTDATE IS NOT NULL)
            SET @FROMDATE = TRY_CONVERT(DATETIME, @STARTDATE, 103);
        IF(@ENDDATE IS NOT NULL)
            SET @TOTDATE = TRY_CONVERT(DATETIME, @ENDDATE, 103)

        SELECT 
                    SL_ORDER.ORDERID,
                    FORMAT(SL_ORDER.ORDERDATE,'dd/MM/yyyy') ORDERDATE,
                    SL_ORDER.ORDERNO,
                    SL_ORDER.ORDERTYPE,
                    SL_ORDER.[STATUS],
                    SL_ORDER.TOTALMONEY,
                    SL_ORDER.SUBTOTAL,
                    SL_ORDER.ISGROWREVENUE,
                    CONCAT(CRM_ACCOUNT.CUSTOMERCODE,' - ', CRM_ACCOUNT.FULLNAME) AS CUSTOMERNAME,
                    SL_ORDER_DISCOUNT.DISCOUNTCODE,
                    COUNT(1) OVER() AS TOTALITEMS

        FROM        SL_ORDER
        JOIN        CRM_ACCOUNT
        ON          CRM_ACCOUNT.MEMBERID = SL_ORDER.MEMBERID
        AND         CRM_ACCOUNT.ISACTIVE = 1
        AND         CRM_ACCOUNT.ISDELETED = 0

        LEFT JOIN   SL_ORDER_DISCOUNT
        ON          SL_ORDER_DISCOUNT.ORDERID = SL_ORDER.ORDERID
        AND         SL_ORDER_DISCOUNT.ISACTIVE = 1
        AND         SL_ORDER_DISCOUNT.ISDELETED = 0


        WHERE       (
                        @KEYWORD IS NULL
                        OR @KEYWORD = ''
                        OR SL_ORDER.ORDERNO LIKE '%' + LTRIM(RTRIM(@KEYWORD)) + '%'
                        OR UPPER(CRM_ACCOUNT.FULLNAME) LIKE '%' + UPPER(LTRIM(RTRIM(@KEYWORD))) + '%'
                        OR SL_ORDER_DISCOUNT.DISCOUNTCODE LIKE '%' + LTRIM(RTRIM(@KEYWORD)) + '%'
                    )
        AND         (@ISDELETED = 2 OR SL_ORDER.ISDELETED = @ISDELETED)
        AND         (@ORDERSTATUS = 2 OR SL_ORDER.[STATUS] = @ORDERSTATUS)
        AND         (
                        @ORDERTYPE = 2 
                        OR (@ORDERTYPE = 0  AND  ISNULL(SL_ORDER.ORDERTYPE, 1) = 1) 
                        OR (@ORDERTYPE = 1 AND SL_ORDER.ORDERTYPE = 2)
                    )
        AND         (@FROMDATE IS NULL OR SL_ORDER.ORDERDATE >= @FROMDATE)
        AND         (@TOTDATE IS NULL OR SL_ORDER.ORDERDATE < @TOTDATE + 1)
        AND         (@FROMPRICE = 0 OR (SL_ORDER.TOTALMONEY >= @FROMPRICE AND @FROMPRICE > 0))
        AND         (@TOPRICE = 0 OR (SL_ORDER.TOTALMONEY <= @TOPRICE AND @TOPRICE > 0))

        AND         (
                        (@PRODUCTID IS NULL AND @COMBOID IS NULL)
                        OR (
                            EXISTS (
                                SELECT 1 
                                FROM    SL_ORDERDETAIL
                                WHERE   SL_ORDERDETAIL.ISDELETED = 0
                                AND     SL_ORDERDETAIL.ORDERID = SL_ORDER.ORDERID
                                AND     (
                                            (SL_ORDERDETAIL.COMBOID = @COMBOID AND @ISCOMBO = 1)
                                            OR (SL_ORDERDETAIL.PRODUCTID = @PRODUCTID AND @ISCOMBO = 0)
                                        )
                            )
                        )
                    )

        ORDER BY SL_ORDER.CREATEDDATE  DESC
		OFFSET (@PAGEINDEX -1)* @PAGESIZE ROWS
		FETCH NEXT @PAGESIZE ROWS ONLY;

        SELECT 
                IIF(@ORDERSTATUS = 0, 0, SUM(TOTALMONEY)) TOTALAMOUNT,
                IIF(@ORDERSTATUS = 0, 0, COUNT(1)) AS TOTALORDER,
                IIF(@ORDERSTATUS = 0, 0, SUM(TOTALQUANTITY)) AS TOTALQUANTITY
        FROM 
        (
            SELECT 
                        SL_ORDER.ORDERID,
                        SL_ORDER.TOTALMONEY,
                        SUM(SL_ORDERDETAIL.QUANTITY) TOTALQUANTITY
                        
            FROM        SL_ORDER

            JOIN        CRM_ACCOUNT
            ON          CRM_ACCOUNT.MEMBERID = SL_ORDER.MEMBERID
            AND         CRM_ACCOUNT.ISACTIVE = 1
            AND         CRM_ACCOUNT.ISDELETED = 0

            JOIN        SL_ORDERDETAIL
            ON          SL_ORDERDETAIL.ORDERID = SL_ORDER.ORDERID
            AND         SL_ORDERDETAIL.ISDELETED = 0

            LEFT JOIN   PRO_COMBOS
            ON          PRO_COMBOS.COMBOID = SL_ORDERDETAIL.COMBOID
            AND         PRO_COMBOS.ISACTIVE = 1
            AND         PRO_COMBOS.ISDELETED = 0
            
            LEFT JOIN   PRO_COMBOPRODUCT
            ON          PRO_COMBOPRODUCT.COMBOID = PRO_COMBOS.COMBOID
            AND         PRO_COMBOPRODUCT.ISACTIVE = 1 
            AND         PRO_COMBOPRODUCT.ISDELETED = 0

            LEFT JOIN   SL_ORDER_DISCOUNT
            ON          SL_ORDER_DISCOUNT.ORDERID = SL_ORDER.ORDERID
            AND         SL_ORDER_DISCOUNT.ISACTIVE = 1
            AND         SL_ORDER_DISCOUNT.ISDELETED = 0 

            WHERE       
                        (
                            @KEYWORD IS NULL
                            OR @KEYWORD = ''
                            OR SL_ORDER.ORDERNO LIKE '%' + LTRIM(RTRIM(@KEYWORD)) + '%'
                            OR UPPER(CRM_ACCOUNT.FULLNAME) LIKE '%' + UPPER(LTRIM(RTRIM(@KEYWORD))) + '%'
                            OR SL_ORDER_DISCOUNT.DISCOUNTCODE LIKE '%' + LTRIM(RTRIM(@KEYWORD)) + '%'
                        )
            AND         SL_ORDER.ISDELETED = 0
            AND         SL_ORDER.[STATUS] = 1
            AND         (
                            @ORDERTYPE = 2 
                            OR (@ORDERTYPE = 0  AND  ISNULL(SL_ORDER.ORDERTYPE, 1) = 1) 
                            OR (@ORDERTYPE = 1 AND SL_ORDER.ORDERTYPE = 2)
                        )
            AND         (@FROMDATE IS NULL OR SL_ORDER.ORDERDATE >= @FROMDATE)
            AND         (@TOTDATE IS NULL OR SL_ORDER.ORDERDATE < @TOTDATE + 1)
            AND         (@FROMPRICE = 0 OR (SL_ORDER.TOTALMONEY >= @FROMPRICE AND @FROMPRICE > 0))
            AND         (@TOPRICE = 0 OR (SL_ORDER.TOTALMONEY <= @TOPRICE AND @TOPRICE > 0))
            
            AND         ISNULL(SL_ORDER.ISGROWREVENUE, 1) = 1
            AND         (
                            (@PRODUCTID IS NULL AND @COMBOID IS NULL)
                            OR (SL_ORDERDETAIL.PRODUCTID = @PRODUCTID AND @ISCOMBO = 0)
                            OR (SL_ORDERDETAIL.COMBOID = @COMBOID AND @ISCOMBO = 1)
                        )

            GROUP BY    SL_ORDER.ORDERID,
                        SL_ORDER.TOTALMONEY
        ) AS REPORT
END
GO
