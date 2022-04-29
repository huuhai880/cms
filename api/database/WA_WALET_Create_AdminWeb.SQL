CREATE PROCEDURE WA_WALET_Create_AdminWeb
    @MEMBERID BIGINT = 0,
    @CREATEDUSER VARCHAR(50) = NULL
AS 
BEGIN

    INSERT INTO WA_WALET
    (
        MEMBERID,
        AVAILABLEBALANCE,
        TOTALACCUMULATEDMONEY,
        TOTALWITHDRAW,
        ISACTIVE,
        CREATEDDATE,
        CREATEDUSER,
        ISDELETED
    )
    VALUES 
    (
        @MEMBERID,
        0,
        0,
        0,
        1,
        GETDATE(),
        @CREATEDUSER,
        0
    )

END