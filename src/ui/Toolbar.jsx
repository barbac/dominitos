import React from 'react';
import settings from '../settings.js';

class Toolbar extends React.Component {
  render() {
    const style = {
      position: 'absolute',
      left: 100,
    };

    return (
      <div id="toolbar" style={style}>
        <div>
          <label>Lock camera</label>
          <input
            type="checkbox"
            checked={settings.lockCamera}
            onChange={e => {
              settings.lockCamera = !settings.lockCamera;
              this.forceUpdate();
            }}
          />
        </div>
      </div>
    );
  }
}

export default Toolbar;
