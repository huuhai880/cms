import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import CrmReviewAdd from "./CrmReviewAdd";
import moment from "moment";

// Model(s)
import CrmReviewModel from "../../models/CrmReviewModel";

/**
 * @class CrmReviewEdit
 */
export default class CrmReviewEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._crmReviewModel = new CrmReviewModel();

    // Init state
    this.state = {
      /** @var {ReviewEntity} */
      crmReviewEnt: null,
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let crmReviewEnt = await this._crmReviewModel.read(ID).catch(() => {
        setTimeout(() => window._$g.rdr("/404"));
      });
      if (crmReviewEnt) {
        crmReviewEnt.review_date = moment(
          crmReviewEnt.review_date,
          "YYYY/MM/DD HH:mm:ss"
        ).format("DD/MM/YYYY HH:mm:ss");
      }
      crmReviewEnt && this.setState({ crmReviewEnt });
    })();
    //.end
  }

  render() {
    let { crmReviewEnt } = this.state;

    // Ready?
    if (!crmReviewEnt) {
      return <Loading />;
    }

    return <CrmReviewAdd crmReviewEnt={crmReviewEnt} {...this.props} />;
  }
}
