/* eslint-env worker */
/* eslint no-restricted-globals: "off" */
/* global */

// worker.js
const workercode = () => {

  // TODO keep track of giant data object

  let persistent_data = [];

  self.onmessage = function(e) {

    // todo clear giant data object

    // todo query giant data object for est or moe

    // determine what kind of message (fetch data or mouseover-TODO)
    if (e.data.type === 'fetch') {
      fetch(e.data.url)
        .then(res => {
          return res.json();
        })
        .then(fetched_data => {

          if (Object.keys(fetched_data.data).length) {
            // todo send pre-computed stops and geoids
            self.postMessage(fetched_data);
          }
          else {
            self.postMessage(false);
          }

        })
        .catch(err => {
          console.error('err:', err);
        });
    }

  };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;
