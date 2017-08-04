const PI = Math.PI;

function* moveCommands(dominoes, vehiclePosition, vehicleWidth, destination) {
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

    yield ['shoulderDown', PI / 2];
    yield ['shoulderUp', PI / 2];
  }
}

export default moveCommands;
