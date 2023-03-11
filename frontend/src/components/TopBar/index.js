import "./TopBar.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { prepareStyles } from "../../css/classname";
import { Button } from "../Button";
import { Span } from "../Text";
import { selectSession } from "../../store/selectors";

export function TopBar() {
  const dispatch = useDispatch();
  const session = useSelector(selectSession);
  const history = useHistory();
  const isLoginOrSignup = useRouteMatch(["/login", "/signup"]);

  return (
    <div
      {...prepareStyles({
        display: "flex",
        align: "center",
        height: 4,
        padding: {
          x: 1,
        },
        border: {
          color: "light",
          bottom: 1,
        },
      })}
    >
      <div
        {...prepareStyles({
          display: "flex",
          flex: 1,
          gap: 1,
        })}
      >
        {!!session && (
          <>
            <Button>Cards</Button>
            <Button>Lanyards</Button>
          </>
        )}
      </div>
      <div
        {...prepareStyles({
          display: "flex",
          reverse: true,
          flex: 1,
          gap: 1,
        })}
      >
        {!isLoginOrSignup && (
          <>
            {session ? (
              <Button>Menu</Button>
            ) : (
              <Button onClick={() => history.push("/login")}>Login</Button>
            )}
            {!!session && <Span>Hi {session.firstName}</Span>}
          </>
        )}
      </div>
    </div>
  );
}
