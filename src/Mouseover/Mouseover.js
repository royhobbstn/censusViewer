import React from 'react';
import { datatree } from '../_Config_JSON/datatree.js';

const mouseover_style = { position: 'absolute', 'zIndex': 1000, bottom: '32px', borderRadius: '3px', padding: '5px', left: '9px', backgroundColor: 'white', minWidth: '160px' };

const Mouseover = ({
  mouseover_statistic,
  mouseover_label,
  mouseover_moe,
  source_dataset,
  selected_attr
}) => {

  // don't show mouseover if no values are ready
  if (mouseover_label === undefined) {
    return (<span style={{display: 'none'}}></span>);
  }
  else {
    const moe_span = (mouseover_moe === undefined) ? '' : <span>&plusmn;&nbsp;{formatNumber(mouseover_moe, source_dataset, selected_attr)}</span>;

    return (
      <div style={mouseover_style}>
        <span>{mouseover_label}</span><br />
        <span>{formatNumber(mouseover_statistic, source_dataset, selected_attr)}&nbsp;</span>
        {moe_span}
        </div>
    );
  }

};

export default Mouseover;

function formatNumber(num, dataset, attr) {

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
