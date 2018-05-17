import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from './Toolbar.jsx';
import Controls from './Controls.jsx';

function Ui({ object }) {
  return (
    <React.Fragment>
      <Toolbar />
      <Controls object={object} />
    </React.Fragment>
  );
}

function initUi(objects) {
  const activeObject = objects[0];
  if (!activeObject.controls) {
    //simple 3d model
    return;
  }
  ReactDOM.render(<Ui object={activeObject} />, document.getElementById('ui'));
}

export default initUi;
