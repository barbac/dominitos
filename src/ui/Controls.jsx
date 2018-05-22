import React from 'react';

class Control extends React.Component {
  render() {
    const { settings, object } = this.props;

    const labelStyle = {
      display: 'flex',
    };

    const style = {
      width: '98%',
    };

    return (
      <div className="control">
        <label style={labelStyle}>
          <span style={{ flex: 1 }}>{settings.name}</span>
          <span style={{ flex: 1 }}>{settings.degrees}</span>
        </label>
        <input
          type="range"
          min={settings.min}
          max={settings.max}
          step="0.01"
          style={style}
          value={settings.degrees}
          onChange={e => {
            const newValue = e.target.valueAsNumber;
            settings.degrees = newValue;
            this.forceUpdate();
          }}
        />
      </div>
    );
  }
}

function Controls({ object }) {
  if (!object.controls) {
    //simple 3d model
    return null;
  }

  const _controls = [];
  object.controls.forEach((settings, key) => {
    _controls.push(<Control key={key} settings={settings} object={object} />);
  });

  const controlsStyle = {
    position: 'absolute',
    top: 400,
    width: 250,
    fontSize: 'x-large',
  };

  return (
    <div id="control-panel" style={controlsStyle}>
      {_controls}
    </div>
  );
}

export default Controls;
