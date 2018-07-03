import utils from '../utils.js';

class RotationControlValues {
  name = '';
  type = 'range';
  min = 0;
  max = 180;
  axis = null;
  object3d = null;
  _macro = null;
  _degreesValue = 0;
  setRadians = null;

  constructor(object3d, name, axis, macro) {
    this.object3d = object3d;
    this.name = name;
    this.axis = axis;

    if (macro) {
      this._macro = macro;
      this.macro = macro;
    }
  }

  set macro(macro) {
    this._macro = macro;
    this._macro.registerControl(this.readValuesFromMacro);
  }

  readValuesFromMacro = () => {
    const degrees = this._macro.get(this.name);
    if (degrees === undefined) {
      //No value stored in the macro for this control.
      return;
    }
    this.degrees = this._macro.get(this.name);
  };

  set degrees(value) {
    this._degreesValue = value;
    this.radians = utils.radians(value);

    if (this._macro) {
      this._macro.set(this.name, value);
    }
  }

  get degrees() {
    return this._degreesValue;
  }

  set radians(value) {
    if (this.setRadians) {
      this.setRadians(value);
    } else {
      this.object3d.rotation[this.axis] = value;
    }
  }

  get radians() {
    return this.object3d.rotation[this.axis];
  }
}

export default RotationControlValues;
