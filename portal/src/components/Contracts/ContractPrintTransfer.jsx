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
import MembershipModel from '../../models/MembershipModel';

/**
 * @class ContractPrintTransfer
 */
export default class ContractPrintTransfer extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._contractModel = new ContractModel();
    this._membershipModel = new MembershipModel();

    // Bind method(s)
    // ...

    // Init state
    this.state = {
      /** @var {Object} */
      contractEnt: null,
      /** @var {Object} */
      membership: null,
    };
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
    if (contractEnt.member_receive) {
      all.push(
        this._membershipModel.read(contractEnt.member_receive)
          .then(data => (bundle['membership'] = data))
      );
    }
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
    let {contractEnt, membership} = this.state;

    if (!contractEnt || !membership) {
      return null;
    }

    let _ = '';
    return <Print
      template="contract_transfer.html"
      data={{
        [_ = 'contract_number']: contractEnt[_],
        [_ = 'order_date']: contractEnt[_],
        [_ = 'full_name']: contractEnt[_],
        [_ = 'phone_number']: contractEnt[_],
        [_ = 'full_name_2nd']: membership.account.full_name,
        [_ = 'phone_number_2nd']: membership.account.phone_number,
        [_ = 'active_date']: contractEnt[_],
        [_ = 'start_date']: '#start_date',
        [_ = 'end_date']: '#end_date',
        [_ = 'cost_contract']: contractEnt[_],
        [_ = 'transfer_note']: contractEnt[_],
      }}
    />
  }
}
