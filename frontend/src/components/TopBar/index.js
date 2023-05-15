import "./TopBar.css";
import { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSession } from "../../state";
import { FlexRow } from "../FlexRow";
import { FlexCol } from "../FlexCol";
import { Checkbox } from "../Checkbox";
import { Span, H2 } from "../Text";
import { Button } from "../Button";
import { Tabs } from "../Tabs";
import { Modal } from "../Modal";
import { Input } from "../../components/Input";
import { DropDown } from "../../components/DropDown";

const TAB_OPTIONS = [
  {
    label: "Lanyards",
    value: "/lanyards",
  },
  {
    label: "Cards",
    value: "/cards",
  },
  {
    label: "Icons",
    value: "/icons",
  },
  {
    label: "Tags",
    value: "/tags",
  },
];

export function TopBar({ showSystemAssets, children }) {
  const history = useHistory();
  const location = useLocation();
  const { session, doLogout, doLoginAsDemo } = useSession();

  const isLoginOrSignup = useMemo(() => {
    return ["/login", "/signup"].includes(location.pathname);
  }, [location.pathname]);

  const hasChildren = useMemo(() => {
    if (!children || (Array.isArray(children) && !children.length)) {
      return false;
    }

    return true;
  }, [children]);

  const tabOptions = useMemo(() => {
    if (session) {
      return TAB_OPTIONS;
    } else {
      return TAB_OPTIONS.slice(0, -1);
    }
  }, [session]);

  return (
    <FlexCol
      position="sticky"
      top={0}
      width="full"
      bg="white"
      margin={{ bottom: 2 }}
      className="TopBarContainer"
    >
      <FlexRow
        padding={{
          x: 1,
        }}
        border={{
          color: "light",
          bottom: 1,
        }}
      >
        <FlexRow flex={2} gap={2}>
          <FlexCol shrink={0} justify="center">
            <Button
              variant="icon"
              width={4}
              height={4}
              onClick={() => history.push("/")}
            >
              <img src="/lanyard.png" className="Logo" />
            </Button>
          </FlexCol>
          <Tabs
            options={tabOptions}
            selected={location.pathname}
            onChange={(selected) => {
              history.push(selected);
            }}
          />
          {!!session && !!showSystemAssets && session.id !== -1 && (
            <Checkbox
              align="center"
              checked={showSystemAssets.checked}
              onChange={showSystemAssets.onChange}
            >
              show premade items
            </Checkbox>
          )}
        </FlexRow>
        <FlexRow
          reverse
          align="center"
          flex={1}
          gap={1}
          padding={{
            y: 0.5,
          }}
        >
          {isLoginOrSignup ? (
            <Button onClick={() => history.push("/")}>Home</Button>
          ) : session ? (
            <>
              <Button onClick={doLogout}>Logout</Button>
              <Span>Hi {session.firstName}</Span>
            </>
          ) : (
            <>
              <Button onClick={doLoginAsDemo}>Enter Demo</Button>
              <Button onClick={() => history.push("/login")}>Login</Button>
            </>
          )}
        </FlexRow>
      </FlexRow>
      {!!hasChildren && (
        <FlexRow
          gap={1}
          justify="between"
          align="center"
          padding={{
            x: 1,
            y: 0.5,
          }}
          border={{
            color: "light",
            bottom: 1,
          }}
        >
          {children}
        </FlexRow>
      )}
    </FlexCol>
  );
}

export function Filters({
  hideTagSelect,
  tags,
  sortedTags,
  tagSelect,
  searchInput,
  searchButton,
}) {
  const tagOptions = useMemo(() => {
    const { mine, system } = sortedTags;

    if (!mine.length) {
      return system;
    }

    if (!system.length) {
      return mine;
    }

    return [
      ["Personal", mine],
      ["Premade", system],
    ];
  }, [sortedTags]);

  return (
    <FlexRow gap={0.5} align="center">
      <Button {...searchButton}>Search</Button>
      <Input placeholder="By name" {...searchInput} />
      {!hideTagSelect && (
        <DropDown
          options={tagOptions}
          placeholder="all tags"
          width={12}
          {...tagSelect}
        />
      )}
    </FlexRow>
  );
}

export function InfoModal({ children, flow }) {
  return (
    <>
      <Button variant="secondary" onClick={flow.toggle}>
        ?
      </Button>
      <Modal {...flow}>
        <FlexCol minWidth={40} maxWidth={40} gap={2}>
          <FlexRow justify="between">
            <H2>Help</H2>
            <Button onClick={flow.toggle}>Close</Button>
          </FlexRow>
          {children}
        </FlexCol>
      </Modal>
    </>
  );
}
