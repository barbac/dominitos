import React from 'react';

class Control extends React.Component {
  render() {
    const { options, object } = this.props;

    const labelStyle = {
      display: 'flex',
    };

    const style = {
      width: '98%',
    };

    return (
      <div className="control">
        <label style={labelStyle}>
          <span style={{ flex: 1 }}>{options.name}</span>
          <span style={{ flex: 1 }}>{options.degrees}</span>
        </label>
        <input
          type="range"
          min={options.min}
          max={options.max}
          step="0.01"
          style={style}
          value={options.degrees}
          onChange={e => {
            const newValue = e.target.valueAsNumber;
            options.degrees = newValue;
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
  object.controls.forEach((options, key) => {
    _controls.push(<Control key={key} options={options} object={object} />);
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
