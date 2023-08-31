import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch,Redirect } from "react-router-dom";


import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Group from "./components/Group";
import Event from "./components/Event";
import GroupInfoPage from "./components/Group/GroupInfoPage/GroupInfoPage";
import CreateGroupForm from "./components/Group/GroupForm/CreateGroupForm";
import EditGroupForm from "./components/Group/GroupForm/EditGroupForm";
import EventDetail from "./components/Event/EventDetail/EventDetail";
import CreateEventForm from './components/Event/EventForm/CreateEventForm'
import PageNotFound from "./components/PageNotFound/PageNotFound";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path="/"><Home /></Route>
        <Route exact path="/groups"><Group /></Route>
        <Route exact path="/groups/new"><CreateGroupForm /></Route>
        <Route exact path="/groups/:groupId/edit"><EditGroupForm /></Route>
        <Route exact path="/groups/:groupId"><GroupInfoPage /></Route>
        <Route exact path="/events"><Event /></Route>
        <Route exact path="/groups/:groupId/events/new"><CreateEventForm /></Route>
        <Route exact path="/events/:eventId"><EventDetail /></Route>
        <Route exact path='404'>
          <PageNotFound />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
        
      </Switch>}
    </>
  );
}

export default App;