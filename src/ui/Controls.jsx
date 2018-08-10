import React from 'react';
import MacroControls from './MacroControls.jsx';

class Control extends React.Component {
  render() {
    const { controlValues } = this.props;

    const labelStyle = {
      display: 'flex',
    };

    const style = {
      width: '98%',
    };

    return (
      <div className="control">
        <label style={labelStyle}>
          <span style={{ flex: 1 }}>{controlValues.name}</span>
          <span style={{ flex: 1 }}>{controlValues.degrees}</span>
        </label>
        <input
          type="range"
          min={controlValues.min}
          max={controlValues.max}
          step="0.01"
          style={style}
          value={controlValues.degrees}
          onChange={e => {
            const newValue = e.target.valueAsNumber;
            controlValues.degrees = newValue;
            this.forceUpdate();
          }}
        />
      </div>
    );
  }
}

class Controls extends React.Component {
  handlePosition = () => {
    const { robot } = this.props;
    const values = Array.from(robot.rawValues);
    console.log(values);

    window
      .fetch(`${SERVER_URL}/values`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      .then(response => {
        return response.text();
      })
      .then(text => {
        console.log('response:', text);
      });
  };

  handleMacroChanged = () => {
    this.forceUpdate();
  };

  render() {
    const { robot } = this.props;
    if (!robot.controls) {
      //simple 3d model
      return null;
    }

    const _controls = [];
    robot.controls.forEach((controlValues, key) => {
      _controls.push(<Control key={key} controlValues={controlValues} />);
    });

    const controlsStyle = {
      position: 'absolute',
      display: 'flex',
      height: '100%',
      alignItems: 'center',
    };

    return (
      <div id="control-panel" style={controlsStyle}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: 250, fontSize: 'x-large' }}>
            <button
              style={{ width: '100%', minHeight: '2em' }}
              onClick={this.handlePosition}
            >
              send position
            </button>
            {_controls}
          </div>
          <MacroControls
            robot={robot}
            onMacroChange={this.handleMacroChanged}
          />
        </div>
      </div>
    );
  }
}

export default Controls;
