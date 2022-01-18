SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[PRO_DISCOUNT_GetOption_AdminWeb]
AS
BEGIN
		-- option sản phẩm
		SELECT 
                PD.PRODUCTID,
                PD.PRODUCTNAME,
                NULL COMBOID,
                0 ISCOMBO,
                CONCAT(PD.PRODUCTID, '_', '0') TEMPID
		FROM    MD_PRODUCT PD
		WHERE   PD.ISACTIVE = 1
		AND     PD.ISDELETED = 0
		AND     PD.ISSHOWWEB = 1

        UNION

        SELECT  
                NULL PRODUCTID,
                PRO_COMBOS.COMBONAME PRODUCTNAME,
                PRO_COMBOS.COMBOID,
                1 ISCOMBO,
                CONCAT(PRO_COMBOS.COMBOID, '_', '1') TEMPID
        FROM    PRO_COMBOS
        WHERE   PRO_COMBOS.ISDELETED = 0
        AND     PRO_COMBOS.ISACTIVE = 1

		
		-- option loại khách hàng
        SELECT 
                CRC.CUSTOMERTYPEID,
                CRC.CUSTOMERTYPENAME
		FROM    CRM_CUSTOMERTYPE CRC
		WHERE   CRC.ISACTIVE = 1
		AND     CRC.ISDELETED = 0
		
END
GO
