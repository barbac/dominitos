import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from './Toolbar.jsx';
import Controls from './Controls.jsx';

function Ui({ model }) {
  return (
    <React.Fragment>
      <Toolbar />
      <Controls robot={model} />
    </React.Fragment>
  );
}

function initUi(models) {
  const activeModel = models[0];
  ReactDOM.render(<Ui model={activeModel} />, document.getElementById('ui'));
}

export default initUi;
