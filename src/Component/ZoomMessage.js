import React from 'react';

const style = {
  position: 'absolute',
  bottom: '5px',
  left: '120px',
  color: 'maroon',
  padding: '5px',
  width: 'auto',
  height: 'auto',
  fontSize: '11px'
};

const ZoomMessage = ({
  map_zoom,
  source_geography
}) => {

  const display_message = ((source_geography === 'tract' || source_geography === 'bg' || source_geography === 'place') && map_zoom < 9);

  return display_message ?
    <div style={style}>Zoom in to see full detail</div> :
    <span />;

};

export default ZoomMessage;
