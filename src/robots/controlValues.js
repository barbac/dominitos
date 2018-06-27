import utils from '../utils.js';

class RotationControlValues {
  name = '';
  type = 'range';
  min = 0;
  max = 180;
  axis = null;
  object3d = null;
  _degreesValue = 0;
  setRadians = null;

  constructor(object3d, name, axis, setRadians) {
    this.object3d = object3d;
    this.name = name;
    this.axis = axis;
    this.setRadians = setRadians;
  }

  set degrees(value) {
    this._degreesValue = value;
    this.radians = utils.radians(value);
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
