import utils from '../utils.js';

function rotationControlValues(object3d, name, axis, setRadians) {
  return [
    name,
    {
      name,
      type: 'range',
      min: 0,
      max: 180,
      _degreesValue: 0,
      set degrees(value) {
        this._degreesValue = value;
        this.radians = utils.radians(value);
      },
      get degrees() {
        return this._degreesValue;
      },
      setRadians,
      set radians(value) {
        if (this.setRadians) {
          this.setRadians(value);
        } else {
          object3d.rotation[axis] = value;
        }
      },
      get radians() {
        return object3d.rotation[axis];
      },
    },
  ];
}

export default rotationControlValues;
