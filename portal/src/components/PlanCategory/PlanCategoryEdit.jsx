import React, { Component } from 'react';

import Loading from '../Common/Loading';
import PlanCatecoryAdd from './PlanCategoryAdd';

import PlanCategoryModel from "../../models/PlanCategoryModel";

export default class NewsCategoryEdit extends Component {
  constructor(props) {
    super(props);

    // Init model(s)
    this._planCategoryModel = new PlanCategoryModel();

    // Init state
    this.state = {
      planCategoryEnt: null
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let planCategoryEnt = await this._planCategoryModel.read(ID)
      
        .catch(() => {
          setTimeout(() => window._$g.rdr('/404'));
        })
        ;
      planCategoryEnt && this.setState({ planCategoryEnt });
    })();
    //.end
  }

  render() {
    let {
      planCategoryEnt,
    } = this.state;
    // Ready?
    if (!planCategoryEnt) {
      return <Loading />;
    }
    return <PlanCatecoryAdd planCategoryEnt={planCategoryEnt} {...this.props} />
  }
}
