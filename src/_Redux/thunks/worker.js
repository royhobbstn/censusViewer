/* eslint-env worker */
/* eslint no-restricted-globals: "off" */
/* global */

// worker.js
const workercode = () => {

  let persistent_data = {};

  self.onmessage = function(e) {

    // determine what kind of message (fetch data or lookup or clear)
    if (e.data.type === 'fetch') {
      // get data from aws/serverless

      fetch(e.data.url)
        .then(res => {
          return res.json();
        })
        .then(fetched_data => {

          if (Object.keys(fetched_data.data).length) {
            // todo send pre-computed stops and geoids
            self.postMessage({ type: 'fetch', data: fetched_data });
            persistent_data = Object.assign({}, persistent_data, fetched_data.data);
          }
          else {
            self.postMessage(false);
          }

        })
        .catch(err => {
          console.error('err:', err);
        });
    }
    else if (e.data.type === 'lookup') {
      // query giant data object for est or moe
      self.postMessage({ type: 'lookup', data: persistent_data[e.data.data] });
    }
    else if (e.data.type === 'clear') {
      // clear data (for when changing geog / theme / dataset)
      persistent_data = {};
    }
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;
