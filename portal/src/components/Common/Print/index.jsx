import React, { PureComponent } from 'react';
// import { Button } from 'reactstrap';

// Assets
import './styles.scss';

/**
 * @class Print
 */
export default class Print extends PureComponent {

  constructor(props) {
    super(props);

    // Bind method(s)
    // ...

    // Init state
    // +++
    this.state = {};
  }

  handleReady = (evt) => {
    let {target} = evt;
    let win = target.contentWindow;
    let doc = win.document;
    //
    let {data = {}, onReady} = this.props;

    // Trigger
    if (onReady) {
      if (false === onReady(evt)) {
        return;
      }
    }

    // Mapping data
    let eles = doc.querySelectorAll('[data-f]');
    eles.forEach((ele) => {
      let f = ('' + ele.getAttribute('data-f')).trim();
      ele.innerHTML = data[f] || '&nbsp;';
    });

    // Auto print
    setTimeout(() => { win.print(); }, 500);
  };

  render() {
    let {template} = this.props;

    return (<div className="print-box">
      <iframe
        src={`/prints/${template}`} title="print-iframe"
        ref={ref => (this._refIframe = ref)}
        onLoad={this.handleReady}
      />
    </div>);
  }
}
// Make alias
// const _static = Print;