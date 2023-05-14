import { combineReducers } from "redux";
import { csrfFetch } from "../csrf";
import { DISMISS_ALL, handleApiErrors } from "./utils/errors";
import {
  createItemsReducer,
  createStatusReducer,
  sortMyItemsFirst,
} from "./utils/items";
import { DESELECT_ALL, createSelectionReducer } from "./utils/selection";
import { items as tagItemsReducer } from "./tags";

export const status = createStatusReducer("card-loading");
export const items = createItemsReducer("card-data");
export const errors = createItemsReducer("card-errors", [DISMISS_ALL]);
export const assignment = createItemsReducer("card-assignment");
export const selections = createSelectionReducer("card-selections", [
  DESELECT_ALL,
]);

export function fetchItem(id) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/cards/instance/${id}`);

      const instance = await response.json();
      const taggingItems = [];

      dispatch(items.trackItem(instance));

      for (const { tag, ...tagging } of instance.taggings) {
        taggingItems.push(tagging);
      }

      dispatch(assignment.trackItems(taggingItems));
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

      const dataItems = [];
      const taggingItems = [];

      for (const instance of await response.json()) {
        dataItems.push(instance);

        for (const { tag, ...tagging } of instance.taggings) {
          taggingItems.push(tagging);
        }
      }

      dispatch(items.trackItems(dataItems));
      dispatch(assignment.trackItems(taggingItems));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export function createItem(text, iconId) {
  return async (dispatch) => {
    let item = null;

    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/cards`, {
        method: "POST",
        body: {
          text,
          iconId,
        },
      });

      dispatch(items.trackItem((item = await response.json())));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }

    return item;
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

export function updateItem(id, text, iconId) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/cards/instance/${id}`, {
        method: "PATCH",
        body: {
          text,
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

export function updateTagging(instanceId, toAdd, toRemove) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      await csrfFetch(`/api/cards/tagging`, {
        method: "POST",
        body: {
          instanceId,
          toAdd,
          toRemove,
        },
      });

      await dispatch(fetchItem(instanceId));
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

export function getItem(id) {
  return ({ cards }) => cards.items[id];
}

export function getItems(includeSystemCards) {
  return ({ cards }) =>
    includeSystemCards
      ? sortMyItemsFirst(cards.items)
      : Object.values(cards.items).filter((item) => item.authorId !== -1);
}

export function getErrors({ cards }) {
  return Object.values(cards.errors);
}

export function getSelected({ cards }) {
  return Object.keys(cards.selections);
}

export function getAssignment({ cards }) {
  return Object.keys(cards.assignment);
}

export function getStatus({ cards }) {
  return cards.status;
}
