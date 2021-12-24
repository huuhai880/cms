CREATE PROCEDURE PRO_COMMENT_GetListReplyByIds_AdminWeb
    @PRODUCTCOMMENTIDS VARCHAR(2000) = NULL,
    @KEYWORD NVARCHAR(2000) = NULL
AS
BEGIN
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
                        PRO_COMMENT.EMAIL

            FROM        PRO_COMMENT

            LEFT JOIN   CRM_ACCOUNT
            ON          CRM_ACCOUNT.MEMBERID = PRO_COMMENT.MEMBERID 
            AND         CRM_ACCOUNT.ISDELETED = 0
            AND         CRM_ACCOUNT.ISACTIVE = 1

            WHERE       PRO_COMMENT.ISDELETED = 0
            AND         PRO_COMMENT.ISACTIVE = 1
            AND         PRO_COMMENT.ISREVIEW = 1
            AND         PRO_COMMENT.COMMENTREPLYID IN (SELECT CAST(ITEM AS BIGINT) FROM dbo.F_STRINGLIST_TO_TABLE(@PRODUCTCOMMENTIDS, ','))

            ORDER BY    PRO_COMMENT.CREATEDDATE DESC

END