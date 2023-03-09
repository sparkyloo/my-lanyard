import "./TopBar.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button } from "../Button";
import { selectSession } from "../../store/selectors";

export function TopBar() {
  const dispatch = useDispatch();
  const session = useSelector(selectSession);
  const history = useHistory();
  const isLoginOrSignup = useRouteMatch(["/login", "/signup"]);

  return (
    <div className="TopBar">
      <div className="TopBar--left">
        {!!session && (
          <>
            <Button label="Cards" />
            <Button label="Lanyards" />
          </>
        )}
      </div>
      <div className="TopBar--right">
        {!isLoginOrSignup && (
          <>
            {session ? (
              <Button label="Menu" />
            ) : (
              <Button label="Login" onClick={() => history.push("/login")} />
            )}
            {!!session && <span>Hi {session.firstName}</span>}
          </>
        )}
      </div>
    </div>
  );
}
