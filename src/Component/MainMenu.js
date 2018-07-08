import React from 'react';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import { configuration } from '../Config/configuration.js';
import { datatree } from '../Config/datatree.js';


const geo_options = Object.keys(configuration.geography).map(key => {
  return { value: configuration.geography[key].id, label: configuration.geography[key].label };
});

const data_options = Object.keys(configuration.datasets).map(key => {
  return { value: configuration.datasets[key].id, label: configuration.datasets[key].label };
});

const MainMenu = ({ handleGeographyChange, handleDatasetChange, handleThemeChange, source_dataset, source_geography, selected_attr }) => {


  const sections = {};

  Object.keys(datatree[source_dataset]).forEach(key => {
    const item = datatree[source_dataset][key];
    const element = { value: key, label: datatree[source_dataset][key]['verbose'] };
    if (!sections[item.section]) {
      sections[item.section] = [element];
    }
    else {
      sections[item.section].push(element);
    }
  });

  const sorted_section_theme_keys = Object.keys(sections).sort();

  return (
    <div style={{position: 'absolute', top: '0', left: '0', zIndex: '1000', width: '100%', borderRadius: '0'}}>
    <Menu attached='top'>
    
    {/**
      <Dropdown item icon='wrench' simple>
        <Dropdown.Menu>
          <Dropdown.Item>
            <Icon name='dropdown' />
            <span className='text'>Theme</span>

          </Dropdown.Item>

        </Dropdown.Menu>
      </Dropdown>
      **/}
      
      
            <Dropdown icon={null} item text='Dataset' simple basic>

            <Dropdown.Menu>
            {data_options.map(dataset=> {
              return <Dropdown.Item 
              onClick={()=> {
                handleDatasetChange(dataset);
              }}
              key={dataset.value}>{dataset.label}</Dropdown.Item>;
            })}
            </Dropdown.Menu>

  </Dropdown>

      <Dropdown icon={null}  item text='Geography' simple>

            <Dropdown.Menu>
            {geo_options.map(geo=> {
              return <Dropdown.Item 
              onClick={()=> {
                handleGeographyChange(geo);
              }}
              key={geo.value}>{geo.label}</Dropdown.Item>;
            })}
            </Dropdown.Menu>

  </Dropdown>
  
        <Dropdown icon={null}  item text='Theme' simple>
    <Dropdown.Menu>
       {sorted_section_theme_keys.map(section=> {
              return <Dropdown.Item key={section}>
            <Icon name='dropdown' />
            <span className='text'>{section}</span>

            <Dropdown.Menu>
            {sections[section].map(theme=> {
              return <Dropdown.Item 
              onClick={()=> {
                handleThemeChange(theme);
              }}
              key={theme.value}>{theme.label}</Dropdown.Item>;
            })}
            </Dropdown.Menu>
            
            </Dropdown.Item>;
            })}
    </Dropdown.Menu>
  </Dropdown>
      
      <span style={{textAlign: 'center', width: '100%', margin: 'auto'}}>{configuration.datasets[source_dataset].label} - {configuration.geography[source_geography].label} - {datatree[source_dataset][selected_attr].verbose}</span>


    </Menu>


  </div>
  );
};

export default MainMenu;
