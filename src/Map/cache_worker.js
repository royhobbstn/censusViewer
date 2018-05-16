/* eslint-env worker */
/* eslint no-restricted-globals: "off" */
/* global */

// cache_worker.js
const workercode = () => {

  self.onmessage = function(e) {

    const requests = e.data.map(url => {

      var headers = new Headers({ 'Accept': '*/*', 'Accept-Encoding': 'gzip, deflate, br' });
      var options = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
      };

      var request = new Request(url);

      return fetch(request, options);

    });

    Promise.all(requests).then((cached) => {
      // console.log('request batch done: ' + cached.length);
    });

  };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;
