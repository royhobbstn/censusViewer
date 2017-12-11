import React from 'react';

const style = { position: 'absolute', 'zIndex': 1000, top: '10px', left: '10px', backgroundColor: 'white' };

const ButtonSet = ({
    buttonClick
}) => {
    return (
        <div className="button_set" style={style}>
            <button id="attr_empty" onClick={buttonClick}>Clear</button>
            <button id="attr_mhi" onClick={buttonClick}>MHI</button>
        </div>
    );
};

export default ButtonSet;
