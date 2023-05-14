import "./Cards.css";
import {
  useCardList,
  useCardCreationForm,
  useCardEditForm,
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
import { IconGrid } from "../Icons";
import { EditTagging } from "../Tags";

export function CardsPage({ showSystemAssets }) {
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
  } = useCardList(showSystemAssets.checked);

  const { session } = useSession();

  return (
    <PageContent>
      <TopBar showSystemAssets={showSystemAssets}>
        <Filters {...filterControls} />
        <FlexRow gap={1}>
          {!!session && <Button onClick={newFlow.toggle}>Create New</Button>}
          <InfoModal flow={infoFlow}>
            {!!session ? (
              <P>
                This page is where you can view all the available tags. You can
                create new tags and edit the name of your existing tags.
              </P>
            ) : (
              <P>This page is where you can view all the premade cards.</P>
            )}
          </InfoModal>
        </FlexRow>
      </TopBar>
      <CardGrid
        allowEdits
        allowTagging
        items={items}
        selected={selected}
        selectItem={selectItem}
        deselectItem={deselectItem}
        selectItemForEdit={selectItemForEdit}
      />
      <Modal {...newFlow}>
        <CreateNewCard
          modalState={newFlow}
          showSystemAssets={showSystemAssets}
        />
      </Modal>
      <Modal {...editFlow}>
        <EditCard
          id={selectedForEdit}
          modalState={editFlow}
          showSystemAssets={showSystemAssets}
          authorId={selectedItemAuthorId}
        />
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
  allowEdits,
  allowTagging,
  ...props
}) {
  const { session } = useSession();

  allowEdits = !!session && !!allowEdits;
  allowTagging = !!session && !!allowTagging;

  return (
    <Grid col={col} colGap={colGap} rowGap={rowGap} {...props}>
      {items.map(({ id, text, icon }) => {
        const isSelected = selected.includes(`${id}`);

        return (
          <Button
            key={id}
            rounded
            noMouseEvents={!session}
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
              rounded
              width="full"
              bg="clear"
              padding={{
                x: 0.5,
                y: 0.5,
              }}
            >
              {text}
            </P>
          </Button>
        );
      })}
    </Grid>
  );
}

function CreateNewCard({ showSystemAssets, modalState }) {
  const {
    tagList,
    iconList,
    errorList,
    isPending,
    submitButton,
    textInput,
    dismissError,
  } = useCardCreationForm(showSystemAssets.checked, modalState);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Create Card</H2>
        <Button onClick={modalState.toggle}>Close</Button>
      </FlexRow>
      <Input label="Text" disabled={isPending} {...textInput} />
      <Filters {...iconList.filterControls} />
      <IconGrid
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
        items={iconList.items}
        selected={iconList.selected}
        selectItem={iconList.selectItem}
        deselectItem={iconList.deselectItem}
      />
      <EditTagging tagList={tagList} />
      <Button {...submitButton} disabled={isPending}>
        Save
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}

function EditCard({ id, authorId, showSystemAssets, modalState }) {
  const {
    tagList,
    iconList,
    errorList,
    isPending,
    saveButton,
    deleteButton,
    textInput,
    dismissError,
  } = useCardEditForm(id, showSystemAssets.checked, modalState);

  const { session } = useSession();

  const isMine = session?.id === authorId;
  const closeButton = <Button onClick={modalState.toggle}>Close</Button>;

  return (
    <FlexCol minWidth={40} gap={2}>
      {!!isMine && (
        <>
          <FlexRow justify="between">
            <H2>Edit Card</H2>
            <Button onClick={modalState.toggle}>Close</Button>
          </FlexRow>
          <Input label="Text" disabled={isPending} {...textInput} />
          <ErrorList errors={errorList} dismissError={dismissError} />
          <Filters {...iconList.filterControls} />
          <IconGrid
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
            items={iconList.items}
            selected={iconList.selected}
            selectItem={iconList.selectItem}
            deselectItem={iconList.deselectItem}
          />
        </>
      )}
      <EditTagging
        tagList={tagList}
        closeButton={!!isMine ? null : closeButton}
      />
      <FlexRow gap={2}>
        <Button flex={1} {...saveButton} disabled={isPending}>
          Save
        </Button>
        {!!isMine && (
          <Button flex={1} {...deleteButton} disabled={isPending}>
            Delete
          </Button>
        )}
      </FlexRow>
    </FlexCol>
  );
}
