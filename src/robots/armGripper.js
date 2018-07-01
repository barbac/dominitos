import Arm from './arm.js';
import Gripper from './gripper.js';

export default class ArmGripper extends Arm {
  name = 'Arm with claw';
  machineName = 'arm-claw';

  get endEffector() {
    return new Gripper();
  }
}
