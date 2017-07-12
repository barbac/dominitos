import page from 'page';

import dominitos from './dominitos.js';


page.base('/dist');
page('/', dominitos);
page();
