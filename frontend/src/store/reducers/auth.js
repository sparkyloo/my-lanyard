import { combineReducers } from "redux";
import { csrfFetch } from "../csrf";
import { handleApiErrors } from "./utils/errors";
import { createItemsReducer } from "./utils/items";

const initialState = null;

const LOGIN = "auth/login";
const LOGOUT = "auth/logout";

export const errors = createItemsReducer("icon-errors");

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
    } catch (caught) {
      handleApiErrors(caught, dispatch, errors);
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
    } catch (caught) {
      handleApiErrors(caught, dispatch, errors);
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
    } catch (caught) {
      handleApiErrors(caught, dispatch, errors);
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
    } catch (caught) {
      handleApiErrors(caught, dispatch, errors);
    }
  };
}

export default combineReducers({
  errors,
  session: (state = initialState, { type, payload }) => {
    switch (type) {
      case LOGIN: {
        return payload;
      }
      case LOGOUT: {
        return null;
      }
      default: {
        return state;
      }
    }
  },
});
