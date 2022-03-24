import Model from "../Model";
export default class ProductPage extends Model {
    static API_PRODUCT_PAGE_LIST = "product-page";
    static API_PRODUCT_PAGE_LIST_INTERPRET = "product-page/:id";

    getListProductPage(_data = {}) {
        let data = Object.assign({}, _data);
        return this._api.get(_static.API_PRODUCT_PAGE_LIST, data);
    }
    getListInterPertProductPage(id) {
        return this._api.get(_static.API_PRODUCT_PAGE_LIST_INTERPRET.replace(':id', id));
    }

    getListInterpretSpecial(){
        return this._api.get('/product-page/interpret-special')
    }

    getListInterpretSpecialPaging(filter){
        return this._api.get('/product-page/interpret-special/paging', filter)
    }
}
const _static = ProductPage;
