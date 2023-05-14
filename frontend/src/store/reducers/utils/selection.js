import { RESET_ALL } from "./reset";

export const DESELECT_ALL = "all-selections/reset";

export function deselectAll() {
  return {
    type: DESELECT_ALL,
    payload: null,
  };
}

export function createSelectionReducer(prefix, otherResets = []) {
  const initialState = {};

  const RESET = `${prefix}/reset`;
  const SELECTED = `${prefix}/selected`;
  const DESELECTED = `${prefix}/deselected`;

  function reducer(state = initialState, { type, payload }) {
    let nextState = { ...state };

    if (otherResets.length && otherResets.includes(type)) {
      type = RESET;
    }

    switch (type) {
      case RESET_ALL:
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
