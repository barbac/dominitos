//Use a concrete class with parts already attached.
import arm from './arm.js';

test('simulation', () => {
  const robot = new arm(true);
  const controls = robot.controls;
  const simulation = robot.playMacroGenerator();

  const steps = [
    new Map([['waist', 1], ['elbow', 2]]),
    new Map([['waist', 2], ['elbow', 1]]),
  ];
  robot.macro.steps = steps;

  //initial state
  expect(robot.rawValues).toEqual([0, 0, 0, 0]);
  simulation.next(1000);
  expect(robot.rawValues).toEqual([1, 0, 0, 0]);
  simulation.next(2000);
  expect(robot.rawValues).toEqual([1, 0, 1, 0]);
  simulation.next(3000);
  expect(robot.rawValues).toEqual([1, 0, 2, 0]);
  simulation.next(4000);
  expect(robot.rawValues).toEqual([2, 0, 2, 0]);
  simulation.next(5000);
  //go in the negative direction.
  expect(robot.rawValues).toEqual([2, 0, 1, 0]);
  simulation.next(6000);
  //no further change.
  expect(robot.rawValues).toEqual([2, 0, 1, 0]);
});
