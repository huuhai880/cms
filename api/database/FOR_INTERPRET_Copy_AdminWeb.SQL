SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[FOR_INTERPRET_Copy_AdminWeb]
    @INTERPRETIDCOPY AS BIGINT  = NULL,
    @ATTRIBUTEID AS BIGINT  = NULL,
    @MAINNUMBERID AS BIGINT  = NULL,
    @FORMULAID AS BIGINT  = NULL,
    @RELATIONSHIPID AS BIGINT  = NULL,
    @COMPARENUM AS BIGINT  = NULL,
    @DESCRIPTION AS nvarchar(2000) = NULL,
    @ORDERINDEX as int =null,
    @BRIEFDESCRIPTION AS nvarchar(2000) = NULL,
    @NOTE AS nvarchar(2000) = NULL,
    @ISACTIVE AS bit = NULL,
    @ISMASTER AS bit = NULL,
    @CREATEDUSER AS nvarchar(100) = NULL,
    @ISFORPOWERDIAGRAM AS BIT = 0,
		    @ISINTERPRETSPECIAL AS BIT = 0,
    @COMPAREATTRIBUTEID BIGINT = 0,
    @ISCONDITIONOR BIT = 0
AS
BEGIN

    DECLARE @INTERPRETID AS BIGINT = 0;

    INSERT INTO FOR_INTERPRET
    (
            ATTRIBUTEID,
            MAINNUMBERID,
            RELATIONSHIPID,
						ISINTERPRETSPECIAL,
            COMPARENUM,
            FORMULAID,
            ISMASTER,
            ISACTIVE,
            ORDERINDEX,
            DESCRIPTION,
            BRIEFDESCRIPTION,
            NOTICE,
            CREATEDUSER,
            CREATEDDATE,
            ISDELETED,
            ISFORPOWERDIAGRAM,
            COMPAREATTRIBUTEID,
            ISCONDITIONOR
        )
        VALUES
        (
            @ATTRIBUTEID,
			@MAINNUMBERID,
			@RELATIONSHIPID,
			@ISINTERPRETSPECIAL,
            @COMPARENUM,
			1,
			@ISMASTER,
			@ISACTIVE,
			@ORDERINDEX,
            @DESCRIPTION,
            @BRIEFDESCRIPTION,
			@NOTE,
            @CREATEDUSER,
            GETDATE(),
            0,
            @ISFORPOWERDIAGRAM,
            @COMPAREATTRIBUTEID,
            @ISCONDITIONOR
        )

        SET @INTERPRETID = SCOPE_IDENTITY();

        --INSERT DETAIL
        INSERT INTO FOR_INTERPRETDETAIL
        (
                INTERPRETID,
                INTERPRETDETAILNAME,
                NOTICE,
                PARENTID,
                ISACTIVE,
                CREATEDDATE,
                CREATEDUSER,
                ISDELETED,
                UPDATEDDATE,
                UPDATEDUSER,
                DELETEDDATE,
                DELETEDUSER,
                SHORTCONTENT,
                FULLCONTENT,
                ORDERINDEX
        )
        SELECT 
                @INTERPRETID,
                INTERPRETDETAILNAME,
                NOTICE,
                NULL,
                ISACTIVE,
                CREATEDDATE,
                CREATEDUSER,
                ISDELETED,
                UPDATEDDATE,
                UPDATEDUSER,
                DELETEDDATE,
                DELETEDUSER,
                SHORTCONTENT,
                FULLCONTENT,
                ORDERINDEX
        FROM    FOR_INTERPRETDETAIL   
        WHERE   INTERPRETID = @INTERPRETIDCOPY     

        SELECT @INTERPRETID AS interpret_id 

END
GO
