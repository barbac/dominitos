import './style.css';
import page from 'page';

import settings from './settings.js';
import dominitos from './dominitos.js';
import vectors from './vectors.js';
import Scara from './robots/Scara.js';
import modelLoader from './modelLoader.js';
import worldView from './worldView.js';
import manualControls from './playground/manualControls.js';

settings.init();

page(/\w*\/dominitos.html/, dominitos);
page(/\w*\/model.html/, modelLoader);
page(/\w*\/world.html/, worldView);
page(/\w*\/vectors.html/, vectors);
page(/\w*\/controls.html/, manualControls);
page(/\w*\/scara.html/, Scara);
page();
