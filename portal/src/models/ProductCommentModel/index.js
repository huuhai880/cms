import Model from "../Model";

export default class ProductCommentModel extends Model {
  getList(_data = {}) {
    return this._api.get('/product-comment', _data);
  }

  delete(product_comment_id) {
    return this._api.delete(`/product-comment/${product_comment_id}`);
  }

  review(product_comment_id, is_review) {
    return this._api.put(`/product-comment/${product_comment_id}`, { is_review });
  }

  reply(values) {
    return this._api.post(`/product-comment`, values);
  }
}