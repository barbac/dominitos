import arm from './arm.js';
import gripper from './gripper.js';

function armGripper() {
  return arm(new gripper());
}

export default armGripper;
