import React from 'react';
import { formatNumber } from '../Service/utility.js';

const Info = ({ mouseover_statistic,
                mouseover_label,
                mouseover_moe, source_dataset, selected_attr}) => {

  return (
    <div style={{position: 'absolute', top: '80px', right: '50px', zIndex: '1000', width: '200px', borderRadius: '0', backgroundColor: 'white', padding: '10px'}}>
      <p style={{marginBottom: '5px'}}>{mouseover_label}</p>
  <p>{`${formatNumber(mouseover_statistic, source_dataset, selected_attr)}  ± ${formatNumber(mouseover_moe, source_dataset, selected_attr)}`}</p>

    </div>
  );
};

export default Info;
