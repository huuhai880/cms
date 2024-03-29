SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[PRO_COMMENT_GetList_AdminWeb]
    @PRODUCTID BIGINT = 0,
    @ISCOMBO BIT = 0,
    @KEYWORD NVARCHAR(1000) = NULL,
    @FROMDATE VARCHAR(20) = NULL,
    @TODATE VARCHAR(20) = NULL,
    @ISREVIEW INT = 2,
    @ISDELETED INT = 2,
    @PAGEINDEX INT = 1,
    @PAGESIZE INT = 25

AS
BEGIN
        DECLARE @FROMDATE_S AS DATETIME = NULL;
        DECLARE @TODATE_S AS DATETIME = NULL;

        IF(@FROMDATE IS NOT NULL AND @FROMDATE <> '') SET @FROMDATE_S = TRY_CONVERT(DATETIME, @FROMDATE, 103);
        IF(@TODATE IS NOT NULL AND @TODATE <> '') SET @TODATE_S = TRY_CONVERT(DATETIME, @TODATE_S, 103);

        SELECT 
                    PRO_COMMENT.PRODUCTCOMMENTID,
                    PRO_COMMENT.USERCOMMENT,
                    PRO_COMMENT.CONTENTCOMMENT,
                    PRO_COMMENT.COMMENTREPLYID,
                    PRO_COMMENT.ISSTAFF,
                    PRO_COMMENT.PRODUCTID,
                    PRO_COMMENT.COMBOID,
                    PRO_COMMENT.ISCOMBO,
                    PRO_COMMENT.ISREVIEW,
                    PRO_COMMENT.REVIEWDATE,
                    PRO_COMMENT.REVIEWUSER,
                    FORMAT(PRO_COMMENT.CREATEDDATE, 'dd/MM/yyyy') COMMENTDATEVIEW,
                    IIF(CRM_ACCOUNT.MEMBERID IS NULL, NULL, CRM_ACCOUNT.IMAGEAVATAR) IMAGEAVATAR,
                    PRO_COMMENT.GENDER,
                    PRO_COMMENT.EMAIL,
                    COUNT(1) OVER() AS TOTALITEMS
                   
        FROM        PRO_COMMENT

        LEFT JOIN   CRM_ACCOUNT
        ON          CRM_ACCOUNT.MEMBERID = PRO_COMMENT.MEMBERID
        AND         CRM_ACCOUNT.ISDELETED = 0
        AND         CRM_ACCOUNT.ISACTIVE = 1

        WHERE       PRO_COMMENT.ISACTIVE = 1
        AND         (@ISDELETED = 2 OR PRO_COMMENT.ISDELETED = @ISDELETED)
        AND         ISNULL(PRO_COMMENT.COMMENTREPLYID, 0) = 0

        AND         (
                        @KEYWORD IS NULL
                        OR @KEYWORD = ''
                        OR UPPER(PRO_COMMENT.CONTENTCOMMENT) LIKE '%' + UPPER(LTRIM(RTRIM(@KEYWORD))) + '%'
                        OR UPPER(PRO_COMMENT.FULLNAME) LIKE '%' + UPPER(LTRIM(RTRIM(@KEYWORD))) + '%'
                        OR EXISTS (
                                        SELECT  1 
                                        FROM    PRO_COMMENT REPLY
                                        WHERE   (@ISDELETED = 2 OR REPLY.ISDELETED = @ISDELETED)
                                        AND     REPLY.COMMENTREPLYID = PRO_COMMENT.PRODUCTCOMMENTID
                                        AND     (
                                                    UPPER(REPLY.CONTENTCOMMENT) LIKE '%' + UPPER(LTRIM(RTRIM(@KEYWORD))) + '%'
                                                    OR UPPER(REPLY.FULLNAME) LIKE '%' + UPPER(LTRIM(RTRIM(@KEYWORD))) + '%'
                                                )
                                    )
                    )

        AND         (
                        (PRO_COMMENT.PRODUCTID = @PRODUCTID AND @ISCOMBO = 0)
                        OR (PRO_COMMENT.COMBOID = @PRODUCTID AND @ISCOMBO = 1)
                    )

        AND         (@FROMDATE_S IS NULL OR PRO_COMMENT.CREATEDDATE >= @FROMDATE_S)
        AND         (@TODATE_S IS NULL OR PRO_COMMENT.CREATEDDATE < @TODATE_S + 1)
        AND         (
                        @ISREVIEW = 2 --TAT CA
                        OR (PRO_COMMENT.ISREVIEW IS NULL AND @ISREVIEW = 3) --CHUA DUYET
                        OR (PRO_COMMENT.ISREVIEW = 0 AND @ISREVIEW = 0) -- KHONG DUYET
                        OR (PRO_COMMENT.ISREVIEW = 1 AND @ISREVIEW = 1) -- DA DUYET
                    )

        ORDER BY    PRO_COMMENT.CREATEDDATE DESC 
        OFFSET      (@PAGEINDEX -1)* @PAGESIZE ROWS
        FETCH NEXT  @PAGESIZE ROWS ONLY;
END
GO
