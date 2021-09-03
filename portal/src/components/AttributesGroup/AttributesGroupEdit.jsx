import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import AttributesGroupAdd from "./AttributesGroupAdd";

// Model(s)
import AttributesGroupModel from "../../models/AttributesGroupModel";

/**
 * @class AttributesGroupEdit
 */
export default class AttributesGroupEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._attributesGroupModel = new AttributesGroupModel();

    // Init state
    this.state = {
      /** @var {ReviewEntity} */
      attributesGroupEnt: null,
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let attributesGroupEnt = await this._attributesGroupModel.read(ID).catch(() => {
        setTimeout(() => window._$g.rdr("/404"));
      });
        attributesGroupEnt && this.setState({ attributesGroupEnt });
    })();
    //.end
  }

  render() {
    let { attributesGroupEnt } = this.state;

    // Ready?
    if (!attributesGroupEnt) {
      return <Loading />;
    }

    return <AttributesGroupAdd attributesGroupEnt={attributesGroupEnt} {...this.props} />;
  }
}
