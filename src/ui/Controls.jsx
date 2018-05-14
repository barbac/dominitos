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

    const value = object.values[settings.name];

    return (
      <div className="control">
        <label style={labelStyle}>
          <span style={{ flex: 1 }}>{settings.name}</span>
          <span style={{ flex: 1 }}>{value}</span>
        </label>
        <input
          type="range"
          min={settings.min}
          max={settings.max}
          style={style}
          value={value}
          onChange={e => {
            const newValue = parseInt(e.target.value);
            object.values[settings.name] = newValue;
            this.forceUpdate();
          }}
        />
      </div>
    );
  }
}

function Controls({ object }) {
  const _controls = object.controls.map((settings, i) => {
    return <Control key={i} settings={settings} object={object} />;
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
