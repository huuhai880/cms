SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[PRO_DISCOUNT_GetDetailById_AdminWeb]
    @DISCOUNTID VARCHAR(50) = NULL
AS
BEGIN
		    SELECT 
                    PDS.DISCOUNTID,
                    PDS.DISCOUNTCODE,
                    PDS.ISPERCENTDISCOUNT,
                    PDS.ISMONEYDISCOUNT,
                    PDS.DISCOUNTVALUE,
                    PDS.ISALLPRODUCT,
                    PDS.ISAPPOINTPRODUCT,
                    PDS.ISALLCUSTOMERTYPE,
                    PDS.ISAPPOINTCUSTOMERTYPE,
                    PDS.ISAPPLYOTHERDISCOUNT,
                    PDS.ISNONEREQUIREMENT,
                    PDS.ISMINTOTALMONEY,
                    PDS.VALUEMINTOTALMONEY,
                    PDS.ISMINNUMPRODUCT,
                    PDS.VALUEMINNUMPRODUCT,
                    PDS.DISCOUNTSTATUS,
                    PDS.ISACTIVE,
                    PDS.NOTE,
                    FORMAT(PDS.STARTDATE, 'dd/MM/yyyy') AS STARTDATE,
                    FORMAT(PDS.ENDDATE, 'dd/MM/yyyy') AS ENDDATE
			FROM    PRO_DISCOUNT PDS
			WHERE   PDS.DISCOUNTID = @DISCOUNTID
		
			-- lấy danh sach loại khách hàng app dụng khuyễn mãi
			SELECT 
                        PDSC.CUSTOMERTYPEID,
                        CMT.CUSTOMERTYPENAME
			FROM        PRO_DISCOUNT_CUSTOMERTYPE PDSC
			LEFT JOIN   CRM_CUSTOMERTYPE CMT
			ON          CMT.CUSTOMERTYPEID = PDSC.CUSTOMERTYPEID
			AND         CMT.ISDELETED = 0 
            AND         CMT.ISACTIVE = 1

			WHERE       PDSC.ISDELETED =0
			AND         PDSC.ISACTIVE = 1
			AND         PDSC.DISCOUNTID =@DISCOUNTID
			
			-- lấy danh sách product app dụng khuyến mãi
			SELECT 
                        PDSP.PRODUCTID,
                        PDSP.COMBOID,
                        IIF(PRO_COMBOS.COMBOID IS NOT NULL AND PRO_COMBOS.COMBOID <> 0, PRO_COMBOS.COMBONAME, PD.PRODUCTNAME) PRODUCTNAME,
                        IIF(PRO_COMBOS.COMBOID IS NOT NULL AND PRO_COMBOS.COMBOID <> 0 , 1, 0) ISCOMBO,
                        IIF(PRO_COMBOS.COMBOID IS NOT NULL AND PRO_COMBOS.COMBOID <> 0 , CONCAT(PRO_COMBOS.COMBOID, '_1') , CONCAT(PD.PRODUCTID, '_0')) TEMPID

			FROM        PRO_DISCOUNT_PRODUCT PDSP

			LEFT JOIN   MD_PRODUCT PD
			ON          PDSP.PRODUCTID = PD.PRODUCTID 
		    AND         PD.ISDELETED = 0 
			AND         PD.ISACTIVE = 1

            LEFT JOIN   PRO_COMBOS
            ON          PRO_COMBOS.COMBOID = PDSP.COMBOID
            AND         PRO_COMBOS.ISACTIVE = 1
            AND         PRO_COMBOS.ISDELETED = 0

			WHERE       PDSP.ISDELETED =0
			AND         PDSP.ISACTIVE = 1
			AND         PDSP.DISCOUNTID = @DISCOUNTID
END
GO
