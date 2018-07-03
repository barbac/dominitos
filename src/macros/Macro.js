export default class Macro {
  name = '';
  id = null;
  _activeStep = 0;
  steps = [new Map(), new Map()]; //2 empty steps by default.
  onStepChanged = null;
  controls = new Set();
  save = false;

  constructor(name) {
    this.name = name;
  }

  registerControl(func) {
    this.controls.add(func);
  }

  get activeStep() {
    return this._activeStep;
  }

  set activeStep(index) {
    this._activeStep = index;
    for (const func of this.controls) {
      func();
    }
  }

  get(controlName) {
    const stepValues = this.steps[this.activeStep];
    return stepValues ? stepValues.get(controlName) : null;
  }

  set(controlName, value) {
    this.steps[this.activeStep].set(controlName, value);
  }

  markToSave() {
    this.save = true;
  }
}
