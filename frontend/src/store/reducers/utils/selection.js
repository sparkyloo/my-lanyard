export function createSelectionReducer(prefix) {
  const initialState = {};

  const SELECTED = `${prefix}/selected`;
  const DESELECTED = `${prefix}/deselected`;

  function reducer(state = initialState, { type, payload }) {
    let nextState = { ...state };

    switch (type) {
      case SELECTED: {
        nextState[payload] = true;

        return nextState;
      }
      case DESELECTED: {
        delete nextState[payload];

        return nextState;
      }
      default: {
        return nextState;
      }
    }
  }

  reducer.makeSelection = (id) => {
    return {
      type: SELECTED,
      payload: id,
    };
  };

  reducer.forgetSelection = () => {
    return {
      type: DESELECTED,
      payload: null,
    };
  };

  return reducer;
}
