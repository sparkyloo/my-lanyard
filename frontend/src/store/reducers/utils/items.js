export function createStatusReducer(prefix, OTHER_RESET) {
  const initialState = {
    initialized: false,
    pending: 0,
  };

  const RESET = `${prefix}/reset`;
  const PENDING = `${prefix}/pending`;
  const FINISHED = `${prefix}/finished`;

  function reducer(state = initialState, { type, payload }) {
    if (!!OTHER_RESET && type === OTHER_RESET) {
      type = RESET;
    }

    switch (type) {
      case RESET: {
        return { ...initialState };
      }
      case PENDING: {
        return {
          initialized: true,
          pending: state.pending + 1,
        };
      }
      case FINISHED: {
        return {
          initialized: true,
          pending: state.pending - 1,
        };
      }
      default: {
        return { ...state };
      }
    }
  }

  reducer.reset = () => {
    return {
      type: RESET,
      payload: null,
    };
  };

  reducer.pending = () => {
    return {
      type: PENDING,
      payload: null,
    };
  };

  reducer.finished = () => {
    return {
      type: FINISHED,
      payload: null,
    };
  };

  return reducer;
}

export function createItemsReducer(prefix, OTHER_RESET) {
  const initialState = {};

  const RESET = `${prefix}/reset`;
  const TRACKED = `${prefix}/tracked`;
  const UNTRACKED = `${prefix}/untracked`;

  function reducer(state = initialState, { type, payload }) {
    let nextState = { ...state };

    if (!!OTHER_RESET && type === OTHER_RESET) {
      type = RESET;
    }

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
