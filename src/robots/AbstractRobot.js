import _ from 'lodash';
import Macro from '../macros/Macro.js';
import RotationControlValues from './controlValues.js';

const STEP_DELTA = 1;
const stepsPerSecond = 30;
const stepTimeDelta = Math.ceil(1000 / stepsPerSecond);

export default class AbstractRobot {
  name = 'AbstractRobot';
  machineName = 'AbstractRobot';
  model = null;
  dimensions = {};
  macros = [];
  macro = null;
  controlValues = null;
  controls = new Map();
  idle = true;

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
    throw new Error('Not implemented');
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

  removeMacro() {
    const index = this.macros.lastIndexOf(this.macro);

    if (index !== 0 && index === this.macros.length - 1) {
      //change active macro since last macro will be removed.
      this.macro = this.macros[this.macros.length - 2];
    }

    this.macros.splice(index, 1);
    if (!this.macros.length) {
      this.addMacro('default macro');
      this.macro = this.macros[0];
    }
  }

  setMacro(index) {
    this.macro = this.macros[index];
    for (const control of this.controls.values()) {
      control.macro = this.macro;
    }
    this.macro.activeStep = 0; //initial state
  }

  currentMacroIndex() {
    return this.macros.indexOf(this.macro);
  }

  get rawValues() {
    return _.map([...this.controls.values()], control => control.degrees);
  }

  *playMacroGenerator() {
    for (const control of this.controls) {
      control.updateMacro = false;
    }

    //TODO: go to initial position

    for (const step of this.macro.steps) {
      for (const [name, destination] of step) {
        if (destination === undefined) {
          //the macro step doesn't control this value.
          continue;
        }

        const control = this.controls.get(name);
        const initialPosition = control.degrees;
        const delta = destination - initialPosition;
        if (!delta) {
          continue; //don't waste 1 step if no movement is needed.
        }

        const steps = Math.floor(delta / STEP_DELTA);
        const stepsCount = Math.abs(steps);
        const sign = Math.sign(steps);

        for (let i = 0; i < stepsCount; ++i) {
          control.degrees += STEP_DELTA * sign;
          // console.log(initialPosition, destination, control.degrees);
          yield;
        }
        if (delta % STEP_DELTA) {
          //the missing part.
          control.degrees = destination;
          // console.log(initialPosition, destination, control.degrees);
          yield;
        }
      }
    }

    for (const control of this.controls) {
      control.updateMacro = true;
    }

    this.idle = true;
  }

  lastTimestamp = 0;
  _simulation = null;

  playMacro() {
    this.idle = false;
    this._simulation = this.playMacroGenerator();
  }

  simulationStep(timestamp) {
    if (this.idle) {
      return;
    }

    const timeDelta = timestamp - this.lastTimestamp;
    if (timeDelta >= stepTimeDelta) {
      this._simulation.next();
      this.lastTimestamp = timestamp || 0;
    }
  }
}
