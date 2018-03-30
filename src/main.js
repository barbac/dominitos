import './style.css';
import page from 'page';

import dominitos from './dominitos.js';
import vectors from './vectors.js';
import modelLoader from './modelLoader.js';
import worldView from './worldView.js';

page('/dominitos.html', dominitos);
page('/model.html', modelLoader);
page('/world.html', worldView);
page('/vectors.html', vectors);
page();
