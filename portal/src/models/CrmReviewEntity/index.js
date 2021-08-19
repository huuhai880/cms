//
import Entity from "../Entity";

/**
 * @class CrmReviewEntity
 */
export default class CrmReviewEntity extends Entity {
  /** @var {String} Primary Key */

  primaryKey = "review_id";

  /**
   * @param {object} data
   */
  constructor(data) {
    super(data);

    // Init
    Object.assign(
      this,
      {
        review_id: "",
        member_id: "",
        author_id: "",
        order_index: "",
        review_content: "",
        review_date: "",
        is_active: 1,
      },
      data
    );
  }
}
