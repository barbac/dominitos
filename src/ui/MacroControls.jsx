import React from 'react';
import './MacroControls.css';

function Button({ text }) {
  return <span className="macro-button">{text}</span>;
}

function Steps({ steps, activeStep, onStepClick }) {
  return (
    <div className="macro-steps">
      {steps.map((step, i) => {
        return (
          <div
            className={activeStep === i ? 'active' : ''}
            onClick={() => onStepClick(i)}
            key={i}
          >
            step: {i}
          </div>
        );
      })}
    </div>
  );
}

class MacroControls extends React.Component {
  handleStepClick = index => {
    console.log('step', index);
    this.props.onStepChanged();
  };

  render() {
    const style = {
      textAlign: 'center',
      marginBottom: 20,
    };

    return (
      <div>
        <div style={style}>
          <Button text="▶" />
          <Button text="◼" />
        </div>
        <div style={style}>
          <Button text="+" />
          <Button text="-" />
        </div>
        <Steps
          steps={[0, 1]}
          activeStep={1}
          onStepClick={this.handleStepClick}
        />
      </div>
    );
  }
}

export default MacroControls;
