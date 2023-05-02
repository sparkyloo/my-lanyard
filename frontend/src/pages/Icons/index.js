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

export function IconsPage({ showSystemAssets }) {
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
    filterControls,
  } = useIconList(showSystemAssets.checked);

  return (
    <FlexCol align="center">
      <TopBar showSystemAssets={showSystemAssets}>
        <FlexRow gap={0.5}>
          <Button onClick={newFlow.toggle}>Create New</Button>
          <Button disabled={!selected.length}>Add Tag</Button>
        </FlexRow>
        <Filters {...filterControls} />
        <Button disabled={!selected.length} onClick={resetSelections}>
          Deselect All
        </Button>
      </TopBar>
      <IconGrid
        allowEdits
        items={items}
        selected={selected}
        selectItem={selectItem}
        deselectItem={deselectItem}
        selectItemForEdit={selectItemForEdit}
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
    </FlexCol>
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
  allowEdits,
  ...props
}) {
  const { session } = useSession();

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

function EditIcon({ id, showSystemAssets, close }) {
  const {
    errorList,
    isPending,
    saveButton,
    deleteButton,
    nameInput,
    imageUrlInput,
    dismissError,
  } = useIconEditForm(id, showSystemAssets.checked, close);

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
