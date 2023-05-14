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

export const status = createStatusReducer("icon-loading");
export const items = createItemsReducer("icon-data");
export const errors = createItemsReducer("icon-errors", [DISMISS_ALL]);
export const assignment = createItemsReducer("icon-assignment");
export const selections = createSelectionReducer("icon-selections", [
  DESELECT_ALL,
]);

export function fetchItem(id) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/icons/instance/${id}`);

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

      const response = await csrfFetch(`/api/icons`);

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

export function createItem(name, imageUrl) {
  return async (dispatch) => {
    let item = null;

    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/icons`, {
        method: "POST",
        body: {
          name,
          imageUrl,
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

      await csrfFetch(`/api/icons/instance/${id}`, {
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

export function updateItem(id, name, imageUrl) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/icons/instance/${id}`, {
        method: "PATCH",
        body: {
          name,
          imageUrl,
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

      await csrfFetch(`/api/icons/tagging`, {
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
  return ({ icons }) => icons.items[id];
}

export function getItems(includeSystemIcons) {
  return ({ icons }) =>
    includeSystemIcons
      ? sortMyItemsFirst(icons.items)
      : Object.values(icons.items).filter((item) => item.authorId !== -1);
}

export function getErrors({ icons }) {
  return Object.values(icons.errors);
}

export function getSelected({ icons }) {
  return Object.keys(icons.selections);
}

export function getAssignment({ icons }) {
  return Object.keys(icons.assignment);
}

export function getStatus({ icons }) {
  return icons.status;
}
