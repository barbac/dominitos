import worldView from './worldView.js';
import models from './models.js';

function modelLoader() {
  const searchParams = new URL(document.location).searchParams;
  const modelName = searchParams.get('model');
  console.log(modelName);

  const model = models[modelName];
  if (!model) {
    throw `no model for ${modelName}`;
  }
  worldView(model());
}

export default modelLoader;
