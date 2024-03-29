import { combineReducers } from "redux";
import { csrfFetch } from "../csrf";
import { handleApiErrors, DISMISS_ALL } from "./utils/errors";
import { createItemsReducer, createStatusReducer } from "./utils/items";
import { DESELECT_ALL, createSelectionReducer } from "./utils/selection";

export const status = createStatusReducer("tag-loading");
export const items = createItemsReducer("tag-data");
export const errors = createItemsReducer("tag-errors", [DISMISS_ALL]);
export const selections = createSelectionReducer("tag-selections", [
  DESELECT_ALL,
]);

export function fetchItem(id) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/tags/instance/${id}`);

      const { taggings, ...instance } = await response.json();
      const taggingItems = [];
      const tagItems = [];

      dispatch(items.trackItem(instance));

      for (const { tag, ...tagging } of taggings) {
        taggingItems.push(tagging);
        tagItems.push(tag);
      }

      // dispatch(assignment.trackItems(taggingItems));
      // dispatch(tagItemsReducer.trackItems(tagItems));
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

      const response = await csrfFetch(`/api/tags`);

      dispatch(items.trackItems(await response.json()));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export function createItem(name) {
  return async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/tags`, {
        method: "POST",
        body: {
          name,
        },
      });

      dispatch(items.trackItem(await response.json()));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    }
  };
}

export function deleteItem(id) {
  return async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/tags/instance/${id}`, {
        method: "DELETE",
      });

      dispatch(items.untrackItem(id));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    }
  };
}

export function updateItem(id, name, imageUrl) {
  return async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/tags/instance/${id}`, {
        method: "PATCH",
        body: {
          name,
          imageUrl,
        },
      });

      dispatch(items.trackItem(await response.json()));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    }
  };
}

export default combineReducers({
  status,
  items,
  errors,
  selections,
});

export function getItem(id) {
  return ({ tags }) => tags.items[id];
}

export function getItems(includeSystemTags) {
  return ({ tags }) =>
    includeSystemTags
      ? Object.values(tags.items)
      : Object.values(tags.items).filter((item) => item.authorId !== -1);
}

export function getItemMap({ tags }) {
  return tags.items;
}

export function getErrors({ tags }) {
  return Object.values(tags.errors);
}

export function getSelected({ tags }) {
  return Object.keys(tags.selections);
}

export function getStatus({ tags }) {
  return tags.status;
}

export function doPersonalTagsExist({ tags }) {
  return !!Object.values(tags.items).filter((item) => item.authorId !== -1)
    .length;
}
