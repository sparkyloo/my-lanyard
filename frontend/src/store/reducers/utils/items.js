export function createItemsReducer(prefix) {
  const initialState = {};

  const RESET = `${prefix}/reset`;
  const TRACKED = `${prefix}/tracked`;
  const UNTRACKED = `${prefix}/untracked`;

  function reducer(state = initialState, { type, payload }) {
    let nextState = { ...state };

    switch (type) {
      case RESET: {
        return { ...initialState };
      }
      case TRACKED: {
        for (const item of payload) {
          nextState[item.id] = item;
        }

        return nextState;
      }
      case UNTRACKED: {
        for (const id of payload) {
          delete nextState[id];
        }

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

  reducer.trackItems = (items) => {
    return {
      type: TRACKED,
      payload: items,
    };
  };

  reducer.trackItem = (item) => {
    return reducer.trackItems([item]);
  };

  reducer.untrackItems = (ids) => {
    return {
      type: UNTRACKED,
      payload: ids,
    };
  };

  reducer.untrackItem = (id) => {
    return reducer.untrackItems([id]);
  };

  return reducer;
}
