CREATE PROCEDURE MD_PAGE_CreateOrUpdate_AdminWeb
    @PAGEID BIGINT = 0,
    @PAGENAME NVARCHAR(250) = NULL,
    @PAGETYPE INT = 0,
    @DESCRIPTION NVARCHAR(MAX) = NULL,
    @SHORTDESCRIPTION NVARCHAR(MAX) = NULL,
    @BACKGROUNDURL VARCHAR(500) = NULL,
    @ISACTIVE BIT = 1,
    @CREATEDUSER VARCHAR(100) = NULL
AS
BEGIN
    IF(EXISTS (SELECT 1 FROM MD_PAGE WHERE PAGEID = @PAGEID AND ISDELETED = 0))
    BEGIN
        UPDATE  MD_PAGE
        SET     PAGENAME = @PAGENAME,
                PAGETYPE = @PAGETYPE,
                [DESCRIPTION] = @DESCRIPTION,
                SHORTDESCRIPTION = @SHORTDESCRIPTION,
                ISACTIVE = @ISACTIVE,
                BACKGROUNDURL = @BACKGROUNDURL,
                UPDATEDDATE = GETDATE(),
                UPDATEDUSER = @CREATEDUSER
        WHERE   PAGEID = @PAGEID

    END
    ELSE 
    BEGIN

        INSERT INTO MD_PAGE
        (
            PAGENAME,
            PAGETYPE,
            [DESCRIPTION],
            SHORTDESCRIPTION, 
            BACKGROUNDURL,
            ISACTIVE,
            CREATEDDATE,
            CREATEDUSER,
            ISDELETED
        )
        VALUES
        (
            @PAGENAME,
            @PAGETYPE,
            @DESCRIPTION,
            @SHORTDESCRIPTION, 
            @BACKGROUNDURL,
            @ISACTIVE,
            GETDATE(),
            @CREATEDUSER,
            0
        )
    END
END