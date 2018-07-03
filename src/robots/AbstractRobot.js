import Macro from '../macros/Macro.js';
import RotationControlValues from './controlValues.js';

export default class AbstractRobot {
  name = 'AbstractRobot';
  machineName = 'AbstractRobot';
  model = null;
  dimensions = {};
  macros = [];
  macro = null;
  controlValues = null;
  controls = new Map();

  constructor(controllerRobot = false) {
    this.controlValues = RotationControlValues;
    if (controllerRobot) {
      this.macro = new Macro('default macro');
      this.macros.push(this.macro);
    }
    this.init();
  }

  init() {
    throw 'Not implemented';
  }

  addControl(object3D, name, property) {
    const control = new this.controlValues(
      object3D,
      name,
      property,
      this.macro
    );
    this.controls.set(name, control);
    return control;
  }

  mergeControls(robot) {
    if (!robot.controls) {
      return;
    }

    for (const [name, control] of robot.controls.entries()) {
      control.macro = this.macro;
      this.controls.set(name, control);
    }
  }

  addMacro() {
    this.macros.push(new Macro('new macro'));
  }

  setMacro(index) {
    this.macro = this.macros[index];
    for (const control of this.controls.values()) {
      control.macro = this.macro;
    }
  }
}
