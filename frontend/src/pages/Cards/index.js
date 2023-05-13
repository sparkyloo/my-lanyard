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
import { H2, P } from "../../components/Text";
import { ErrorList } from "../../components/ErrorList";
import { PageContent } from "../../components/PageContent";
import { IconGrid } from "../Icons";
import { EditTagging } from "../Tags";

export function CardsPage({ showSystemAssets }) {
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
  } = useCardList(showSystemAssets.checked);

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
      <CardGrid
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
      <Modal {...taggingFlow}>
        {!!taggingFlow.show && (
          <EditTagging
            kind="cards"
            id={selectedForTagging}
            close={taggingFlow.toggle}
          />
        )}
      </Modal>
    </PageContent>
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
      {items.map(({ id, authorId, text, icon }) => {
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
              key={text}
              alt={text}
              src={icon.imageUrl}
              width={12}
              height={12}
              border={{
                bottom: 1,
                color: "light",
              }}
            />
            <P
              key={text}
              rounded
              width="full"
              bg="white"
              padding={{
                x: 0.5,
                y: 0.5,
              }}
            >
              {text}
            </P>
            <FlexCol
              gap={0.25}
              padding={{
                bottom: 0.25,
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
