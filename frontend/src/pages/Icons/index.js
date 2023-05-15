import "./Icons.css";
import {
  useIconList,
  useIconCreationForm,
  useIconEditForm,
  useSession,
} from "../../state";
import { Filters, InfoModal, TopBar } from "../../components/TopBar";
import { Button } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { Image } from "../../components/Image";
import { Input } from "../../components/Input";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { Modal } from "../../components/Modal";
import { H2, P } from "../../components/Text";
import { ErrorList } from "../../components/ErrorList";
import { PageContent } from "../../components/PageContent";
import { EditTagging } from "../Tags";
import { useSelector } from "react-redux";
import { doPersonalTagsExist } from "../../store/reducers/tags";
import { useMemo } from "react";

export function IconsPage({ showSystemAssets }) {
  const {
    items,
    selected,
    selectedForEdit,
    selectItemForEdit,
    selectedItemAuthorId,
    resetSelections,
    selectItem,
    deselectItem,
    newFlow,
    editFlow,
    infoFlow,
    filterControls,
  } = useIconList(showSystemAssets.checked);

  const { session } = useSession();

  const emptyMessage = useMemo(() => {
    if (filterControls.searchInput.value || filterControls.tagSelect.value) {
      return "No items could be found with the current filters.";
    } else {
      return "Start creating your first icon with the button above.";
    }
  }, []);

  return (
    <PageContent>
      <TopBar showSystemAssets={showSystemAssets}>
        <Filters {...filterControls} />
        <FlexRow gap={1}>
          {!!session && <Button onClick={newFlow.toggle}>Create New</Button>}
          <InfoModal flow={infoFlow}>
            {!!session ? (
              <>
                <P>
                  This page is where you can create new icons and edit your
                  existing icons.
                </P>
                <P>Click on any icon to update their assigned tags.</P>
              </>
            ) : (
              <P>This page is where you can view all the premade icons.</P>
            )}
          </InfoModal>
        </FlexRow>
      </TopBar>
      <IconGrid
        allowEdits
        allowTagging
        items={items}
        selected={selected}
        selectItem={selectItem}
        deselectItem={deselectItem}
        selectItemForEdit={selectItemForEdit}
        emptyMessage={emptyMessage}
      />
      <Modal {...newFlow}>
        <CreateNewIcon
          modalState={newFlow}
          showSystemAssets={showSystemAssets}
        />
      </Modal>
      <Modal {...editFlow}>
        <EditIcon
          id={selectedForEdit}
          modalState={editFlow}
          authorId={selectedItemAuthorId}
        />
      </Modal>
    </PageContent>
  );
}

export function IconGrid({
  col = 5,
  colGap = 2,
  rowGap = 4,
  items = [],
  selected = [],
  selectItem,
  deselectItem,
  selectItemForEdit,
  allowClicks,
  allowEdits,
  allowTagging,
  emptyMessage,
  ...props
}) {
  const { session } = useSession();
  const hasPersonalTags = useSelector(doPersonalTagsExist);

  allowEdits = !!session && !!allowEdits;
  allowTagging = !!session && !!allowTagging;

  if (!items.length) {
    return <P>{emptyMessage}</P>;
  }

  return (
    <Grid col={col} colGap={colGap} rowGap={rowGap} {...props}>
      {items.map(({ id, authorId, name, imageUrl }) => {
        const isSelected = selected.includes(`${id}`);
        const isMine = authorId !== -1;
        const noMouseEvents =
          !session || (!isMine && !hasPersonalTags && !allowClicks);

        return (
          <Button
            key={id}
            rounded
            noMouseEvents={noMouseEvents}
            variant="plain"
            display="flex"
            direction="column"
            align="center"
            gap={0.5}
            border={{
              all: true,
              color: isSelected ? "blue" : "light",
            }}
            outline={isSelected ? "blue" : null}
            onClick={() => {
              if (allowTagging) {
                selectItemForEdit(id);
              } else if (isSelected) {
                deselectItem(id);
              } else {
                selectItem(id);
              }
            }}
          >
            <Image
              alt={name}
              src={imageUrl}
              width={12}
              height={12}
              border={{
                bottom: 1,
                color: "light",
              }}
            />
            <FlexRow />
          </Button>
        );
      })}
    </Grid>
  );
}

function CreateNewIcon({ modalState }) {
  const {
    tagList,
    errorList,
    isPending,
    nameInput,
    imageUrlInput,
    submitButton,
    dismissError,
  } = useIconCreationForm(modalState);

  return (
    <FlexCol minWidth={64} maxWidth={64} gap={2}>
      <FlexRow justify="between">
        <H2>Create Icon</H2>
        <Button onClick={modalState.toggle}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Input label="Image Url" disabled={isPending} {...imageUrlInput} />
      {!!tagList.items.length && <EditTagging tagList={tagList} />}
      <Button {...submitButton} disabled={isPending}>
        Save
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}

function EditIcon({ id, authorId, modalState }) {
  const {
    tagList,
    errorList,
    isPending,
    saveButton,
    deleteButton,
    nameInput,
    imageUrlInput,
    dismissError,
  } = useIconEditForm(id, modalState);

  const { session } = useSession();

  const isMine = session?.id === authorId;
  const closeButton = <Button onClick={modalState.toggle}>Close</Button>;

  return (
    <FlexCol minWidth={64} maxWidth={64} gap={2}>
      {!!isMine && (
        <>
          <FlexRow justify="between">
            <H2>Edit Icon</H2>
            {closeButton}
          </FlexRow>
          <Input label="Name" disabled={isPending} {...nameInput} />
          <Input label="Image Url" disabled={isPending} {...imageUrlInput} />
        </>
      )}
      {!!tagList.items.length && (
        <EditTagging
          tagList={tagList}
          closeButton={!!isMine ? null : closeButton}
        />
      )}
      <FlexRow gap={2}>
        <Button flex={1} {...saveButton} disabled={isPending}>
          Save
        </Button>
        {!!isMine && (
          <Button
            variant="secondary"
            flex={1}
            {...deleteButton}
            disabled={isPending}
          >
            Delete
          </Button>
        )}
      </FlexRow>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}
