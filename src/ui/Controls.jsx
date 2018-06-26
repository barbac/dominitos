import React from 'react';

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
      top: 400,
      width: 500,
      fontSize: 'x-large',
    };

    return (
      <div id="control-panel" style={controlsStyle}>
        <div style={{ width: 250, fontSize: 'x-large' }}>{_controls}</div>
      </div>
    );
  }
}

export default Controls;
