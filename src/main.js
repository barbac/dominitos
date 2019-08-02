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

page('/dominitos.html', dominitos);
page('/model.html', modelLoader);
page('/world.html', worldView);
page('/vectors.html', vectors);
page('/controls.html', manualControls);
page('/scara.html', Scara);
page();
