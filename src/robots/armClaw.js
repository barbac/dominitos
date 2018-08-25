import Arm from './arm.js';
import Claw from './claw.js';

class ArmClaw extends Arm {
  name = 'Arm with claw';
  machineName = 'arm-claw';

  get endEffector() {
    return new Claw();
  }

  postInit() {
    super.postInit();
    this.controls.get('shoulder').degrees = 180;
    this.controls.get('elbow').degrees = 0;
  }
}

export default ArmClaw;
