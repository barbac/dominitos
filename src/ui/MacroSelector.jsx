import React from 'react';
import Button from './Button.jsx';

export default class MacroSelector extends React.Component {
  handleAddMacro = () => {
    this.props.robot.addMacro();

    //Use the macro to notify controls instead??
    this.forceUpdate();
    this.props.onMacroChange();
  };

  handleRemoveMacro = () => {
    this.props.robot.removeMacro();

    this.forceUpdate();
    this.props.onMacroChange();
  };

  handleMacroChange = event => {
    this.props.robot.setMacro(Number(event.target.value));
    this.props.onMacroChange();
    this.forceUpdate();
  };

  handleSave = () => {
    this.props.robot.macro.markToSave();
    this.forceUpdate();
  };

  render() {
    return (
      <div>
        <div>
          <Button text="+" onClick={this.handleAddMacro} />
          <Button text="-" onClick={this.handleRemoveMacro} />
        </div>
        <select
          value={this.props.robot.currentMacroIndex()}
          onChange={this.handleMacroChange}
          style={{ minWidth: 100 }}
        >
          {this.props.robot.macros.map((macro, i) => (
            <option key={`${i.toString()}-${macro.save}`} value={i}>
              {/*that key is to avoid react issues after saving*/}
              {i} {!macro.save && 'not saved'}
            </option>
          ))}
        </select>
        <div>
          <button onClick={this.handleSave}>save</button>
        </div>
      </div>
    );
  }
}
