import React, { PureComponent } from "react";

// Component(s)
import Loading from "../Common/Loading";
import AttributesAdd from "./AttributesAdd";

// Model(s)
import AttributesModel from "../../models/AttributesModel";
import { mapDataOptions4Select } from "../../utils/html";

/**
 * @class AttributesEdit
 */
export default class AttributesEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._attributesModel = new AttributesModel();

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
      let AttributesEnt = await this._attributesModel.read(ID).catch(() => {
        setTimeout(() => window._$g.rdr("/404"));
      });
      let OptsPartner = await this._attributesModel.getOptionPartner({
        is_active: 1,
      });
      AttributesEnt.list_attributes_image =
        AttributesEnt &&
        AttributesEnt.list_attributes_image.map((item) => {
          item.partner_id = OptsPartner.filter((items) => {
            return items.id === item.partner_id;
          });
          item.partner_id =
            item.partner_id &&
            Object.assign(
              {},
              {
                ...item.partner_id[0],
                value: item.partner_id[0].id,
                label: item.partner_id[0].name,
              }
            );
          return item;
        });
      AttributesEnt = Object.assign(
        {},
        {
          ...AttributesEnt,
          attributes_group_id: {
            value: AttributesEnt.attributes_group_id,
            label: AttributesEnt.group_name,
          },
          main_number_id: {
            value: AttributesEnt.main_number_id,
            label: AttributesEnt.main_number,
          },
        }
      );
      AttributesEnt && this.setState({ AttributesEnt });
    })();
    //.end
  }

  render() {
    let { AttributesEnt } = this.state;

    // Ready?
    if (!AttributesEnt) {
      return <Loading />;
    }

    return <AttributesAdd AttributesEnt={AttributesEnt} {...this.props} />;
  }
}
