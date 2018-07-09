import React from 'react';
import './MacroControls.css';
import Button from './Button.jsx';
import MacroSelector from './MacroSelector.jsx';

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
    const { macro } = this.props.robot;
    macro.activeStep = index;

    this.props.onMacroChange();
  };

  handleAddStep = () => {
    const { macro } = this.props.robot;
    macro.addStep();
    this.props.onMacroChange();
  };

  handleRemoveStep = () => {
    const { macro } = this.props.robot;
    macro.removeStep();
    this.props.onMacroChange();
  };

  render() {
    const { macro } = this.props.robot;
    const style = {
      textAlign: 'center',
      marginBottom: 20,
    };

    return (
      <div>
        <div style={style}>
          <MacroSelector
            robot={this.props.robot}
            onMacroChange={this.props.onMacroChange}
          />
        </div>
        <div style={style}>
          <Button text="▶" />
          <Button text="◼" />
        </div>
        <div style={style}>
          <Button text="+" onClick={this.handleAddStep} />
          <Button text="-" onClick={this.handleRemoveStep} />
        </div>
        <div style={{ padding: 7 }}>{macro.name}</div>
        <Steps
          steps={macro.steps}
          activeStep={macro.activeStep}
          onStepClick={this.handleStepClick}
        />
      </div>
    );
  }
}

export default MacroControls;
