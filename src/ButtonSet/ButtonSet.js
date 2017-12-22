import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { datatree } from '../_Config_JSON/datatree.js';

const dataset_style = { position: 'absolute', 'zIndex': 1000, top: '10px', left: '10px', backgroundColor: 'white', width: '160px' };

const geography_style = { position: 'absolute', 'zIndex': 1000, top: '10px', left: '200px', backgroundColor: 'white', width: '160px' };

const theme_style = { position: 'absolute', 'zIndex': 1000, top: '10px', left: '390px', backgroundColor: 'white', width: '240px' };

const ButtonSet = ({
    handleDatasetChange,
    handleGeographyChange,
    handleThemeChange,
    source_dataset,
    source_geography,
    selected_attr
}) => {

    const themes = Object.keys(datatree[source_dataset]).map(key => {
        return { value: `attr_${key}`, label: datatree[source_dataset][key]['verbose'] };
    });

    return (
        <div>
            <div className="button_set" style={dataset_style}>
                <Select
                    name="dataset-select"
                    clearable={false}
                    value={source_dataset}
                    onChange={handleDatasetChange}
                    options={[
                        { value: 'acs1014', label: 'ACS 2010 - 2014' },
                        { value: 'acs1115', label: 'ACS 2011 - 2015' },
                        { value: 'acs1216', label: 'ACS 2012 - 2016' }
                    ]}
                />
            </div>
            <div className="geog_set" style={geography_style}>
                <Select
                    name="geography-select"
                    clearable={false}
                    value={source_geography}
                    onChange={handleGeographyChange}
                    options={[
                        { value: 'state', label: 'State' },
                        { value: 'place', label: 'Place' },
                        { value: 'county', label: 'County' },
                        { value: 'tract', label: 'Tract' },
                        { value: 'bg', label: 'Block Group' },
                    ]}
                />
            </div>
            <div className="theme_set" style={theme_style}>
                <Select
                    name="theme-select"
                    clearable={false}
                    value={selected_attr}
                    onChange={handleThemeChange}
                    options={themes}
                />
            </div>
        </div>
    );
};

export default ButtonSet;
