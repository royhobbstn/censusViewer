import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const style = { position: 'absolute', 'zIndex': 1000, top: '10px', left: '10px', backgroundColor: 'white', width: '250px' };

const ButtonSet = ({
    handleChange,
    source_dataset
}) => {
    return (
        <div className="button_set" style={style}>
            <Select
                name="dataset-select"
                value={source_dataset}
                onChange={handleChange}
                options={[
                    { value: 'acs1014', label: 'ACS1014' },
                    { value: 'acs1115', label: 'ACS1115' },
                    { value: 'acs1216', label: 'ACS1216' }
                ]}
                />
        </div>
    );
};

export default ButtonSet;
