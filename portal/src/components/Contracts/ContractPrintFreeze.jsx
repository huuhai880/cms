import React, { PureComponent } from 'react';

// Assets
// ...

// Component(s)
// ...
import Print from '../Common/Print';

// Util(s)
// import {numberFormat} from "../../utils";

// Model(s)
import ContractModel from '../../models/ContractModel';

/**
 * @class ContractPrintFreeze
 */
export default class ContractPrintFreeze extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._contractModel = new ContractModel();

    // Bind method(s)
    // ...

    // Init state
    this.state = {};
  }

  componentDidMount() {
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    //.end
  }

  /**
   * Goi API, lay toan bo data lien quan,...
   */
  async _getBundleData() {
    let {match: { params }} = this.props;
    let bundle = {};
    let contractEnt = await this._contractModel.read(params.id)
      .catch(() => {
        setTimeout(() => window._$g.rdr('/404'));
      })
    ;
    Object.assign(bundle, { contractEnt });
    let all = [];
    await Promise.all(all)
      .catch(err => window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => window.location.reload()
      ))
    ;
    //
    Object.keys(bundle).forEach((key) => {
      let data = bundle[key];
      let stateValue = this.state[key];
      if (data instanceof Array && stateValue instanceof Array) {
        data = [stateValue[0]].concat(data);
      }
      bundle[key] = data;
    });
    // console.log('bundle: ', bundle);
    //
    return bundle;
  }

  render() {
    let {contractEnt} = this.state;

    if (!contractEnt) {
      return null;
    }

    let _ = '';
    return <Print
      template="contract_freeze.html"
      data={{
        [_ = 'contract_number']: contractEnt[_],
        [_ = 'order_date']: contractEnt[_],
        [_ = 'full_name']: contractEnt[_],
        [_ = 'phone_number_1st']: contractEnt[_],
        [_ = 'contract_number']: contractEnt[_],
        [_ = 'start_date_freeze']: contractEnt[_],
        [_ = 'end_date_freeze']: contractEnt[_],
        [_ = 'cost_contract']: contractEnt[_],
        [_ = 'note']: contractEnt[_],
      }}
    />
  }
}
