import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import ProductCategoryAdd from "./ProductCategoryAdd";

// Model(s)
import { fnGet } from "@utils/api";

/**
 * @class ProductCategoryEdit
 */
export default class ProductCategoryEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init state
    this.state = {
      /** @var {ProductCategoryEntity} */
      segmentEnt: null,
      /** @var {CustomerDatalead} */
      CustomerEnts: null,
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      try {
        let ID = this.props.match.params.id;
        let [ProductCategoryEnt, { data: categoryImages }] = await Promise.all([
          fnGet({ url: `product-category/${ID}` }),
          fnGet({ url: "category-image", query: { product_category_id: ID } }),
        ]);
        ProductCategoryEnt.images_url = categoryImages;
        let AttributeEnts = {};
        if (ProductCategoryEnt && ProductCategoryEnt.list_attribute) {
          ProductCategoryEnt.list_attribute.map((item) => {
            return (AttributeEnts[item.product_attribute_id] = Object.assign(
              {},
              item
            ));
          });
        }
        ProductCategoryEnt &&
          this.setState({ ProductCategoryEnt, AttributeEnts });
      } catch (_) {
        setTimeout(() => window._$g.rdr("/404"));
      }
    })();
    //.end
  }

  render() {
    let { ProductCategoryEnt, AttributeEnts } = this.state;
    // Ready?
    if (!ProductCategoryEnt) {
      return <Loading />;
    }
    return (
      <ProductCategoryAdd
        ProductCategoryEnt={ProductCategoryEnt}
        AttributeEnts={AttributeEnts}
        {...this.props}
      />
    );
  }
}
