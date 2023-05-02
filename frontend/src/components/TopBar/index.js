import "./TopBar.css";
import { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSession } from "../../state";
import { FlexRow } from "../FlexRow";
import { FlexCol } from "../FlexCol";
import { Checkbox } from "../Checkbox";
import { Span } from "../Text";
import { Button } from "../Button";
import { Tabs } from "../Tabs";
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
            options={TAB_OPTIONS}
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
              show system assets
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

export function Filters({ tags, tagSelect, searchInput, searchButton }) {
  return (
    <FlexRow gap={0.5}>
      <Button {...searchButton}>Search</Button>
      <Input placeholder="By name" {...searchInput} />
      <DropDown
        options={tags}
        placeholder="all tags"
        width={12}
        {...tagSelect}
      />
    </FlexRow>
  );
}
