//
import { store } from '../index.js';

import {
  updateMoeData,
  unbusyMoe,
  changeMouseoverMoe
}
from '../Redux/actions.js';

import worker_script from '../Worker/fetch_worker.js';

export const myMoeWorker = new Worker(worker_script);




myMoeWorker.onmessage = (m) => {

  if (!m || !m.data) {
    store.dispatch(unbusyMoe());
  }
  else {
    if (m.data.type === 'fetch') {
      store.dispatch(updateMoeData(m.data.data.clusters));
    }
    else if (m.data.type === 'lookup') {
      store.dispatch(changeMouseoverMoe(m.data.data));
    }
  }
};
