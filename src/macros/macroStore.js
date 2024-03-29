import Macro from './Macro.js';

function macrosToJSON(macros) {
  const _macros = macros.filter(macro => macro.save).map(macro => {
    return macro.steps.map(step => Array.from(step));
  });
  const serializedMacros = JSON.stringify(_macros);
  return serializedMacros;
}

function macrosFromJSON(jsonString) {
  if (!jsonString) {
    return []; //no macros stored.
  }
  const rawMacros = JSON.parse(jsonString);
  const macros = rawMacros.map(rawMacro => {
    const steps = rawMacro.map(stepsList => {
      return new Map(stepsList);
    });
    const macro = new Macro('TODO: store/load name');
    macro.save = true;
    macro.steps = steps;
    return macro;
  });
  return macros;
}

function storeMacros(robot) {
  window.localStorage.setItem(robot.machineName, macrosToJSON(robot.macros));
}

function loadMacros(robot) {
  const macros = macrosFromJSON(window.localStorage.getItem(robot.machineName));
  robot.macros.push(...macros);
}

export { macrosToJSON, macrosFromJSON, storeMacros, loadMacros };
