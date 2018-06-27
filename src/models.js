import box from './box.js';
import claw from './robots/claw.js';
import arm from './arm.js';
import gripper from './robots/gripper.js';
import armGripper from './robots/armGripper.js';
import armClaw from './robots/armClaw.js';

export default {
  box,
  claw,
  arm,
  gripper,
  'arm-gripper': armGripper,
  'arm-claw': armClaw,
};
