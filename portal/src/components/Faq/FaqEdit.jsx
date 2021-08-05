import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import FaqAdd from "./FaqAdd";

// Model(s)
import { fnGet } from "@utils/api";

/**
 * @class FaqEdit
 */
export default class FaqEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      FaqEnt : null,

    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      try {
        let ID = this.props.match.params.id;
        let [FaqEnt] = await Promise.all([
          fnGet({ url: `faq/${ID}` }),
        ]);
        FaqEnt && this.setState({ FaqEnt});
      } catch (_) {
        setTimeout(() => window._$g.rdr("/404"));
      }
    })();
    //.end
  }

  render() {
    let { FaqEnt} = this.state;
    // Ready?
    if (!FaqEnt) {
      return <Loading />;
    }
    return (
      <FaqAdd
        faqEnt={FaqEnt}
        {...this.props}
      />
    );
  }
}
