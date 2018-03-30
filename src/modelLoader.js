import worldView from './worldView.js';
import settings from './settings.js';
import models from './models.js';

function modelLoader() {
  const modelName = settings('model');
  console.log(modelName);

  const model = models[modelName];
  if (!model) {
    throw `no model for ${modelName}`;
  }
  worldView(model());
}

export default modelLoader;
