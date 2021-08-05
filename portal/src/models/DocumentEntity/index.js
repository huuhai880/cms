//
import Entity from '../Entity';

/**
 * @class DocumentEntity
 */
export default class DocumentEntity extends Entity
{
  /**
   * @var {String} Primary Key
   */
  static primaryKey = 'document_id';

  /**
   * 
   * @param {object} data 
   */
   constructor(data) {
    super(data);

    Object.assign(this, {
      /** @var {Number|String} */
      document_name: "",
    }, data);
  }
}