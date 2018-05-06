/* eslint-env worker */
/* eslint no-restricted-globals: "off" */
/* global */

// worker.js
const workercode = () => {

  self.onmessage = function(e) {
    console.log('Message received from main script');
    console.log(e);

    fetch(e.data)
      .then(res => {
        return res.json();
      })
      .then(fetched_data => {

        if (Object.keys(fetched_data.data).length) {
          self.postMessage(fetched_data);
        }
        else {
          self.postMessage(false);
        }

      })
      .catch(err => {
        console.error('err:', err);
      });


  };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;
