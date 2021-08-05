import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import ProductAdd from "./ProductAdd";

// Model(s)
import { fnGet } from "@utils/api";

/**
 * @class ProductEdit
 */
export default class ProductEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)

    // Init state
    this.state = {
      /** @var {ProductEntity} */
      productEnt: null,
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      try {
        let [productEnt, { data: productImages }] = await Promise.all([
          fnGet({ url: `product/${ID}` }),
          fnGet({ url: "product-image", query: { product_id: ID } }),
        ]);
        productEnt.pictures = productImages;
        this.setState({ productEnt });
      } catch (_) {
        setTimeout(() => window._$g.rdr("/404"));
      }
    })();
    //.end
  }

  render() {
    let { productEnt } = this.state;

    // Ready?
    if (!productEnt) {
      return <Loading />;
    }
    return <ProductAdd productEnt={productEnt} {...this.props} />;
  }
}
