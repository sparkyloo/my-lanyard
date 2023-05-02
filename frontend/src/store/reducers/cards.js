import { combineReducers } from "redux";
import { csrfFetch } from "../csrf";
import { handleApiErrors, DISMISS_ERRORS } from "./utils/errors";
import { createItemsReducer, createStatusReducer } from "./utils/items";
import { createSelectionReducer } from "./utils/selection";
import { items as tagItemsReducer } from "./tags";

export const status = createStatusReducer("card-loading");
export const items = createItemsReducer("card-data");
export const errors = createItemsReducer("card-errors", DISMISS_ERRORS);
export const assignment = createItemsReducer("card-assignment");
export const selections = createSelectionReducer("card-selections");

export function fetchItem(id) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/cards/instance/${id}`);

      const { taggings, ...instance } = await response.json();
      const taggingItems = [];
      const tagItems = [];

      dispatch(items.trackItem(instance));

      for (const { tag, ...tagging } of taggings) {
        taggingItems.push(tagging);
        tagItems.push(tag);
      }

      dispatch(assignment.trackItems(taggingItems));
      dispatch(tagItemsReducer.trackItems(tagItems));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export function fetchItems() {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/cards`);

      dispatch(items.trackItems(await response.json()));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export function createItem(name, iconId) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/cards`, {
        method: "POST",
        body: {
          name,
          iconId,
        },
      });

      dispatch(items.trackItem(await response.json()));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export function deleteItem(id) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      await csrfFetch(`/api/cards/instance/${id}`, {
        method: "DELETE",
      });

      dispatch(items.untrackItem(id));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export function updateItem(id, name, iconId) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/cards/instance/${id}`, {
        method: "PATCH",
        body: {
          name,
          iconId,
        },
      });

      const { taggings, ...instance } = await response.json();
      const taggingItems = [];
      const tagItems = [];

      dispatch(items.trackItem(instance));

      for (const { tag, ...tagging } of taggings) {
        taggingItems.push(tagging);
        tagItems.push(tag);
      }

      dispatch(assignment.trackItems(taggingItems));
      dispatch(tagItemsReducer.trackItems(tagItems));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export default combineReducers({
  status,
  items,
  errors,
  assignment,
  selections,
});

export function getItems(includeSystemCards) {
  return ({ cards }) =>
    includeSystemCards
      ? Object.values(cards.items)
      : Object.values(cards.items).filter((item) => item.authorId !== -1);
}

export function getErrors({ cards }) {
  return Object.values(cards.errors);
}

export function getSelected({ cards }) {
  return Object.keys(cards.selections);
}
