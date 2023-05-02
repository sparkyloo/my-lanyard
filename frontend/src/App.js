import { Switch, Route } from "react-router-dom";
import { useAppState } from "./state";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { SignupPage } from "./pages/Signup";
import { NotFound } from "./pages/NotFound";
import { IconsPage } from "./pages/Icons";
import { CardsPage } from "./pages/Cards";
import { LanyardsPage } from "./pages/Lanyards";
import { TagsPage } from "./pages/Tags";

function App() {
  const { appReady, showSystemAssets } = useAppState();

  return !appReady ? null : (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/lanyards">
        <LanyardsPage showSystemAssets={showSystemAssets} />
      </Route>
      <Route path="/cards">
        <CardsPage showSystemAssets={showSystemAssets} />
      </Route>
      <Route path="/icons">
        <IconsPage showSystemAssets={showSystemAssets} />
      </Route>
      <Route path="/tags">
        <TagsPage showSystemAssets={showSystemAssets} />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/signup">
        <SignupPage />
      </Route>
      <Route path="/*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default App;
