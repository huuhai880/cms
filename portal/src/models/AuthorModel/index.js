//
import Model from '../Model';
//
import AuthorEntity from '../AuthorEntity';

// Util(s)
// import { jqxGridColumns } from '../../utils/jqwidgets';

/**
 * @class AuthorModel
 */
export default class AuthorModel extends Model {
  /**
   * @var {String} redux store::state key
   */
  _stateKeyName = 'author';

  /**
   * @var {String}
   */
  static API_AUTHOR_LIST = 'author';
  /** @var {String} */
  static API_AUTHOR_DETAIL = 'author/:id';
  /** @var {String} */
  static API_AUTHOR_OPTS = 'author/get-options';
  /** @var {String} */
  static API_AUTHOR_CHANGE_STATUS = 'author/:id/change-status';
  /** @var {String} */
  static API_EXPORT_EXCEL = 'author/export-excel';
  /** @var {String} */
  static API_AUTHOR_CHANGE_PASSWORD = 'author/:id/change-password'; // PUT
  /** @var {String} */
  static API_AUTHOR_UPLOAD = 'upload-file'
   /** @var {String} */
  static API_AUTHOR_INIT = 'author/create';
  /**
   * @var {String} Primary Key
   */
  primaryKey = 'author_id';

  /**
   * Column datafield prefix
   * @var {String}
   */
  static columnPrefix = '';
  /** @var {String} */
  static defaultImgBase64 = AuthorEntity.defaultImgBase64;

  /**
   * @return {Object}
   */
  fillable = () => ({
    "author_id": null,
    "author_name": null,
    "password": Math.random().toString(36).slice(-8),
    "nickname": null,
    "full_name": null,
    "first_name": null,
    "last_name": null,
    "avatar_image": null,
    "banner_image": null,
    "gender": "0",
    "birthday": null,
    "phone_number": null,
    "email": null,
    "introduce": null,
    "education_career": null,
    "identity_number": null,
    "identity_date": null,
    "identity_place": null,
    "identity_front_image": null,
    "identity_back_image": null,
    "address": null,
    "province_id": null,
    "province_name": null,
    "district_id": null,
    "district_name": null,
    "country_id": null,
    "country_name": null,
    "ward_id": null,
    "ward_name": null,
    "is_review_news": 1,
    "is_active": 1,
    "news_category": [],
    "author_degree": null,
    "author_quote": null,
    "order_index": 1
  });



  /**
   * Return jqx's grid columns
   * @param {Object} opts Options
   * @return {Array}
   */
  static jqxGridProps(opts) {
    let _self = new _static();

    // Get, format options
    opts = Object.assign({
      prefix: _static.columnPrefix,
      // events
      // +++ format (mapping) API data before render
      postBeforeProcessing: (data) => {
        (data.items || []).forEach((item) => {
          // Case: gender
          if ('is_active' in item) {
            item.is_active_text = window._$g._(item.is_active ? 'Đang sử dụng' : 'Tạm ngưng')
          }
          if ('is_won' in item) {
            item.is_won_text = window._$g._(item.is_won ? 'Yes' : 'No')
          }
          if ('is_lost' in item) {
            item.is_lost_text = window._$g._(item.is_lost ? 'Yes' : 'No')
          }
          // if('is_system' in item){
          //  item.is_system_text = window._$g._(item.is_system ? 'Yes' : 'No')
          //}
          //
        });
      }
    }, opts);

    //
    let props = Model.jqxGridProps(_static._jqxGridColumns, opts);
    // +++
    Object.assign(props.source, {
      url: _static.apiClass.buildApiUri(_static.API_AUTHOR_LIST),
      id: _self.primaryKey
    });

    // Return;
    return props;
  }

  /**
   *
   * @param {object} data
   */
  // constructor(data) { super(data); }

  dataList(_opts = {}) {
    // Get, format input(s)
    let opts = Object.assign({}, _opts);

    return new Promise((resolve) => {
      // Fetch data
      let dataList = super.dataList([], opts);
      // +++ Include 'Favorites'?

      // Filter?
      let { filters = {} } = opts;
      // ---
      if (Object.keys(filters).length) {
        dataList = dataList.filter((item, idx) => {
          if (filters.author_id) {
            return item.author_id === filters.author_id;
          }

          let rtn = true;
          // Filter by: fullname or tel?
          if (filters.groupname_or_description) {
            rtn = false;
            let gnOrDscLC = filters.groupname_or_description.toString().toLowerCase();
            let gnLC = item.groupname.toString().toLowerCase();
            let dscLC = item.description.toString().toLowerCase();
            if ((gnLC.indexOf(gnOrDscLC) >= 0)
              || (dscLC.indexOf(gnOrDscLC) >= 0)
            ) {
              rtn = true;
            }
          }
          return rtn;
        });
      }
      //.end

      // Return
      setTimeout(() => {
        resolve(dataList);
      }, 1e3);
    });
  }

  findOne(_opts = {}) {
    // Fetch data
    let dataList = this.dataList(_opts);

    // Filters
    return dataList[0] || null;
  }
  /**
   *
   */
  getList(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_AUTHOR_LIST, data);
  }

  /**
   * Get options (list opiton)
   * @param {Object} opts
   * @returns Promise
   */
  getOptions(opts) {
    return this._api.get(_static.API_AUTHOR_OPTS, opts);
  }

  /**
   * Get options (list opiton) for won/lost
   * @param {Object} _opts
   * @returns Promise
   */
  getOptionsWonLost(_opts = {}) {
    let optsIsWon = {
      is_won: _opts.is_won || 1
    };
    let optsIsLost = {
      is_lost: _opts.is_lost || 1
    };

    return Promise.all([
      this.getOptions(optsIsWon),
      this.getOptions(optsIsLost)
    ])
      .then(dataArr => {
        let [dataIsWon, dataIsLost] = dataArr;
        let data = [];
        dataIsWon.forEach(item => data.push({ ...item, is_won: 1 }));
        dataIsLost.forEach(item => data.push({ ...item, is_lost: 1 }));
        return data;
      });
  }

  /**
   * Get options (list opiton)
   * @returns Promise
   */
  getOptionsFull(_opts) {
    // Format options
    let opts = _opts || {};
    let apiOpts = Object.assign({
      itemsPerPage: _static._MAX_ITEMS_PER_PAGE,
      exclude_id: []
    }, opts['_api']);
    delete opts['_api'];

    //
    return this.getList(apiOpts)
      .then(({ items }) => {
        let excludeIdStr = "|" + apiOpts.exclude_id.join('|') + "|";
        let ret = (items || []).map(
          ({ user_group_id: id, user_group_name: name, description }) => {
            // Nam trong list exclude --> set null
            if (excludeIdStr.indexOf("|" + id + "|") >= 0) {
              return null;
            }
            return ({ name, id, description });
          }
        );
        // Filter null items
        return ret.filter(item => item);
      });
  }

  /**
   *
   */
  create(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, this.fillable(), _data);
    return this._api.post(_static.API_AUTHOR_LIST, data);
  }
  /**
     *
     */
  update(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.put(_static.API_AUTHOR_DETAIL.replace(':id', id), data);
  }
  /**
   *
   */
  edit(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);    //
    data.is_won = (data.order === "1") ? 1 : 0;
    data.is_lost = (data.order === "2") ? 1 : 0;
    return this._api.put(_static.API_AUTHOR_DETAIL.replace(':id', id), data);
  }
  /**
   *
   */
  changeStatus(id, _data) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.put(_static.API_AUTHOR_CHANGE_STATUS.replace(':id', id), data);
  }
  /**
   * @return {Promise}
   */
  delete(id, _data = {}) {
    // Validate data?!
    return this._api.delete(_static.API_AUTHOR_DETAIL.replace(':id', id));
  }

  /**
   *
   */
  read(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    return this._api.get(_static.API_AUTHOR_DETAIL.replace(':id', id), data)
      .then((data) => new AuthorEntity(data))
      ;
  }

  /**
   *
   */
  exportExcel(opts) {
    const header = {
      responseType: 'blob',
    }
    return this._api.get(_static.API_EXPORT_EXCEL, opts, header);
  }

  /**
 * @return {Promise}
 */
  init(_data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    // console.log('User#init: ', data);
    //
    return this._api.post(_static.API_AUTHOR_INIT, data);
  }
  /**
   * @return {Promise}
   */
  changePassword(id, _data = {}) {
    // Validate data?!
    let data = Object.assign({}, _data);
    //
    return this._api.put(_static.API_AUTHOR_CHANGE_PASSWORD.replace(':id', id), data);
  }

  /**
  *
  */
  upload(_data = {}) {
    return this._api.post(_static.API_AUTHOR_UPLOAD, _data);
  }

}
// Make alias
const _static = AuthorModel;
