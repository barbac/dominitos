import Macro from './Macro.js';

function macrosToJSON(macros) {
  const _macros = macros.filter(macro => macro.save).map(macro => {
    return macro.steps.map(step => Array.from(step));
  });
  const serializedMacros = JSON.stringify(_macros);
  return serializedMacros;
}

function macrosFromJSON(jsonString) {
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

export { macrosToJSON, macrosFromJSON };
