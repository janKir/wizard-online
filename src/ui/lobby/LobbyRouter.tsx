import React, { useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { CreateGame } from "./CreateGame";
import { GameContainer } from "./GameContainer";
import { useProfileHeaderElement } from "../hooks/profile-header-element";
import { ListGames } from "./ListGames";
import { useFeedbackHeaderElement } from "../hooks/feedback-header-element";
import { pageview } from "../../analytics";

export const LobbyRouter: React.FC = () => {
  useProfileHeaderElement();
  useFeedbackHeaderElement();

  const history = useHistory();
  useEffect(() => {
    const unlisten = history.listen(pageview);
    return () => unlisten();
  }, [history]);

  return (
    <Switch>
      <Route exact path="/">
        <CreateGame />
      </Route>
      <Route exact path="/games">
        <ListGames />
      </Route>
      <Route path="/games/:gameID">
        <GameContainer />
      </Route>
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};
