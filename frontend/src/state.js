import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { deselectAll } from "./store/reducers/utils/selection";

export function useSession() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const session = useSelector(authState.getSession);

  const doLogout = useCallback(() => {
    dispatch(authState.destroySession());

    if (location.pathname === "/tags") {
      history.replace("/login");
    } else {
      history.push("/login");
    }
  }, [location.pathname, history]);

  const doLoginAsDemo = useCallback(() => {
    dispatch(authState.startDemoSession());
    history.replace("/");
  }, [history]);

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
      dispatch(deselectAll());
    });
  }, [history, dispatch]);

  return {
    appReady,
    showSystemAssets,
  };
}

function useReduxList(topic, includeSystemAssets) {
  const dispatch = useDispatch();
  const status = useSelector(topic.getStatus);

  useEffect(() => {
    if (!status.initialized) {
      dispatch(topic.fetchItems());
    }
  }, [status.initialized]);

  const items = useSelector(topic.getItems(includeSystemAssets));
  const selected = useSelector(topic.getSelected);

  const [selectedForEdit, selectItemForEdit] = useState(null);
  const selectedItem = useSelector(topic.getItem(selectedForEdit));
  const selectedItemAuthorId = useMemo(() => {
    const id = selectedItem?.authorId;

    return typeof id === "undefined" ? null : id;
  }, [selectedItem]);

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
    selectedItemAuthorId,
    newFlow,
    editFlow,
    resetSelections,
    selectItem,
    deselectItem,
  };
}

export function usePreviousSelection(list, active, initialSelection = []) {
  const previousActive = useRef(active);

  useEffect(() => {
    if (active && !previousActive.current) {
      for (const itemId of initialSelection) {
        list.selectItem(itemId);
      }
    }

    if (active !== previousActive.current) {
      previousActive.current = active;
    }
  }, [active, list.selected]);
}

export function useSingleSelection(list, active, initialSelection = null) {
  const previousActive = useRef(active);
  const previousSelected = useRef(list.selected);

  useEffect(() => {
    if (active && !previousActive.current && initialSelection !== null) {
      list.selectItem(initialSelection);
    }

    if (active) {
      if (list.selected.length > 1) {
        for (const id of previousSelected.current) {
          list.deselectItem(id);
        }
      }

      previousSelected.current = list.selected;
    }

    if (active !== previousActive.current) {
      previousActive.current = active;
    }
  }, [active, list.selected]);
}

function useLimitedReduxList(topic, includeSystemAssets) {
  const dispatch = useDispatch();
  const selected = useSelector(topic.getSelected);
  const status = useSelector(topic.getStatus);

  useEffect(() => {
    if (!status.initialized) {
      dispatch(topic.fetchItems());
    }
  }, [status.initialized]);

  const items = useSelector(topic.getItems(includeSystemAssets));

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

export function useSignup() {
  const history = useHistory();

  const first = useInput("");
  const last = useInput("");
  const email = useInput("");
  const password = useInput("");
  const dispatch = useDispatch();

  const errorList = useAuthErrors();

  const dismissError = useCallback((errId) => {
    dispatch(authState.errors.untrackItem(errId));
  }, []);

  const { submitButton, isPending } = useForm(async (dispatch) => {
    await dispatch(
      authState.createNewUser(
        email.value,
        password.value,
        first.value,
        last.value
      )
    );

    history.replace("/");
  });

  return {
    first,
    last,
    email,
    password,
    errorList,
    dismissError,
    submitButton,
    isPending,
  };
}

export function useUserEdit() {
  const session = useSelector(authState.getSession);
  const sessionRef = useRef(session);

  const first = useInput(session?.firstName || "");
  const last = useInput(session?.lastName || "");
  const email = useInput(session?.email || "");
  const currentPassword = useInput("");
  const changedPassword = useInput("");
  const confirmPassword = useInput("");
  const dispatch = useDispatch();

  const errorList = useAuthErrors();

  const firstValueRef = useRef(first.value);
  const lastValueRef = useRef(last.value);
  const emailValueRef = useRef(email.value);

  const dismissError = useCallback((errId) => {
    dispatch(authState.errors.untrackItem(errId));
  }, []);

  useEffect(() => {
    if (session !== sessionRef.current) {
      first.setValue((firstValueRef.current = session?.firstName || ""));
      last.setValue((lastValueRef.current = session?.lastName || ""));
      email.setValue((emailValueRef.current = session?.email || ""));
    }
  }, [session]);

  const { submitButton: saveInfoChange, isPending: infoChangePending } =
    useForm(async (dispatch) => {
      dispatch(authState.errors.reset());

      await dispatch(authState.editUser(email.value, first.value, last.value));
      firstValueRef.current = first.value;
      lastValueRef.current = last.value;
      emailValueRef.current = email.value;

      dispatch(
        authState.errors.trackItem({
          id: "info-change-sucess",
          content: "Personal info change complete",
        })
      );
    });

  const { submitButton: savePasswordChange, isPending: passwordChangePending } =
    useForm(async (dispatch) => {
      dispatch(authState.errors.reset());

      if (changedPassword.value !== confirmPassword.value) {
        dispatch(
          authState.errors.trackItem({
            id: "mismatch",
            content: "Pasword fields do not match.",
          })
        );
      } else {
        await dispatch(
          authState.editUserPassword(
            currentPassword.value,
            changedPassword.value
          )
        );

        currentPassword.setValue("");
        changedPassword.setValue("");
        confirmPassword.setValue("");

        dispatch(
          authState.errors.trackItem({
            id: "password-change-sucess",
            content: "Password change complete",
          })
        );
      }
    });

  const isDirty = useMemo(() => {
    return (
      first.value !== firstValueRef.current ||
      last.value !== lastValueRef.current ||
      email.value !== emailValueRef.current
    );
  }, [first.value, last.value, email.value, infoChangePending]);

  const isPending = infoChangePending || passwordChangePending;

  return {
    session,
    isDirty,
    first,
    last,
    email,
    currentPassword,
    changedPassword,
    confirmPassword,
    errorList,
    dismissError,
    isPending,
    saveInfoChange,
    savePasswordChange,
  };
}

export function useIconList(includeSystemAssets) {
  const { items, ...rest } = useReduxList(iconState, includeSystemAssets);
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  const infoFlow = useModal();

  return {
    ...rest,
    infoFlow,
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

export function useIconCreationForm(modalState) {
  const dispatch = useDispatch();
  const errorList = useSelector(iconState.getErrors);

  const { tagList, saveTaggings } = useTaggingForm("icons");

  const dismissError = useCallback((errId) => {
    dispatch(iconState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput("");
  const imageUrlInput = useInput("");

  const { isPending, submitButton } = useForm(async () => {
    dispatch(dismissErrors());

    const item = await dispatch(
      iconState.createItem(nameInput.value, imageUrlInput.value)
    );

    await saveTaggings(item.id);

    modalState.toggle();
  });

  useEffect(() => {
    if (!modalState.show && modalState.changed) {
      dispatch(deselectAll());
      nameInput.setValue("");
      imageUrlInput.setValue("");
    }
  }, [modalState.show, modalState.changed]);

  return {
    tagList,
    errorList,
    isPending,
    nameInput,
    imageUrlInput,
    submitButton,
    dismissError,
  };
}

export function useIconEditForm(id, modalState) {
  const dispatch = useDispatch();
  const errorList = useSelector(iconState.getErrors);
  const icon = useSelector(iconState.getItem(id));

  const { tagList, saveTaggings, selectAppliedTags } = useTaggingForm(
    "icons",
    id
  );

  const dismissError = useCallback((errId) => {
    dispatch(iconState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput(icon?.name || "");
  const imageUrlInput = useInput(icon?.imageUrl || "");

  useEffect(() => {
    if (modalState.show && modalState.changed) {
      nameInput.setValue(icon?.name || "");
      imageUrlInput.setValue(icon?.imageUrl || "");
      selectAppliedTags();
    }
  }, [modalState.show, modalState.changed, icon, selectAppliedTags]);

  const { isPending: savePending, submitButton: saveButton } = useForm(
    async () => {
      dispatch(dismissErrors());

      if (icon.authorId !== -1) {
        await dispatch(
          iconState.updateItem(id, nameInput.value, imageUrlInput.value)
        );
      }

      await saveTaggings();

      modalState.toggle();
    }
  );

  const { isPending: deletePending, submitButton: deleteButton } = useForm(
    async () => {
      await dispatch(iconState.deleteItem(id));

      modalState.toggle();
    }
  );

  useEffect(() => {
    if (!modalState.show && modalState.changed) {
      dispatch(deselectAll());
      nameInput.setValue("");
      imageUrlInput.setValue("");
    }
  }, [modalState.show, modalState.changed]);

  const isPending = savePending || deletePending;

  return {
    tagList,
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

  const infoFlow = useModal();

  return {
    ...rest,
    infoFlow,
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

export function useCardCreationForm(includeSystemAssets, modalState) {
  const dispatch = useDispatch();
  const iconList = useLimitedIconList(includeSystemAssets);
  const errorList = useSelector(cardState.getErrors);

  useSingleSelection(iconList, modalState.show);

  const { tagList, saveTaggings } = useTaggingForm("cards");

  const dismissError = useCallback((errId) => {
    dispatch(cardState.errors.untrackItem(errId));
  }, []);

  const textInput = useInput("");

  const { isPending, submitButton } = useForm(async () => {
    dispatch(dismissErrors());

    const item = await dispatch(
      cardState.createItem(textInput.value, iconList.selected[0])
    );

    await saveTaggings(item.id);

    modalState.toggle();
  });

  useEffect(() => {
    if (!modalState.show && modalState.changed) {
      dispatch(deselectAll());
      textInput.setValue("");
    }
  }, [modalState.show, modalState.changed]);

  return {
    tagList,
    iconList,
    errorList,
    isPending,
    textInput,
    submitButton,
    dismissError,
  };
}

export function useCardEditForm(id, includeSystemAssets, modalState) {
  const dispatch = useDispatch();
  const iconList = useLimitedIconList(includeSystemAssets);
  const errorList = useSelector(cardState.getErrors);
  const card = useSelector(cardState.getItem(id));

  useSingleSelection(iconList, modalState.show, card?.iconId);

  const { tagList, saveTaggings, selectAppliedTags } = useTaggingForm(
    "cards",
    id
  );

  const dismissError = useCallback((errId) => {
    dispatch(cardState.errors.untrackItem(errId));
  }, []);

  const textInput = useInput(card?.text || "");

  useEffect(() => {
    if (modalState.show && modalState.changed) {
      textInput.setValue(card?.text || "");
      selectAppliedTags();
    }
  }, [modalState.show, modalState.changed, card, selectAppliedTags]);

  const { isPending: savePending, submitButton: saveButton } = useForm(
    async () => {
      dispatch(dismissErrors());

      if (card.authorId !== -1) {
        await dispatch(
          cardState.updateItem(id, textInput.value, iconList.selected[0])
        );
      }

      await saveTaggings();

      modalState.toggle();
    }
  );

  const { isPending: deletePending, submitButton: deleteButton } = useForm(
    async () => {
      await dispatch(cardState.deleteItem(id));

      modalState.toggle();
    }
  );

  useEffect(() => {
    if (!modalState.show && modalState.changed) {
      dispatch(deselectAll());
      textInput.setValue("");
    }
  }, [modalState.show, modalState.changed]);

  const isPending = savePending || deletePending;

  return {
    tagList,
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

export function useLanyard() {
  const { id, index } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const infoFlow = useModal();

  useEffect(() => {
    dispatch(lanyardState.fetchItems());
  }, []);

  const lanyard = useSelector(lanyardState.getItem(id));
  const cards = lanyard?.cards || [];

  const i = useMemo(() => {
    return parseInt(index);
  }, [index]);

  const card = useMemo(() => cards[i], [cards, i]);

  const gotoPrev = useCallback(() => {
    let prev = i - 1;

    if (prev < 0) {
      prev = cards.length - 1;
    }

    history.replace(`/lanyards/${id}/card/${prev}`);
  }, [id, i, cards]);

  const gotoNext = useCallback(() => {
    let next = i + 1;

    if (next >= cards.length) {
      next = 0;
    }

    history.replace(`/lanyards/${id}/card/${next}`);
  }, [id, i, cards]);

  return {
    card,
    infoFlow,
    gotoPrev,
    gotoNext,
  };
}

export function useLanyardList(includeSystemAssets) {
  const { items, ...rest } = useReduxList(lanyardState, includeSystemAssets);
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  const infoFlow = useModal();

  return {
    ...rest,
    items: filtered,
    filterControls,
    infoFlow,
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

export function useLanyardCreationForm(includeSystemAssets, modalState) {
  const dispatch = useDispatch();
  const cardList = useCardList(includeSystemAssets);
  const errorList = useSelector(lanyardState.getErrors);

  const { tagList, saveTaggings } = useTaggingForm("lanyards");

  const dismissError = useCallback((errId) => {
    dispatch(lanyardState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput("");
  const descriptionInput = useInput("");

  const { isPending, submitButton } = useForm(async () => {
    dispatch(dismissErrors());

    const item = await dispatch(
      lanyardState.createItem(
        nameInput.value,
        descriptionInput.value,
        cardList.selected
      )
    );

    await saveTaggings(item.id);

    modalState.toggle();
  });

  useEffect(() => {
    if (!modalState.show && modalState.changed) {
      dispatch(deselectAll());
      nameInput.setValue("");
      descriptionInput.setValue("");
    }
  }, [modalState.show, modalState.changed]);

  return {
    tagList,
    cardList,
    errorList,
    isPending,
    nameInput,
    descriptionInput,
    submitButton,
    dismissError,
  };
}

export function useLanyardEditForm(id, includeSystemAssets, modalState) {
  const dispatch = useDispatch();
  const cardList = useLimitedCardList(includeSystemAssets);
  const errorList = useSelector(lanyardState.getErrors);
  const lanyard = useSelector(lanyardState.getItem(id));

  usePreviousSelection(
    cardList,
    modalState.show,
    lanyard?.cards?.map(({ id }) => id) || []
  );

  const { tagList, saveTaggings, selectAppliedTags } = useTaggingForm(
    "lanyards",
    id
  );

  const dismissError = useCallback((errId) => {
    dispatch(lanyardState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput(lanyard?.name || "");
  const descriptionInput = useInput(lanyard?.description || "");

  useEffect(() => {
    if (modalState.show && modalState.changed) {
      nameInput.setValue(lanyard?.name || "");
      descriptionInput.setValue(lanyard?.description || "");
      selectAppliedTags();
    }
  }, [modalState.show, modalState.changed, selectAppliedTags]);

  const { isPending: savePending, submitButton: saveButton } = useForm(
    async () => {
      dispatch(dismissErrors());

      if (lanyard.authorId !== -1) {
        await dispatch(
          lanyardState.updateItem(
            id,
            nameInput.value,
            descriptionInput.value,
            cardList.selected
          )
        );
      }

      await saveTaggings();

      modalState.toggle();
    }
  );

  const { isPending: deletePending, submitButton: deleteButton } = useForm(
    async () => {
      await dispatch(lanyardState.deleteItem(id));

      modalState.toggle();
    }
  );

  useEffect(() => {
    if (!modalState.show && modalState.changed) {
      dispatch(deselectAll());
      nameInput.setValue("");
      descriptionInput.setValue("");
    }
  }, [modalState.show, modalState.changed]);

  const isPending = savePending || deletePending;

  return {
    tagList,
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

  const infoFlow = useModal();

  const showTagEditor = useMemo(() => {
    return (
      !!items.length ||
      !!filterControls.isDirty ||
      !!filterControls.searchInput.value ||
      !!filterControls.tagSelect.value
    );
  }, [
    items.length,
    filterControls.isDirty,
    filterControls.searchInput.value,
    filterControls.tagSelect.value,
  ]);

  return {
    ...rest,
    infoFlow,
    showTagEditor,
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

export function useTagCreationForm(modalState) {
  const dispatch = useDispatch();
  const errorList = useSelector(tagState.getErrors);

  const dismissError = useCallback((errId) => {
    dispatch(tagState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput("");

  const { isPending, submitButton } = useForm(async () => {
    dispatch(dismissErrors());

    await dispatch(tagState.createItem(nameInput.value));

    modalState.toggle();
  });

  useEffect(() => {
    if (!modalState.show && modalState.changed) {
      dispatch(deselectAll());
      nameInput.setValue("");
    }
  }, [modalState.show, modalState.changed]);

  return {
    errorList,
    isPending,
    nameInput,
    submitButton,
    dismissError,
  };
}

export function useTagEditForm(id, modalState) {
  const dispatch = useDispatch();
  const errorList = useSelector(tagState.getErrors);
  const tag = useSelector(tagState.getItem(id));

  const dismissError = useCallback((errId) => {
    dispatch(tagState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput(tag?.name || "");

  const { isPending: savePending, submitButton: saveButton } = useForm(
    async () => {
      dispatch(dismissErrors());

      await dispatch(tagState.updateItem(id, nameInput.value));

      modalState.toggle();
    }
  );

  const { isPending: deletePending, submitButton: deleteButton } = useForm(
    async () => {
      await dispatch(tagState.deleteItem(id));

      modalState.toggle();
    }
  );

  useEffect(() => {
    if (!modalState.show && modalState.changed) {
      dispatch(deselectAll());
      nameInput.setValue(tag?.name || "");
    }
  }, [modalState.show, modalState.changed]);

  const isPending = savePending || deletePending;

  return {
    errorList,
    savePending,
    deletePending,
    isPending,
    nameInput,
    saveButton,
    deleteButton,
    dismissError,
  };
}

export function useTaggingForm(kind, id) {
  let getItem;
  let updateTagging;

  switch (kind) {
    case "icons": {
      getItem = iconState.getItem;
      updateTagging = iconState.updateTagging;
      break;
    }
    case "cards": {
      getItem = cardState.getItem;
      updateTagging = cardState.updateTagging;
      break;
    }
    case "lanyards": {
      getItem = lanyardState.getItem;
      updateTagging = lanyardState.updateTagging;
      break;
    }
    default: {
      throw new Error(`Invalid tagging kind: "${kind}"`);
    }
  }

  const dispatch = useDispatch();
  const tagList = useTagList(false);
  const selectedItem = useSelector(getItem(id));

  const allTags = useSelector(tagState.getItemMap);

  const selectedTags = useMemo(
    () => tagList.selected.map((id) => asNumber(id)),
    [id, tagList.selected]
  );

  const assignments = useMemo(
    () => (!selectedItem ? [] : selectedItem.taggings || []),
    [selectedItem]
  );

  const selectAppliedTags = useCallback(() => {
    if (selectedItem) {
      for (const { tagId } of selectedItem.taggings) {
        tagList.selectItem(tagId);
      }
    }
  }, [selectedItem, tagList.selectItem]);

  const saveTaggings = useCallback(
    async (instanceId = id) => {
      const toAdd = new Set();
      const toRemove = new Set();

      for (const tagId of selectedTags) {
        let tag = allTags[tagId];

        if (!tag || tag.authorId === -1) {
          continue;
        }

        if (!assignments.find((tagging) => asNumber(tagging.id) === tagId)) {
          toAdd.add(tagId);
        }
      }

      for (const { tagId, authorId } of assignments) {
        if (authorId === -1) {
          continue;
        }

        if (!selectedTags.includes(asNumber(tagId))) {
          toRemove.add(tagId);
        }
      }

      await dispatch(
        updateTagging(instanceId, Array.from(toAdd), Array.from(toRemove))
      );
    },
    [dispatch, updateTagging, id, selectedTags]
  );

  return {
    tagList,
    selectAppliedTags,
    saveTaggings,
  };
}

function asNumber(arg) {
  return typeof arg === "string" ? parseInt(arg) : arg;
}
