const PI = Math.PI;

function shoulderElbowWristAngles(
  vehicleWidth,
  vehicleHeight,
  vehicleDominoGap
) {
  const length0 = 10.8 + vehicleHeight; // y axis
  const length1 = 13;
  const length2 = 14.8;
  const length3 = 15.8;
  const length4 = vehicleWidth / 2 + vehicleDominoGap;

  const l2 = length4;
  const l1 = length0 - length3;
  const l3Square = l2 ** 2 + l1 ** 2;
  const iangleA = Math.atan(l2 / l1);
  const iangleC = Math.acos(
    (-l3Square + length1 ** 2 + length2 ** 2) / (2 * length1 * length2)
  );
  const iangleB = Math.acos(
    (-(length2 ** 2) + l3Square + length1 ** 2) /
      (2 * Math.sqrt(l3Square) * length1)
  );
  const iangleD = Math.acos(
    (-(length1 ** 2) + l3Square + length2 ** 2) /
      (2 * Math.sqrt(l3Square) * length2)
  );
  const iangleE = Math.atan(l1 / l2);

  const startingAngle = PI;
  const angle1 = iangleA + iangleB - startingAngle;
  const angle2 = iangleC - startingAngle;
  const angle3 = iangleD + iangleE + PI / 2 - startingAngle;

  return [angle1, angle2, angle3];
}

function* moveCommands(
  dominoes,
  vehiclePosition,
  vehicleWidth,
  vehicleHeight,
  destination
) {
  /*
    BODY:
    rotate
    go to z position
    rotate right
    go to x position

    ARM:
    go to ready position(between dispenser and destination)
    go to pregrap position
    go to grap position
    grab
    go back to pregrap position
    go back to ready position
    go to predesitnation
    go to destination
    release
    go back to predesitnation
    go back ready position
    */

  const vehicleDominoGap = 20;
  vehiclePosition = vehiclePosition.clone();

  for (let data of dominoes) {
    destination.position.set(data.x, data.y, data.z);

    //move body
    const vehicleZDistance =
      vehiclePosition.z - (vehicleWidth / 2 + data.z + vehicleDominoGap);
    vehiclePosition.z -= vehicleZDistance;
    yield ['fordward', vehicleZDistance];

    const vehicleXDistance = data.x - vehiclePosition.x;
    vehiclePosition.x += vehicleXDistance;
    yield ['right', vehicleXDistance];

    const [angle1, angle2, angle3] = shoulderElbowWristAngles(
      vehicleWidth,
      vehicleHeight,
      vehicleDominoGap
    );
    //go to destination.
    yield ['elbow', angle2];
    yield ['wrist', angle3];
    yield ['shoulder', angle1];
    //go back to ready position.
    yield ['shoulder', -angle1];
    yield ['wrist', -angle3];
    yield ['elbow', -angle2];
  }
}

export default moveCommands;
