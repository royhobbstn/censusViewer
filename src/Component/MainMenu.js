import React from 'react';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import { configuration } from '../Config/configuration.js';
import { datatree } from '../Config/datatree.js';

const geo_options = [
  { value: 'state', label: 'State' },
  { value: 'place', label: 'Place' },
  { value: 'county', label: 'County' },
  { value: 'tract', label: 'Tract' },
  { value: 'bg', label: 'Block Group' }
];


const MainMenu = ({ handleGeographyChange, source_dataset }) => {


  const themes = Object.keys(datatree[source_dataset]).map(key => {
    return { value: key, label: datatree[source_dataset][key]['verbose'] };
  });

  const options = Object.keys(configuration.datasets).map(dataset => {
    return { value: configuration.datasets[dataset].id, label: configuration.datasets[dataset].label };
  });


  return (
    <div style={{position: 'absolute', top: '0', left: '0', zIndex: '1000', width: '100%', borderRadius: '0'}}>
    <Menu attached='top'>
      <Dropdown item icon='wrench' simple>
        <Dropdown.Menu>
          <Dropdown.Item>
            <Icon name='dropdown' />
            <span className='text'>Theme</span>

            <Dropdown.Menu>
              <Dropdown.Item>Document</Dropdown.Item>
              <Dropdown.Item>Image</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Item>

          <Dropdown.Item>
            <Icon name='dropdown' />
            <span className='text'>Geography</span>

            <Dropdown.Menu>
            {geo_options.map(geo=> {
              return <Dropdown.Item 
              onClick={()=> {
              console.log('click');
                handleGeographyChange(geo);
              }}
              key={geo.value}>{geo.label}</Dropdown.Item>;
            })}
              
            </Dropdown.Menu>
          </Dropdown.Item>
          
            <Dropdown.Item>
            <Icon name='dropdown' />
            <span className='text'>Dataset</span>

            <Dropdown.Menu>
              <Dropdown.Item>Document</Dropdown.Item>
              <Dropdown.Item>Image</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Item>
          
        </Dropdown.Menu>
      </Dropdown>
      <span style={{textAlign: 'center', fontSize: '1.2em', lineHeight: '2em', width: '100%', margin: 'auto'}}>American Community Survey Map</span>


    </Menu>


  </div>
  );
};

export default MainMenu;
