export const DESELECT_ALL = "all-selections/reset";

export function deselectAll() {
  return {
    type: DESELECT_ALL,
    payload: null,
  };
}

export function createSelectionReducer(prefix, OTHER_RESET) {
  const initialState = {};

  const RESET = `${prefix}/reset`;
  const SELECTED = `${prefix}/selected`;
  const DESELECTED = `${prefix}/deselected`;

  function reducer(state = initialState, { type, payload }) {
    let nextState = { ...state };

    if (!!OTHER_RESET && type === OTHER_RESET) {
      type = RESET;
    }

    switch (type) {
      case RESET: {
        return { ...initialState };
      }
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

  reducer.reset = () => {
    return {
      type: RESET,
      payload: null,
    };
  };

  reducer.pick = (id) => {
    return {
      type: SELECTED,
      payload: id,
    };
  };

  reducer.forget = (id) => {
    return {
      type: DESELECTED,
      payload: id,
    };
  };

  return reducer;
}
