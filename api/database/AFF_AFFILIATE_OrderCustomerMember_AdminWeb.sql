SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[AFF_AFFILIATE_OrderCustomerMember_AdminWeb]
    @MEMBERID BIGINT = 2,
    @MONTH VARCHAR(20) = NULL,
    @TYPE VARCHAR(30) = 'member' ,
    @PAGEINDEX INT = 1,
    @PAGESIZE INT = 25
AS 
BEGIN

    DECLARE @MONTH_D AS DATETIME = GETDATE();
    IF(ISNULL(@MONTH,'') <> '') SET @MONTH_D = TRY_CONVERT(DATETIME, @MONTH, 103);

    DECLARE @FIRSTDATEOFMONTH DATETIME, @LASTDATEOFMONTH DATETIME

    SET @FIRSTDATEOFMONTH = (SELECT CONVERT(DATE,DATEADD(dd,-(DAY(@MONTH_D)-1),@MONTH_D)) )
    SET @LASTDATEOFMONTH = (SELECT DATEADD(s,-1,DATEADD(mm,DATEDIFF(m,0,@MONTH_D)+1,0))) 
  

    IF(@TYPE = 'order')
    BEGIN
        
        SELECT 
                COUNT(1) OVER() AS TOTALITEMS,
                SL_ORDER.MEMBERID,
                SL_ORDER.COMISSIONVALUE,
                SL_ORDER.ORDERDATEVIEW,
                SL_ORDER.ORDERID,
                SL_ORDER.ORDERNO,
                SL_ORDER.TOTALMONEY,
                SL_ORDER.ORDERDATE,
                CONCAT(CRM_ACCOUNT.CUSTOMERCODE, ' - ', CRM_ACCOUNT.FULLNAME) FULLNAME,
                N'Đã hoàn thành' STATUS

        FROM 
        (
            SELECT 
            
                    SL_ORDER.MEMBERID,
                    (SL_ORDER.TOTALMONEY) * (AFF_COMISSION_DETAIL.COMISSIONVALUE/100) COMISSIONVALUE,
                    FORMAT(SL_ORDER.ORDERDATE, 'dd/MM/yyyy HH:mm:ss') ORDERDATEVIEW,
                    SL_ORDER.ORDERNO,
                    SL_ORDER.ORDERID,
                    SL_ORDER.TOTALMONEY, --GIA TRI DON HANG
                    SL_ORDER.ORDERDATE
            FROM    SL_ORDER

            JOIN    AFF_COMISSION_DETAIL
            ON      AFF_COMISSION_DETAIL.ORDERID = SL_ORDER.ORDERID

            JOIN    AFF_CONDITION
            ON      AFF_COMISSION_DETAIL.CONDITIONID =  AFF_COMISSION_DETAIL.CONDITIONID
            AND     AFF_CONDITION.ISACTIVE = 1
            AND     AFF_CONDITION.ISDELETED = 0
            AND     AFF_CONDITION.ISPERSONALSALES = 1

            WHERE   SL_ORDER.[STATUS] = 1
            AND     SL_ORDER.REFERRALCODE = @MEMBERID
            AND     SL_ORDER.ORDERDATE >= @FIRSTDATEOFMONTH
            AND     SL_ORDER.ORDERDATE < @LASTDATEOFMONTH
            AND     EXISTS (
                                SELECT  1 
                                FROM    AFF_COMISSION
                                WHERE   AFF_COMISSION.MEMBERID = @MEMBERID
                                AND     AFF_COMISSION.ISACTIVE = 1
                                AND     AFF_COMISSION.ISCURRENT = 1
                                AND     AFF_COMISSION.ISAPPLY = 0
                                AND     AFF_COMISSION.MONTH = MONTH(GETDATE())
                                AND     AFF_COMISSION.YEAR = YEAR(GETDATE())
                                AND     AFF_COMISSION.COMISSIONID = AFF_COMISSION_DETAIL.COMISSIONID
                            )

            UNION ALL

            --DA CHOT TRONG THANG NEU CO
            SELECT 
                
                    SL_ORDER.MEMBERID,
                    (SL_ORDER.TOTALMONEY) * (AFF_COMISSION_DETAIL.COMISSIONVALUE/100) COMISSIONVALUE,
                    FORMAT(SL_ORDER.ORDERDATE, 'dd/MM/yyyy HH:mm:ss') ORDERDATEVIEW,
                    SL_ORDER.ORDERNO,
                    SL_ORDER.ORDERID,
                    SL_ORDER.TOTALMONEY, --GIA TRI DON HANG
                    SL_ORDER.ORDERDATE

            FROM    SL_ORDER

            JOIN    AFF_COMISSION_DETAIL
            ON      AFF_COMISSION_DETAIL.ORDERID = SL_ORDER.ORDERID

            JOIN    AFF_CONDITION
            ON      AFF_COMISSION_DETAIL.CONDITIONID =  AFF_COMISSION_DETAIL.CONDITIONID
            AND     AFF_CONDITION.ISACTIVE = 1
            AND     AFF_CONDITION.ISDELETED = 0
            AND     AFF_CONDITION.ISPERSONALSALES = 1

            WHERE   SL_ORDER.[STATUS] = 1
            AND     SL_ORDER.REFERRALCODE = @MEMBERID
            AND     SL_ORDER.ORDERDATE >= @FIRSTDATEOFMONTH
            AND     SL_ORDER.ORDERDATE < @LASTDATEOFMONTH
            AND     EXISTS (
                                SELECT  1 
                                FROM    AFF_COMISSION
                                WHERE   AFF_COMISSION.MEMBERID = @MEMBERID
                                AND     AFF_COMISSION.ISAPPLY = 1
                                AND     AFF_COMISSION.MONTH = MONTH(@MONTH_D)
                                AND     AFF_COMISSION.YEAR = YEAR(@MONTH_D)
                                AND     AFF_COMISSION.COMISSIONID = AFF_COMISSION_DETAIL.COMISSIONID
                            )
        ) AS SL_ORDER
        JOIN        CRM_ACCOUNT
        ON          CRM_ACCOUNT.MEMBERID = SL_ORDER.MEMBERID
        AND         CRM_ACCOUNT.ISDELETED = 0
        AND         CRM_ACCOUNT.ISACTIVE = 1

        ORDER BY    SL_ORDER.ORDERDATE DESC 
        OFFSET      (@PAGEINDEX -1)* @PAGESIZE ROWS
	    FETCH NEXT  @PAGESIZE ROWS ONLY
    END
    ELSE IF(@TYPE = 'customer')
    BEGIN
        SELECT      
                    CRM_ACCOUNT.MEMBERID,
                    CRM_ACCOUNT.CUSTOMERCODE,
                    CONCAT(CRM_ACCOUNT.CUSTOMERCODE, ' - ', CRM_ACCOUNT.FULLNAME) FULLNAME,
                    CRM_ACCOUNT.EMAIL,
                    CRM_ACCOUNT.PHONENUMBER,
                    FORMAT(CRM_ACCOUNT.CREATEDDATE, 'dd/MM/yyyy') CREATEDDATEVIEW,
                    COUNT(1) OVER() AS TOTALITEMS
        FROM        CRM_ACCOUNT
        WHERE       CRM_ACCOUNT.ISACTIVE = 1
        AND         CRM_ACCOUNT.ISDELETED = 0
        AND         CRM_ACCOUNT.REFERRALCODE = @MEMBERID
        AND         CRM_ACCOUNT.CREATEDDATE >= @FIRSTDATEOFMONTH
        AND         CRM_ACCOUNT.CREATEDDATE < @LASTDATEOFMONTH

        ORDER BY    CREATEDDATE DESC 
        OFFSET      (@PAGEINDEX -1)* @PAGESIZE ROWS
	    FETCH NEXT  @PAGESIZE ROWS ONLY
    END
    ELSE IF(@TYPE = 'member')
    BEGIN
        SELECT 
                AFF_RELATIONSHIPS.MEMBERID,
                AFF_AFFILIATE.AFFILIATEID,
                AFF_AFFILIATE.AFFILIATETYPEID,
                -- AFF_AFFILIATE.APPROVEDDATE,
                FORMAT(AFF_AFFILIATE.APPROVEDDATE, 'dd/MM/yyyy HH:mm') APPROVEDDATEVIEW,
                FORMAT(AFF_AFFILIATE.REGISTRATIONDATE, 'dd/MM/yyyy HH:mm') REGISTRATIONDATEVIEW,
                AFF_AFFILIATE.REGISTRATIONSOURCE,
                CONCAT(CRM_ACCOUNT.CUSTOMERCODE, ' - ', CRM_ACCOUNT.FULLNAME) FULLNAME,
                CRM_ACCOUNT.CUSTOMERCODE,
                CRM_ACCOUNT.IMAGEAVATAR,
                AFF_COMISSION.COMISSIONVALUE,
                AFF_COMISSION.TOTALREVENUE,
                COUNT(1) OVER() AS TOTALITEMS

        FROM    AFF_RELATIONSHIPS

        JOIN    AFF_AFFILIATE
        ON      AFF_RELATIONSHIPS.MEMBERID = AFF_AFFILIATE.MEMBERID
        AND     AFF_AFFILIATE.ISACTIVE = 1
        AND     AFF_AFFILIATE.ISDELETED = 0

        JOIN    CRM_ACCOUNT
        ON      CRM_ACCOUNT.MEMBERID = AFF_AFFILIATE.MEMBERID
        AND     CRM_ACCOUNT.ISACTIVE = 1
        AND     CRM_ACCOUNT.ISDELETED = 0

        OUTER APPLY (
                SELECT 
                        SUM(COMISSIONVALUE) COMISSIONVALUE,
                        SUM(TOTALREVENUE) TOTALREVENUE
                FROM    AFF_COMISSION
                WHERE   AFF_COMISSION.MEMBERID = AFF_RELATIONSHIPS.MEMBERID
                AND     AFF_COMISSION.MONTH = MONTH(@MONTH_D)
                AND     AFF_COMISSION.YEAR = YEAR(@MONTH_D)
                AND     (
                            AFF_COMISSION.ISAPPLY = 1
                            OR (
                                AFF_COMISSION.ISCURRENT = 1
                                AND AFF_COMISSION.ISACTIVE = 1
                                AND AFF_COMISSION.ISAPPLY = 0
                            )
                        )
        ) AS AFF_COMISSION
        
        WHERE       AFF_RELATIONSHIPS.REFMEMBERID = @MEMBERID --LEADER
        AND         AFF_RELATIONSHIPS.[LEVEL] = 2
        ORDER BY    AFF_AFFILIATE.REGISTRATIONDATE
        OFFSET      (@PAGEINDEX -1)* @PAGESIZE ROWS
	    FETCH NEXT  @PAGESIZE ROWS ONLY
    END

END
GO
