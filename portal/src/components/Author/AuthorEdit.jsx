import React, { PureComponent } from 'react';

// Component(s)
import Loading from '../Common/Loading';
import AuthorAdd from './AuthorAdd';

// Model(s)
import AuthorModel from "../../models/AuthorModel";

/**
 * @class AuthorEdit
 */
export default class AuthorEdit extends PureComponent {
  constructor(props) {
    super(props);

    // Init model(s)
    this._authorModel = new AuthorModel();

    // Init state
    this.state = {
      /** @var {AuthorEntity} */
      authorEnt: null
    };
  }

  componentDidMount() {
    // Fetch record data
    (async () => {
      let ID = this.props.match.params.id;
      let authorEnt = await this._authorModel.read(ID)
        .catch(() => {
          setTimeout(() => window._$g.rdr('/404'));
        })
      ;
      authorEnt && this.setState({ authorEnt });
      console.log("🚀 ~ file: AuthorEdit.jsx ~ line 37 ~ AuthorEdit ~ authorEnt", authorEnt)
    })();
    //.end
  }

  render() {
    let {
      authorEnt,
    } = this.state;

    // Ready?
    if (!authorEnt) {
      return <Loading />;
    }

    return <AuthorAdd authorEnt={authorEnt} {...this.props} />
  }
}
