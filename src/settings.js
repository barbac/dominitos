function settings(settingName) {
  const searchParams = new URL(document.location).searchParams;
  return searchParams.get(settingName);
}

export default settings;
