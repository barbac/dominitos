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
          <label>
            Lock camera (press L)
            <input
              type="checkbox"
              checked={settings.lockCamera}
              onChange={() => {
                settings.lockCamera = !settings.lockCamera;
                this.forceUpdate();
              }}
            />
          </label>
        </div>
        <div>
          <label>AWSD to move the camera.</label>
        </div>
      </div>
    );
  }
}

export default Toolbar;
