import React, { useEffect } from "react";
import { navigate } from "gatsby";

import { Router } from "@reach/router";

import PrivateRoute from "../components/privateRoute";
import Profile from "../components/profile/profile.tsx";


const BounceToHome = () => {
  useEffect(() => {
    navigate("/", { replace: true });
  }, []);
  return null;
};

const App = () => {
  return (
    <Router basepath="/app">
      <PrivateRoute path="/profile" component={Profile} />
      <BounceToHome default />
    </Router>
  );
};

export default App;
