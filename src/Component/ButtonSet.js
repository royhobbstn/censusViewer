import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { configuration } from '../Config/configuration.js';

const { datatree } = require('../Config/datatree.js');


const dataset_style = { position: 'absolute', 'zIndex': 1000, top: '100px', left: '10px', backgroundColor: 'white', width: '160px' };

const geography_style = { position: 'absolute', 'zIndex': 1000, top: '100px', left: '200px', backgroundColor: 'white', width: '160px' };

const theme_style = { position: 'absolute', 'zIndex': 1000, top: '100px', left: '390px', backgroundColor: 'white', width: '240px' };

const ButtonSet = ({
  handleDatasetChange,
  handleGeographyChange,
  handleThemeChange,
  source_dataset,
  source_geography,
  selected_attr
}) => {

  const themes = Object.keys(datatree[source_dataset]).map(key => {
    return { value: key, label: datatree[source_dataset][key]['verbose'] };
  });

  const options = Object.keys(configuration.datasets).map(dataset => {
    return { value: configuration.datasets[dataset].id, label: configuration.datasets[dataset].label };
  });

  return (
    <div>
            <div className="button_set" style={dataset_style}>
                <Select
                    name="dataset-select"
                    clearable={false}
                    value={source_dataset}
                    onChange={handleDatasetChange}
                    options={options}
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
                        { value: 'bg', label: 'Block Group' }
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
