function macrosToJSON(macros) {
  const _macros = macros.map(macro => {
    return macro.steps.map(step => Array.from(step));
  });
  const serializedMacros = JSON.stringify(_macros);
  return serializedMacros;
}

export { macrosToJSON };
