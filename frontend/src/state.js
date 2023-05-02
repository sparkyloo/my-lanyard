import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { useModal } from "./hooks/modal";
import { useCheckbox } from "./hooks/checkbox";
import { useFilters } from "./hooks/filters";
import { useInput } from "./hooks/input";
import { useForm } from "./hooks/form";
import { dismissErrors } from "./store/reducers/utils/errors";
import * as authState from "./store/reducers/auth";
import * as cardState from "./store/reducers/cards";
import * as iconState from "./store/reducers/icons";
import * as lanyardState from "./store/reducers/lanyards";
import * as tagState from "./store/reducers/tags";

export function useSession() {
  const dispatch = useDispatch();
  const session = useSelector(authState.getSession);

  const doLogout = useCallback(() => dispatch(authState.destroySession()), []);

  const doLoginAsDemo = useCallback(
    () => dispatch(authState.startDemoSession()),
    []
  );

  return {
    session,
    doLogout,
    doLoginAsDemo,
  };
}

export function useAppState() {
  const history = useHistory();
  const dispatch = useDispatch();
  const appReady = useSelector(authState.isAppReady);

  const [showSystemAssets] = useCheckbox(true);

  useEffect(() => {
    dispatch(authState.checkSession());
  }, []);

  useEffect(() => {
    return history.listen(() => {
      dispatch(dismissErrors());
    });
  }, [history, dispatch]);

  return {
    appReady,
    showSystemAssets,
  };
}

function useReduxList(topic, includeSystemAssets) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(topic.fetchItems());
  }, []);

  const items = useSelector(topic.getItems(includeSystemAssets));
  const selected = useSelector(topic.getSelected);

  const [selectedForEdit, selectItemForEdit] = useState(null);

  const newFlow = useModal();
  const editFlow = useModal();

  useEffect(() => {
    if (selectedForEdit) {
      editFlow.forceModalState(true);
    }
  }, [selectedForEdit]);

  useEffect(() => {
    if (!editFlow.show) {
      selectItemForEdit(null);
    }
  }, [editFlow.show]);

  const resetSelections = useCallback(() => {
    dispatch(topic.selections.reset());
  }, []);

  const selectItem = useCallback((id) => {
    dispatch(topic.selections.pick(id));
  }, []);

  const deselectItem = useCallback((id) => {
    dispatch(topic.selections.forget(id));
  }, []);

  return {
    items,
    selected,
    selectedForEdit,
    selectItemForEdit,
    newFlow,
    editFlow,
    resetSelections,
    selectItem,
    deselectItem,
  };
}

function useLimitedReduxList(topic, includeSystemAssets) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(topic.fetchItems());
  }, []);

  const items = useSelector(topic.getItems(includeSystemAssets));
  const selected = useSelector(topic.getSelected);

  const previousSelected = useRef(selected);

  useEffect(() => {
    if (selected.length > 1) {
      for (const id of previousSelected.current) {
        dispatch(topic.selections.forget(id));
      }
    }

    previousSelected.current = selected;
  }, [selected]);

  const selectItem = useCallback((id) => {
    dispatch(topic.selections.pick(id));
  }, []);

  const deselectItem = useCallback((id) => {
    dispatch(topic.selections.forget(id));
  }, []);

  return {
    items,
    selected,
    selectItem,
    deselectItem,
  };
}

export function useAppStatus() {
  return useSelector(authState.isAppReady);
}

export function useAuthErrors() {
  return useSelector(authState.getErrors);
}

export function useLogin() {
  const dispatch = useDispatch();

  const history = useHistory();
  const errorList = useAuthErrors();

  const dismissError = useCallback((errId) => {
    dispatch(authState.errors.untrackItem(errId));
  }, []);

  const emailInput = useInput("");
  const passwordInput = useInput("");

  const { isPending, submitButton } = useForm(async (dispatch) => {
    await dispatch(
      authState.startSession(emailInput.value, passwordInput.value)
    );

    history.replace("/");
  });

  return {
    emailInput,
    passwordInput,
    isPending,
    submitButton,
    errorList,
    dismissError,
  };
}

export function useIconList(includeSystemAssets) {
  const { items, ...rest } = useReduxList(iconState, includeSystemAssets);
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useLimitedIconList(includeSystemAssets) {
  const { items, ...rest } = useLimitedReduxList(
    iconState,
    includeSystemAssets
  );
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useIconCreationForm(close) {
  const dispatch = useDispatch();
  const errorList = useSelector(iconState.getErrors);

  const dismissError = useCallback((errId) => {
    dispatch(iconState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput("");
  const imageUrlInput = useInput("");

  const { isPending, submitButton } = useForm(async () => {
    await dispatch(iconState.createItem(nameInput.value, imageUrlInput.value));
    close();
  });

  return {
    errorList,
    isPending,
    nameInput,
    imageUrlInput,
    submitButton,
    dismissError,
  };
}

export function useIconEditForm(id, includeSystemAssets, close) {
  const dispatch = useDispatch();
  const errorList = useSelector(iconState.getErrors);
  const icon = useSelector(iconState.getItems(includeSystemAssets))[id];

  const dismissError = useCallback((errId) => {
    dispatch(iconState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput(icon.value || "");
  const imageUrlInput = useInput(icon.imageUrl || "");

  const { isPending: savePending, submitButton: saveButton } = useForm(
    async () => {
      await dispatch(
        iconState.updateItem(id, nameInput.value, imageUrlInput.value)
      );
      close();
    }
  );

  const { isPending: deletePending, submitButton: deleteButton } = useForm(
    async () => {
      await dispatch(iconState.deleteItem(id));
      close();
    }
  );

  const isPending = savePending || deletePending;

  return {
    errorList,
    savePending,
    deletePending,
    isPending,
    nameInput,
    imageUrlInput,
    saveButton,
    deleteButton,
    dismissError,
  };
}

export function useCardList(includeSystemAssets) {
  const { items, ...rest } = useReduxList(cardState, includeSystemAssets);
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useLimitedCardList(includeSystemAssets) {
  const { items, ...rest } = useLimitedReduxList(
    cardState,
    includeSystemAssets
  );

  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useCardCreationForm(includeSystemAssets, close) {
  const dispatch = useDispatch();
  const iconList = useLimitedIconList(includeSystemAssets);
  const errorList = useSelector(iconState.getErrors);

  const dismissError = useCallback((errId) => {
    dispatch(cardState.errors.untrackItem(errId));
  }, []);

  const textInput = useInput("");

  const { isPending, submitButton } = useForm(async () => {
    await dispatch(cardState.createItem(textInput.value, iconList.selected[0]));
    close();
  });

  return {
    iconList,
    errorList,
    isPending,
    textInput,
    submitButton,
    dismissError,
  };
}

export function useCardEditForm(id, includeSystemAssets, close) {
  const dispatch = useDispatch();
  const iconList = useLimitedIconList(includeSystemAssets);
  const errorList = useSelector(cardState.getErrors);
  const card = useSelector(cardState.getItems(includeSystemAssets))[id];

  const dismissError = useCallback((errId) => {
    dispatch(cardState.errors.untrackItem(errId));
  }, []);

  const textInput = useInput(card?.name || "");

  const { isPending: savePending, submitButton: saveButton } = useForm(
    async () => {
      await dispatch(
        cardState.updateItem(id, textInput.value, iconList.selected[0])
      );
      close();
    }
  );

  const { isPending: deletePending, submitButton: deleteButton } = useForm(
    async () => {
      await dispatch(cardState.deleteItem(id));
      close();
    }
  );

  const isPending = savePending || deletePending;

  return {
    iconList,
    errorList,
    savePending,
    deletePending,
    isPending,
    textInput,
    saveButton,
    deleteButton,
    dismissError,
  };
}

export function useLanyardList(includeSystemAssets) {
  const { items, ...rest } = useReduxList(lanyardState, includeSystemAssets);
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useLimitedLanyardList(includeSystemAssets) {
  const { items, ...rest } = useLimitedReduxList(
    lanyardState,
    includeSystemAssets
  );

  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useLanyardCreationForm(includeSystemAssets, close) {
  const dispatch = useDispatch();
  const cardList = useLimitedCardList(includeSystemAssets);
  const errorList = useSelector(iconState.getErrors);

  const dismissError = useCallback((errId) => {
    dispatch(lanyardState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput("");
  const descriptionInput = useInput("");

  const { isPending, submitButton } = useForm(async () => {
    await dispatch(
      lanyardState.createItem(
        nameInput.value,
        descriptionInput.value,
        cardList.selected
      )
    );
    close();
  });

  return {
    cardList,
    errorList,
    isPending,
    nameInput,
    descriptionInput,
    submitButton,
    dismissError,
  };
}

export function useLanyardEditForm(id, includeSystemAssets, close) {
  const dispatch = useDispatch();
  const cardList = useLimitedCardList(includeSystemAssets);
  const errorList = useSelector(lanyardState.getErrors);
  const lanyard = useSelector(lanyardState.getItems(includeSystemAssets))[id];

  const dismissError = useCallback((errId) => {
    dispatch(lanyardState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput(lanyard?.name || "");
  const descriptionInput = useInput(lanyard?.description || "");

  const { isPending: savePending, submitButton: saveButton } = useForm(
    async () => {
      await dispatch(
        lanyardState.updateItem(
          id,
          nameInput.value,
          descriptionInput.value,
          cardList.selected
        )
      );
      close();
    }
  );

  const { isPending: deletePending, submitButton: deleteButton } = useForm(
    async () => {
      await dispatch(lanyardState.deleteItem(id));
      close();
    }
  );

  const isPending = savePending || deletePending;

  return {
    cardList,
    errorList,
    savePending,
    deletePending,
    isPending,
    nameInput,
    descriptionInput,
    saveButton,
    deleteButton,
    dismissError,
  };
}

export function useTagList(includeSystemAssets) {
  const { items, ...rest } = useReduxList(tagState, includeSystemAssets);
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useLimitedTagList(includeSystemAssets) {
  const { items, ...rest } = useLimitedReduxList(tagState, includeSystemAssets);

  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}
