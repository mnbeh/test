import React, { useContext } from "react";
import { Switch, Route, Redirect, NavLink } from "react-router-dom";
import { Button, Nav, Navbar } from "react-bootstrap";
import Auth from "../Auth/Auth";
import styles from "./App.module.scss";
import UserList from "../UserList/UserList";
import UserCreation from "../UserCreation/UserCreation";
import AuthContext from "../../context/AuthContext";
import useAuth from "../../hooks/useAuth";

function App() {
  const { token, logout, login } = useAuth();
  const routes = useRoutes(token);
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {routes}
    </AuthContext.Provider>
  );
}

function useRoutes(token) {
  // fix token logic
  if (!token) {
    return (
      <Switch>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <div className={styles.user_list_container}>
      <Navigation />
      <Switch>
        <Route path="/userlist">
          <UserList />
        </Route>
        <Route path="/usercreation">
          <UserCreation />
        </Route>
        <Redirect to="/userlist" />
        {/* Fix redirect */}
      </Switch>
    </div>
  );
}

function Navigation() {
  const auth = useContext(AuthContext);
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/userlist">
            Userlist
          </Nav.Link>
          <Nav.Link as={NavLink} to="/usercreation">
            Create/Modify user
          </Nav.Link>
        </Nav>
        <Button variant="outline-light" onClick={auth.logout}>
          Log out
        </Button>
      </Navbar>
      <br />
    </>
  );
}

export default App;
