import { combineReducers } from "redux";
import { csrfFetch } from "../csrf";
import { handleApiErrors, DISMISS_ALL } from "./utils/errors";
import {
  createItemsReducer,
  createStatusReducer,
  sortMyItemsFirst,
} from "./utils/items";
import { DESELECT_ALL, createSelectionReducer } from "./utils/selection";
import { items as tagItemsReducer } from "./tags";

export const status = createStatusReducer("lanyard-loading");
export const items = createItemsReducer("lanyard-data");
export const errors = createItemsReducer("lanyard-errors", [DISMISS_ALL]);
export const assignment = createItemsReducer("lanyard-assignment");
export const selections = createSelectionReducer("lanyard-selections", [
  DESELECT_ALL,
]);

export function fetchItem(id) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/lanyards/instance/${id}`);

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

      const response = await csrfFetch(`/api/lanyards`);

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

export function createItem(name, description, cardIds) {
  return async (dispatch) => {
    let item = null;

    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/lanyards`, {
        method: "POST",
        body: {
          name,
          description,
          cardIds,
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

      await csrfFetch(`/api/lanyards/instance/${id}`, {
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

export function updateItem(id, name, description, cardIds) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/lanyards/instance/${id}`, {
        method: "PATCH",
        body: {
          name,
          description,
          cardIds,
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

      await csrfFetch(`/api/lanyards/tagging`, {
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
  return ({ lanyards }) => lanyards.items[id];
}

export function getItems(includeSystemLanyards) {
  return ({ lanyards }) =>
    includeSystemLanyards
      ? sortMyItemsFirst(lanyards.items)
      : Object.values(lanyards.items).filter((item) => item.authorId !== -1);
}

export function getErrors({ lanyards }) {
  return Object.values(lanyards.errors);
}

export function getSelected({ lanyards }) {
  return Object.keys(lanyards.selections);
}

export function getAssignment({ lanyards }) {
  return Object.keys(lanyards.assignment);
}

export function getStatus({ lanyards }) {
  return lanyards.status;
}
