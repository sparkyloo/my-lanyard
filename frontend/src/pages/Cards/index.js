import "./Cards.css";
import { useDispatch, useSelector } from "react-redux";
import {
  useCardList,
  useCardCreationForm,
  useCardEditForm,
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
import { IconGrid } from "../Icons";

export function CardsPage({ showSystemAssets }) {
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
  } = useCardList(showSystemAssets.checked);

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
      <CardGrid
        allowEdits
        items={items}
        selected={selected}
        selectItem={selectItem}
        deselectItem={deselectItem}
        selectItemForEdit={selectItemForEdit}
      />
      <Modal {...newFlow}>
        {!!newFlow.show && (
          <CreateNewCard
            close={newFlow.toggle}
            showSystemAssets={showSystemAssets}
          />
        )}
      </Modal>
      <Modal {...editFlow}>
        {!!selectedForEdit && (
          <EditCard
            id={selectedForEdit}
            close={editFlow.toggle}
            showSystemAssets={showSystemAssets}
          />
        )}
      </Modal>
    </FlexCol>
  );
}

export function CardGrid({
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
            <Image
              key={name}
              alt={name}
              src={icon.imageUrl}
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

function CreateNewCard({ showSystemAssets, close }) {
  const {
    iconList,
    errorList,
    isPending,
    submitButton,
    textInput,
    dismissError,
  } = useCardCreationForm(showSystemAssets.checked, close);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Create Card</H2>
        <Button onClick={close}>Close</Button>
      </FlexRow>
      <Input label="Text" disabled={isPending} {...textInput} />
      <Filters {...iconList.filterControls} />
      <IconGrid
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
        items={iconList.items}
        selected={iconList.selected}
        selectItem={iconList.selectItem}
        deselectItem={iconList.deselectItem}
      />
      <Button {...submitButton} disabled={isPending}>
        Save
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}

function EditCard({ id, showSystemAssets, close }) {
  const {
    iconList,
    errorList,
    isPending,
    saveButton,
    deleteButton,
    textInput,
    dismissError,
  } = useCardEditForm(id, showSystemAssets.checked, close);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Edit Card</H2>
        <Button onClick={() => close()}>Close</Button>
      </FlexRow>
      <Input label="Text" disabled={isPending} {...textInput} />
      <Filters {...iconList.filterControls} />
      <IconGrid
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
        items={iconList.items}
        selected={iconList.selected}
        selectItem={iconList.selectItem}
        deselectItem={iconList.deselectItem}
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
