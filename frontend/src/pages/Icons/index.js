import "./Icons.css";
import {
  useIconList,
  useIconCreationForm,
  useIconEditForm,
  useSession,
} from "../../state";
import { Filters, TopBar } from "../../components/TopBar";
import { Button } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { Image } from "../../components/Image";
import { Input } from "../../components/Input";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { Modal } from "../../components/Modal";
import { H2 } from "../../components/Text";
import { ErrorList } from "../../components/ErrorList";
import { PageContent } from "../../components/PageContent";
import { EditTagging } from "../Tags";

export function IconsPage({ showSystemAssets }) {
  const {
    items,
    selected,
    selectedForEdit,
    selectItemForEdit,
    selectedForTagging,
    selectItemForTagging,
    resetSelections,
    selectItem,
    deselectItem,
    newFlow,
    editFlow,
    taggingFlow,
    filterControls,
  } = useIconList(showSystemAssets.checked);

  const { session } = useSession();

  return (
    <PageContent>
      <TopBar showSystemAssets={showSystemAssets}>
        {!!session && <Button onClick={newFlow.toggle}>Create New</Button>}
        <Filters {...filterControls} />
        <Button disabled={!selected.length} onClick={resetSelections}>
          Deselect All
        </Button>
      </TopBar>
      <IconGrid
        allowEdits
        allowTagging
        items={items}
        selected={selected}
        selectItem={selectItem}
        deselectItem={deselectItem}
        selectItemForEdit={selectItemForEdit}
        selectItemForTagging={selectItemForTagging}
      />
      <Modal {...newFlow}>
        {!!newFlow.show && (
          <CreateNewIcon
            close={newFlow.toggle}
            showSystemAssets={showSystemAssets}
          />
        )}
      </Modal>
      <Modal {...editFlow}>
        {!!selectedForEdit && (
          <EditIcon
            id={selectedForEdit}
            close={editFlow.toggle}
            showSystemAssets={showSystemAssets}
          />
        )}
      </Modal>
      <Modal {...taggingFlow}>
        {!!taggingFlow.show && (
          <EditTagging
            kind="icons"
            id={selectedForTagging}
            close={taggingFlow.toggle}
          />
        )}
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
  selectItemForTagging,
  allowEdits,
  allowTagging,
  ...props
}) {
  const { session } = useSession();

  allowEdits = !!session && !!allowEdits;
  allowTagging = !!session && !!allowTagging;

  return (
    <Grid col={col} colGap={colGap} rowGap={rowGap} {...props}>
      {items.map(({ id, authorId, name, imageUrl }) => {
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
            gap={0.5}
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
            <Image
              key={name}
              alt={name}
              src={imageUrl}
              width={12}
              height={12}
              border={{
                bottom: 1,
                color: "light",
              }}
            />
            <FlexCol
              gap={0.25}
              padding={{
                bottom: allowEdits || allowTagging ? 0.25 : 0,
              }}
            >
              {!!isMine && !!allowEdits && (
                <Button
                  margin={{
                    bottom: 0.25,
                  }}
                  onClick={() => selectItemForEdit(id)}
                >
                  edit
                </Button>
              )}
              {!!allowTagging && (
                <Button onClick={() => selectItemForTagging(id)}>tags</Button>
              )}
            </FlexCol>
          </Button>
        );
      })}
    </Grid>
  );
}

function CreateNewIcon({ close }) {
  const {
    errorList,
    isPending,
    nameInput,
    imageUrlInput,
    submitButton,
    dismissError,
  } = useIconCreationForm(close);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Create Icon</H2>
        <Button onClick={() => close()}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Input label="Image Url" disabled={isPending} {...imageUrlInput} />
      <Button {...submitButton} disabled={isPending}>
        Save
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}

function EditIcon({ id, close }) {
  const {
    errorList,
    isPending,
    saveButton,
    deleteButton,
    nameInput,
    imageUrlInput,
    dismissError,
  } = useIconEditForm(id, close);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Edit Icon</H2>
        <Button onClick={() => close()}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Input label="Image Url" disabled={isPending} {...imageUrlInput} />
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
