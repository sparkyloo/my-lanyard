import { Switch, Route } from "react-router-dom";
import { TopBar } from "./components/TopBar";

function App() {
  return (
    <>
      <TopBar />
      <div className="AppContent">
        <Switch>
          <Route exact path="/">
            home
          </Route>
          <Route path="/login">login</Route>
          <Route path="/signup">signup</Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
