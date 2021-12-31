CREATE PROCEDURE MD_PARAMOTHER_GetList_AdminWeb
    @KEYWORD NVARCHAR(1000) = NULL,
    @ISACTIVE INT = 2,
    @PAGEINDEX INT = 1,
    @PAGESIZE INT = 25
AS
BEGIN
        SELECT 
                    COUNT(1) OVER() AS TOTALITEMS,
                    MD_PARAMOTHER.PARAMOTHERID,
                    MD_PARAMOTHER.NAMETYPE,
                    MD_PARAMOTHER.ISHOUSENUMBER,
                    MD_PARAMOTHER.ISPHONENUMBER,
                    MD_PARAMOTHER.ISLICENSEPLATE,
                    MD_PARAMOTHER.ISACTIVE

        FROM        MD_PARAMOTHER
        WHERE       (@ISACTIVE = 2 OR MD_PARAMOTHER.ISACTIVE = @ISACTIVE)
        AND         MD_PARAMOTHER.ISDELETED = 0
        AND         (
                        @KEYWORD IS NULL 
                        OR @KEYWORD = ''
                        OR UPPER(MD_PARAMOTHER.NAMETYPE) LIKE '%' + UPPER(RTRIM(LTRIM(@KEYWORD))) + '%'
                    )

        ORDER BY    MD_PARAMOTHER.CREATEDDATE DESC
        OFFSET      (@PAGEINDEX -1)* @PAGESIZE ROWS
	    FETCH NEXT  @PAGESIZE ROWS ONLY


END
