const default_state = {
  selected_attr: 'attr_mhi',
};

const buttonset = (
  // this sets initial state
  state = default_state,
  action
) => {
  switch (action.type) {
    case 'BUTTONSET_CLICK':
      return Object.assign({}, state, {
        selected_attr: action.attr
      });
    default:
      return state;
  }
};

export default buttonset;
