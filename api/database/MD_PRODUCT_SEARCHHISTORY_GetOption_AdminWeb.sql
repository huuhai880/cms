CREATE PROCEDURE MD_PRODUCT_SEARCHHISTORY_GetOption_AdminWeb
AS
BEGIN
    SELECT 
            MD_PRODUCT.PRODUCTID AS value,
            MD_PRODUCT.PRODUCTNAME as label
    FROM    MD_PRODUCT
    WHERE   MD_PRODUCT.ISACTIVE = 1
    AND     MD_PRODUCT.ISDELETED = 0
    AND     NOT EXISTS 
            (
                SELECT 1 
                FROM    SL_PRICE 
                WHERE   SL_PRICE.PRODUCTID = MD_PRODUCT.PRODUCTID
                AND     SL_PRICE.ISACTIVE = 1
                AND     SL_PRICE.ISDELETED = 0
            )
END
