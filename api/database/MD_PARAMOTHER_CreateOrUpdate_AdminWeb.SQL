CREATE PROCEDURE MD_PARAMOTHER_CreateOrUpdate_AdminWeb
    @PARAMOTHERID BIGINT = 0,
    @NAMETYPE NVARCHAR(500) = NULL,
    @ISHOUSENUMBER BIT = 0,
    @ISPHONENUMBER BIT = 0,
    @ISLICENSEPLATE BIT = 0,
    @ISACTIVE BIT = 1,
    @CREATEDUSER VARCHAR(100) = NULL
AS
BEGIN

        IF(EXISTS (SELECT 1 FROM MD_PARAMOTHER WHERE PARAMOTHERID = @PARAMOTHERID AND ISDELETED = 0))
        BEGIN
            UPDATE  MD_PARAMOTHER
            SET     UPDATEDDATE = GETDATE(),
                    UPDATEDUSER = @CREATEDUSER,
                    NAMETYPE = @NAMETYPE,
                    ISHOUSENUMBER = @ISHOUSENUMBER,
                    ISPHONENUMBER = @ISPHONENUMBER,
                    ISLICENSEPLATE = @ISLICENSEPLATE,
                    ISACTIVE = @ISACTIVE
            WHERE   PARAMOTHERID = @PARAMOTHERID
            SELECT @PARAMOTHERID AS param_other_id
        END
        ELSE 
        BEGIN
            INSERT INTO MD_PARAMOTHER
            (
                NAMETYPE,
                ISHOUSENUMBER,
                ISPHONENUMBER,
                ISLICENSEPLATE,
                ISACTIVE,
                CREATEDDATE, 
                CREATEDUSER,
                ISDELETED
            )
            VALUES
            (
                @NAMETYPE,
                @ISHOUSENUMBER,
                @ISPHONENUMBER,
                @ISLICENSEPLATE,
                @ISACTIVE,
                GETDATE(), 
                @CREATEDUSER,
                0
            )

            SELECT SCOPE_IDENTITY() AS param_other_id
        END
END