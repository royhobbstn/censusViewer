const default_state = {
  selected_attr: 'attr_empty',
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
    case 'RESET_MAP':
      return Object.assign({}, default_state);
    default:
      return state;
  }
};

export default buttonset;
