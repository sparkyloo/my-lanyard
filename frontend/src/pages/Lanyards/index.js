import "./Lanyards.css";
import {
  useLanyardList,
  useLanyardCreationForm,
  useLanyardEditForm,
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
import { CardGrid } from "../Cards";

export function LanyardsPage({ showSystemAssets }) {
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
  } = useLanyardList(showSystemAssets.checked);

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
      <LanyardGrid
        allowEdits
        items={items}
        selected={selected}
        selectItem={selectItem}
        deselectItem={deselectItem}
        selectItemForEdit={selectItemForEdit}
      />
      <Modal {...newFlow}>
        {!!newFlow.show && (
          <CreateNewLanyard
            close={newFlow.toggle}
            showSystemAssets={showSystemAssets}
          />
        )}
      </Modal>
      <Modal {...editFlow}>
        {!!selectedForEdit && (
          <EditLanyard
            id={selectedForEdit}
            close={editFlow.toggle}
            showSystemAssets={showSystemAssets}
          />
        )}
      </Modal>
    </FlexCol>
  );
}

export function LanyardGrid({
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
      {items.map(({ id, authorId, name, icon }) => {
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
            {/* <Image
              key={name}
              alt={name}
              src={icon.imageUrl}
              width={12}
              height={12}
              border={{
                bottom: 1,
                color: "light",
              }}
            /> */}
            <P
              key={name}
              rounded
              border={{
                all: true,
                color: "light",
              }}
              padding={{
                x: 1,
                y: 1,
              }}
            >
              {name}
            </P>
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

function CreateNewLanyard({ showSystemAssets, close }) {
  const {
    cardList,
    errorList,
    isPending,
    submitButton,
    nameInput,
    descriptionInput,
    dismissError,
  } = useLanyardCreationForm(showSystemAssets.checked, close);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Create Lanyard</H2>
        <Button onClick={close}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Input label="Description" disabled={isPending} {...descriptionInput} />
      <Filters {...cardList.filterControls} />
      <CardGrid
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
        items={cardList.items}
        selected={cardList.selected}
        selectItem={cardList.selectItem}
        deselectItem={cardList.deselectItem}
      />
      <Button {...submitButton} disabled={isPending}>
        Save
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}

function EditLanyard({ id, showSystemAssets, close }) {
  const {
    cardList,
    errorList,
    isPending,
    saveButton,
    deleteButton,
    nameInput,
    descriptionInput,
    dismissError,
  } = useLanyardEditForm(id, showSystemAssets.checked, close);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Edit Lanyard</H2>
        <Button onClick={() => close()}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Input label="Description" disabled={isPending} {...descriptionInput} />
      <Filters {...cardList.filterControls} />
      <CardGrid
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
        items={cardList.items}
        selected={cardList.selected}
        selectItem={cardList.selectItem}
        deselectItem={cardList.deselectItem}
      />
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
