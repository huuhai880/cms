import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import ProductCategoryAdd from "./ServiceAdd";

// Model(s)
import { fnGet } from "@utils/api";

/**
 * @class ServiceEdit
 */
export default class ServiceEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      ServiceEnt : null,

    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      try {
        let ID = this.props.match.params.id;
        let [ServiceEnt] = await Promise.all([
          fnGet({ url: `service/${ID}` }),
        ]);
        ServiceEnt && this.setState({ ServiceEnt});
      } catch (_) {
        setTimeout(() => window._$g.rdr("/404"));
      }
    })();
    //.end
  }

  render() {
    let { ServiceEnt} = this.state;
    // Ready?
    if (!ServiceEnt) {
      return <Loading />;
    }
    return (
      <ProductCategoryAdd
        serviceEnt={ServiceEnt}
        {...this.props}
      />
    );
  }
}
