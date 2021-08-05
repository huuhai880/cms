// import React, { PureComponent } from 'react';

// // Component(s)
// // import Loading from '../Common/Loading';
// import AuthorDetail from './AuthorDetail';

// // Model(s)
// import AuthorModel from "../../models/AuthorModel";

// /**
//  * @class AuthorDelete
//  */
// export default class AuthorDelete extends PureComponent {
//   constructor(props) {
//     super(props);

//     // Init model(s)
//     this._authorModel = new AuthorModel();

//     // Bind method(s)
//     this.handlePressBtnDelete = this.handlePressBtnDelete.bind(this);

//     // Init state
//     this.state = {
//       /** @var {Boolean} */
//       isSubmitting: false
//     };
//   }

//   handlePressBtnDelete(authorEnt) {
//     //
//     this.setState({ isSubmitting: true });
//     //
//     this._authorModel.delete(authorEnt.id())
//       .then(data => { // OK
//         window._$g.toastr.show('Xóa thành công!', 'success');
//         setTimeout(() => {
//           window._$g.rdr(-1);
//         }, 0);
//         // Chain
//         return data;
//       })
//       .catch(apiData => { // NG
//         window._$g.toastr.show('Xóa thất bại!', 'error');
//         // Submit form is done!
//         this.setState({ isSubmitting: true });
//       })
//     ;
//   }

//   render() {
//     let { isSubmitting } = this.state;
//     let props = this.props;
//     return <AuthorDetail {...props} isSubmitting={isSubmitting} deleteMode onPressBtnDelete={this.handlePressBtnDelete} />
//   }
// }

import React, { Component } from 'react';

class PlanCategoryDelete extends Component {
  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default PlanCategoryDelete;