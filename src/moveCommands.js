const PI = Math.PI;

function shoulderElbowWristAngles(
  robotDimensions,
  targetDistance,
  verticalOffset = 0
) {
  let swapAngles = false;

  // y axis
  let length0 =
    robotDimensions.vehicleHeight + robotDimensions.baseHeight - verticalOffset;
  let length1 = robotDimensions.armHeight;
  let length2 = robotDimensions.forarmHeight;
  let length3 =
    robotDimensions.gripperBaseHeight + robotDimensions.gripperHeight;
  // x axis
  const length4 = targetDistance;

  //flip the pentagon horizontallu.
  if (length3 > length0) {
    swapAngles = true;

    let tmp = length0;
    length0 = length3;
    length3 = tmp;
    tmp = length1;
    length1 = length2;
    length2 = tmp;
  }

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

  if (swapAngles) {
    return [angle3, angle2, angle1];
  } else {
    return [angle1, angle2, angle3];
  }
}

function* moveCommands(
  dominoes,
  vehiclePosition,
  destination,
  robotDimensions
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

  const baseRotation = -PI / 2;
  const dominoDispenserY = robotDimensions.vehicleHeight;
  const [grabAngle1, grabAngle2, grabAngle3] = shoulderElbowWristAngles(
    robotDimensions,
    robotDimensions.vehicleWidth,
    dominoDispenserY
  );
  const targetReleaseDistance =
    robotDimensions.vehicleDominoGap + robotDimensions.vehicleWidth / 2;
  const [
    releaseAngle1,
    releaseAngle2,
    releaseAngle3,
  ] = shoulderElbowWristAngles(
    robotDimensions,
    targetReleaseDistance,
    0 //ground lvl
  );

  vehiclePosition = vehiclePosition.clone();

  for (let data of dominoes) {
    //move body
    destination.position.set(data.x, data.y, data.z);

    const targetReleasePosition = data.z + targetReleaseDistance;
    const vehicleZDistance = vehiclePosition.z - targetReleasePosition;
    vehiclePosition.z -= vehicleZDistance;
    yield ['fordward', vehicleZDistance];

    const vehicleXDistance = data.x - vehiclePosition.x;
    vehiclePosition.x += vehicleXDistance;
    yield ['right', vehicleXDistance];

    //grab
    destination.position.set(
      vehiclePosition.x + robotDimensions.vehicleWidth,
      dominoDispenserY,
      vehiclePosition.z
    );

    //go to grab position.
    yield ['base', baseRotation];
    yield ['shoulder', grabAngle1];
    yield ['wrist', grabAngle3];
    yield ['elbow', grabAngle2];
    //go back to ready position.
    yield ['elbow', -grabAngle2];
    yield ['wrist', -grabAngle3];
    yield ['shoulder', -grabAngle1];
    yield ['base', -baseRotation];

    //release
    destination.position.set(data.x, data.y, data.z);

    //go to destination.
    yield ['elbow', releaseAngle2];
    yield ['wrist', releaseAngle3];
    yield ['shoulder', releaseAngle1];
    //go back to ready position.
    yield ['shoulder', -releaseAngle1];
    yield ['wrist', -releaseAngle3];
    yield ['elbow', -releaseAngle2];
  }
}

export default moveCommands;
