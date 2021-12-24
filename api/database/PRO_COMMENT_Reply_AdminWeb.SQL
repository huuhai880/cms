ALTER PROCEDURE PRO_COMMENT_Reply_AdminWeb
    @PRODUCTID BIGINT = NULL,
    @ISCOMBO BIT = 0,
    @COMMENTREPLYID BIGINT = 0,
    @REPLYUSER VARCHAR(20) = NULL,
    @CONTENTCOMMENT NVARCHAR(MAX) = NULL
AS
BEGIN

    INSERT INTO PRO_COMMENT
    (
        PHONENUMBER,
        EMAIL,
        USERCOMMENT,
        COMMENTREPLYID,
        CONTENTCOMMENT,
        ISACTIVE,
        CREATEDUSER,
        CREATEDDATE,
        ISDELETED,
        PRODUCTID,
        COMBOID,
        FULLNAME,
        ISREVIEW,
        REVIEWUSER,
        REVIEWDATE,
        DATALEADSID,
        GENDER,
        MEMBERID,
        ISCOMBO,
        ISSTAFF
    )
    VALUES
    (
        NULL,
        NULL,
        @REPLYUSER,
        @COMMENTREPLYID,
        @CONTENTCOMMENT,
        1,
        @REPLYUSER,
        GETDATE(),
        0,
        IIF(@ISCOMBO = 0, @PRODUCTID, NULL),
        IIF(@ISCOMBO = 1, @PRODUCTID, NULL),
        @REPLYUSER,
        1,
        @REPLYUSER,
        GETDATE(),
        NULL,
        1,
        NULL,
        @ISCOMBO,
        1
    ) 

    SELECT SCOPE_IDENTITY() AS product_comment_id

END