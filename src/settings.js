const settings = {
  model: null,
  camera: 'firstPersonCamera',
  lockCamera: true,
  init: init,
};

function _settingFromUrl(settingName) {
  const searchParams = new URL(document.location).searchParams;
  return searchParams.get(settingName);
}

function init() {
  settings.model = _settingFromUrl('model');
  settings.camera = _settingFromUrl('camera');
}

export default settings;
