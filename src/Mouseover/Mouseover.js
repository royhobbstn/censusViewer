import React from 'react';

const mouseover_style = { position: 'absolute', 'zIndex': 1000, bottom: '32px', borderRadius: '3px', padding: '5px', left: '9px', backgroundColor: 'white', minWidth: '160px' };

const Mouseover = ({
    mouseover_statistic,
    mouseover_moe,
    mouseover_label
}) => {

    return (
        <div style={mouseover_style}>
        <span>{mouseover_label}</span><br />
        <span>{mouseover_statistic}</span>
        <span>&plusmn;&nbsp;{mouseover_moe}</span>
        </div>
    );
};

export default Mouseover;
