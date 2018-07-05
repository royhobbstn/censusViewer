// this is a container component

import { connect } from 'react-redux';
import MainMenu from './MainMenu.js';


const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

const MainMenuContainer = connect(mapStateToProps, mapDispatchToProps)(MainMenu);

export default MainMenuContainer;
