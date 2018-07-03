//

import { state_lookup } from '../Config/state_lookup.js';
import { configuration } from '../Config/configuration.js';

const { datatree } = require('../Config/datatree.js');


export function getSumlevFromGeography(geography) {
  switch (geography) {
    case 'county':
      return '050';
    case 'state':
      return '040';
    case 'tract':
      return '140';
    case 'bg':
      return '150';
    case 'place':
      return '160';
    default:
      return '000';
  }
}

export function getLabel(geoid, name) {

  switch (geoid.length) {
    case 12:
      // block group: 081230025011
      return `BG ${geoid.slice(-1)}, Tract ${geoid.slice(-7,-1)}, ${state_lookup[geoid.slice(0,2)]}`;
    case 11:
      // tract: 08005007703
      return `Tract ${geoid.slice(-6)}, ${state_lookup[geoid.slice(0,2)]}`;
    case 7:
      // place
      return `${name}, ${state_lookup[geoid.slice(0,2)]}`;
    case 5:
      // county
      return `${name} County, ${state_lookup[geoid.slice(0,2)]}`;
    case 2:
      // state
      return name;
    default:
      return '';
  }

}

export function long2tile(lon, zoom) {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

export function lat2tile(lat, zoom) {
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}

export function formatNumber(num, dataset, attr) {

  const configuration = datatree[dataset][attr];
  const mininc = configuration.mininc;

  let big_mult = 0;


  if (mininc === "1") {
    // round to integer
    big_mult = 1;
  }
  else if (mininc === "0.1") {
    // round to tenths
    big_mult = 10;
  }
  else if (mininc === "0.01") {
    // round to hundredths
    big_mult = 100;
  }
  else if (mininc === "0.001") {
    // round to thousandths
    big_mult = 1000;
  }


  if (configuration.type === 'currency') {
    return `$ ${parseInt(num, 10).toLocaleString()}`;
  }
  else if (configuration.type === 'regular') {
    return num;
  }
  else if (configuration.type === 'percent') {
    return `${parseInt(num*100*big_mult, 10)/big_mult} %`;
  }
  else {
    console.log('unknown number type ' + configuration.type);
    return num;
  }
}


export function datasetToYear(dataset) {
  return configuration.datasets[dataset].year;
}
