import "./Tags.css";
import {
  useTagList,
  useTagCreationForm,
  useTagEditForm,
  useTaggingForm,
  useSession,
} from "../../state";
import { Filters, TopBar } from "../../components/TopBar";
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
  } = useTagList(showSystemAssets.checked);

  const { session } = useSession();

  return (
    <PageContent>
      <TopBar showSystemAssets={showSystemAssets}>
        {!!session && <Button onClick={newFlow.toggle}>Create New</Button>}
      </TopBar>
      <TagGrid
        allowEdits
        items={items}
        // selected={selected}
        // selectItem={selectItem}
        // deselectItem={deselectItem}
        selectItemForEdit={selectItemForEdit}
      />
      <Modal {...newFlow}>
        {!!newFlow.show && (
          <CreateNewTag
            close={newFlow.toggle}
            showSystemAssets={showSystemAssets}
          />
        )}
      </Modal>
      <Modal {...editFlow}>
        {!!selectedForEdit && (
          <EditTag
            id={selectedForEdit}
            close={editFlow.toggle}
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

        return (
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
              if (isSelected) {
                deselectItem(id);
              } else {
                selectItem(id);
              }
            }}
          >
            <FlexCol padding={{ y: 1, x: 2 }} align="center">
              <P>{name}</P>
              {!!isMine && !!allowEdits && (
                <Button
                  margin={{
                    top: 0.5,
                  }}
                  onClick={() => selectItemForEdit(id)}
                >
                  edit
                </Button>
              )}
            </FlexCol>
          </Button>
        );
      })}
    </Grid>
  );
}

function CreateNewTag({ close }) {
  const { errorList, isPending, nameInput, submitButton, dismissError } =
    useTagCreationForm(close);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Create Tag</H2>
        <Button onClick={() => close()}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Button {...submitButton} disabled={isPending}>
        Save
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}

function EditTag({ id, close }) {
  const {
    errorList,
    isPending,
    saveButton,
    deleteButton,
    nameInput,
    dismissError,
  } = useTagEditForm(id, close);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Edit Tag</H2>
        <Button onClick={() => close()}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Button {...saveButton} disabled={isPending}>
        Save
      </Button>
      <Button {...deleteButton} disabled={isPending}>
        Delete
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}

export function EditTagging({ id, kind, close }) {
  const { tagList, errorList, isPending, saveButton, dismissError } =
    useTaggingForm(kind, id, close);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Edit Tagging</H2>
        <Button onClick={() => close()}>Close</Button>
      </FlexRow>
      {tagList.items.length ? (
        <>
          <Filters hideTagSelect {...tagList.filterControls} />
          <TagGrid
            rounded
            scroll="y"
            maxHeight={48}
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
          <Button {...saveButton} disabled={isPending}>
            Save
          </Button>
        </>
      ) : (
        <P>No personal tags created yet, come back after creating some.</P>
      )}
    </FlexCol>
  );
}
