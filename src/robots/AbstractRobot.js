import _ from 'lodash';
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
      this.addMacro('default macro');
      this.macro = this.macros[0];
    }
    this.init();
    this.postInit();
  }

  init() {
    throw 'Not implemented';
  }

  postInit() {
    //set the initial step for the first macro.

    if (!this.macro) {
      return;
    }

    //read default value
    for (const [name, control] of this.controls) {
      this.macro.set(name, control.degrees);
    }
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

  addMacro(name = 'new macro') {
    const newMacro = new Macro(name);
    const lastMacro = this.macro;

    if (lastMacro && lastMacro !== newMacro) {
      //initial step should start on the last macro step.
      newMacro.steps[0] = new Map(_.last(lastMacro.steps));
    }

    this.macros.push(newMacro);
    this.setMacro(this.macros.length - 1);
  }

  setMacro(index) {
    this.macro = this.macros[index];
    console.log(index, this.macro);
    for (const control of this.controls.values()) {
      control.macro = this.macro;
    }
    this.macro.activeStep = 0; //initial state
  }

  currentMacroIndex() {
    return this.macros.indexOf(this.macro);
  }
}
