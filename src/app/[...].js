import React, { useEffect } from "react";
import { Router } from "@reach/router";
import PrivateRoute from "../components/privateRoute";
import { navigate } from "gatsby";
import Profile from "../pages/profile";


const BounceToHome = () => {
  useEffect(() => {
    navigate("/", { replace: true });
  }, []);
  return null;
};


const App = () => {
  return (
    <Router basepath="/app">
      <BounceToHome default />
      <PrivateRoute path="/profile" component={Profile} />
    </Router>
  )
}
export default App
