import React, { Fragment, useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Button } from "reactstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//components

import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Login from "./components/Login";
import SignUp from "./pages/SignUp";
import Homepage from "./components/Landing";
import Room from "./components/Room";

toast.configure();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch("http://704d-171-96-72-139.ngrok.io/auth/verify", {
        method: "GET",
        headers: { jwt_token: localStorage.token },
      });

      const parseResponse = await response.json();

      parseResponse === true
        ? setIsAuthenticated(true)
        : setIsAuthenticated(false);

      // console.log(parseResponse);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  });

  return (
    <Fragment>
      <Router>
        <div>
          <Navbar setAuth={setAuth} isAutheticated={isAuthenticated} />
          {/* <Switch>
            <Route path="/" exact component={CreateRoom} />
           
          </Switch> */}
          <Switch>
          <Route
            exact
            path="/"
            render={(props) =>
              !isAuthenticated ? (
                <Homepage {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/home" />
              )
            }
          />
          <Route
            exact
            path="/signup"
            render={(props) =>
              !isAuthenticated ? (
                <SignUp {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route
            exact
            path="/home"
            render={(props) =>
              isAuthenticated ? (
                <Home {...props} setAuth={setAuth} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
		   <Route path="/room/:roomID" component={Room} />
        </Switch>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;

/* <div className="App">
			<div className="topRow">
				<header className="App-header">
					<nav className="navigation">
						<a href="/" aria-label="Home">
							Socialite
						</a>
					</nav>
					<button id="logInButton" onClick = {do_something}>
						Log In
					</button>
					<button id="singUpButton" onClick = {do_something}>
						Sign Up
					</button>
					<button id="logOutButton" onClick = {do_something}>
						Log Out
					</button>
				</header>
			</div>
		</div> */
