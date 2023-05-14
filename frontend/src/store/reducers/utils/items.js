import { RESET_ALL } from "./reset";

export function createStatusReducer(prefix, otherResets = []) {
  const initialState = {
    initialized: false,
    pending: 0,
  };

  const RESET = `${prefix}/reset`;
  const PENDING = `${prefix}/pending`;
  const FINISHED = `${prefix}/finished`;

  function reducer(state = initialState, { type }) {
    if (otherResets.length && otherResets.includes(type)) {
      type = RESET;
    }

    switch (type) {
      case RESET_ALL:
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

export function createItemsReducer(prefix, otherResets = []) {
  const initialState = {};

  const RESET = `${prefix}/reset`;
  const TRACKED = `${prefix}/tracked`;
  const UNTRACKED = `${prefix}/untracked`;

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

export function sortMyItemsFirst(items) {
  return Object.values(items).sort((a, b) =>
    a.authorId === b.authorId
      ? 0
      : a.authorId !== -1
      ? -1
      : b.authorId !== -1
      ? -1
      : 1
  );
}
