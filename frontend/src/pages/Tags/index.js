import "./Tags.css";
import {
  useTagList,
  useTagCreationForm,
  useTagEditForm,
  useTaggingForm,
  useSession,
} from "../../state";
import { Filters, InfoModal, TopBar } from "../../components/TopBar";
import { Button } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { Input } from "../../components/Input";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { Modal } from "../../components/Modal";
import { H2, P } from "../../components/Text";
import { ErrorList } from "../../components/ErrorList";
import { PageContent } from "../../components/PageContent";

export function TagsPage({ showSystemAssets }) {
  const {
    items,
    selected,
    selectedForEdit,
    selectItemForEdit,
    resetSelections,
    selectItem,
    deselectItem,
    newFlow,
    editFlow,
    infoFlow,
    filterControls,
  } = useTagList(false);

  const { session } = useSession();

  return (
    <PageContent>
      <TopBar showSystemAssets={showSystemAssets}>
        <Filters hideTagSelect {...filterControls} />
        <FlexRow gap={1}>
          {!!session && <Button onClick={newFlow.toggle}>Create New</Button>}
          <InfoModal flow={infoFlow}>
            {!!session ? (
              <P>
                This page is where you can create new tags and edit the name of
                your existing tags.
              </P>
            ) : (
              <P>This page is where you can view all the premade tags.</P>
            )}
          </InfoModal>
        </FlexRow>
      </TopBar>
      {!items.length ? (
        <P>You don't have any tags yet, use the button above to create one.</P>
      ) : (
        <TagGrid
          allowEdits
          items={items}
          // selected={selected}
          // selectItem={selectItem}
          // deselectItem={deselectItem}
          selectItemForEdit={selectItemForEdit}
        />
      )}
      <Modal {...newFlow}>
        {!!newFlow.show && (
          <CreateNewTag
            modalState={newFlow}
            showSystemAssets={showSystemAssets}
          />
        )}
      </Modal>
      <Modal {...editFlow}>
        {!!selectedForEdit && (
          <EditTag
            id={selectedForEdit}
            modalState={editFlow}
            showSystemAssets={showSystemAssets}
          />
        )}
      </Modal>
    </PageContent>
  );
}

export function TagGrid({
  col = 5,
  colGap = 2,
  rowGap = 4,
  items = [],
  selected = [],
  selectItem,
  deselectItem,
  selectItemForEdit,
  allowEdits,
  ...props
}) {
  const { session } = useSession();

  return (
    <Grid col={col} colGap={colGap} rowGap={rowGap} {...props}>
      {items.map(({ id, authorId, name }) => {
        const isSelected = selected.includes(`${id}`);
        const isMine = session?.id === authorId;

        return isMine ? (
          <Button
            key={id}
            variant="plain"
            rounded
            display="flex"
            direction="column"
            align="center"
            justify="center"
            border={{
              all: true,
              color: isSelected ? "blue" : "light",
            }}
            outline={isSelected ? "blue" : null}
            onClick={() => {
              if (allowEdits) {
                selectItemForEdit(id);
              } else if (isSelected) {
                deselectItem(id);
              } else {
                selectItem(id);
              }
            }}
          >
            <FlexCol padding={{ y: 1, x: 2 }} align="center">
              <P>{name}</P>
            </FlexCol>
          </Button>
        ) : (
          <FlexCol
            rounded
            border={{
              all: true,
              color: "light",
            }}
            padding={{ y: 1, x: 2 }}
            align="center"
          >
            <P>{name}</P>
          </FlexCol>
        );
      })}
    </Grid>
  );
}

function CreateNewTag({ modalState }) {
  const { errorList, isPending, nameInput, submitButton, dismissError } =
    useTagCreationForm(modalState);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Create Tag</H2>
        <Button onClick={modalState.toggle}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Button
        handleEnterKey={modalState.show}
        {...submitButton}
        disabled={isPending || !nameInput.value}
      >
        Save
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}

function EditTag({ id, modalState }) {
  const {
    errorList,
    isPending,
    saveButton,
    deleteButton,
    nameInput,
    dismissError,
  } = useTagEditForm(id, modalState);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Edit Tag</H2>
        <Button onClick={modalState.toggle}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Button
        handleEnterKey={modalState.show}
        {...saveButton}
        disabled={isPending}
      >
        Save
      </Button>
      <Button variant="secondary" {...deleteButton} disabled={isPending}>
        Delete
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}

export function EditTagging({ tagList, closeButton }) {
  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Tagging</H2>
        {!!closeButton && closeButton}
      </FlexRow>
      <Filters hideTagSelect {...tagList.filterControls} />
      <TagGrid
        rounded
        scroll="y"
        maxHeight={24}
        col={4}
        colGap={1}
        rowGap={1}
        border={{
          all: true,
          color: "light",
        }}
        padding={{
          x: 2,
          y: 1,
        }}
        items={tagList.items}
        selected={tagList.selected}
        selectItem={tagList.selectItem}
        deselectItem={tagList.deselectItem}
      />
    </FlexCol>
  );
}
