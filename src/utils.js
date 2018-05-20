const PI = Math.PI;

function radians(degrees) {
  return degrees / 180 * PI;
}

function degrees(radians) {
  return radians / PI * 180;
}

export default {
  radians,
  degrees,
};
