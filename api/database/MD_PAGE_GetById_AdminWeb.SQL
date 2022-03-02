CREATE PROCEDURE MD_PAGE_GetById_AdminWeb
    @PAGEID BIGINT = 0
AS
BEGIN

    SELECT 
            PAGEID,
            PAGENAME,
            PAGETYPE,
            [DESCRIPTION],
            SHORTDESCRIPTION,
            ISACTIVE,
            TITLEPAGE,
            BACKGROUND,
            BACKGROUNDURL
    FROM    MD_PAGE
    WHERE   PAGEID = @PAGEID

END