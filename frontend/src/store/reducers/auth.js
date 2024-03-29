import { combineReducers } from "redux";
import { csrfFetch } from "../csrf";
import { handleApiErrors, DISMISS_ALL } from "./utils/errors";
import { createItemsReducer } from "./utils/items";
import { fetchItems as fetchTags } from "./tags";
import { resetAll } from "./utils/reset";

const initialState = {
  checked: false,
  user: null,
};

const CHECKED = "auth/checked";
const LOGIN = "auth/login";
const LOGOUT = "auth/logout";

export const errors = createItemsReducer("auth-errors", [DISMISS_ALL]);

export function trackChecked() {
  return {
    type: CHECKED,
    payload: null,
  };
}

export function trackSession(user) {
  return {
    type: LOGIN,
    payload: user,
  };
}

export function untrackSession() {
  return {
    type: LOGOUT,
    payload: null,
  };
}

export function checkSession() {
  return async (dispatch) => {
    try {
      const response = await csrfFetch("/api/session");

      dispatch(trackSession(await response.json()));

      await dispatch(fetchTags());
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(trackChecked());
    }
  };
}

export function startSession(credential, password) {
  return async (dispatch) => {
    try {
      const response = await csrfFetch("/api/session", {
        method: "POST",
        body: {
          credential,
          password,
        },
      });

      dispatch(trackSession(await response.json()));
      dispatch(resetAll());
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    }
  };
}

export function startDemoSession() {
  return async (dispatch) => {
    try {
      const response = await csrfFetch("/api/session", {
        method: "POST",
        body: {
          credential: "demo.user@mylanyard.org",
          password: "password",
        },
      });

      dispatch(trackSession(await response.json()));
      dispatch(resetAll());
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    }
  };
}

export function destroySession() {
  return async (dispatch) => {
    try {
      await csrfFetch("/api/session", {
        method: "DELETE",
      });

      dispatch(untrackSession());
      dispatch(resetAll());
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    }
  };
}

export function createNewUser(email, password, firstName, lastName) {
  return async (dispatch) => {
    try {
      const response = await csrfFetch("/api/users", {
        method: "POST",
        body: {
          email,
          password,
          firstName,
          lastName,
        },
      });

      dispatch(trackSession(await response.json()));
      dispatch(resetAll());
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    }
  };
}

export function editUser(email, firstName, lastName) {
  return async (dispatch) => {
    try {
      const response = await csrfFetch("/api/users", {
        method: "PATCH",
        body: {
          email,
          firstName,
          lastName,
        },
      });

      dispatch(trackSession(await response.json()));
      dispatch(resetAll());
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    }
  };
}

export function editUserPassword(current, changed) {
  return async (dispatch) => {
    try {
      const response = await csrfFetch("/api/users/password", {
        method: "PATCH",
        body: {
          current,
          changed,
        },
      });

      dispatch(trackSession(await response.json()));
      dispatch(resetAll());
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    }
  };
}

export default combineReducers({
  errors,
  session: (state = initialState, { type, payload }) => {
    switch (type) {
      case CHECKED: {
        return {
          ...state,
          checked: true,
        };
      }
      case LOGIN: {
        return {
          ...state,
          user: payload,
        };
      }
      case LOGOUT: {
        return {
          ...state,
          user: null,
        };
      }
      default: {
        return state;
      }
    }
  },
});

export function isAppReady({ auth }) {
  return auth.session.checked;
}

export function getSession({ auth }) {
  return auth.session.user;
}

export function getErrors({ auth }) {
  return Object.values(auth.errors);
}
