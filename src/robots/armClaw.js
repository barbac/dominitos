import Arm from './arm.js';
import Claw from './claw.js';

class ArmClaw extends Arm {
  name = 'Arm with claw';
  machineName = 'arm-claw';

  get endEffector() {
    return new Claw();
  }
}

export default ArmClaw;
