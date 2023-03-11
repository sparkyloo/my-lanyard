import { Switch, Route } from "react-router-dom";
import { FlexCol } from "./components/FlexCol";
import { TopBar } from "./components/TopBar";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";

function App() {
  return (
    <>
      <TopBar />
      <FlexCol margin={{ top: 2 }}>
        <Switch>
          <Route exact path="/">
            home
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignupPage />
          </Route>
        </Switch>
      </FlexCol>
    </>
  );
}

export default App;
