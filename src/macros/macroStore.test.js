import Macro from './Macro.js';
import { macrosToJSON } from './macroStore.js';

test('macros JSON serialization', () => {
  const macro1 = new Macro();
  macro1.set('control1', 3);
  macro1.set('control2', 6);
  macro1.activeStep = 1;
  macro1.set('control1', 8);
  macro1.set('control2', 1);

  const macro2 = new Macro();
  macro2.set('control3', 4);
  macro2.set('control4', 9);

  const macros = [macro1, macro2];

  //array of 2 macros
  const expected = [
    //macro 1, 2 step steps
    [
      //step 1
      [['control1', 3], ['control2', 6]],
      //step 2
      [['control1', 8], ['control2', 1]],
    ],

    //macro 2, 1 step, 1 empty step
    [
      //step 1
      [['control3', 4], ['control4', 9]],
      [], //macros creates 2 emtpy steps
    ],
  ];

  const result = macrosToJSON(macros);
  expect(JSON.parse(result)).toEqual(expected);
});
