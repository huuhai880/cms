import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import PublishingCompanyAdd from "./PublishingCompanyAdd";

// Model(s)
import { fnGet, fnUpdate, fnPost, fnDelete } from "@utils/api";

/**
 * @class ProductEdit
 */
export default class PublishingCompanyEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)

    // Init state
    this.state = {
      /** @var {ProductEntity} */
      objectEnt: null,
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      try {
        let objectEnt = await fnGet({ url: `publishing-company/${ID}` });
        this.setState({ objectEnt });
      } catch (_) {
        setTimeout(() => window._$g.rdr("/404"));
      }
    })();
    //.end
  }

  render() {
    let { objectEnt } = this.state;

    // Ready?
    if (!objectEnt) {
      return <Loading />;
    }
    return <PublishingCompanyAdd objectEnt={objectEnt} {...this.props} />;
  }
}
