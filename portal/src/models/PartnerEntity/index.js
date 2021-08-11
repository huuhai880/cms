//
import Entity from "../Entity";

/**
 * @class PartnerEntity
 */
export default class PartnerEntity extends Entity {
  /** @var {String} Primary Key */

  primaryKey = "partner_id";

  /**
   * @param {object} data
   */
  constructor(data) {
    super(data);

    // Init
    Object.assign(
      this,
      {
        partner_id: "",
        partner_name: "",
        address: "",
        bank_account_id: "",
        bank_account_name: "",
        bank_name: "",
        bank_routing: "",
        country_id: null,
        district_id: null,
        email: "",
        fax: "",
        is_active: 1,
        open_date: "",
        phone_number: "",
        province_id: null,
        tax_id: "",
        ward_id: null,
        zip_code: "",
        ower_name: "",
        ower_email: "",
        user_name: "",
        password: "",
        ower_phone_1: "",
        ower_phone_2: "",
      },
      data
    );
  }
}
