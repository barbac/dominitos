import './style.css';
import page from 'page';

import dominitos from './dominitos.js';
import vectors from './vectors.js';
import worldView from './worldView.js';

page('/dominitos.html', dominitos);
page('/world.html', worldView);
page('/vectors.html', vectors);
page();
